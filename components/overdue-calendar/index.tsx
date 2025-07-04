import { ReactElement, ReactNode, useEffect, useMemo, useState } from "react";
import { Activity, Trade } from "../../types/trade.interface";
import { ActivityType } from "../../constants/trade.enum";

const NotApplicableSvg = ({ larger = false }: { larger?: boolean }) => (
	<div
		className={`${
			larger ? "h-8 w-8" : "h-6 w-6"
		} bg-onyx border-2 border-onyx rounded flex items-center justify-center`}
	>
		<svg
			className="h-5 w-5 text-gray-300"
			viewBox="0 0 24 24"
			strokeWidth="2"
			stroke="currentColor"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="9" vectorEffect="non-scaling-stroke"></circle>
			<line
				x1="9"
				y1="12"
				x2="15"
				y2="12"
				vectorEffect="non-scaling-stroke"
			></line>
		</svg>
	</div>
);
const OnTimeSvg = ({ larger = false }: { larger?: boolean }) => (
	<div
		className={`${
			larger ? "h-8 w-8" : "h-6 w-6"
		} bg-green-400 text-white border-2 border-onyx rounded flex items-center justify-center`}
	>
		<svg
			className="h-4 w-4"
			viewBox="0 0 24 24"
			strokeWidth="2"
			stroke="#000000"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M5 12l5 5l10 -10" vectorEffect="non-scaling-stroke"></path>
		</svg>
	</div>
);
const Late30Days = ({ larger = false }: { larger?: boolean }) => {
	return (
		<div
			className={`${
				larger ? "h-8 w-8" : "h-6 w-6"
			} bg-yellow-300 font-bold text-onyx border-2 border-onyx rounded flex items-center justify-center`}
		>
			30
		</div>
	);
};
const Late60Days = ({ larger = false }: { larger?: boolean }) => {
	return (
		<div
			className={`${
				larger ? "h-8 w-8" : "h-6 w-6"
			} bg-orange-300 font-bold text-onyx border-2 border-onyx rounded flex items-center justify-center`}
		>
			60
		</div>
	);
};
const Late90Days = ({ larger = false }: { larger?: boolean }) => {
	return (
		<div
			className={`${
				larger ? "h-8 w-8" : "h-6 w-6"
			} bg-red-400 font-bold text-onyx border-2 border-onyx rounded flex items-center justify-center`}
		>
			90
		</div>
	);
};

interface OverdueCalendarProps {
	trade: Trade;
}
const OverdueCalendar = ({ trade }: OverdueCalendarProps) => {
	const [tradeYear, setTradeYear] = useState<number>(new Date().getFullYear());
	// const [activityYear, setActivityYear] = useState<number>(new Date().getFullYear());
	const [activities, setActivities] = useState<Activity[]>();
	const [months] = useState<string[]>([
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	]);

	const yearsToShow: number[] = useMemo(() => {
		const currentYear = new Date().getFullYear();

		if (!trade || !activities) return [currentYear];

		const { relationshipDate } = trade;
		const tradeYear = new Date(relationshipDate).getFullYear();
		// activities are sorted by date
		const latestActivity = activities?.at?.(-1)?.activityDate;
		if (!latestActivity) return [currentYear];
		const activityYear = new Date(latestActivity).getFullYear();

		const isTradeInPast = activityYear > tradeYear;
		const yearsLength = isTradeInPast
			? activityYear - tradeYear + 1
			: tradeYear - activityYear + 1;

		const years = Array(yearsLength)
			.fill(null)
			.map((year, index) =>
				isTradeInPast ? activityYear - index : tradeYear - index
			);
		return years;
	}, [trade, activities]);

	const activityData = useMemo(() => {
		const { activities } = trade;
		return activities
			.filter(activity => activity?.adminStatus?.toLowerCase?.() === "accepted")
			.filter(
				(activity) =>
					activity.activityType === ActivityType.PAYMENT ||
					activity.activityType === ActivityType.CHARGE
			)
			.reduce((acc, { activityDate, daysLate }) => {
				const date = new Date(activityDate);
				const activityYear = date.getFullYear();
				const monthIndex = date.getMonth();
				const monthKey = months[monthIndex];
				let daysLateIndicator = "n/a";
				if (daysLate < 30) daysLateIndicator = "on-time";
				if (daysLate > 30) daysLateIndicator = "30";
				if (daysLate > 60) daysLateIndicator = "60";
				if (daysLate > 90) daysLateIndicator = "90";
				// we override it because we always want the latest activity status for the month
				return {
					...acc,
					[activityYear]: {
						...acc["" + activityYear],
						[monthKey]: daysLateIndicator,
					},
				};
			}, {} as { [year: string]: { [month: string]: string } });
	}, [activities]);

	useEffect(() => {
		const { relationshipDate, activities } = trade;
		const sortedActivities = activities
			// sort activities by date
			.sort(
				({ activityDate: a }, { activityDate: b }) =>
					new Date(a).getTime() - new Date(b).getTime()
			);
		setActivities(sortedActivities);
	}, [trade]);

	return (
		<div className="border-2 border-onyx bg-pearl rounded-md overflow-hidden relative text-onyx p-4 mb-4">
			<div className="flex divide-x-2 divide-onyx">
				<div className="flex-none w-32 text-xs space-y-3">
					<div className="flex space-x-2 items-center">
						<NotApplicableSvg></NotApplicableSvg>
						<span>n/a</span>
					</div>

					<div className="flex space-x-2 items-center">
						<OnTimeSvg></OnTimeSvg>
						<span>on-time</span>
					</div>

					<div className="flex space-x-2 items-center">
						<Late30Days></Late30Days>
						<span>30 days late</span>
					</div>

					<div className="flex space-x-2 items-center">
						<Late60Days></Late60Days>
						<span>60 days late</span>
					</div>

					<div className="flex space-x-2 items-center">
						<Late90Days></Late90Days>
						<span>90 days late</span>
					</div>
				</div>
				<div className="flex-1 px-4 space-y-4">
					<div>
						{/* <pre>{JSON.stringify(activityData)}</pre> */}
						{yearsToShow.map((year) => {
							return (
								<div key={year}>
									<h3 className="font-medium">{year}</h3>
									<div className="grid grid-cols-4 sm:grid-cols-6 xl:grid-cols-12 text-sm gap-y-2">
										{months.map((month) => {
											const indicator = activityData?.[year]?.[month];
											return (
												<div key={month} className="flex-col flex items-center">
													<p className="text-center">{month}</p>
													{(!indicator || indicator === "n/a") && (
														<NotApplicableSvg larger={true}></NotApplicableSvg>
													)}
													{indicator === "on-time" && (
														<OnTimeSvg larger={true}></OnTimeSvg>
													)}
													{indicator === "30" && (
														<Late30Days larger={true}></Late30Days>
													)}
													{indicator === "60" && (
														<Late60Days larger={true}></Late60Days>
													)}
													{indicator === "90" && (
														<Late90Days larger={true}></Late90Days>
													)}
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverdueCalendar;
