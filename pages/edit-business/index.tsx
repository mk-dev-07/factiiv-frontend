import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { useFactiivStore } from "../../store";
import Image from "next/image";
import PlaceholderPic from "../../public/images/placeholder.png";
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import useProtected from "../../hooks/useProtected";
import Profile from "../../types/profile.interface";
import React from "react";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import getConfig from "next/config";
import dynamic from "next/dynamic";
import { useLeavePageConfirm } from "../../hooks/useLeavePageConfirm";
import BusinessDocumentation from "../../components/business-documentation";
import { states } from "../../data/states";
import Link from "next/link";
import useProfile from "../../hooks/useProfile";
import Tooltip from "../../components/tooltip";
import IndustryFormField from "../../components/form/industry-form-field";
import { handleFileUpload } from "../../utils/file-uploader.utils";

const EditBusiness = () => {
	useProtected();
	const store = useFactiivStore();
	const { activeProfile, token, activeProfileInfo } = store;
	const { refreshedFetch } = useAuthenticatedFetch();
	const router = useRouter();
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();
	const { refetch: refetchActiveProfile } = useProfile({ fetchSurvey: true });

	const refreshProfile = useCallback(() => {
		refetchActiveProfile();
	}, [activeProfile?.id]);
	useEffect(() => {
		window.addEventListener("focus", refreshProfile);
		return () => {
			window.removeEventListener("focus", refreshProfile);
		};
	}, [activeProfile]);

	const WEBSITE_REGEX =
		/^(?:(https?):\/\/)?(www\.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

	const [isLoading, setIsLoading] = useState(false);
	const [infoEdited, setInfoEdited] = useState(false);

	useLeavePageConfirm(infoEdited);

	//Update Business Profile data
	const updateProfileData = async (data: Profile) => {
		const trimmedData = Object.entries(data).map(([key, value]) => [
			key,
			value?.trim?.() || value,
		]);

		const updateProfileResponse = await refreshedFetch(
			`${apiUrl}/profiles/${activeProfile.id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${store.token}`,
				},
				body: JSON.stringify(Object.fromEntries(trimmedData)),
			}
		);

		const result = await updateProfileResponse.json();

		if (!updateProfileResponse.ok) {
			throw new Error(result?.errors?.join("\n") ?? "");
		}

		formikBusinessInfo.setStatus("profile updated successfully");
		setTimeout(() => {
			formikBusinessInfo.setStatus("");
		}, 3000);
		const { payload: profile } = result;
		return profile;
	};

	const updateProfileImage = async (data: any) => {
		const updateProfileResponse = await refreshedFetch(
			`${apiUrl}/profiles/${activeProfile.id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${store.token}`,
				},
				body: JSON.stringify(data),
			}
		);
		const result = await updateProfileResponse.json();

		if (!updateProfileResponse.ok) {
			throw new Error(result?.errors?.join("\n") ?? "");
		}

		formikBusinessInfo.setStatus("profile updated successfully");
		setTimeout(() => {
			formikBusinessInfo.setStatus("");
		}, 3000);
		const { payload: profile } = result;
		return profile;
	};

	const getInitialValues = () => {
		const {
			factiivAddress,
			businessName,
			ein,
			phoneNumber,
			website,
			street,
			city,
			country,
			zip,
			state,
			imagePath,
			ownerName,
			email,
			googleBusiness,
			phoneListing,
			isOwner,
			industry,
		} = store.activeProfile;

		return {
			factiivLink: factiivAddress || "",
			fullBusinessName: businessName || "",
			ownerName: ownerName || "",
			businessEmail: email || "",
			ein: ein || "",
			businessPhone: phoneNumber || "",
			businessWebsite: website || "",
			streetAddress: street || "",
			city: city || "",
			stateOrProvince: state || "",
			zipOrPostalCode: zip || "",
			country: country || "",
			businessImage: imagePath || "",
			googleBusiness: googleBusiness || "",
			phoneListing: phoneListing || "",
			isOwner: isOwner || false,
			industry: industry || "",
		};
	};

	const formikBusinessInfo = useFormik({
		initialValues: getInitialValues(),
		validationSchema: Yup.object({
			ownerName: Yup.string().required("please, enter the owner name"),
			isOwner: Yup.boolean(),
			fullBusinessName: Yup.string().required(
				"please, enter full business name"
			),
			businessEmail: Yup.string()
				.email("business email must be a valid email")
				.required(
					"please, enter an email address associated with your business"
				),
			ein: Yup.string()
				.when("country", {
					is: (country: string) => country === "United States",
					then: (schema) =>
						schema.matches(
							/^\d{2}-\d{7}$/,
							"EIN number must only contain digits in xx-xxxxxxx format"
						),
					otherwise: (schema) =>
						schema.matches(
							/[0-9-]+/,
							"EIN number must only contain digits in xx-xxxxxxx format"
						),
				})
				.required("please, enter the EIN number"),
			businessPhone: Yup.string().matches(
				/^[+]?([ (]?[0-9]+[- )]?)+$/,
				"please, enter a phone number"
			),
			businessWebsite: Yup.string().matches(
				WEBSITE_REGEX,
				"business website must be a valid URL"
			),
			streetAddress: Yup.string(),
			city: Yup.string(),
			stateOrProvince: Yup.string(),
			zipOrPostalCode: Yup.string(),
			country: Yup.string(),
			industry: Yup.string().required(
				"please, enter a business vertical your business is in"
			),
			googleBusiness: Yup.string().matches(
				WEBSITE_REGEX,
				"google business listing must be a valid URL"
			),
			phoneListing: Yup.string(),
		}),
		onSubmit: async (values) => {
			setInfoEdited(false);
			setIsLoading(true);
			formikBusinessInfo.setStatus("");

			let profile;

			try {
				profile = await updateProfileData({
					...activeProfile,
					...values,
					ownerName: values.ownerName || activeProfile.ownerName,
					email: values.businessEmail || activeProfile.email,
					businessName: values.fullBusinessName,
					phoneNumber: values.businessPhone || "",
					website: values.businessWebsite || "",
					street: values.streetAddress || "",
					state: values.stateOrProvince || "",
					zip: values.zipOrPostalCode || "",
				});
			} catch (error: unknown) {
				const errorMessage = (error as Error).message;
				formikBusinessInfo.setStatus(
					errorMessage
						? "There were problems saving your information, please check the following errors:\n" +
								errorMessage
						: "There was an error with updating your profile."
				);
				setIsLoading(false);
				return;
			}

			store.updateActiveProfile({ ...profile });
			setIsLoading(false);
		},
	});

	//Upload image
	const [image, setImage] = useState<File | null>(null);
	const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
	const [imageUploadError, setImageUploadError] = useState<string>("");
	const uploadToClient = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event?.target?.files && !event?.target?.files?.[0]) {
			return;
		}

		const profileId = activeProfile.id;
		if (!profileId) return;

		const profilePicture = event.target.files[0];
		setImage(profilePicture);
		setIsImageLoading(true);

		try {
			const fileUploadCallback = async (success: boolean, data: any) => {
				if (success) {
					console.log("file data", data);
					const profile = await updateProfileImage({
						imagePath: data,
					});
					if (!profile) {
						throw new Error("Image upload failed");
					}
					store.updateActiveProfile(profile);
					store.updatePictureUploadedTimestamp(Date.now());
					setIsImageLoading(false);
				} else {
					setIsImageLoading(false);
					setImageUploadError(
						(data as Error)?.message ?? "There was an error with image upload"
					);
				}
				// if form values have changed, don't set the submit button to false
				if (!formikBusinessInfo.dirty) {
					setInfoEdited(false);
				}
			};
			const type = profilePicture.name.split(".")[1];
			const fileName = profileId + "-PI." + type;
			handleFileUpload(profilePicture, fileName, fileUploadCallback);
		} catch (error) {
			setImageUploadError("There was an error during image upload");
			setIsImageLoading(false);
			setImage(null);
			// if form values have changed, don't set the submit button to false
			console.log("formikBusinessInfo.dirty", formikBusinessInfo.dirty);
			if (!formikBusinessInfo.dirty) {
				setInfoEdited(false);
			}
		}
	};

	const uploadImage = async (image: File): Promise<Profile> => {
		if (!image) return activeProfile;

		const profileId = activeProfile.id;
		if (!profileId) return activeProfile;

		const body = new FormData();
		body.append("image", image);

		const response = await refreshedFetch(
			`${apiUrl}/profiles/images/${profileId}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${store.token}`,
				},
				body,
			}
		);

		const data = await response.json();

		if (!response.ok) {
			throw new Error("Image upload failed");
		}

		return data.payload;
	};

	const [businessImageSrc, setBusinessImageSrc] = useState("");
	useEffect(() => {
		if (!activeProfile.imagePath) return;

		setBusinessImageSrc(activeProfile?.imagePath);
	}, [activeProfile, activeProfile.imagePath, store.pictureUploadedTimestamp]);

	const submitBusinessInfoForm = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		if (formikBusinessInfo.touched && !formikBusinessInfo.isValid) {
			const formikErrorFields = formikBusinessInfo.errors;
			const focusFieldId = Object.keys(formikErrorFields).at(0);
			const focusField = document.querySelector(
				"#" + focusFieldId
			) as HTMLInputElement;
			if (!focusFieldId || !focusField) {
				return;
			}

			focusField.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "nearest",
			});
			setTimeout(() => {
				focusField.focus();
			}, 400);
			return;
		}

		formikBusinessInfo.submitForm();
	};

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			{/* {isLoading && <LoadingOverlay />} */}
			<Head>
				<title>edit business | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
						<LogoSvg />
					</div>
					<HeaderActions></HeaderActions>

					{/* EDIT BUSINESS PROFILE */}
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 astro-UHFQUROE">
						<div className=" pb-12 astro-UHFQUROE">
							<main className="lg:px-6 w-full pb-10">
								<form
									onChange={() => {
										console.log("setInfoEdited(true)");
										setInfoEdited(true);
									}}
								>
									<div className="flex justify-between items-center mb-2">
										<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
											{" "}
											edit business profile{" "}
										</h2>
										{!activeProfileInfo?.infoUnderReview ? (
											<Link
												href={"/information"}
												className="group grid disabled"
												id="submit-onboarding"
											>
												<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>
												<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-1 px-3 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
													take survey again
												</span>
											</Link>
										) : (
											<button
												id="under-review-button"
												disabled={true}												
												className={`opacity-50 cursor-not-allowed bg-onyx 
												inline-flex justify-center rounded border border-transparent py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2`}
											>
												your information is under review
											</button>
										)}
									</div>
									{/* BUSINESS INFORMATION */}
									<div className="border-2 border-onyx target:border-topaz rounded-md bg-pearl p-2 lg:p-6 mb-6">
										<div className="mb-4">
											<p className="font-medium text-2xl">
												business information
											</p>
										</div>
										<div className="grid grid-cols-4 gap-4">
											<div className="col-span-4">
												<label
													htmlFor="business-pfp"
													className="block font-medium text-onyx"
												>
													business profile pic
												</label>
												<div className="mt-1 flex items-center">
													{businessImageSrc && (
														<div className="relative h-12 w-12 flex items-center justify-center">
															<img
																className={`rounded-full w-full h-full border-2 border-onyx z-[2] object-cover ${
																	isImageLoading ? "opacity-50" : ""
																}`}
																src={businessImageSrc}
																alt={
																	(activeProfile.businessName || "") +
																	" profile picure"
																}
															/>
														</div>
													)}
													{!(image || businessImageSrc) ? (
														<div className="relative h-12 w-12">
															<img
																className="rounded-full h-full w-full  border-2 border-onyx z-[2] object-cover"
																src={PlaceholderPic.src}
															/>
														</div>
													) : null}
													<div className="ml-4 flex">
														<div className="cursor-pointer relative flex items-center rounded-md bg-pearl border-2 border-onyx focus-within:outline-none focus-within:ring-2 focus-within:ring-topaz focus-within:ring-offset-2 focus-within:ring-offset-blue-gray-50 hover:bg-blue-gray-50">
															<label
																htmlFor="image"
																className={
																	"py-2 px-3 relative text-sm font-medium text-blue-gray-900" +
																	(!isImageLoading ? " cursor-pointer" : "") +
																	(isImageLoading
																		? " opacity-50 cursor-not-allowed"
																		: "")
																}
															>
																<span>change</span>
																<span className="sr-only">
																	change business profile pic
																</span>
															</label>
															<input
																disabled={isImageLoading}
																id="image"
																name="image"
																type="file"
																onChange={uploadToClient}
																accept=".jpg,.jpeg,.png"
																className={
																	"absolute inset-0 h-full w-full rounded-md border-gray-300 opacity-0 z-[-1]"
																}
															/>
														</div>
													</div>
													{imageUploadError && (
														<p className="pl-4 text-red-500">
															{imageUploadError}
														</p>
													)}
												</div>
											</div>
											<div className="col-span-4">
												<div className="h-20">
													<label
														htmlFor="factiivLink"
														className="relative block font-medium text-onyx"
													>
														factiiv link{" "}
														<Tooltip
															text={`This feature will be implemented in the
																	future. It will connect your business and
																	Factiiv to improve your experience`}
														></Tooltip>
													</label>
													<div className="relative mt-1 rounded">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pr-2 border-2 rounded-l border-onyx bg-gray-100">
															<span className="text-onyx">
																credit.factiiv.io/
															</span>
														</div>
														<input
															disabled
															id="factiivLink"
															name="factiivLink"
															type="text"
															className="block w-full rounded border-2 border-onyx pl-[8.5rem] pr-12 py-2 focus:border-topaz focus:ring-topaz bg-gray-100"
															onChange={formikBusinessInfo.handleChange}
															onBlur={formikBusinessInfo.handleBlur}
															value={formikBusinessInfo.values.factiivLink}
														/>
													</div>
													{formikBusinessInfo.touched.factiivLink &&
														formikBusinessInfo.errors.factiivLink ? (
															<div className="text-red-500">
																{formikBusinessInfo.errors.factiivLink}
															</div>
														) : null}
												</div>
											</div>
											<div className="col-span-4 lg:col-span-2">
												<div>
													<label
														htmlFor="ownerName"
														className="block font-medium text-onyx"
													>
														owner name
													</label>
													<div className="mt-1">
														<input
															id="ownerName"
															name="ownerName"
															type="text"
															placeholder=" "
															disabled={
																!!activeProfile.ownerName &&
																activeProfile.dataUnderReview
															}
															spellCheck="false"
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
															onChange={formikBusinessInfo.handleChange}
															onBlur={formikBusinessInfo.handleBlur}
															value={formikBusinessInfo.values.ownerName}
														/>
													</div>
													{formikBusinessInfo.touched.ownerName &&
														formikBusinessInfo.errors.ownerName ? (
															<div className="text-red-500">
																{formikBusinessInfo.errors.ownerName}
															</div>
														) : null}
													{!formikBusinessInfo.touched.ownerName &&
														!activeProfile.isOwnerName &&
														(!activeProfile?.isReviewed ? (
															<div className="text-red-500">
																Not reviewed yet.
															</div>
														) : activeProfile.ownerNameNote ? (
															<div className="text-red-500">
																{activeProfile.ownerNameNote ||
																	"Rejected by admin"}
															</div>
														) : null)}
												</div>
											</div>
											<div className="col-span-4 lg:col-span-2 flex flex-col justify-center">
												<div className="flex flex-1">
													<div className="flex items-center space-x-4">
														<div className="mt-1">
															<input
																id="isOwner"
																name="isOwner"
																disabled={activeProfile.dataUnderReview}
																checked={formikBusinessInfo.values.isOwner}
																onBlur={formikBusinessInfo.handleBlur}
																onChange={formikBusinessInfo.handleChange}
																type="checkbox"
																placeholder=" "
																spellCheck={false}
																className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
															/>
														</div>
													</div>
													<label
														htmlFor="isOwner"
														className="text-md flex items-center ml-3 select-none"
													>
														are you the owner of this business?
													</label>
												</div>
												{formikBusinessInfo.touched.isOwner &&
													formikBusinessInfo.errors.isOwner ? (
														<div className="text-red-500">
															{formikBusinessInfo.errors.ownerName}
														</div>
													) : null}
												{!formikBusinessInfo.touched.isOwner &&
													!activeProfile.isIsOwner &&
													(!activeProfile?.isReviewed ? (
														<div className="text-red-500">
															Not reviewed yet.
														</div>
													) : activeProfile.isOwnerNote ? (
														<div className="text-red-500">
															{activeProfile.isOwnerNote || "Rejected by admin"}
														</div>
													) : null)}
											</div>
											<div className="col-span-4 lg:col-span-2">
												<div>
													<label
														htmlFor="fullBusinessName"
														className="block font-medium text-onyx"
													>
														full business name
													</label>
													<div className="mt-1">
														<input
															id="fullBusinessName"
															name="fullBusinessName"
															type="text"
															placeholder=" "
															spellCheck="false"
															disabled={
																!!activeProfile.businessName &&
																activeProfile.dataUnderReview
															}
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
															onChange={formikBusinessInfo.handleChange}
															onBlur={formikBusinessInfo.handleBlur}
															value={formikBusinessInfo.values.fullBusinessName}
														/>
													</div>
													{formikBusinessInfo.touched.fullBusinessName &&
														formikBusinessInfo.errors.fullBusinessName ? (
															<div className="text-red-500">
																{formikBusinessInfo.errors.fullBusinessName}
															</div>
														) : null}
													{!formikBusinessInfo.touched.fullBusinessName &&
														!activeProfile.isBusinessName &&
														(!activeProfile?.isReviewed ? (
															<div className="text-red-500">
																Not reviewed yet.
															</div>
														) : activeProfile.businessNameNote ? (
															<div className="text-red-500">
																{activeProfile.businessNameNote ||
																	"Rejected by admin"}
															</div>
														) : null)}
												</div>
											</div>
											<div className="col-span-4 lg:col-span-2">
												<div>
													<label
														htmlFor="ein"
														className="block font-medium text-onyx"
													>
														EIN
													</label>
													<div className="mt-1">
														<input
															id="ein"
															name="ein"
															type="text"
															placeholder=" "
															spellCheck="false"
															disabled={
																!!activeProfile.ein &&
																activeProfile.dataUnderReview
															}
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
															onChange={formikBusinessInfo.handleChange}
															onBlur={formikBusinessInfo.handleBlur}
															value={formikBusinessInfo.values.ein}
														/>
													</div>
													{formikBusinessInfo.touched.ein &&
														formikBusinessInfo.errors.ein ? (
															<div className="text-red-500">
																{formikBusinessInfo.errors.ein}
															</div>
														) : null}
													{!formikBusinessInfo.touched.ein &&
														!activeProfile.isEin &&
														(!activeProfile?.isReviewed ? (
															<div className="text-red-500">
																Not reviewed yet.
															</div>
														) : activeProfile.businessEINNote ? (
															<div className="text-red-500">
																{activeProfile.businessEINNote ||
																	"Rejected by admin"}
															</div>
														) : null)}
												</div>
											</div>
											<div className="col-span-4 lg:col-span-2">
												<div>
													<label
														htmlFor="businessPhone"
														className="block font-medium text-onyx"
													>
														business phone
													</label>
													<div className="mt-1">
														<input
															id="businessPhone"
															name="businessPhone"
															type="phone"
															placeholder=" "
															spellCheck="false"
															disabled={
																!!activeProfile.phoneNumber &&
																activeProfile.dataUnderReview
															}
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
															onChange={formikBusinessInfo.handleChange}
															onBlur={formikBusinessInfo.handleBlur}
															value={formikBusinessInfo.values.businessPhone}
														/>
													</div>
													{formikBusinessInfo.touched.businessPhone &&
														formikBusinessInfo.errors.businessPhone ? (
															<div className="text-red-500">
																{formikBusinessInfo.errors.businessPhone}
															</div>
														) : null}
													{!formikBusinessInfo.touched.businessPhone &&
														!activeProfile.isPhoneNumber &&
														(!activeProfile?.isReviewed ? (
															<div className="text-red-500">
																Not reviewed yet.
															</div>
														) : activeProfile.businessPhoneNote ? (
															<div className="text-red-500">
																{activeProfile.businessPhoneNote ||
																	"Rejected by admin"}
															</div>
														) : null)}
												</div>
											</div>
											<div className="col-span-4 lg:col-span-2">
												<div>
													<label
														htmlFor="businessWebsite"
														className="block font-medium text-onyx"
													>
														business website
													</label>
													<div className="mt-1">
														<input
															id="businessWebsite"
															name="businessWebsite"
															type="text"
															placeholder=" "
															spellCheck="false"
															disabled={
																!!activeProfile.website &&
																activeProfile.dataUnderReview
															}
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
															onChange={formikBusinessInfo.handleChange}
															onBlur={formikBusinessInfo.handleBlur}
															value={formikBusinessInfo.values.businessWebsite}
														/>
													</div>
													{formikBusinessInfo.touched.businessWebsite &&
														formikBusinessInfo.errors.businessWebsite ? (
															<div className="text-red-500">
																{formikBusinessInfo.errors.businessWebsite}
															</div>
														) : null}
													{!formikBusinessInfo.touched.businessWebsite &&
														!activeProfile.isWebsite &&
														(!activeProfile?.isReviewed ? (
															<div className="text-red-500">
																Not reviewed yet.
															</div>
														) : activeProfile.businessWebsiteNote ? (
															<div className="text-red-500">
																{activeProfile.businessWebsiteNote ||
																	"Rejected by admin"}
															</div>
														) : null)}
												</div>
											</div>
											<div className="col-span-4">
												<div>
													<label
														htmlFor="businessEmail"
														className="block font-medium text-onyx"
													>
														business email
													</label>
													<div className="mt-1">
														<input
															id="businessEmail"
															name="businessEmail"
															type="email"
															placeholder=" "
															spellCheck="false"
															disabled={
																!!activeProfile.email &&
																activeProfile.dataUnderReview
															}
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
															onChange={formikBusinessInfo.handleChange}
															onBlur={formikBusinessInfo.handleBlur}
															value={formikBusinessInfo.values.businessEmail}
														/>
													</div>
													{formikBusinessInfo.touched.businessEmail &&
														formikBusinessInfo.errors.businessEmail ? (
															<div className="text-red-500">
																{formikBusinessInfo.errors.businessEmail}
															</div>
														) : null}
													{!formikBusinessInfo.touched.businessEmail &&
														!activeProfile.isEmail &&
														(!activeProfile?.isReviewed ? (
															<div className="text-red-500">
																Not reviewed yet.
															</div>
														) : activeProfile.businessEmailNote ? (
															<div className="text-red-500">
																{activeProfile.businessEmailNote ||
																	"Rejected by admin"}
															</div>
														) : null)}
												</div>
											</div>
											<div className="grid grid-cols-6 gap-4 col-span-4">
												<div className="col-span-6">
													<div>
														<label
															htmlFor="streetAddress"
															className="block font-medium text-onyx"
														>
															street address
														</label>
														<div className="mt-1">
															<input
																id="streetAddress"
																name="streetAddress"
																type="text"
																autoFocus
																placeholder=" "
																autoComplete="street-address"
																spellCheck="false"
																disabled={
																	!!activeProfile.street &&
																	activeProfile.dataUnderReview
																}
																className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
																onChange={formikBusinessInfo.handleChange}
																onBlur={formikBusinessInfo.handleBlur}
																value={formikBusinessInfo.values.streetAddress}
															/>
														</div>
														{formikBusinessInfo.touched.streetAddress &&
															formikBusinessInfo.errors.streetAddress ? (
																<div className="text-red-500">
																	{formikBusinessInfo.errors.streetAddress}
																</div>
															) : null}

														{!formikBusinessInfo.touched.streetAddress &&
															activeProfile.street &&
															!activeProfile.isStreet &&
															(!activeProfile?.isReviewed ? (
																<div className="text-red-500">
																	Not reviewed yet.
																</div>
															) : activeProfile.businessAddressNote ? (
																<div className="text-red-500">
																	{activeProfile.businessAddressNote ||
																		"Rejected by admin"}
																</div>
															) : null)}
													</div>
												</div>
												<div className="col-span-6 lg:col-span-2">
													<div>
														<label
															htmlFor="city"
															className="block font-medium text-onyx"
														>
															city
														</label>
														<div className="mt-1">
															<input
																id="city"
																name="city"
																type="text"
																placeholder=" "
																autoComplete="address-level2"
																spellCheck="false"
																disabled={
																	!!activeProfile.city &&
																	activeProfile.dataUnderReview
																}
																className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
																onChange={formikBusinessInfo.handleChange}
																onBlur={formikBusinessInfo.handleBlur}
																value={formikBusinessInfo.values.city}
															/>
														</div>
													</div>
													{formikBusinessInfo.touched.city &&
														formikBusinessInfo.errors.city ? (
															<div className="text-red-500">
																{formikBusinessInfo.errors.city}
															</div>
														) : null}
												</div>
												<div className="col-span-6 lg:col-span-2">
													<div>
														<label
															htmlFor="stateOrProvince"
															className="block font-medium text-onyx"
														>
															state / province
														</label>
														<div className="mt-1">
															<input
																id="stateOrProvince"
																name="stateOrProvince"
																type="text"
																placeholder=" "
																disabled={
																	!!activeProfile.state &&
																	activeProfile.dataUnderReview
																}
																autoComplete="address-level1"
																spellCheck="false"
																className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
																onChange={formikBusinessInfo.handleChange}
																onBlur={formikBusinessInfo.handleBlur}
																value={
																	formikBusinessInfo.values.stateOrProvince
																}
															/>
														</div>
														{formikBusinessInfo.touched.stateOrProvince &&
															formikBusinessInfo.errors.stateOrProvince ? (
																<div className="text-red-500">
																	{formikBusinessInfo.errors.stateOrProvince}
																</div>
															) : null}
													</div>
												</div>
												<div className="col-span-6 lg:col-span-2">
													<div>
														<label
															htmlFor="zipOrPostalCode"
															className="block font-medium text-onyx"
														>
															zip / postal code
														</label>
														<div className="mt-1">
															<input
																id="zipOrPostalCode"
																name="zipOrPostalCode"
																type="text"
																placeholder=" "
																disabled={
																	!!activeProfile.zip &&
																	activeProfile.dataUnderReview
																}
																autoComplete="postal-code"
																spellCheck="false"
																className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
																onChange={formikBusinessInfo.handleChange}
																onBlur={formikBusinessInfo.handleBlur}
																value={
																	formikBusinessInfo.values.zipOrPostalCode
																}
															/>
														</div>
														{formikBusinessInfo.touched.zipOrPostalCode &&
															formikBusinessInfo.errors.zipOrPostalCode ? (
																<div className="text-red-500">
																	{formikBusinessInfo.errors.zipOrPostalCode}
																</div>
															) : null}
													</div>
												</div>
												<div className="col-span-6 lg:col-span-3">
													<div>
														<label
															htmlFor="country"
															className="block font-medium text-onyx"
														>
															country
														</label>
														<div className="mt-1">
															<select
																id="country"
																name="country"
																disabled={
																	!!activeProfile.country &&
																	activeProfile.dataUnderReview
																}
																onChange={formikBusinessInfo.handleChange}
																onBlur={formikBusinessInfo.handleBlur}
																value={formikBusinessInfo.values.country}
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
															{formikBusinessInfo.touched.country &&
																formikBusinessInfo.errors.country ? (
																	<div className="text-red-500">
																		{formikBusinessInfo.errors.country}
																	</div>
																) : null}
														</div>
													</div>
												</div>
												<IndustryFormField
													formik={formikBusinessInfo}
													profile={activeProfile}
													isAdmin={false}
												></IndustryFormField>
											</div>
										</div>
										<div className="pt-3 text-right">
											<button
												id="save-profile-info"
												disabled={!infoEdited || isLoading || isImageLoading}
												type="submit"
												className={`${
													(!infoEdited || isLoading || isImageLoading)
														? "opacity-50 cursor-not-allowed bg-onyx"
														: ""
												}
												${(infoEdited && !isImageLoading) ? "bg-red-500" : ""}
												inline-flex justify-center rounded border border-transparent py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2`}
												onClick={submitBusinessInfoForm}
											>
												save
											</button>
										</div>
										{formikBusinessInfo.status && (
											<div className="mt-2">
												{formikBusinessInfo.status
													.split("\n")
													.map((line: string) => (
														<p key={line}>{line}</p>
													))}
											</div>
										)}
									</div>
									{/* BUSINESS DOCUMENTATION */}
									<BusinessDocumentation
										activeProfile={activeProfile}
										einFilePath={activeProfile.einDocumentPath}
										aoiFilePath={activeProfile.aoiDocumentPath}
										profileId={activeProfile.id}
										token={store.token}
										onFileUpload={(profile: Profile | undefined) => {
											if (!profile) return;

											setInfoEdited(false);
											store.updateActiveProfile(profile);
										}}
									></BusinessDocumentation>
									{/* BUSINESS LISTINGS */}
									<div
										id="listings"
										className="border-2 border-onyx target:border-topaz rounded-md bg-pearl p-2 lg:p-6 mb-6"
									>
										<div className="mb-4">
											<p className="font-medium text-2xl">business listings</p>
										</div>
										<div className="grid grid-cols-4 gap-4 mt-6">
											<div className="col-span-4 sm:col-span-2">
												<div>
													<label
														htmlFor="googleBusiness"
														className="block font-medium text-onyx"
													>
														Google business listing{" "}
														<Tooltip text="Your Google My Business listing shows searchers where and how to visit your business. In particular, a listing for a local business is more likely to appear when people search for a nearby business using Google Maps."></Tooltip>
													</label>
													<div className="mt-1">
														<input
															id="googleBusiness"
															disabled={
																!!activeProfile.googleBusiness &&
																activeProfile.dataUnderReview
															}
															name="googleBusiness"
															onChange={formikBusinessInfo.handleChange}
															onBlur={formikBusinessInfo.handleBlur}
															value={formikBusinessInfo.values.googleBusiness}
															placeholder=" "
															spellCheck="false"
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
														/>
													</div>
													{formikBusinessInfo.touched.googleBusiness &&
														formikBusinessInfo.errors.googleBusiness ? (
															<div className="text-red-500">
																{formikBusinessInfo.errors.googleBusiness}
															</div>
														) : null}
												</div>
											</div>
											<div className="col-span-4 sm:col-span-2">
												<div>
													<label
														htmlFor="phoneListing"
														className="block font-medium text-onyx"
													>
														411 listed number{" "}
														<Tooltip text="List your numbers in the 411 directory database. Business listing enables your business to appear as a local listing when people search for products and services in your business category."></Tooltip>
													</label>
													<div className="mt-1">
														<input
															id="phoneListing"
															name="phoneListing"
															disabled={
																!!activeProfile.phoneListing &&
																activeProfile.dataUnderReview
															}
															onChange={formikBusinessInfo.handleChange}
															onBlur={formikBusinessInfo.handleBlur}
															value={formikBusinessInfo.values.phoneListing}
															placeholder=" "
															spellCheck="false"
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
														/>
													</div>
													{formikBusinessInfo.touched.phoneListing &&
														formikBusinessInfo.errors.phoneListing ? (
															<div className="text-red-500">
																{formikBusinessInfo.errors.phoneListing}
															</div>
														) : null}
												</div>
											</div>
										</div>
										<div className="pt-3 text-right">
											<button
												id="save-listings"
												disabled={!infoEdited || isLoading || isImageLoading}
												type="submit"
												className={`${
													(!infoEdited || isLoading || isImageLoading)
														? "opacity-50 cursor-not-allowed bg-onyx"
														: ""
												}
												${(infoEdited && !isImageLoading) ? "bg-red-500" : ""}
												inline-flex justify-center rounded border border-transparent py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2`}
												onClick={submitBusinessInfoForm}
											>
												save
											</button>
										</div>
									</div>
								</form>
							</main>
						</div>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto">
						<div className="mt-12 w-full">
							<div className="w-full sticky top-6">
								<div className="relative mt-4">
									<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
										<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
											<b className="text-bold text-onyx px-1">fact</b>
										</p>
										<p>
											editing your business information may have a temporary
											impact on your reputation score if new information
											requires verification
										</p>
									</div>
									<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// export default EditBusiness;

export default dynamic(() => Promise.resolve(EditBusiness), { ssr: false });
