import Head from "next/head";
import React, { useState } from "react";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { useMutation } from "react-query";
import { useFactiivStore } from "../../store";
import {
	confirmPasswordReset,
	getAuth,
	updatePassword,
	verifyPasswordResetCode,
} from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "../../config/firebase";
import { FirebaseError } from "firebase/app";
import AnimatedLogoSvg from "../../components/svgs/AnimatedLogoSvg";
import getConfig from "next/config";

const ResetPassword = () => {
	const store = useFactiivStore();
	const router = useRouter();

	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const { mode, oobCode: actionCode, apiKey, lang } = router.query;

	const [email, setEmail] = useState<string>(store?.user?.email || "");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [passwordResetError, setPasswordResetError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email) {
			setPasswordResetError("email is required");
			return;
		}

		if (!password || !confirmPassword) {
			setPasswordResetError("password or confirm password is invalid");
			return;
		}

		if (password !== confirmPassword) {
			setPasswordResetError("passwords don't match, try again!");
			return;
		}

		// console.log(mode, oobCode, apiKey, lang);
		setIsLoading(true);
		await resetUserPassword();
	};

	const checkIfAdmin = async (email: string): Promise<boolean> => {
		try {
			const isAdminResponse = await fetch(`${apiUrl}/public/check/${email}`);
			//  {
			// 	method: "POST",
			// 	body: JSON.stringify({ email }),
			// }

			const isAdminData = await isAdminResponse.json();

			if (!isAdminResponse.ok) {
				throw new Error("error checking if email is admin");
			}

			return Boolean(isAdminData);
		} catch (error) {
			return false;
		}
	};

	const { mutateAsync: resetUserPassword } = useMutation(async () => {
		setIsLoading(true);
		if (
			!mode ||
			!actionCode ||
			typeof actionCode !== "string" ||
			!apiKey ||
			mode !== "resetPassword"
		) {
			setIsLoading(false);
			setPasswordResetError(
				"unable to reset password, please go back and try again"
			);
			return;
		}

		try {
			await verifyPasswordResetCode(auth, actionCode);
			await confirmPasswordReset(auth, actionCode, password);
			const isAdmin = await checkIfAdmin(email);

			store.logout();
			setIsLoading(false);
			router.push(isAdmin ? "/admin/login" : "/login");
		} catch (error: unknown) {
			const errorCode = (error as FirebaseError).code;
			const errorMessage = (error as FirebaseError).message;

			// If oob is invalid
			// reset code is invalid, please check your email
			console.log(errorMessage);
			setPasswordResetError("Password reset failed");
		}
	});

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Reset password | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full px-4">
				<div className="py-6 sm:px-6 lg:px-8 font-prox ">
					<div className="sm:mx-auto sm:w-full sm:max-w-md mt-12 md:mt-24 lg:mt-32">
						<div className="mx-auto ">
							<LogoSvg />
						</div>
						<h2 className="mt-6 text-center font-medium text-xl lg:text-2xl ">
							reset password
						</h2>
					</div>
					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md ">
						<div className="bg-pearl dark:bg-onyx-light py-8 px-4 border-2 border-onyx rounded-lg sm:px-10 ">
							<form className="space-y-4" onSubmit={handleSubmit}>
								<div>
									<label
										htmlFor="email"
										className="block font-medium text-onyx"
									>
										enter email
									</label>
									<div className="mt-1">
										<input
											value={email}
											onChange={(e) => setEmail(e.target.value)}
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
										htmlFor="reset-password"
										className="block font-medium text-onyx"
									>
										enter new password
									</label>
									<div className="mt-1">
										<input
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											id="reset-password"
											name="reset-password"
											type="password"
											placeholder=""
											spellCheck="false"
											minLength={6}
											className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="password-confirm"
										className="block font-medium text-onyx"
									>
										confirm new password
									</label>
									<div className="mt-1">
										<input
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											required
											id="password-confirm"
											name="password-confirm"
											type="password"
											placeholder=""
											spellCheck="false"
											minLength={6}
											className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
										/>
									</div>
								</div>
								{passwordResetError && (
									<p className="py-1 text-red-500 text-center">
										{passwordResetError}
									</p>
								)}
								<button
									disabled={isLoading}
									id="reset-password-button"
									type="submit"
									className={`${
										isLoading ? "cursor-not-allowed opacity-50" : ""
									} relative group w-full`}
								>
									<span
										className={`bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4 ${
											isLoading ? "opacity-50" : ""
										}`}
									>
										{" "}
										reset{" "}
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

export default ResetPassword;
