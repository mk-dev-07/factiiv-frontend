import Head from "next/head";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
//SVGs
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import useProtected from "../../hooks/useProtected";
import { useFactiivStore } from "../../store";
import TradeCard from "../../components/trade-card";
import { useQuery } from "react-query";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import React from "react";
import { NextPageContext } from "next";
import Link from "next/link";
import PaymentHistory from "../../components/payment-history";
import LoadingOverlay from "../../components/loading-overlay";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { Trade } from "../../types/trade.interface";
import { LogoSvg } from "../../components/svgs/LogoSvg";

export async function getServerSideProps({ query }: NextPageContext) {
	const tradeId = query.tradeId;

	return {
		props: {
			tradeId,
		},
	};
}

const TradeDetails = ({ tradeId }: PropsWithChildren & { tradeId: string }) => {
	const router = useRouter();

	useProtected();
	const store = useFactiivStore();
	const { token } = store;
	const { refreshedFetch } = useAuthenticatedFetch();

	const { data: trade, isLoading } = useQuery(
		["getTrade", tradeId],
		async () => {
			if (!tradeId || !token) {
				return;
			}

			const {
				publicRuntimeConfig: { apiUrl },
			} = getConfig();

			let tradeResponse;
			try {
				const headers = new Headers();
				headers.append("Authorization", `Bearer ${token}`);
				tradeResponse = await refreshedFetch(`${apiUrl}/trades/${tradeId}`, {
					headers,
				});
			} catch (error) {
				console.log(error);
			}

			if (!tradeResponse) throw Error("Fetch failed");

			const tradeData = await tradeResponse?.json();
			return tradeData.payload as Trade;
		},
		{ enabled: !!tradeId }
	);

	const [isTradeAccepted, setIsTradeAccepted] = useState(false);
	useEffect(() => {
		setIsTradeAccepted(
			trade?.adminStatus?.toUpperCase() === "ACCEPTED" &&
				trade?.tradeStatus?.toUpperCase() === "ACCEPTED"
		);
	}, [trade]);

	const hasPendingActivity = useMemo(() => {
		return (
			trade?.activities?.some(
				(activity) => activity?.adminStatus?.toLowerCase() === "pending"
			) || false
		);
	}, [trade, trade?.activities]);

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Trade details | factiiv</title>
			</Head>
			{isLoading && <LoadingOverlay />}
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full astro-UHFQUROE">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] astro-UHFQUROE">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 astro-UHFQUROE">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 astro-UHFQUROE">
						<LogoSvg></LogoSvg>
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 astro-UHFQUROE">
						<div className=" pb-12 astro-UHFQUROE">
							<main className="lg:px-6 w-full">
								<h2
									id="payment-history"
									className="text-xl text-onyx font-medium dark:text-pearl-shade my-3"
								>
									{" "}
									trade details{" "}
								</h2>
								{trade ? (
									<TradeCard
										trade={trade}
										showSidebar={false}
										showDetailsButton={false}
										showInteractiveStatus={false}
										path={router.route}
									></TradeCard>
								) : null}
								<PaymentHistory
									showFact={false}
									trades={trade ? [trade] : []}
									showOverdueCalendar={true}
									filter={(activity) => activity.adminStatus?.toLowerCase() === "accepted"}
								></PaymentHistory>
								{hasPendingActivity && (
									<p className="text-xl text-red-500 text-center">
										{
											"This trade has a pending activity. Another activity can not be created until verification by an admin."
										}
									</p>
								)}
								<div
									className={`mx-auto max-w-max mt-6 ${
										!isTradeAccepted && hasPendingActivity ? "opacity-50" : ""
									}`}
								>
									{trade?.id && isTradeAccepted && !hasPendingActivity ? (
										<>
											{" "}
											<Link
												href={`/new-activity/${trade?.id}`}
												className="group grid"
											>
												<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform"></span>
												<span
													className={`bg-topaz subpixel-antialiased ${
														isTradeAccepted ? "group-hover:-translate-y-1" : ""
													} translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2`}
												>
													report new activity
												</span>
											</Link>
											{/* <a
												href="/report"
												className="mt-3 font-medium py-1 px-2 text-sm text-center block rounded text-gray-500 hover:text-onyx focus:text-onyx"
											>
												report missing activity
											</a> */}
										</>
									) : (
										<>
											<span className="group grid cursor-not-allowed opacity-50">
												<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform"></span>
												<span className="bg-topaz subpixel-antialiased translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
													report new activity
												</span>
											</span>
											{/* <span className="mt-3 font-medium py-1 px-2 text-sm text-center block rounded text-gray-500 focus:text-onyx cursor-not-allowed  opacity-50 ">
												report missing activity
											</span> */}
										</>
									)}
								</div>
							</main>
						</div>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto astro-UHFQUROE">
						<div className="w-full mt-12">
							<div className="w-full sticky top-6">
								<div className="relative mt-4">
									<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
										<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
											<b className="text-bold text-onyx px-1">fact</b>
										</p>
										<p>
											either party can report new activity on a trade but both
											parties must confirm reported activity
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

export default TradeDetails;
