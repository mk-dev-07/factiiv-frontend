export interface FirebaseRefreshTokenResponse {
	expires_in: string;
	token_type?: string;
	refresh_token: string;
	id_token: string;
	user_id?: string;
	project_id?: string;
}

interface LoginOptions {
	token: string;
	refreshToken: string | undefined;
	expirationTime: number | undefined;
}

export interface RefreshedFetchParams {
	// refreshToken: string;
	url: string;
	options: RequestInit;
	// login: (loginOptions: LoginOptions) => void;
	// logout: () => void;
}

export interface RefreshedFetch {
	refreshedFetch: (url: string, options: RequestInit) => Promise<Response>;
}
