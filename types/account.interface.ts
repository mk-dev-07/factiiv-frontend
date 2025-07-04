import Profile from "./profile.interface";

export interface IAccount {
	userEmail: string;
	accountPassphrase: string[];
	activeProfile: Profile;
	previouslyActiveProfileId: string;
	pictureUploadedTimestamp: number;
	updateUserEmail(userEmail: string): void;
	updateAccountPassphrase(accountPassphrase: string[]): void;
	updateActiveProfile(activeProfile: Profile): void;
	updatePreviouslyActiveProfileId(previouslyActiveProfileId: string): void;
	updatePictureUploadedTimestamp(pictureUploadedTimestamp: number): void;
}
