import Head from "next/head";
import Link from "next/link";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFactiivStore } from "../../store";
import { signInWithFirebaseCredentials } from "../../services/auth";
import { UserCredential, getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useMutation, useQuery } from "react-query";
import { IUser } from "../../types/user.interface";
//SVGs
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { GoogleSvg } from "../../components/svgs/GoogleSvg";
import { FacebookSvg } from "../../components/svgs/FacebookSvg";
import { TwitterSvg } from "../../components/svgs/TwitterSvg";
import LoadingOverlay from "../../components/loading-overlay";
import useProtected from "../../hooks/useProtected";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { IAdditionalInfoDataResponse } from "../../types/additionalInfoData.interface";
import getConfig from "next/config";
import { IRegisterUser } from "../../types/registerUser.interface";
import { signInWithGoogle } from "../../services/auth";
import { FirebaseError } from "firebase/app";
import AnimatedLogoSvg from "../../components/svgs/AnimatedLogoSvg";
import { SESSION_30_MINUTES_IN_MS } from "../../constants/user-session.constants";

const Login = () => {
	const store = useFactiivStore();
	const { activeProfile } = store;
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loginError, setLoginError] = useState<string>("");
	const [loginInfo, setLoginInfo] = useState<string>("");
	const [, setFirstName] = useState<string>("");
	const [, setLastName] = useState<string>("");
	// const [user, setUser] = useState<IUser>();
	const [isFirstFailedLogin, setIsFirstFailedLogin] = useState<boolean>(false);
	const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
	const [isLoading, setLoading] = useState(false);

	const registerUser = async (
		{
			token,
			refreshToken,
			expirationTime,
		}: {
			token: string;
			refreshToken: string | undefined;
			expirationTime: number;
		},
		newUserData?: IRegisterUser
	): Promise<IUser> => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();

		const {
			firstName = "",
			lastName = "",
			username = "",
			email = "",
		} = newUserData || {};

		if (!email) {
			throw new Error(
				"Username or password is incorrect, the account doesn't exist, or you have logged in with Google"
			);
			// return;
		}

		try {
			const createUserResponse = await fetch(`${apiUrl}/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					firstName: firstName || "",
					lastName: lastName || "",
					username: username || email,
				}),
			});

			const userData = await createUserResponse.json();
			if (!userData?.payload) {
				throw new Error("Failed to login/register user");
			}

			// setUser(userData.payload);
			store.login({ token, refreshToken, expirationTime });
			store.updateUser(userData?.payload);
			return userData?.payload;
		} catch (error) {
			console.error(error);
			if (store.isFirstLogin) {
				setIsFirstFailedLogin(true);
			}
			throw new Error("Failed to login/register user");
		}
	};

	// fetch additional profile data when the profile changes
	const additionalProfileDataMutation = useMutation({
		mutationKey: ["additionalProfileData", store?.activeProfile?.id],
		mutationFn: async (profileId: string) => {
			const {
				publicRuntimeConfig: { apiUrl },
			} = getConfig();

			const headers = new Headers();
			headers.append("Content-Type", "application/json");
			headers.append("Authorization", `Bearer ${store.token}`);

			return refreshedFetch(`${apiUrl}/profiles/survey/${profileId}`, {
				headers,
			});
		},
		onSuccess: async (response: Response) => {
			const data = await response.json();
			updateStoreFields(data.payload);
		},
		onError: () => {
			updateStoreFields();
		},
	});

	const updateStoreFields = (additionalInfo?: IAdditionalInfoDataResponse) => {
		store.updateActiveProfileInfo(
			additionalInfo || ({} as IAdditionalInfoDataResponse)
		);
	};

	const checkProfilesAndPushToDashboard = async (user: IUser) => {
		if (!user.userActivated) {
			router.push("/verification");
			return;
		}

		if (!user?.profiles?.length) {
			router.push("/core");
			return;
		}

		const previouslyActiveProfile =
			user?.profiles?.filter(
				({ id }) => id === store.previouslyActiveProfileId
			)?.[0] ?? user?.profiles?.[0];

		if (previouslyActiveProfile) {
			store.updateActiveProfile(previouslyActiveProfile);
		}

		router.push("/dashboard");
	};

	const { mutate: loginUser } = useMutation(
		["user"],
		async ({
			token,
			refreshToken,
			expirationTime,
		}: {
			token?: string;
			refreshToken?: string;
			expirationTime?: number;
		}) => {
			const {
				publicRuntimeConfig: { apiUrl },
			} = getConfig();

			try {
				const loginUserResponse = await fetch(`${apiUrl}/users`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				const userData = await loginUserResponse.json();

				if (!loginUserResponse.ok) {
					throw new Error(userData.errors);
				}

				store.login({ token, refreshToken, expirationTime });
				store.updateUser(userData.payload);
				setTimeout(() => {
					checkProfilesAndPushToDashboard(userData.payload);
				});
				setLoading(false);
			} catch (error: unknown) {
				const errorMessage = (error as Error)?.message;
				if (store.isFirstLogin) {
					setIsFirstFailedLogin(true);
				}

				setLoginError(
					errorMessage.toLowerCase() ||
						"Username or password is incorrect, the account doesn't exist, or you have logged in with Google"
				);
				setLoading(false);
			}
		}
	);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		store.logout();
		setLoginError("");
		setLoginInfo("");
		const loginData: {
			token?: string;
			refreshToken?: string;
			expirationTime?: number;
		} = {};
		try {
			setLoading(true);
			const userCredential: UserCredential | undefined =
				await signInWithFirebaseCredentials(email, password);
			loginData.token = (await userCredential?.user?.getIdToken()) ?? "";
			loginData.refreshToken = userCredential?.user?.refreshToken ?? "";
			loginData.expirationTime = new Date().getTime() + 60 * 60 * 1000 ?? 0;
		} catch (error: unknown) {
			setIsFirstFailedLogin(true);
			setLoginError(
				"Username or password is incorrect, the account doesn't exist, or you have logged in with Google"
			);
			setLoading(false);
			return;
		}

		// 30 minutes session time
		store.updateSessionExpirationTime(Date.now() + SESSION_30_MINUTES_IN_MS);
		await loginUser(loginData);
	};

	// This will register the user in firebase if he doesn't exist
	const loginWithGoogle = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		store.logout();
		setLoginError("");
		setLoginInfo("");
		const user = await signInWithGoogle();
		if (!user) {
			setLoginError("failed to login");
			return;
		}

		console.log("updateUserEmail 1", user.email);
		store.updateUserEmail(user.email || "");
		const token = (
			user as unknown as { stsTokenManager: { accessToken: string } }
		)?.stsTokenManager?.accessToken;
		const refreshToken = (
			user as unknown as { stsTokenManager: { refreshToken: string } }
		)?.stsTokenManager?.refreshToken;
		const expirationTime = new Date().getTime() + 3 * 1000;
		setFirstName(user?.displayName?.split(" ")?.[0] || "");
		setLastName(user?.displayName?.split(" ")?.[1] || "");
		setEmail(() => user?.email || "");

		try {
			const username = user?.email?.split?.("@")?.[0];
			const userData = await registerUser(
				{ token, refreshToken, expirationTime },
				{
					firstName: user?.displayName?.split(" ")?.[0] || "",
					lastName: user?.displayName?.split(" ")?.[1] || "",
					username: username || user?.email || "",
					email: user?.email || "",
				}
			);

			// 30 minutes session time
			store.updateSessionExpirationTime(Date.now() + SESSION_30_MINUTES_IN_MS);
			setTimeout(() => {
				checkProfilesAndPushToDashboard(userData);
			});
		} catch (error) {
			setLoginError(
				"Username or password is incorrect, the account doesn't exist, or you have logged in with Google"
			);
		}
	};

	const sendResetPasswordEmail = async () => {
		setLoginError("");
		if (!email) {
			setLoginError("email field is required");
		}

		const auth = getAuth();
		auth.languageCode = "en";

		try {
			await sendPasswordResetEmail(auth, email);

			setLoginInfo("reset password email has been sent");
			setTimeout(() => {
				setLoginInfo("");
			}, 3000);
		} catch (error) {
			const errorMessage = (error as FirebaseError).message;
			console.log(errorMessage);
		}
	};

	useEffect(() => {
		// if (!store.user) {
		store.logout();
		// return;
		// }

		// if (!store.user?.profiles?.length) {
		// 	router.replace("/core");
		// 	return;
		// }

		// router.replace("/dashboard");
	}, []);

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			{isLoading && <LoadingOverlay />}
			<Head>
				<title>Login | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full px-4">
				<div className="py-6 sm:px-6 lg:px-8 font-prox">
					<div className="sm:mx-auto sm:w-full sm:max-w-md mt-12 md:mt-24 lg:mt-32">
						<div className="mx-auto">
							<LogoSvg />
						</div>
						<h2 className="mt-6 text-center font-medium text-xl lg:text-2xl">
							login
						</h2>
					</div>
					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md ">
						<div className="bg-pearl dark:bg-onyx-light py-8 px-4 border-2 border-onyx rounded-lg sm:px-10">
							<form className="space-y-4" onSubmit={handleSubmit}>
								<div>
									<label
										htmlFor="login-email"
										className="block font-medium text-onyx"
									>
										email address
									</label>
									<div className="mt-1">
										<input
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											id="login-email"
											name="login-email"
											type="email"
											placeholder=""
											spellCheck="false"
											className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="login-password"
										className="block font-medium text-onyx"
									>
										password
									</label>
									<div className="mt-1 relative">
										<input
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											minLength={6}
											required
											id="login-password"
											name="login-password"
											type={passwordVisibility ? "text" : "password"}
											placeholder=""
											spellCheck="false"
											className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
										/>
										{/* <div
											onClick={() => setPasswordVisibility(!passwordVisibility)}
											className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 select-none"
										>
											<svg
												className={
													"h-6 text-gray-700 cursor-pointer " +
													(passwordVisibility ? "hidden" : "block")
												}
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 576 512"
											>
												<path
													fill="currentColor"
													d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
												></path>
											</svg>
											<svg
												className={
													"h-6 text-gray-700 cursor-pointer " +
													(passwordVisibility ? "block" : "hidden")
												}
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 640 512"
											>
												<path
													fill="currentColor"
													d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
												></path>
											</svg>
										</div> */}
									</div>
								</div>
								<button
									id="login"
									type="submit"
									className={`relative group w-full ${
										isLoading ? "cursor-not-allowed opacity-50" : ""
									}`}
									disabled={isLoading}
								>
									<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
										{" "}
										login{" "}
									</span>
									<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
								</button>
								{loginError && (
									<p className="text-red-500 text-center">{loginError}</p>
								)}
								{loginInfo && (
									<p className="text-red-500 text-center">{loginInfo}</p>
								)}
								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t-2 border-onyx"></div>
									</div>
									<div className="relative flex justify-center text-sm">
										<span className="bg-white px-2 text-onyx">or</span>
									</div>
								</div>

								{/* <div className="mt-6 grid grid-cols-3 gap-3 jusify-items-center "> */}
								<div className="mt-6 grid grid-cols-1">
									<div>
										<button
											onClick={loginWithGoogle}
											className="inline-flex w-full justify-center rounded-md border-2 border-onyx py-2 px-4 text-sm font-medium text-onyx shadow-sm hover:text-white hover:bg-topaz"
										>
											<span className="sr-only">Sign in with Google</span>
											<GoogleSvg />
										</button>
									</div>
								</div>
							</form>
						</div>
						<div className="flex justify-center">
							<p className="mt-2 text-center text-sm text-gray-600">
								don&apos;t have an account?
								<Link
									href="/register"
									className={
										"font-medium text-topaz hover:text-topaz-dark" +
										(isFirstFailedLogin
											? " mr-4 pr-4 border-r-2 border-gray-500"
											: "")
									}
								>
									{" "}
									register
								</Link>
							</p>
							{isFirstFailedLogin && (
								<p className="mt-2 text-center text-sm text-gray-600">
									forgot password?
									<button
										onClick={sendResetPasswordEmail}
										className="font-medium text-topaz hover:text-topaz-dark"
									>
										&nbsp; reset password
									</button>
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* {( */}
			{/* <div className="absolute bottom-0 right-0 mr-10 mb-10">
				<AnimatedLogoSvg className="bg-transparent"></AnimatedLogoSvg>
			</div> */}
			{/* )} */}
		</div>
	);
};

export default Login;
