import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFactiivStore } from "../../store";
import ClickOutsideWrapper from "../click-outside";
import useNotifications from "../../hooks/useNotifications";
import NotificationList from "../notification-list";

const Notifications = ({
	showNotifications = true,
}: {
	showNotifications: boolean;
}) => {
	const store = useFactiivStore();

	const { data, refetch: refetchNotifications } = useNotifications();

	const refreshNotifications = useCallback(() => {
		refetchNotifications();
	}, [store?.activeProfile?.id]);

	useEffect(() => {
		window.addEventListener("focus", refreshNotifications);
		return () => {
			window.removeEventListener("focus", refreshNotifications);
		};
	}, [store?.activeProfile?.id]);

	const [isNotificationShadeOpen, setIsNotificationShadeOpen] =
		useState<boolean>(false);
	const openNotificationShade = () => {
		setIsNotificationShadeOpen(true);
	};

	const { dropdownList, dropdownListLength } = useMemo(() => {
		return {
			dropdownList: data?.notifications?.slice(0, 2) ?? [],
			dropdownListLength: data?.notifications?.slice?.(0, 2)?.length ?? 0,
		};
	}, [data, data?.notifications]);

	return (
		<div className="relative">
			<button
				id="notifications"
				className="block md:block rounded-full bg-pearl dark:bg-onyx-light p-1 text-onyx dark:text-pearl-shade border-2 border-onyx shadow focus:outline-none focus:border-topaz dark:focus:border-topaz-light focus:ring-1 focus:ring-topaz"
				onClick={openNotificationShade}
			>
				<span className="sr-only">View notifications</span>
				<svg
					className="h-8 w-8 flex-shrink-0 stroke-2"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
					<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
				</svg>
			</button>
			{isNotificationShadeOpen && showNotifications && (
				<>
					<ClickOutsideWrapper
						show={isNotificationShadeOpen}
						clickOutsideHandler={() => {
							setIsNotificationShadeOpen(false);
						}}
					></ClickOutsideWrapper>
					<div
						id="notification-drop"
						aria-expanded="true"
						aria-label="Notifications dropdown"
						className={`block absolute top-full duration-100 right-0 mt-3 rounded-md border-2 border-onyx bg-pearl dark:bg-onyx-light p-3 transform opacity-0 scale-y-90 scale-x-95 space-y-3 w-72 z-10 origin-top ${
							isNotificationShadeOpen
								? "opacity-100 block visible"
								: "opacity-0 hidden invisible"
						}`}
					>
						<h3 className="font-bold text-lg">notifications</h3>
						<NotificationList
							notifications={dropdownList}
							showTimeIndicator={false}
							refreshNotifications={refreshNotifications}
						></NotificationList>
						{dropdownListLength > 1 && (
							<div className="mt-3">
								<Link
									href="/notifications"
									className="grid group flex-1 w-full"
								>
									<span className="bg-onyx rounded will-change-transform col-end-2 row-start-1 row-end-2"></span>
									<span className="bg-onyx group-hover:-translate-y-1 will-change-transform group-hover:bg-topaz focus:-translate-y-1 focus:bg-topaz focus:outline-none border-2 transition-transform duration-150 border-onyx text-white rounded py-1 text-lg pl-4 pr-2 w-full flex items-center justify-between col-end-2 row-start-1 row-end-2">
										see all notifications
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
								</Link>
							</div>
						)}
					</div>
				</>
			)}
			{data?.total && data?.total > 0 && showNotifications ? (
				<span className="absolute flex justify-center items-center font-bold top-[-5%] left-[62%] h-[25px] w-[25px] md:absolute rounded-full bg-pearl dark:bg-onyx-light text-onyx dark:text-pearl-shade border-2 border-onyx shadow focus:outline-none fous:border-topaz dark:focus:border-topaz-light">
					{data?.total}
				</span>
			) : null}
		</div>
	);
};

export default Notifications;
