export interface Preference {
	id: string;
	createdAt: string;
	updatedAt: string;
	isNewTradeReported: boolean;
	isNewActivityReported: boolean;
	isNewTradeEntered: boolean;
	isNewActivityEntered: boolean;
	isresponse: boolean;
	isAccountTradeActivityUpdate: boolean;
	isImprovements: boolean;
	isIssueResolution: boolean;
	isRecommendations: boolean;
	isBusinessOwnership: boolean;
	isBusinessMerge: boolean;
	isPlatformUpdates: boolean;
}
