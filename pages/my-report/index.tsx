import Head from "next/head";
import { useTheme } from "next-themes";
import {
	useEffect,
	useState,
	useRef,
	MouseEventHandler,
	MouseEvent,
	useMemo,
} from "react";
//SVGs
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import useProtected from "../../hooks/useProtected";
import TradeCard from "../../components/trade-card";
import { useFactiivStore } from "../../store";
import { useQuery } from "react-query";
import PlaceholderPic from "../../public/images/placeholder.png";
import VerifiedSvg from "../../components/svgs/VerifiedSvg";
import { dateToString } from "../../utils/date.utils";
import { Trade } from "../../types/trade.interface";
import FactiivCreditScore from "../../components/factiiv-credit-score";
import Image from "next/image";
import getConfig from "next/config";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import useTrades from "../../hooks/useTrades";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { PrintSvg } from "../../components/svgs/PrintSvg";
import { CopySvg } from "../../components/svgs/CopySvg";
import QRCode from "react-qr-code";
import { LogoSvg } from "../../components/svgs/LogoSvg";

const MyReport = () => {
	useProtected();
	const router = useRouter();

	const store = useFactiivStore();
	const { activeProfile, activeProfileInfo, user } = store;
	const {
		publicRuntimeConfig: { rootUrl, serverUrl },
	} = getConfig();

	const { data: tradeList } = useTrades();

	const printRef = useRef<null | HTMLDivElement>(null);
	const handlePrint = useReactToPrint({
		content: () => printRef.current,
		bodyClass: "printBody",
		pageStyle: "body {color: rgb(20 41 53)!important;}",
	});

	// const handlePrint = () => {
	// 	window.print();
	// };

	const [tab, setTab] = useState<"factiiv" | "3rd-party">("factiiv");

	const changeTab = (tabLabel: "factiiv" | "3rd-party") => {
		setTab(tabLabel);
	};

	const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
	const [isCopied, setIsCopied] = useState(false);
	const [shareReportUrl, setShareReportUrl] = useState("");

	const onShareLink = () => {
		setIsSharePopupOpen(true);
	};

	useEffect(() => {
		setShareReportUrl(
			serverUrl + "/share-report/" + activeProfile?.factiivAddress
		);
	}, [activeProfile, activeProfile?.factiivAddress]);

	const onCopyAddress = () => {
		if (!navigator.clipboard) {
			console.log("navigator.clipboard is null");
			return;
		}

		navigator.clipboard.writeText(shareReportUrl);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 3000);
	};

	const riskLevel = useMemo(() => {
		if (!activeProfile?.factiivScore || activeProfile.factiivScore < 251) {
			return "high";
		}
		if (activeProfile.factiivScore < 501) {
			return "medium-high";
		}
		if (activeProfile.factiivScore < 751) {
			return "medium";
		}

		return "low";
	}, [activeProfile.factiivScore]);

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>My report | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0"></div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
						<LogoSvg />
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
						<div className="pb-12">
							<main className="lg:px-6 pt-6 w-full">
								<div className="relative">
									<div className="absolute right-0 top-0 flex space-x-3">
										{/* share link button */}
										<button
											id="share-my-report-link"
											onClick={onShareLink}
											className="hover:bg-onyx/10 rounded focus:ring-2 focus:ring-topaz focus:border-topaz active:bg-onyx/20 inline-flex items-center border-2 border-onyx p-1 pr-3 space-x-1"
										>
											<svg
												className="w-6 h-6"
												viewBox="0 0 24 24"
												strokeWidth="2"
												stroke="currentColor"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<circle cx="6" cy="12" r="3"></circle>
												<circle cx="18" cy="6" r="3"></circle>
												<circle cx="18" cy="18" r="3"></circle>
												<line x1="8.7" y1="10.7" x2="15.3" y2="7.3"></line>
												<line x1="8.7" y1="13.3" x2="15.3" y2="16.7"></line>
											</svg>
											<span className="sr-only">share my report link</span>
											<span className="text-left">share link</span>
										</button>
										{/* share popup */}
										{isSharePopupOpen && (
											<div
												className="fixed z-20"
												aria-labelledby="modal-title"
												role="dialog"
												aria-modal="true"
											>
												<div
													className="fixed inset-0 z-10 overflow-y-auto top-[10vh]"
													onClick={() => setIsSharePopupOpen(false)}
												>
													<div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0">
														<div
															className="relative transform overflow-hidden rounded-md border-2 border-onyx bg-pearl px-4 pt-5 pb-4 text-left transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 shadow-xl shadow-topaz/25"
															onClick={(event: MouseEvent) => {
																event.stopPropagation();
															}}
														>
															<div>
																<h3 className="text-center text-lg font-medium">
																	{activeProfile?.businessName}
																</h3>{" "}
																<div className="mx-auto flex items-center justify-center">
																	<QRCode
																		size={256}
																		className="w-full h-auto max-w-full p-4"
																		value={shareReportUrl}
																		viewBox={"0 0 256 256"}
																	/>
																</div>{" "}
																<div className="mt-3 text-center sm:mt-5 flex space-x-2 items-center">
																	<div className="bg-gray-100 border border-gray-300 rounded p-2 flex-1">
																		<p className="text-sm text-gray-500">
																			{shareReportUrl}
																		</p>
																	</div>{" "}
																	<button onClick={onCopyAddress}>
																		<CopySvg copied={isCopied}></CopySvg>
																	</button>
																</div>
															</div>{" "}
															<div
																className={`mt-5 sm:mt-3 flex justify-center items-center  ${
																	isCopied
																		? "opacity-100 block visible"
																		: "opacity-0 hidden invisible"
																} `}
															>
																<p>Your link has been copied!</p>
															</div>
															<div
																className={`mt-5 ${
																	isCopied ? "sm:mt-3" : "sm:mt-6"
																}`}
															>
																<button
																	className="group grid w-full"
																	onClick={() => setIsSharePopupOpen(false)}
																>
																	<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>{" "}
																	<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
																		close
																	</span>
																</button>
															</div>
														</div>
													</div>
												</div>
											</div>
										)}

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
													activeProfile.imagePath
														? activeProfile.imagePath
														: PlaceholderPic.src
												}
												alt={`connection ${activeProfile.businessName} image`}
											/>
										</div>
										<h2 className="text-onyx text-lg xs:text-2xl sm:text-3xl font-bold -mt-1 inline-block whitespace-nowrap">
											<span className="whitespace-normal">
												{activeProfile.businessName}
											</span>
											&nbsp;{" "}
											{activeProfile.profileDataStatus ? (
												<VerifiedSvg className="text-onyx-light w-6 h-6 inline"></VerifiedSvg>
											) : null}
										</h2>
									</div>
									<address>
										{/* <div>80 Rosedale Road Suite 316 Watertown, MA 02472</div> */}
										<div>
											{activeProfile.street} {activeProfile.state}
											{activeProfile.street || activeProfile.state
												? ","
												: ""}{" "}
											{activeProfile.zip}
										</div>
									</address>
									<p className="font-medium text-base bg-gold-lighter inline-block px-2 rounded-sm border-2 border-gold-light mt-2">
										report date: <b>{dateToString(new Date(), {})}</b>
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
															activeProfileInfo.businessStartDate
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
														{activeProfile.ein ?? "N/A"}
													</dd>
												</div>
												<div className="bg-gold-lightest px-4 py-5 md:grid md:grid-cols-3 md:gap-4 md:px-6">
													<dt className="text-sm font-medium text-onyx-light">
														contact person
													</dt>
													<dd className="mt-1 text-sm text-onyx md:col-span-2 md:mt-0">
														{/* John Doe - Owner */}
														<span>
															{" "}
															{activeProfile?.ownerName || "N/A"}{" "}
															{activeProfile.isOwner ? "- owner" : ""}{" "}
														</span>
													</dd>
												</div>
												<div className="bg-pearl px-4 py-5 md:grid md:grid-cols-3 md:gap-4 md:px-6">
													<dt className="text-sm font-medium text-onyx-light">
														phone
													</dt>
													<dd className="mt-1 text-sm text-onyx md:col-span-2 md:mt-0">
														{activeProfile.phoneNumber || "N/A"}
													</dd>
												</div>
												<div className="bg-gold-lightest px-4 py-5 md:grid md:grid-cols-3 md:gap-4 md:px-6">
													<dt className="text-sm font-medium text-onyx-light">
														website
													</dt>
													<dd className="mt-1 text-sm md:col-span-2 md:mt-0 text-topaz-dark hover:text-topaz font-medium">
														<a
															href={
																activeProfile?.website?.includes?.("http://") ||
																activeProfile?.website?.includes?.("https://")
																	? activeProfile.website
																	: "http://" + activeProfile.website
															}
															target="_blank"
															rel="noreferrer"
														>
															{activeProfile.website}
														</a>
													</dd>
												</div>
											</dl>
										</div>
										{/* factiiv score */}
										<div className="mt-6 border-2 border-onyx rounded-md px-6 pt-6 bg-pearl ">
											<span className="w-full flex -mt-3 justify-center print:hidden">
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
															factiivScore={activeProfile.factiivScore}
															reputationScore={activeProfile.reputationScore}
															historyScore={activeProfile.historyScore}
															utilizationScore={activeProfile.utilizationScore}
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
											{/* <img
												className="w-24 mx-auto"
												src="./professional-svcs.svg"
												alt=""
											/> */}
											<p className="font-bold">
												{activeProfile.industry ?? "N/A"}
											</p>
										</div>
										<div className="p-2 text-center">
											<p className="text-sm text-onyx">business size</p>
											{/* <img className="w-24 mx-auto" src="./sole.svg" alt="" /> */}
											<p className="font-bold">
												{activeProfileInfo.businessSize ?? "N/A"}
											</p>
										</div>
										<div className="p-2 text-center">
											<p className="text-sm text-onyx">status</p>
											{/* <img className="w-24 mx-auto" src="./active.svg" alt="" /> */}
											<p className="font-bold">
												{activeProfile.verifiedStatus ? "active" : "pending"}
											</p>
										</div>
										<div className="p-2 text-center">
											<p className="text-sm text-onyx">risk level</p>
											{/* <img className="w-24 mx-auto" src="./low.svg" alt="" /> */}
											<p className="font-bold">{riskLevel}</p>
										</div>
									</div>
									{!!tradeList?.length && (
										<>
											<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
												{" "}
												trade history{" "}
											</h2>
											<div className="grid grid-cols-1 md:grid-cols gap-6 pb-12">
												{tradeList.map((trade) => (
													<TradeCard
														key={trade.id}
														trade={trade}
														showSidebar
														showDetailsButton={false}
														showInteractiveStatus={false}
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
											you can share a link to your public factiiv report page or
											print and share a PDF file
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

// export default MyReport;
export default dynamic(() => Promise.resolve(MyReport), { ssr: false });
