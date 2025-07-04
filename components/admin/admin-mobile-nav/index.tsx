import MenuSvg from "../../svgs/MenuSvg";
import AdminAccountDropdown from "../admin-account-dropdown";
import React, { useEffect, useState } from "react";
import { DashboardSvg } from "../../svgs/DashboardSvg";
import OnboardingSvg from "../../svgs/OnboardingSvg";
import DocumentationSvg from "../../svgs/DocumentationSvg";
import InformationSvg from "../../svgs/InformationSvg";
import AllBlogsSvg from "../../svgs/AllBlogsSvg";
import IssuesSvg from "../../svgs/IssuesSvg";
import { LogoutSvg } from "../../svgs/LogoutSvg";
import { CopyrightSvg } from "../../svgs/CopyrightSvg";
import { CloseSvg } from "../../svgs/CloseSvg";
import { LogoSvg } from "../../svgs/LogoSvg";
import { useAdminStore } from "../../../store";
import getConfig from "next/config";
import { useQuery } from "react-query";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import Image from "next/image";
import AccountPlaceholder from "../../../public/images/account.png";
import { useRouter } from "next/router";

const MobileNav = () => {
	// mobile menu
	const [mobileMenuVisible, setMobileMenuVisible] = useState<boolean>(false);

	// handle mobile menu
	const handleMobileMenu = () => {
		setMobileMenuVisible(!mobileMenuVisible);
	};

	const adminStore = useAdminStore();
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();

	const [firstName, setFirstName] = useState(adminStore.admin?.firstName);
	const [lastName, setLastName] = useState(adminStore.admin?.lastName);
	const [displayName, setDisplayName] = useState("");
	//set image
	const [image, setImage] = useState("");

	useEffect(() => {
		setDisplayName(adminStore.admin ? adminStore.admin?.username : "");
		setImage(adminStore.admin?.imagePath ? adminStore.admin?.imagePath : "");
	}, [adminStore.admin]);

	//GET ADMIN'S DATA
	const fetchAdminData = async () => {
		try {
			const response = await refreshedFetch(`${apiUrl}/admins`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
			});
			const data = await response.json();
			return data.payload;
		} catch (error) {
			console.error(error);
		}
	};

	const { data, error, isLoading } = useQuery("adminData", fetchAdminData, {
		onSuccess: (dataResponse) => {
			setFirstName(() => dataResponse?.firstName ?? "");
			setLastName(() => dataResponse?.lastName ?? "");
			setDisplayName(() => dataResponse?.username ?? "");
		},
	});

	const handleLogout = () => {
		adminStore.logout();
		router.push("/admin/login");
	};

	return (
		<>
			<div
				id="mobile-menu"
				aria-expanded="false"
				aria-label="Main menu"
				className={`fixed z-20 inset-0 origin-top-right transform scale-y-100 scale-x-100 duration-300 transition md:hidden ${
					mobileMenuVisible ? "opacity-100 visible" : "opacity-0 invisible"
				}`}
			>
				<div className="flex flex-col h-full overflow-y-scroll bg-pearl-shade overscroll-contain">
					<div className="px-2 pt-2 xs:px-4 xs:pt-4">
						<div className="flex items-start justify-between">
							<div>
								<LogoSvg />
							</div>
							<div>
								<button
									type="button"
									id="close-mobile-menu-btn"
									className="p-1 mt-2 rounded sm:hidden text-onyx dark:text-pearl dark:border-pearl-shade focus:border-topaz focus:outline-none focus:ring-1 focus:ring-topaz dark:focus:ring-topaz-light"
									onClick={handleMobileMenu}
								>
									<span className="sr-only">Close menu</span>
									<CloseSvg />
								</button>
							</div>
						</div>
						<div className="mt-6">
							<div>
								<p>logged in as</p>
								<a
									href="/admin/edit-user"
									className="block px-2 border-2 rounded border-onyx bg-pearl hover:bg-pearl-shade group"
								>
									<div className="flex items-center py-2">
										<img
											className="object-cover w-12 h-12 border-2 rounded-full border-onyx"
											src={image ? image : AccountPlaceholder.src}
											alt={displayName + " profile image"}
										/>

										<div className="ml-3">
											<p className="text-sm font-medium text-onyx">
												{displayName}
											</p>
										</div>
										<div className="flex items-center justify-end ml-auto">
											<div className="p-1 px-2 text-sm border-2 rounded border-onyx">
												edit
											</div>
										</div>
									</div>
								</a>
							</div>

							<div className="flex-1 pt-6 space-y-1">
								<a
									href="/admin/dashboard"
									className="text-onyx dark:text-pearl group"
								>
									<div className="flex items-center p-1 text-lg font-medium text-onyx-light dark:text-pearl-shade group-hover:text-onyx dark:group-hover:text-pearl sm:px-2 sm:py-2">
										<div className="flex items-center justify-center w-10 h-10 mr-2 transition-transform duration-150 scale-90 border-2 border-transparent rounded sm:h-12 sm:w-12 group-hover:scale-110">
											<DashboardSvg />
										</div>
										dashboard
									</div>
								</a>
								<a
									href="/admin/onboarding"
									className="text-onyx dark:text-pearl group"
								>
									<div className="flex items-center p-1 text-lg font-medium text-onyx-light dark:text-pearl-shade group-hover:text-onyx dark:group-hover:text-pearl sm:px-2 sm:py-2">
										<div className="flex items-center justify-center w-10 h-10 mr-2 transition-transform duration-150 scale-90 border-2 border-transparent rounded sm:h-12 sm:w-12 group-hover:scale-110">
											<OnboardingSvg />
										</div>
										onboarding
									</div>
								</a>
								<a
									href="/admin/documentation"
									className="text-onyx dark:text-pearl group"
								>
									<div className="flex items-center p-1 text-lg font-medium text-onyx-light dark:text-pearl-shade group-hover:text-onyx dark:group-hover:text-pearl sm:px-2 sm:py-2">
										<div className="flex items-center justify-center w-10 h-10 mr-2 transition-transform duration-150 scale-90 border-2 border-transparent rounded sm:h-12 sm:w-12 group-hover:scale-110">
											<DocumentationSvg />
										</div>
										documentation
									</div>
								</a>
								<a
									href="/admin/information"
									className="text-onyx dark:text-pearl group"
								>
									<div className="flex items-center p-1 text-lg font-medium text-onyx-light dark:text-pearl-shade group-hover:text-onyx dark:group-hover:text-pearl sm:px-2 sm:py-2">
										<div className="flex items-center justify-center w-10 h-10 mr-2 transition-transform duration-150 scale-90 border-2 border-transparent rounded sm:h-12 sm:w-12 group-hover:scale-110">
											<InformationSvg />
										</div>
										information
									</div>
								</a>
								<a
									href="/admin/all-blogs"
									className="text-onyx dark:text-pearl group"
								>
									<div className="flex items-center p-1 text-lg font-medium text-onyx-light dark:text-pearl-shade group-hover:text-onyx dark:group-hover:text-pearl sm:px-2 sm:py-2">
										<div className="flex items-center justify-center w-10 h-10 mr-2 transition-transform duration-150 scale-90 border-2 border-transparent rounded sm:h-12 sm:w-12 group-hover:scale-110">
											<AllBlogsSvg />
										</div>
										All Blogs
									</div>
								</a>
								<a
									href="/admin/create-bussiness"
									className="text-onyx dark:text-pearl group"
								>
									<div className="flex items-center p-1 text-lg font-medium text-onyx-light dark:text-pearl-shade group-hover:text-onyx dark:group-hover:text-pearl sm:px-2 sm:py-2">
										<div className="flex items-center justify-center w-10 h-10 mr-2 transition-transform duration-150 scale-90 border-2 border-transparent rounded sm:h-12 sm:w-12 group-hover:scale-110">
											<IssuesSvg />
										</div>
										create bussiness
									</div>
								</a>
							</div>
						</div>
						<div className="my-2 border-t-2 border-onyx-light lg:w-52 lg:mx-auto">
							<button
								onClick={handleLogout}
								className="text-onyx dark:text-pearl group"
							>
								<div className="flex items-center p-1 text-lg font-medium text-onyx-light dark:text-pearl-shade group-hover:text-onyx dark:group-hover:text-pearl sm:px-2 sm:py-2">
									<div className="flex items-center justify-center w-10 h-10 mr-2 transition-transform duration-150 scale-90 border-2 border-transparent rounded sm:h-12 sm:w-12 group-hover:scale-110">
										<LogoutSvg />
									</div>
									logout
								</div>
							</button>
						</div>
					</div>

					<footer className="flex items-center px-4 py-4 mt-auto space-x-6 border-t-2 bg-pearl-shade border-onyx">
						<div className="flex items-center justify-center w-full space-x-3 divide-x-2 divide-topaz">
							<div className="inline-flex font-extrabold text-onyx flex-nowrap">
								<CopyrightSvg />
								<span className="whitespace-nowrap">2023 factiiv</span>
							</div>
							<span className="inline-block pl-2 font-extrabold text-topaz">
								reimagine business credit
							</span>
						</div>
					</footer>
				</div>
			</div>

			<div className="grid items-center h-16 grid-cols-1 gap-3">
				<button
					id="mobile-menu-btn"
					className="p-1 rounded md:hidden text-onyx dark:text-pearl dark:border-pearl-shade focus:border-topaz focus:outline-none focus:ring-1 focus:ring-topaz dark:focus:ring-topaz-light"
					onClick={handleMobileMenu}
				>
					<span className="sr-only">open or close menu</span>
					<MenuSvg />
				</button>
				<AdminAccountDropdown />
			</div>
		</>
	);
};

export default MobileNav;
