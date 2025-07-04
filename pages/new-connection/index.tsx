import Head from "next/head";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useState } from "react";
//SVGs
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import SearchConnections from "../../components/search-connections";
import useProtected from "../../hooks/useProtected";
import Profile from "../../types/profile.interface";
import { useMutation, useQuery } from "react-query";
import { useFactiivStore } from "../../store";
import { useRouter } from "next/router";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import getConfig from "next/config";
import { LogoSvg } from "../../components/svgs/LogoSvg";

const NewProfile = () => {
	useProtected();
	const router = useRouter();
	const store = useFactiivStore();
	const [selectedProfile, setSelectedProfile] = useState<Profile | null>();
	const { refreshedFetch } = useAuthenticatedFetch();

	const addConnectionMutation = useMutation({
		mutationKey: "addConnection",
		mutationFn: (body: string) => {
			const {
				publicRuntimeConfig: { apiUrl },
			} = getConfig();

			return refreshedFetch(`${apiUrl}/profiles/connections`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${store.token}`,
				},
				body,
			});
		},
		onSuccess: async (response: Response) => {
			if (!response.ok) {
				return;
			}

			router.push("/new-connection-added");
		},
		onError: (error) => {
			console.log(error);
		},
	});

	const addNewConnection = async (selectedProfile: Profile) => {
		const fromProfileId = store.activeProfile.id;
		const toProfileId = selectedProfile?.id;

		if (!fromProfileId || !toProfileId) return;

		const data = JSON.stringify({ fromProfileId, toProfileId });

		addConnectionMutation.mutate(data);
	};

	const [profileId, setProfileId] = useState<string | undefined>();
	useEffect(() => {
		setProfileId(store?.activeProfile?.id);
	}, []);

	const [isCopied, setIsCopied] = useState<boolean>(false);
	const [copyErrorMessage, setCopyErrorMessage] = useState("");
	const copyMyInviteLink = useCallback(async () => {
		if (!store?.activeProfile?.id) {
			return;
		}

		try {
			setIsCopied(true);
			await navigator?.clipboard?.writeText(
				"https://credit.factiiv.io/register?ref=" + store?.activeProfile?.id
			);
		} catch (error) {
			setIsCopied(false);
			setCopyErrorMessage(
				"Unable to copy your invite link.\nYour browser might not have the permissions to copy."
			);
		}

		setTimeout(() => {
			setIsCopied(false);
			setCopyErrorMessage("");
		}, 3000);
	}, [profileId]);

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			{/* <pre>{isLoading}</pre> */}
			<Head>
				<title>Find connection | factiiv</title>
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
					{/* TODO: include class conditionally:  animate-fade-in */}
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 px-2 xs:px-4 sm:px-6 astro-UHFQUROE">
						<div className=" pb-12 astro-UHFQUROE">
							<main className="lg:px-6 w-full">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									{" "}
									new connection{" "}
								</h2>
								<div className="grid grid-cols-8 gap-4">
									{/* flex-1 mr-3 */}
									<SearchConnections
										className={
											"col-span-6 " +
											(selectedProfile ? "sm:col-span-6" : "sm:col-span-8")
										}
										onSelectResult={(profile: Profile | undefined) => {
											profile && setSelectedProfile(profile);
										}}
										clearSelection={true}
									></SearchConnections>
									{selectedProfile ? (
										<div className="col-span-6 sm:col-span-2">
											<button
												id="add-connection"
												className="relative group block mt-1 animate-fade-in w-full"
												onClick={() =>
													selectedProfile && addNewConnection(selectedProfile)
												}
											>
												<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4 will-change-transform  ">
													+ add connection
												</span>
												<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
											</button>
										</div>
									) : null}
								</div>
								<div className="relative my-6">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t-2 border-onyx"></div>
									</div>
									<div className="relative flex justify-center text-sm">
										<span className="bg-pearl-shade px-2 text-onyx">or</span>
									</div>
								</div>
								<div className="mx-auto max-w-max mt-6">
									<button
										disabled={!profileId}
										id="connection-invite-link"
										className={`relative group block ${
											profileId ? "" : " opacity-50 "
										}`}
										onClick={copyMyInviteLink}
									>
										<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4 will-change-transform">
											{" "}
											copy my invite link{" "}
										</span>
										<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
									</button>
									{isCopied && (
										<p className="mt-3">Your link has been copied.</p>
									)}

									{copyErrorMessage && <p className="mt-3">copyErrorMessage</p>}
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
