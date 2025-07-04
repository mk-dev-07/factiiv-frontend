import { ActivityType, TradeRole, TradeType } from "../constants/trade.enum";

export interface Trade {
	toProfilePhotoPath: any;
	fromProfilePhotoPath: any;
	amount: string;
	amountCurrency: string;
	balance: string;
	balanceCurrency: string;
	createdAt: string;
	fake: boolean;
	fromAddress: string;
	fromCompanyName: string;
	fromProfile: any;
	fromProfileId: string;
	fromRate: string;
	id: string;
	lifecycle: string;
	relationDescription: TradeRole;
	relationshipDate: string;
	relationshipId: string;
	report: any;
	seen: boolean;
	toAddress: string;
	toCompanyName: string;
	toProfile: any;
	toProfileId: string;
	toRate: string;
	typeDesc: TradeType;
	typeId: string;
	updatedAt: string;
	activities: Activity[];
	adminStatus: "accepted" | "rejected" | "pending" | undefined;
	tradeStatus: string;
}

export interface Activity {
	id: string;
	tradeId: string;
	activityDate: string;
	activityType: ActivityType;
	daysLate: number;
	paymentAmount: number;
	chargeAmount: number;
	interest: number;
	createdAt: string;
	activityStatus: string;
	adminStatus: "accepted" | "rejected" | "pending" | undefined;
	fromProfileBusinessName: string;
	toProfileBusinessName: string;
}
