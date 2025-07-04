import Head from "next/head";
import React from "react";
import Link from "next/link";
//SVGs
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { CheckmarkSvg } from "../../components/svgs/CheckmarkSvg";
import useProtected from "../../hooks/useProtected";

const BusinessCreated = () => {
	useProtected();

	return (
		<div className="min-h-[100vh] bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Business created | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full px-4 astro-LIXB6EQA">
				<div className="py-6 sm:px-6 lg:px-8 font-prox astro-LIXB6EQA">
					<div className="sm:mx-auto sm:w-full sm:max-w-md mt-12 md:mt-24 lg:mt-32 astro-LIXB6EQA">
						<div className="mx-auto astro-LIXB6EQA">
							<LogoSvg />
						</div>
						<h2 className="mt-6 text-center font-medium text-xl lg:text-2xl astro-LIXB6EQA">
							business created!
						</h2>
					</div>
					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md astro-LIXB6EQA">
						<div className="bg-pearl dark:bg-onyx-light py-8 px-4 border-2 border-onyx rounded-lg sm:px-10 astro-LIXB6EQA">
							<div>
								<p className="text-center">
									your business profile was created successfully! visit the
									dashboard to start getting factiiv verified.
								</p>
								<CheckmarkSvg />
								<Link href="/dashboard" className="group grid">
									<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform"></span>
									<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
										go to dashboard
									</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BusinessCreated;
