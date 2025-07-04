import Head from "next/head";
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import useProtected from "../../hooks/useProtected";
import { useFactiivStore } from "../../store";
import { useQuery, useQueryClient } from "react-query";
import { NotificationResponse } from "../../types/notification.interface";
import LoadingOverlay from "../../components/loading-overlay";
import React, { useEffect } from "react";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import getConfig from "next/config";
import NotificationList from "../../components/notification-list";
import useNotifications from "../../hooks/useNotifications";
import { LogoSvg } from "../../components/svgs/LogoSvg";

const NewProfile = () => {
	useProtected();
	const queryClient = useQueryClient();
	const store = useFactiivStore();
	const { activeProfile } = store;

	const {
		data,
		isLoading,
		isError,
		refetch: refetchNotifications,
	} = useNotifications();

	const invalidateAndRefetch = async () => {
		await queryClient.invalidateQueries({
			queryKey: ["notifications", activeProfile?.id],
		});

		refetchNotifications();
	};

	useEffect(() => {
		invalidateAndRefetch();
	}, [activeProfile?.id]);

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Notifications | factiiv</title>
			</Head>

			{isError ? <p>There was an error</p> : null}

			{isLoading ? <LoadingOverlay></LoadingOverlay> : null}

			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full astro-UHFQUROE">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] astro-UHFQUROE">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 astro-UHFQUROE"></div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 astro-UHFQUROE">
						<LogoSvg></LogoSvg>
					</div>
					<HeaderActions showNotifications={false}></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 astro-UHFQUROE">
						<div className=" pb-12 astro-UHFQUROE">
							<main className="lg:px-6 w-full">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									{" "}
									notifications{" "}
								</h2>
								<NotificationList
									notifications={data?.notifications}
								></NotificationList>
								<div className="mx-auto max-w-max mt-6">
									<a href="/dashboard" className="group grid">
										<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform"></span>
										<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
											back to dashboard
										</span>
									</a>
								</div>
							</main>
						</div>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto astro-UHFQUROE"></div>
				</div>
			</div>
		</div>
	);
};

export default NewProfile;
