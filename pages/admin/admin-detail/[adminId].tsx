import { NextPageContext } from "next";
import getConfig from "next/config";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import AdminAccountDropdown from "../../../components/admin/admin-account-dropdown";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import AdminLogoSvg from "../../../components/svgs/AdminLogoSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { useAdminStore } from "../../../store";
import AccountPlaceholder from "../../../public/images/account.png";
import Image from "next/image";
import dynamic from "next/dynamic";
import { isAdmin } from "@firebase/util";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IAdmin } from "../../../types/admin.interface";
import LoadingOverlay from "../../../components/loading-overlay";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { handleFileUpload } from "../../../utils/file-uploader.utils";

export async function getServerSideProps(context: any) {
	const { adminId } = context.params;

	return {
		props: {
			adminId,
		},
	};
}

const AdminDetail = ({ adminId }: { adminId: string }) => {
	const router = useRouter();
	const adminStore = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();

	const [adminData, setAdminData] = useState<any>();
	const [isSuperadmin, setIsSuperadmin] = useState(
		adminStore?.admin?.isPrimary
	);
	const [isLoading, setIsLoading] = useState(false);

	// UPLOAD ADMIN PHOTO
	const [isLoadingPicture, setIsLoadingPicture] = useState<boolean>(false);
	const [adminProfilePicture, setAdminProfilePicture] = useState<File>();
	const addAdminPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e?.target?.files?.[0]) {
			return;
		}

		setAdminProfilePicture(e?.target?.files?.[0]);
		setTimeout(() => {
			uploadPicture();
		});
	};

	const { refetch: uploadPicture } = useQuery(
		["adminImage", adminData?.id, adminProfilePicture],
		async () => {
			if (!adminProfilePicture) return;

			const { token } = adminStore;
			if (!adminId) return;
			setIsLoadingPicture(true);

			const fileUploadCallback = async (success: boolean, data: any) => {
				if (success) {
					console.log("file data", data);
					const response = await refreshedFetch(`${apiUrl}/admins/images-update/${adminId}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							imagePath: data
						}),
					});
	
					
	
					if (!response.ok) {
						setIsLoading(false);
						setIsLoadingPicture(false);
						console.error("Image upload failed");
						return;
					}
					const resData: { payload: IAdmin } = await response.json();

					setIsLoading(false);
					setIsLoadingPicture(false);
					setAdminData({
						...resData.payload,
					});
				} else {
					return;
				}
			};
	
			const type = adminProfilePicture.name.split(".")[1];
			const fileName = `${adminId}${adminData?.isPrimary? "-SAI." : "-AI."}${type}`;
			handleFileUpload(adminProfilePicture, fileName, fileUploadCallback);

			// const body = new FormData();
			// body.append("image", adminProfilePicture);
			// const response = await refreshedFetch(
			// 	`${apiUrl}/admins/images/${adminId}`,
			// 	{
			// 		method: "POST",
			// 		headers: {
			// 			Authorization: `Bearer ${token}`,
			// 		},
			// 		body,
			// 	}
			// );
			// const data = await response.json();

			// if (!response.ok) {
			// 	setIsLoading(false);
			// 	setIsLoadingPicture(false);
			// 	console.error("Image upload failed");
			// 	return;
			// }

			// setIsLoading(false);
			// setIsLoadingPicture(false);
			// setAdminData({
			// 	...data.payload,
			// });
		},
		{
			enabled: false,
		}
	);

	useEffect(() => {
		if (!adminId) {
			router.push("/admin/admins");
			return;
		}
	}, [adminId]);

	//GET ADMIN'S DATA
	const fetchProfiles = async () => {
		try {
			const response = await refreshedFetch(`${apiUrl}/admins/${adminId}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
			});
			const data = await response.json();
			return data.payload;
		} catch (error) {
			console.error(error);
			return null;
		}
	};

	const { refetch: refetchAdminProfile } = useQuery({
		queryKey: ["admin-profile"],
		queryFn: fetchProfiles,
		onSuccess: (dataResponse) => {
			if (dataResponse) {
				setAdminData(dataResponse);
			}
		},
		onError: (error) => {
			console.log(error);
		},
		refetchOnWindowFocus: true,
		refetchOnMount: true,
	});

	const formik = useFormik({
		initialValues: {
			firstName: adminData?.firstName || "",
			lastName: adminData?.lastName || "",
			displayName: adminData?.username || "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object({
			lastName: Yup.string().required("please, enter your surname"),
			firstName: Yup.string().required("please, enter your name"),
			displayName: Yup.string().required("please, enter your display name"),
		}),
		onSubmit: (values) => {
			setIsLoading(true);
			updateUserData(
				{
					firstName: values.firstName,
					lastName: values.lastName,
					username: values.displayName,
					email: adminData?.email,
				},
				adminStore.token
			);
		},
	});

	//UPDATE ADMIN'S DATA
	const updateUserData = async (data: any, token: string | null) => {
		const response = await refreshedFetch(`${apiUrl}/admins/${adminId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			formik.setStatus(
				"There was a problem updating user data, please try again!"
			);
			setIsLoading(false);
			return;
		}

		const json = await response.json();
		setAdminData({
			...json.payload,
		});
		setIsLoading(false);
		if (!response.ok) {
			throw new Error(json.message);
		}
		return json;
	};

	// DELETE ADMIN
	const handleDelete = async (id: string) => {
		try {
			await refreshedFetch(`${apiUrl}/admins/admins/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
				body: JSON.stringify({ adminId: id }),
			});
			router.push("/admin/dashboard");
		} catch (error) {
			console.error(error);
		}
	};

	const handleResetPassword = async () => {
		const auth = getAuth();
		auth.languageCode = "en";

		try {
			await sendPasswordResetEmail(auth, adminData.email);

			formik.setStatus("Reset password email has been sent to this admin");
			setTimeout(() => {
				formik.setStatus("");
			}, 3000);
		} catch (error) {
			const errorMessage = (error as FirebaseError).message;
			console.log(errorMessage);
		}
	};

	useEffect(() => {
		if (!isSuperadmin) {
			router.push("/admin/dashboard");
		}
	}, [isSuperadmin]);

	return (
		<div
			data-new-gr-c-s-check-loaded="14.1098.0"
			data-gr-ext-installed
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full "
		>
			{isLoading && <LoadingOverlay></LoadingOverlay>}
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] ">
				<AdminSidebar />
				<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
					{" "}
					{/* <Search client:visible /> */}
				</div>
				<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
					<AdminLogoSvg />
				</div>
				<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6">
					<MobileNav />
				</div>
				<form onSubmit={formik.handleSubmit}>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 ">
						<div className=" pb-12 ">
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								admin detail
							</h2>
							<div className="gap-4 grid grid-cols-2">
								<div className="col-span-2 flex space-x-4 items-center">
									{/* <pre>{adminData?.imagePath}</pre> */}
									<div
										className={`h-16 w-16 relative rounded-full border-2 border-onyx ${
											isLoadingPicture ? "opacity-50" : ""
										}`}
									>
										<img
											className="w-full h-full rounded-full"
											src={
												adminData?.imagePath
													? 
													  adminData?.imagePath 
													: AccountPlaceholder.src
											}
											alt={(adminData?.firstName ?? "") + "profile picture"}
											style={{ objectFit: "cover" }}
										/>
									</div>
									<div>
										<label
											className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
											htmlFor="file_input"
										>
											change profile pic
										</label>
										<input
											id="profile-picture-admin"
											name="profile-picture-admin"
											className="block lowercase w-full text-sm py-3 pl-3 text-gray-900 border-2 border-onyx rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
											type="file"
											onChange={addAdminPicture}
											accept=".png,.jpg"
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
											id="firstName"
											name="firstName"
											value={formik.values.firstName}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											placeholder={
												adminData?.firstName ? adminData?.firstName : ""
											}
											spellCheck="false"
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
											id="lastName"
											name="lastName"
											value={formik.values.lastName}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											placeholder={
												adminData?.lastName ? adminData?.lastName : ""
											}
											spellCheck="false"
											className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
										/>
									</div>
								</div>
								<div className="col-span-2">
									<div>
										<label
											htmlFor="displayname"
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
												placeholder={
													adminData?.username ? adminData?.username : ""
												}
												spellCheck="false"
												className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
											/>
										</div>
									</div>
								</div>
								{isSuperadmin ? null : (
									<div className="col-span-2">
										<div>
											<label
												htmlFor="password"
												className="block font-medium text-onyx"
											>
												change password
											</label>
											<div className="mt-1">
												<input
													id="password"
													name="password"
													value="change password"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
						<div className="pt-3 text-right flex space-x-4 justify-end">
							<div>
								<button
									disabled={!adminData?.email}
									type="button"
									onClick={() => handleResetPassword()}
									id="admin-detail-delete-user"
									className={`inline-flex justify-center rounded border border-transparent bg-green-400 py-2 px-4 font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2 ${
										!adminData?.email ? "opacity-50" : ""
									}`}
								>
									reset password
								</button>
							</div>
							<div>
								<button
									type="button"
									onClick={() => handleDelete(adminId)}
									id="admin-detail-delete-user"
									className="inline-flex justify-center rounded border border-transparent bg-red-400 py-2 px-4 font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
								>
									delete user
								</button>
							</div>
							<button
								type="submit"
								id="admin-detail-save-changes"
								className="inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
							>
								save changes
							</button>
						</div>
						{formik.status && (
							<div className="w-full flex justify-end m-3">
								<p>{formik.status}</p>
							</div>
						)}
					</div>
				</form>
			</div>
			<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto ">
				<div className="w-full"></div>
			</div>
		</div>
	);
};

// export default AdminDetail;
export default dynamic(() => Promise.resolve(AdminDetail), { ssr: false });
