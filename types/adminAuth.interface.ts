import { IAdmin } from "./admin.interface";

export interface IAdminAuth {
	admin: IAdmin | null;
	token: string;
	refreshToken: string;
	expirationTime: number;
	verifyToken: string | null;
	sessionExpirationTime: number;
	pictureUploadedTimestamp: number;
	// login: ( token: string ) => void;
	login: ({
		token,
		refreshToken,
		expirationTime,
	}: {
		token: string;
		refreshToken: string | undefined;
		expirationTime: number | undefined;
	}) => void;
	logout: () => void;
	updateAdmin: (admin: IAdmin) => void;
	updatePictureUploadedTimestamp: (pictureUploadedTimestamp: number) => void;
}
