import Head from "next/head";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
//SVGs
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import { useFactiivStore } from "../../store";
import useProtected from "../../hooks/useProtected";
import { LogoSvg } from "../../components/svgs/LogoSvg";

const NewProfile = () => {
	useProtected();
	const store = useFactiivStore();

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>New profile | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full astro-GCQE7J5L">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] astro-GCQE7J5L">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 astro-GCQE7J5L">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 astro-GCQE7J5L">
						<LogoSvg></LogoSvg>
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 astro-GCQE7J5L">
						<main className="lg:px-6 w-full">
							<div>
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									{" "}
									welcome to factiiv{" "}
								</h2>
								<div className="bg-pearl dark:bg-onyx-light rounded-lg mb-4 p-4 xs:-p-5 sm:p-6 border-2 border-onyx-light mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:py-6 md:px-6 gap-y-6 md:gap-6 sm:gap-10 xl:gap-12">
									<div className="col-span-2 flex items-center justify-center lg:h-96">
										<div className="text-center md:text-lg max-w-sm mx-auto">
											<svg
												className="block mx-auto bg-white"
												width="100px"
												height="100px"
												strokeWidth="2"
												viewBox="0 0 100 100"
												preserveAspectRatio="xMidYMid"
											>
												<g transform="rotate(180 50 50)">
													<rect
														rx=".5"
														x="12.5"
														y="15"
														width="15"
														height="40"
														fill="#EFBC73"
														stroke="currentColor"
													>
														<animate
															attributeName="height"
															values="50;70;30;50"
															keyTimes="0;0.33;0.66;1"
															dur="2.5s"
															repeatCount="indefinite"
															calcMode="spline"
															keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
															begin="-1.08s"
														></animate>
													</rect>
													<rect
														rx=".5"
														x="12.5"
														y="15"
														width="15"
														height="20"
														fill="#409AF4"
														stroke="currentColor"
													>
														<animate
															attributeName="height"
															values="40;60;20;40"
															keyTimes="0;0.33;0.66;1"
															dur="2.5s"
															repeatCount="indefinite"
															calcMode="spline"
															keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
															begin="-1.08s"
														></animate>
													</rect>
													<rect
														vectorEffect="non-scaling-stroke"
														rx=".5"
														x="32.5"
														y="15"
														width="15"
														height="40"
														fill="#EFBC73"
														stroke="currentColor"
													>
														<animate
															attributeName="height"
															values="50;20;60;50"
															keyTimes="0;0.33;0.66;1"
															dur="2.5s"
															repeatCount="indefinite"
															calcMode="spline"
															keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
															begin="-0.5s"
														></animate>
													</rect>
													<rect
														vectorEffect="non-scaling-stroke"
														rx=".5"
														x="32.5"
														y="15"
														width="15"
														height="40"
														fill="#409AF4"
														stroke="currentColor"
													>
														<animate
															attributeName="height"
															values="40;10;50;40"
															keyTimes="0;0.33;0.66;1"
															dur="2.5s"
															repeatCount="indefinite"
															calcMode="spline"
															keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
															begin="-0.5s"
														></animate>
													</rect>
													<rect
														vectorEffect="non-scaling-stroke"
														rx=".5"
														x="52.5"
														y="15"
														width="15"
														height="40"
														fill="#EFBC73"
														stroke="currentColor"
													>
														<animate
															attributeName="height"
															values="50;70;30;50"
															keyTimes="0;0.33;0.66;1"
															dur="2.5s"
															repeatCount="indefinite"
															calcMode="spline"
															keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
															begin="-1.6s"
														></animate>
													</rect>
													<rect
														vectorEffect="non-scaling-stroke"
														rx=".5"
														x="52.5"
														y="15"
														width="15"
														height="40"
														fill="#409AF4"
														stroke="currentColor"
													>
														<animate
															attributeName="height"
															values="40;60;20;40"
															keyTimes="0;0.33;0.66;1"
															dur="2.5s"
															repeatCount="indefinite"
															calcMode="spline"
															keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
															begin="-1.6s"
														></animate>
													</rect>
													<rect
														vectorEffect="non-scaling-stroke"
														rx=".5"
														x="72.5"
														y="15"
														width="15"
														height="40"
														fill="#EFBC73"
														stroke="currentColor"
													>
														<animate
															attributeName="height"
															values="50;70;30;50"
															keyTimes="0;0.33;0.66;1"
															dur="2.5s"
															repeatCount="indefinite"
															calcMode="spline"
															keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
															begin="-2.5s"
														></animate>
													</rect>
													<rect
														vectorEffect="non-scaling-stroke"
														rx=".5"
														x="72.5"
														y="15"
														width="15"
														height="40"
														fill="#409AF4"
														stroke="currentColor"
													>
														<animate
															attributeName="height"
															values="40;60;20;40"
															keyTimes="0;0.33;0.66;1"
															dur="2.5s"
															repeatCount="indefinite"
															calcMode="spline"
															keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
															begin="-2.5s"
														></animate>
													</rect>
												</g>
											</svg>
											<p>
												your business is currently under review by factiiv,
												complete more business information while you wait
											</p>
										</div>
									</div>
									<div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-1 xl:max-w-[290px] w-full ml-auto">
										<div className="pb-2">
											<h2 className="font-medium text-center text-base xs:text-lg lg:text-xl 2xl:text-2xl">
												improvements
											</h2>
										</div>
										<ul className="space-y-3 text-base">
											<li>
												<a
													href="/documentation"
													className="border-2 border-onyx text-onyx dark:text-white font-medium py-2 px-6 block leading-tight rounded bg-gold hover:bg-opacity-20 bg-opacity-10 relative"
												>
													<div className="border-2 border-onyx bg-red-300 h-3 w-3 absolute left-[2px] top-[2px] rounded-sm"></div>{" "}
													submit business documentation
												</a>
											</li>
											<li>
												<a
													href="/information"
													className="border-2 border-onyx text-onyx dark:text-white font-medium py-2 px-6 block leading-tight rounded bg-gold hover:bg-opacity-20 bg-opacity-10 relative"
												>
													<div className="border-2 border-onyx bg-yellow-300 h-3 w-3 absolute left-[2px] top-[2px] rounded-sm"></div>{" "}
													complete information
												</a>
											</li>
											<li>
												<a
													href="/listings"
													className="border-2 border-onyx text-onyx dark:text-white font-medium py-2 px-6 block leading-tight rounded bg-gold hover:bg-opacity-20 bg-opacity-10 relative"
												>
													<div className="border-2 border-onyx bg-yellow-300 h-3 w-3 absolute left-[2px] top-[2px] rounded-sm"></div>{" "}
													update listings
												</a>
											</li>
											<li>
												<a
													href="/survey"
													className="border-2 border-onyx text-onyx dark:text-white font-medium py-2 px-6 block leading-tight rounded bg-gold hover:bg-opacity-20 bg-opacity-10 relative"
												>
													<div className="border-2 border-onyx bg-yellow-300 h-3 w-3 absolute left-[2px] top-[2px] rounded-sm"></div>{" "}
													take the factiiv survey
												</a>
											</li>
										</ul>
										<div className=" mt-6 lg:mt-auto">
											<a href="/improvements" className="relative group">
												<span className="bg-onyx z-[2] relative group-hover:-translate-y-1 group-hover:bg-topaz focus:-translate-y-1 focus:bg-topaz focus:outline-none border-2 transition-transform duration-150 border-onyx text-white rounded py-1 text-lg pl-4 pr-2 w-full flex items-center justify-between">
													{" "}
													more info{" "}
													<svg
														className="h-6 w-6"
														viewBox="0 0 24 24"
														strokeWidth="2"
														stroke="currentColor"
														fill="none"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<line x1="7" y1="17" x2="17" y2="7"></line>
														<polyline points="7 7 17 7 17 17"></polyline>
													</svg>
												</span>
												<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
											</a>
										</div>
									</div>
								</div>
							</div>
						</main>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto astro-GCQE7J5L">
						<div className="w-full mt-12">
							<div className="w-full sticky top-6">
								<div className="relative mt-4">
									<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
										<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
											<b className="text-bold text-onyx px-1">fact</b>
										</p>
										<p>
											more options will be available once you enter a trade for
											this business
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

export default NewProfile;
