import Head from "next/head";
import Link from "next/link";
import { useState, useRef } from "react";
import ReactToPrint from "react-to-print";
import { useFactiivStore } from "../../store";
//SVGs
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { CopySvg } from "../../components/svgs/CopySvg";
import { PrintSvg } from "../../components/svgs/PrintSvg";
import useProtected from "../../hooks/useProtected";

const PassphraseRemember = () => {
	useProtected();
	const store = useFactiivStore();

	//Copy seed phrase
	const [copied, setCopied] = useState<boolean>(false);
	const handleCopyClick = async () => {
		setCopied(() => true);
		try {
			await navigator?.clipboard?.writeText(store.accountPassphrase.join(" "));
			setTimeout(() => {
				setCopied(() => false);
			}, 1000);
		} catch (error) {
			setCopied(() => false);
		}
	};

	//Print seed phrase
	const printRef = useRef<null | HTMLDivElement>(null);

	return (
		<div className="min-h-[100vh] bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>View passphrase | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full px-4 astro-LIXB6EQA">
				<div className="py-6 sm:px-6 lg:px-8 font-prox astro-LIXB6EQA">
					<div className="sm:mx-auto sm:w-full sm:max-w-md mt-12 md:mt-24 lg:mt-32 astro-LIXB6EQA">
						<div className="mx-auto astro-LIXB6EQA">
							<LogoSvg />
						</div>
						<h2 className="mt-6 text-center font-medium text-xl lg:text-2xl astro-LIXB6EQA">
							your passphrase
						</h2>
					</div>
					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md astro-LIXB6EQA">
						<div className="bg-pearl dark:bg-onyx-light py-8 px-4 border-2 border-onyx rounded-lg sm:px-10 astro-LIXB6EQA">
							<div>
								<p className="text-center -mt-3 mb-3">
									use buttons below to save quickly
								</p>
								<div
									className="grid grid-cols-3 gap-2 mb-4 printDiv"
									ref={printRef}
								>
									{store.accountPassphrase.map((word, i) => (
										<div
											key={`${word}-${i}`}
											className="border-2 border-gold bg-gold-lightest/50 p-1 rounded flex space-x-1 items-center font-bold"
										>
											<span className="bg-gold-lighter border-2 border-gold w-8 h-8 rounded flex items-center justify-center flex-none text-onyx">
												{i + 1}
											</span>
											<span>{word}</span>
										</div>
									))}
								</div>
								<Link href="/passphrase-confirm" className="relative group">
									<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
										got it
									</span>
									<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
								</Link>
							</div>
						</div>
						<div className="flex items-center justify-end space-x-2 mt-4 mb-2">
							<button
								id="passphrase-copy"
								onClick={handleCopyClick}
								className="hover:bg-onyx/10 rounded focus:ring-2 focus:ring-topaz focus:border-topaz active:bg-onyx/20 flex items-center border-2 border-onyx p-1 pr-2 space-x-1"
							>
								<CopySvg copied={copied} />
								<span className="sr-only">copy passphrase to clipboard</span>
								<span id="copy" className="w-14 text-left">
									{copied ? "copied" : "copy"}
								</span>
							</button>
							<ReactToPrint
								trigger={() => {
									return (
										<button
											id="passphrase-print"
											className="hover:bg-onyx/10 rounded focus:ring-2 focus:ring-topaz focus:border-topaz active:bg-onyx/20 flex items-center border-2 border-onyx p-1 pr-2 space-x-1"
										>
											<PrintSvg />
											<span className="sr-only">print passphrase</span>
											<span className="w-14 text-left">print</span>
										</button>
									);
								}}
								content={() => printRef.current}
								pageStyle="printDiv {padding: 10px;}"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PassphraseRemember;
