import Link from "next/link";
import { PropsWithChildren, useEffect, useState } from "react";
import { useFactiivStore } from "../../store";
import AccountDropdown from "../account-dropdown";
import Notifications from "../notifications";
import React from "react";
import Image from "next/image";
import PlaceholderPic from "../../public/images/placeholder.png";
import { LogoSvg } from "../svgs/LogoSvg";
import { userSidebarConfig } from "../../constants/user-sidebar.constants";
import { useRouter } from "next/router";
import getConfig from "next/config";
import dynamic from "next/dynamic";
import { PlusSvg } from "../svgs/PlusSvg";

enum MobileMenuStatus {
	OPEN = "scale-y-100 opacity-100 visible",
	TRANSITION = "scale-y-50 opacity-50 visible",
	CLOSE = "opacity-0 invisible hidden",
}

const HeaderActions = ({
	showNotifications = true,
}: { showNotifications?: boolean } & PropsWithChildren) => {
	const store = useFactiivStore();
	const { activeProfile } = store;
	const router = useRouter();
	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	const [mobileMenuStatus, setMobileMenuStatus] = useState(
		MobileMenuStatus.CLOSE
	);

	const handleLogout = () => {
		store.logout();
		router.push("/login");
	};

	const toggleMenu = async () => {
		const isPreviousStateOpen = mobileMenuStatus === MobileMenuStatus.OPEN;
		setMobileMenuStatus(MobileMenuStatus.TRANSITION);
		await delay(100);
		setMobileMenuStatus(
			isPreviousStateOpen ? MobileMenuStatus.CLOSE : MobileMenuStatus.OPEN
		);
	};

	const delay = (delay: number) => new Promise((res) => setTimeout(res, delay));

	const [profilePhoto, setProfilePhoto] = useState("");
	const [businessName, setBusinessName] = useState("");
	useEffect(() => {
		if (!activeProfile?.imagePath && rootUrl) {
			return;
		}

		setProfilePhoto(
			activeProfile.imagePath
		);
		setBusinessName(activeProfile?.businessName || "");
	}, [activeProfile, activeProfile?.imagePath, store.pictureUploadedTimestamp]);

	const activeTabStyle =
		"rounded-sm border-2 border-onyx bg-gold text-onyx sm:h-12 h-10 sm:w-12 w-10 flex items-center justify-center mr-2 scale-110";
	const inactiveTabStyle =
		"rounded border-2 border-transparent sm:h-12 h-10 sm:w-12 w-10 flex items-center justify-center mr-2 transition-transform duration-150 scale-90 group-hover:scale-110";

	return (
		<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6 astro-GCQE7J5L">
			<div
				id="mobile-menu"
				aria-expanded={mobileMenuStatus !== MobileMenuStatus.CLOSE}
				aria-label="Main menu"
				className={
					"fixed z-20 inset-0 origin-top-right transform scale-x-100 duration-300 transition md:hidden " +
					mobileMenuStatus
				}
			>
				<div className="bg-pearl-shade h-full overflow-y-scroll overscroll-contain flex flex-col">
					<div className="xs:px-4 px-2 xs:pt-4 pt-2">
						<div className="flex items-start justify-between">
							<div>
								<LogoSvg />
							</div>
							<div>
								<button
									id="close-mobile-menu-btn"
									type="button"
									className="sm:hidden rounded p-1 text-onyx dark:text-pearl dark:border-pearl-shade focus:border-topaz focus:outline-none focus:ring-1 focus:ring-topaz dark:focus:ring-topaz-light mt-2"
									onClick={toggleMenu}
								>
									<span className="sr-only">Close menu</span>
									<svg
										className="h-8 w-8"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="2"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											vectorEffect="non-scaling-stroke"
											strokeLinejoin="round"
											d="M6 18L18 6M6 6l12 12"
										></path>
									</svg>
								</button>
							</div>
						</div>
						<div className="mt-6">
							<p>change business profile</p>
							<a
								href="/profiles"
								className="block border-2 border-onyx rounded bg-pearl pl-4 pr-2"
							>
								<div className="flex py-4 items-center">
									{profilePhoto && (
										<div className="relative h-14 w-14 ">
											<img
												className="w-full h-full rounded-full border-2 border-onyx z-[2] object-cover"
												src={profilePhoto ? profilePhoto : PlaceholderPic.src}
												alt={(businessName || "") + " profile picure"}
											/>
										</div>
									)}
									<div className="ml-3">
										<p className="text-sm font-medium text-onyx">
											{businessName}
										</p>
									</div>
									<div className="ml-auto flex items-center justify-end">
										<svg
											className="h-8 w-8 text-onyx"
											viewBox="0 0 24 24"
											strokeWidth="2"
											stroke="currentColor"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<polyline
												vectorEffect="non-scaling-stroke"
												points="9 6 15 12 9 18"
											></polyline>
										</svg>
									</div>
								</div>
							</a>
							<div className="flex-1 space-y-1 pt-6">
								{userSidebarConfig?.map(
									({ label, route, SvgIcon, paths }, index) => (
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
									)
								)}
							</div>
						</div>
						<div className="my-2 border-t-2 border-onyx-light lg:w-52 lg:mx-auto">
							{/* <Link href="/login" className="text-onyx dark:text-pearl group"> */}
							<button id="logout" onClick={handleLogout}>
								<div className="text-onyx-light dark:text-pearl-shade group-hover:text-onyx dark:group-hover:text-pearl flex items-center p-1 sm:px-2 sm:py-2 text-lg font-medium">
									<div className="rounded border-2 border-transparent sm:h-12 h-10 sm:w-12 w-10 flex items-center justify-center mr-2 transition-transform duration-150 scale-90 group-hover:scale-110">
										<svg
											className="h-6 w-6 flex-shrink-0 stroke-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
											<line x1="12" y1="2" x2="12" y2="12"></line>
										</svg>
									</div>{" "}
									logout
								</div>
							</button>
							{/* </Link> */}
						</div>
					</div>
					<div className="py-2 xs:px-4 px-2">
						<p>useful links</p>
						<div className="grid grid-cols-2 gap-2 border-2 border-onyx rounded-md bg-pearl p-2 xs:px-6">
							<a
								href="/edit-account"
								className="text-base font-medium text-gray-900 hover:text-gray-700"
							>
								edit account
							</a>
							<a
								href="/edit-business"
								className="text-base font-medium text-gray-900 hover:text-gray-700"
							>
								edit profile
							</a>
							{/* <a
								href="/docs"
								className="text-base font-medium text-gray-900 hover:text-gray-700"
							>
								docs
							</a> */}
							{/* <a
								href="/help-center"
								className="text-base font-medium text-gray-900 hover:text-gray-700"
							>
								help center
							</a> */}
							<a
								href="/terms"
								className="text-base font-medium text-gray-900 hover:text-gray-700"
							>
								terms
							</a>
							<a
								href="/privacy"
								className="text-base font-medium text-gray-900 hover:text-gray-700"
							>
								privacy
							</a>
						</div>
					</div>
					<footer className="flex items-center mt-auto px-4 space-x-6 py-4 bg-pearl-shade border-t-2 border-onyx">
						<div className="divide-x-2 space-x-3 divide-topaz flex items-center justify-center w-full">
							<div className="text-onyx font-extrabold inline-flex flex-nowrap">
								<svg
									className="h-6 w-6 mr-2"
									viewBox="0 0 24 24"
									strokeWidth="2"
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
									<circle cx="12" cy="12" r="9"></circle>
									<path d="M14.5 9a3.5 4 0 1 0 0 6"></path>
								</svg>
								<span className="whitespace-nowrap">2023 factiiv</span>
							</div>
							<span className="text-topaz font-extrabold inline-block pl-2">
								how businesses do business
							</span>
						</div>
					</footer>
				</div>
			</div>
			<div className="grid grid-cols-3 md:grid-cols-3 gap-3 h-16 items-center">
				{/* this is verified status for the profile */}
				{activeProfile?.profileDataStatus ? (
					<Link
						href="/new-trade"
						id="new-trade"
						className="rounded-full bg-topaz dark:bg-topaz-dark p-1 text-pearl dark:text-pearl border-2 border-onyx-light dark:border-pearl-shade focus:outline-none focus:ring-2 focus:ring-onyx dark:focus:ring-pearl-shade focus:ring-offset-2 dark:focus:ring-offset-onyx"
					>
						<span className="sr-only">new trade</span>
						<PlusSvg></PlusSvg>
					</Link>
				) : (
					<div></div>
				)}
				<Notifications showNotifications={showNotifications}></Notifications>
				<button
					id="mobile-menu-btn"
					className="md:hidden rounded p-1 text-onyx dark:text-pearl dark:border-pearl-shade focus:border-topaz focus:outline-none focus:ring-1 focus:ring-topaz dark:focus:ring-topaz-light"
					onClick={toggleMenu}
				>
					<span className="sr-only">open or close menu</span>
					<svg
						className="h-8 w-8 flex-shrink-0 stroke-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line
							vectorEffect="non-scaling-stroke"
							x1="3"
							y1="12"
							x2="21"
							y2="12"
						></line>
						<line
							vectorEffect="non-scaling-stroke"
							x1="3"
							y1="6"
							x2="21"
							y2="6"
						></line>
						<line
							vectorEffect="non-scaling-stroke"
							x1="3"
							y1="18"
							x2="21"
							y2="18"
						></line>
					</svg>
				</button>
				<AccountDropdown></AccountDropdown>
			</div>
		</div>
	);
};

export default dynamic(() => Promise.resolve(HeaderActions), { ssr: false });
