import { AdminStoreType } from "../..";
import { SESSION_30_MINUTES_IN_MS } from "../../../constants/user-session.constants";
import { IAdmin } from "../../../types/admin.interface";
import { IAdminAuth } from "../../../types/adminAuth.interface";

export const adminAuthSlice = (set: any): IAdminAuth => ({
	admin: null,
	token: "",
	refreshToken: "",
	expirationTime: 0,
	verifyToken: null,
	sessionExpirationTime: Infinity,
	pictureUploadedTimestamp: 0,
	login: ({ token, refreshToken, expirationTime }) => {
		// 30 minutes session time
		const sessionExpirationTime = Date.now() + SESSION_30_MINUTES_IN_MS;

		set((state: AdminStoreType) => {
			return {
				...state,
				token,
				refreshToken,
				expirationTime,
				sessionExpirationTime,
			};
		});
	},
	logout: () => {
		set((state: AdminStoreType) => {
			return {
				...state,
				admin: null,
				token: null,
				refreshToken: null,
				expirationTime: null,
				sessionExpirationTime: Infinity,
			};
		});
	},
	updateAdmin: (admin: IAdmin) => {
		set((state: AdminStoreType) => ({ ...state, admin }));
	},
	updatePictureUploadedTimestamp: (pictureUploadedTimestamp: number) =>
		set(() => ({ pictureUploadedTimestamp })),
});
