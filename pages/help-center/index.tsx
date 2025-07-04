import Head from "next/head";
import useProtected from "../../hooks/useProtected";
import { useFactiivStore } from "../../store";
import HeaderActions from "../../components/header-actions";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import React, { useEffect, useState } from "react";
import HelpCenterBusinessCard from "../../components/help-center-business-card";
import HelpCenterIssuesCard from "../../components/help-center-issues-card";
import Sidebar from "../../components/sidebar";

const HelpCenter = () => {
	useProtected();
	const store = useFactiivStore();

	return (
		<div>
			<Head>
				<title>Help Center | factiiv</title>
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
						<main className="lg:px-6 w-full">
							<div className=" pb-12 astro-FRXN4BQ7">
								{" "}
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									{" "}
									help center{" "}
								</h2>
								<div className="flex justify-end py-2 space-x-2 items-center">
									<p>Filter</p>
									<button className="p-2 border-2 border-onyx text-sm font-medium rounded bg-topaz text-white">
										open
									</button>
									<button className="p-2 border-2 border-onyx text-sm font-medium rounded bg-pearl">
										resolved
									</button>
								</div>
								<div className="space-y-4">
									<HelpCenterBusinessCard
										submitTime="05/15/23 6:15 AM"
										businessName="Jim's Plumbing"
										ownerName="Jim Smith"
										messages={1}
									>
										<HelpCenterIssuesCard
											messages={[
												{
													text: "Hi please take a look at my lorem ipsum. The dolor amet sequit prosor is flexing on the hot cup of mint chai single-brew.",
													sentBy: "Jim Smith",
													sentTime: "3/23/23 5:03 PM",
												},
											]}
										/>
									</HelpCenterBusinessCard>
									<HelpCenterBusinessCard
										submitTime="05/15/23 6:15 AM"
										businessName="Jim's Plumbing"
										ownerName="Jim Smith"
										messages={1}
									>
										<HelpCenterIssuesCard
											messages={[
												{
													text: "Hi please take a look at my lorem ipsum. The dolor amet sequit prosor is flexing on the hot cup of mint chai single-brew.",
													sentBy: "Jim Smith",
													sentTime: "3/23/23 5:03 PM",
												},
											]}
										/>
									</HelpCenterBusinessCard>
									<nav
										className="flex items-center justify-between px-4 py-3 sm:px-6"
										aria-label="Pagination"
									>
										<div className="hidden sm:block">
											<p className="text-sm text-gray-700">
												{" "}
												showing <span className="font-medium"> 1 </span> to{" "}
												<span className="font-medium"> 5 </span> of{" "}
												<span className="font-medium"> 25 </span> items{" "}
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
									</nav>{" "}
									{/*
              </main> */}
								</div>
							</div>
						</main>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HelpCenter;
