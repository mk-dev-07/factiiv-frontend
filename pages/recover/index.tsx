import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//SVGs
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { CopySvg } from "../../components/svgs/CopySvg";
import { ResetSvg } from "../../components/svgs/ResetSvg";

const Recover = () => {
	const router = useRouter();

	//Valid seed phrase
	const seedPhrase: string[] = [
		"tree",
		"shake",
		"frozen",
		"boil",
		"head",
		"movie",
		"boss",
		"insider",
		"eight",
		"often",
		"cloud",
		"seed",
	];

	//Entered seed phrase
	interface ITryPhrase {
		[key: number]: string;
	}
	const [tryPhrase, setTryPhrase] = useState<ITryPhrase>({});

	//Convert seed phrase object to array
	const [tryPhraseArray, setTryPhraseArray] = useState<string[]>([]);
	useEffect(() => {
		setTryPhraseArray(Object.values(tryPhrase));
	}, [tryPhrase]);

	//Check entered phrase
	const handleCheck = () => {
		return (
			tryPhraseArray.length === 12 &&
			(JSON.stringify(tryPhraseArray) === JSON.stringify(seedPhrase)
				? router.push("/finding-account")
				: alert("wrong passphrase, click on reset to try again!"))
		);
	};

	// Reset all values
	const handleReset = () => {
		setTryPhrase({});
	};

	//Paste values from the clipboard
	const [pasted, setPasted] = useState<boolean>(false);

	const handlePaste = () => {
		//To animate paste icon
		setPasted(() => true);
		setTimeout(() => {
			setPasted(() => false);
		}, 1000);
		//Paste text
		navigator.clipboard
			.readText()
			.then((text) => {
				const pastedPhrase = text.split(" ");
				pastedPhrase.length === 12 &&
					setTryPhrase(() => Object.assign({}, pastedPhrase));
			})
			.catch((err) => {
				console.error("Failed to read clipboard contents: ", err);
			});
	};

	//Check button dynamic styles
	const activeCheckStyle =
		"bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4";
	const inactiveCheckStyle =
		"bg-gray-200 relative cursor-not-allowed focus:outline-none transition-transform text-onyx border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4";

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Recover | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full px-4">
				<div className="py-6 sm:px-6 lg:px-8 font-prox">
					<div className="sm:mx-auto sm:w-full sm:max-w-md mt-12 md:mt-24 lg:mt-32">
						<div className="mx-auto">
							<LogoSvg />
						</div>
						<h2 className="mt-6 text-center font-medium text-xl lg:text-2xl">
							recover my account
						</h2>
					</div>
					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
						<div className="bg-pearl dark:bg-onyx-light py-8 px-4 border-2 border-onyx rounded-lg sm:px-10">
							<div>
								<p className="text-center -mt-3 mb-3">
									enter your passphrase in the inputs below
								</p>
								<div className="grid grid-cols-3 gap-2 mb-4">
									{seedPhrase.map((word, index) => {
										return (
											<div className="relative" key={word}>
												<input
													value={tryPhrase[index] || ""}
													onChange={(e) =>
														setTryPhrase({
															...tryPhrase,
															[index]: e.target.value,
														})
													}
													placeholder=" "
													required
													type="text"
													spellCheck="false"
													className="word-input bg-transparent peer w-full text-left border-2 border-gray-400 valid:border-gold bg-gray-100 p-1 h-10 rounded flex flex-row-reverse items-center font-bold group focus:outline-none pl-10 focus:border-topaz valid:bg-gold-lightest/50"
												/>
												<span className="absolute top-1 left-1 border-2 border-gold bg-gold-lighter w-8 h-8 rounded flex items-center justify-center flex-none text-onyx peer-focus:bg-topaz peer-focus:border-topaz peer-focus:text-white peer-placeholder-shown:bg-gray-100 peer-placeholder-shown:border-gray-300">
													{index + 1}
												</span>
											</div>
										);
									})}
								</div>
								<button
									id="recover-check"
									onClick={handleCheck}
									className="relative group w-full"
								>
									<span
										className={
											tryPhraseArray.length === 12
												? activeCheckStyle
												: inactiveCheckStyle
										}
									>
										{" "}
										check{" "}
									</span>
									{tryPhraseArray.length === 12 && (
										<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
									)}
								</button>
							</div>
						</div>
						<div className="flex items-center justify-end space-x-2 mt-4 mb-2">
							<button
								onClick={handlePaste}
								id="recover-paste"
								className="hover:bg-onyx/10 rounded focus:ring-2 focus:ring-topaz focus:border-topaz active:bg-onyx/20 flex items-center border-2 border-onyx p-1 pr-2 space-x-1"
							>
								<CopySvg copied={pasted} />
								<span className="sr-only">paste passphrase from clipboard</span>
								<span id="paste" className="w-14 text-left">
									paste
								</span>
							</button>
							<button
								onClick={handleReset}
								id="recover-reset"
								className="hover:bg-onyx/10 rounded focus:ring-2 focus:ring-topaz focus:border-topaz active:bg-onyx/20 flex items-center border-2 border-onyx p-1 pr-2 space-x-1 group"
							>
								<ResetSvg />
								<span className="w-14 text-left">reset</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Recover;
