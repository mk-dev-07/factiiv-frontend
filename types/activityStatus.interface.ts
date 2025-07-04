export interface ActivityStatus {
	tradeId: string;
	activityId: string;
	activityStatus: "ACCEPTED" | "REJECTED";
	notificationId: string;
}
