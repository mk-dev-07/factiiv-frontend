/* eslint-disable linebreak-style */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AllBlogsTable from "../all-blogs-table/index";
import AddBlog from "../add-blog/index";
import Head from "next/head";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import AdminLogoSvg from "../../../components/svgs/AdminLogoSvg";
import MobileNav from "../../../components/admin/admin-mobile-nav";

const AllBlogs = () => {
	const router = useRouter();
	const { tab } = router.query;

	const [activeTab, setActiveTab] = useState<string>("/admin/all-blogs-table");

	useEffect(() => {
		if (tab) {
			setActiveTab(tab as string);
		}
	}, [tab]);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
	};

	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="relative w-full h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox"
		>
			<Head>
				<title>All Blog | factiiv</title>
			</Head>
			<div className="relative w-full h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<AdminSidebar />
					<div className="hidden w-1/2 h-0 col-start-2 col-end-3 row-start-1 row-end-2 py-6 lg:block"></div>
					<div className="w-24 col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden">
						<AdminLogoSvg />
					</div>
					<div className="col-start-1 col-end-3 row-start-1 row-end-2 py-2 pr-2 justify-self-end md:col-start-2 xl:col-start-3 xs:py-4 xs:pr-4 sm:py-6 sm:pr-6">
						<MobileNav />
					</div>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
						<div className="p4-8">
							<h2 className="my-3 text-xl font-medium text-onyx">All Blog</h2>
						</div>
						{/* main content */}
						{/* tab buttons */}
						<div className="flex items-center justify-start space-x-2">
							<button
								className={`p-2 border-2 border-onyx text-sm font-medium rounded focus:outline-0 ${
									activeTab === "/admin/all-blogs-table"
										? "bg-topaz text-white"
										: "bg-pearl"
								}`}
								onClick={() => handleTabChange("/admin/all-blogs-table")}
							>
								Blog Table
							</button>
							<button
								className={`p-2 border-2 border-onyx text-sm font-medium rounded focus:outline-0 ${
									activeTab === "/admin/add-blog"
										? "bg-topaz text-white"
										: "bg-pearl"
								}`}
								onClick={() => handleTabChange("/admin/add-blog")}
							>
								Add Blog
							</button>
						</div>
						<div className="mt-2">
							{activeTab === "/admin/all-blogs-table" && <AllBlogsTable />}
							{activeTab === "/admin/add-blog" && <AddBlog />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AllBlogs;
