import Head from "next/head";
import useProtected from "../../hooks/useProtected";
import { useFactiivStore } from "../../store";
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import Scores from "../../components/scores";
import ImprovementsList from "../../components/improvements-list";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import HighlightCard from "../../components/highlight-card";
import Link from "next/link";
import useProfile from "../../hooks/useProfile";
import getConfig from "next/config";
import { Improvement } from "../../types/improvements.interface";
import Image from "next/image";
import PlaceholderImage from "../../public/images/placeholder.png";
import { convertDateToPeriod } from "../../utils/date.utils";
import { Trade } from "../../types/trade.interface";
import { useCreditAge } from "../../hooks/useCreditAge";
import { useCreditUtilization } from "../../hooks/useCreditUtilization";
import { usePaymentHistory } from "../../hooks/usePaymentHistory";
import useTrades from "../../hooks/useTrades";
import dynamic from "next/dynamic";

const Dashboard = () => {
	useProtected();
	const { refetch: refetchProfile } = useProfile({ fetchSurvey: true });
	const store = useFactiivStore();
	const { activeProfile } = store;

	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	const { data: trades } = useTrades();

	const { onTimePayments } = usePaymentHistory(trades ?? []);
	const { averageAgeNumber, averageAgeSuffix } = useCreditAge(trades ?? []);
	const [networkTrades, setNetworkTrades] = useState<number>(0);

	const refreshProfile = useCallback(() => {
		refetchProfile();
	}, [activeProfile?.id]);

	useEffect(() => {
		window.addEventListener("focus", refreshProfile);
		return () => {
			window.removeEventListener("focus", refreshProfile);
		};
	}, [activeProfile]);

	useEffect(() => {
		sortTrades();
	}, [store]);

	useEffect(() => {
		setNetworkTrades(
			store?.activeProfile?.tradesWithMe?.length +
				store?.activeProfile?.myTrades?.length
		);
	}, [store?.activeProfile?.tradesWithMe, store?.activeProfile?.myTrades]);

	const [improvementsNumber, setImprovementsNumber] = useState(3);
	const onImprovementsChange = (improvements: Improvement[]) => {
		setImprovementsNumber(improvements.filter((item) => item.show).length);
	};

	const [sortedTrades, setSortedTrades] = useState<
		{
			name: string;
			items: Trade[];
		}[]
	>([]);
	const sortTrades = () => {
		const todayTrades: Trade[] = [];
		const thisWeekTrades: Trade[] = [];
		const earlierTrades: Trade[] = [];

		activeProfile?.myTrades?.forEach((trade) => {
			const category = convertDateToPeriod(new Date(trade.createdAt));
			switch (category) {
			case "today":
				todayTrades.push(trade);
				break;
			case "this week":
				thisWeekTrades.push(trade);
				break;
			default:
				earlierTrades.push(trade);
				break;
			}
		});
		setSortedTrades([
			...(todayTrades.length > 0
				? [{ name: "today", items: todayTrades }]
				: []),
			...(thisWeekTrades.length > 0
				? [{ name: "this week", items: thisWeekTrades }]
				: []),
			...(earlierTrades.length > 0
				? [{ name: "earlier", items: earlierTrades }]
				: []),
		]);
	};

	const [fixedUtilizationScore, setFixedUtilizationScore] = useState("0");
	useEffect(() => {
		setFixedUtilizationScore((activeProfile.utilizationScore || 0).toFixed(0));
	}, [activeProfile?.utilizationScore]);

	const utilizationScoreMessage = useMemo(() => {
		if (activeProfile?.utilizationScore === null) {
			return "";
		}

		const score = activeProfile?.utilizationScore;

		if (score < 34) {
			return "this is very good";
		}
		if (score < 67) {
			return "this is okay";
		}

		return "this is a bit high";
	}, [activeProfile?.utilizationScore]);

	return (
		<div>
			<Head>
				<title>Dashboard | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
						<LogoSvg />
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
						<main className="lg:px-6 lg:pb-24 w-full">
							<div>
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									{" "}
									my score{" "}
								</h2>
								<div
									className={`bg-pearl dark:bg-onyx-light rounded-lg mb-4 p-4 xs:-p-5 sm:p-6 border-2 border-onyx-light mt-2 grid grid-cols-1 sm:grid-cols-2 ${
										improvementsNumber > 0 ? "lg:grid-cols-3" : "lg:grid-cols-2"
									} md:py-6 md:px-6 gap-6 sm:gap-10 xl:gap-12`}
								>
									<Scores></Scores>
									{/* improvements */}
									<div
										className={`flex flex-col col-span-1 sm:col-span-2 lg:col-span-1 xl:max-w-[290px] w-full ml-auto ${
											improvementsNumber === 0 ? "hidden h-0 w-0" : ""
										}`}
									>
										<div className="pb-2">
											<h2 className="font-medium text-center text-base xs:text-lg lg:text-xl 2xl:text-2xl">
												improvements
											</h2>
										</div>
										<ImprovementsList
											change={onImprovementsChange}
										></ImprovementsList>
									</div>
								</div>
								{/* highlights */}
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									highlights
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
									<HighlightCard
										name="payment history"
										number={Math.floor(activeProfile?.historyScore) || "0"}
										superscript="%"
										desc="on-time payments"
										linkLabel="view history"
										linkTo="/score-details#payment-history"
									/>
									<HighlightCard
										name="factiivity"
										number={networkTrades + "" ?? "0"}
										desc="network trades"
										linkLabel="view trades"
										linkTo="/factiivity"
									/>
									<HighlightCard
										name="credit age"
										number={averageAgeNumber + ""}
										subscript={averageAgeSuffix}
										desc="average account age"
										linkLabel="view age"
										linkTo="/score-details#credit-age"
									/>
									<HighlightCard
										name="credit utilization"
										number={
											store.activeProfile.utilizationScore
												? fixedUtilizationScore
												: "0"
										}
										superscript="%"
										desc={utilizationScoreMessage}
										linkLabel="view usage"
										linkTo="/score-details#credit-utilization"
									/>
								</div>
							</div>
						</main>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-36 xl:w-60 2xl:w-72 mx-auto">
						{sortedTrades?.length > 0 && (
							<div className="w-full">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									recent trades
								</h2>
								{sortedTrades.map((period, index) => {
									if (period.items.length > 0)
										return (
											<div key={index}>
												<h2 className="font-bold">{period.name}</h2>
												<ul className="mt-6">
													{period.items.map((trade, index) => {
														if (index > 4) return null;

														const isFromMe =
															trade?.fromProfileId === activeProfile?.id;

														return (
															<li key={trade.id} className="py-2">
																<Link
																	href={`/trade-details/${trade.id}`}
																	className="flex py-2 rounded hover:bg-onyx/10 px-3"
																>
																	<div className="h-14 w-14 relative rounded-full border-2 border-onyx flex shrink-0">
																		<img
																			className="h-full w-full object-cover rounded-full"
																			src={
																				trade.toProfilePhotoPath
																					? trade.toProfilePhotoPath
																					: PlaceholderImage.src
																			}
																			alt={`connection ${
																				isFromMe
																					? trade.fromCompanyName
																					: trade.toCompanyName
																			} image`}
																		/>
																	</div>
																	<span className="ml-3">
																		<p className="text-lg font-medium text-gray-900 dark:text-pearl-shade">
																			{trade.toCompanyName}
																		</p>
																		<p className="text-base text-gray-500 -mt-1 dark:text-gray-400">
																			{trade?.amount
																				? "$" +
																				  Math.floor(Number(trade?.amount))
																				: "0"}
																		</p>
																	</span>
																</Link>
															</li>
														);
													})}
												</ul>
											</div>
										);
								})}
								<div className="mt-6">
									<Link href="/factiivity" className="relative group">
										<span className="bg-onyx z-[2] relative group-hover:-translate-y-1 group-hover:bg-topaz focus:-translate-y-1 focus:bg-topaz focus:outline-none border-2 transition-transform duration-150 border-onyx text-white rounded py-1 text-lg pl-4 pr-2 w-full flex items-center justify-between">
											{" "}
											all trades{" "}
											<svg
												className="h-6 w-6"
												viewBox="0 0 24 24"
												strokeWidth="2"
												stroke="currentColor"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<line x1="7" y1="17" x2="17" y2="7"></line>
												<polyline points="7 7 17 7 17 17"></polyline>
											</svg>
										</span>
										<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
									</Link>
									{/* <div className="border-t-2 border-onyx mt-2 flex justify-between items-center text-gray-500 dark:text-gray-400 pt-2 text-sm">
										<div className="flex items-center space-x-2">
											<svg
												viewBox="0 0 24 24"
												className="h-4 w-4"
												stroke="currentColor"
												strokeWidth="2"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<circle cx="12" cy="12" r="10"></circle>
												<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
												<line x1="12" y1="17" x2="12.01" y2="17"></line>
											</svg>
											<span>missing trades?</span>
										</div>
										<Link
											href="/report"
											className="border-gray-300 border-2 hover:bg-gray-200 focus:bg-gray-200 dark:border-gray-600 py-1 px-2 text-xs rounded hover:text-onyx focus:text-onyx"
										>
											report
										</Link>
									</div> */}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
