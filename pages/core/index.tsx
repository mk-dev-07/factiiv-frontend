import Head from "next/head";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useFactiivStore } from "../../store";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { ArrowLeftSvg } from "../../components/svgs/ArrowLeftSvg";
import { ArrowRightSvg } from "../../components/svgs/ArrowRightSvg";
import { ICreateProfile } from "../../types/createProfile.interface";
import useProtected from "../../hooks/useProtected";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { IAdditionalInfoDataResponse } from "../../types/additionalInfoData.interface";
import getConfig from "next/config";
import { states } from "../../data/states";
import { industry } from "../../constants/industry.constants";

const CoreBusiness = () => {
	useProtected();
	const store = useFactiivStore();
	const [activeProfile, setActiveProfile] = useState<ICreateProfile>({
		factiivAddress: "factiiv-address",
		businessName: "",
		city: "",
		street: "",
		state: "",
		zip: "",
		phoneNumber: "",
		website: "",
		email: "",
		ein: "",
	} as ICreateProfile);
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const [isLoading, setIsLoading] = useState(false);

	//error messages
	//step 1
	const [businessNameErrorMsg, setBusinessNameErrorMsg] = useState("");
	const [showBusinessNameErrorMsg, setShowBusinessNameErrorMsg] =
		useState(false);
	//step 2
	const [businessOwnerErrorMsg, setBusinessOwnerErrorMsg] = useState("");
	const [showBusinessOwnerErrorMsg, setShowBusinessOwnerErrorMsg] =
		useState(false);
	//step 4
	//street field empty
	const [streetErrorMsg, setStreetErrorMsg] = useState("");
	const [showStreetErrorMsg, setShowStreetErrorMsg] = useState(false);

	//city field empty
	const [cityErrorMsg, setCityErrorMsg] = useState("");
	const [showCityErrorMsg, setShowCityErrorMsg] = useState(false);

	//state field empty
	const [stateErrorMsg, setStateErrorMsg] = useState("");
	const [showStateErrorMsg, setShowStateErrorMsg] = useState(false);

	//zip field empty
	const [zipErrorMsg, setZipErrorMsg] = useState("");
	const [showZipErrorMsg, setShowZipErrorMsg] = useState(false);

	//country field empty
	const [countryErrorMsg, setCountryErrorMsg] = useState("");
	const [showCountryErrorMsg, setShowCountryErrorMsg] = useState(false);

	//step 5
	const [phoneerrorMsg, setPhoneErrorMsg] = useState("");
	const [showPhoneErrorMsg, setShowPhoneErrorMsg] = useState(false);

	//step 6
	const [websiteErrorMsg, setWebsiteErrorMsg] = useState("");
	const [showWebsiteErrorMsg, setShowWebsiteErrorMsg] = useState(false);

	//step 7
	const [emailErrorMsg, setEmailErrorMsg] = useState("");
	const [showEmailErrorMsg, setShowEmailErrorMsg] = useState(false);

	//step 8
	const [einErrorMsg, setEinErrorMsg] = useState("");
	const [showEinErrorMsg, setShowEinErrorMsg] = useState(false);

	// submit
	const [submitErrorMsg, setSubmitErrorMsg] = useState("");
	//Steps
	const [step, setStep] = useState<number>(
		parseInt(router?.query?.step + "" || "1") || 1
	);

	const handleStepOne = () => {
		if (activeProfile.businessName === "") {
			// alert("Please, enter business name!");
			setBusinessNameErrorMsg("Please, enter business name!");
			return;
		}

		if (
			activeProfile.businessName &&
			(activeProfile.businessName.length < 2 ||
				activeProfile.businessName.length > 255)
		) {
			setBusinessNameErrorMsg(
				"Business name should have between 2 and 255 characters!"
			);
			return;
		}

		setBusinessNameErrorMsg("");
		setStep(2);
	};

	const [isOwner, setIsOwner] = useState(true);
	const [ownerName, setOwnerName] = useState("");

	const handleOwner = (e: any) => {
		setIsOwner(e.target.innerText === "yes");
	};

	const handleStepTwo = () => {
		if (!ownerName) {
			setBusinessOwnerErrorMsg("Please, enter the business owner name");
			setShowBusinessOwnerErrorMsg(true);
			return;
		}

		setShowBusinessOwnerErrorMsg(false);
		setActiveProfile((currentValue) => ({
			...currentValue,
			ownerName: ownerName,
		}));
		setStep(3);
	};

	const handleStepThree = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActiveProfile((currentValue) => ({
			...currentValue,
			industry: e.target.value || "",
		}));
		setIndustryErrorMessage("");
		setTimeout(() => setStep(4), 300);
	};

	const handleStepFour = () => {
		setStep(5);
	};

	const handleStepFive = () => {
		if (!activeProfile.phoneNumber?.match(/^[+]?[0-9-]*$/)) {
			setPhoneErrorMsg(
				"Please, enter correct phone number (only + sign, numbers and dashes allowed)"
			);
			setShowPhoneErrorMsg(true);
			return;
		}

		setShowPhoneErrorMsg(false);
		setStep(6);
	};

	const handleStepSix = () => {
		const websiteRegex =
			/^(?:(https?):\/\/)?(www\.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
		if (activeProfile.website && !websiteRegex.test(activeProfile.website)) {
			setWebsiteErrorMsg("Please, enter a valid website address!");
			setShowWebsiteErrorMsg(true);
			return;
		}
		setStep(7);
	};

	const handleStepSeven = () => {
		const regex =
			// eslint-disable-next-line no-control-regex
			/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;

		if (!activeProfile.email || activeProfile.email === "") {
			setEmailErrorMsg("Enter business email!");
			setShowEmailErrorMsg(true);
			return;
		}

		if (activeProfile.email.length < 2 || activeProfile.email.length > 255) {
			setEmailErrorMsg(
				"Business email should have between 2 and 255 characters!"
			);
			setShowEmailErrorMsg(true);
			return;
		}

		if (!regex.test(activeProfile.email)) {
			setEmailErrorMsg("Enter valid email!");
			setShowEmailErrorMsg(true);
			return;
		}

		setShowEmailErrorMsg(false);
		setStep(8);
	};

	const [industryErrorMessage, setIndustryErrorMessage] = useState("");

	const handleNext = () => {
		switch (step) {
		case 1:
			return handleStepOne();
		case 2:
			return handleStepTwo();
		case 3:
			setStep(4);
			break;
		case 4:
			return handleStepFour();
		case 5:
			return handleStepFive();
		case 6:
			return handleStepSix();
		case 7:
			return handleStepSeven();
		}
	};

	const handleBack = () => {
		step > 1 && setStep((prevStep) => prevStep - 1);
	};

	// Detect when Enter is pressed
	// useEffect(() => {
	// 	const keyDownHandler = (e: KeyboardEvent) => {
	// 		if (e.key === "Enter") {
	// 			e.preventDefault();
	// 			handleNext();
	// 		}
	// 	};

	// 	document.addEventListener("keydown", keyDownHandler);
	// 	return () => {
	// 		document.removeEventListener("keydown", keyDownHandler);
	// 	};
	// }, []);

	useEffect(() => {
		if (!router.query.step) {
			setStep(1);
			return;
		}

		const step = parseInt(router.query.step + "");
		if (isNaN(step) || step > 8 || step < 1) {
			setStep(1);
			return;
		}

		setStep(step);
	}, [router.query.step]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			router.push({ pathname: "/core", query: { step: step + "" } });
		});
		return () => {
			clearTimeout(timeout);
		};
	}, [step]);

	const createProfile = async (
		createProfile: ICreateProfile,
		token: string
	) => {
		try {
			const createProfileResponse = await refreshedFetch(`${apiUrl}/profiles`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(createProfile),
			});
			const profileData = await createProfileResponse.json();

			return profileData;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const checkAndNavigateToRequiredFields = () => {
		// submit too early, go to steps with required fields
		if (!activeProfile.businessName) {
			setStep(1);
			return false;
		}

		if (!activeProfile.ownerName) {
			setStep(2);
			return false;
		}

		if (!activeProfile.industry) {
			setStep(3);
			return false;
		}

		if (!activeProfile.email) {
			setStep(7);
			return false;
		}
		// end steps with required fields

		return true;
	};

	const handleSubmit = async () => {
		const isUs = activeProfile.country === "United States";
		const isEinFilledIn = activeProfile.ein;
		const isEinUsFormat = activeProfile.ein.match(/^\d{2}-\d{7}$/);
		const isEinNumbersFormat = activeProfile.ein.match(/^[0-9-]+$/);

		if (!isEinFilledIn) {
			setShowEinErrorMsg(true);
			setEinErrorMsg("Please enter your EIN or Business Number");
			return;
		}

		if (isUs && !isEinUsFormat) {
			setShowEinErrorMsg(true);
			setEinErrorMsg(
				"EIN number must only contain digits in xx-xxxxxxx format"
			);
			return;
		}

		if (!isUs && !isEinNumbersFormat) {
			setShowEinErrorMsg(true);
			setEinErrorMsg("EIN number must only contain digits and dashes");
			return;
		}

		if (!checkAndNavigateToRequiredFields()) {
			return;
		}

		setIsLoading(true);
		setSubmitErrorMsg("");
		const profileData = {
			...activeProfile,
			isOwner: isOwner,
		};

		if (!store.token) return;

		const profileResponse = await createProfile(profileData, store.token);
		const profile = profileResponse?.payload;

		if (!profile) {
			setIsLoading(false);
			setSubmitErrorMsg(
				profileResponse?.errors
					? profileResponse?.errors?.join("\n")
					: "There was an error with creating your profile, please make sure you have all of the required fields correctly filled in."
			);
			return;
		}

		setIsLoading(false);
		store.updateActiveProfile(profile);
		store.updateActiveProfileInfo({} as IAdditionalInfoDataResponse);
		router.replace("/dashboard");
	};

	//HARDCODE FACTIIV ADDRESS UPDATE - MOCK VALUE
	useEffect(() => {
		const factiivAddress =
			activeProfile.businessName?.split(" ").join("") ?? "" + Math.random();
		setActiveProfile((current) => ({ ...current, factiivAddress }));
	}, [activeProfile.businessName]);

	return (
		<div className="min-h-[100vh] bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Core business info | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				<header className="pt-4 px-4 sm:px-6 sm:pt-6 flex justify-between">
					<div>
						<LogoSvg />
					</div>
					<div className="text-xl font-extrabold">
						<span className="text-topaz text-3xl">
							<span id="count">{step} </span>
						</span>
						<span className="top-1 relative">/ 8</span>
					</div>
				</header>
				<div className="py-2 sm:py-6 font-prox">
					<div className="mt-0 sm:mt-6 w-full overflow-x-hidden">
						<form
							onSubmit={(e) => e.preventDefault()}
							className="translate-x-0 fade-in-next flex flex-nowrap transition-transform duration-500 ease-out py-6"
						>
							{step === 1 && (
								<div className="slide origin-top flex-none scale-y-95 w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													{step}
												</span>{" "}
												what is the full name of your business?
											</p>
										</div>
										<div>
											<label
												htmlFor="businessName"
												className="block font-medium text-onyx"
											/>
											<div className="mt-1">
												<input
													value={activeProfile.businessName}
													onChange={(e) =>
														setActiveProfile((currentValue) => ({
															...currentValue,
															businessName: e?.target?.value || "",
														}))
													}
													id="businessName"
													name="businessName"
													type="text"
													autoFocus
													placeholder="full business name..."
													autoComplete="organization"
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{businessNameErrorMsg && (
												<p className="text-red-500">{businessNameErrorMsg}</p>
											)}
										</div>
										<div className="relative mt-4">
											<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
												<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
													<b className="text-bold text-onyx px-1">fact</b>
												</p>
												<p>
													your full legal business name is required to get a
													factiiv verified checkmark.
												</p>
											</div>
											<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
										</div>
										<div className="mt-6 sm:mt-12">
											<div className="flex items-center space-x-3">
												<button
													id="core-step-one"
													onClick={handleStepOne}
													type="button"
													className="next-btn relative group"
												>
													<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
														continue
													</span>
													<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
												</button>
												<p className="hidden">
													press enter{" "}
													<kbd>
														<b>↵</b>
													</kbd>
												</p>
											</div>
										</div>
									</div>
								</div>
							)}
							{step === 2 && (
								<div className="slide origin-top duration-500 flex-none w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													{step}
												</span>{" "}
												are you the owner of this business?
											</p>
										</div>
										<div className="mb-3">
											<span id="" className="w-full flex space-x-6">
												<button
													id="is-owner-yes"
													onClick={(e) => handleOwner(e)}
													type="button"
													className={`${
														isOwner
															? "bg-topaz opta text-white"
															: "text-onyx bg-white hover:bg-gray-50 -ml-px"
													} border-onyx relative inline-block items-center rounded text-center border-2 py-3 text-lg font-bold focus:outline-none w-32`}
												>
													yes
												</button>
												<button
													id="is-owner-no"
													onClick={(e) => handleOwner(e)}
													type="button"
													className={`${
														isOwner
															? "text-onyx bg-white hover:bg-gray-50 -ml-px"
															: "bg-topaz opta text-white"
													} border-onyx relative inline-block items-center rounded text-center border-2 py-3 text-lg font-bold focus:outline-none w-32`}
												>
													no
												</button>
											</span>
										</div>
										{/* <p className="mt-2 mb-1">if not</p> */}
										<div>
											<label
												htmlFor="one"
												className="block font-medium text-onyx"
											></label>
											<div className="mt-1">
												<input
													id="one"
													name="one"
													value={ownerName}
													onChange={(e) => setOwnerName(e.target.value ?? "")}
													type="text"
													required
													placeholder="owner's name..."
													autoComplete="organization"
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											<p className="text-red-500">{businessOwnerErrorMsg}</p>
										</div>
										<div className="mt-6 sm:mt-12">
											<div className="flex items-center space-x-3">
												<button
													id="core-step-two"
													onClick={handleStepTwo}
													type="button"
													className="next-btn group grid"
												>
													<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>
													<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
														continue
													</span>
												</button>
												<p className="hidden">
													press enter
													<kbd>
														<b>↵</b>
													</kbd>
												</p>
											</div>
										</div>
									</div>
								</div>
							)}
							{step === 3 && (
								<div className="origin-top flex-none w-screen">
									<div className="max-w-xl mx-auto px-4">
										<div className="max-w-lg mx-auto">
											<div className="mb-6">
												<p className="text-xl font-medium">
													<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded border-2 border-onyx text-base inline-flex items-center justify-center">
														{step}
													</span>{" "}
													what vertical is your business in?
												</p>
											</div>
										</div>
										<div
											id="verticals"
											className="mt-4 grid grid-cols-2 xs:grid-cols-3 gap-1 sm:gap-4 md:gap-x-2 md:gap-y-3 md:grid-cols-4"
										>
											{industry.map((vertical) => {
												return (
													<label
														key={vertical}
														className="relative cursor-pointer rounded-md border bg-pearl hover:bg-topaz-lighter pb-2 pt-2 focus:outline-none group"
													>
														<input
															onChange={handleStepThree}
															type="radio"
															name="vertical"
															value={vertical}
															className="sr-only peer"
															aria-labelledby={`${vertical}-label`}
														/>
														<span
															id={`${vertical}-label`}
															className={`block text-sm font-medium text-center relative z-[2] peer-checked:text-white select-none ${
																activeProfile.industry === vertical
																	? "text-white"
																	: "text-gray-900"
															}`}
														>
															{vertical}
														</span>
														<span
															className={`pointer-events-none absolute -inset-px rounded-md border-2 border-onyx group-hover:border-topaz peer-checked:border-topaz peer-checked:bg-topaz z-[1] ${
																activeProfile.industry === vertical &&
																"border-topaz bg-topaz"
															}`}
															aria-hidden="true"
														></span>
													</label>
												);
											})}
										</div>
										<h2 className="text-red-500 text-center mt-2">
											{industryErrorMessage}
										</h2>
									</div>
								</div>
							)}
							{step === 4 && (
								<div className="origin-top flex-none w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													{step}
												</span>{" "}
												enter your business address
											</p>
										</div>
										<div className="col-span-6 sm:col-span-6 lg:col-span-3">
											<div>
												<label
													htmlFor="country"
													className="block font-medium text-onyx"
												>
													country
												</label>
												<div className="mt-1">
													<select
														value={activeProfile.country || ""}
														onChange={(e) =>
															setActiveProfile((current) => ({
																...current,
																country: (e.target.value || "").trim(),
															}))
														}
														id="country"
														name="country"
														autoComplete="country-name"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													>
														<option value="" disabled>
															select your country
														</option>
														{states.map((state) => (
															<option key={state.id} value={state.name}>
																{state.name}
															</option>
														))}
													</select>
												</div>
												{showCountryErrorMsg && (
													<p className="text-red-500">{countryErrorMsg}</p>
												)}
											</div>
										</div>
										<div className="grid grid-cols-6 gap-x-6 gap-y-2">
											<div className="col-span-6">
												<div>
													<label
														htmlFor="address"
														className="block font-medium text-onyx"
													>
														street address
													</label>
													<div className="mt-1">
														<input
															value={activeProfile.street}
															onChange={(e) => {
																setActiveProfile((currentValue) => ({
																	...currentValue,
																	street: e.target.value || "",
																}));
																setShowStreetErrorMsg(false);
															}}
															id="address"
															name="address"
															type="text"
															autoFocus
															placeholder=" "
															autoComplete="street-address"
															spellCheck="false"
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
														/>
													</div>

													{showStreetErrorMsg && (
														<p className="text-red-500">{streetErrorMsg}</p>
													)}
												</div>
											</div>
											<div className="col-span-6 sm:col-span-6 lg:col-span-2">
												<div>
													<label
														htmlFor="city"
														className="block font-medium text-onyx"
													>
														city
													</label>
													<div className="mt-1">
														<input
															value={activeProfile.city}
															onChange={(e) => {
																setActiveProfile((currentValue) => ({
																	...currentValue,
																	city: (e.target.value || "").trim(),
																}));
																setShowCityErrorMsg(false);
															}}
															id="city"
															name="city"
															type="text"
															placeholder=" "
															autoComplete="address-level2"
															spellCheck="false"
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
														/>
													</div>

													{showCityErrorMsg && (
														<p className="text-red-500">{cityErrorMsg}</p>
													)}
												</div>
											</div>
											<div className="col-span-6 sm:col-span-6 lg:col-span-2">
												<div>
													<label
														htmlFor="state"
														className="block font-medium text-onyx"
													>
														state / province
													</label>
													<div className="mt-1">
														<input
															value={activeProfile.state}
															onChange={(e) => {
																setActiveProfile((current) => ({
																	...current,
																	state: (e.target.value || "").trim(),
																}));
																setShowStateErrorMsg(false);
															}}
															id="state"
															name="state"
															type="text"
															placeholder=" "
															autoComplete="address-level1"
															spellCheck="false"
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
														/>
													</div>

													{showStateErrorMsg && (
														<p className="text-red-500">{stateErrorMsg}</p>
													)}
												</div>
											</div>
											<div className="col-span-6 sm:col-span-6 lg:col-span-2">
												<div>
													<label
														htmlFor="zip"
														className="block font-medium text-onyx"
													>
														zip / postal code
													</label>
													<div className="mt-1">
														<input
															value={activeProfile.zip}
															onChange={(e) => {
																setActiveProfile((current) => ({
																	...current,
																	zip: (e.target.value || "").trim(),
																}));
																setShowZipErrorMsg(false);
															}}
															id="zip"
															name="zip"
															type="text"
															placeholder=" "
															autoComplete="postal-code"
															spellCheck="false"
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
														/>
													</div>

													{showZipErrorMsg && (
														<p className="text-red-500">{zipErrorMsg}</p>
													)}
												</div>
											</div>
											{/* <div className="col-span-6 sm:col-span-6 lg:col-span-3">
												<div>
													<label
														htmlFor="country"
														className="block font-medium text-onyx"
													>
														country
													</label>
													<div className="mt-1">
														<select
															value={activeProfile.country || ""}
															onChange={(e) =>
																setActiveProfile((current) => ({
																	...current,
																	country: (e.target.value || "").trim(),
																}))
															}
															id="country"
															name="country"
															autoComplete="country-name"
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
														>
															<option value="" disabled>
																select your country
															</option>
															<option>United States</option>
															<option>Canada</option>
														</select>
													</div>
													{showCountryErrorMsg && (
														<p className="text-red-500">{countryErrorMsg}</p>
													)}
												</div>
											</div> */}
										</div>
										<div className="mt-6 sm:mt-12">
											<div className="flex items-center space-x-3">
												<button
													id="core-step-four"
													onClick={handleStepFour}
													type="button"
													className="next-btn relative group"
												>
													<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
														continue
													</span>
													<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
												</button>
												<p className="hidden">
													press enter{" "}
													<kbd>
														<b>↵</b>
													</kbd>
												</p>
											</div>
										</div>
									</div>
								</div>
							)}
							{step === 5 && (
								<div className="origin-top flex-none w-screen">
									<div className="max-w-lg mx-auto px-5">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													{step}
												</span>{" "}
												what is your business phone number ?
											</p>
										</div>
										<div>
											<label
												htmlFor="tel"
												className="block font-medium text-onyx"
											></label>
											<div className="mt-1">
												<input
													value={activeProfile.phoneNumber}
													onChange={(e) => {
														setActiveProfile((current) => ({
															...current,
															phoneNumber: e.target.value || "",
														}));
														setShowPhoneErrorMsg(false);
													}}
													pattern="[0-9\+\-\s]+"
													id="tel"
													name="tel"
													type="tel"
													autoFocus
													placeholder="your business phone..."
													autoComplete="tel"
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
												{showPhoneErrorMsg && (
													<p className="text-red-500">{phoneerrorMsg}</p>
												)}
											</div>
										</div>
										<div className="relative mt-4">
											<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
												<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
													<b className="text-bold text-onyx px-1">fact</b>
												</p>
												<p>
													we may call to verify that a proper business greeting
													or voice message is used on this line
												</p>
											</div>
											<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
										</div>
										<div className="mt-6 sm:mt-12">
											<div className="flex items-center space-x-3">
												<button
													id="core-step-five"
													onClick={handleStepFive}
													type="button"
													className="next-btn relative group"
												>
													<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
														continue
													</span>
													<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
												</button>
												<p className="hidden">
													press enter{" "}
													<kbd>
														<b>↵</b>
													</kbd>
												</p>
											</div>
										</div>
									</div>
								</div>
							)}
							{step === 6 && (
								<div className="origin-top flex-none w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													{step}
												</span>{" "}
												what is your business website?
											</p>
										</div>
										<div>
											<label
												htmlFor="website"
												className="block font-medium text-onyx"
											></label>
											<div className="mt-1">
												<input
													value={activeProfile.website}
													onChange={(e) => {
														setActiveProfile((current) => ({
															...current,
															website: e.target.value || "",
														}));
														setShowWebsiteErrorMsg(false);
													}}
													maxLength={40}
													id="website"
													name="website"
													type="text"
													inputMode="url"
													autoFocus
													placeholder="your business website URL"
													autoComplete="url"
													spellCheck="false"
													pattern="/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>

												{showWebsiteErrorMsg && (
													<p className="text-red-500">{websiteErrorMsg}</p>
												)}
											</div>
										</div>
										<div className="relative mt-4">
											<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
												<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
													<b className="text-bold text-onyx px-1">fact</b>
												</p>
												<p>
													businesses with a website are seen as more trustworthy
													by most consumers.
												</p>
											</div>
											<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
										</div>
										<div className="mt-6 sm:mt-12">
											<div className="flex items-center space-x-3">
												<button
													id="core-step-six"
													onClick={handleStepSix}
													type="button"
													className="next-btn relative group"
												>
													<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
														continue
													</span>
													<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
												</button>
												<p className="hidden">
													press enter{" "}
													<kbd>
														<b>↵</b>
													</kbd>
												</p>
											</div>
										</div>
									</div>
								</div>
							)}
							{step === 7 && (
								<div className="origin-top flex-none w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													{step}
												</span>{" "}
												what is your business email?
											</p>
										</div>
										<div>
											<label
												htmlFor="email"
												className="block font-medium text-onyx"
											></label>
											<div className="mt-1">
												<input
													value={activeProfile.email}
													onChange={(e) => {
														setActiveProfile((current) => ({
															...current,
															email: e.target.value || "",
														}));
														setShowEmailErrorMsg(false);
													}}
													id="email"
													name="email"
													type="email"
													autoFocus
													placeholder="your business email..."
													autoComplete="email"
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
												{showEmailErrorMsg && (
													<p className="text-red-500">{emailErrorMsg}</p>
												)}
											</div>
										</div>
										<div className="relative mt-4">
											<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
												<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
													<b className="text-bold text-onyx px-1">fact</b>
												</p>
												<p>
													you need an email with the same domain extension as
													your business website to be factiiv verified.
												</p>
											</div>
											<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
										</div>
										<div className="mt-6 sm:mt-12">
											<div className="flex items-center space-x-3">
												<button
													id="core-step-seven"
													onClick={handleStepSeven}
													type="button"
													className="next-btn relative group"
												>
													<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
														continue
													</span>
													<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
												</button>
												<p className="hidden">
													press enter{" "}
													<kbd>
														<b>↵</b>
													</kbd>
												</p>
											</div>
										</div>
									</div>
								</div>
							)}
							{step === 8 && (
								<div className="origin-top flex-none w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													{step}
												</span>{" "}
												EIN or Business Number
											</p>
										</div>
										<div>
											<label
												htmlFor="ein"
												className="block font-medium text-onyx"
											>
												EIN or Business Number
											</label>
											<div className="mt-1">
												<input
													value={activeProfile.ein}
													onChange={(e) => {
														setActiveProfile((current) => ({
															...current,
															ein: e.target.value || "",
														}));
														setShowEinErrorMsg(false);
													}}
													id="ein"
													name="ein"
													type="text"
													inputMode="numeric"
													pattern="/^[+]?[0-9-]*$/"
													required
													autoFocus
													placeholder="your EIN number..."
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
												{showEinErrorMsg && (
													<p className="text-red-500">{einErrorMsg}</p>
												)}
											</div>
										</div>
										<div className="relative mt-4">
											<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
												<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
													<b className="text-bold text-onyx px-1">fact</b>
												</p>
												<p>
													Please enter your EIN or Business Number
												</p>
											</div>
											<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
										</div>
										<div className="mt-6 sm:mt-12">
											<div className="flex items-center space-x-3">
												<button
													id="submit-core"
													type="button"
													onClick={handleSubmit}
													className={`block relative group ${
														isLoading ? "cursor-not-allowed opacity-50" : ""
													}`}
													disabled={isLoading}
												>
													<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
														submit
													</span>
													<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
												</button>
											</div>
											{submitErrorMsg && (
												<p className="text-red-500 mt-3 normal-case">{submitErrorMsg}</p>
											)}
										</div>
									</div>
								</div>
							)}
						</form>
					</div>
				</div>
				<footer className="flex items-center px-4 space-x-6 fixed bottom-0 left-0 w-full py-4 bg-pearl-shade border-t-2 border-onyx">
					{step > 1 && (
						<button
							id="prev"
							onClick={handleBack}
							className="flex-none pl-2 pr-4 h-12 bg-onyx rounded text-white flex items-center justify-center group"
						>
							<ArrowLeftSvg />
							<span>back</span>
						</button>
					)}
					<div className="relative group w-full flex justify-center items-center flex-col">
						<h4 className="text-xs z-[2] tracking-wider text-onyx dark:text-pearl">
							<span id="count-bottom">{step}</span> of 8
						</h4>
						<div className="bg-pearl dark:bg-onyx h-4 max-w-xs w-full rounded-sm relative overflow-hidden box-border">
							<div
								id="progress-bar"
								style={{ transform: `translateX(-${100 - step * 12.5}%)` }}
								className="w-full h-4 border-2 duration-500 border-onyx-light absolute bg-gold"
							></div>
							<div className="w-full h-4 border-2 border-onyx-light absolute inset-0"></div>
						</div>
					</div>
					{step !== 8 && (
						<button
							id="next"
							onClick={handleNext}
							className="flex-none pr-2 pl-4 h-12 bg-onyx rounded text-white flex items-center justify-center group"
						>
							<span>next</span>
							<ArrowRightSvg styleProps="h-6 w-6 group-hover:left-1 relative duration-150 transition-all " />
						</button>
					)}
				</footer>
			</div>
		</div>
	);
};

export default CoreBusiness;
