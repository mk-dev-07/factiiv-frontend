import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
//SVGs
import { LogoSvg } from "../../components/svgs/LogoSvg";
import { ResetSvg } from "../../components/svgs/ResetSvg";
import useProtected from "../../hooks/useProtected";
import { useFactiivStore } from "../../store";

const PassphraseConfirm = () => {
	useProtected();

	const store = useFactiivStore();
	const { accountPassphrase } = store;
	const router = useRouter();

	const [phrase, setPhrase] = useState<string[]>();
	const [tryPhrase, setTryPhrase] = useState<{ [key: string]: string }>({});
	const [phraseOrder, setPhraseOrder] = useState([
		2, 1, 3, 4, 10, 11, 7, 5, 6, 0, 8, 9,
	]);
	const [errorMsg, setErrorMsg] = useState(
		"wrong passphrase, click on reset to try again!"
	);
	const [showErrorMsg, setShowErrorMsg] = useState(false);

	//Add dynamic styling
	const buttonStyle =
		"word border-2 border-gray-400 hover:bg-gold-lightest/20 hover:border-onyx group p-1 rounded flex space-x-1 items-center font-bold";
	const activeButtonStyle =
		"word border-2 border-gold bg-gold-lightest/50 p-1 rounded flex space-x-1 items-center font-bold";
	const cellStyle =
		"border-2 border-gray-300 w-8 h-8 rounded flex items-center justify-center flex-none text-onyx";
	const activeCellStyle =
		"bg-gold-lighter border-2 border-gold w-8 h-8 rounded flex items-center justify-center flex-none text-onyx";
	const inactiveCheckStyle =
		"bg-gray-200 relative cursor-not-allowed focus:outline-none transition-transform text-onyx border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4";
	const activeCheckStyle =
		"bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4";

	//Check entered phrase
	const handleCheck = () => {
		if (tryPhraseKeys.length !== 12) {
			setShowErrorMsg(true);
			return;
		}

		const tryPhraseString = Object.values(tryPhrase);
		if (JSON.stringify(tryPhraseString) !== JSON.stringify(phrase)) {
			setShowErrorMsg(true);
			return;
		}

		store.updateAccountPassphrase([]);
		router.push("/account-created");
	};

	//Reset states
	const handleReset = () => {
		setTryPhrase({});
		setShowErrorMsg(false);
	};

	//Animation
	// const [showAnimation, setShowAnimation] = useState<boolean>(false);

	const tryPhraseKeys = useMemo(() => Object.keys(tryPhrase), [tryPhrase]);

	useEffect(() => {
		if (accountPassphrase.length !== 12) {
			setErrorMsg(
				"There has been an error with your passphrase, you will be directed back to the previous page"
			);
			setTimeout(() => {
				router.back();
			}, 5000);
			return;
		}

		const randomPhraseOreder = new Array(12)
			.fill(null)
			.map((item, index) => index)
			.sort((a, b) => 0.5 - Math.random());

		setPhraseOrder(randomPhraseOreder);
		setPhrase(accountPassphrase);
	}, []);

	return (
		<div className="min-h-[100vh] bg-pearl-shade dark:bg-onyx">
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full px-4 astro-LIXB6EQA">
				<Head>
					<title>Confirm passphrase | factiiv</title>
				</Head>
				<div className="py-6 sm:px-6 lg:px-8 font-prox astro-LIXB6EQA">
					<div className="sm:mx-auto sm:w-full sm:max-w-md mt-12 md:mt-24 lg:mt-32 astro-LIXB6EQA">
						<div className="mx-auto astro-LIXB6EQA">
							<LogoSvg />
						</div>
						<h2 className="mt-6 text-center font-medium text-xl lg:text-2xl astro-LIXB6EQA">
							confirm passphrase
						</h2>
					</div>
					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
						<div className="bg-pearl dark:bg-onyx-light py-8 px-4 border-2 border-onyx rounded-lg sm:px-10 astro-LIXB6EQA">
							<div>
								<p className="text-center -mt-3 mb-3">
									click the words in the correct order
								</p>
								<div className="grid grid-cols-3 gap-2 mb-4">
									{phraseOrder.map((cell, index) => {
										if (!phrase) {
											return null;
										}
										const key = `${phrase[cell]}-${index}`;

										return (
											<button
												key={key}
												id={"cell-" + index}
												onClick={() =>
													!tryPhrase[key] &&
													setTryPhrase((prev) => ({
														...prev,
														[key]: phrase[cell],
													}))
												}
												className={
													tryPhraseKeys.includes(key)
														? activeButtonStyle
														: buttonStyle
												}
											>
												<span
													className={
														tryPhraseKeys.includes(key)
															? activeCellStyle
															: cellStyle
													}
												>
													{tryPhraseKeys.includes(key) && (
														<span className="animate-fade-in">
															{Object?.keys(tryPhrase)?.indexOf(key) + 1}
														</span>
													)}
												</span>
												<span>{phrase[cell]}</span>
											</button>
										);
									})}
								</div>
								{showErrorMsg && (
									<p className="text-red-500 mb-3 text-center">{errorMsg}</p>
								)}
								<button
									id="passphrase-check"
									onClick={handleCheck}
									className="relative group w-full"
								>
									<span
										className={
											tryPhraseKeys.length === 12
												? activeCheckStyle
												: inactiveCheckStyle
										}
									>
										check
									</span>
									{tryPhraseKeys.length === 12 && (
										<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
									)}
								</button>
							</div>
						</div>
						<div className="flex items-center justify-end space-x-2 mt-4 mb-2">
							<button
								id="passphrase-reset"
								onClick={handleReset}
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

export default PassphraseConfirm;
