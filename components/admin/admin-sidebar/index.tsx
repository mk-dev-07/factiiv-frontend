import router from "next/router";
import React from "react";
import { useAdminStore } from "../../../store";
//SVGs
import AdminLogoSvg from "../../svgs/AdminLogoSvg";
import CreateAdminSvg from "../../svgs/CreateAdminSvg";
import AllBlogsSvg from "../../svgs/AllBlogsSvg";
import { DashboardSvg } from "../../svgs/DashboardSvg";
import DocumentationSvg from "../../svgs/DocumentationSvg";
import InformationSvg from "../../svgs/InformationSvg";
import IssuesSvg from "../../svgs/IssuesSvg";
import { LogoutSvg } from "../../svgs/LogoutSvg";
import OnboardingSvg from "../../svgs/OnboardingSvg";
import SidebarLink from "../sidebar-link";

const AdminSidebar = () => {
	const store = useAdminStore();
	const { admin } = store;

	const dashboardPaths = ["/admin/dashboard", "/admin/dashboard/super"];
	const onboardingPaths = ["/admin/onboarding"];
	const documentationPaths = ["/admin/documentation"];
	const informationPaths = ["/admin/information"];
	const allBlogsPaths = ["/admin/all-blogs"];
	// const issuesPaths = ["/admin/issues"];
	const createBusinessPaths = ["/admin/create-business"];
	const createTradePaths = ["/admin/create-trade"];
	// const createActivityPaths = ["/admin/create-activity"];

	const activeCreateAdminPaths = [
		"/admin/create-admin",
		"/admin/admin-created",
	];

	const handleLogout = () => {
		store.logout();
		router.push("/admin/login");
	};

	return (
		<div className="hidden h-full row-span-2 md:block">
			<div className="items-center hidden h-full max-h-screen row-span-2 px-2 pt-4 pb-12 md:fixed md:top-0 md:left-0 lg:left-8 md:flex md:flex-col lg:px-4 sm:pt-6 sm:px-6">
				<AdminLogoSvg />
				<div className="flex-1 pt-20 space-y-3 lg:w-52 lg:mx-auto">
					<SidebarLink
						pathLabel="dashboard"
						linkTo="/admin/dashboard"
						svgIcon={<DashboardSvg />}
						paths={dashboardPaths}
					/>
					<SidebarLink
						pathLabel="onboarding"
						linkTo="/admin/onboarding"
						svgIcon={<OnboardingSvg />}
						paths={onboardingPaths}
					/>
					<SidebarLink
						pathLabel="documentation"
						linkTo="/admin/documentation"
						svgIcon={<DocumentationSvg />}
						paths={documentationPaths}
					/>
					<SidebarLink
						pathLabel="information"
						linkTo="/admin/information"
						svgIcon={<InformationSvg />}
						paths={informationPaths}
					/>
					<SidebarLink
						pathLabel="all blogs"
						linkTo="/admin/all-blogs"
						svgIcon={<AllBlogsSvg />}
						paths={allBlogsPaths}
					/>
					{/* <SidebarLink
						pathLabel="issues"
						linkTo="/admin/issues"
						svgIcon={<IssuesSvg />}
						paths={issuesPaths}
					/> */}
					{admin?.isPrimary && (
						<SidebarLink
							pathLabel="create admin"
							linkTo="/admin/create-admin"
							svgIcon={<CreateAdminSvg />}
							paths={activeCreateAdminPaths}
						/>
					)}
					<SidebarLink
						pathLabel="create business"
						linkTo="/admin/create-business"
						svgIcon={<CreateAdminSvg />}
						paths={createBusinessPaths}
					/>
					<SidebarLink
						pathLabel="create trade"
						linkTo="/admin/create-trade"
						svgIcon={<CreateAdminSvg />}
						paths={createTradePaths}
					/>
					{/* <SidebarLink
						pathLabel="create activity"
						linkTo="/admin/create-activity"
						svgIcon={<CreateAdminSvg />}
						paths={createActivityPaths}
					/> */}
				</div>
				<div className="mt-auto">
					{/* TODO: proveriti da li treba ovo */}
					{/* <Link href="/get-facts" className="flex items-center justify-between p-2 border-2 rounded border-onyx hover:bg-onyx/10"><div className="flex items-center space-x-2"><svg className="w-6 h-6" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" /><path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" /></svg><span className="block font-medium">FACT</span></div><span className="block font-bold">{(24589167).toLocaleString()}</span></Link> */}
					<div className="mt-2 border-t-2 border-onyx-light lg:w-52 lg:mx-auto">
						<button
							id="logout"
							onClick={handleLogout}
							className="text-onyx dark:text-pearl group"
						>
							<div className="flex items-center p-1 text-lg font-medium text-onyx dark:text-pearl-shade sm:px-2 sm:py-2">
								<div className="flex items-center justify-center w-10 h-10 mr-2 transition-transform duration-150 scale-90 border-2 border-transparent rounded sm:h-12 sm:w-12 group-hover:scale-110">
									<LogoutSvg />
								</div>
								logout
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminSidebar;
