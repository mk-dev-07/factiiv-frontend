// import NextAuth from "next-auth";
// import { app } from "../../../config/firebase";
// import { FirestoreAdapter } from "@next-auth/firebase-adapter";
// // import { FirestoreAdapter } from "@next-auth/firebase-adapter";

// export default NextAuth({
// 	adapter: FirestoreAdapter(app),
// });

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
	name: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	res.status(200).json({ name: "Jane Doe" });
}
