import Head from "next/head";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { PrintSvg } from "../../components/svgs/PrintSvg";
import useProtected from "../../hooks/useProtected";
import { useRouter } from "next/router";
import getConfig from "next/config";
import { useReactToPrint } from "react-to-print";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import FactiivCreditScore from "../../components/factiiv-credit-score";
import Image from "next/image";
import PlaceholderPic from "../../public/images/placeholder.png";
import VerifiedSvg from "../../components/svgs/VerifiedSvg";
import { dateToString } from "../../utils/date.utils";
import { useFactiivStore } from "../../store";
import { useQuery } from "react-query";
import TradeCard from "../../components/trade-card";
import AnimatedLogoSvg from "../../components/svgs/AnimatedLogoSvg";
import { Trade } from "../../types/trade.interface";

const ShareReport = () => {
	const router = useRouter();
	const store = useFactiivStore();
	const {
		publicRuntimeConfig: { rootUrl, apiUrl },
	} = getConfig();

	const { profileId } = router.query;

	const printRef = useRef<null | HTMLDivElement>(null);
	const handlePrint = useReactToPrint({
		content: () => printRef.current,
		bodyClass: "printBody",
		pageStyle: "p {color: rgb(20 41 53);}",
	});

	const { data: reportData, isLoading } = useQuery(
		["shareReport", profileId],
		async () => {
			try {
				console.log("shareReport 1: ", new Date());
				const res = await fetch(`${apiUrl}/public/share-report/${profileId}`);
				console.log("shareReport 2: ", new Date());
				if (!res.ok) {
					console.log(await res.json());
					// router.replace("/login");
				}

				return await res.json();
			} catch (error) {
				console.log(error);
			}
		},
		{ enabled: !!profileId }
	);
	const [tradeList, setTradeList] = useState<Trade[]>([]);

	const [tab, setTab] = useState<"factiiv" | "3rd-party">("factiiv");

	const changeTab = (tabLabel: "factiiv" | "3rd-party") => {
		setTab(tabLabel);
	};

	useEffect(() => {
		setTradeList([
			...(reportData?.myTrades ?? []),
			...(reportData?.tradesWithMe ?? []),
		]);
	}, [reportData]);

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Share credit report | factiiv</title>
			</Head>
			<header className="pt-4 px-2 xs:px-4 sm:px-6 sm:pt-6 flex justify-between items-center max-w-7xl mx-auto astro-QSOS5H3R">
				<div className="w-16 overflow-hidden xs:w-auto astro-QSOS5H3R">
					<LogoSvg></LogoSvg>
				</div>
				<a href="/register" className="group grid">
					<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform"></span>
					<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
						join factiiv
					</span>
				</a>
			</header>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				{isLoading && (
					<div className="w-full flex justify-center">
						<AnimatedLogoSvg className={"bg-transparent"}></AnimatedLogoSvg>
					</div>
				)}
				{!isLoading && !reportData && (
					<p className="text-onyx text-center text-xl mt-10">No report found</p>
				)}
				{!isLoading && reportData && (
					<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
						{/* <Sidebar /> */}
						<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0"></div>
						<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24"></div>
						{/* <HeaderActions></HeaderActions> */}
						<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
							<div className=" pb-12">
								<main className="relative lg:px-6 pt-6 w-full">
									<div className="relative">
										<div className="absolute right-0 top-0 flex space-x-3">
											{/* print button */}
											<button
												onClick={handlePrint}
												id="print-my-report"
												className="hover:bg-onyx/10 rounded focus:ring-2 focus:ring-topaz focus:border-topaz active:bg-onyx/20 inline-flex items-center border-2 border-onyx p-1 pr-3 space-x-1"
											>
												<PrintSvg></PrintSvg>
												<span className="sr-only">print</span>
												<span className="text-left">print</span>
											</button>
										</div>
									</div>
									<div ref={printRef}>
										<p className="text-base font-medium pt-12 xs:pt-6 sm:pt-0">
											factiiv credit report for:
										</p>
										<div className="flex items-center space-x-3">
											<div className="h-12 w-12 relative rounded-full border-2 border-onyx">
												<img
													className="w-full h-full object-cover rounded-full"
													src={
														reportData?.imagePath
															? reportData?.imagePath
															: PlaceholderPic.src
													}
													alt={`connection ${reportData?.businessName} image`}
												/>
											</div>
											<h2 className="text-onyx text-lg xs:text-2xl sm:text-3xl font-bold -mt-1 inline-block whitespace-nowrap">
												<span className="whitespace-normal">
													{reportData?.profileInfo?.businessName}
												</span>
												&nbsp;{" "}
												{reportData?.profileDataStatus ? (
													<VerifiedSvg className="text-onyx-light w-6 h-6 inline"></VerifiedSvg>
												) : null}
											</h2>
										</div>
										<address>
											{/* <div>80 Rosedale Road Suite 316 Watertown, MA 02472</div> */}
											<div>
												{reportData?.profileInfo?.street}{" "}
												{reportData?.profileInfo?.city}
												{reportData?.profileInfo?.state ||
												reportData?.profileInfo?.state
													? ","
													: ""}{" "}
												{reportData?.profileInfo?.zip}
											</div>
										</address>
										<p className="font-medium text-base bg-gold-lighter inline-block px-2 rounded-sm border-2 border-gold-light mt-2">
											report date:{" "}
											<b>
												{dateToString(new Date(reportData?.reportDate), {})}
											</b>
										</p>
										<div className="flex flex-col-reverse sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:items-start lg:items-stretch">
											<div className="mt-6 border-2 border-onyx rounded-md md:col-span-2">
												<dl className="rounded-md overflow-hidden bg-pearl">
													<div className="bg-pearl px-4 py-5 md:grid md:grid-cols-3 md:gap-4 md:px-6">
														<dt className="text-sm font-medium text-onyx-light">
															year founded
														</dt>
														<dd className="mt-1 text-sm text-onyx md:col-span-2 md:mt-0">
															{new Date(
																reportData?.profileInfo?.businessStartDate
															).getFullYear() || "N/A"}
														</dd>
													</div>
													<div className="bg-gold-lightest px-4 py-5 md:grid md:grid-cols-3 md:gap-4 md:px-6">
														<dt className="text-sm font-medium text-onyx-light">
															date incorporated
														</dt>
														<dd className="mt-1 text-sm text-onyx md:col-span-2 md:mt-0">
															N/A
														</dd>
													</div>
													<div className="bg-pearl px-4 py-5 md:grid md:grid-cols-3 md:gap-4 md:px-6">
														<dt className="text-sm font-medium text-onyx-light">
															EIN
														</dt>
														<dd className="mt-1 text-sm text-onyx md:col-span-2 md:mt-0">
															{reportData?.ein ?? "N/A"}
														</dd>
													</div>
													<div className="bg-gold-lightest px-4 py-5 md:grid md:grid-cols-3 md:gap-4 md:px-6">
														<dt className="text-sm font-medium text-onyx-light">
															contact person
														</dt>
														<dd className="mt-1 text-sm text-onyx md:col-span-2 md:mt-0">
															{/* John Doe - Owner */}
															{/* {getOwnerName()} */}
															{reportData?.ownerName}{" "}
															{reportData?.isOwner ? "- owner" : ""}
														</dd>
													</div>
													<div className="bg-pearl px-4 py-5 md:grid md:grid-cols-3 md:gap-4 md:px-6">
														<dt className="text-sm font-medium text-onyx-light">
															phone
														</dt>
														<dd className="mt-1 text-sm text-onyx md:col-span-2 md:mt-0">
															{reportData?.phoneNumber}
														</dd>
													</div>
													<div className="bg-gold-lightest px-4 py-5 md:grid md:grid-cols-3 md:gap-4 md:px-6">
														<dt className="text-sm font-medium text-onyx-light">
															website
														</dt>
														<dd className="mt-1 text-sm md:col-span-2 md:mt-0 text-topaz-dark hover:text-topaz font-medium">
															<a
																href={
																	reportData?.website.slice(0, 3) === "http"
																		? reportData?.website
																		: "https://" + reportData?.website
																}
																target="_blank"
																rel="noreferrer"
															>
																{reportData?.website}
															</a>
														</dd>
													</div>
												</dl>
											</div>
											{/* factiiv score */}
											<div className="mt-6 border-2 border-onyx rounded-md px-6 pt-6 bg-pearl">
												<span className="w-full flex -mt-3 justify-center">
													<button
														id="factiiv-tab"
														onClick={() => changeTab("factiiv")}
														type="button"
														className={
															"border-onyx relative inline-flex items-center rounded-l-md border-2 px-4 py-1 text-sm font-medium focus:z-10 focus:outline-none " +
															(tab === "factiiv"
																? "bg-topaz text-white "
																: "text-onyx")
														}
													>
														factiiv
													</button>
													<button
														id="3rd-party-rab"
														onClick={() => changeTab("3rd-party")}
														type="button"
														className={
															"text-onyx border-onyx relative -ml-px inline-flex items-center rounded-r-md border-2 px-4 py-1 text-sm font-medium focus:z-10 focus:outline-none " +
															(tab === "3rd-party"
																? " bg-topaz text-white "
																: "text-onyx")
														}
													>
														3rd party
													</button>
												</span>
												<div className="max-w-[250px] mx-auto">
													{tab === "factiiv" && (
														<div>
															<FactiivCreditScore
																factiivScore={reportData?.factiivScore || 0}
																reputationScore={
																	reportData?.reputationScore || 0
																}
																historyScore={reportData?.historyScore || 0}
																utilizationScore={
																	reportData?.utilizationScore || 0
																}
															></FactiivCreditScore>
														</div>
													)}
													{tab === "3rd-party" && (
														<div>
															<div>
																<div className="mt-4 mb-2 relative text-onyx w-12 h-12 mx-auto">
																	<svg
																		className="mx-auto h-12 w-12 relative z-[2]"
																		viewBox="0 0 24 24"
																		strokeWidth="2"
																		stroke="currentColor"
																		fill="none"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	>
																		<circle
																			cx="6"
																			cy="6"
																			r="2"
																			vectorEffect="non-scaling-stroke"
																		></circle>
																		<circle
																			cx="18"
																			cy="18"
																			r="2"
																			vectorEffect="non-scaling-stroke"
																		></circle>
																		<path
																			d="M11 6h5a2 2 0 0 1 2 2v8"
																			vectorEffect="non-scaling-stroke"
																		></path>
																		<polyline
																			points="14 9 11 6 14 3"
																			vectorEffect="non-scaling-stroke"
																		></polyline>
																		<path
																			d="M13 18h-5a2 2 0 0 1 -2 -2v-8"
																			vectorEffect="non-scaling-stroke"
																		></path>
																		<polyline
																			points="10 15 13 18 10 21"
																			vectorEffect="non-scaling-stroke"
																		></polyline>
																	</svg>{" "}
																	<div className="absolute rounded-full h-6 w-6 opacity-50 bg-topaz-light top-3 left-3 animate-ping origin-center"></div>
																</div>
															</div>
															<p className="p-4 text-center">
																<b>coming soon!</b> factiiv will support custom
																3rd party reports leveraging factiiv&apos;s
																on-chain data
															</p>
														</div>
													)}
												</div>
											</div>
										</div>
										<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
											{" "}
											business snapshot{" "}
										</h2>
										<div className="grid grid-cols-2 md:grid-cols-4 bg-pearl p-2 border-2 border-onyx rounded-md mt-4">
											<div className="p-2 text-center">
												<p className="text-sm text-onyx">vertical</p>
												<p className="font-bold">
													{reportData?.industry ?? "N/A"}
												</p>
											</div>
											<div className="p-2 text-center">
												<p className="text-sm text-onyx">business size</p>
												{/* <img className="w-24 mx-auto" src="./sole.svg" alt="" /> */}
												<p className="font-bold">
													{reportData?.profileInfo?.businessSize ?? "N/A"}
												</p>
											</div>
											<div className="p-2 text-center">
												<p className="text-sm text-onyx">status</p>
												{/* <img
													className="w-24 mx-auto"
													src="./active.svg"
													alt=""
												/> */}
												<p className="font-bold">active</p>
											</div>
											<div className="p-2 text-center">
												<p className="text-sm text-onyx">risk level</p>
												{/* <img className="w-24 mx-auto" src="./low.svg" alt="" /> */}
												<p className="font-bold">low</p>
											</div>
										</div>
										{!!tradeList?.length && (
											<>
												<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
													{" "}
													trade history{" "}
												</h2>
												<div className="grid grid-cols-1 md:grid-cols gap-6 pb-12">
													{tradeList?.map((trade: Trade) => (
														<TradeCard
															key={trade.id}
															trade={trade}
															showSidebar
															showDetailsButton={false}
															showInteractiveStatus={false}
															showRole={false}
															path={router.route}
														></TradeCard>
													))}
												</div>
											</>
										)}
									</div>
								</main>
							</div>
						</div>
						<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto">
							<div className="mt-12 w-full">
								<div className="w-full sticky top-6">
									<div className="relative mt-4">
										<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
											<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
												<b className="text-bold text-onyx px-1">fact</b>
											</p>
											<p>
												you can share a link to your public factiiv report page
												or print and share a PDF file
											</p>
										</div>
										<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

// export default MyReport;
export default dynamic(() => Promise.resolve(ShareReport), { ssr: false });
