import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFactiivStore } from "../../store";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { ArrowLeftSvg } from "../../components/svgs/ArrowLeftSvg";
import { ArrowRightSvg } from "../../components/svgs/ArrowRightSvg";
import CalendarPicker from "../../components/calendar-picker";
import {
	IAdditionalInfoData,
	IAdditionalInfoDataResponse,
} from "../../types/additionalInfoData.interface";
import useProtected from "../../hooks/useProtected";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import getConfig from "next/config";
import Calendar from "../../components/calendar";
import { isValid } from "date-fns";

const AdditionalInformation = () => {
	useProtected();
	const store = useFactiivStore();
	const { token: authToken, activeProfileInfo } = store;
	const {isState} = activeProfileInfo;
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch();

	const [selectFunding, setSelectFunding] = useState<any>({});

	const businessSizeArray = ["sole", "small", "smb", "large"];

	const fundingArray = [
		"lines of credit",
		"business credit cards",
		"SBA loans",
		"vendor accounts",
	];
	const [step1Err, setStep1Err] = useState("");
	const [step2Err, setStep2Err] = useState("");
	const [step7Err, setStep7Err] = useState("");


	const lettersAndSpaceCheck = (name: string) => {
		const regEx = /^[a-zA-Z\s-.,]+$/;
		if (name.match(regEx) || name === "") {
			setStep1Err("");
			setStep(2);
		} else {
			setStep1Err("Please enter letters and spaces only.");
		}
	};
	//Steps
	const [step, setStep] = useState<number>(1);

	//STEP 1
	const handleStepOne = () => {
		if(store.additionalInfoState.length){
			lettersAndSpaceCheck(store.additionalInfoState);
		} else {
			setStep1Err("This field is required");
		}
		// setStep(2);
	};

	//STEP 2
	const handleStepTwo = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStep2Err("");
		store.updateBusinessSize(e.target.value);
		setTimeout(() => setStep(3), 300);
	};

	//STEP 3
	const handleStepFour = () => {
		setStep(5);
	};

	const getDateFromCalendar = (date: Date) => {
		store.updateBusinessStartDate(new Date(date));
	};

	//STEP 4
	const handleStepThree = () => {
		if (!isValid(store.businessStartDate)) {
			store.updateBusinessStartDate(new Date());
		}

		setStep(4);
	};

	const handleCreditCheck = (e: any) => {
		e.target.innerText === "yes"
			? store.updateCreditChecked(true)
			: store.updateCreditChecked(false);
	};

	//Yes/no buttons style
	const checkedStyle =
		"bg-topaz opta text-white border-onyx relative inline-block items-center rounded text-center border-2 py-3 textlg font-bold focus:outline-none w-32";
	const notCheckedStyle =
		"text-onyx border-onyx bg-white hover:bg-gray-50 relative -ml-px inline-block items-center rounded text-center border-2 py-3 textlg font-bold focus:outline-none w-32";

	//STEP 5
	const handleStepFive = () => {
		setStep(6);
	};

	const handleHowCreditWorks = (e: any) => {
		e.target.innerText === "yes"
			? store.updateKnowledgeHowCreditWorks(true)
			: store.updateKnowledgeHowCreditWorks(false);
	};

	//STEP 6
	const handleStepSix = () => {
		setStep(7);
	};

	const handleFundingOptions = (e: any) => {
		e.target.innerText === "yes"
			? store.updateInterestInFunding(true)
			: store.updateInterestInFunding(false);
	};

	//STEP 7
	const handleSelectFunding = (e: any) => {
		setSelectFunding({ ...selectFunding, [e.target.name]: e.target.checked });
	};

	//Update store funding options
	useEffect(() => {
		const ar: string[] = [];
		for (const fund in selectFunding) {
			selectFunding[fund]
				? ar.push(fund)
				: ar.includes(fund) && ar.splice(ar.indexOf(fund), 1);
		}
		ar.includes("lines of credit")
			? store.updateLinesOfCredit(true)
			: store.updateLinesOfCredit(false);
		ar.includes("business credit cards")
			? store.updateBusinessCreditCards(true)
			: store.updateBusinessCreditCards(false);
		ar.includes("SBA loans")
			? store.updateSBALoans(true)
			: store.updateSBALoans(false);
		ar.includes("vendor accounts")
			? store.updateVendorAccounts(true)
			: store.updateVendorAccounts(false);
	}, [selectFunding]);

	const handleNext = () => {
		switch (step) {
		case 1:
			return handleStepOne();
		case 2:
			if(store.businessSize){
				setStep2Err("");
				return setStep(3);
			} else{
				setStep2Err("This field is required.");
				return;
			}
		case 3:
			return handleStepThree();
		case 4:
			return handleStepFour();
		case 5:
			return handleStepFive();
		case 6:
			return handleStepSix();
		}
	};

	const handleBack = () => {
		step > 1 && setStep((prevStep) => prevStep - 1);
	};

	//Detect when Enter is pressed
	// useEffect(() => {
	// 	const keyDownHandler = (e: KeyboardEvent) => {
	// 		if (e.key === "Enter") {
	// 			e.preventDefault();
	// 			switch (step) {
	// 			case 1:
	// 				return handleStepOne();
	// 			case 2:
	// 				return setStep(3);
	// 			case 3:
	// 				return handleStepThree();
	// 			case 4:
	// 				return handleStepFour();
	// 			case 5:
	// 				return handleStepFive();
	// 			case 6:
	// 				return handleStepSix();
	// 			case 7:
	// 				return handleSubmit(e);
	// 			}
	// 		}
	// 	};
	// 	document.addEventListener("keydown", keyDownHandler);
	// 	return () => {
	// 		document.removeEventListener("keydown", keyDownHandler);
	// 	};
	// });
	const [isLoading, setIsLoading] = useState(false);
	//SUBMIT ADDITIONAL INFO
	const handleSubmit = async (e: any) => {
		setStep7Err("");
		e.preventDefault();

		if(Object.keys(selectFunding).length < 1){
			setStep7Err("This field is required");
			return;
		}

		setIsLoading(true);

		if (!store.token) {
			setIsLoading(false);
			return;
		}

		const additionalInfoData = {
			state: store.additionalInfoState,
			city: store.additionalInfoState,
			businessSize: store.businessSize,
			businessStartDate:
				store?.businessStartDate?.toISOString() || new Date().toISOString(),
			creditChecked: store.creditChecked,
			knowledgeHowCreditWorks: store.knowledgeHowCreditWorks,
			interestInFunding: store.interestInFunding,
			linesOfCredit: store.linesOfCredit,
			businessCreditCards: store.businessCreditCards,
			sbaLoans: store.sbaLoans,
			vendorAccounts: store.vendorAccounts,
		};

		const submitData = await addAdditionalInfo(additionalInfoData, store.token);
		if (!submitData) {
			setIsLoading(false);
			return;
		}

		router.push("/business-updated");
	};

	const addAdditionalInfo = async (
		additionalData: IAdditionalInfoData,
		token: string
	) => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();

		try {
			const profileId = store.activeProfile.id;
			const additionalInfoResponse = await refreshedFetch(
				`${apiUrl}/profiles/survey/${profileId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(additionalData),
				}
			);

			const additionalInfo: { payload: IAdditionalInfoDataResponse } =
				await additionalInfoResponse.json();
			store.updateActiveProfileInfo(additionalInfo.payload);

			return additionalInfo;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	// const [isSurveyDone, setIsSurveyDone] = useState<Boolean>(false);
	// useEffect(() => {
	// 	setIsSurveyDone(!!store?.additionalInfoState);
	// }, [store?.additionalInfoState]);

	return (
		<div className="min-h-[100vh] bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Additional business info | factiiv</title>
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
						<span className="top-1 relative">/ 7</span>
					</div>
				</header>
				<div className="py-2 sm:py-6 font-prox">
					<div
						className={`mt-0 sm:mt-6 w-full ${
							step === 3 ? "" : "overflow-x-hidden"
						}`}
					>
						<form
							id="frame"
							style={{ transform: "translateX(0%)" }}
							className="fade-in-next flex flex-nowrap transition-transform duration-500 ease-out py-6"
						>
							{step === 1 && (
								<div className="origin-top flex-none w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													1
												</span>{" "}
												what state is this business registered in?
											</p>
										</div>
										<div>
											<label
												htmlFor="one"
												className="block font-medium text-onyx"
											></label>
											<div className="mt-1">
												<input
													id="one"
													name="one"
													minLength={2}
													value={store?.additionalInfoState}
													onChange={(e) => {
														setStep1Err("");
														store?.updateAdditionalInfoState(e.target.value);
													}}
													type="text"
													autoFocus
													placeholder="business registration state or location..."
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
										</div>
										<div className="relative mt-4">
											<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
												<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
													<b className="text-bold text-onyx px-1">fact</b>
												</p>
												<p>
													if your business is registered outside the US enter
													the country and city of registration.
												</p>
											</div>

											<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
										</div>
										{step1Err && (
											<div className="text-red-500 mt-4">
												<span>{step1Err}</span>
											</div>
										)}
										{(!store?.activeProfileInfo?.isState)?.toString() == "true" && (
											<div className="text-red-500 mt-4">
												<span>
													{store?.activeProfileInfo?.registeredStateNote}
												</span>
											</div>
										)}
										<div className="mt-6 sm:mt-12">
											<div className="flex items-center space-x-3">
												<button
													id="save-step-one"
													onClick={handleStepOne}
													type="button"
													className="next-btn group grid"
												>
													<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>
													<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
														continue
													</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
							{step === 2 && (
								// TODO: animacija
								// <div className="slide origin-top invisible opacity-0 blur-sm duration-500 flex-none w-screen">
								<div className="origin-top flex-none w-screen">
									<div className="max-w-xl mx-auto px-4">
										<div className="max-w-lg mx-auto">
											<div className="mb-6">
												<p className="text-xl font-medium">
													<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
														2
													</span>{" "}
													how big is this business?
												</p>
											</div>
											<div
												id="sizes"
												className="mt-4 grid grid-cols-2 xs:grid-cols-3 gap-1 sm:gap-4 md:gap-x-2 md:gap-y-3 md:grid-cols-4"
											>
												{businessSizeArray.map((size) => {
													return (
														<label
															key={size}
															className="relative cursor-pointer rounded-md border bg-pearl hover:bg-topaz-lighter py-2 focus:outline-none group"
														>
															<input
																type="radio"
																name="size"
																value={size}
																onChange={handleStepTwo}
																className="sr-only peer"
																aria-labelledby={`${size}-label`}
															/>
															{/* <div className="w-full transition-transform scale-90 peer-checked:scale-100 group-hover:scale-95 origin-bottom duration-150 ease-out relative z-[2] -mt-2 md:-mt-3 pointer-events-none select-none"> */}
															{/* <img src="./sole.svg" alt="" className="w-4/6 sm:w-11/12 mx-auto" /> */}
															{/* </div> */}
															<span
																id={`${size}-label`}
																className={`block text-sm font-medium text-center relative z-[2] peer-checked:text-white select-none ${
																	store?.businessSize === size
																		? "text-white"
																		: "text-gray-900"
																}`}
															>
																{size}
															</span>
															<span
																className={`pointer-events-none absolute -inset-px rounded-md border-2 border-onyx group-hover:border-topaz peer-checked:border-topaz peer-checked:bg-topaz z-[1] ${
																	store?.businessSize === size &&
																	"border-topaz bg-topaz"
																}`}
																aria-hidden="true"
															></span>
														</label>
													);
												})}
											</div>
											{step2Err && (
												<div className="text-red-500 mt-4">
													<span>{step2Err}</span>
												</div>
											)}
										</div>
										{!store?.activeProfileInfo?.isBusinessSize && (
											<div className="text-red-500 mt-4">
												<span>
													{store?.activeProfileInfo?.businessSizeNote}
												</span>
											</div>
										)}
									</div>
								</div>
							)}
							{step === 3 && (
								// <div className="slide origin-top invisible opacity-0 blur-sm duration-500 flex-none w-screen">
								<div className="origin-top flex-none w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													3
												</span>{" "}
												when was this business started?
											</p>
										</div>
										<div className="mx-auto">
											{/* <CalendarPicker onDateSelected={getDateFromCalendar} /> */}
											<Calendar value={store?.businessStartDate && isValid(store?.businessStartDate) ? new Date(store?.businessStartDate) : new Date()} onDateSelected={getDateFromCalendar}></Calendar>
										</div>
										<div className="mt-6 sm:mt-12 max-w-max">
											<div className="flex items-center space-x-3">
												<button
													id="save-step-three"
													onClick={handleStepThree}
													type="button"
													className="next-btn group grid"
												>
													<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>
													<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
														{" "}
														continue{" "}
													</span>
												</button>
												{/* <p className="hidden md:block">
													press enter{" "}
													<kbd>
														<b>↵</b>
													</kbd>
												</p> */}
											</div>
											{!store?.activeProfileInfo?.isBusinessStartDate && (
												<div className="text-red-500 mt-4">
													<span>
														{store?.activeProfileInfo?.businessStartDateNote}
													</span>
												</div>
											)}
										</div>
									</div>
								</div>
							)}
							{step === 4 && (
								//TODO animacija
								// <div className="slide origin-top invisible opacity-0 blur-sm duration-500 flex-none w-screen">
								<div className="origin-top flex-none w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													4
												</span>{" "}
												have you ever checked your business credit before?
											</p>
										</div>
										<div className="mx-auto">
											<span id="haschecked" className="w-full flex space-x-6">
												<button
													id="business-credit-yes"
													onClick={(e) => handleCreditCheck(e)}
													type="button"
													className={
														store?.creditChecked ? checkedStyle : notCheckedStyle
													}
												>
													yes
												</button>
												<button
													id="business-credit-no"
													onClick={(e) => handleCreditCheck(e)}
													type="button"
													className={
														store?.creditChecked ? notCheckedStyle : checkedStyle
													}
												>
													no
												</button>
											</span>
										</div>
										<div className="mt-6 sm:mt-12">
											<div className="flex items-center space-x-3">
												<button
													id="save-step-four"
													onClick={handleStepFour}
													type="button"
													className="next-btn group grid"
												>
													<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>
													<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
														{" "}
														continue{" "}
													</span>
												</button>
												{/* <p className="hidden md:block">
													press enter{" "}
													<kbd>
														<b>↵</b>
													</kbd>
												</p> */}
											</div>
										</div>
									</div>
								</div>
							)}
							{step === 5 && (
								//TODO animacija
								// <div className="slide origin-top invisible opacity-0 blur-sm duration-500 flex-none w-screen">
								<div className="origin-top flex-none w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													5
												</span>{" "}
												do you know how business credit works?
											</p>
										</div>
										<div className="mx-auto">
											<span id="haschecked" className="w-full flex space-x-6">
												<button
													id="how-credit-works-yes"
													onClick={(e) => handleHowCreditWorks(e)}
													type="button"
													className={
														store?.knowledgeHowCreditWorks
															? checkedStyle
															: notCheckedStyle
													}
												>
													yes
												</button>
												<button
													id="how-credit-works-no"
													onClick={(e) => handleHowCreditWorks(e)}
													type="button"
													className={
														store?.knowledgeHowCreditWorks
															? notCheckedStyle
															: checkedStyle
													}
												>
													no
												</button>
											</span>
										</div>
										<div className="mt-6 sm:mt-12">
											<div className="flex items-center space-x-3">
												<button
													id="save-step-five"
													onClick={handleStepFive}
													type="button"
													className="next-btn group grid"
												>
													<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>
													<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
														{" "}
														continue{" "}
													</span>
												</button>
												{/* <p className="hidden md:block">
													press enter{" "}
													<kbd>
														<b>↵</b>
													</kbd>
												</p> */}
											</div>
										</div>
									</div>
								</div>
							)}
							{step === 6 && (
								// TODO animacija
								// <div className="slide origin-top invisible opacity-0 blur-sm duration-500 flex-none w-screen">
								<div className="origin-top flex-none w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													6
												</span>{" "}
												are you interested in funding options for this business?
											</p>
										</div>
										<div className="mx-auto">
											<span id="haschecked" className="w-full flex space-x-6">
												<button
													id="funding-options-yes"
													onClick={(e) => handleFundingOptions(e)}
													type="button"
													className={
														store?.interestInFunding
															? checkedStyle
															: notCheckedStyle
													}
												>
													yes
												</button>
												<button
													id="funding-options-no"
													onClick={(e) => handleFundingOptions(e)}
													type="button"
													className={
														store?.interestInFunding
															? notCheckedStyle
															: checkedStyle
													}
												>
													no
												</button>
											</span>
										</div>
										<div className="mt-6 sm:mt-12">
											<div className="flex items-center space-x-3">
												<button
													id="save-step-six"
													onClick={handleStepSix}
													type="button"
													className="next-btn group grid"
												>
													<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>
													<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
														{" "}
														continue{" "}
													</span>
												</button>
												{/* <p className="hidden md:block">
													press enter{" "}
													<kbd>
														<b>↵</b>
													</kbd>
												</p> */}
											</div>
											{!store?.activeProfileInfo?.isInterestInFunding && (
												<div className="text-red-500 mt-4">
													<span>
														{store?.activeProfileInfo?.interestedInFundingNote}
													</span>
												</div>
											)}
										</div>
									</div>
								</div>
							)}
							{step === 7 && (
								// TODO animacija
								// <div className="slide origin-top invisible opacity-0 blur-sm duration-500 flex-none w-screen">
								<div className="origin-top flex-none w-screen">
									<div className="max-w-lg mx-auto px-4">
										<div className="mb-6">
											<p className="text-xl font-medium">
												<span className="w-6 h-6 bg-topaz-light/75 text-onyx rounded  border-2 border-onyx text-base inline-flex items-center justify-center">
													7
												</span>{" "}
												which of these are you interested in?
											</p>
										</div>
										<fieldset className="space-y-5">
											{fundingArray.map((f, i) => {
												return (
													<div key={f} className="relative flex items-center">
														<div className="flex h-5 items-center">
															<input
																id={f}
																aria-describedby={`${f}-description`}
																name={f}
																type="checkbox"
																className="h-4 w-4 rounded border-gray-300 text-topaz focus:ring-topaz"
																checked={selectFunding[f] || false}
																onChange={handleSelectFunding}
															/>
														</div>
														<div className="ml-3 text-lg">
															<label
																htmlFor={f}
																className="font-medium text-gray-700"
															>
																{f}
															</label>
														</div>
													</div>
												);
											})}
										</fieldset>
										{step7Err && (
											<div className="text-red-500 mt-4">
												<span>{step7Err}</span>
											</div>
										)}
										<div className="mt-6 sm:mt-12">
											{/* <Link href="/business-updated" className="group grid"> */}
											<button
												id="submit-profile-information"
												disabled={!authToken || isLoading}
												aria-disabled={!authToken || isLoading}
												onClick={handleSubmit}
												className={`group grid ${
													isLoading ? "cursor-not-allowed opacity-50" : ""
												}`}
											>
												<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform"></span>
												<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
													submit
												</span>
											</button>
										</div>
										{!(
											store?.activeProfileInfo?.isLinesOfCredit ||
											store?.activeProfileInfo?.isBusinessCreditCards ||
											store?.activeProfileInfo?.isSbaLoans ||
											store?.activeProfileInfo?.isVendorAccounts
										) && (
											<div className="text-red-500 mt-4">
												<span>
													{store?.activeProfileInfo?.interestedInNote}
												</span>
											</div>
										)}
									</div>
								</div>
							)}
						</form>
					</div>
				</div>
				<footer className="flex items-center px-4 space-x-6 fixed bottom-0 left-0 w-full py-4 bg-pearl-shade border-t-2 border-onyx">
					{step > 1 && (
						<button
							id="previous"
							onClick={handleBack}
							className="flex-none pl-2 pr-4 h-12 bg-onyx rounded text-white flex items-center justify-center group"
						>
							<ArrowLeftSvg />
							<span>back</span>
						</button>
					)}
					<div className="relative group w-full flex justify-center items-center flex-col">
						<h4 className="text-xs z-[2] tracking-wider text-onyx dark:text-pearl">
							<span id="count-bottom">{step}</span> of 7
						</h4>
						<div className="bg-pearl dark:bg-onyx h-4 max-w-xs w-full rounded-sm relative overflow-hidden box-border">
							{/* USE delay-300 if provided slide animation */}
							{/* <div id="progress-bar" style={{transform: `translateX(-${100 - step * 14.2857}%)`}} className="w-full h-4 border-2 duration-500 delay-300 border-onyx-light absolute bg-gold"></div> */}
							<div
								id="progress-bar"
								style={{
									transform: `translateX(-${100 - step * 14.2857}%)`,
								}}
								className="w-full h-4 border-2 duration-500 border-onyx-light absolute bg-gold"
							></div>
							<div className="w-full h-4 border-2 border-onyx-light absolute inset-0"></div>
						</div>
					</div>
					{step !== 7 && (
						<button
							id="next"
							onClick={handleNext}
							className="flex-none pr-2 pl-4 h-12 bg-onyx rounded text-white flex items-center justify-center group"
						>
							<span>next</span>
							<ArrowRightSvg styleProps="h-6 w-6 group-hover:left-1 relative duration-150 transition-all" />
						</button>
					)}
				</footer>
			</div>
		</div>
	);
};

export default AdditionalInformation;
