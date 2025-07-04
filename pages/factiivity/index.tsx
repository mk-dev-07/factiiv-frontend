import Head from "next/head";
//SVGs
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import { useQuery } from "react-query";
import { useFactiivStore } from "../../store";
import TradeCard from "../../components/trade-card";
import Link from "next/link";
import LoadingOverlay from "../../components/loading-overlay";
import useProtected from "../../hooks/useProtected";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import React, { useState } from "react";
import getConfig from "next/config";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { LogoSvg } from "../../components/svgs/LogoSvg";

const Factiivity = () => {
	const router = useRouter();
	useProtected();
	const store = useFactiivStore();
	const { refreshedFetch } = useAuthenticatedFetch();
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const { token, activeProfile } = store;
	const [trades, setTrades] = useState([]);
	const [pageSize] = useState(10);
	const [totalElements, setTotalElements] = useState(0);

	const handleNextPage = () => {
		const totalPages = tradesQuery?.data.totalPages - 1;
		if (currentPage < totalPages) {
			setCurrentPage((prev) => prev + 1);
		}
	};

	const handlePreviousPage = () => {
		if (currentPage > 0) {
			setCurrentPage((prev) => prev - 1);
		}
	};

	const fetchAllTrades = async () => {
		const profileId = activeProfile.id;

		if (!profileId) {
			return;
		}
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();
		try {
			const response = await refreshedFetch(
				`${apiUrl}/trades/history-page/${profileId}?page=${currentPage}&sortBy=updatedAt&size=${pageSize}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
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

	const tradesQuery = useQuery({
		queryKey: ["tradesHistory", currentPage],
		keepPreviousData: true,
		queryFn: fetchAllTrades,
		onSuccess: (dataResponse) => {
			if (dataResponse) {
				console.log(dataResponse);
				setTrades(dataResponse.content);
				setTotalElements(dataResponse.totalElements);
				setIsLoading(false);
			}
		},
		onError: (error) => {
			console.log(error);
			setIsLoading(false);
		},
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		initialData: [],
		enabled: !!store?.activeProfile?.id,
	});

	return (
		<div>
			{isLoading && <LoadingOverlay />}
			<Head>
				<title>Factiivity | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full astro-GCQE7J5L">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] astro-GCQE7J5L">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 astro-GCQE7J5L">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 astro-GCQE7J5L">
						<LogoSvg></LogoSvg>
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 astro-GCQE7J5L">
						<main className="p-6 w-full">
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								{" "}
								trade history{" "}
							</h2>
							{!store.activeProfile.profileDataStatus && (
								<p className="text-center text-xl text-red-500">
									You need to be verified to see your trades.
								</p>
							)}
							{store.activeProfile.profileDataStatus &&
								trades?.length === 0 && (
								<p className="text-center">There are no trades for now.</p>
							)}
							<div className="grid grid-cols-1 gap-6">
								{store.activeProfile.profileDataStatus &&
									trades?.length !== 0 &&
									trades?.map((trade: any) => (
										<TradeCard
											trade={trade}
											key={trade.id}
											path={router.route}
										></TradeCard>
									))}
							</div>

							<nav
								className="flex items-center justify-between px-4 py-3 sm:px-6"
								aria-label="Pagination"
							>
								<div className="hidden sm:block">
									{!!totalElements && (
										<p className="text-sm text-gray-700">
											showing
											<span className="font-medium">
												{" "}
												{currentPage * pageSize + 1}{" "}
											</span>
											to
											<span className="font-medium">
												{" "}
												{(currentPage + 1) * pageSize < totalElements
													? (currentPage + 1) * pageSize
													: totalElements}{" "}
											</span>
											of
											<span className="font-medium">
												{" "}
												{totalElements}{" "}
											</span>
											items
										</p>
									)}
									
								</div>
								{(totalElements > pageSize) ? (
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

							<div className="mx-auto max-w-max mt-6">
								{store.activeProfile.profileDataStatus ? (
									<>
										<Link href="/new-trade" className="relative group block">
											<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
												{" "}
												report new trade{" "}
											</span>
											<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
										</Link>
										{/* <Link
											href="/report"
											className="mt-3 font-medium py-1 px-2 text-sm text-center block rounded text-gray-500 hover:text-onyx focus:text-onyx"
										>
											report missing trades
										</Link> */}
									</>
								) : (
									<>
										<button className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4 opacity-50 cursor-not-allowed">
											report new trade{" "}
										</button>
										{/* <button className="mt-3 font-medium py-1 px-2 text-sm text-center block rounded text-gray-500 hover:text-onyx focus:text-onyx mx-auto">
											report missing trades
										</button> */}
									</>
								)}
							</div>
						</main>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto astro-GCQE7J5L">
						<div className="p-6 w-full mt-8">
							<div className="w-full sticky top-6">
								<div className="relative mt-4">
									<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
										<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
											<b className="text-bold text-onyx px-1">fact</b>
										</p>
										<p>
											in the future factiiv trade data will be radically simpler
										</p>
									</div>
									<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default dynamic(() => Promise.resolve(Factiivity), { ssr: false });
