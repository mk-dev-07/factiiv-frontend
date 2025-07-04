import { IAdditionalInfoDataResponse } from "./additionalInfoData.interface";

export interface IAdditionalInfo {
	additionalInfoState: string;
	additionalInfoCity: string;
	businessSize: string;
	businessStartDate: Date;
	creditChecked: boolean;
	knowledgeHowCreditWorks: boolean;
	interestInFunding: boolean;
	linesOfCredit: boolean;
	businessCreditCards: boolean;
	sbaLoans: boolean;
	vendorAccounts: boolean;
	activeProfileInfo: IAdditionalInfoDataResponse;
	updateAdditionalInfoState(additionalInfoState: string): {
		additionalInfoState: string;
	};
	updateAdditionalInfoCity(additionalInfoCity: string): {
		additionalInfoCity: string;
	};
	updateBusinessSize(businessSize: string): {
		businessSize: string;
	};
	updateBusinessStartDate(businessStartDate: Date): {
		businessStartDate: Date;
	};
	updateCreditChecked(creditChecked: boolean): {
		creditChecked: boolean;
	};
	updateKnowledgeHowCreditWorks(knowledgeHowCreditWorks: boolean): {
		knowledgeHowCreditWorks: boolean;
	};
	updateInterestInFunding(interestInFunding: boolean): {
		interestInFunding: boolean;
	};
	updateLinesOfCredit(linesOfCredit: boolean): {
		linesOfCredit: boolean;
	};
	updateBusinessCreditCards(businessCreditCards: boolean): {
		businessCreditCards: boolean;
	};
	updateSBALoans(sbaLoans: boolean): {
		sbaLoans: boolean;
	};
	updateVendorAccounts(vendorAccounts: boolean): {
		vendorAccounts: boolean;
	};
	updateActiveProfileInfo(activeProfileInfo: IAdditionalInfoDataResponse): void;
}
