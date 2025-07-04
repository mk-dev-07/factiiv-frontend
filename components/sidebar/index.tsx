import Link from "next/link";
import { useRouter } from "next/router";
import { useFactiivStore } from "../../store";
//SVGs
import { LogoSvg } from "../svgs/LogoSvg";
import { LogoutSvg } from "../svgs/LogoutSvg";
import Profile from "../../types/profile.interface";
import { IAdditionalInfoDataResponse } from "../../types/additionalInfoData.interface";
import { userSidebarConfig } from "../../constants/user-sidebar.constants";
import dynamic from "next/dynamic";
import SidebarLink from "../../types/sidebarLink.interface";

const Sidebar = () => {
	const store = useFactiivStore();
	const { activeProfile } = store;
	const router = useRouter();

	const activeTabStyle =
		"rounded-sm border-2 border-onyx bg-gold text-onyx sm:h-12 h-10 sm:w-12 w-10 flex items-center justify-center mr-2 scale-110";
	const inactiveTabStyle =
		"rounded border-2 border-transparent sm:h-12 h-10 sm:w-12 w-10 flex items-center justify-center mr-2 transition-transform duration-150 scale-90 group-hover:scale-110";

	const handleLogout = () => {
		router.push("/login");
		setTimeout(() => {
			store.logout();
		});
	};

	return (
		<div className="row-span-2 hidden h-full md:block">
			<div className="hidden h-full max-h-screen row-span-2 md:fixed md:top-0 md:left-0 lg:left-8 md:flex md:flex-col items-center px-2 lg:px-4 pt-4 sm:pt-6 pb-12 sm:px-6">
				<LogoSvg />
				<div className="pt-20 flex-1 space-y-3 lg:w-52 lg:mx-auto">
					{userSidebarConfig?.map(({ label, route, SvgIcon, paths }, index) => (
						<Link
							key={index}
							href={route}
							className="text-onyx dark:text-pearl group"
						>
							<div className="text-onyx dark:text-pearl-shade flex items-center p-1 sm:px-2 sm:py-2 text-lg font-medium">
								<div
									className={
										paths?.includes(router.pathname)
											? activeTabStyle
											: inactiveTabStyle
									}
								>
									{<SvgIcon />}
								</div>
								{label}
							</div>
						</Link>
					))}
				</div>
				<div className="mt-auto">
					<div className="mt-2 border-t-2 border-onyx-light lg:w-52 lg:mx-auto">
						<button id="logout-button" onClick={() => handleLogout()}>
							<div className="text-onyx-light dark:text-pearl-shade group-hover:text-onyx dark:group-hover:text-pearl flex items-center p-1 sm:px-2 sm:py-2 text-lg font-medium">
								<div className="rounded border-2 border-transparent sm:h-12 h-10 sm:w-12 w-10 flex items-center justify-center mr-2 transition-transform duration-150 scale-90 group-hover:scale-110">
									<LogoutSvg />
								</div>{" "}
								logout
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

// export default Sidebar;
export default dynamic(() => Promise.resolve(Sidebar), { ssr: false });
