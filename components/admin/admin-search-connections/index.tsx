import { FormikConfig } from "formik";
import getConfig from "next/config";
import Link from "next/link";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useAdminStore } from "../../../store";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { useFactiivStore } from "../../../store";
import Profile from "../../../types/profile.interface";
import ClickOutsideWrapper from "../../click-outside";
import LoadingOverlay from "../../loading-overlay";
import { AdminSearchType } from "../../../types/adminSearch.interface";
import Image from "next/image";
import PlaceholderImage from "../../../public/images/placeholder.png";

const AdminSearchConnections = ({
	form,
	fieldName,
	title,
	linkHref,
	linkLabel,
	className,
	onSelectResult,
	showErrorState = false,
	clearSelection,
	value,
	searchTrades,
	excludeProfiles = [],
}: {
	form?: any;
	fieldName?: string;
	title?: string;
	linkHref?: string;
	linkLabel?: string;
	className?: string;
	onSelectResult: (profile: Profile | null) => void;
	showErrorState: boolean;
	clearSelection?: string;
	value?: Partial<Profile>;
	searchTrades?: boolean;
	excludeProfiles?: Partial<Profile>[];
}) => {
	// TODO: Refactor to be used on admin side as well
	// maybe best option is to make admin-search-connections
	const store = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();

	const [search, setSearch] = useState<string>("");
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
	const [debouncedValue, setDebouncedValue] = useState("");

	const emailRegex =
	// eslint-disable-next-line no-control-regex
	/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;

	const { data: connectionList, isLoading } = useQuery<Profile[]>(
		["adminSearchConnections", { debouncedValue }],
		async () => {
			if (!debouncedValue) {
				return;
			}

			const isEmail = emailRegex.test(debouncedValue);

			const body = JSON.stringify({
				type: AdminSearchType.PROFILE,
				...(isEmail ? { email: debouncedValue } : { name: debouncedValue }),
			});

			const data = await refreshedFetch(`${apiUrl}/admins/search`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${store.token}`,
				},
				body,
			});

			const connections = await data.json();
			if (Array.isArray(connections.payload)) {
				return connections.payload;
			} else if (Array.isArray(connections?.payload?.content)) {
			 	return connections.payload.content;
			} else {
				return [connections.payload];
			}
		},
		{ refetchOnWindowFocus: false }
	);

	const handleSearch = async () => {
		await delay(500);
		setDebouncedValue(search);

		if (!clearSelection || !!search) return;

		setSelectedProfile(null);
		onSelectResult(null);
		setIsOpen(false);
	};

	useEffect(() => {
		handleSearch();
	}, [search]);

	useEffect(() => {
		handleSelection(value as Profile);
	}, [value]);

	const delay = (delay: number) => new Promise((res) => setTimeout(res, delay));

	const handleSelection = (selectedProfile: Profile) => {
		if (!selectedProfile) return;
		const { businessName } = selectedProfile;

		setSelectedProfile(selectedProfile);
		onSelectResult(selectedProfile);
		setSearch(() => businessName);
		setIsOpen(false);
	};

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(() => event.target.value);
		setIsOpen(true);
	};

	const filteredConnectionList = useMemo(() => {
		return (connectionList ?? []).filter(
			(connection) =>
				!excludeProfiles.map((ep) => ep.id).includes(connection.id)
		);
	}, [connectionList]);

	return (
		<div className={className}>
			{/* {isLoading && <LoadingOverlay />} */}
			{title && (
				<p className="mb-1 text-sm font-medium text-gray-500">{title}</p>
			)}
			<div className="relative mt-1">
				<div className="relative w-full cursor-default overflow-hidden rounded-lg bg-pearl text-left border-2 border-onyx focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
					<input
						placeholder="search by connection name or email"
						className="w-full border-none py-4 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
						type="text"
						aria-expanded="false"
						onChange={handleOnChange}
						value={search}
					/>
				</div>
				<ClickOutsideWrapper
					className="absolute w-full h-full top-0 left-0 rounded-lg"
					show={isOpen}
					clickOutsideHandler={() => {
						setIsOpen(false);
					}}
				>
					{!isLoading &&
					isOpen &&
					!!connectionList?.length &&
					search &&
					!searchTrades ? (
							<ul className="absolute z-[5] mt-1 max-h-60 w-full overflow-auto rounded-md bg-pearl border-2 border-onyx py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-fade-in">
								{filteredConnectionList.length === 0 && (
									<li className="p-3 px-6 flex justify-content items-center">
										<p>No results</p>
									</li>
								)}
								{filteredConnectionList?.map((connection: Profile) => {
									const { businessName, city, state, imagePath, id } = connection;

									return (
										<li
											className={
												"relative cursor-default select-none py-2 pl-14 pr-4 cursor-pointer " +
											(selectedProfile?.id === id
												? "text-white bg-topaz"
												: "text-onyx hover:bg-gold-lighter ")
											}
											tabIndex={-1}
											role="option"
											aria-selected="true"
											onClick={() => handleSelection(connection)}
											data-id={id}
											key={id}
										>
											<span className="flex flex-col">
												<span className="block truncate font-medium">
													{businessName}
												</span>
												<span className="block truncate font-medium text-xs">
													{city}, {state}
												</span>
											</span>
											<span className="absolute inset-y-0 left-0 flex items-center pl-3">
												<img
													className="w-8 h-8 object-cover rounded-full border-2 border-onyx"
													src={
														imagePath
															? imagePath
															: PlaceholderImage.src
													}
													alt="Account pic"
												/>
											</span>
										</li>
									);
								})}
							</ul>
						) : null}
				</ClickOutsideWrapper>
			</div>
			{form &&
			fieldName &&
			form?.touched?.[fieldName] &&
			form.errors?.[fieldName] ? (
					<div className="text-red-500">{<>{form?.errors?.[fieldName]}</>}</div>
				) : null}
			{linkHref ? (
				<Link
					href={linkHref}
					className="font-medium py-1 text-sm inline-block rounded text-topaz hover:text-onyx focus:text-onyx"
				>
					{linkLabel}
				</Link>
			) : null}
		</div>
	);
};

export default AdminSearchConnections;
