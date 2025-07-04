import getConfig from "next/config";
import { useQuery } from "react-query";
import { useFactiivStore } from "../store";
import Profile from "../types/profile.interface";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";

// TODO: replace businessName with profileId for the other trade participant
const useFindProfile = (
	{
		businessName,
		profileId,
	}: {
		businessName: string | undefined;
		profileId?: string | undefined;
	},
	onComplete?: () => void
) => {
	const { refreshedFetch } = useAuthenticatedFetch();
	const store = useFactiivStore();
	const { activeProfile } = store;
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();
	const result = useQuery<Profile>(
		["findProfile", profileId || businessName],
		async () => {
			const headers = new Headers();
			headers.append("Content-Type", "application/json");
			headers.append("Authorization", `Bearer ${store.token}`);

			let tradeProfileRequest;
			try {
				console.log("profiles/search 1");
				tradeProfileRequest = await refreshedFetch(
					`${apiUrl}/profiles/search/${activeProfile.id}`,
					{
						method: "POST",
						headers,
						body: JSON.stringify({
							...(profileId ? { id: profileId } : { name: businessName }),
						}),
					}
				);
				const tradeProfileData = await tradeProfileRequest.json();
				const profiles = tradeProfileData.payload;

				if (!profiles || profiles.length < 1) {
					throw new Error("The profile is missing for accepting trade");
				}

				// array of profiles returned when searching by businessName
				if (Array.isArray(profiles)) {
					return profiles[0];
				}

				// single profile returned when searching by id
				return profiles;
			} catch (error) {
				console.log(error);
				return {};
			}
		},
		{
			refetchOnWindowFocus: false,
			enabled: !!businessName || !!profileId,
			onSettled: () => onComplete?.(),
		}
	);

	return result;
};

export default useFindProfile;
