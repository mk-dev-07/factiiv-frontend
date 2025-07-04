import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AdminAccountDropdown from "../../../components/admin/admin-account-dropdown";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import { useAdminStore } from "../../../store";
import AccountIcon from "../../../public/images/account.png";
import { useMutation, useQuery } from "react-query";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import getConfig from "next/config";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminLogoSvg from "../../../components/svgs/AdminLogoSvg";
import { getAuth, updatePassword } from "firebase/auth";
import dynamic from "next/dynamic";
import { IAdmin, IAdminResponse } from "../../../types/admin.interface";
import { useRouter } from "next/router";
import { handleFileUpload } from "../../../utils/file-uploader.utils";
import { enqueueSnackbar } from "notistack";

const EditUser = () => {
	const router = useRouter();
	const adminStore = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();

	const [firstName, setFirstName] = useState(adminStore.admin?.firstName);
	const [lastName, setLastName] = useState(adminStore.admin?.lastName);
	const [adminImage, setAdminImage] = useState("");
	const [displayName, setDisplayName] = useState(
		adminStore.admin ? adminStore.admin?.username : ""
	);
	const [changePassword] = useState("placeholder");
	const [isFormSubmitting, setIsFormSubmitting] = useState(false);
	const [infoEdited, setInfoEdited] = useState(false);

	useEffect(() => {
		if (!adminStore?.admin?.imagePath) {
			return;
		}

		adminStore.updatePictureUploadedTimestamp(Date.now());
		setAdminImage(
			() =>
				adminStore?.admin?.imagePath +
				""
		);
	}, [adminStore.admin]);

	//GET ADMIN'S DATA
	const fetchAdminData = async () => {
		try {
			const response = await refreshedFetch(`${apiUrl}/admins`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
			});
			const data = await response.json();
			return data.payload;
		} catch (error) {
			console.error(error);
		}
	};

	const { data, error, isLoading } = useQuery("adminData", fetchAdminData, {
		onSuccess: (dataResponse) => {
			setFirstName(() => dataResponse?.firstName ?? "");
			setLastName(() => dataResponse?.lastName ?? "");
			setDisplayName(() => dataResponse?.username ?? "");
		},
	});

	// const uploadAdminImage = async (image: File) => {
	// 	if (!image) return adminStore.admin;

	// 	const adminId = adminStore?.admin?.id;
	// 	if (!adminId) return adminStore?.admin;

	// 	const body = new FormData();
	// 	body.append("image", image);

	// 	const response = await refreshedFetch(
	// 		`${apiUrl}/admins/images/${adminId}`,
	// 		{
	// 			method: "POST",
	// 			headers: {
	// 				Authorization: `Bearer ${adminStore.token}`,
	// 			},
	// 			body,
	// 		}
	// 	);

	// 	const data = await response.json();

	// 	if (!response.ok) {
	// 		throw new Error("Image upload failed");
	// 	}

	// 	return data.payload;
	// };

	// UPLOAD ADMIN PHOTO
	const [imageUploadError, setImageUploadError] = useState("");
	const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
	const addAdminPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e?.target?.files?.[0]) {
			return;
		}

		const adminId = adminStore?.admin?.id;
		if (!adminId) return;
		console.log(adminStore.admin);

		setIsImageLoading(true);

		// setAdminProfilePicture(e.target.files[0]);
		try {
			// const profile = await uploadAdminImage(e.target.files[0]);

			const fileUploadCallback = async (success: boolean, data: any) => {
				if (success) {
					console.log("file data", data);
					const profile = await updateAdminData({
						imagePath: data
					});
					if (!profile) {
						throw new Error("Image upload failed");
					}
					adminStore.updatePictureUploadedTimestamp(Date.now());
					adminStore.updateAdmin(profile);
					setIsImageLoading(false);
				} else {
					setIsImageLoading(false);
					setImageUploadError(
						(data as Error)?.message ?? "There was an error with image upload"
					);
				}
			};

			const profilePicture = e.target.files[0];
			console.log(profilePicture.name);
			const type = profilePicture.name.split(".")[1];
    	const fileName = `${adminId}${adminStore.admin?.isPrimary? "-SAI." : "-AI."}${type}`;
			handleFileUpload(profilePicture, fileName, fileUploadCallback);
		} catch (error) {
			console.log(error);
			setIsImageLoading(false);
			setImageUploadError(
				(error as Error)?.message ?? "There was an error with image upload"
			);
		}
	};

	const updateAdminData = async (data: any) => {

		console.log("adminStore", adminStore);

		const adminId = adminStore?.admin?.id;
		if (!adminId) return adminStore?.admin;
		const response = await refreshedFetch(`${apiUrl}/admins/images-update/${adminId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${adminStore.token}`,
			},
			body: JSON.stringify(data),
		});

		const resData: { payload: IAdmin } = await response.json();

		if (!response.ok) {
			console.log(resData);
			throw new Error("There was an error updating your profile");
		}
		return resData.payload;
	};

	//VALIDATE FORM INPUT
	const formik = useFormik({
		initialValues: {
			firstName,
			lastName,
			displayName,
			password: changePassword,
		},
		enableReinitialize: true,
		validationSchema: Yup.object({
			lastName: Yup.string().required("please, enter your surname"),
			firstName: Yup.string().required("please, enter your name"),
			displayName: Yup.string().required("please, enter your display name"),
			password: Yup.string().required("please, enter your password"),
		}),
		onSubmit: async (values) => {
			setInfoEdited(false);
			try {
				await updateUserData(
					{
						firstName: values.firstName,
						lastName: values.lastName,
						username: values.displayName,
						email: adminStore.admin?.email,
					},
					adminStore.token
				);

				if (values.password && values.password !== "placeholder") {
					changeAdminPassword(values.password);
				}

				formik.setStatus("Account updated successfully");
				enqueueSnackbar("Account updated successfully", {
					variant: "success"
				});
			} catch (error) {
				console.log(error);
			}

			setTimeout(() => {
				formik.setStatus("");
			}, 3000);
		},
	});

	const { mutate: changeAdminPassword } = useMutation(
		async (password: string) => {
			if (!password) {
				formik.setStatus("Password is invalid");
				clearFormStatus();
				return;
			}
			const auth = getAuth();

			if (!auth?.currentUser) {
				formik.setStatus("Password reset failed");
				clearFormStatus();
				return;
			}

			try {
				await updatePassword(auth.currentUser, password);

				// const token = await auth.currentUser.getIdToken();
				// const refreshToken = await auth.currentUser.refreshToken;
				// const expirationTime = new Date().getTime() + 1000 * 60 * 60;
				// adminStore.login({ token, refreshToken, expirationTime });
				formik.setStatus(
					`Account data has been updated successfully!
					You will be logged out because you updated your password`
				);
				setTimeout(() => {
					router.push("/admin/login");
					adminStore.logout();
				}, 3000);
			} catch (error) {
				console.log(error);
				formik.setStatus("Password reset failed");
			}
			clearFormStatus();
		}
	);

	const clearFormStatus = () => {
		setTimeout(() => {
			formik.setStatus("");
		}, 3000);
	};

	//UPDATE ADMIN'S DATA
	const updateUserData = async (data: any, token: string | null) => {
		setIsFormSubmitting(true);
		setInfoEdited(false);
		const response = await refreshedFetch(`${apiUrl}/admins`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		const resData: { payload: IAdmin } = await response.json();

		if (!response.ok) {
			console.log(resData);
			setIsFormSubmitting(false);
			throw new Error("There was an error updating your profile");
		}

		adminStore.updateAdmin(resData.payload);
		setIsFormSubmitting(false);
		return resData;
	};

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Edit user | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<div className="row-span-2 hidden h-full md:block">
						{/* <!-- Sidebar --> */}
						<AdminSidebar />
					</div>
					{/* <!-- Search --> */}
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
						{/* <!-- <Search client:visible /> --> */}
					</div>
					{/* <!-- Mobile logo --> */}
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
						<AdminLogoSvg />
					</div>
					<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6">
						<MobileNav />
					</div>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
						<div className=" pb-12">
							<main className="lg:px-6 w-full">
								{/* <!-- Heading --> */}
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									edit user
								</h2>
								<form 
									onChange={() => {
										setInfoEdited(true);
									}} 
									onSubmit={formik.handleSubmit}
								>
									{/* <pre>
										{(() => {
											const { profiles, trades, activities, profilesInfo,  ...admin } = adminStore.admin;
											return JSON.stringify(admin, null, 2);
										})()}
									</pre> */}
									<div className="gap-4 grid grid-cols-2">
										<div className="col-span-2 flex space-x-4 items-center">
											<div
												className={`relative border-2 h-16 w-16 border-onyx rounded-full ${
													isImageLoading ? "opacity-50" : ""
												}`}
											>
												<img
													className="h-full w-full rounded-full"
													src={adminImage ? adminImage : AccountIcon.src}
													alt={`connection ${firstName} ${lastName} image`}
													style={{ objectFit: "cover" }}
												/>
											</div>
											<div>
												<label
													className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
													htmlFor="profile-picture-admin"
												>
													change profile pic
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
											{imageUploadError && (
												<p className="pl-4 text-red-500">{imageUploadError}</p>
											)}{" "}
										</div>
										<div>
											<label
												htmlFor="firstName"
												className="block font-medium text-onyx"
											>
												first name
											</label>
											<div className="mt-1">
												<input
													id="firstName"
													name="firstName"
													value={formik.values.firstName}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
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
										<div>
											<label
												htmlFor="lastName"
												className="block font-medium text-onyx"
											>
												last name
											</label>
											<div className="mt-1">
												<input
													id="lastName"
													name="lastName"
													value={formik.values.lastName}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
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
										<div className="col-span-2">
											<div>
												<label
													htmlFor="displayName"
													className="block font-medium text-onyx"
												>
													display name
												</label>
												<div className="mt-1">
													<input
														id="displayName"
														name="displayName"
														value={formik.values.displayName}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														placeholder=" "
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.displayName &&
												formik.errors.displayName ? (
													<div className="text-red-500">
														{formik.errors.displayName}
													</div>
												) : null}
											</div>
										</div>
										<div className="col-span-2">
											<div>
												<label
													htmlFor="password"
													className="block font-medium text-onyx"
												>
													password
												</label>
												<div className="mt-1">
													<input
														type="password"
														id="password"
														name="password"
														value={formik.values.password}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														placeholder=" "
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.password && formik.errors.password ? (
													<div className="text-red-500">
														{formik.errors.password}
													</div>
												) : null}
											</div>
										</div>
									</div>
									<div className="pt-3 text-right flex space-x-4 justify-end">
										<button
											disabled={!infoEdited || isFormSubmitting}
											type="submit"
											className={`inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2 ${
												!infoEdited || isFormSubmitting ? "cursor-not-allowed opacity-50" : ""
											}`}
										>
											save changes
										</button>
									</div>
									{/* {!!formik.status && (
										<div className="w-full flex justify-end mt-3">
											<p>{formik.status}</p>
										</div>
									)} */}
								</form>
							</main>
						</div>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto">
						<div className="w-full">
							{/* <!-- content for right sidebar --> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// export default EditUser;
export default dynamic(() => Promise.resolve(EditUser), { ssr: false });
