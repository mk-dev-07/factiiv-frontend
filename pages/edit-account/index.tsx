import Head from "next/head";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { useFactiivStore } from "../../store";
import { useQuery } from "react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import useProtected from "../../hooks/useProtected";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useRouter } from "next/router";
import getConfig from "next/config";
import {
	linkWithEmail,
	linkWithGoogle,
	unlinkWithEmail,
	unlinkWithGoogle,
} from "../../services/auth";
import PlaceholderPic from "../../public/images/placeholder.png";
import { handleFileUpload } from "../../utils/file-uploader.utils";

const EditAccount = () => {
	useProtected();
	const store = useFactiivStore();
	const { refreshedFetch } = useAuthenticatedFetch();
	const router = useRouter();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [isGoogleLinked, setGoogleLinked] = useState(false);
	const [isEmailLinked, setEmailLinked] = useState(false);
	const [linkEmailError, setLinkEmailError] = useState("");
	const [linkGoogleError, setLinkGoogleError] = useState("");
	const [openEmailPopup, setEmailPopup] = useState(false);

	const [linkUserEmail, setLinkUserEmail] = useState("");
	const [linkUserPassword, setLinkUserPassword] = useState("");
	const [linkUserRepeatPassword, setLinkUserRepeatPassword] = useState("");
	const [linkPopupError, setLinkPopupError] = useState("");

	//GET USER'S DATA
	const fetchUserData = async () => {
		try {
			const response = await refreshedFetch(`${apiUrl}/users`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${store.token}`,
				},
			});
			const data = await response.json();
			return data.payload;
		} catch (error) {
			console.error(error);
		}
	};
	const [isFormSubmitting, setIsFormSubmitting] = useState(false);
	const { data, error, isLoading, refetch } = useQuery(
		"userData",
		fetchUserData,
		{
			onSuccess: (dataResponse) => {
				setFirstName(() => dataResponse?.firstName);
				setLastName(() => dataResponse?.lastName);
				//TODO: change username to email when edited on the server?
				setEmail(() => dataResponse?.email);
				setEmailLinked(() => dataResponse?.isEmailLinked);
				setGoogleLinked(() => dataResponse?.isGoogleLinked);
			},
		}
	);

	//EDIT, VALIDATE AND SAVE USER'S DATA
	const formik = useFormik({
		initialValues: {
			firstName,
			lastName,
			email,
		},
		enableReinitialize: true,
		validationSchema: Yup.object({
			firstName: Yup.string().required("please, enter your name"),
			lastName: Yup.string().required("please, enter your surname"),
			email: Yup.string().email().required("please, enter your email"),
		}),
		onSubmit: (values) => {
			if (!values) return;

			const [_, username] = values.email.match(/(.+)@.+/) ?? [];
			// const {userName, ...restValues} = values;
			const data = {
				...values,
				username,
			};
			updateUserData(data, store.token, true);
		},
	});

	const updateUserData = async (
		data: any,
		token: string | null,
		isRedirect: boolean
	) => {
		setIsFormSubmitting(true);
		const response = await refreshedFetch(`${apiUrl}/users`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const json = await response.json();

		if (!response.ok) {
			setIsFormSubmitting(false);
			throw new Error(json.message);
		}

		if (isRedirect) {
			router.push("/dashboard");
		} else {
			refetch();
		}
	};

	const linkGoogle = async () => {
		if (isGoogleLinked) return;

		setLinkGoogleError("");
		const googleLinkResult: {success: boolean,data: any} = await linkWithGoogle();
		console.log("googleLinkResult", googleLinkResult);
		if (googleLinkResult?.success) {
			//Update linking in the data base
			const [_, username] = email.match(/(.+)@.+/) ?? [];
			updateUserData(
				{ isGoogleLinked: true, username: username ?? email },
				store.token,
				false
			);
		} else {
			setLinkGoogleError(googleLinkResult?.data);
		}
	};

	const submitEmailLink = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!linkUserEmail) {
			setLinkPopupError("must provide an email");
			return;
		}
		if (!linkUserPassword || linkUserPassword !== linkUserRepeatPassword) {
			setLinkPopupError("password and repeat password should be the same");
			return;
		}

		setEmailPopup(false);
		setLinkPopupError("");

		if (isEmailLinked) return;

		setLinkEmailError("");
		const emailLinkResult: {success: boolean,data: any} = await linkWithEmail(
			linkUserEmail,
			linkUserPassword
		);
		console.log("emailLinkResult", emailLinkResult);
		if (emailLinkResult?.success) {
			const [_, username] = email.match(/(.+)@.+/) ?? [];
			updateUserData(
				{ isEmailLinked: true, username: username ?? email },
				store.token,
				false
			);
		} else {
			setLinkEmailError(emailLinkResult?.data);
		}
	};

	// upload Image
	const [image, setImage] = useState<File | null>(null);
	const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
	const [imageUploadError, setImageUploadError] = useState<string>("");
	const [accountImageSrc, setAccountImageSrc] = useState("");
	const { user } = store;

	const updateProfileImage = async (data: any) => {
		const updateProfileResponse = await refreshedFetch(
			`${apiUrl}/users`,
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

		formik.setStatus("profile updated successfully");
		setTimeout(() => {
			formik.setStatus("");
		}, 3000);
		const { payload: profile } = result;
		return profile;
	};

	const uploadToClient = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event?.target?.files && !event?.target?.files?.[0]) {
			return;
		}

		const profileId = data?.id;
		if (!profileId) return;

		const profilePicture = event.target.files[0];
		setImage(profilePicture);
		setIsImageLoading(true);

		try {
			const fileUploadCallback = async (success: boolean, imageData: any) => {
				if (success) {
					console.log("file data", imageData);
					const profile = await updateProfileImage({
						username: data.username,
						imagePath: imageData,
					});
					if (!profile) {
						throw new Error("Image upload failed");
					}
					refetch();
					store.updatePictureUploadedTimestamp(Date.now());
					setIsImageLoading(false);
				} else {
					setIsImageLoading(false);
					setImageUploadError(
						(imageData as Error)?.message ?? "There was an error with image upload"
					);
				}
			};
			const type = profilePicture.name.split(".")[1];
			const fileName = profileId + "-UI." + type;
			handleFileUpload(profilePicture, fileName, fileUploadCallback);
		} catch (error) {
			setImageUploadError("There was an error during upload");
			setIsImageLoading(false);
			setImage(null);
		}
	};

	useEffect(() => {
		if (!data?.imagePath) return;

		setAccountImageSrc(data?.imagePath);
	}, [data, data?.imagePath, store.pictureUploadedTimestamp]);

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Edit account | factiiv</title>
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
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
						<div className="pb-12">
							<main className="lg:px-6 w-full pb-10">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									edit account
								</h2>
								<form
									onSubmit={formik.handleSubmit}
									className="border-2 border-onyx rounded-md bg-pearl p-2 lg:p-6 mb-6"
								>
									<div className="mb-4">
										<p className="font-medium text-2xl">account data</p>
									</div>
									<div className="col-span-4 mb-4">
										<label
											htmlFor="business-pfp"
											className="block font-medium text-onyx"
										>
													account profile pic
										</label>
										<div className="mt-1 flex items-center">
											{(accountImageSrc  || isImageLoading) && (
												<div className="relative h-12 w-12 flex items-center justify-center">
													<img
														className={`rounded-full w-full h-full border-2 border-onyx z-[2] object-cover ${
															isImageLoading ? "opacity-50" : ""
														}`}
														src={accountImageSrc}
														alt={
															(user?.username || "") +
																	" profile picure"
														}
													/>
												</div>
											)}
											{!(image || accountImageSrc) ? (
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
									<div className="grid grid-cols-4 gap-4">
										<div className="col-span-4 lg:col-span-2">
											<div>
												<label className="block font-medium text-onyx">
													first name
												</label>
												<div className="mt-1">
													<input
														value={formik.values.firstName}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														id="firstName"
														name="firstName"
														type="text"
														placeholder=" "
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.firstName && formik.errors.firstName ? (
													<div className="text-red-500">
														{formik.errors.firstName}
													</div>
												) : null}
											</div>
										</div>
										<div className="col-span-4 lg:col-span-2">
											<div>
												<label className="block font-medium text-onyx">
													last name
												</label>
												<div className="mt-1">
													<input
														value={formik.values.lastName}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														id="lastName"
														name="lastName"
														type="text"
														placeholder=" "
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.lastName && formik.errors.lastName ? (
													<div className="text-red-500">
														{formik.errors.lastName}
													</div>
												) : null}
											</div>
										</div>
										<div className="col-span-4 lg:col-span-2">
											<div>
												<label className="block font-medium text-onyx">
													account email
												</label>
												<div className="mt-1">
													<input
														value={formik.values.email}
														disabled
														id="email"
														name="email"
														type="email"
														placeholder=" "
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.email && formik.errors.email ? (
													<div className="text-red-500">
														{formik.errors.email}
													</div>
												) : null}
											</div>
										</div>
									</div>
									<div className="pt-3 text-right">
										<button
											id="save-account-data"
											disabled={isFormSubmitting}
											type="submit"
											className={`${
												isFormSubmitting ? "cursor-not-allowed opacity-50" : ""
											} inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2`}
										>
											save
										</button>
									</div>
								</form>
								{/* Provider Section */}
								<div className="border-2 border-onyx rounded-md bg-pearl p-2 lg:p-6 mb-6">
									<div className="mb-4">
										<p className="font-medium text-2xl">Connected Providers</p>
									</div>
									<div className="grid grid-cols-4 gap-4">
										<div className="col-span-4 lg:col-span-2">
											<div>
												<label className="block font-medium text-onyx">
													email/password
												</label>
												<div className="mt-1">
													{isEmailLinked ? (
														<label className="block font-medium text-onyx">
															Email provider is already linked
														</label>
													) : (
														<button
															onClick={() => setEmailPopup(true)}
															id="link-email"
															className={
																"inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
															}
														>
															Link your email account
														</button>
													)}
												</div>
											</div>
											{linkEmailError ? (
												<div className="text-red-500 pt-2">
													{linkEmailError}
												</div>
											) : null}
											{/* <button
												onClick={unlinkWithEmail}
												id="link-google"
												className={
													"pt-2 inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
												}
											>
												Unlink Email account
											</button> */}
										</div>
										<div className="col-span-4 lg:col-span-2">
											<div>
												<label className="block font-medium text-onyx">
													Google Accouont
												</label>
												<div className="mt-1">
													{isGoogleLinked ? (
														<label className="block font-medium text-onyx">
															Google provider is already linked
														</label>
													) : (
														<button
															onClick={linkGoogle}
															id="link-google"
															className={
																"inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
															}
														>
															Link your google account
														</button>
													)}
												</div>
											</div>
											{linkGoogleError ? (
												<div className="text-red-500 pt-2">
													{linkGoogleError}
												</div>
											) : null}
											{/* <button
												onClick={unlinkWithGoogle}
												id="link-google"
												className={
													"inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
												}
											>
												Unlink google account
											</button> */}
										</div>
									</div>
								</div>
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
											changing your email will require verification of your new
											email
										</p>
									</div>
									<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{openEmailPopup && (
					<div
						className="fixed z-20"
						aria-labelledby="modal-title"
						role="dialog"
						aria-modal="true"
					>
						<div className="fixed inset-0 z-10 overflow-y-auto top-[10vh]">
							<div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0">
								<div className="relative transform overflow-hidden rounded-md border-2 border-onyx bg-pearl px-4 pt-5 pb-4 text-left transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 shadow-xl shadow-topaz/25">
									<div>
										<h3 className="text-center text-lg font-medium">
											{"Link Email Provider"}
										</h3>{" "}
										<div className="mx-auto flex items-center justify-center"></div>{" "}
										<div className="mt-3 sm:mt-5 items-center">
											<form className="space-y-4" onSubmit={submitEmailLink}>
												<div>
													<label
														htmlFor="email"
														className="block font-medium text-onyx"
													>
														email address
													</label>
													<div className="mt-1">
														<input
															value={linkUserEmail}
															onChange={(e) => setLinkUserEmail(e.target.value)}
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
														htmlFor="password"
														className="block font-medium text-onyx"
													>
														password
													</label>
													<div className="mt-1">
														<input
															value={linkUserPassword}
															onChange={(e) =>
																setLinkUserPassword(e.target.value)
															}
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
															value={linkUserRepeatPassword}
															onChange={(e) =>
																setLinkUserRepeatPassword(e.target.value)
															}
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
													className={`mt-4 relative group w-full ${
														isLoading ? "cursor-not-allowed opacity-50" : ""
													}`}
													disabled={isLoading}
												>
													<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
														submit
													</span>
													<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
												</button>
												{linkPopupError && (
													<h2 className="text-red-500 text-center">
														{linkPopupError}
													</h2>
												)}
											</form>
										</div>
									</div>{" "}
									<div className={"mt-5"}>
										<button
											className="group grid w-full"
											onClick={() => setEmailPopup(false)}
										>
											<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>{" "}
											<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
												close
											</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default EditAccount;
