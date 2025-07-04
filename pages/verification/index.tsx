import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFactiivStore } from "../../store";
import { useQuery } from "react-query";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import OTPInput from "react-otp-input";
import LoadingOverlay from "../../components/loading-overlay";
import useProtected from "../../hooks/useProtected";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import getConfig from "next/config";
import { registerWithFirebaseCredentials } from "../../services/auth";
import { IRegisterUser } from "../../types/registerUser.interface";
import { enqueueSnackbar } from "notistack";

const Verification: React.FC = () => {
	useProtected();
	const store = useFactiivStore();
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch();
	const [isCodeResending, setIsCodeResending] = useState<boolean>(false);

	//GET OTP
	const [OTP, setOTP] = useState("");
	function handleChange(OTP: string) {
		setOTP(OTP);
	}

	//ERROR MESSAGE
	const [errorMessage, setErrorMessage] = useState("");
	const [verificationCode, setVerificationCode] = useState("");

	const {
		publicRuntimeConfig: { apiUrl, isProduction },
	} = getConfig();

	//CONFRIM EMAIL
	const verifyOTP = async (verifyToken: string, jwtToken: string | null) => {
		const response = await refreshedFetch(
			`${apiUrl}/users/confirm/${verifyToken}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to verify");
		}

		return response.json();
	};

	const { isLoading } = useQuery(
		["verification", OTP],
		() => verifyOTP(OTP, store.token),
		{
			enabled: OTP.length === 6,
			retry: 3,
			retryDelay: 1000,
			refetchOnWindowFocus: false,
			onError: (error) => {
				setErrorMessage("failed to verify, try again");
				console.error("error", error);
			},
			onSuccess: (data) => {
				setErrorMessage("");
				router.replace("/verifying");
			},
		}
	);

	//PASTE CODE FROM CLIPBOARD ON WINDOW FOCUS
	useEffect(() => {
		const handleWindowFocus = async () => {
			if (document.hasFocus() && navigator.clipboard) {
				setTimeout(async () => {
					const clipboardText = await navigator.clipboard.readText();
					clipboardText.length === 6 && setOTP(clipboardText);
				}, 500);
			}
		};
		window.addEventListener("focus", handleWindowFocus);
		return () => {
			window.removeEventListener("focus", handleWindowFocus);
		};
	}, []);

	const resendCode = async () => {
		setIsCodeResending(true);
		const res = await refreshedFetch(`${apiUrl}/users/resend-code/`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${store.token}`,
			},
		});
		const data = await res.json();
		const verificationCode = data?.payload?.tokenId;
		console.log("verificationCode: " + verificationCode);
		setIsCodeResending(false);
		enqueueSnackbar("Code resent to your email successfully", {variant: "success"});
		setVerificationCode(verificationCode);
	};

	useQuery("resendCode", resendCode, {
		refetchOnWindowFocus: false,
		enabled: false,
	});
	console.log("store.userEmail", store.userEmail);
	return (
		<div className="min-h-[100vh] bg-pearl-shade dark:bg-onyx">
			{(isLoading || isCodeResending) && <LoadingOverlay />}
			<Head>
				<title>Verification | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full px-4">
				<div className="py-6 sm:px-6 lg:px-8 font-prox">
					<div className="sm:mx-auto sm:w-full sm:max-w-md mt-12 md:mt-24 lg:mt-32">
						<LogoSvg />
						<h2 className="mt-6 text-center font-medium text-xl lg:text-2xl">
							enter your verification code
						</h2>
					</div>
					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
						<div className="bg-pearl dark:bg-onyx-light py-8 px-4 border-2 border-onyx rounded-lg sm:px-10">
							<form className="space-y-4">
								<p className="text-center">
									a one-time use verification code was sent to{" "}
									<b>{store.user?.email || "your email"}</b>
								</p>
								<OTPInput
									onChange={handleChange}
									value={OTP}
									inputStyle={{
										borderWidth: "2px",
										borderColor: "#142935",
										aspectRatio: 1 / 1,
										fontWeight: "700",
										textAlign: "center",
										paddingTop: "0.5rem",
										paddingBottom: "0.5rem",
										backgroundColor: "#ffffff",
										fontSize: "1.25rem",
										lineHeight: "1.75rem",
										borderRadius: "0.25rem",
										width: "54px",
										height: "56px",
									}}
									containerStyle={{
										display: "grid",
										gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
										gap: "0.5rem",
									}}
									focusStyle={{
										borderColor: "#409AF4",
										boxShadow: "#409AF4",
										outline: "0",
									}}
									numInputs={6}
									separator={<span></span>}
									className="grid grid-cols-6 gap-2"
									shouldAutoFocus
								/>
								<p className="text-red-500 text-center">{errorMessage}</p>
							</form>
						</div>
						<p className="mt-2 text-center text-sm text-gray-600">
							didn&apos;t get your code? {""}
							<button
								id="resend-button"
								className="font-medium text-topaz hover:text-topaz-dark"
								onClick={resendCode}
							>
								{" "}
								resend
							</button>
						</p>
					</div>
					{verificationCode && (
						<div className="hidden">
							<span id="verificationCode">{verificationCode}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Verification;
