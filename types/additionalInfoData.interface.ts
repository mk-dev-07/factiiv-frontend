export interface IAdditionalInfoData {
	state: string;
	city: string;
	businessSize: string;
	businessStartDate: string;
	creditChecked: boolean;
	knowledgeHowCreditWorks: boolean;
	interestInFunding: boolean;
	linesOfCredit: boolean;
	businessCreditCards: boolean;
	sbaLoans: boolean;
	vendorAccounts: boolean;
}

export interface IAdditionalInfoDataResponse {
	id: string;
	businessName: string;
	accountOwner: string;
	state: string;
	city: string;
	businessSize: string;
	businessStartDate: string;
	creditChecked: boolean;
	knowledgeHowCreditWorks: boolean;
	interestInFunding: boolean;
	linesOfCredit: boolean;
	businessCreditCards: boolean;
	sbaLoans: boolean;
	vendorAccounts: boolean;
	isState: boolean;
	registeredStateNote: null;
	isCity: boolean;
	isBusinessSize: boolean;
	businessSizeNote: null;
	isBusinessStartDate: boolean;
	businessStartDateNote: null;
	isCreditChecked: boolean;
	isInterestInFunding: boolean;
	interestedInFundingNote: null;
	isLinesOfCredit: boolean;
	isBusinessCreditCards: boolean;
	isSbaLoans: boolean;
	isVendorAccounts: boolean;
	interestedIn: boolean;
	interestedInNote: string;
	verifiedStatus: boolean;
	createdAt: string;
	reviewedAt: string;
	reviewedBy: string;
	reviewedByAdminName: string;
	profilePhotoPath: null;
	isReviewed: boolean;
	profileId: string;
	userId: string;
	infoUnderReview: boolean;
}
