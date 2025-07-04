import { UserCredential } from "firebase/auth";
import getConfig from "next/config";
import Head from "next/head";
import React, { useState } from "react";
import { useQuery } from "react-query";
import LoadingOverlay from "../../../components/loading-overlay";
import { LogoSvg } from "../../../components/svgs/LogoSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { signInWithFirebaseCredentials } from "../../../services/auth";
import { useAdminStore } from "../../../store";
import { IAdmin } from "../../../types/admin.interface";
import { useRouter } from "next/router";
import { FirebaseError } from "firebase/app";

// export async function getServerSideProps(context: any) {
// 	const { verificationCode } = context.params;

// 	return {
// 		props: {
// 			verificationCode,
// 		},
// 	};
// }

const AdminLogin = () => {
	const adminStore = useAdminStore();
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });

	const { verifyCode } = router.query;

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [isLoading, setLoading] = useState(false);

	const verifyAdmin = async (token: string) => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();
		try {
			const response = await fetch(`${apiUrl}/admins/confirm/${verifyCode}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to verify");
			}

			return response.json();
		} catch (error: any) {
			throw new Error(error);
		}
	};

	const fetchAdmin = async (
		token: string | null
	): Promise<IAdmin | undefined> => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();

		try {
			// const loginResponse = await refreshedFetch(`${apiUrl}/admins`, {
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 		Authorization: `Bearer ${token}`,
			// 	},
			// });
			const loginResponse = await fetch(
				"https://api.credit.factiiv.io/api/v1/admins",
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await loginResponse.json();
			if (data.errors?.length) {
				setIsLoginError(data.errors[0]);
			}
			setLoading(false);
			return data.payload;
		} catch (error) {
			console.log("error\n", error);
		}
	};

	const [isLoginError, setIsLoginError] = useState<boolean | string>(false);
	const { refetch: refetchUser } = useQuery(
		["admin"],
		async () => {
			const admin = await fetchAdmin(adminStore.token);
			if (!admin) {
				return;
			}
			adminStore.updateAdmin(admin);

			if (verifyCode) {
				router.push("/admin/edit-user");
				return;
			}

			router.push("/admin/dashboard");
		},
		{ enabled: false }
	);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoginError(false);
		adminStore.logout();

		try {
			setLoading(true);
			const userCredential: UserCredential | undefined =
				await signInWithFirebaseCredentials(email, password);
			const token = await userCredential?.user?.getIdToken();
			const refreshToken = userCredential?.user?.refreshToken;
			// making the token expire a bit sooner, token lifetime: 59m
			const expirationTime = new Date().getTime() + 59 * 60 * 1000;
			//Store JWT
			if (!token) {
				setLoading(false);
				throw new Error("Incorrect username or password");
			}

			// verify admin
			if (verifyCode) {
				try {
					await verifyAdmin(token);
				} catch (error: any) {
					console.log(error.message);
				}
			}

			await adminStore.login({ token, refreshToken, expirationTime });
		} catch (error: unknown) {
			const errorCode = (error as FirebaseError)?.code;
			setLoading(false);
			if (errorCode === "auth/user-not-found") {
				setIsLoginError("Admin not found");
				return;
			}

			if (errorCode === "auth/wrong-password") {
				setIsLoginError("Wrong email and/or password");
				return;
			}

			const errorMessage = (error as Error)?.message;
			setIsLoginError(errorMessage || "Admin not found");

			setTimeout(() => {
				setIsLoginError("");
			}, 3000);

			return;
		}

		try {
			refetchUser();
		} catch (error) {
			console.log("error!!!!!");
		}
	};

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			{isLoading && <LoadingOverlay />}
			<Head>
				<title>Admin login | factiiv</title>
			</Head>
			<div className="relative w-full h-full px-4 bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox">
				<div className="py-6 sm:px-6 lg:px-8 font-prox">
					<div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md md:mt-24 lg:mt-32">
						<div className="mx-auto">
							<LogoSvg />
						</div>
						<h2 className="mt-6 text-xl font-medium text-center lg:text-2xl">
							admin login
						</h2>
					</div>
					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md ">
						<div className="px-4 py-8 border-2 rounded-lg bg-pearl dark:bg-onyx-light border-onyx sm:px-10">
							<form className="space-y-4" onSubmit={handleSubmit}>
								<div>
									<label
										htmlFor="login-email"
										className="block font-medium text-onyx"
									>
										email
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
									<div className="mt-1">
										<input
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											id="login-password"
											name="login-password"
											type="password"
											placeholder=""
											spellCheck="false"
											className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
										/>
									</div>
								</div>
								{!!isLoginError && (
									<p className="mt-2 text-center text-red-500">
										{isLoginError}
									</p>
								)}
								<button type="submit" className="relative w-full group">
									<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
										login
									</span>
									<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
