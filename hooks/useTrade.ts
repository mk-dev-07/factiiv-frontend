import getConfig from "next/config";
import { useQuery } from "react-query";
import { useFactiivStore } from "../store";
import { Trade } from "../types/trade.interface";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";

const useTrade = (
	[tradeId, activityId]: [tradeId: string, activityId?: string],
	callback?: (trade: Trade) => void
) => {
	const store = useFactiivStore();
	const { refreshedFetch } = useAuthenticatedFetch();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const result = useQuery<Trade>(
		["tradeData", [tradeId, activityId || ""]],
		async () => {
			const headers = new Headers();
			headers.append("Content-Type", "application/json");
			headers.append("Authorization", `Bearer ${store.token}`);

			const tradeRequest = await refreshedFetch(`${apiUrl}/trades/${tradeId}`, {
				headers,
			});

			const data = await tradeRequest.json();
			const trade = data.payload;

			callback?.(trade);

			return trade;
		},
		{
			enabled: !!tradeId,
		}
	);

	return result;
};

export default useTrade;
