// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { generateMnemonic } from "bip39";

export type MnemonicResponse = {
	payload: {
		mnemonic: string;
	};
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<MnemonicResponse>
) {
	const mnemonic = generateMnemonic();
	res.status(200).json({ payload: { mnemonic } });
}
