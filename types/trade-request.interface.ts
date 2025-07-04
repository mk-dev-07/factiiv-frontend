import Profile from "./profile.interface";

export default interface TradeRequests {
	id: string;
	status: string;
	profile: Profile;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
}
