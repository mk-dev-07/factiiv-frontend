import React from "react";
import Head from "next/head";
import Sidebar from "../../components/sidebar";
import { useMutation, useQuery } from "react-query";
import { useFactiivStore } from "../../store";
import Image from "next/image";
import PlaceholderPic from "../../public/images/placeholder.png";
import { CheckmarkSmallSvg } from "../../components/svgs/CheckmarkSmallSvg";
import Link from "next/link";
import HeaderActions from "../../components/header-actions";
import Profile from "../../types/profile.interface";
import LoadingOverlay from "../../components/loading-overlay";
import useProtected from "../../hooks/useProtected";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { IAdditionalInfoDataResponse } from "../../types/additionalInfoData.interface";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useRouter } from "next/router";
import getConfig from "next/config";

const Profiles = () => {
	useProtected();
	const store = useFactiivStore();
	const { refreshedFetch } = useAuthenticatedFetch();
	const router = useRouter();
	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	//Fetch Business Profile data
	const fetchProfileData = async () => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();

		const response = await refreshedFetch(`${apiUrl}/profiles`, {
			headers: {
				Authorization: `Bearer ${store.token}`,
			},
		});
		const data = await response.json();
		return data.payload;
	};

	const { data, isLoading, isError } = useQuery<Profile[]>(
		"profileData",
		fetchProfileData
	);

	// fetch additional profile data when the profile changes
	const additionalProfileDataMutation = useMutation({
		mutationKey: ["additionalProfileData", store?.activeProfile?.id],
		mutationFn: async (profileId: string) => {
			const {
				publicRuntimeConfig: { apiUrl },
			} = getConfig();

			const headers = new Headers();
			headers.append("Content-Type", "application/json");
			headers.append("Authorization", `Bearer ${store.token}`);

			return refreshedFetch(`${apiUrl}/profiles/survey/${profileId}`, {
				headers,
			});
		},
		onSuccess: async (response: Response) => {
			if (!response.ok) {
				router.push("/dashboard");
				updateStoreFields();
				return;
			}
			const data = await response.json();
			updateStoreFields(data.payload);
			router.push("/dashboard");
		},
		onError: (error, variables, context) => {
			updateStoreFields();
		},
	});

	const updateStoreFields = (additionalInfo?: IAdditionalInfoDataResponse) => {
		store.updateActiveProfileInfo(
			additionalInfo || ({} as IAdditionalInfoDataResponse)
		);
	};

	const handleProfileSelect = (profile: Profile) => {
		if (!profile) return;

		if (store?.activeProfile?.id === profile.id) {
			return;
		}

		store.updateActiveProfile(profile);
		store.updatePreviouslyActiveProfileId(profile.id);
		additionalProfileDataMutation.mutate(profile.id);
	};

	const renderSortedProfileList = (data: Profile[]) => {
		if (!data) {
			return null;
		}

		const profileList = data.sort(({ businessName: a }, { businessName: b }) =>
			a.localeCompare(b)
		);

		return profileList.map((profile: Profile) => {
			const { imagePath } = profile;
			const { businessName, id } = profile;

			return (
				<label
					key={id}
					className="relative block rounded bg-pearl px-2 group cursor-pointer focus:outline-none group"
				>
					<div className="flex py-2 items-center z-[2]">
						<div className="relative h-12 w-12 z-[2]">
							<img
								className="h-12 w-12 rounded-full border-2 border-onyx z-[2] object-cover"
								src={
									imagePath
										? imagePath
										: PlaceholderPic.src
								}
								alt="Business profile pic"
							/>
						</div>
						<div className="ml-3 z-[2]">
							<p className="text-sm font-medium text-onyx">
								{businessName}
							</p>
						</div>
						<input
							type="radio"
							name="profile"
							checked={store?.activeProfile?.id === id}
							value={id}
							onChange={() => handleProfileSelect(profile)}
							className="sr-only peer"
							aria-labelledby={businessName}
							id={id}
						/>
						<span
							className="pointer-events-none absolute -inset-px rounded-md border-2 border-onyx group-hover:bg-topaz-lightest peer-checked:border-topaz peer-checked:bg-pearl z-[1]"
							aria-hidden="true"
						></span>
						<div className="ml-auto opacity-0 peer-checked:flex translate-y-2 peer-checked:translate-y-0 peer-checked:opacity-100 duration-300 items-center justify-end z-[2]">
							<CheckmarkSmallSvg />
						</div>
					</div>
				</label>
			);
		});
	};

	return (
		<div>
			{isLoading && <LoadingOverlay />}
			<Head>
				<title>Switch profiles | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
						{/* <!-- <Search client:visible /> --> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
						<LogoSvg></LogoSvg>
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
						<main className="px-6 w-full">
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								{" "}
								switch business profile{" "}
							</h2>
							<div className="space-y-3">
								{/* HANDLE ERROR */}
								{isError && <div>couldn&apos;t get profiles, try again.</div>}

								{/* LOADING SKELETON */}
								{isLoading &&
									[0, 1, 2].map((id: number) => (
										<label
											key={id}
											className="relative block rounded bg-pearl px-2 group cursor-pointer focus:outline-none group"
										>
											<div className="flex py-2 items-center">
												<img
													className="h-12 w-12 rounded-full border-2 border-onyx z-[2] object-cover"
													src={PlaceholderPic.src}
													alt="Business profile pic"
												/>
												<div className="ml-3 z-[2]">
													<p className="text-sm font-medium text-onyx">
														Loading...
													</p>
												</div>
												<input
													type="radio"
													name="profile"
													checked
													value="Loading data..."
													className="sr-only peer"
												/>
												<span
													className="pointer-events-none absolute -inset-px rounded-md border-2 border-onyx group-hover:bg-topaz-lightest peer-checked:border-topaz peer-checked:bg-pearl z-[1]"
													aria-hidden="true"
												></span>
												<div className="ml-auto opacity-0 peer-checked:flex translate-y-2 peer-checked:translate-y-0 peer-checked:opacity-100 duration-300 items-center justify-end z-[2]">
													<CheckmarkSmallSvg />
												</div>
											</div>
										</label>
									))}

								{data ? renderSortedProfileList(data) : null}
							</div>
							<div className="mx-auto max-w-max mt-6">
								<Link
									href={{ pathname: "/core", query: { step: "1" } }}
									className="relative group block"
								>
									<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
										{" "}
										create new business{" "}
									</span>
									<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
								</Link>
							</div>
						</main>
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
											your account can hold as many profiles as you need for all your businesses.
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

export default Profiles;
