import Head from "next/head";
import { useState, useMemo, useEffect } from "react";
//SVGs
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import useProtected from "../../hooks/useProtected";
import { useFactiivStore } from "../../store";
import PaymentHistoryTable from "../../components/payment-history-table";
// import useTrades from "../../hooks/useTrades";
import {
	CreditAgeTableData,
	PaymentHistoryTableData,
	TotalCreditUtilizationData,
} from "../../types/score-details.interface";
import { dateToString } from "../../utils/date.utils";
import { ActivityType, TradeRole } from "../../constants/trade.enum";
import LoadingOverlay from "../../components/loading-overlay";
import CreditAgeTable from "../../components/credit-age-table";
import millisecondsToMinutes from "date-fns/millisecondsToMinutes";
import minutesToHours from "date-fns/minutesToHours";
import CreditUtilizationTable from "../../components/credit-utilization-table/indes";
import ImprovementsList from "../../components/improvements-list";
import PaymentHistory from "../../components/payment-history";
import { Improvement } from "../../types/improvements.interface";
import { useCreditAge } from "../../hooks/useCreditAge";
import { useCreditUtilization } from "../../hooks/useCreditUtilization";
import Tooltip from "../../components/tooltip";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { Trade } from "../../types/trade.interface";

const ScoreDetails = () => {
	useProtected();

	const store = useFactiivStore();
	const { activeProfile } = store;

	// const [isLoading, setIsLoading] = useState(false);

	const [trades, setTrades] = useState<Trade[]>([]);
	const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
	useEffect(() => {
		const { myTrades = [], tradesWithMe = [] } = activeProfile;

		setFilteredTrades([
			...myTrades.filter(
				(trade) =>
					trade.relationDescription === TradeRole.BUYER ||
					trade.relationDescription === TradeRole.BORROWER
			),
			...tradesWithMe.filter(
				(trade) =>
					trade.relationDescription === TradeRole.SELLER ||
					trade.relationDescription === TradeRole.LENDER
			),
		]);
		setTrades([...myTrades, ...tradesWithMe]);
	}, [activeProfile.tradesWithMe, activeProfile.myTrades]);

	// useEffect(() => {
	// 	setIsLoading(true);
	// }, []);

	// useEffect(() => {
	// 	setIsLoading(false);
	// }, [isTradeFetchInProgress]);

	const { totalCreditUtilizationData } = useCreditUtilization(
		filteredTrades ?? []
	);

	const { averageTradeAge, tradesAgeData } = useCreditAge(trades ?? []);

	const [improvementsNumber, setImprovementsNumber] = useState(1);
	const onImprovementsChange = (improvements: Improvement[]) => {
		setImprovementsNumber(improvements.filter((item) => item.show).length);
	};

	const [utilizationScoreFixed, setUtilizationScoreFixed] = useState("0");
	useEffect(() => {
		setUtilizationScoreFixed((activeProfile?.utilizationScore)?.toFixed(0));
	}, [activeProfile.utilizationScore]);

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Score details | factiiv</title>
			</Head>
			{/* {isLoading && <LoadingOverlay></LoadingOverlay>} */}
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full ">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] ">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 ">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 ">
						<LogoSvg />
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 ">
						<div className=" pb-12 ">
							{/* {isTradeFetchError && (
								<p>There was an error, please refresh the page</p>
							)} */}

							<main className="lg:px-6 w-full">
								<PaymentHistory
									trades={filteredTrades}
									filter={({ activityType, adminStatus }) =>
										adminStatus === "accepted" &&
										(activityType === ActivityType.PAYMENT ||
											activityType === ActivityType.CHARGE)
									}
									showExplanationTooltip={true}
									showViewLink={true}
								></PaymentHistory>
								<h2
									id="credit-age"
									className="text-xl text-onyx font-medium dark:text-pearl-shade my-3"
								>
									{" "}
									credit age{" "}
									<Tooltip text="credit age is the average age of all your trade accounts."></Tooltip>
								</h2>
								<div className="max-w-sm mb-6">
									<div className="mb-2">
										<div className="rounded bg-gold-lighter flex-1 flex flex-col items-center py-2 border-2 border-onyx">
											<p className="font-extrabold text-sm sm:text-base">
												average trade age
											</p>
											<p className="font-extrabold text-3xl">
												{averageTradeAge}
											</p>
										</div>
									</div>
								</div>
								<div className="w-full overflow-x-auto bg-pearl rounded-md border-2 border-onyx">
									<CreditAgeTable data={tradesAgeData}></CreditAgeTable>
								</div>
								{!!tradesAgeData?.length && (
									<nav
										className="flex items-center justify-between px-4 py-3 sm:px-6"
										aria-label="Pagination"
									>
										<div className="hidden sm:block">
											<p className="text-sm text-gray-700">
												{" "}
												showing <span className="font-medium">1</span> to{" "}
												<span className="font-medium">
													{tradesAgeData.length}
												</span>{" "}
												of{" "}
												<span className="font-medium">
													{tradesAgeData.length}
												</span>{" "}
												items{" "}
											</p>
										</div>
									</nav>
								)}
								<h2
									id="credit-utilization"
									className="text-xl text-onyx font-medium dark:text-pearl-shade my-3"
								>
									{" "}
									credit utilization{" "}
									<Tooltip text="utilization represents how much of your credit limit you are using. higher usage can negatively affect your score."></Tooltip>
								</h2>
								<div className="max-w-sm mb-6">
									<div className="mb-2">
										<div className="rounded bg-gold-lighter flex-1 flex flex-col items-center py-2 border-2 border-onyx">
											<p className="font-extrabold text-sm sm:text-base">
												total credit utilization
											</p>
											<p className="font-extrabold text-3xl">
												{utilizationScoreFixed ?? 0}%
											</p>
										</div>
									</div>
								</div>
								<div className="w-full overflow-x-auto bg-pearl rounded-md border-2 border-onyx">
									<CreditUtilizationTable
										data={totalCreditUtilizationData}
									></CreditUtilizationTable>
								</div>
								{!!totalCreditUtilizationData?.length && (
									<nav
										className="flex items-center justify-between px-4 py-3 sm:px-6"
										aria-label="Pagination"
									>
										<div className="hidden sm:block">
											<p className="text-sm text-gray-700">
												{" "}
												showing <span className="font-medium">1</span> to{" "}
												<span className="font-medium">
													{totalCreditUtilizationData.length}
												</span>{" "}
												of{" "}
												<span className="font-medium">
													{totalCreditUtilizationData.length}
												</span>{" "}
												items{" "}
											</p>
										</div>
									</nav>
								)}
							</main>
						</div>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto ">
						{improvementsNumber > 0 && (
							<div className="w-full">
								<div className="w-full sticky top-6">
									<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
										{" "}
										improvements{" "}
									</h2>
									<ImprovementsList
										change={onImprovementsChange}
									></ImprovementsList>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ScoreDetails;
