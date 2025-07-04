import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import HeaderActions from "../../../../components/header-actions";
import Sidebar from "../../../../components/sidebar";
import { LogoSvg } from "../../../../components/svgs/LogoSvg";
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch";
import useFindProfile from "../../../../hooks/useFindProfile";
import useProtected from "../../../../hooks/useProtected";
import useTrade from "../../../../hooks/useTrade";
import { useFactiivStore } from "../../../../store";
import PlaceholderPic from "../../../../public/images/placeholder.png";
import { ActivityStatus as ActivityUpdate } from "../../../../types/activityStatus.interface";
import { Activity } from "../../../../types/trade.interface";
import { daysLateLabel } from "../../../../utils/data.utils";
import { dateToString } from "../../../../utils/date.utils";
import VerifiedSvg from "../../../../components/svgs/VerifiedSvg";
import getConfig from "next/config";
import Image from "next/image";
import { ActivityType } from "../../../../constants/trade.enum";
import { useDebounce } from "react-use";
import LoadingOverlay from "../../../../components/loading-overlay";

export async function getServerSideProps(context: any) {
	const { tradeId, activityId, notificationId } = context.params;

	return {
		props: {
			urlTradeId: tradeId,
			urlActivityId: activityId,
			urlNotificationId: notificationId,
		}, // will be passed to the page component as props
	};
}

const ConfirmActivity = ({
	urlTradeId,
	urlActivityId,
	urlNotificationId,
}: {
	urlTradeId: string;
	urlActivityId: string;
	urlNotificationId: string;
}) => {
	useProtected();
	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	const router = useRouter();
	const store = useFactiivStore();
	const queryClient = useQueryClient();
	const { activeProfile } = store;
	const { refreshedFetch } = useAuthenticatedFetch();

	const [tradeId, setTradeId] = useState("");
	const [activityId, setActivityId] = useState("");
	const [notificationId, setNotificationId] = useState("");
	const [isFromMe, setIsFromMe] = useState<boolean>(false);
	const [activity, setActivity] = useState<Activity>();
	const [isUpdatingActivity, setIsUpdatingActivity] = useState<boolean>(false);
	const [updateActivityError, setUpdateActivityError] = useState("");

	const { mutate: updateActivity } = useMutation(
		async (updateActivityData: ActivityUpdate) => {
			const { activeProfile, token } = store;
			const {
				publicRuntimeConfig: { apiUrl },
			} = getConfig();

			const headers = new Headers();
			headers.append("Content-Type", "application/json");
			headers.append("Authorization", `Bearer ${token}`);

			try {
				const updateActivityResponse = await refreshedFetch(
					`${apiUrl}/activities/${activeProfile.id}`,
					{
						method: "PUT",
						headers,
						body: JSON.stringify(updateActivityData),
					}
				);

				if (!updateActivityResponse.ok) {
					const errorResponse = await updateActivityResponse.json();
					const errorMessage =
						errorResponse?.errors?.join("\n") ||
						errorResponse?.message ||
						(typeof errorResponse === "string" && errorResponse);
					throw new Error(
						errorMessage ?? "There was an error while confirming the activity."
					);
				}

				await updateActivityResponse.json();

				await queryClient.invalidateQueries({
					queryKey: ["notifications", activeProfile?.id],
				});

				const isTradeAcceptedByAdmin =
					trade?.adminStatus?.toLowerCase() === "accepted" &&
					trade?.tradeStatus.toLowerCase() === "accepted";
				const nextRoute = isTradeAcceptedByAdmin
					? "/dashboard"
					: `/confirm-activity/${
						updateActivityData.activityStatus === "ACCEPTED"
							? "confirmed"
							: "denied"
					  }`;
				router.push(nextRoute);
			} catch (error: unknown) {
				console.log(error);
				setIsUpdatingActivity(false);
				setUpdateActivityError(
					(error as Error).message ||
						"Something went wrong and it wasn't possible to update the activity."
				);
			}
		}
	);

	const { data: trade, isLoading: isLoadingTrade } = useTrade(
		[tradeId, activityId],
		(trade) => {
			const activity = trade.activities.find((act) => act.id === activityId);
			setActivity(activity);
			const isFromMe = trade.fromProfileId === activeProfile.id;
			setIsFromMe(isFromMe);
		}
	);

	const { data: tradeProfile, isLoading: isLoadingTradeProfile } =
		useFindProfile({
			businessName: isFromMe ? trade?.toCompanyName : trade?.fromCompanyName,
			profileId: isFromMe ? trade?.toProfileId : trade?.fromProfileId,
		});

	useEffect(() => {
		if (!urlTradeId || !urlActivityId || !urlNotificationId) return;

		setTradeId(urlTradeId);
		setActivityId(urlActivityId);
		setNotificationId(urlNotificationId);
	}, [urlTradeId, urlActivityId, urlNotificationId]);

	const [isVerified, setIsVerified] = useState<boolean | null>(null);
	useEffect(() => {
		setIsVerified(activeProfile?.profileDataStatus);
	}, []);

	const onUpdateActivity = async (activityStatus: "ACCEPTED" | "REJECTED") => {
		if (!activeProfile.profileDataStatus) {
			return;
		}

		setIsUpdatingActivity(true);
		const updateActivityData: ActivityUpdate = {
			tradeId,
			activityId,
			activityStatus,
			notificationId,
		};

		updateActivity(updateActivityData);
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
				<title>Confirm activity | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				{(isLoadingTrade || isLoadingTradeProfile || isUpdatingActivity) && (
					<LoadingOverlay></LoadingOverlay>
				)}
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0"></div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
						<LogoSvg />
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
						<div className=" pb-12">
							<main className="lg:px-6 w-full">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									{" "}
									new trade activity reported by
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
								{trade && activity && (
									<>
										<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
											{" "}
											for trade <b>{trade.relationshipId}</b>
										</h2>
										<div className="grid grid-cols-1 gap-6">
											<article className="border-2 border-onyx bg-pearl rounded-md overflow-hidden relative text-onyx">
												<div className="flex flex-col xs:flex-row">
													<div className="px-4 pt-4 pb-6 flex-1 relative">
														<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-base mt-4 mb-3 md:gap-6">
															<div className="px-2">
																<p className="font-bold">activity date</p>
																{/* <p>11/22/2022</p> */}
																<p>
																	{dateToString(
																		new Date(activity.activityDate),
																		{}
																	)}
																</p>
															</div>
															<div className="px-2">
																<p className="font-bold">activity</p>
																{/* if it's charge, show charge amount */}
																{activity?.activityType ===
																	ActivityType.CHARGE && (
																	<p>
																		{activity.activityType}: $
																		{activity.chargeAmount?.toFixed?.(0) ?? 0}
																	</p>
																)}
																{/* if it's payment, show payment amount */}
																{activity?.activityType ===
																	ActivityType.PAYMENT && (
																	<p>
																		{activity.activityType}: $
																		{activity.paymentAmount?.toFixed?.(0) ?? 0}
																	</p>
																)}
																{/* otherwise, show activity type */}
																{(activity.activityType ===
																	ActivityType.CHARGEOFF ||
																	activity.activityType ===
																		ActivityType.COLLECTIONS) && (
																	<p>{activity.activityType}</p>
																)}
															</div>
															<div className="px-2">
																<p className="font-bold">status</p>
																<p>
																	{(activity.daysLate ?? 0) > 30
																		? "late"
																		: "on-time"}
																</p>
															</div>
															{daysLateLabel(activity.daysLate) !==
																"on-time" && (
																<div className="px-2">
																	<p className="font-bold">days late</p>
																	<p>{daysLateLabel(activity.daysLate) ?? 0}</p>
																</div>
															)}
														</div>
													</div>
												</div>
											</article>
										</div>
									</>
								)}
								{updateActivityError && (
									<div className="w-full mt-3 flex justify-center">
										<p className="text-red-500">{updateActivityError}</p>
									</div>
								)}
								{!!trade &&
									!(isLoadingTrade || isLoadingTradeProfile) &&
									activeProfile?.profileDataStatus && (
									<div className="mx-auto max-w-max mt-6">
										<button
											disabled={
												!trade ||
													!activity ||
													isUpdatingActivity ||
													!activeProfile?.profileDataStatus
											}
											id="accept-activity"
											className={
												"relative group block mt-6 animate-fade-in " +
													(trade &&
													activity &&
													!isUpdatingActivity &&
													activeProfile?.profileDataStatus
														? ""
														: "opacity-50 cursor-not-allowed")
											}
											onClick={() => {
												if (!trade || !activity) return;

												onUpdateActivity("ACCEPTED");
											}}
										>
											<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4 will-change-transform  ">
												{trade?.tradeStatus?.toLowerCase() === "accepted" &&
													trade?.adminStatus?.toLowerCase() === "accepted"
													? "got it!"
													: "confirm activity"}
											</span>
											<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
										</button>
										{trade?.tradeStatus?.toLowerCase() === "accepted" &&
											trade?.adminStatus?.toLowerCase() ===
												"accepted" ? null : (
												<button
													disabled={
														!trade ||
														!activity ||
														isUpdatingActivity ||
														!activeProfile?.profileDataStatus
													}
													id="reject-activity"
													onClick={() => {
														if (!trade || !activity) return;

														onUpdateActivity("REJECTED");
													}}
													className={
														"mt-3 font-medium py-1 px-2 text-sm text-center block rounded text-gray-500 hover:text-onyx focus:text-onyx w-full " +
														(trade &&
														activity &&
														!isUpdatingActivity &&
														activeProfile.profileDataStatus
															? ""
															: "opacity-50 cursor-not-allowed")
													}
												>
													deny activity
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

export default ConfirmActivity;
