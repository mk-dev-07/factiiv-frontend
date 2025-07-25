import Head from "next/head";
import React from "react";
import Link from "next/link";
//SVGs
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { CheckmarkSvg } from "../../components/svgs/CheckmarkSvg";
import useProtected from "../../hooks/useProtected";

const VerificationComplete = () => {
	useProtected();
	return (
		<div className="min-h-[100vh] bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Verification complete | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full px-4 astro-LIXB6EQA">
				<div className="py-6 sm:px-6 lg:px-8 font-prox astro-LIXB6EQA">
					<div className="sm:mx-auto sm:w-full sm:max-w-md mt-12 md:mt-24 lg:mt-32 astro-LIXB6EQA">
						<div className="mx-auto astro-LIXB6EQA">
							<LogoSvg />
						</div>
						<h2 className="mt-6 text-center font-medium text-xl lg:text-2xl astro-LIXB6EQA">
							verification complete!
						</h2>
					</div>
					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md astro-LIXB6EQA">
						<div className="bg-pearl dark:bg-onyx-light py-8 px-4 border-2 border-onyx rounded-lg sm:px-10 astro-LIXB6EQA">
							<div>
								<p className="text-center">
									let&apos;s secure your factiiv account
								</p>
								<CheckmarkSvg />
								<Link href="/passphrase-warning" className="relative group">
									<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
										set up recovery
									</span>
									<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VerificationComplete;
