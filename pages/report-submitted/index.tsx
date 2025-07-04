import Head from "next/head";
import Sidebar from "../../components/sidebar";
import Link from "next/link";
import HeaderActions from "../../components/header-actions";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import useProtected from "../../hooks/useProtected";

const ReportSubmitted = () => {
	useProtected();
	return (
		<div>
			<Head>
				<title>Report submitted | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
						{/* <!-- <Search client:visible /> --> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
						<LogoSvg />
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 astro-UHFQUROE">
						<div className=" pb-12 astro-UHFQUROE">
							<main className="lg:px-6 w-full">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									report incorrect data
								</h2>
								<div className="border-2 border-onyx rounded-md bg-pearl p-2 lg:p-6 mb-6">
									<div className="mb-2">
										<p className="font-medium text-2xl text-center">
											report submitted successfully!
										</p>
									</div>
									<p className="text-center">
										please allow 48 to 72 hours while we investigate this issue
									</p>
									<div className="pt-3 text-center mt-8">
										<Link
											href="/dashboard"
											className="inline-flex justify-center rounded border border-transparent bg-topaz py-2 px-4 font-medium text-white shadow-sm hover:bg-topaz-light focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
										>
											back to dashboard
										</Link>
									</div>
								</div>
							</main>
						</div>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto astro-UHFQUROE">
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

export default ReportSubmitted;
