import Head from "next/head";
import Sidebar from "../../components/sidebar";
import useProtected from "../../hooks/useProtected";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import HeaderActions from "../../components/header-actions";
import BankSvg from "../../components/svgs/BankSvg";
import MaticSvg from "../../components/svgs/MaticSvg";
import BitcoinSvg from "../../components/svgs/BitcoinSvg";
import EthereumSvg from "../../components/svgs/EthereumSvg";
import { useState } from "react";

const GetFact = () => {
	useProtected();

	const [fact, setFact] = useState("COMING SOON");

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const key = event.key;
		// check if key is a number key (0-9)
		const isNumericKey = /^\d$/.test(key);
		// check if key is the backspace or delete key
		const isBackspaceOrDelete = key === "Backspace" || key === "Delete";
		// prevent the input from being added
		if (!isNumericKey && !isBackspaceOrDelete) {
			event.preventDefault();
		}
	};

	return (
		<div>
			<Head>
				<title>Get facts | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
						<LogoSvg />
					</div>
					<HeaderActions></HeaderActions>
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
						<main className="lg:px-6 w-full">
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								get FACT
							</h2>
							<div className="rounded border-2 border-onyx p-2 mt-6 md:my-8 relative">
								<span className="absolute bg-pearl-shade text-sm -top-3 left-2 px-2">
									payment type
								</span>
								<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 gap-2 lg:gap-4 mt-2">
									{/* <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4 mt-2"> */}
									{/* <button className="rounded-sm leading-5 font-medium border-2 px-3 py-2 md:py-6 lg:py-8 flex items-center pl-6 md:pl-0 md:justify-center space-x-2 lg:space-x-4 hover:text-onyx bg-pearl border-onyx text-onyx/80">
										<BankSvg />
										<span>credit/debit</span>
									</button> */}
									<button className="rounded-sm leading-5 font-medium border-2 px-3 py-2 md:py-6 lg:py-8 flex items-center pl-6 md:pl-0 md:justify-center space-x-2 lg:space-x-4 hover:text-onyx bg-pearl border-onyx text-onyx/80">
										<MaticSvg />
										<span>MATIC</span>
									</button>
									{/* <button className="rounded-sm leading-5 font-medium border-2 px-3 py-2 md:py-6 lg:py-8 flex items-center pl-6 md:pl-0 md:justify-center space-x-2 lg:space-x-4 hover:text-onyx bg-pearl border-onyx text-onyx/80">
										<BitcoinSvg />
										<span>BTC</span>{" "}
									</button> */}
									<button className="rounded-sm leading-5 font-medium border-2 px-3 py-2 md:py-6 lg:py-8 flex items-center pl-6 md:pl-0 md:justify-center space-x-2 lg:space-x-4 hover:text-onyx bg-pearl border-onyx text-onyx/80">
										<EthereumSvg />
										<span>ETH</span>{" "}
									</button>
								</div>
							</div>{" "}
							<div>
								<div className="w-full md:w-[700px] pt-2 md:pt-6 mx-auto block relative items-center justify-center font-bold text-onyx [font-size:clamp(4rem,_10.8vw_-_1.5rem,_6rem)]">
									{" "}
									<div
										className="inline-block overflow-visible"
										style={{ position: "relative" }}
									>
										{/* facts */}
										<input
											value={"COMING SOON"}
											className="w-full md:w-[700px] text-center flex-none overflow-visible bg-transparent border-transparent focus:outline-none "
											placeholder="0"
										/>
										{/* onChange={e => setFacts(e.target.value)} */}
										{/* onKeyDown={handleKeyDown} */}
										<iframe
											style={{
												display: "block",
												position: "absolute",
												top: "0",
												left: "0",
												width: "100%",
												height: "100%",
												overflow: "hidden",
												border: "0",
												opacity: "0",
												pointerEvents: "none",
												zIndex: "-1",
											}}
										></iframe>
									</div>{" "}
								</div>{" "}
								<div className="-mt-2 md:-mt-8">
									<p className="text-sm text-center text-zinc-500">
										{fact} FACT tokens
									</p>
								</div>
							</div>{" "}
							<div className="my-3 md:my-12 space-y-6">
								<div className="rounded border-2 col-start-1 col-span-1 border-onyx p-2 relative">
									<span className="absolute bg-pearl-shade text-sm -top-3 left-2 px-2">
										payment method
									</span>{" "}
									<div className="border-2 border-onyx text-zinc-400 bg-pearl rounded px-3 py-2 mt-2 w-full text-center">
										select a payment type
									</div>
								</div>{" "}
								<div className="rounded border-2 p-2 relative">
									<span className="absolute z-[1] bg-pearl-shade text-sm -top-3 left-2 px-2">
										receiving wallet
									</span>{" "}
									<input
										placeholder="enter a valid Polygon wallet address"
										className="border-2 peer relative z-[1] border-onyx bg-pearl rounded px-3 py-2 mt-2 w-full"
									/>{" "}
									<span className="absolute inset-0 rounded border-2 border-topaz peer-placeholder-shown:border-onyx z-[0]"></span>{" "}
									<button className="bg-onyx relative z-[1] hover:bg-onyx/75 rounded py-1 px-2 text-sm text-pearl mt-2">
										paste
									</button>
								</div>
							</div>{" "}
							<div className="sm:max-w-[200px] ml-auto">
								{/* <button disabled className="grid w-full cursor-not-allowed">
									<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx h-full"></span>{" "}
									<span className="bg-zinc-200 subpixel-antialiased focus:outline-none transition-transform text-onyx border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
										buy now
									</span>
								</button> */}
							</div>
						</main>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-36 xl:w-60 2xl:w-72 mx-auto"></div>
				</div>
			</div>
		</div>
	);
};

export default GetFact;
