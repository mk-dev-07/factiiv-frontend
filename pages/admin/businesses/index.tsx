import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import BusinessListingsCard from "../../../components/admin/admin-business-listings-card";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSearch from "../../../components/admin/admin-search";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import LoadingOverlay from "../../../components/loading-overlay";
import AdminLogoSvg from "../../../components/svgs/AdminLogoSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { useAdminStore } from "../../../store";
import Profile from "../../../types/profile.interface";
import getConfig from "next/config";
import { AdminSearchType } from "../../../types/adminSearch.interface";

const Businesses = () => {
	const router = useRouter();
	const adminStore = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const [debouncedValue, setDebouncedValue] = useState("");
	//REACT QUERY PAGINATION
	const [profiles, setProfiles] = useState<any>([]);
	const [page, setPage] = useState(0);
	const nextPage = () => setPage((prev) => prev + 1);
	const previousPage = () => setPage((prev) => prev - 1);
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const fetchProfiles = async (page: number) => {
		
		try {
			const response = await refreshedFetch(
				`${apiUrl}/admins/profiles?page=${page}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${adminStore.token}`,
					},
				}
			);
			const data = await response.json();
			return data.payload;
		} catch (error) {
			console.error(error);
		}
	};

	const {
		isLoading,
		isError,
		error,
		data: profilesData,
		isFetching,
		isPreviousData,
	} = useQuery(["/profiles", page], () => fetchProfiles(page), {
		keepPreviousData: true,
		onSuccess: (dataResponse) => {
			if (dataResponse) {
				setProfiles(dataResponse);
			}
		},
	});

	//GET FULL PROFILES DATA - FOR SEARCH
	const [dataSize, setDataSize] = useState(0);
	useEffect(() => {
		setDataSize(profiles?.totalElements);
	}, [profiles]);
	// const [fullData, setFullData] = useState<any>([]);
	// const fetchFullData = async (dataSize: number) => {
	// 	const {
	// 		publicRuntimeConfig: { apiUrl },
	// 	} = getConfig();
	// 	try {
	// 		const response = await refreshedFetch(
	// 			`${apiUrl}/admins/profiles?size=${dataSize}`,
	// 			{
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 					Authorization: `Bearer ${adminStore.token}`,
	// 				},
	// 			}
	// 		);
	// 		const data = await response.json();
	// 		return data.payload;
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };

	// const fullDataQuery = useQuery(
	// 	["/profiles", dataSize],
	// 	() => fetchFullData(dataSize),
	// 	{
	// 		keepPreviousData: true,
	// 		onSuccess: (dataResponse) => {
	// 			if (dataResponse) {
	// 				setFullData(dataResponse);
	// 			}
	// 		},
	// 		enabled: dataSize !== undefined,
	// 	}
	// );

	//SEARCH USERS
	const [searchValue, setSearchValue] = useState("");
	const [searchMode, setSearchMode] = useState(false);

	useEffect(() => {
		if (profilesData && searchValue === "") {
			setProfiles(profilesData);
			setSearchMode(false);
		}
	}, [searchValue]);

	const { data: profileList } = useQuery<Profile[]>(
		["adminSearchProfiles", { debouncedValue }],
		async () => {
			if (!debouncedValue) {
				return;
			}
			const body = JSON.stringify({
				type: AdminSearchType.PROFILE,
				name: debouncedValue
			});

			const data = await refreshedFetch(`${apiUrl}/admins/search`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
				body,
			});

			const profiles = await data.json();

			console.log("profiles", profiles.payload);
			setProfiles(profiles.payload);
			return profiles.payload;
		},
		{ refetchOnWindowFocus: false }
	);

	// const handleSearch = (searchValue: string) => {
	// 	if (searchValue !== "") {
	// 		setProfiles(() => {
	// 			return {
	// 				...fullData,
	// 				content: fullData?.content
	// 					?.filter((p: Profile) => !!p.businessName)
	// 					?.filter((profile: Profile) =>
	// 						profile?.businessName
	// 							.toLowerCase()
	// 							.includes(searchValue.toLowerCase().replace(" ", ""))
	// 					),
	// 			};
	// 		});
	// 		setSearchMode(true);
	// 	} else {
	// 		setSearchMode(false);
	// 	}
	// };
	const delay = (delay: number) => new Promise((res) => setTimeout(res, delay));
	const handleSearch = async (searchValue: string) => {
		if (searchValue !== "" && searchValue.length > 2) {
			setSearchMode(true);
			await delay(500);
			setDebouncedValue(searchValue);
		} else {
			setSearchMode(false);
		}
	};

	//SEARCH PAGINATION (FRONT)
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const totalPages = Math.ceil(profiles?.content?.length / itemsPerPage);
	const [itemsForPage, setItemsForPage] = useState<any>([]);

	useEffect(() => {
		profiles &&
			setItemsForPage(() => {
				const startIndex = (currentPage - 1) * itemsPerPage;
				const endIndex = startIndex + itemsPerPage;
				return profiles?.content?.slice(startIndex, endIndex);
			});
	}, [profiles, currentPage]);

	const handlePrevious = () => {
		setCurrentPage(currentPage - 1);
	};

	const handleNext = () => {
		setCurrentPage(currentPage + 1);
	};

	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full"
		>
			{isLoading && <LoadingOverlay />}
			{/* {isError && <p>Error: {error.message}</p>} */}
			<Head>
				<title>Businesses | factiiv</title>
			</Head>
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
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
				{/* MAIN */}
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
					<div className=" pb-12">
						<main className="lg:px-6 w-full">
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								businesses {profiles && profiles.totalElements}
							</h2>
							<AdminSearch
								placeholderValue="search by business name"
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								handleSearch={handleSearch}
							/>
							{searchMode ? (
								<>
									<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
										<ul role="list" className="divide-y-2 divide-onyx">
											{!itemsForPage && (
												<li className="p-2">No businesses...</li>
											)}
											{itemsForPage &&
												itemsForPage?.map((profile: any) => {
													return (
														<li key={profile.id} className="cursor-pointer">
															{itemsForPage && (
																<BusinessListingsCard
																	key={profile.id ? profile.id : "no id"}
																	linkTo={
																		profile && `business-detail/${profile.id}`
																	}
																	businessName={
																		profile.businessName
																			? profile.businessName
																			: "no business name"
																	}
																	businessOwner={
																		profile.ownerName
																			? profile.ownerName
																			: "no owner name"
																	}
																	createdAt={
																		profile.createdAt
																			? profile.createdAt
																			: "date uknown"
																	}
																	tradesNumber={
																		(profile?.myTrades
																			? profile.myTrades.length
																			: 0) + (profile?.tradesWithMe
																			? profile.tradesWithMe.length
																			: 0)
																	}
																	profileImgURL={profile.imagePath}
																/>
															)}
														</li>
													);
												})}
											{searchValue !== "" && itemsForPage?.length === 0 && (
												<h1 className="p-6">No matches found...</h1>
											)}
										</ul>
									</div>
									{profiles?.content && (
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
															profiles?.content?.length
																? (currentPage - 1) * itemsPerPage +
																  itemsPerPage
																: profiles?.content?.length}
														</span>{" "}
														of
														<span className="font-medium">
															{" "}
															{profiles?.content?.length}
														</span>{" "}
														items
													</p>
												</div>
												<div className="flex flex-1 justify-between sm:justify-end">
													<button
														id="pagination-previous"
														onClick={handlePrevious}
														disabled={currentPage === 1}
														className={`${
															currentPage === 1 && "hidden"
														} relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
													>
														previous
													</button>
													<button
														id="pagination-next"
														onClick={handleNext}
														disabled={currentPage === totalPages}
														className={`${
															currentPage === totalPages && "hidden"
														} relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
													>
														next
													</button>
												</div>
											</nav>
										</div>
									)}
								</>
							) : (
								<>
									<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
										<ul role="list" className="divide-y-2 divide-onyx">
											{profiles?.length === 0 && (
												<li className="p-2">No businesses...</li>
											)}
											{profiles &&
												profiles?.content?.map((profile: any) => {
													return (
														<li key={profile.id} className="cursor-pointer">
															{profiles && (
																<BusinessListingsCard
																	key={profile.id ? profile.id : "no id"}
																	linkTo={
																		profile && `business-detail/${profile.id}`
																	}
																	businessName={
																		profile.businessName
																			? profile.businessName
																			: "no business name"
																	}
																	businessOwner={
																		profile.ownerName
																			? profile.ownerName
																			: "no owner name"
																	}
																	createdAt={
																		profile.createdAt
																			? profile.createdAt
																			: "date uknown"
																	}
																	tradesNumber={
																		(profile.myTrades
																			? profile.myTrades.length
																			: 0) + (profile.tradesWithMe
																			? profile.tradesWithMe.length
																			: 0)
																	}
																	profileImgURL={profile.imagePath}
																/>
															)}
														</li>
													);
												})}
											{searchValue !== "" &&
												profiles?.content?.length === 0 && (
												<h1 className="p-6">No matches found...</h1>
											)}
										</ul>
									</div>
									{!searchMode
										? profiles?.content && (
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
																{page * (profiles && profiles.size) + 1}
															</span>{" "}
																to
															<span className="font-medium">
																{" "}
																{(page + 1) * profiles?.size >
																	profiles?.totalElements
																	? profiles?.totalElements
																	: (page + 1) * profiles?.size}
															</span>{" "}
																of
															<span className="font-medium">
																{" "}
																{profiles?.totalElements}
															</span>{" "}
																items
														</p>
													</div>
													{!isLoading &&
															profiles.totalElements >
																(profiles?.size || 10) && (
														<div className="flex flex-1 justify-between sm:justify-end">
															<button
																id="pagination-previous"
																onClick={previousPage}
																disabled={page === 0}
																className={`${
																	(page === 0 ||
																				profiles.totalElements < 5) &&
																			"hidden"
																} relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
															>
																		previous
															</button>
															<button
																id="pagination-next"
																onClick={nextPage}
																disabled={page === profiles?.totalPages - 1}
																className={`${
																	(page === profiles?.totalPages - 1 ||
																				profiles.totalElements < 5) &&
																			"hidden"
																} relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
															>
																		next
															</button>
														</div>
													)}
												</nav>
											</div>
										  )
										: null}
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

export default Businesses;
