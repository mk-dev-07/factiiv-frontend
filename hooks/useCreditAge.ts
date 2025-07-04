import { useMemo, useState } from "react";
import { CreditAgeTableData } from "../types/score-details.interface";
import {
	isAfter,
	isValid,
	millisecondsToMinutes,
	minutesToHours,
} from "date-fns";
import { Trade } from "../types/trade.interface";
import { useFactiivStore } from "../store";
import { dateToString } from "../utils/date.utils";

export const useCreditAge = (trades: Trade[]) => {
	const { activeProfile } = useFactiivStore();
	// const [averageTradeSuffix, setAverageTradeSuffix] = useState("");
	// const [averageTradeAgeNumber, setAverageTradeAgeNumber] = useState();

	return useMemo((): {
		tradesAgeData: CreditAgeTableData[];
		averageAgeNumber: number;
		averageAgeSuffix: string;
		averageTradeAge: string;
	} => {
		const tradesAgeData = trades
			.filter((trade) => trade?.adminStatus?.toLowerCase() === "accepted")
			.reduce(
				(
					acc,
					{
						fromProfileId,
						fromCompanyName,
						toCompanyName,
						relationshipDate: tradeCreationDate,
						id: tradeIdentifier,
						amount,
						balance,
						relationDescription,
					}
				) => {
					const isFromMe = fromProfileId === activeProfile.id;
					const tradeCloseDate = null;
					const tradeAgeRowData = {
						connection: isFromMe ? toCompanyName : fromCompanyName,
						type: relationDescription,
						openDate: dateToString(new Date(tradeCreationDate), {}),
						closeDate: tradeCloseDate ?? "N/A",
						view: `/trade-details/${tradeIdentifier}`,
						id: tradeIdentifier,
					} as CreditAgeTableData;

					return [...acc, tradeAgeRowData];
				},
				[] as CreditAgeTableData[]
			);

		// TODO: Add close date for trades

		if (!tradesAgeData || tradesAgeData.length === 0) {
			return {
				tradesAgeData,
				averageAgeNumber: 0,
				averageAgeSuffix: "days",
				averageTradeAge: "0 days",
			};
		}

		let validTradeAgeNumber = 0;
		let timeAmount = tradesAgeData?.reduce((acc, { openDate, closeDate }) => {
			const closeTimeDate = new Date(closeDate);
			const openTimeDate = new Date(openDate);

			if (
				isValid(openDate) &&
				isAfter(openTimeDate, new Date(Date.now()))
			) {
				return acc;
			}

			if (
				isValid(closeTimeDate) &&
				isAfter(closeTimeDate, new Date(Date.now()))
			) {
				return acc;
			}

			let closeTimeMs = closeTimeDate?.getTime();
			if (isNaN(closeTimeMs)) {
				closeTimeMs = Date.now();
			}

			validTradeAgeNumber += 1;
			return acc + (closeTimeMs - openTimeDate.getTime());
		}, 0);

		if(timeAmount < 0){
			timeAmount = 0;
		}
		const averageTimeAmount = timeAmount / (validTradeAgeNumber || 1);
		const ageInMinutes = millisecondsToMinutes(averageTimeAmount);
		const ageInHours = minutesToHours(ageInMinutes);
		const ageInDays = ageInHours / 24;
		const ageInMonths = ageInDays / 30;

		if (ageInDays < 1) {
			const averageAgeNumber = parseInt(ageInHours + "");
			// const averageTradeAge =  + " " + averageAgeSuffix;
			return {
				tradesAgeData,
				averageAgeNumber,
				averageAgeSuffix: "hours",
				averageTradeAge: averageAgeNumber + " hours",
			};
		}
		if (ageInDays >= 1 && ageInMonths < 1) {
			const averageAgeNumber = parseInt(ageInHours / 24 + "");
			// const averageTradeAge =  + " " + averageAgeSuffix;
			return {
				tradesAgeData,
				averageAgeNumber,
				averageAgeSuffix: "days",
				averageTradeAge: averageAgeNumber + " days",
			};
		}

		const ageInYears = averageTimeAmount / (1000 * 60 * 60 * 24 * 365);

		if (ageInMonths >= 1 && ageInYears < 1) {
			const averageAgeNumber = parseInt(ageInDays / 30 + "");

			return {
				tradesAgeData,
				averageAgeNumber,
				averageAgeSuffix: "months",
				averageTradeAge: averageAgeNumber + " months",
			};
		}

		const averageAgeNumber = parseInt(ageInMonths / 12 + "");
		return {
			tradesAgeData,
			averageAgeNumber,
			averageAgeSuffix: "years",
			averageTradeAge: averageAgeNumber + " years",
		};
	}, [trades]);
};
