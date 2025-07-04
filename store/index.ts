import { create } from "zustand";
import { authSlice } from "./slices/auth";
import { accountSlice } from "./slices/account";
import { devtools, persist } from "zustand/middleware";
import { IAuth } from "../types/auth.interface";
import { IAccount } from "../types/account.interface";
import { IAdditionalInfo } from "../types/additionalInfo.interface";
import { additionalInfoSlice } from "./slices/additionalInfo";
import { adminAuthSlice } from "./slices/admin/adminAuth";
import { IAdminAuth } from "../types/adminAuth.interface";

export type UserStoreType = IAuth & IAccount & IAdditionalInfo;

export const useFactiivStore = create<UserStoreType>()(
	devtools(
		persist(
			(set) => ({
				...authSlice(set),
				...accountSlice(set),
				...additionalInfoSlice(set),
			}),
			{
				name: "factiiv-store",
			}
		)
	)
);

export type AdminStoreType = IAdminAuth;

export const useAdminStore = create<AdminStoreType>()(
	devtools(
		persist(
			(set) => ({
				...adminAuthSlice(set),
			}),
			{
				name: "admin-store",
			}
		)
	)
);
