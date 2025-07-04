import getConfig from "next/config";
import { useMutation, useQuery } from "react-query";
import { useFactiivStore } from "../store";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import Profile from "../types/profile.interface";

const useProfile = (
	options: { fetchSurvey?: boolean } = { fetchSurvey: false }
) => {
	const { fetchSurvey } = options;
	const store = useFactiivStore();
	const { activeProfile, token } = store;

	const { refreshedFetch } = useAuthenticatedFetch();

	//Fetch Business Profile data
	const fetchProfileData = async (profileId: string) => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();

		const response = await refreshedFetch(`${apiUrl}/profiles`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			return activeProfile;
		}

		const data = await response.json();
		const profile = data.payload.find(
			(profile: Profile) => profile.id === profileId
		);

		return profile;
	};

	// fetch additional profile data when the profile changes
	const additionalProfileDataMutation = useMutation({
		mutationKey: ["additionalProfileData", activeProfile?.id],
		mutationFn: async (profileId: string) => {
			const {
				publicRuntimeConfig: { apiUrl },
			} = getConfig();

			const headers = new Headers();
			headers.append("Content-Type", "application/json");
			headers.append("Authorization", `Bearer ${store.token}`);

			try {
				const response = await refreshedFetch(
					`${apiUrl}/profiles/survey/${profileId}`,
					{
						headers,
					}
				);

				const { errors, payload: additionalInfo } = await response.json();

				if (!response.ok) {
					const errorMessage = (errors as string[])?.join?.("\n");
					throw new Error(
						errorMessage ||
							"There was an error fetching additional profile data."
					);
				}

				store.updateActiveProfileInfo(additionalInfo);
			} catch (error) {
				console.log(error);
			}
		},
	});

	const { refetch } = useQuery(
		["activeProfile", activeProfile?.id],
		async () => {
			const updatedProfile = await fetchProfileData(activeProfile.id);
			store.updateActiveProfile(updatedProfile);

			if (fetchSurvey && activeProfile?.id) {
				additionalProfileDataMutation.mutate(activeProfile.id);
				return;
			}
		},
		{
			refetchOnWindowFocus: false,
			enabled: !!activeProfile?.id,
		}
	);

	return { refetch };
};

export default useProfile;
