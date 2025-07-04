import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { auth } from "../config/firebase";
import { useAdminStore, useFactiivStore } from "../store";
import {
	FirebaseRefreshTokenResponse,
	RefreshedFetch,
} from "../types/authenticatedFetch.interface";
import { useRouter } from "next/router";

const patchOptionsWithNewToken = (
	options: RequestInit = {},
	token?: string | null
) => {
	if (!token) {
		return options;
	}

	const headers = {
		...(options?.headers ?? {}),
		Authorization: `Bearer ${token}`,
	};
	options.headers = headers;
	return options;
};

export const useAuthenticatedFetch = (options?: {
	isAdmin?: boolean;
}): RefreshedFetch => {
	const router = useRouter();
	const { isAdmin } = options || {};
	const adminStore = useAdminStore();
	const userStore = useFactiivStore();

	const { expirationTime, refreshToken, login, logout } = isAdmin
		? adminStore
		: userStore;

	return {
		refreshedFetch: async (url, options = {}) => {
			if (expirationTime && expirationTime > Date.now()) {
				return fetch(url, options);
			}

			let id_token = null;

			try {
				const response = await fetch(
					`https://securetoken.googleapis.com/v1/token?key=${auth.config.apiKey}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
						},
						body: new URLSearchParams({
							grant_type: "refresh_token",
							refresh_token: refreshToken,
						}),
					}
				);

				if (!response.ok) {
					throw new Error("Session invalid, logging out...");
				}

				const tokenResponse =
					(await response.json()) satisfies FirebaseRefreshTokenResponse;
				const { id_token: token, refresh_token, expires_in } = tokenResponse;
				const expirationTime = Date.now() + parseInt(expires_in) * 1000;

				login({
					token,
					refreshToken: refresh_token,
					expirationTime,
				});

				id_token = token;
			} catch (error) {
				console.log("error", error);
				logout();
				router.push(isAdmin ? "/admin/login" : "/login");
				return new Promise((_, reject) => reject("code:logout"));
			}

			return await fetch(url, {
				...patchOptionsWithNewToken(options, id_token),
			});
		},
	};
};
