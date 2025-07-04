import dynamic from "next/dynamic";
import Head from "next/head";
import { preferencesData } from "../../constants/preferences.constant";
import { useState } from "react";
import Link from "next/link";
import getConfig from "next/config";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useFactiivStore } from "../../store";
import { useQuery } from "react-query";
import { enqueueSnackbar } from "notistack";
import LoadingOverlay from "./../../components/loading-overlay/index";

const Preferences = () => {
	const { refreshedFetch } = useAuthenticatedFetch();
	const store = useFactiivStore();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();
	const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
	const [dataFetched, setDataFetched] = useState(false);
	const [isPreferencesSaving, setIsPreferencesSaving] = useState(false);
	const [isInfoUpdated, setInfoUpdated] = useState<boolean>(false);

	const handleAllSubscribeOrUnsubscribe = (
		type: "subscribe" | "unsubscribe"
	) => {
		if (type === "unsubscribe") {
			setSelectedItems([]);
		} else {
			const allItems = preferencesData.flatMap((obj) =>
				obj.items.map((item) => item.key)
			);
			setSelectedItems(allItems);
		}
		setInfoUpdated(true);
	};


	const handleSave = async() => {
		// console.log("Data saved");
		setIsPreferencesSaving(true);
		const allItems = preferencesData.flatMap((obj) =>
			obj.items.map((item) => item.key)
		);
		const jsonData:any = {};
		allItems.forEach(key => {
			jsonData[key] = selectedItems.includes(key);
		});

		const response = await fetch(`${apiUrl}/users/preferences`, {
			method: "PUT",
			body: JSON.stringify(jsonData),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${store.token}`,
			},
		});

		if (!response.ok) {
			console.log(`HTTP error! status: ${response.status}`);
			enqueueSnackbar(`HTTP error! status: ${response.status}`, {variant: "error"});
			setIsPreferencesSaving(false);
		} else {
			const data = await response.json();
			// console.log(data.payload);
			enqueueSnackbar("Preferences saved successfully", {variant: "success"});
			setIsPreferencesSaving(false);
			setInfoUpdated(false);
		}
	};

	const handleSelectItem = (isChecked: boolean, key: string) => {
		setInfoUpdated(true);
		let currentItems;
		if (isChecked) {
			currentItems = [...selectedItems, key];
		} else {
			currentItems = selectedItems.filter((item) => item !== key);
		}
		setSelectedItems(currentItems);
	};

	//Fetch user preference
	const fetchPreference = async () => {
		setDataFetched(false);
		const response = await refreshedFetch(`${apiUrl}/users/preferences`, {
			headers: {
				Authorization: `Bearer ${store.token}`,
			},
		});
		const data = await response.json();
		return data.payload;
	};

	// useEffect(() => {

	// }, [store.token]);

	const query = useQuery({
		queryKey: ["preferenceData"],
		queryFn: fetchPreference,
		onSuccess: (dataResponse) => {
			if (dataResponse) {
				// console.log("dataResponse", dataResponse);

				const keys = Object.keys(dataResponse);
				const tempSelected:string[] = [];
				keys.forEach((key) => {
					if(typeof dataResponse[key] == "boolean" && dataResponse[key]) {
						tempSelected.push(key);
					}
				});
				setSelectedItems(tempSelected);
				setDataFetched(true);
			}
		},
		enabled: !dataFetched
	});

	return (
		<div>
			<Head>
				<title>Preferences | factiiv</title>
			</Head>

			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full">
				{(!dataFetched || isPreferencesSaving) && <LoadingOverlay className={"absolute"}></LoadingOverlay>}
				<div className="relative w-full flex justify-between astro-STBADDXX">
					<div className="p-2 xs:p-4 sm:p-6 lg:pl-[4.5rem] w-24 lg:w-64 astro-STBADDXX">
						{/* Logo */}
						<Link href={"/dashboard"}>
							<svg
								viewBox="0 0 156 72"
								className="h-16 flex-shrink-0 mx-auto text-onyx dark:text-pearl-shade"
							>
								<g className="text-onyx" stroke="currentColor">
									<path
										d="M33.025 10.452c-.221 4.7-3.012 10.209-7.712 11.385H3.058A2.067 2.067 0 0 1 1 19.927V2.886A1.993 1.993 0 0 1 2.983.9h23.358c4.04 0 6.977 4.117 6.684 9.552Z"
										fill="#efbc73"
										strokeWidth="1.5"
										vectorEffect="non-scaling-stroke"
									/>
									<path
										d="M64.974 3.289v15.823a2.41 2.41 0 0 1-2.39 2.717l-31.4.08a15.383 15.383 0 0 0 5.59-10.5c.51-4.48-.81-8.37-3.09-10.5h28.9a2.388 2.388 0 0 1 2.39 2.38Z"
										fill="#409af4"
										strokeWidth="1.5"
										vectorEffect="non-scaling-stroke"
									/>
									<path
										d="M14.075 35.938c-.514 4.481.735 8.374 3.085 10.5H2.985A1.993 1.993 0 0 1 1 44.46V27.419a2.067 2.067 0 0 1 2.057-2.057h16.527a15.956 15.956 0 0 0-5.509 10.576Z"
										fill="#efbc73"
										strokeWidth="1.5"
										vectorEffect="non-scaling-stroke"
									/>
									<path
										d="M49.55 27.824v16.225a2.4 2.4 0 0 1-2.395 2.394H24.21c-4.26 0-7.124-4.774-6.316-10.723s4.847-10.283 9.034-10.283h20.227a2.394 2.394 0 0 1 2.395 2.387Z"
										fill="#409af4"
										strokeWidth="1.5"
										vectorEffect="non-scaling-stroke"
									/>
									<rect
										x={1}
										y={50}
										width={20}
										height={20}
										rx={2}
										fill="#409af4"
										strokeWidth="1.5"
										vectorEffect="non-scaling-stroke"
									/>
								</g>
								<path
									className="hidden xs:block"
									d="M75.324 36.912v11.936h-4.107V36.912H68.65V33.35h2.567v-.834a5 5 0 0 1 5.23-5.39 6.591 6.591 0 0 1 2.952.641l-.834 2.888a2.5 2.5 0 0 0-1.316-.321c-1.155 0-1.925.77-1.925 2.246v.77h3.145v3.562Zm14.792 11.936v-1.6a6.41 6.41 0 0 1-4.909 1.99 5.163 5.163 0 0 1-5.39-5.134c0-3.626 2.92-4.941 5.39-4.941a6.264 6.264 0 0 1 4.909 1.893V38.9c0-1.572-1.347-2.6-3.4-2.6a6.523 6.523 0 0 0-4.524 1.829L80.651 35.4a10.164 10.164 0 0 1 6.77-2.439c3.53 0 6.77 1.412 6.77 5.872v10.015Zm0-5.648a4.075 4.075 0 0 0-3.272-1.347c-1.6 0-2.92.866-2.92 2.342 0 1.444 1.315 2.278 2.92 2.278a4.075 4.075 0 0 0 3.272-1.347Zm15.338-10.235a7.143 7.143 0 0 1 6.129 2.824l-2.663 2.47a3.832 3.832 0 0 0-3.273-1.668 4.141 4.141 0 0 0-4.2 4.492c0 2.7 1.732 4.524 4.2 4.524a3.911 3.911 0 0 0 3.273-1.669l2.663 2.471a7.143 7.143 0 0 1-6.129 2.824 7.869 7.869 0 0 1-8.214-8.15 7.861 7.861 0 0 1 8.214-8.118ZM115.049 45v-8.088h-2.567V33.35h2.567v-4.235h4.107v4.235h3.144v3.562h-3.144v6.995c0 .962.513 1.7 1.411 1.7a2.228 2.228 0 0 0 1.412-.449l.867 3.08a5.036 5.036 0 0 1-3.4.995c-2.857 0-4.397-1.476-4.397-4.233Zm9.626-16.366a2.439 2.439 0 1 1 2.438 2.438 2.458 2.458 0 0 1-2.438-2.438Zm.417 20.214V33.35h4.075v15.5Zm7.701-20.214a2.439 2.439 0 1 1 2.438 2.438 2.458 2.458 0 0 1-2.438-2.438Zm.417 20.214V33.35h4.074v15.5Zm12.128 0-6.224-15.5h4.364l4.042 10.781 4.043-10.781h4.4l-6.225 15.5Z"
									fill="currentColor"
								/>
							</svg>
						</Link>
					</div>
					<div className="xs:p-4 sm:p-6 astro-STBADDXX">
						<div>
							<Link
								href="/dashboard"
								className="text-topaz p-2 rounded hover:bg-pearl font-bold flex space-x-2 items-center"
							>
								<svg
									width={20}
									height={20}
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M5 12l14 0" vectorEffect="non-scaling-stroke" />
									<path d="M5 12l6 6" vectorEffect="non-scaling-stroke" />
									<path d="M5 12l6 -6" vectorEffect="non-scaling-stroke" />
								</svg>
								<span>back to factiiv</span>
							</Link>
						</div>
					</div>
				</div>
				<div className="h-full w-full max-w-6xl mx-auto astro-STBADDXX">
					<div className="w-full min-h-[calc(100vh_-_7rem)] animate-fade-in px-2 xs:px-4 sm:px-6 astro-STBADDXX">
						<div className=" pb-12 astro-STBADDXX">
							<main className="lg:px-6 w-full">
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
									{/* Heading */}
									<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
										manage your factiiv email preferences
									</h2>
									<div className="flex-none flex">
										<button
											id="btn"
											className="group grid w-full flex-none"
											onClick={() =>
												selectedItems.length > 0
													? handleAllSubscribeOrUnsubscribe("unsubscribe")
													: handleAllSubscribeOrUnsubscribe("subscribe")
											}
										>
											<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full" />
											<span className="bg-red-400 subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
												{selectedItems.length > 0
													? "unsubscribe all"
													: "subscribe all"}
											</span>
										</button>
									</div>
								</div>
								<div className="border-2 border-onyx rounded-md p-4 mt-6 bg-pearl">
									{preferencesData?.map((preference) => (
										<fieldset key={preference.id} className="mb-4">
											<legend className="font-medium mb-4">
												{preference.title}
											</legend>
											<div className="space-y-5 pl-4">
												{preference.items.map((item) => (
													<div
														key={item.key}
														className="relative flex items-start"
													>
														<div className="flex h-6 items-center">
															<input
																id={item.key}
																aria-describedby="trade-description"
																checked={selectedItems.includes(
																	item.key
																)}
																name={item.key}
																type="checkbox"
																className="w-6 h-6 rounded text-topaz border-2 border-onyx bg-pearl-shade checkbox"
																onChange={(e) =>
																	handleSelectItem(e.target.checked, item.key)
																}
															/>
														</div>
														<div className="ml-3 text-base leading-tight">
															<label
																htmlFor={item.key}
																className="font-medium text-gray-900"
															>
																{item.label}
															</label>
															<p
																id="trade-description"
																className="text-gray-500"
															>
																{item.description}
															</p>
														</div>
													</div>
												))}
											</div>
										</fieldset>
									))}
								</div>
								<button
									id="btn"
									disabled={isPreferencesSaving || !isInfoUpdated}
									className={"group grid w-1/2 mx-auto mt-4 flex-none" + ((isPreferencesSaving || !isInfoUpdated) ? " opacity-50" : "")}
									onClick={handleSave}
								>
									<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full" />
									<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
										save
									</span>
								</button>
							</main>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default dynamic(() => Promise.resolve(Preferences), { ssr: false });
