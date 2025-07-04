import { FormikConfig, FormikFormProps } from "formik";
import getConfig from "next/config";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useFactiivStore } from "../../store";
import Profile from "../../types/profile.interface";
import ClickOutsideWrapper from "../click-outside";
import LoadingOverlay from "../loading-overlay";
import { useDebounce } from "react-use";
import PlaceholderPic from "../../public/images/placeholder.png";

interface SearchConnectionProps {
	form?: any;
	title?: string;
	linkHref?: string;
	linkLabel?: JSX.Element;
	className?: string;
	onSelectResult?: (profile: Profile | undefined) => void;
	clearSelection?: boolean;
	value?: Profile | Partial<Profile>;
	searchTrades?: boolean;
}

const SearchConnections = ({
	form,
	title,
	linkHref,
	linkLabel,
	className,
	onSelectResult,
	clearSelection,
	value,
	searchTrades,
}: SearchConnectionProps) => {
	const store = useFactiivStore();
	const { refreshedFetch } = useAuthenticatedFetch();
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();

	const [search, setSearch] = useState<string>("");
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
	const [debouncedValue, setDebouncedValue] = useState("");
	const [searchError, setSearchError] = useState("");

	const emailRegex =
		// eslint-disable-next-line no-control-regex
		/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi;

	const { data: connectionList } = useQuery<Profile[]>(
		["searchConnections", { debouncedValue }],
		async () => {
			if (!debouncedValue) {
				setIsLoading(false);
				return;
			}

			const isEmail = emailRegex.test(debouncedValue);

			if (!isEmail) {
				setIsLoading(false);
				return;
			}

			const body = JSON.stringify({
				...(isEmail ? { email: debouncedValue } : { name: debouncedValue }),
				// email: debouncedValue,
			});
			const { activeProfile } = store;

			try {
				console.log("profiles/search 2");
				const response = await refreshedFetch(
					`${apiUrl}/profiles/search/${activeProfile.id}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${store.token}`,
						},
						body,
					}
				);

				const data = await response.json();

				if (!response.ok) {
					setIsLoading(false);
					throw new Error(data.errors.join("\n"));
				}

				setIsLoading(false);
				setShowResults(!!data.payload.length);
				return data.payload;
			} catch (error: unknown) {
				setIsOpen(false);
				setIsLoading(false);
				const errorMessage = (error as Error)?.message;
				setSearchError(
					errorMessage ?? "There was an error during search, please try again."
				);
				return [];
			}
		},
		{
			refetchOnWindowFocus: false,
		}
	);

	const handleSearch = async () => {
		setSearchError("");
		setDebouncedValue(search);
	};

	useDebounce(
		() => {
			handleSearch();
		},
		500,
		[search]
	);

	useEffect(() => {
		handleSelection(value as Profile);
	}, [value]);

	const handleSelection = (selectedProfile: Profile | undefined) => {
		if (!selectedProfile) return;
		const { businessName } = selectedProfile;

		setSelectedProfile(selectedProfile);
		onSelectResult?.(selectedProfile);
		setSearch(() => businessName);
	};

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(() => event.target.value);
		setSelectedProfile(null);
		onSelectResult?.(undefined);
	};

	const [showResults, setShowResults] = useState(false);
	const [showInfoMessage, setShowInfoMessage] = useState(false);
	useEffect(() => {
		setIsOpen(showInfoMessage);
		setShowResults(!!connectionList?.length);
		setTimeout(() => {
			setIsOpen(false);
		}, 4000);
	}, [showInfoMessage, debouncedValue]);

	return (
		<div className={` ${className} `}>
			{/* {isLoading && <LoadingOverlay />} */}
			{title && (
				<p className="mb-1 text-sm font-medium text-gray-500">{title}</p>
			)}
			<div className="relative mt-1">
				<div className="relative w-full cursor-default overflow-hidden rounded-lg bg-pearl text-left border-2 border-onyx focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
					<input
						placeholder="search by email (example@email.com)"
						className="w-full border-none py-4 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
						type="text"
						aria-expanded="false"
						onChange={handleOnChange}
						value={search}
						onClick={() => setShowInfoMessage(true)}
						onFocus={() => setShowInfoMessage(true)}
						onBlur={() => setShowInfoMessage(false)}
					/>
				</div>
				{searchError?.split("\n").map((error) => (
					<p key={error} className="text-red-500 mt-2 ">
						{error}
					</p>
				))}
				<ClickOutsideWrapper
					show={showResults && !!connectionList?.length}
					clickOutsideHandler={() => {
						setShowResults(false);
					}}
				>
					{isOpen && (!connectionList || connectionList?.length === 0) && (
						<div className="absolute z-[5] mt-1 max-h-60 w-full overflow-auto rounded-md bg-pearl border-2 border-onyx py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-fade-in">
							<p className="relative cursor-default select-none py-2 pl-4 pr-4 cursor-pointer ">
								Please enter the correct email address for another profile.
								(example@email.com){" "}
							</p>
						</div>
					)}
					{showResults && connectionList && !searchTrades ? (
						<ul className="absolute z-[5] mt-1 max-h-60 w-full overflow-auto rounded-md bg-pearl border-2 border-onyx py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-fade-in">
							{connectionList?.length === 0 && (
								<li className="p-3 px-6 flex justify-content items-center">
									<p>No results</p>
								</li>
							)}

							{connectionList?.map((connection: Profile) => {
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
										{imagePath && (
											<span className="absolute inset-y-0 left-0 flex items-center pl-3">
												<img
													className="h-8 w-8 rounded-full border-2 border-onyx"
													src={imagePath}
													alt="connection image"
												/>
											</span>
										)}
										{!imagePath && (
											<span className="absolute inset-y-0 left-0 flex items-center pl-3">
												<img
													className="h-8 w-8 rounded-full border-2 border-onyx"
													src={PlaceholderPic.src}
													alt="connection image"
												/>
											</span>
										)}
									</li>
								);
							})}
						</ul>
					) : null}
				</ClickOutsideWrapper>
			</div>
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

export default SearchConnections;
