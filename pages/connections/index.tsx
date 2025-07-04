import Head from "next/head";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import useProtected from "../../hooks/useProtected";
import { useFactiivStore } from "../../store";
import { useQuery } from "react-query";
import Profile from "../../types/profile.interface";
import Link from "next/link";
import { encodeData } from "../../utils/data.utils";
import Image from "next/image";
import PlaceholderImage from "../../public/images/placeholder.png";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
//SVGs
import { LogoSvg } from "../../components/svgs/LogoSvg";
import getConfig from "next/config";
import Router from "next/router";
import { useRouter } from "next/navigation";
import LoadingOverlay from "../../components/loading-overlay";

const NewProfile = () => {
	useProtected();
	const store = useFactiivStore();
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch();
	const { activeProfile } = store;
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();

	const { data: connections, isLoading } = useQuery<
		Profile["connections"] | []
	>(
		"getConnections",
		async () => {
			const { activeProfile } = store;

			const profileId = activeProfile.id;
			if (!profileId) return [];

			const headers = {
				"Content-Type": "application/json",
				Authorization: `Bearer ${store.token}`,
			};

			const data = await refreshedFetch(
				`${apiUrl}/profiles/connections/${profileId}`,
				{ headers }
			);
			// const connectionsJson: {
			// 	payload: { id: string; toProfileId: string }[];
			// } = await connectionsResponse.json();

			// const profilesRequests = connectionsJson.payload.map<Promise<Profile>>(
			// 	async ({ id: connectionId }) => {
			// 		const profileRequest: Response = await refreshedFetch(
			// 			`${apiUrl}/profiles/connection/${profileId}/${connectionId}`,
			// 			{ headers }
			// 		);
			// 		return (await profileRequest.json()).payload;
			// 	}
			// );

			// const profilesResponse = await Promise.all(profilesRequests);
			// const data = { ...connectionsJson, payload: [...profilesResponse] };
			const { payload }: { payload: Profile["connections"] } =
				await data.json();
			return payload;
		},
		{ refetchOnWindowFocus: false }
	);

	const [isVerified, setIsVerified] = useState(false);
	useEffect(() => {
		setIsVerified(activeProfile.profileDataStatus);
	}, [activeProfile]);

	const handleAddConnection = () => {
		router.push("/new-connection");
	};

	const ConnectionLoadingPlaceholder = () => {
		return (
			<li className=" animate-pulse col-span-1 divide-y-2 divide-white rounded-lg bg-white border-2 border-white">
				<div className="flex w-full items-center justify-between space-x-6 p-6 bg-pearl-shade">
					<div className="h-12 w-12 rounded-full border-2 border-white flex-shrink-0 bg-white"></div>
					<div className="flex-1 truncate">
						<div className="flex items-center space-x-3">
							<h3 className="truncate text-sm font-medium text-onyx bg-white rounded-full px-4 text-white">
								Home Source
							</h3>
						</div>
						<p className="mt-1 truncate text-sm text-gray-500 bg-white rounded-full px-4 text-white">
							1 trade line
						</p>
					</div>
				</div>
				<div>
					<div className="flex divide-x-2 divide-white ">
						<div className="flex w-0 flex-1 bg-pearl-shade">
							<a
								href="/connection-detail"
								className="relative mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-onyx"
							>
								<svg
									className="h-6 w-6 transition-transform duration-150 origin-center bg-white rounded-full px-4 text-white"
									viewBox="0 0 24 24"
									strokeWidth="2"
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="2"></circle>
									<path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"></path>
								</svg>
								<span className="ml-3 bg-white rounded-full px-4 text-white">
									view
								</span>
							</a>
						</div>
						<div className="-ml-px flex w-0 flex-1 bg-pearl-shade">
							<a
								href="/new-trade"
								className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-onyx"
							>
								<svg
									className="h-6 w-6 transition-transform duration-150 origin-center bg-white rounded-full px-4 text-white"
									viewBox="0 0 24 24"
									strokeWidth="2"
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="12" y1="5" x2="12" y2="19"></line>
									<line x1="5" y1="12" x2="19" y2="12"></line>
								</svg>
								<span className="ml-3 bg-white rounded-full px-4 text-white">
									report trade
								</span>
							</a>
						</div>
					</div>
				</div>
			</li>
		);
	};

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			{/* <pre>{JSON.stringify(connections)}</pre> */}
			<Head>
				<title>Connections | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full astro-UHFQUROE">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] astro-UHFQUROE">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 astro-UHFQUROE">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 astro-UHFQUROE">
						<LogoSvg></LogoSvg>
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 astro-UHFQUROE">
						<div className=" pb-12 astro-UHFQUROE">
							<main className="lg:px-6 w-full">
								{isLoading && <LoadingOverlay />}
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									{" "}
									connections{" "}
								</h2>
								{!isVerified ? (
									<div className="flex flex-col items-center">
										<p className="grid place-content-center text-red-500 text-xl">
											You need to be verified to see and add connections.
										</p>
									</div>
								) : null}
								{!connections?.length ? (
									<div className="flex flex-col items-center">
										<p className="grid place-content-center">
											There are no connections.
										</p>
									</div>
								) : null}
								{connections && (
									<ul
										role="list"
										className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
									>
										{!!connections &&
											connections?.map((connection) => (
												<li
													key={connection.toProfileId}
													className="col-span-1 divide-y-2 divide-onyx rounded-lg bg-white border-2 border-onyx"
												>
													{/* <pre>{JSON.stringify(connection, null, 2)}</pre> */}
													<div className="flex w-full items-center justify-between space-x-6 p-6">
														{/* Good nextjs Image use */}
														<div className="h-12 w-12 relative rounded-full border-2 border-onyx">
															<img
																className="h-full w-full object-cover rounded-full"
																src={
																	 connection.toProfileImagePath
																		? connection.toProfileImagePath
																		: PlaceholderImage.src
																}
																alt={`connection ${connection.otherProfileName} image`}
															/>
														</div>
														<div className="flex-1 truncate">
															<div className="flex items-center space-x-3">
																<h3 className="truncate text-sm font-medium text-onyx">
																	{connection.otherProfileName}
																</h3>
															</div>
															<p className="mt-1 truncate text-sm text-gray-500">
																{connection?.numberOfTrades?.toFixed(0) ?? 0} trade
																lines
															</p>
														</div>
													</div>
													<div>
														<div className="flex divide-x-2 divide-onyx ">
															<div className="flex w-0 flex-1">
																<Link
																	href={{
																		pathname: `/connection-details/${connection.toProfileId}`,
																		query: {
																			data: encodeData({
																				profileId: connection.toProfileId,
																				businessName:
																					connection.otherProfileName,
																			}),
																		},
																	}}
																	as={`/connection-details/${connection.toProfileId}`}
																	className="relative mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-onyx group"
																>
																	<svg
																		className="h-6 w-6 group-hover:scale-x-95 transition-transform duration-150 group-hover:scale-y-110 origin-center"
																		viewBox="0 0 24 24"
																		strokeWidth="2"
																		stroke="currentColor"
																		fill="none"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	>
																		<circle cx="12" cy="12" r="2"></circle>
																		<path d="M22 12c-2.667 4.667 -6 7 -10 7s-7.333 -2.333 -10 -7c2.667 -4.667 6 -7 10 -7s7.333 2.333 10 7"></path>
																	</svg>
																	<span className="ml-3 group-hover:text-gray-500">
																		view
																	</span>
																</Link>
															</div>
															<div className="-ml-px flex w-0 flex-1">
																<Link
																	href={{
																		pathname: "/new-trade",
																		query: {
																			data: encodeData({
																				id: connection.toProfileId,
																				businessName:
																					connection.otherProfileName,
																			} as Partial<Profile>),
																		},
																	}}
																	as="/new-trade"
																	className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-onyx group"
																>
																	<svg
																		className="h-6 w-6 group-hover:rotate-90 transition-transform duration-150 origin-center"
																		viewBox="0 0 24 24"
																		strokeWidth="2"
																		stroke="currentColor"
																		fill="none"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	>
																		<line x1="12" y1="5" x2="12" y2="19"></line>
																		<line x1="5" y1="12" x2="19" y2="12"></line>
																	</svg>
																	<span className="ml-3 group-hover:text-gray-500">
																		report trade
																	</span>
																</Link>
															</div>
														</div>
													</div>
												</li>
											))}
									</ul>
								)}
								<div className="flex flex-col items-center">
									<button
										disabled={!isVerified}
										id="add-connection"
										className={
											"relative group block mt-6 animate-fade-in " +
											(!isVerified ? "opacity-50 cursor-not-allowed" : "")
										}
										onClick={handleAddConnection}
									>
										<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4 will-change-transform  ">
											+ add connection
										</span>
										<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
									</button>
								</div>
							</main>
						</div>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto astro-UHFQUROE">
						<div className="mt-12 w-full">
							<div className="w-full sticky top-6">
								<div className="relative mt-4">
									<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
										<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
											<b className="text-bold text-onyx px-1">fact</b>
										</p>
										<p>
											all profiles that have reported a trade with you will show
											up here
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
