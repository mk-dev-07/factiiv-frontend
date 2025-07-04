import { isNaN } from "formik";
import { IAdditionalInfo } from "../../types/additionalInfo.interface";
import { IAdditionalInfoDataResponse } from "../../types/additionalInfoData.interface";
import { SESSION_30_MINUTES_IN_MS } from "../../constants/user-session.constants";

const getNewSessionTime = () => Date.now() + SESSION_30_MINUTES_IN_MS;

export const additionalInfoSlice: (set: any, get?: any) => IAdditionalInfo = (
	set: any
) => ({
	additionalInfoState: "",
	additionalInfoCity: "",
	businessSize: "",
	businessStartDate: new Date(),
	creditChecked: true,
	knowledgeHowCreditWorks: true,
	interestInFunding: true,
	linesOfCredit: true,
	businessCreditCards: true,
	sbaLoans: true,
	vendorAccounts: true,
	activeProfileInfo: {} as IAdditionalInfoDataResponse,
	updateAdditionalInfoState: (additionalInfoState: string) =>
		set(() => ({ additionalInfoState: additionalInfoState })),
	updateAdditionalInfoCity: (additionalInfoCity: string) =>
		set(() => ({ additionalInfoCity: additionalInfoCity })),
	updateBusinessSize: (businessSize: string) =>
		set(() => ({ businessSize: businessSize })),
	updateBusinessStartDate: (businessStartDate: Date) =>
		set(() => ({ businessStartDate: businessStartDate })),
	updateCreditChecked: (creditChecked: boolean) =>
		set(() => ({ creditChecked: creditChecked })),
	updateKnowledgeHowCreditWorks: (knowledgeHowCreditWorks: boolean) =>
		set(() => ({ knowledgeHowCreditWorks: knowledgeHowCreditWorks })),
	updateInterestInFunding: (interestInFunding: boolean) =>
		set(() => ({ interestInFunding: interestInFunding })),
	updateLinesOfCredit: (linesOfCredit: boolean) =>
		set(() => ({ linesOfCredit: linesOfCredit })),
	updateBusinessCreditCards: (businessCreditCards: boolean) =>
		set(() => ({ businessCreditCards: businessCreditCards })),
	updateSBALoans: (sbaLoans: boolean) => set(() => ({ sbaLoans: sbaLoans })),
	updateVendorAccounts: (vendorAccounts: boolean) =>
		set(() => ({ vendorAccounts: vendorAccounts })),
	updateActiveProfileInfo: (activeProfileInfo: IAdditionalInfoDataResponse) => {
		const {
			state = "",
			city = "",
			businessSize = "",
			businessStartDate,
			creditChecked = false,
			knowledgeHowCreditWorks = false,
			interestInFunding = false,
			linesOfCredit = false,
			businessCreditCards = false,
			sbaLoans = false,
			vendorAccounts = false,
		} = activeProfileInfo || {};

		const newStartDate = new Date(businessStartDate);

		set(() => ({
			additionalInfoState: state,
			additionalInfoCity: city,
			businessSize,
			businessStartDate: isNaN(newStartDate) ? new Date() : newStartDate,
			creditChecked,
			knowledgeHowCreditWorks,
			interestInFunding,
			linesOfCredit,
			businessCreditCards,
			sbaLoans,
			vendorAccounts,
			activeProfileInfo: activeProfileInfo,
			sessionExpirationTime: getNewSessionTime(),
		}));
	},
});
