import { useQuery } from "react-query";
import { useFactiivStore } from "../store";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import getConfig from "next/config";
import { NotificationResponse } from "../types/notification.interface";
import { isValid } from "date-fns";

const useNotifications = () => {
	const store = useFactiivStore();
	const { refreshedFetch } = useAuthenticatedFetch();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const { activeProfile, token } = store;

	return useQuery(
		["notifications", activeProfile?.id],
		async () => {
			try {
				if (!activeProfile.id) {
					throw Error("no profile id");
				}

				const headers = new Headers();
				headers.append("Authorization", `Bearer ${token}`);
				const notificationResponse = await refreshedFetch(
					`${apiUrl}/notifications/${activeProfile.id}`,
					{
						headers,
					}
				);

				if (!notificationResponse.ok) {
					const data =
						((await notificationResponse?.json()) as { errors: string[] }) ??
						"";
					[];
					throw Error(
						data?.errors?.join("\n") ??
							"There was an issue with fetching the notifications"
					);
				}

				const {
					payload: { content },
				}: NotificationResponse = await notificationResponse.json();
				return {
					notifications:
						content?.sort(
							({ createdAt: aCreatedAt }, { createdAt: bCreatedAt }) => {
								const aDate = new Date(aCreatedAt);
								const bDate = new Date(bCreatedAt);
								if (!isValid(aDate)) return -1;
								if (!isValid(bDate)) return 1;

								return bDate.getTime() - aDate.getTime();
							}
						) ?? [],
					total: content?.length ?? 0,
				};
			} catch (error) {
				console.log(error);
				return { notifications: [], total: 0 };
			}
		},
		{ enabled: !!activeProfile?.id }
	);
};

export default useNotifications;
