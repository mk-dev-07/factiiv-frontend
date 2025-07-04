import Head from "next/head";
import React from "react";
import AdminAccountDropdown from "../../../components/admin/admin-account-dropdown";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import BusinessCard from "../../../components/business-card";
import IssuesCard from "../../../components/issues-card";
import { LogoAdminSvg } from "../../../components/svgs/LogoAdminSvg";

const Issues = () => {
	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full astro-FRXN4BQ7"
		>
			<Head>
				<title>Issues | factiiv</title>
			</Head>
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] astro-FRXN4BQ7">
				<AdminSidebar />
				<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 astro-FRXN4BQ7">
					{" "}
					{/*
            <Search client:visible /> */}
				</div>
				<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 astro-FRXN4BQ7">
					<LogoAdminSvg />
				</div>

				<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6 astro-FRXN4BQ7">
					<MobileNav />
				</div>
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 astro-FRXN4BQ7">
					<div className=" pb-12 astro-FRXN4BQ7">
						{" "}
						<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
							{" "}
							issues{" "}
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
							<BusinessCard
								submitTime="05/15/23 6:15 AM"
								businessName="Jim's Plumbing"
								ownerName="Jim Smith"
								messages={1}
							>
								<IssuesCard
									messages={[
										{
											text: "Hi please take a look at my lorem ipsum. The dolor amet sequit prosor is flexing on the hot cup of mint chai single-brew.",
											sentBy: "Jim Smith",
											sentTime: "3/23/23 5:03 PM",
										},
										{
											text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
											sentBy: "Jim Smith",
											sentTime: "3/23/23 5:03 PM",
										},
									]}
								/>
							</BusinessCard>
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
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto astro-FRXN4BQ7">
						<div className="w-full"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Issues;
