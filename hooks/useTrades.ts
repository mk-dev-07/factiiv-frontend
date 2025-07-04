import getConfig from "next/config";
import { useQuery } from "react-query";
import { useFactiivStore } from "../store";
import { Trade } from "../types/trade.interface";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";

/**
 * Fetches all of the trades for the user.
 *
 * @param tradeId
 * @param callback
 * @returns Array of all trades for the current user
 */
const useTrades = () => {
	const store = useFactiivStore();
	const {
		activeProfile: { id: profileId },
	} = store;
	const { refreshedFetch } = useAuthenticatedFetch();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	return useQuery<Trade[]>(
		["tradesData", profileId],
		async () => {
			const headers = new Headers();
			headers.append("Content-Type", "application/json");
			headers.append("Authorization", `Bearer ${store.token}`);

			const tradeRequest = await refreshedFetch(
				`${apiUrl}/trades/history/${profileId}`,
				{
					headers,
				}
			);

			const data = await tradeRequest.json();
			return data.payload;
		},
		{
			refetchOnWindowFocus: false,
			enabled: !!profileId,
		}
	);
};

export default useTrades;
