import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import AdminAccountCard from "../../../components/admin/admin-account-card";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSearch from "../../../components/admin/admin-search";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import LoadingOverlay from "../../../components/loading-overlay";
import AdminLogoSvg from "../../../components/svgs/AdminLogoSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { useAdminStore } from "../../../store";
import { IUser } from "../../../types/user.interface";
import { IAdmin } from "../../../types/admin.interface";
import { AdminSearchType } from "../../../types/adminSearch.interface";

const Accounts = () => {
	const adminStore = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	//REACT QUERY PAGINATION
	const [users, setUsers] = useState<any>([]);
	const [page, setPage] = useState(0);
	const nextPage = () => setPage((prev) => prev + 1);
	const previousPage = () => setPage((prev) => prev - 1);
	const [debouncedValue, setDebouncedValue] = useState("");

	//FETCH USER ACCOUNTS
	const fetchUsers = async (page: number) => {
		try {
			const response = await fetch(`${apiUrl}/admins/users?page=${page}`, {
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

	const { isLoading, data: usersData } = useQuery(
		["/users", page],
		() => fetchUsers(page),
		{
			keepPreviousData: true,
			onSuccess: (dataResponse) => {
				if (dataResponse) {
					setUsers(dataResponse);
				}
			},
		}
	);

	//GET FULL TRADES DATA - FOR SEARCH
	const [dataSize, setDataSize] = useState(0);
	useEffect(() => {
		if (!users?.totalElements) {
			return;
		}

		setDataSize(users?.totalElements);
	}, [users]);
	const [fullData, setFullData] = useState<{ content: IUser[] }>({
		content: [],
	});
	// const fetchFullData = async (dataSize: number) => {
	// 	try {
	// 		const response = await refreshedFetch(
	// 			`${apiUrl}/admins/users?size=${dataSize}`,
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
	// 	["/users", dataSize],
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
		if (usersData && searchValue === "") {
			setUsers(usersData);
			setSearchMode(false);
		}
	}, [searchValue]);

	const { data: userList } = useQuery<IUser[]>(
		["adminSearchUsers", { debouncedValue }],
		async () => {
			if (!debouncedValue) {
				return;
			}
			const body = JSON.stringify({
				type: AdminSearchType.USER,
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

			const users = await data.json();

			console.log("users", users.payload);
			setUsers(users.payload);
			return users.payload;
		},
		{ refetchOnWindowFocus: false }
	);

	const delay = (delay: number) => new Promise((res) => setTimeout(res, delay));
	const handleSearch = async (searchValue: string) => {
		if (searchValue !== "" && searchValue.length > 2) {
			setSearchMode(true);
			await delay(500);
			setDebouncedValue(searchValue);

			// setUsers(() => {
			// 	return {
			// 		...fullData,
			// 		content: fullData?.content?.filter(
			// 			(el: IUser) =>
			// 				(el?.firstName + el?.lastName)
			// 					.toLowerCase()
			// 					.includes(searchValue.toLowerCase().replace(" ", "")) ||
			// 				el?.email?.toLowerCase().includes(searchValue.toLowerCase())
			// 		),
			// 	};
			// });
			
		} else {
			setSearchMode(false);
		}
	};

	//SEARCH PAGINATION (FRONT)
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const totalPages = Math.ceil(users?.content?.length / itemsPerPage);
	const [itemsForPage, setItemsForPage] = useState<any>([]);

	useEffect(() => {

		users &&
			setItemsForPage(() => {
				const startIndex = (currentPage - 1) * itemsPerPage;
				const endIndex = startIndex + itemsPerPage;
				return users?.content?.slice(startIndex, endIndex);
			});
	}, [users, currentPage]);

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
				<title>Accounts | factiiv</title>
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
								accounts {users && users.totalElements}
							</h2>
							<AdminSearch
								placeholderValue="search by username or email"
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								handleSearch={handleSearch}
							/>
							{searchMode ? (
								<>
									<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
										<ul role="list" className="divide-y-2 divide-onyx">
											{itemsForPage &&
												itemsForPage?.map((user: any) => {
													return (
														<li key={user.id} className="cursor-pointer">
															{itemsForPage && (
																<AdminAccountCard
																	name={
																		user.firstName !== ""
																			? `${user.firstName} ${user.lastName}`
																			: user.email
																	}
																	email={user.email}
																	joinedOn={user.createdAt}
																	numberOfBusinesses={user.profiles.length}
																	linkTo={`account-detail/${user.id}`}
																	imagePath={user.imagePath}
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
														users?.content?.length
															? (currentPage - 1) * itemsPerPage + itemsPerPage
															: users?.content?.length}
													</span>{" "}
													of
													<span className="font-medium">
														{" "}
														{users?.content?.length}
													</span>{" "}
													items
												</p>
											</div>
											<div className="flex flex-1 justify-between sm:justify-end">
												<button
													id="pagination-previous"
													onClick={handlePrevious}
													disabled={currentPage === 1}
													className={`${currentPage === 1 && "hidden"}


													relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
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
								</>
							) : (
								<>
									<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
										<ul role="list" className="divide-y-2 divide-onyx">
											{users &&
												users?.content?.map((user: any) => {
													return (
														<li key={user.id} className="cursor-pointer">
															{users && (
																<AdminAccountCard
																	name={
																		user.firstName !== ""
																			? `${user.firstName} ${user.lastName}`
																			: user.email
																	}
																	email={user.email}
																	joinedOn={user.createdAt}
																	numberOfBusinesses={user.profiles.length}
																	linkTo={`account-detail/${user.id}`}
																	suspended={user.suspended}
																	imagePath={user.imagePath}
																/>
															)}
														</li>
													);
												})}
											{searchValue !== "" && users?.content?.length === 0 && (
												<h1 className="p-6">No matches found...</h1>
											)}
										</ul>
									</div>
									{!searchMode
										? users?.content && (
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
																{page * (users && users.size) + 1}
															</span>{" "}
																to
															<span className="font-medium">
																{" "}
																{(page + 1) * users?.size >
																	users?.totalElements
																	? users?.totalElements
																	: (page + 1) * users?.size}
															</span>{" "}
																of
															<span className="font-medium">
																{" "}
																{users?.totalElements}
															</span>{" "}
																items
														</p>
													</div>
													{!isLoading &&
															users.totalElements > (users?.size || 10) && (
														<div className="flex flex-1 justify-between sm:justify-end">
															<button
																id="pagination-previous"
																onClick={previousPage}
																disabled={page === 0}
																className={`${
																	(page === 0 || users.totalElements < 5) &&
																			"hidden"
																} relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
															>
																		previous
															</button>
															<button
																id="pagination-next"
																onClick={nextPage}
																disabled={page === users?.totalPages - 1}
																className={`${
																	(page === users?.totalPages - 1 ||
																				users.totalElements < 5) &&
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

export default Accounts;
