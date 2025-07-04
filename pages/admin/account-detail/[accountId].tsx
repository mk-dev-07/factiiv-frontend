import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import AdminBusinessCard from "../../../components/admin/admin-business-card";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import LoadingOverlay from "../../../components/loading-overlay";

import { useAdminStore } from "../../../store";
import { IUser } from "../../../types/user.interface";
import Profile from "../../../types/profile.interface";
import Image from "next/image";
import AccountPlaceholder from "../../../public/images/account.png";
import Link from "next/link";
import { LogoAdminSvg } from "../../../components/svgs/LogoAdminSvg";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import getConfig from "next/config";
import dynamic from "next/dynamic";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";

const AccountDetail = () => {
	const adminStore = useAdminStore();
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const [accountId, setAccountId] = useState("");
	const [errorText, setErrorText] = useState("");
	useEffect(() => {
		setAccountId(() =>
			window.location.pathname
				.substring(window.location.pathname.lastIndexOf("/") + 1)
				.replace(/\.[^/.]+$/, "")
		);
	}, [accountId]);

	const [accountDetails, setAccountDetails] = useState<IUser>();
	const [businessProfiles, setBusinessProfiles] = useState<Profile[]>([]);

	//FETCH USER ACCOUNTS
	const fetchUsers = async () => {
		// if (!accountId) {
		// 	router.push("/admin/accounts");
		// 	return;
		// }

		try {
			const response = await fetch(`${apiUrl}/admins/users/${accountId}`, {
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

	const usersQuery = useQuery({
		queryKey: ["users", accountId],
		queryFn: fetchUsers,
		onSuccess: (account) => {
			if (!account) {
				setErrorText(
					"There has been an error getting this account, please try again"
				);
				return;
			}
			setAccountDetails(account);
			setBusinessProfiles(account.profiles);
		},
		onError: (error) => {
			console.log(error);
		},
	});

	//BUSINESS PROFILES PAGINATION
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	const totalPages = Math.ceil(businessProfiles.length / itemsPerPage);
	const [itemsForPage, setItemsForPage] = useState<Profile[]>([]);

	useEffect(() => {
		itemsForPage;
		setItemsForPage(() => {
			const startIndex = (currentPage - 1) * itemsPerPage;
			const endIndex = startIndex + itemsPerPage;
			return businessProfiles.slice(startIndex, endIndex);
		});
	}, [businessProfiles, currentPage]);

	const handlePrevious = () => {
		setCurrentPage(currentPage - 1);
	};

	const handleNext = () => {
		setCurrentPage(currentPage + 1);
	};

	// DELETE USER
	const handleDelete = async (id: string) => {
		try {
			const response = await refreshedFetch(`${apiUrl}/admins/users/${id}/12V0Rm095+r354`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
			});

			router.push("/admin/dashboard");
		} catch (error) {
			console.error(error);
		}
	};

	// SUSPEND USER
	const handleSuspend = async (id: string) => {
		try {
			const response = await refreshedFetch(`${apiUrl}/admins/users-suspend/${id}/${!accountDetails?.suspended}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
			});

			const data = await response.json();
			const user  = data.payload;
			setAccountDetails(user);
			setBusinessProfiles(user.profiles);
			
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div
			data-new-gr-c-s-check-loaded="14.1098.0"
			data-gr-ext-installed
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full"
		>
			{usersQuery.isLoading && <LoadingOverlay />}
			<Head>
				<title>Account detail | factiiv</title>
			</Head>
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
				<AdminSidebar />
				<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
					{" "}
					{/*
					<Search client:visible /> */}
				</div>
				<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
					<LogoAdminSvg />
				</div>
				<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6 astro-FRXN4BQ7">
					<MobileNav />
				</div>
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
					<div className=" pb-12">
						<main className="lg:px-6 w-full">
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								{" "}
								account detail{" "}
							</h2>
							{errorText}
							{!errorText && (
								<>
									<header className="flex items-start justify-between">
										<div className="flex items-center justify-start space-x-3 pt-8 xs:pt-0">
											<img
												className="h-12 w-12 object-cover rounded-full"
												src={accountDetails?.imagePath || AccountPlaceholder.src}
												alt="Account pic"
											/>
											<div>
												<h3 className="font-bold text-xl">
													{accountDetails &&
														(accountDetails.firstName !== ""
															? `${accountDetails.firstName} ${accountDetails.lastName}`
															: accountDetails.email)}
												</h3>
												<address>
													<p>{accountDetails && accountDetails.email}</p>
												</address>
												{accountDetails?.suspended && 
													<p className="text-red-400">status: suspended</p>
												}
											</div>
										</div>
										<button
											type="button"
											onClick={() => handleDelete(accountId)}
											id="admin-detail-delete-user"
											className="inline-flex justify-center rounded border border-transparent bg-red-400 py-2 px-4 font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
										>
											delete user
										</button>
										<button
											type="button"
											onClick={() => handleSuspend(accountId)}
											id="admin-detail-delete-user"
											className={`inline-flex justify-center rounded border border-transparent ${accountDetails?.suspended ? "bg-green-400" : "bg-red-400"} py-2 px-4 font-medium text-white shadow-sm ${accountDetails?.suspended ? "hover:bg-green-600" : "hover:bg-red-600"} focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2
											}`}
										>
											{accountDetails?.suspended ? "activate user" : "suspend user"}	
										</button>
									</header>
									<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
										{" "}
										owned businesses{" "}
									</h2>
									{businessProfiles && businessProfiles.length > 0 ? (
										<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
											<ul role="list" className="divide-y-2 divide-onyx">
												{businessProfiles
													?.sort(({ businessName: a }, { businessName: b }) =>
														a.localeCompare(b)
													)
													.map((profile) => {
														return (
															<li
																key={profile.businessName}
																className="cursor-pointer"
															>
																<Link
																	href={`/admin/business-detail/${profile.id}`}
																	target="_blank"
																>
																	<AdminBusinessCard
																		businessName={profile.businessName}
																		ownerName={profile.ownerName}
																		createdAt={profile.createdAt.slice(0, 10)}
																		numberOfTrades={profile.myTrades.length}
																		imagePath={profile?.imagePath}
																	/>
																</Link>
															</li>
														);
													})}
											</ul>
										</div>
									) : (
										<div>No registered businesses...</div>
									)}
									{/* PAGINATION */}
									{businessProfiles.length > 0 && (
										<div className="mt-4">
											<nav
												className="flex items-center justify-between px-4 py-3 sm:px-6"
												aria-label="Pagination"
											>
												<div className="hidden sm:block">
													<p className="text-sm text-gray-700">
														showing
														<span className="font-medium">
															{" "}
															{(currentPage - 1) * itemsPerPage + 1}
														</span>{" "}
														to
														<span className="font-medium">
															{" "}
															{(currentPage - 1) * itemsPerPage + itemsPerPage <
															businessProfiles.length
																? (currentPage - 1) * itemsPerPage +
																  itemsPerPage
																: businessProfiles.length}
														</span>{" "}
														of
														<span className="font-medium">
															{" "}
															{businessProfiles.length}
														</span>{" "}
														items
													</p>
												</div>
												<div className="flex flex-1 justify-between sm:justify-end">
													<button
														onClick={handlePrevious}
														disabled={currentPage === 1}
														className={`${
															currentPage === 1 && "cursor-not-allowed"
														} relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
													>
														previous
													</button>
													<button
														onClick={handleNext}
														disabled={currentPage === totalPages}
														className={`${
															currentPage === totalPages && "cursor-not-allowed"
														} relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
													>
														next
													</button>
												</div>
											</nav>
										</div>
									)}
								</>
							)}
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

// export default AccountDetail;
export default dynamic(() => Promise.resolve(AccountDetail), { ssr: false });
