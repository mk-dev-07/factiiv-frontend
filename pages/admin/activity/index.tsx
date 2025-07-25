import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSearch from "../../../components/admin/admin-search";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import AdminTradesCard from "../../../components/admin/admin-trades-card";
import LoadingOverlay from "../../../components/loading-overlay";
import AdminLogoSvg from "../../../components/svgs/AdminLogoSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { useAdminStore } from "../../../store";
import { Activity, Trade } from "../../../types/trade.interface";

const Activities = () => {
	const router = useRouter();
	const adminStore = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const [activitiesInfo, setActivitiesInfo] = useState<Activity[]>([]);
	const [tradesInfo, setTradesInfo] = useState<Trade[]>([]);

	//REACT QUERY PAGINATION
	const [activities, setActivities] = useState<any>([]);
	const [page, setPage] = useState(0);
	const nextPage = () => setPage((prev) => prev + 1);
	const previousPage = () => setPage((prev) => prev - 1);

	//FETCH ACTIVITIES
	const fetchActivities = async (page: number) => {
		try {
			const response = await fetch(`${apiUrl}/admins/activities?page=${page}`, {
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

	const {
		isLoading,
		isError,
		error,
		data: activitiesData,
		isFetching,
		isPreviousData,
	} = useQuery(["/activities", page], () => fetchActivities(page), {
		keepPreviousData: true,
		onSuccess: (dataResponse) => {
			if (dataResponse) {
				setActivities(dataResponse);
			}
		},
	});

	//GET FULL ACTIVITIES DATA - FOR SEARCH
	const [dataSize, setDataSize] = useState(0);
	useEffect(() => {
		setDataSize(activities?.totalElements);
	}, [activities]);
	const [fullData, setFullData] = useState<any>([]);
	const fetchFullData = async (dataSize: number) => {
		try {
			const response = await refreshedFetch(
				`${apiUrl}/admins/activities?size=${dataSize}`,
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

	const fullDataQuery = useQuery(
		["/activities", dataSize],
		() => fetchFullData(dataSize),
		{
			keepPreviousData: true,
			onSuccess: (dataResponse) => {
				if (dataResponse) {
					setFullData(dataResponse);
				}
			},
			enabled: dataSize !== undefined
		}
	);
	//FETCH TRADES
	const fetchTrades = async () => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();

		try {
			const response = await refreshedFetch(`${apiUrl}/admins/trades`, {
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

	const tradesQuery = useQuery({
		queryKey: ["trades"],
		queryFn: fetchTrades,
		onSuccess: (dataResponse) => {
			if (dataResponse) {
				setTradesInfo(dataResponse);
			}
		},
		onError: (error) => {
			console.log(error);
		},
	});

	//SEARCH TRADES
	const [searchValue, setSearchValue] = useState("");
	const [searchMode, setSearchMode] = useState(false);

	useEffect(() => {
		if (activitiesData && searchValue === "") {
			setActivities(activitiesData);
			setSearchMode(false);
		}
	}, [searchValue]);

	const handleSearch = () => {
		if (searchValue !== "") {
			setActivities(() => {
				return {
					...fullData,
					content: fullData?.content?.filter((el: Activity) =>
						el?.tradeId.includes(searchValue)
					),
				};
			});
			setSearchMode(true);
		} else {
			setSearchMode(false);
		}
	};

	//SELECT ACTIVITY
	const handleSelectActivity = (activityId: string) => {
		router.push(`activity-detail/${activityId}`);
	};

	//SEARCH PAGINATION (FRONT)
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const totalPages = Math.ceil(activities?.content?.length / itemsPerPage);
	const [itemsForPage, setItemsForPage] = useState<any>([]);

	useEffect(() => {
		activities &&
			setItemsForPage(() => {
				const startIndex = (currentPage - 1) * itemsPerPage;
				const endIndex = startIndex + itemsPerPage;
				return activities?.content?.slice(startIndex, endIndex);
			});
	}, [activities, currentPage]);

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
				<title>Activity | factiiv</title>
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
								activity
							</h2>
							<AdminSearch
								placeholderValue="search by trade ID"
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								handleSearch={handleSearch}
							/>
							{searchMode ? (
								<>
									<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
										<ul role="list" className="divide-y-2 divide-onyx">
											{!itemsForPage && (
												<li className="p-2">No activities...</li>
											)}
											{itemsForPage &&
												itemsForPage?.map((item: any) => {
													return (
														<li
															key={item.id}
															onClick={() => handleSelectActivity(item.id)}
															className="cursor-pointer"
														>
															{itemsForPage && (
																<AdminTradesCard
																	activityCard
																	tradeId={item.tradeId}
																	reportingBusiness={
																		item.fromProfileBusinessName
																	}
																	receivingBusiness={item.toProfileBusinessName}
																	type={item.activityType}
																	date={item.createdAt}
																	status={item?.activityStatus}
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
									{activities?.content && (
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
															activities?.content?.length
																? (currentPage - 1) * itemsPerPage +
																  itemsPerPage
																: activities?.content?.length}
														</span>{" "}
														of
														<span className="font-medium">
															{" "}
															{activities?.content?.length}
														</span>{" "}
														items
													</p>
												</div>
												{!isLoading &&
													activities.totalElements >
														(activities?.size || 10) && (
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
															className={`relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
																currentPage === totalPages && "hidden"
															}`}
														>
																next
														</button>
													</div>
												)}
											</nav>
										</div>
									)}
								</>
							) : (
								<>
									<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
										<ul role="list" className="divide-y-2 divide-onyx">
											{activities?.length === 0 && (
												<li className="p-2">No activities...</li>
											)}
											{activities &&
												activities?.content?.map((activity: Activity) => {
													return (
														<li
															key={activity.id}
															onClick={() => handleSelectActivity(activity.id)}
															className="cursor-pointer"
														>
															{activities && (
																<AdminTradesCard
																	activityCard
																	tradeId={activity.tradeId}
																	reportingBusiness={
																		activity.fromProfileBusinessName
																	}
																	receivingBusiness={
																		activity.toProfileBusinessName
																	}
																	type={activity.activityType}
																	date={new Date(activity.activityDate)}
																	status={activity?.adminStatus}
																/>
															)}
														</li>
													);
												})}
											{searchValue !== "" &&
												activities?.content?.length === 0 && (
												<h1 className="p-6">No matches found...</h1>
											)}
										</ul>
									</div>
									{!searchMode
										? activities?.content && (
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
																{page * (activities && activities.size) + 1}
															</span>{" "}
																to
															<span className="font-medium">
																{" "}
																{(page + 1) * activities?.size >
																	activities?.totalElements
																	? activities?.totalElements
																	: (page + 1) * activities?.size}
															</span>{" "}
																of
															<span className="font-medium">
																{" "}
																{activities?.totalElements}
															</span>{" "}
																items
														</p>
													</div>
													<div className="flex flex-1 justify-between sm:justify-end">
														<button
															id="pagination-previous"
															onClick={previousPage}
															disabled={page === 0}
															className={`${
																page === 0 && "hidden"
															} relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
														>
																previous
														</button>
														<button
															id="pagination-next"
															onClick={nextPage}
															disabled={page === activities?.totalPages - 1}
															className={`${
																page === activities?.totalPages - 1 &&
																	"hidden"
															} relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
														>
																next
														</button>
													</div>
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

export default Activities;
