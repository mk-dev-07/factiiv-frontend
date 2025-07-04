import Head from "next/head";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
//SVGs
import { LoadingSvg } from "../../components/svgs/LoadingSvg";
import useProtected from "../../hooks/useProtected";
import { useQuery } from "react-query";
import { IUser } from "../../types/user.interface";
import getConfig from "next/config";
import { useFactiivStore } from "../../store";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { LogoSvg } from "../../components/svgs/LogoSvg";

const Verifying = () => {
	useProtected();
	const router = useRouter();
	const { user, token, updateUser } = useFactiivStore();
	const { refreshedFetch } = useAuthenticatedFetch();

	const getUser = async (): Promise<IUser> => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();

		let userData;

		try {
			const createUserResponse = await refreshedFetch(`${apiUrl}/users`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			userData = await createUserResponse.json();
			if (!userData?.payload) {
				throw new Error("Failed to login/register user");
			}

			updateUser(userData.payload);
		} catch (error) {
			console.error(error);
			throw new Error("Failed to login/register user");
		}

		return userData.payload;
	};

	const { refetch, data: userData } = useQuery(["user", user], getUser, {
		enabled: !!user,
		onSuccess: () => {
			// router.push("/verification-complete");

			router.replace("/account-created");
		},
	});

	useEffect(() => {
		refetch();
	}, []);

	return (
		<div className="min-h-[100vh] bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>Verifying | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full px-4 astro-LIXB6EQA">
				<div className="py-6 sm:px-6 lg:px-8 font-prox astro-LIXB6EQA">
					<div className="sm:mx-auto sm:w-full sm:max-w-md mt-12 md:mt-24 lg:mt-32 astro-LIXB6EQA">
						<div className="mx-auto astro-LIXB6EQA">
							<LogoSvg />
						</div>
						<h2 className="mt-6 text-center font-medium text-xl lg:text-2xl astro-LIXB6EQA">
							verifying code
						</h2>
					</div>

					<div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md astro-LIXB6EQA">
						<div className="bg-pearl dark:bg-onyx-light py-8 px-4 border-2 border-onyx rounded-lg sm:px-10 astro-LIXB6EQA">
							<div>
								<p className="text-center">this should only take a moment</p>
								<LoadingSvg />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Verifying;
