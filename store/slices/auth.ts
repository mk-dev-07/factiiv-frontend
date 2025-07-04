import {
	SESSION_10_SECONDS_IN_MS,
	SESSION_30_MINUTES_IN_MS,
} from "../../constants/user-session.constants";
import { IAuth } from "../../types/auth.interface";
import { IUser } from "../../types/user.interface";
import { UserStoreType } from "../index";

const initialAuthState = {
	user: null,
	token: "",
	refreshToken: "",
	expirationTime: 0,
	verifyToken: null,
	isFirstLogin: true,
	userEmail: null,
	activeProfile: {},
	activeProfileInfo: {},
	sessionExpirationTime: 0,
};

export const authSlice = (set: any): IAuth => ({
	...initialAuthState,
	login: ({ token, refreshToken, expirationTime }) => {
		set(
			({
				user,
				activeProfile,
				isFirstLogin,
				sessionExpirationTime,
			}: UserStoreType) => {
				return {
					...initialAuthState,
					user,
					activeProfile,
					token,
					refreshToken,
					expirationTime,
					firstLogin: isFirstLogin && false,
					sessionExpirationTime,
				};
			}
		);
	},
	logout: () => {
		set(({ activeProfile, previouslyActiveProfileId }: UserStoreType) => {
			const previousProfile = {
				previouslyActiveProfileId:
					activeProfile?.id || previouslyActiveProfileId,
			};
			return {
				...initialAuthState,
				...previousProfile,
			};
		});
	},
	updateUser: (user: IUser) => {
		set((state: UserStoreType) => ({ ...state, user }));
	},
	updateSessionExpirationTime: (sessionExpirationTime: number) =>
		set((state: UserStoreType) => ({ ...state, sessionExpirationTime })),
});
