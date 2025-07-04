import Head from "next/head";
import Link from "next/link";
import React from "react";
import AdminAccountDropdown from "../../../components/admin/admin-account-dropdown";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import { CheckmarkSvg } from "../../../components/svgs/CheckmarkSvg";

const CreateAdmin = () => {
	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full"
		>
			<Head>
				<title>Admin created | factiiv</title>
			</Head>
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
				<div className="row-span-2 hidden h-full md:block">
					<AdminSidebar />
				</div>
				<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
					{" "}
					{/*
          <Search client:visible /> */}
				</div>
				<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
					<svg
						viewBox="0 0 156 72"
						className="h-16 flex-shrink-0 mx-auto text-onyx dark:text-pearl-shade"
					>
						<g className="text-onyx" stroke="currentColor">
							<path
								d="M33.025 10.452c-.221 4.7-3.012 10.209-7.712 11.385H3.058A2.067 2.067 0 0 1 1 19.927V2.886A1.993 1.993 0 0 1 2.983.9h23.358c4.04 0 6.977 4.117 6.684 9.552Z"
								fill="#efbc73"
								strokeWidth="1.5"
								vectorEffect="non-scaling-stroke"
							></path>
							<path
								d="M64.974 3.289v15.823a2.41 2.41 0 0 1-2.39 2.717l-31.4.08a15.383 15.383 0 0 0 5.59-10.5c.51-4.48-.81-8.37-3.09-10.5h28.9a2.388 2.388 0 0 1 2.39 2.38Z"
								fill="#409af4"
								strokeWidth="1.5"
								vectorEffect="non-scaling-stroke"
							></path>
							<path
								d="M14.075 35.938c-.514 4.481.735 8.374 3.085 10.5H2.985A1.993 1.993 0 0 1 1 44.46V27.419a2.067 2.067 0 0 1 2.057-2.057h16.527a15.956 15.956 0 0 0-5.509 10.576Z"
								fill="#efbc73"
								strokeWidth="1.5"
								vectorEffect="non-scaling-stroke"
							></path>
							<path
								d="M49.55 27.824v16.225a2.4 2.4 0 0 1-2.395 2.394H24.21c-4.26 0-7.124-4.774-6.316-10.723s4.847-10.283 9.034-10.283h20.227a2.394 2.394 0 0 1 2.395 2.387Z"
								fill="#409af4"
								strokeWidth="1.5"
								vectorEffect="non-scaling-stroke"
							></path>
							<rect
								x="1"
								y="50"
								width="20"
								height="20"
								rx="2"
								fill="#409af4"
								strokeWidth="1.5"
								vectorEffect="non-scaling-stroke"
							></rect>
						</g>
						<path
							className="hidden xs:block"
							d="M75.324 36.912v11.936h-4.107V36.912H68.65V33.35h2.567v-.834a5 5 0 0 1 5.23-5.39 6.591 6.591 0 0 1 2.952.641l-.834 2.888a2.5 2.5 0 0 0-1.316-.321c-1.155 0-1.925.77-1.925 2.246v.77h3.145v3.562Zm14.792 11.936v-1.6a6.41 6.41 0 0 1-4.909 1.99 5.163 5.163 0 0 1-5.39-5.134c0-3.626 2.92-4.941 5.39-4.941a6.264 6.264 0 0 1 4.909 1.893V38.9c0-1.572-1.347-2.6-3.4-2.6a6.523 6.523 0 0 0-4.524 1.829L80.651 35.4a10.164 10.164 0 0 1 6.77-2.439c3.53 0 6.77 1.412 6.77 5.872v10.015Zm0-5.648a4.075 4.075 0 0 0-3.272-1.347c-1.6 0-2.92.866-2.92 2.342 0 1.444 1.315 2.278 2.92 2.278a4.075 4.075 0 0 0 3.272-1.347Zm15.338-10.235a7.143 7.143 0 0 1 6.129 2.824l-2.663 2.47a3.832 3.832 0 0 0-3.273-1.668 4.141 4.141 0 0 0-4.2 4.492c0 2.7 1.732 4.524 4.2 4.524a3.911 3.911 0 0 0 3.273-1.669l2.663 2.471a7.143 7.143 0 0 1-6.129 2.824 7.869 7.869 0 0 1-8.214-8.15 7.861 7.861 0 0 1 8.214-8.118ZM115.049 45v-8.088h-2.567V33.35h2.567v-4.235h4.107v4.235h3.144v3.562h-3.144v6.995c0 .962.513 1.7 1.411 1.7a2.228 2.228 0 0 0 1.412-.449l.867 3.08a5.036 5.036 0 0 1-3.4.995c-2.857 0-4.397-1.476-4.397-4.233Zm9.626-16.366a2.439 2.439 0 1 1 2.438 2.438 2.458 2.458 0 0 1-2.438-2.438Zm.417 20.214V33.35h4.075v15.5Zm7.701-20.214a2.439 2.439 0 1 1 2.438 2.438 2.458 2.458 0 0 1-2.438-2.438Zm.417 20.214V33.35h4.074v15.5Zm12.128 0-6.224-15.5h4.364l4.042 10.781 4.043-10.781h4.4l-6.225 15.5Z"
							fill="currentColor"
						></path>
						<rect
							className="text-gold-light"
							x="69"
							y="55"
							width="60"
							height="29"
							fill="currentColor"
						></rect>
						<text fill="currentColor" x="73" y="70">
							ADMIN
						</text>
					</svg>
				</div>
				<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6">
					<div
						id="mobile-menu"
						aria-expanded="false"
						aria-label="Main menu"
						className="fixed z-20 inset-0 origin-top-right transform scale-y-50 scale-x-100 duration-300 opacity-0 invisible transition md:hidden"
					>
						<div className="bg-pearl-shade h-full overflow-y-scroll overscroll-contain flex flex-col">
							<div className="xs:px-4 px-2 xs:pt-4 pt-2">
								<div className="flex items-start justify-between">
									<div>
										<svg
											viewBox="0 0 156 72"
											className="h-16 flex-shrink-0 mx-auto text-onyx dark:text-pearl-shade"
										>
											<g className="text-onyx" stroke="currentColor">
												<path
													d="M33.025 10.452c-.221 4.7-3.012 10.209-7.712 11.385H3.058A2.067 2.067 0 0 1 1 19.927V2.886A1.993 1.993 0 0 1 2.983.9h23.358c4.04 0 6.977 4.117 6.684 9.552Z"
													fill="#efbc73"
													strokeWidth="1.5"
													vectorEffect="non-scaling-stroke"
												></path>
												<path
													d="M64.974 3.289v15.823a2.41 2.41 0 0 1-2.39 2.717l-31.4.08a15.383 15.383 0 0 0 5.59-10.5c.51-4.48-.81-8.37-3.09-10.5h28.9a2.388 2.388 0 0 1 2.39 2.38Z"
													fill="#409af4"
													strokeWidth="1.5"
													vectorEffect="non-scaling-stroke"
												></path>
												<path
													d="M14.075 35.938c-.514 4.481.735 8.374 3.085 10.5H2.985A1.993 1.993 0 0 1 1 44.46V27.419a2.067 2.067 0 0 1 2.057-2.057h16.527a15.956 15.956 0 0 0-5.509 10.576Z"
													fill="#efbc73"
													strokeWidth="1.5"
													vectorEffect="non-scaling-stroke"
												></path>
												<path
													d="M49.55 27.824v16.225a2.4 2.4 0 0 1-2.395 2.394H24.21c-4.26 0-7.124-4.774-6.316-10.723s4.847-10.283 9.034-10.283h20.227a2.394 2.394 0 0 1 2.395 2.387Z"
													fill="#409af4"
													strokeWidth="1.5"
													vectorEffect="non-scaling-stroke"
												></path>
												<rect
													x="1"
													y="50"
													width="20"
													height="20"
													rx="2"
													fill="#409af4"
													strokeWidth="1.5"
													vectorEffect="non-scaling-stroke"
												></rect>
											</g>
											<path
												className="hidden xs:block"
												d="M75.324 36.912v11.936h-4.107V36.912H68.65V33.35h2.567v-.834a5 5 0 0 1 5.23-5.39 6.591 6.591 0 0 1 2.952.641l-.834 2.888a2.5 2.5 0 0 0-1.316-.321c-1.155 0-1.925.77-1.925 2.246v.77h3.145v3.562Zm14.792 11.936v-1.6a6.41 6.41 0 0 1-4.909 1.99 5.163 5.163 0 0 1-5.39-5.134c0-3.626 2.92-4.941 5.39-4.941a6.264 6.264 0 0 1 4.909 1.893V38.9c0-1.572-1.347-2.6-3.4-2.6a6.523 6.523 0 0 0-4.524 1.829L80.651 35.4a10.164 10.164 0 0 1 6.77-2.439c3.53 0 6.77 1.412 6.77 5.872v10.015Zm0-5.648a4.075 4.075 0 0 0-3.272-1.347c-1.6 0-2.92.866-2.92 2.342 0 1.444 1.315 2.278 2.92 2.278a4.075 4.075 0 0 0 3.272-1.347Zm15.338-10.235a7.143 7.143 0 0 1 6.129 2.824l-2.663 2.47a3.832 3.832 0 0 0-3.273-1.668 4.141 4.141 0 0 0-4.2 4.492c0 2.7 1.732 4.524 4.2 4.524a3.911 3.911 0 0 0 3.273-1.669l2.663 2.471a7.143 7.143 0 0 1-6.129 2.824 7.869 7.869 0 0 1-8.214-8.15 7.861 7.861 0 0 1 8.214-8.118ZM115.049 45v-8.088h-2.567V33.35h2.567v-4.235h4.107v4.235h3.144v3.562h-3.144v6.995c0 .962.513 1.7 1.411 1.7a2.228 2.228 0 0 0 1.412-.449l.867 3.08a5.036 5.036 0 0 1-3.4.995c-2.857 0-4.397-1.476-4.397-4.233Zm9.626-16.366a2.439 2.439 0 1 1 2.438 2.438 2.458 2.458 0 0 1-2.438-2.438Zm.417 20.214V33.35h4.075v15.5Zm7.701-20.214a2.439 2.439 0 1 1 2.438 2.438 2.458 2.458 0 0 1-2.438-2.438Zm.417 20.214V33.35h4.074v15.5Zm12.128 0-6.224-15.5h4.364l4.042 10.781 4.043-10.781h4.4l-6.225 15.5Z"
												fill="currentColor"
											></path>
										</svg>
									</div>
									<div>
										<button
											type="button"
											id="close-mobile-menu-btn"
											className="sm:hidden rounded p-1 text-onyx dark:text-pearl dark:border-pearl-shade focus:border-topaz focus:outline-none focus:ring-1 focus:ring-topaz dark:focus:ring-topaz-light mt-2"
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
									<div>
										<p>logged in as</p>
										<a
											href="/admin/edit-user"
											className="block border-2 border-onyx rounded bg-pearl hover:bg-pearl-shade px-2 group"
										>
											<div className="flex py-2 items-center">
												<img
													className="h-12 w-12 rounded-full border-2 border-onyx"
													src="https://i.pravatar.cc/300"
													alt=""
												/>
												<div className="ml-3">
													<p className="text-sm font-medium text-onyx">
														John Public
													</p>
												</div>
												<div className="ml-auto flex items-center justify-end">
													<div className="border-2 border-onyx p-1 text-sm rounded px-2">
														edit
													</div>
												</div>
											</div>
										</a>
									</div>
									<div className="flex-1 space-y-1 pt-6">
										<a
											href="/admin/dashboard"
											className="text-onyx dark:text-pearl group"
										>
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
														<rect x="3" y="3" width="7" height="7"></rect>
														<rect x="14" y="3" width="7" height="7"></rect>
														<rect x="14" y="14" width="7" height="7"></rect>
														<rect x="3" y="14" width="7" height="7"></rect>
													</svg>
												</div>{" "}
												dashboard
											</div>
										</a>
										<a
											href="/admin/onboarding"
											className="text-onyx dark:text-pearl group"
										>
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
														<path d="M17 13v-6l-5 4l-5 -4v6l5 4z"></path>
													</svg>
												</div>{" "}
												onboarding
											</div>
										</a>
										<a
											href="/admin/documentation"
											className="text-onyx dark:text-pearl group"
										>
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
														<path d="M12 15a3 3 0 1 0 6 0 3 3 0 1 0-6 0"></path>
														<path d="M13 17.5V22l2-1.5 2 1.5v-4.5"></path>
														<path d="M10 19H5a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-1 1.73M6 9h12M6 12h3m-3 3h2"></path>
													</svg>
												</div>{" "}
												documentation
											</div>
										</a>
										<a
											href="/admin/information"
											className="text-onyx dark:text-pearl group"
										>
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
														<path d="M12 8h.01M11 12h1v4h1"></path>
														<path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z"></path>
													</svg>
												</div>{" "}
												information
											</div>
										</a>
										<a
											href="/admin/issues"
											className="text-onyx dark:text-pearl group"
										>
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
														<path d="M5 14h14V5H5v16"></path>
													</svg>
												</div>{" "}
												issues
											</div>
										</a>
									</div>
								</div>
								<div className="my-2 border-t-2 border-onyx-light lg:w-52 lg:mx-auto">
									<a href="/login" className="text-onyx dark:text-pearl group">
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
										reimagine business credit
									</span>
								</div>
							</footer>
						</div>
					</div>
					<div className="grid grid-cols-1 gap-3 h-16 items-center">
						<button
							id="mobile-menu-btn"
							className="md:hidden rounded p-1 text-onyx dark:text-pearl dark:border-pearl-shade focus:border-topaz focus:outline-none focus:ring-1 focus:ring-topaz dark:focus:ring-topaz-light"
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
						<AdminAccountDropdown />
					</div>
				</div>

				{/* MAIN */}
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
					<div className=" pb-12">
						<main className="lg:px-6 w-full">
							<div className="text-center">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									admin created successfully
								</h2>
							</div>
							<div>
								<CheckmarkSvg />
							</div>
							<div className="pt-6 text-center">
								<Link
									href="/admin/create-admin"
									className="inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
								>
									create another
								</Link>
							</div>
						</main>
					</div>
				</div>
				<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto">
					<div className="w-full"></div>
				</div>
			</div>
		</div>
	);
};

export default CreateAdmin;
