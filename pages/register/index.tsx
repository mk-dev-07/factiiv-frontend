import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useFactiivStore } from "../../store";
import {
	registerWithFirebaseCredentials,
	signInWithGoogle,
} from "../../services/auth";
import { IRegisterUser } from "../../types/registerUser.interface";
//SVGs
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { GoogleSvg } from "../../components/svgs/GoogleSvg";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import getConfig from "next/config";
import { FirebaseError } from "firebase/app";
import { IUser } from "../../types/user.interface";
import { SESSION_30_MINUTES_IN_MS } from "../../constants/user-session.constants";
import { useMutation } from "react-query";

const Register = () => {
	const store = useFactiivStore();
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch();

	const [registerError, setRegisterError] = useState("");
	const [, setRegisterInfo] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [userName, setUserName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const [userRepeatPassword, setUserRepeatPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (userPassword !== userRepeatPassword) {
			setRegisterError("password and repeat password should be the same");
			return;
		}

		setIsLoading(true);
		setRegisterError("");
		console.log("updateUserEmail 2", userEmail);
		store.updateUserEmail(userEmail);
		console.log("userEmail", userEmail);

		const userData: {
			token: string;
			refreshToken: string;
			expirationTime: number;
		} = {
			token: "",
			refreshToken: "",
			expirationTime: 0,
		};
		try {
			const registerRequest = await registerWithFirebaseCredentials(
				userEmail,
				userPassword
			);
			userData.token = (await registerRequest?.user?.getIdToken()) ?? "";
			userData.refreshToken = registerRequest?.user?.refreshToken ?? "";
			userData.expirationTime = new Date().getTime() + 60 * 60 * 1000;
		} catch (error: unknown) {
			const errorCode = (error as FirebaseError).code;
			console.log(errorCode);
			setRegisterError(
				// "Email already exists, try login or contact an administrator."
				"code:email-exists"
			);
			setIsLoading(false);
			return;
		}

		const username = userEmail.split?.("@")?.[0];
		setUserName(username);

		registerUser({
			registrationData: {
				firstName: firstName,
				lastName: lastName,
				username: username,
				email: userEmail,
			},
			...userData,
		});
	};

	useEffect(() => {
		console.log("userEmail 1", userEmail);
	}, [store.userEmail]);

	const { mutate: registerUser } = useMutation(
		["register"],
		async ({
			registrationData,
			token,
			refreshToken,
			expirationTime,
		}: {
			registrationData: IRegisterUser;
			token: string;
			refreshToken: string;
			expirationTime: number;
		}) => {
			const {
				publicRuntimeConfig: { apiUrl },
			} = getConfig();

			try {
				const createUserResponse = await fetch(`${apiUrl}/users`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(registrationData),
				});

				const createUserData: { payload: IUser } =
					await createUserResponse.json();

				const user = createUserData.payload;
				store.login({ token, refreshToken, expirationTime });
				store.updateUser(user);

				if (!user?.userActivated) {
					router.push("/verification");
					return;
				}

				if (!user?.profiles?.length) {
					router.push("/core?step=1");
					return;
				}

				const previouslyActiveProfile =
					user.profiles.filter(
						({ id }) => id === store.previouslyActiveProfileId
					)?.[0] ?? user.profiles[0];

				if (previouslyActiveProfile) {
					store.updateActiveProfile(previouslyActiveProfile);
				}

				router.push("/dashboard");
			} catch (error) {
				setRegisterError("Failed to register user");
				setIsLoading(false);
			}
		}
	);

	// This will register the user in firebase if he doesn't exist
	const loginWithGoogle = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		setRegisterError("");
		setRegisterInfo("");
		const user = await signInWithGoogle();
		if (!user) {
			setRegisterError("failed to login");
			return;
		}

		if (store.userEmail !== userEmail) {
			store.logout();
		}
		console.log("updateUserEmail 3", user.email);
		store.updateUserEmail(user.email || "");
		const token = (
			user as unknown as { stsTokenManager: { accessToken: string } }
		)?.stsTokenManager?.accessToken;
		const refreshToken = (
			user as unknown as { stsTokenManager: { refreshToken: string } }
		)?.stsTokenManager?.refreshToken;
		const expirationTime = new Date().getTime() + 3 * 1000;
		// setFirstName(user?.displayName?.split(" ")?.[0] || "");
		// setLastName(user?.displayName?.split(" ")?.[1] || "");
		setUserEmail(() => user?.email || "");
		setUserName(() => user?.email || "");

		try {
			const username = user?.email?.split?.("@")?.[0];
			registerUser({
				registrationData: {
					firstName: user?.displayName?.split(" ")?.[0] || "",
					lastName: user?.displayName?.split(" ")?.[1] || "",
					username: username || user?.email || "",
					email: user?.email || "",
				},
				token,
				refreshToken,
				expirationTime,
			});

			// store.updateUser(userData);
			// setTimeout(() => {
			// 	checkProfilesAndPushToDashboard(userData);
			// });
		} catch (error) {
			setRegisterError(
				"Username or password is incorrect, the account doesn't exist, or you have logged in with Google"
			);
		}
	};

	useEffect(() => {
		store.logout();
		// 30 minutes session time
		store.updateSessionExpirationTime(Date.now() + SESSION_30_MINUTES_IN_MS);
	}, []);

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Register | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full px-4">
				<div className="py-6 sm:px-6 lg:px-8 font-prox">
					<div className="sm:mx-auto sm:w-full sm:max-w-md mt-12 md:mt-24 lg:mt-32">
						<div className="mx-auto">
							<LogoSvg />
						</div>
						<h2 className="mt-6 text-center font-medium text-xl lg:text-2xl">
							register, it&apos;s free
						</h2>
					</div>
					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
						<div className="bg-pearl dark:bg-onyx-light py-8 px-4 border-2 border-onyx rounded-lg sm:px-10">
							<form className="space-y-4" onSubmit={handleSubmit}>
								<div>
									<label
										htmlFor="email"
										className="block font-medium text-onyx"
									>
										email address
									</label>
									<div className="mt-1">
										<input
											value={userEmail}
											onChange={(e) => setUserEmail(e.target.value)}
											required
											id="email"
											name="email"
											type="email"
											placeholder=""
											spellCheck="false"
											className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="email"
										className="block font-medium text-onyx"
									>
										first name
									</label>
									<div className="mt-1">
										<input
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											required
											id="firstName"
											name="firstName"
											type="text"
											placeholder=""
											spellCheck="false"
											className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="email"
										className="block font-medium text-onyx"
									>
										last name
									</label>
									<div className="mt-1">
										<input
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											required
											id="lastName"
											name="lastName"
											type="text"
											placeholder=""
											spellCheck="false"
											className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="password"
										className="block font-medium text-onyx"
									>
										password
									</label>
									<div className="mt-1">
										<input
											value={userPassword}
											onChange={(e) => setUserPassword(e.target.value)}
											minLength={6}
											required
											id="password"
											name="password"
											type="password"
											placeholder=" "
											spellCheck="false"
											className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="password"
										className="block font-medium text-onyx"
									>
										repeat password
									</label>
									<div className="mt-1">
										<input
											value={userRepeatPassword}
											onChange={(e) => setUserRepeatPassword(e.target.value)}
											minLength={6}
											required
											id="repeatPassword"
											name="repeatPassword"
											type="password"
											placeholder=" "
											spellCheck="false"
											className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
										/>
									</div>
								</div>
								<button
									id="register-get-started"
									type="submit"
									className={`relative group w-full ${
										isLoading ? "cursor-not-allowed opacity-50" : ""
									}`}
									disabled={isLoading}
								>
									<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
										get started
									</span>
									<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
								</button>
								{registerError && registerError !== "code:email-exists" && (
									<h2 className="text-red-500 text-center">{registerError}</h2>
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
								{registerError && registerError === "code:email-exists" && (
									<>
										<h2 className="text-red-500 text-center">
											Email may already exist. Try to login with your google account.
										</h2>
										<h2 className="text-red-500 text-center">
											If you are still having trouble, please contact to{" "}
											<a
												className="text-topaz hover:text-topaz-dark"
												href="mailto:support@factiiv.io"
											>
												support@factiiv.io
											</a>
										</h2>
									</>
								)}
							</form>
						</div>
						<p className="mt-2 text-center text-sm text-gray-600">
							have an account?{" "}
							<Link
								href="/login"
								className="font-medium text-topaz hover:text-topaz-dark"
							>
								login
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
