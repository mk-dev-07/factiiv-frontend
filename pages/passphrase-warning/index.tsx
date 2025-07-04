import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFactiivStore } from "../../store";
import { LogoSvg } from "../../components/svgs/LogoSvg";
import useProtected from "../../hooks/useProtected";
import { NextPageContext } from "next";
import { MnemonicResponse } from "../api/mnemonic";
import getConfig from "next/config";

export async function getServerSideProps(context: NextPageContext) {
	const {
		publicRuntimeConfig: { serverUrl },
	} = getConfig();

	const mnemonicResponse = await fetch(`${serverUrl}/api/mnemonic`);
	const data: MnemonicResponse = await mnemonicResponse.json();
	const passphrase = data.payload.mnemonic;

	return {
		props: {
			passphrase,
		},
	};
}

interface PageProps {
	passphrase: string;
}

const PassphraseWarning = ({ passphrase }: PageProps) => {
	useProtected();

	const store = useFactiivStore();
	const router = useRouter();
	const [isChecked, setIsChecked] = useState<boolean>(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		isChecked && router.push("/passphrase");
	};

	useEffect(() => {
		store.updateAccountPassphrase(passphrase.split(" "));
	}, []);

	return (
		<div className="min-h-[100vh] bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Passphrase warning | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full px-4 astro-LIXB6EQA">
				<div className="py-6 sm:px-6 lg:px-8 font-prox astro-LIXB6EQA">
					<div className="sm:mx-auto sm:w-full sm:max-w-md mt-12 md:mt-24 lg:mt-32 astro-LIXB6EQA">
						<div className="mx-auto astro-LIXB6EQA">
							<LogoSvg />
						</div>
						<h2 className="mt-6 text-center font-medium text-xl lg:text-2xl astro-LIXB6EQA">
							read carefully
						</h2>
					</div>

					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md astro-LIXB6EQA">
						<div className="bg-pearl dark:bg-onyx-light py-8 px-4 border-2 border-onyx rounded-lg sm:px-10 astro-LIXB6EQA">
							<form className="space-y-4" onSubmit={handleSubmit}>
								<p>
									on the following step you will be shown your recovery
									passphrase.
								</p>
								<div className="bg-red-200 rounded p-2">
									<p className="font-bold">
										your passphrase is the only way to recover your account if
										you lose your password, anyone with your passphrase will
										have full control of your account.
									</p>
								</div>
								<label htmlFor="understood" className="flex space-x-4">
									<input
										required
										checked={isChecked}
										onChange={() => setIsChecked((c) => !c)}
										id="understood"
										name="understood"
										type="checkbox"
										className="h-6 w-6 rounded border-2 border-onyx text-topaz focus:ring-topaz"
									/>
									<span className="font-bold">I understand</span>
								</label>

								<button
									id="passphrase-show"
									type="submit"
									className="relative group w-full"
								>
									<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4">
										show passphrase
									</span>
									<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PassphraseWarning;
