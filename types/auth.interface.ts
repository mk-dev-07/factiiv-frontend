import { IUser } from "./user.interface";

export interface IAuth {
	user: IUser | null;
	token: string;
	refreshToken: string;
	expirationTime: number;
	verifyToken: string | null;
	isFirstLogin: boolean;
	sessionExpirationTime: number;
	login: ({
		token,
		refreshToken,
		expirationTime,
	}: {
		token: string | undefined;
		refreshToken: string | undefined;
		expirationTime: number | undefined;
	}) => void;
	logout: () => void;
	updateUser: (user: IUser) => void;
	updateSessionExpirationTime: (sessionExpirationTime: number) => void;
}
