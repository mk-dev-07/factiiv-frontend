import getConfig from "next/config";
import Head from "next/head";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import BusinessCard from "../../../components/business-card";
import DocumentationTable from "../../../components/documentation-table";
import LoadingOverlay from "../../../components/loading-overlay";
import { LogoAdminSvg } from "../../../components/svgs/LogoAdminSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { useFactiivStore, useAdminStore } from "../../../store";
import Profile from "../../../types/profile.interface";
import { useInfiniteQuery } from "react-query";
import dynamic from "next/dynamic";
import { stringToDate } from "../../../utils/date.utils";
import { useSearchParams } from "next/navigation";

const Documentation = () => {
	const adminStore = useAdminStore();
	// fetch refresh token
	const queryClient = useQueryClient();

	// current page
	const searchParams = useSearchParams();
	const param = searchParams.get("status");

	const [queryStatus, setQueryStatus] = useState(param || "awaiting");
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [pageSize] = useState(5);
	const [isLoading, setIsLoading] = useState(false);

	// handle mext page and previous page with minimal value of 0 and max value of total pages
	const handleNextPage = () => {


		const totalPages = profilesQuery?.data.totalPages - 1;
		console.log("profilesQuery", totalPages, currentPage);
		if (currentPage < totalPages) {
			setCurrentPage((prev) => prev + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 0) {
			setCurrentPage((prev) => prev - 1);
		}
	};

	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();

	// state for profiles and reviews
	const [profiles, setProfiles] = useState<any>([]);
	const [isLoadingProfiles, setIsLoadingProfiles] = useState<boolean>(false);

	//FETCH PROFILES
	const fetchProfiles = async () => {
		try {
			const response = await refreshedFetch(
				`${apiUrl}/admins/profiles/doc-by-status?page=${currentPage}&size=${pageSize}&sortBy=docSubmittedAt&status=${queryStatus}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${adminStore.token}`,
					},
				}
			);

			if (response.status === 404) {
				return { content: [] };
			}
			const data = await response.json();
			return data.payload;
		} catch (error) {
			return null;
		}
	};

	const profilesQuery = useQuery({
		queryKey: ["profilesDocumentsUnverified", currentPage, queryStatus],
		keepPreviousData: true,
		queryFn: fetchProfiles,
		onSuccess: (dataResponse) => {
			if (dataResponse) {
				// check if dataResponse is not null
				setProfiles(dataResponse);
				setIsLoadingProfiles(true);
				setIsLoading(false);
			}
		},
		onError: (error) => {
			console.log(error);
			setIsLoading(false);
		},
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		enabled: true,
	});

	// change between new and reviewed view state
	const handleFilterChange = (status: string) => {
		setCurrentPage(0);
		setQueryStatus(status);
		invalidateUnverified();
	};

	const invalidateUnverified = () => {
		queryClient.invalidateQueries({
			queryKey: ["profilesDocumentsUnverified"],
		});
		profilesQuery.refetch();
	};

	const handleComplete = () => {
		setIsLoading(true);
		invalidateUnverified();
	};

	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full astro-FRXN4BQ7"
		>
			{isLoading && <LoadingOverlay className={"absolute"}></LoadingOverlay>}
			{/* {profilesQuery.isLoading && <LoadingOverlay />} */}
			<Head>
				<title>Documentation submissions | factiiv</title>
			</Head>
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] astro-FRXN4BQ7">
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
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 astro-FRXN4BQ7">
					<div className=" pb-12 astro-FRXN4BQ7">
						<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
							documentation submissions
						</h2>

						<div className="flex justify-end py-2 space-x-2 items-center">
							<p>Filter</p>
							<button
								type="button"
								className={`p-2 border-2 border-onyx text-sm font-medium rounded ${
									queryStatus == "awaiting" ? "bg-topaz text-white" : "bg-pearl"
								}`}
								onClick={() => handleFilterChange("awaiting")}
							>
								new
							</button>
							<button
								type="button"
								className={`p-2 border-2 border-onyx text-sm font-medium rounded ${
									queryStatus == "approved" ? "bg-topaz text-white" : "bg-pearl"
								}`}
								onClick={() => handleFilterChange("approved")}
							>
								approved
							</button>
							<button
								type="button"
								className={`p-2 border-2 border-onyx text-sm font-medium rounded ${
									queryStatus == "rejected" ?  "bg-topaz text-white" : "bg-pearl"
								}`}
								onClick={() => handleFilterChange("rejected")}
							>
								rejected
							</button>
						</div>
						{
							// new profiles
							<div className="space-y-4">
								{isLoadingProfiles ? (
									(Array.isArray(profiles.content) && profiles.content?.length > 0) ? (
										profiles.content.map((profile: Profile) => (
											<BusinessCard
												id={profile.id ? profile.id : "no-id"}
												key={profile.id ? profile.id : "no-id"}
												status={
													profile.reviewedBy &&
													profile.aoiDocumentApproved !== null &&
													profile.einDocumentApproved !== null
														? profile.profileDocsStatus
														: null
												}
												submitTime={
													profile.docSubmittedAt
														? stringToDate(profile.docSubmittedAt)
														: stringToDate(profile.createdAt)
												}
												businessName={
													profile.businessName
														? profile.businessName
														: "no business name"
												}
												ownerName={
													profile.ownerName
														? profile.ownerName
														: "no owner name"
												}
												// reviewBy={profile.reviewedByAdminName}
												reviewBy={
													profile.reviewedByAdminName
														? profile.reviewedByAdminName
														: "n/a"
												}
												img={profile.imagePath ? profile.imagePath : ""}
												userProfileId={
													profile.userId ? profile.userId : "no id"
												}
											>
												<DocumentationTable
													id={profile.id ? profile.id : "no-id"}
													einDocuments={
														profile?.einDocumentPath && rootUrl
															? rootUrl + profile.einDocumentPath
															: ""
													}
													articlesOfIncorporation={
														profile?.aoiDocumentPath && rootUrl
															? rootUrl + profile.aoiDocumentPath
															: ""
													}
													reviewedStatus={
														profile.isReviewed || !!profile.reviewedByAdminName
													}
													// reviewedStatus={profile.isDocsReviewed}
													isEinDocumentBoolReview={profile.einDocumentApproved}
													isEinDocumentNoteReview={profile.einDocumentsNote}
													isAoiDocumentBoolReview={profile.aoiDocumentApproved}
													isAoiDocumentNoteReview={
														profile.articlesOfIncorporationNote
													}
													onComplete={handleComplete}
												/>
											</BusinessCard>
										))
									) : (
										<p>No profiles found.</p> // handle the case where profiles.content is not an array or if it is an empty array
									)
								) : (
									<p>Loading...</p>
								)}
							</div>
						
						}

						<nav
							className="flex items-center justify-between px-4 py-3 sm:px-6"
							aria-label="Pagination"
						>
							<div className="hidden sm:block">
								{!!profiles?.totalElements && (
									<p className="text-sm text-gray-700">
										showing
										<span className="font-medium">
											{" "}
											{currentPage * pageSize + 1}{" "}
										</span>
										to
										<span className="font-medium">
											{" "}
											{(currentPage + 1) * pageSize < profiles?.totalElements
												? (currentPage + 1) * pageSize
												: profiles?.totalElements}{" "}
										</span>
										of
										<span className="font-medium">
											{" "}
											{profiles?.totalElements}{" "}
										</span>
										items
									</p>
								)}
								
							</div>
							{(profiles?.totalElements > pageSize) ? (
								<div className="flex flex-1 justify-between sm:justify-end">
									<button
										type="button"
										onClick={handlePreviousPage}
										className="relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
									>
									previous
									</button>
									<button
										type="button"
										onClick={handleNextPage}
										className="relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
									>
									next
									</button>
								</div>
							) : null}
						</nav>
						{/* </main> */}
					</div>
				</div>
				<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto astro-FRXN4BQ7">
					<div className="w-full"></div>
				</div>
			</div>
		</div>
	);
};

// export default Documentation;
export default dynamic(() => Promise.resolve(Documentation), { ssr: false });
