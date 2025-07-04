import { SESSION_30_MINUTES_IN_MS } from "../../constants/user-session.constants";
import { IAccount } from "../../types/account.interface";
import Profile from "../../types/profile.interface";

const getNewSessionTime = () => Date.now() + SESSION_30_MINUTES_IN_MS;

export const accountSlice: (set: any) => IAccount = (set: any) => ({
	userEmail: "",
	accountPassphrase: [],
	activeProfile: {} as Profile,
	previouslyActiveProfileId: "",
	pictureUploadedTimestamp: 0,
	updateUserEmail: (userEmail: string) =>
		set(() => ({ userEmail, sessionExpirationTime: getNewSessionTime() })),
	updateAccountPassphrase: (accountPassphrase: string[]) =>
		set(() => ({
			accountPassphrase,
			sessionExpirationTime: getNewSessionTime(),
		})),
	updateActiveProfile: (activeProfile: Profile) =>
		set(() => ({ activeProfile, sessionExpirationTime: getNewSessionTime() })),
	updatePreviouslyActiveProfileId: (previouslyActiveProfileId: string) =>
		set(() => ({
			previouslyActiveProfileId,
			sessionExpirationTime: getNewSessionTime(),
		})),
	updatePictureUploadedTimestamp: (pictureUploadedTimestamp: number) =>
		set(() => ({
			pictureUploadedTimestamp,
			sessionExpirationTime: getNewSessionTime(),
		})),
});
