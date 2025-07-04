import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { FormEventHandler, useCallback, useEffect, useState } from "react";
import AdminAccountDropdown from "../../../components/admin/admin-account-dropdown";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import { LogoAdminSvg } from "../../../components/svgs/LogoAdminSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { registerWithFirebaseCredentials } from "../../../services/auth";
import { useAdminStore } from "../../../store";
import { IRegisterAdmin } from "../../../types/registerAdmin.interface";
import Image from "next/image";
import AccountPlaceholder from "../../../public/images/account.png";
import dynamic from "next/dynamic";
import LoadingOverlay from "../../../components/loading-overlay";
import { FirebaseError } from "firebase/app";
import { useMutation } from "react-query";
import { IAdmin } from "../../../types/admin.interface";
import { handleFileUpload } from "../../../utils/file-uploader.utils";

const CreateAdmin = () => {
	const router = useRouter();
	const store = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setUsername] = useState("");
	const [tempPassword, setTempPassword] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [createAdminError, setCreateAdminError] = useState("");
	const [isFormSubmitting, setIsFormSubmitting] = useState(false);
	const [infoEdited, setInfoEdited] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event?.preventDefault();
		try {
			const registerRequest = await registerWithFirebaseCredentials(
				email,
				tempPassword
			);
			const token = await registerRequest?.user?.getIdToken();
			if (!token) {
				throw new Error("firebase registration error");
			}

			const [username] = email.split("@");

			await registerAdmin({
				firstName,
				lastName,
				username,
				email,
				tempPassword,
				jwt: store.token,
			});

			router.push("/admin/dashboard");
		} catch (error: unknown) {
			const errorCode = (error as FirebaseError).code;

			if (errorCode === "auth/invalid-email") {
				setCreateAdminError("Email is invalid.");
			}

			if (errorCode === "auth/email-already-in-use") {
				setCreateAdminError("Email already in use.");
			}
		}
	};

	// UPLOAD ADMIN PHOTO
	const [adminProfilePicture, setAdminProfilePicture] = useState<File>();
	const addAdminPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e?.target?.files?.[0]) {
			return;
		}

		setAdminProfilePicture(e.target.files[0]);
	};

	const [adminPictureUrl, setAdminPictureUrl] = useState("");
	const getImagePreviewUrl = useEffect(() => {
		if(!adminProfilePicture) return;

		setAdminPictureUrl(URL.createObjectURL(adminProfilePicture));
	}, [adminProfilePicture]);

	const registerAdmin = async ({ jwt, ...data }: IRegisterAdmin) => {
		setIsLoading(true);
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();

		try {
			const createUserResponse = await refreshedFetch(`${apiUrl}/admins`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwt}`,
				},
				body: JSON.stringify(data),
			});
			const userData = await createUserResponse.json();
			if (!userData) {
				throw new Error(userData.errors || "Failed to register admin");
			}

			const userDataWithPicture = await uploadPicture(userData.payload);

			setIsLoading(false);
			return userDataWithPicture;
		} catch (error) {
			// console.error(error);
			setIsLoading(false);
			setCreateAdminError(
				typeof error === "string" ? error : "Failed to register admin"
			);
		}
	};

	const { mutate: uploadPicture } = useMutation(async (admin: IAdmin) => {
		if (!adminProfilePicture) return;

		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();

		const adminId = admin?.id;
		if (!adminId) return;

		const fileUploadCallback = async (success: boolean, data: any) => {
			if (success) {
				console.log("file data", data);
				const response = await refreshedFetch(`${apiUrl}/admins/images-update/${adminId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`,
					},
					body: JSON.stringify({
						imagePath: data
					}),
				});

				const resData: { payload: IAdmin } = await response.json();

				if (!response.ok) {
					console.log(resData);
					throw new Error("There was an error updating your profile");
				}
				return resData.payload;
			
			} else {
				setCreateAdminError(
					(data as Error)?.message ?? "There was an error with image upload"
				);
				setTimeout(() => {
					setCreateAdminError("");
				}, 3000);
				return admin;
			}
		};

		const type = adminProfilePicture.name.split(".")[1];
		const fileName = `${adminId}${admin?.isPrimary? "-SAI." : "-AI."}${type}`;
		handleFileUpload(adminProfilePicture, fileName, fileUploadCallback);


		// const body = new FormData();
		// body.append("image", adminProfilePicture);
		// try {
		// 	const response = await refreshedFetch(
		// 		`${apiUrl}/admins/images/${adminId}`,
		// 		{
		// 			method: "POST",
		// 			headers: {
		// 				Authorization: `Bearer ${store.token}`,
		// 			},
		// 			body,
		// 		}
		// 	);
		// 	const data = await response.json();

		// 	if (!response.ok) {
		// 		setCreateAdminError(
		// 			data?.errors?.[0] || "There was an error with image upload"
		// 		);
		// 		setTimeout(() => {
		// 			setCreateAdminError("");
		// 		}, 3000);
		// 		return admin;
		// 	}

		// 	return data.payload;
		// } catch (error) {
		// 	return admin;
		// }
	});

	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full"
		>
			<Head>
				<title>Create admin | factiiv</title>
			</Head>
			{isLoading && <LoadingOverlay></LoadingOverlay>}
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
				<AdminSidebar />

				<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 astro-FRXN4BQ7">
					{/* <Search client:visible /> */}
				</div>

				<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 astro-FRXN4BQ7">
					<LogoAdminSvg />
				</div>

				<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6 astro-FRXN4BQ7">
					<MobileNav />
				</div>

				{/* MAIN */}
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
					<div className=" pb-12">
						<main className="lg:px-6 w-full">
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								create admin user
							</h2>
							<form onSubmit={handleSubmit}>
								<div className="gap-4 grid grid-cols-2">
									<div className="col-span-2 flex space-x-4 items-center">
										<div>
											<img
												id="pfp-display"
												className="border-2 h-16 w-16 border-onyx rounded-full"
												src={adminPictureUrl || AccountPlaceholder.src}
												alt="Account pic"
												style={{objectFit: "cover"}}
											/>
										</div>
										<div>
											<label
												className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
												htmlFor="file_input"
											>
												profile pic
											</label>
											<input
												id="profile-picture-admin"
												name="profile-picture-admin"
												className="block lowercase w-full text-sm py-3 pl-3 text-gray-900 border-2 border-onyx rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
												type="file"
												onChange={addAdminPicture}
												accept=".png,.jpg,.jpeg"
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="first-name"
											className="block font-medium text-onyx"
										>
											first name
										</label>
										<div className="mt-1">
											<input
												value={firstName}
												onChange={(e) => setFirstName(e.target.value)}
												id="first-name"
												name="first-name"
												placeholder=" "
												spellCheck="false"
												required
												className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="last-name"
											className="block font-medium text-onyx"
										>
											last name
										</label>
										<div className="mt-1">
											<input
												value={lastName}
												onChange={(e) => setLastName(e.target.value)}
												id="last-name"
												name="last-name"
												placeholder=" "
												spellCheck="false"
												required
												className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
											/>
										</div>
									</div>
									<div className="col-span-2">
										<div>
											<label
												htmlFor="email"
												className="block font-medium text-onyx"
											>
												email
											</label>
											<div className="mt-1">
												<input
													type="email"
													value={email}
													onChange={(e) => setUsername(e.target.value)}
													id="email"
													name="email"
													placeholder=" "
													required
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
										</div>
									</div>
									<div className="col-span-2">
										<div>
											<label
												htmlFor="password"
												className="block font-medium text-onyx"
											>
												temp password
											</label>
											<div className="mt-1">
												<input
													value={tempPassword}
													onChange={(e) => setTempPassword(e.target.value)}
													id="password"
													name="password"
													placeholder=" "
													required
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="pt-3 text-right flex justify-end items-center">
									{!!createAdminError && (
										<p className="pr-4 text-red-500">{createAdminError}</p>
									)}
									<input
										disabled={isLoading}
										type="submit"
										value="submit"
										className={`inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2 ${
											isLoading ? "cursor-not-allowed opacity-50" : ""
										}`}
									></input>
								</div>
							</form>
						</main>
					</div>
				</div>
				<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto">
					<div className="w-full"></div>
				</div>
			</div>
		</div>
	);
};

// export default CreateAdmin;
export default dynamic(() => Promise.resolve(CreateAdmin), { ssr: false });
