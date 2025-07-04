import { isAfter, isBefore, isValid, subDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";

const DaysLateBuckets = ({
	tradeDate,
	onChange,
}: {
	tradeDate?: string;
	onChange: (value: number) => void;
}) => {
	const [selectedItem, setSelectedItem] = useState<{
		daysLateValue: number;
		label: string;
	}>({ daysLateValue: 0, label: "on-time" });

	const [tradeCreationDate, setTradeCreationDate] = useState<
		Date | undefined
	>();

	useEffect(() => {
		if (!tradeDate) return;

		if (!isValid(new Date(tradeDate))) return;

		setTradeCreationDate(new Date(tradeDate));
	}, []);

	const data: {
		daysLateValue: number;
		label: string;
		isEnabled: boolean;
	}[] = useMemo(() => {
		const isBefore31PlusDays = tradeCreationDate
			? isBefore(tradeCreationDate, subDays(new Date(), 31))
			: false;
		const isBefore61PlusDays = tradeCreationDate
			? isBefore(tradeCreationDate, subDays(new Date(), 61))
			: false;
		const isBefore91PlusDays = tradeCreationDate
			? isBefore(tradeCreationDate, subDays(new Date(), 91))
			: false;

		return [
			{ daysLateValue: 0, label: "on-time", isEnabled: true },
			{ daysLateValue: 31, label: "30+", isEnabled: isBefore31PlusDays },
			{ daysLateValue: 61, label: "60+", isEnabled: isBefore61PlusDays },
			{ daysLateValue: 91, label: "90+", isEnabled: isBefore91PlusDays },
		];
	}, [tradeCreationDate]);

	return (
		<span id="control" className="w-full flex">
			{data.map((item, index, arr) => {
				const { daysLateValue, label, isEnabled } = item;
				const isFirst = index === 0;
				const isLast = index === arr.length - 1;

				return (
					<button
						disabled={!isEnabled}
						key={`days-late-${daysLateValue}-${index}`}
						id={`days-late-${daysLateValue}`}
						onClick={() => {
							setSelectedItem(item);
							onChange?.(daysLateValue);
						}}
						type="button"
						className={`border-onyx relative inline-block items-center text-center border-2 px-4 text-sm font-medium focus:z-10 focus:outline-none w-32 py-2 ${
							isFirst ? "rounded-l" : ""
						}${isLast ? "rounded-r" : ""} ${index > 0 ? "-ml-px" : ""}
           ${
					selectedItem.daysLateValue === daysLateValue
						? "bg-topaz text-white"
						: "text-onyx bg-white hover:bg-gray-50"
					}
					${isEnabled ? "" : "opacity-50 cursor-not-allowed"}`}
					>
						{label}
					</button>
				);
			})}
		</span>
	);
};

export default DaysLateBuckets;
