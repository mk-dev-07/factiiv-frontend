import { useMemo, useState } from "react";
import { Activity, Trade } from "../types/trade.interface";
import { ActivityType } from "../constants/trade.enum";
import { useFactiivStore } from "../store";
import { dateToString } from "../utils/date.utils";
import { PaymentHistoryTableData } from "../types/score-details.interface";
import { daysLateLabel } from "../utils/data.utils";

export const usePaymentHistory = (
	trades: Trade[],
	filter: (activity: Activity) => boolean = () => true
) => {
	const store = useFactiivStore();
	const { activeProfile } = store;

	const [numberOfLatePayments, setNumberOfLatePayments] = useState(0);

	const activitiesData =
		useMemo(() => {
			if (!trades) return [];

			return trades.reduce((acc, trade) => {
				// reduce trades into activity table row items
				return [
					...acc,
					// reduce activities into table row items
					...(trade?.activities
						?.filter((activity) =>
							filter
								? filter(activity)
								: activity.activityType === ActivityType.PAYMENT
						)
						?.reduce(
							(
								acc,
								{
									activityDate,
									activityType,
									paymentAmount,
									chargeAmount,
									daysLate,
									id: activityId,
								}
							) => [
								...acc,
								{
									connection:
										trade.fromProfileId === activeProfile.id
											? trade.toCompanyName
											: trade.fromCompanyName,
									date: dateToString(new Date(activityDate), {}),
									id: activityId,
									type: activityType,
									amount:
										(activityType === ActivityType.PAYMENT && paymentAmount) ||
										(activityType === ActivityType.CHARGE && chargeAmount),
									onTime:
										activityType === ActivityType.PAYMENT ? daysLate <= 30 : "",
									daysLate:
										(activityType === ActivityType.PAYMENT &&
											daysLateLabel(daysLate)) ||
										"",
									view: `/trade-details/${trade.id}`,
								} as PaymentHistoryTableData,
							],
							[] as PaymentHistoryTableData[]
						) ?? []),
				];
			}, [] as PaymentHistoryTableData[]);
		}, [trades, activeProfile]) ?? [];

	const onTimePayments = useMemo(() => {
		if (!trades || trades.length === 0) {
			return 0;
		}

		if (
			trades.length > 0 &&
			(!activitiesData ||
				activitiesData.length === 0 ||
				!Array.isArray(activitiesData))
		)
			return 0;

		const paymentActivities = activitiesData?.filter(
			(item) => item.type === ActivityType.PAYMENT
		);
		const onTime = paymentActivities?.filter(
			(item) => item.daysLate === "on-time"
		);

		setNumberOfLatePayments(paymentActivities?.length - onTime?.length);

		return ((onTime.length / paymentActivities.length) * 100).toFixed(0);
	}, [trades, activitiesData]);

	return {
		activitiesData,
		numberOfLatePayments,
		onTimePayments,
	};
};
