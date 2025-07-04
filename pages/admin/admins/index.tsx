import getConfig from "next/config";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useQuery } from "react-query";
import AdminCard from "../../../components/admin/admin-card";
import AdminAccountDropdown from "../../../components/admin/admin-account-dropdown";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { useAdminStore } from "../../../store";
import {
	IAdmin,
	IAdminPayload,
	IAdminResponse,
} from "../../../types/admin.interface";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import AdminLogoSvg from "../../../components/svgs/AdminLogoSvg";
import dynamic from "next/dynamic";

const Admins = () => {
	const store = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });

	const [adminNumber, setAdminsNumber] = useState(0);
	const [isSuperadmin, setIsSuperadmin] = useState(false);
	const [search, setSearch] = useState("");
	const [filteredList, setFilteredList] = useState<IAdmin[]>([]);
	const [page, setPage] = useState(0);
	const nextPage = () => setPage((prev) => prev + 1);
	const previousPage = () => setPage((prev) => prev - 1);
	const [pageSize] = useState(5);

	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	// FETCH ADMINS
	const fetchAdmins = async () => {
		try {
			const response = await refreshedFetch(
				`${apiUrl}/admins/all?page=${page}&size=${pageSize}&orderBy=createdAt`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`,
					},
				}
			);
			const data: IAdminResponse = await response.json();
			return data.payload;
		} catch (error) {
			console.error(error);
		}
	};

	const {
		isLoading,
		data: {
			totalPages = 0,
			totalElements = 0,
			size = 0,
			content: admins = [],
		} = {},
	} = useQuery({
		queryKey: ["admins", page],
		queryFn: fetchAdmins,
		onSuccess: (dataResponse) => {
			setAdminsNumber(dataResponse?.totalElements ?? 0);
			return dataResponse;
		},
		enabled: !!isSuperadmin,
	});

	useEffect(() => {
		setIsSuperadmin(!!store?.admin?.isPrimary);
	}, [store.admin]);

	useEffect(() => {
		setSearch("");
		if (!admins.length) {
			return;
		}

		setFilteredList(admins);
	}, [admins]);

	const [isFiltering, setIsFiltering] = useState(false);
	useEffect(() => {
		if (!search || search.length < 2) {
			setIsFiltering(false);
			setFilteredList([...admins]);
			return;
		}

		setIsFiltering(true);
		setFilteredList([...admins.filter(({ email }) => email.includes(search))]);
	}, [search]);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full "
		>
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
				{/* <Search client:visible /> */}

				<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
					<AdminLogoSvg />
				</div>

				<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6">
					<MobileNav />
				</div>
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 ">
					<div className=" pb-12 ">
						<main className="lg:px-6 w-full">
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								admins{!isLoading && <span> - {adminNumber}</span>}
							</h2>
							{/* search by username */}
							<div className="flex items-stretch space-x-4">
								<input
									onInput={handleChange}
									disabled={!admins.length}
									placeholder="search by email"
									className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm h-12"
								/>
								<button
									id="search-admins"
									className="bg-topaz flex-none subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm h-12 xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2"
								>
									<svg
										className="h-6 w-6"
										viewBox="0 0 24 24"
										strokeWidth="2"
										stroke="currentColor"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<circle cx="10" cy="10" r="7"></circle>
										<line x1="21" y1="21" x2="15" y2="15"></line>
									</svg>
								</button>
							</div>

							{/* Admin list */}
							{!isLoading && !!filteredList.length && (
								<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
									<ul role="list" className="divide-y-2 divide-onyx">
										{filteredList.map(
											({
												firstName,
												lastName,
												email,
												createdAt,
												itemsReviewed,
												id,
												imagePath,
											}: IAdmin) => (
												<AdminCard
													key={id}
													name={
														firstName !== ""
															? `${firstName} ${lastName}`
															: email
													}
													email={email}
													joinedOn={createdAt}
													itemsReviewed={itemsReviewed}
													linkTo={`admin-detail/${id}`}
													profileImg={
														imagePath
															? imagePath : undefined
													}
												/>
											)
										)}
									</ul>
								</div>
							)}

							{/* Pagination */}
							{!isFiltering && adminNumber > pageSize && (
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
													{page * size + 1}
												</span>{" "}
												to
												<span className="font-medium">
													{" "}
													{(page + 1) * size > totalElements
														? totalElements
														: (page + 1) * size}
												</span>{" "}
												of
												<span className="font-medium">
													{" "}
													{totalElements}
												</span>{" "}
												items
											</p>
										</div>
										{totalElements > (filteredList.length || pageSize) && (
											<div className="flex flex-1 justify-between sm:justify-end">
												<button
													id="pagination-previous"
													onClick={previousPage}
													disabled={page === 0}
													className={`${
														page === 0 ? "opacity-50 cursor-not-allowed" : ""
													} relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
												>
													previous
												</button>
												<button
													id="pagination-next"
													onClick={nextPage}
													disabled={page === totalPages - 1}
													className={`${
														page === totalPages - 1
															? "opacity-50 cursor-not-allowed"
															: ""
													} relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
												>
													next
												</button>
											</div>
										)}
									</nav>
								</div>
							)}
						</main>
					</div>
				</div>
				<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto ">
					<div className="w-full"></div>
				</div>
			</div>
		</div>
	);
};

// export default Admins;
export default dynamic(() => Promise.resolve(Admins), { ssr: false });
