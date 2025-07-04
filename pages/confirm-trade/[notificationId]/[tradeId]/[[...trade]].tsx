import Head from "next/head";
import { useEffect, useState, useMemo } from "react";

//SVGs
import Sidebar from "../../../../components/sidebar";
import HeaderActions from "../../../../components/header-actions";
import useProtected from "../../../../hooks/useProtected";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useFactiivStore } from "../../../../store";
import { dateToString } from "../../../../utils/date.utils";
import { TradeStatus } from "../../../../types/tradeStatus.interface";
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch";
import { Trade } from "../../../../types/trade.interface";
import PlaceholderPic from "../../../../public/images/placeholder.png";
import VerifiedSvg from "../../../../components/svgs/VerifiedSvg";
import useTrade from "../../../../hooks/useTrade";
import useFindProfile from "../../../../hooks/useFindProfile";
import { TradeType } from "../../../../constants/trade.enum";
import getConfig from "next/config";
import Image from "next/image";
import { useRouter } from "next/router";
import LoadingOverlay from "../../../../components/loading-overlay";
import { LogoSvg } from "../../../../components/svgs/LogoSvg";

export async function getServerSideProps(context: any) {
	const { tradeId, notificationId } = context.params;

	return {
		props: {
			urlTradeId: tradeId,
			urlNotificationId: notificationId,
		}, // will be passed to the page component as props
	};
}

const ConfirmTrade = ({
	urlTradeId,
	urlNotificationId,
}: {
	urlTradeId: string;
	urlNotificationId: string;
}) => {
	useProtected();

	const router = useRouter();
	const store = useFactiivStore();
	const queryClient = useQueryClient();
	const { activeProfile } = store;
	const { refreshedFetch } = useAuthenticatedFetch();
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();

	const [tradeId, setTradeId] = useState("");
	const [notificationId, setNotificationId] = useState("");
	const [isFromMe, setIsFromMe] = useState<boolean>(false);
	const [isUpdatingTrade, setIsUpdatingTrade] = useState<boolean>(false);
	const [updateTradeError, setUpdateTradeError] = useState("");

	const { data: trade, isLoading: isLoadingTrade } = useTrade(
		[tradeId],
		(trade: Trade) => {
			const isMyTrade = trade.fromProfileId === activeProfile.id;
			setIsFromMe(isMyTrade);
			return trade;
		}
	);

	const { data: tradeProfile, isLoading: isLoadingTradeProfile } =
		useFindProfile({
			businessName: isFromMe ? trade?.toCompanyName : trade?.fromCompanyName,
			profileId: isFromMe ? trade?.toProfileId : trade?.fromProfileId,
		});

	useEffect(() => {
		if (!urlTradeId || !urlNotificationId) {
			return;
		}

		setTradeId(urlTradeId);
		setNotificationId(urlNotificationId);
	}, [urlTradeId, urlNotificationId]);

	const [isVerified, setIsVerified] = useState<boolean | null>(null);
	useEffect(() => {
		setIsVerified(activeProfile?.profileDataStatus);
	}, []);

	const { mutate: updateTrade } = useMutation(
		async (confirmTradeData: TradeStatus) => {
			const { activeProfile, token } = store;

			const headers = new Headers();
			headers.append("Content-Type", "application/json");
			headers.append("Authorization", `Bearer ${token}`);

			try {
				const updateTradeResponse = await refreshedFetch(
					`${apiUrl}/trades/${activeProfile.id}`,
					{
						method: "PUT",
						headers,
						body: JSON.stringify(confirmTradeData),
					}
				);

				if (!updateTradeResponse.ok) {
					const errorResponse = await updateTradeResponse.json();
					const errorMessage =
						errorResponse?.errors?.join("\n") ||
						errorResponse?.message ||
						(typeof errorResponse === "string" && errorResponse);
					throw new Error(
						errorMessage ?? "There was an error while confirming the trade."
					);
				}

				await updateTradeResponse.json();

				await queryClient.invalidateQueries({
					queryKey: ["notifications", activeProfile?.id],
				});

				const isTradeAcceptedByAdmin =
					trade?.adminStatus?.toLowerCase() === "accepted" &&
					trade?.tradeStatus.toLowerCase() === "accepted";
				const nextRoute = isTradeAcceptedByAdmin
					? "/dashboard"
					: `/confirm-trade/${
						confirmTradeData.status === "ACCEPTED" ? "confirmed" : "denied"
					  }`;
				router.push(nextRoute);
			} catch (error: unknown) {
				console.log(error);
				setIsUpdatingTrade(false);
				setUpdateTradeError(
					(error as Error).message ||
						"Something went wrong and it wasn't possible to update the trade."
				);
			}
		}
	);

	const onUpdateTrade = async (status: "ACCEPTED" | "REJECTED") => {
		if (!activeProfile?.profileDataStatus) {
			return;
		}

		setIsUpdatingTrade(true);
		const tradeStatus: TradeStatus = {
			tradeId,
			status,
			notificationId,
		};

		updateTrade(tradeStatus);
	};

	const totalTradesForTradeProfile = useMemo(() => {
		if (!tradeProfile) return 0;

		return (
			(tradeProfile?.myTrades.length ?? 0) +
			(tradeProfile?.tradesWithMe.length ?? 0)
		);
	}, [tradeProfile]);

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Confirm trade | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				{(isLoadingTrade || isLoadingTradeProfile || isUpdatingTrade) && (
					<LoadingOverlay></LoadingOverlay>
				)}
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0"></div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
						<LogoSvg></LogoSvg>
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
						<div className=" pb-12">
							<main className="lg:px-6 w-full">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									{" "}
									new trade line reported by
								</h2>
								{!!tradeProfile && (
									<article className="border-2 border-onyx bg-pearl rounded-md overflow-hidden relative text-onyx">
										<div className="flex flex-col xs:flex-row">
											<div className="px-4 pt-4 pb-6 flex-1 relative">
												<header className="flex items-start justify-between">
													<div className="flex items-center justify-start space-x-3 pt-8 xs:pt-0">
														<div className="h-12 w-12 relative rounded-full border-2 border-onyx">
															<img
																className="w-full h-full object-cover rounded-full"
																src={
																	tradeProfile.imagePath
																		? tradeProfile.imagePath
																		: PlaceholderPic.src
																}
																alt={`connection ${tradeProfile.businessName} image`}
															/>
														</div>
														<div>
															<h3 className="font-bold text-xl">
																{tradeProfile.businessName}
															</h3>
															<address>
																<p>
																	{tradeProfile.street} {tradeProfile.state},{" "}
																	{tradeProfile.zip}
																</p>
															</address>
														</div>
													</div>
													<div className="absolute top-2 right-1 z-[1]">
														{tradeProfile.verifiedStatus && (
															<VerifiedSvg></VerifiedSvg>
														)}
													</div>
												</header>
												<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-base mt-4 mb-3 md:gap-6">
													<div className="px-2">
														<p className="font-bold">total trades</p>
														<p>{totalTradesForTradeProfile}</p>
													</div>
													<div className="px-2">
														<p className="font-bold">industry</p>
														<p>{tradeProfile.industry}</p>
													</div>
													<div className="px-2">
														<p className="font-bold">status</p>
														<p>active</p>
													</div>
													<div className="px-2">
														<p className="font-bold">connected since</p>
														<p>
															{dateToString(new Date(tradeProfile.createdAt))}
														</p>
													</div>
												</div>
											</div>
										</div>
									</article>
								)}
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									{" "}
									reported trade details{" "}
								</h2>
								{trade && (
									<div className="grid grid-cols-1 gap-6">
										<article className="border-2 border-onyx bg-pearl rounded-md overflow-hidden relative text-onyx">
											<div className="flex flex-col xs:flex-row">
												<div className="px-4 pt-4 pb-6 flex-1 relative">
													<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-base mt-4 mb-3 md:gap-6">
														<div className="px-2">
															<p className="font-bold">high credit limit</p>
															<p>
																<span>$</span>
																<span>
																	{trade?.amount?.match(/([0-9.]+).?/g)
																		? parseInt(trade.amount)
																		: trade.amount || 0}
																</span>
															</p>
														</div>
														<div className="px-2">
															<p className="font-bold">outstanding balance</p>
															<p>
																<span>$</span>
																<span>
																	{trade?.balance?.match(/([0-9.]+).?/g)
																		? parseInt(trade.balance)
																		: trade.balance || 0}
																</span>
															</p>
														</div>
														{trade.typeDesc === TradeType.BORROW && (
															<div className="px-2">
																<p className="font-bold">credit utilization</p>
																<p>
																	{(
																		(parseFloat(trade.balance) /
																			parseFloat(trade.amount)) *
																		100
																	).toFixed(0) || 0}
																	%
																</p>
															</div>
														)}
														<div className="px-2">
															<p className="font-bold">account type</p>
															<p>
																{trade.typeDesc === "buysell"
																	? "buy/sell"
																	: trade.typeDesc}
															</p>
														</div>
													</div>
												</div>
											</div>
										</article>
									</div>
								)}
								{updateTradeError && (
									<div className="w-full mt-3 flex justify-center">
										<p className="text-red-500">{updateTradeError}</p>
									</div>
								)}
								{!!trade &&
									!(isLoadingTrade || isLoadingTradeProfile) &&
									activeProfile.profileDataStatus && (
									<div className="mx-auto max-w-max mt-6">
										<button
											disabled={
												!trade ||
													isUpdatingTrade ||
													!activeProfile?.profileDataStatus
											}
											id="accept-trade"
											className={
												"relative group block mt-6 animate-fade-in " +
													(trade && !isUpdatingTrade
														? ""
														: "opacity-50 cursor-not-allowed")
											}
											onClick={() => {
												if (!trade) return;

												onUpdateTrade("ACCEPTED");
											}}
										>
											<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4 will-change-transform  ">
												{trade?.adminStatus?.toLowerCase() === "accepted" &&
													trade?.tradeStatus?.toLowerCase() === "accepted"
													? "got it!"
													: "confirm new trade"}
											</span>
											<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
										</button>
										{trade?.adminStatus?.toLowerCase() === "accepted" &&
											trade?.tradeStatus?.toLowerCase() ===
												"accepted" ? null : (
												<button
													disabled={
														!trade ||
														isUpdatingTrade ||
														!activeProfile?.profileDataStatus
													}
													id="reject-trade"
													className={
														"w-full mt-3 font-medium py-1 px-2 text-sm text-center block rounded text-gray-500 hover:text-onyx focus:text-onyx " +
														(trade && !isUpdatingTrade
															? ""
															: " opacity-50 cursor-not-allowed ")
													}
													onClick={() => {
														if (!trade) return;

														onUpdateTrade("REJECTED");
													}}
												>
													<span>deny new trade</span>
												</button>
											)}
									</div>
								)}
								{!(isLoadingTrade || isLoadingTradeProfile) &&
									isVerified !== null &&
									!isVerified && (
									<p className="text-red-500 text-xl text-center mt-4">
											You are currently unverified and unable to accept this
											trade.
									</p>
								)}
							</main>
						</div>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto"></div>
				</div>
			</div>
		</div>
	);
};

export default ConfirmTrade;
