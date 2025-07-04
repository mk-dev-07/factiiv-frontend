import { useMemo } from "react";
import { Trade } from "../types/trade.interface";
import { useFactiivStore } from "../store";
import { TradeRole } from "../constants/trade.enum";
import { dateToString } from "../utils/date.utils";
import {
	CreditAgeTableData,
	TotalCreditUtilizationData,
} from "../types/score-details.interface";

export const useCreditUtilization = (
	trades: Trade[]
): {
	// tradesAgeData: CreditAgeTableData[];
	totalCreditUtilizationData: TotalCreditUtilizationData[];
} => {
	const { activeProfile } = useFactiivStore();

	return (
		useMemo(() => {
			if (!trades)
				return {
					// tradesAgeData: [],
					totalCreditUtilizationData: [],
				};

			return (
				trades
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

							const usagePercentage =
								(parseFloat(balance) / parseFloat(amount)) * 100;

							const creditUtilizationRowData = {
								connection: isFromMe ? toCompanyName : fromCompanyName,
								type: relationDescription,
								id: tradeIdentifier,
								amount,
								balance: parseInt(balance).toFixed(0),
								usage: usagePercentage ?? 0,
								view: `/trade-details/${tradeIdentifier}`,
							} as TotalCreditUtilizationData;

							return {
								totalCreditUtilizationData: [
									...(acc?.totalCreditUtilizationData ?? []),
									creditUtilizationRowData,
								] as TotalCreditUtilizationData[],
							};
						},
						{} as {
							totalCreditUtilizationData: TotalCreditUtilizationData[];
						}
					)
			);
		}, [
			trades.reduce(
				(acc, { id, adminStatus }) => `${acc}|${id}:${adminStatus}|`,
				""
			),
			activeProfile,
		]) ?? {
			// tradesAgeData: [],
			totalCreditUtilizationData: [],
		}
	);
};
