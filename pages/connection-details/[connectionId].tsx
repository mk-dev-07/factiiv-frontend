import Head from "next/head";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
//SVGs
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import useProtected from "../../hooks/useProtected";
import { useRouter } from "next/router";
import { useFactiivStore } from "../../store";
import { useSearchParams } from "next/navigation";
import { decodeData, encodeData } from "../../utils/data.utils";
import Profile from "../../types/profile.interface";
import PlaceholderPic from "../../public/images/placeholder.png";
import useFindProfile from "../../hooks/useFindProfile";
import { dateToString } from "../../utils/date.utils";
import VerifiedSvg from "../../components/svgs/VerifiedSvg";
import { Trade } from "../../types/trade.interface";
import TradeCard from "../../components/trade-card";
import Link from "next/link";
import Image from "next/image";
import getConfig from "next/config";
import { LogoSvg } from "../../components/svgs/LogoSvg";

const NewProfile = () => {
	useProtected();
	const router = useRouter();
	const store = useFactiivStore();
	const { activeProfile } = store;
	const query = useSearchParams();
	const [isLoadingTradelines, setIsLoadingTradeLines] = useState<boolean>(false);
	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	const { businessName, profileId } =
		decodeData<{
			profileId: string;
			businessName: string;
		}>(query.get("data")) ?? {};

	// find profile from connection name
	const { data: profile, isLoading: isLoadingProfile } = useFindProfile({ profileId, businessName });

	const [tradelines, setTradelines] = useState<Trade[]>([]);

	useEffect(() => {
		if (!profile) {
			return;
		}

		setIsLoadingTradeLines(true);
		const tradelines = [
			...(profile?.myTrades ?? []),
			...(profile?.tradesWithMe ?? []),
		].filter(
			({ fromProfileId, toProfileId }) =>
				(fromProfileId === activeProfile.id && toProfileId === profile.id) ||
				(fromProfileId === profile.id && toProfileId === activeProfile.id)
		);

		setTradelines(tradelines);
		setIsLoadingTradeLines(false);
	}, [businessName, profile]);

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Connection details | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full ">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] ">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 ">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 ">
						<LogoSvg></LogoSvg>
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 ">
						<div className=" pb-12 ">
							<main className="lg:px-6 w-full">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									{" "}
									connection details{" "}
								</h2>
								{
									(isLoadingProfile || isLoadingTradelines) ? (
										<p className="space-y-4">Loading...</p>
									) : (
										<>
											{!!profile && (
												<article className="border-2 border-onyx bg-pearl rounded-md overflow-hidden relative text-onyx">
													<div className="flex flex-col xs:flex-row">
														<div className="px-4 pt-4 pb-6 flex-1 relative">
															<header className="flex items-start justify-between">
																<div className="flex items-center justify-start space-x-3 pt-8 xs:pt-0">
																	<div className="h-12 w-12 relative rounded-full border-2 border-onyx">
																		<img
																			className="w-full h-full object-cover rounded-full"
																			src={
																				profile.imagePath
																					? profile.imagePath
																					: PlaceholderPic.src
																			}
																			alt={`connection ${profile.businessName} image`}
																		/>
																	</div>
																	<div>
																		<h3 className="font-bold text-xl">
																			{profile.businessName}
																		</h3>
																		<address>
																			<p>
																				{profile.street} {profile.state},{" "}
																				{profile.zip}
																			</p>
																		</address>
																	</div>
																</div>
																{profile.verifiedStatus && (
																	<div className="absolute top-2 right-1 z-[1]">
																		<VerifiedSvg></VerifiedSvg>
																	</div>
																)}
															</header>
															<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-base mt-4 mb-3 md:gap-6">
																<div className="px-2">
																	<p className="font-bold">total trades</p>
																	<p>{profile?.myTrades?.length ?? 0}</p>
																</div>
																<div className="px-2">
																	<p className="font-bold">industry</p>
																	<p>{profile.industry}</p>
																</div>
																<div className="px-2">
																	<p className="font-bold">status</p>
																	<p>active</p>
																</div>
																<div className="px-2">
																	<p className="font-bold">connected since</p>
																	<p>{dateToString(new Date(profile.createdAt))}</p>
																</div>
															</div>
														</div>
													</div>
												</article>
											)}
											{tradelines?.length > 0 ? (
												<>
													<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
														{" "}
														trade lines{" "}
													</h2>
													<div className="grid grid-cols-1 gap-6">
														{tradelines.map((trade) => (
															<TradeCard
																key={trade.id}
																trade={trade}
																path={router.route}
															></TradeCard>
														))}
														{/* <article className="border-2 border-onyx bg-pearl rounded-md overflow-hidden relative text-onyx ">
															<div className="flex flex-col xs:flex-row ">
																<div className="bg-gray-400 bg-opacity-25 border-b-2 xs:border-r-2 xs:border-b-0 border-onyx ">
																	<p className="writing-vertical p-1 xs:p-0 inline-block xs:mb-auto xs:mt-2 ">
																		trade acct <b className="">#1</b>
																	</p>
																</div>
																<div className="px-4 pt-4 pb-6 flex-1 relative ">
																	<header className="flex items-start justify-between ">
																		<div className="flex items-center justify-start space-x-3 pt-8 xs:pt-0 ">
																			<p className="text-sm ">
																				opened <b className="">Dec 2020</b>
																			</p>
																		</div>
																		<div className="absolute top-2 right-1 z-[1] ">
																			<img
																				className="h-8 w-8 "
																				src="./good.svg"
																				alt=""
																			/>
																		</div>
																	</header>
																	<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-base mt-4 mb-3 md:gap-6 ">
																		<div className="flex justify-between items-center px-2 ">
																			<span className="text-left block ">
																				<p className="font-bold ">status</p>
																				<p className="">on time</p>
																			</span>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">high credit limit</p>
																			<p className="">$4,000</p>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">
																				outstanding balance
																			</p>
																			<p className="">$2,000</p>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">credit utilization</p>
																			<p className="">50%</p>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">account type</p>
																			<p className="">borrow</p>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">last activity</p>
																			<p className="">Feb 2022</p>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">trade ID</p>
																			<p className="">681384</p>
																		</div>
																		<div className="px-2 flex items-end ">
																			<a
																				href="/trade-detail"
																				className="grid group flex-1 w-full"
																			>
																				<span className="bg-onyx rounded will-change-transform col-end-2 row-start-1 row-end-2"></span>
																				<span className="bg-onyx group-hover:-translate-y-1 will-change-transform group-hover:bg-topaz focus:-translate-y-1 focus:bg-topaz focus:outline-none border-2 transition-transform duration-150 border-onyx text-white rounded py-1 text-lg pl-4 pr-2 w-full flex items-center justify-between col-end-2 row-start-1 row-end-2">
																					{" "}
																					details{" "}
																					<svg
																						className="h-6 w-6"
																						viewBox="0 0 24 24"
																						strokeWidth="2"
																						stroke="currentColor"
																						fill="none"
																						strokeLinecap="round"
																						strokeLinejoin="round"
																					>
																						<line
																							x1="7"
																							y1="17"
																							x2="17"
																							y2="7"
																						></line>
																						<polyline points="7 7 17 7 17 17"></polyline>
																					</svg>
																				</span>
																			</a>
																		</div>
																	</div>
																</div>
															</div>
															<footer className="absolute bottom-0 left-0 right-0 w-full group z-[3] ">
																<div className="bg-pearl dark:bg-onyx h-4 w-full rounded-sm relative overflow-hidden box-border ">
																	<div
																		style={{ transform: "translateX(-50%)" }}
																		className="w-full h-4 border-r-2 duration-1000 delay-[2000ms] border-onyx-light absolute bg-gold "
																	></div>
																	<div className="w-full h-4 border-t-2 border-onyx-light absolute inset-0 "></div>
																</div>
															</footer>
														</article>
														<article className="border-2 border-onyx bg-pearl rounded-md overflow-hidden relative text-onyx ">
															<div className="flex flex-col xs:flex-row ">
																<div className="bg-gray-400 bg-opacity-25 border-b-2 xs:border-r-2 xs:border-b-0 border-onyx ">
																	<p className="writing-vertical p-1 xs:p-0 inline-block xs:mb-auto xs:mt-2 ">
																		trade acct <b className="">#1</b>
																	</p>
																</div>
																<div className="px-4 pt-4 pb-6 flex-1 relative ">
																	<header className="flex items-start justify-between ">
																		<div className="flex items-center justify-start space-x-3 pt-8 xs:pt-0 ">
																			<p className="text-sm ">
																				opened <b className="">Dec 2020</b>
																			</p>
																		</div>
																		<div className="absolute top-2 right-1 z-[1] ">
																			<img
																				className="h-8 w-8 "
																				src="./good.svg"
																				alt=""
																			/>
																		</div>
																	</header>
																	<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-base mt-4 mb-3 md:gap-6 ">
																		<div className="flex justify-between items-center px-2 ">
																			<span className="text-left block ">
																				<p className="font-bold ">status</p>
																				<p className="">on time</p>
																			</span>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">high credit limit</p>
																			<p className="">$4,000</p>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">
																				outstanding balance
																			</p>
																			<p className="">$2,000</p>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">credit utilization</p>
																			<p className="">50%</p>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">account type</p>
																			<p className="">borrow</p>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">last activity</p>
																			<p className="">Feb 2022</p>
																		</div>
																		<div className="px-2 ">
																			<p className="font-bold ">trade ID</p>
																			<p className="">681384</p>
																		</div>
																		<div className="px-2 flex items-end ">
																			<a
																				href="/trade-detail"
																				className="grid group flex-1 w-full"
																			>
																				<span className="bg-onyx rounded will-change-transform col-end-2 row-start-1 row-end-2"></span>
																				<span className="bg-onyx group-hover:-translate-y-1 will-change-transform group-hover:bg-topaz focus:-translate-y-1 focus:bg-topaz focus:outline-none border-2 transition-transform duration-150 border-onyx text-white rounded py-1 text-lg pl-4 pr-2 w-full flex items-center justify-between col-end-2 row-start-1 row-end-2">
																					{" "}
																					details{" "}
																					<svg
																						className="h-6 w-6"
																						viewBox="0 0 24 24"
																						strokeWidth="2"
																						stroke="currentColor"
																						fill="none"
																						strokeLinecap="round"
																						strokeLinejoin="round"
																					>
																						<line
																							x1="7"
																							y1="17"
																							x2="17"
																							y2="7"
																						></line>
																						<polyline points="7 7 17 7 17 17"></polyline>
																					</svg>
																				</span>
																			</a>
																		</div>
																	</div>
																</div>
															</div>
															<footer className="absolute bottom-0 left-0 right-0 w-full group z-[3] ">
																<div className="bg-pearl dark:bg-onyx h-4 w-full rounded-sm relative overflow-hidden box-border ">
																	<div
																		style={{ transform: "translateX(-50%)" }}
																		className="w-full h-4 border-r-2 duration-1000 delay-[2000ms] border-onyx-light absolute bg-gold "
																	></div>
																	<div className="w-full h-4 border-t-2 border-onyx-light absolute inset-0 "></div>
																</div>
															</footer>
														</article> */}
													</div>
												</>
											) : (
												<p className="space-y-4">No trade found</p>
											)}
										</>
									)
								}
								{/* Add pagination  */}
								{/* <nav
									className="flex items-center justify-between px-4 py-3 sm:px-6"
									aria-label="Pagination"
								>
									<div className="hidden sm:block">
										<p className="text-sm text-gray-700">
											{" "}
											showing <span className="font-medium">1</span> to{" "}
											<span className="font-medium">2</span> of{" "}
											<span className="font-medium">2</span> items{" "}
										</p>
									</div>
								</nav> */}
								<div className="mx-auto max-w-max mt-6">
									<Link
										href={{
											pathname: "/new-trade",
											query: { data: encodeData(profile) },
										}}
										as="/new-trade"
										className="group grid"
									>
										<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform"></span>
										<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
											report new trade
										</span>
									</Link>
									{/* <a href="/new-trade" className="group grid">
										<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform"></span>
										<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
											report new trade
										</span>
									</a> */}
									{/* <a
										href="/report"
										className="mt-3 font-medium py-1 px-2 text-sm text-center block rounded text-gray-500 hover:text-onyx focus:text-onyx"
									>
										report missing trades
									</a> */}
								</div>
							</main>
						</div>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto ">
						<div className="w-full mt-12">
							<div className="w-full sticky top-6">
								<div className="relative mt-4">
									<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
										<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
											<b className="text-bold text-onyx px-1">fact</b>
										</p>
										<p>
											in the future you will be able to rate your connections on
											the factiiv network
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

export default NewProfile;
