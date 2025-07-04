import Head from "next/head";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import SearchConnections from "../../components/search-connections";
import Profile from "../../types/profile.interface";
import { useFactiivStore } from "../../store";
import { useRouter } from "next/navigation";
import useProtected from "../../hooks/useProtected";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import getConfig from "next/config";

const Report = () => {
	useProtected();
	const store = useFactiivStore();
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const [reportDetails, setReportDetails] = useState("");
	const [selectedProfile, setSelectedProfile] = useState<Profile>();

	//SEND REPORT
	const sendReport = async () => {
		try {
			const response = await refreshedFetch(
				`${apiUrl}/reports/request/${selectedProfile}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`,
					},
				}
			);

			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
		}
	};
	//TODO: fix api request
	//SUBMIT REPORT
	const handleSubmit = () => {
		// sendReport();
		// router.push("/report-submitted");
	};

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Report incorrect data | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
						<LogoSvg />
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
						<div className="pb-12">
							<main className="lg:px-6 w-full">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									report incorrect data
								</h2>
								<div className="border-2 border-onyx rounded-md bg-pearl p-2 lg:p-6 mb-6">
									<div className="grid grid-cols-4 gap-4">
										<div className="col-span-4 lg:col-span-2">
											<p className="block font-medium text-onyx">
												select a trade line
											</p>
											<div className="relative mt-1">
												<SearchConnections
													className="flex-1 mr-3"
													onSelectResult={(profile: Profile | undefined) =>
														profile && setSelectedProfile(profile)
													}
													clearSelection={true}
												></SearchConnections>
											</div>
										</div>
										<div className="col-span-4">
											<div>
												<label
													htmlFor="details"
													className="block font-medium text-onyx"
												>
													tell us what&apos;s wrong
												</label>
												<div className="mt-1">
													<textarea
														value={reportDetails}
														onChange={(e) => setReportDetails(e.target.value)}
														id="details"
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													></textarea>
												</div>
											</div>
										</div>
									</div>
									<div className="pt-3 text-right">
										<button
											disabled
											id="submit-report"
											onClick={handleSubmit}
											className="inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2 opacity-50"
										>
											submit
										</button>
									</div>
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
											please include as much data as possible to help us resolve
											your issue
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

export default Report;
