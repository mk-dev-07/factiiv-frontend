import {
	Notification,
	NotificationType,
} from "../../types/notification.interface";
import getConfig from "next/config";
import PlaceholderImage from "../../public/images/placeholder.png";
import Link from "next/link";
import { convertDateToPeriod } from "../../utils/date.utils";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useFactiivStore } from "../../store";
import useNotifications from "../../hooks/useNotifications";

const NotificationList = ({
	notifications = [] as Notification[],
	showPagination = false,
	showTimeIndicator = true,
	refreshNotifications
}: {
	notifications: Notification[] | undefined;
	showPagination?: boolean;
	showTimeIndicator?: boolean;
	refreshNotifications?: any;
}) => {
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();
	const store = useFactiivStore();
	const { token } = store;
	const { refreshedFetch } = useAuthenticatedFetch();
	const { refetch: refetchNotifications } = useNotifications();

	const removeNotification = async(id: string)=> {
		const response = await refreshedFetch(
			apiUrl + `/notifications/${id}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (response.ok) {
			if(refreshNotifications){
				refreshNotifications();
			} else{
				refetchNotifications();
			}
		}
	};

	return (
		<>
			{!notifications?.length ? <p>There are no new notification</p> : null}
			{notifications?.length ? (
				<>
					<ul className="space-y-2">
						{notifications
							? notifications.map(
								({
									type,
									id: notificationId,
									tradeId,
									activityId,
									imagePath,
									businessName,
									createdAt,
									message,
								}) => {
									const isTrade = type === NotificationType.TRADE;
									if (type === NotificationType.REVIEW_DATA || type === NotificationType.REVIEW_DOC || type === NotificationType.REVIEW_INFO || type === NotificationType.REVIEW) {
										return (<li key={notificationId}>
											<Link
												href={{
													pathname: "/edit-business",
												}}
												className="flex space-x-3 py-4 items-center border-2 border-onyx bg-white hover:bg-topaz/10 p-2 rounded"
											>
												<div className="flex-shrink-0">
													<img
														className="h-10 w-10 rounded-full border-2 border-onyx"
														src={
															imagePath
																? imagePath
																: PlaceholderImage.src
														}
														alt="profile picture"
													/>
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm text-onyx">
														{message}
													</p>
												</div>
												<button
													id="notification-okay"
													type="submit"
													className={`
													inline-flex justify-center rounded border border-transparent py-2 px-4 font-medium text-white shadow-sm bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2`}
													onClick={(e) =>{
														e.preventDefault();
														removeNotification(notificationId);
													}}
												>
													Ok
												</button>
												{showTimeIndicator && (
													<div className="ml-auto">
														{" "}
														{convertDateToPeriod(new Date(createdAt))}{" "}
													</div>
												)}
											</Link>
										</li>);
									} else {
										return (
											<li key={notificationId}>
												<Link
													href={{
														pathname: isTrade
															? `/confirm-trade/${notificationId}/${tradeId}`
															: `/confirm-activity/${notificationId}/${tradeId}/${activityId}`,
													}}
													className="flex space-x-3 py-4 items-center border-2 border-onyx bg-white hover:bg-topaz/10 p-2 rounded"
												>
													<div className="flex-shrink-0">
														<img
															className="h-10 w-10 rounded-full border-2 border-onyx"
															src={
																imagePath
																	? imagePath
																	: PlaceholderImage.src
															}
															alt="profile picture"
														/>
													</div>
													<div className="min-w-0 flex-1">
														<p className="text-sm text-onyx">
																new {isTrade ? "trade" : "activity"} reported by
														</p>
														<p className="text-sm text-onyx font-bold">
															{businessName}
														</p>
													</div>
													{showTimeIndicator && (
														<div className="ml-auto">
															{" "}
															{convertDateToPeriod(new Date(createdAt))}{" "}
														</div>
													)}
												</Link>
											</li>
										);
									}
								}
							  )
							: null}
					</ul>
					{showPagination && (
						<nav
							className="flex items-center justify-between px-4 py-3 sm:px-6"
							aria-label="Pagination"
						>
							<div className="hidden sm:block">
								<p className="text-sm text-gray-700">
									{" "}
									showing <span className="font-medium">1</span> to{" "}
									<span className="font-medium">10</span> of{" "}
									<span className="font-medium">50</span> items{" "}
								</p>
							</div>
							<div className="flex flex-1 justify-between sm:justify-end">
								<a
									href="#"
									className="relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
								>
									previous
								</a>
								<a
									href="#"
									className="relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
								>
									next
								</a>
							</div>
						</nav>
					)}
				</>
			) : null}
		</>
	);
};

export default NotificationList;
