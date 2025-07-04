import { FormikConfig } from "formik";
import getConfig from "next/config";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useFactiivStore } from "../../store";
import Profile from "../../types/profile.interface";
import { Trade } from "../../types/trade.interface";
import ClickOutsideWrapper from "../click-outside";
import LoadingOverlay from "../loading-overlay";

const SearchTradelines = ({
	form,
	title,
	linkHref,
	linkLabel,
	className,
	onSelectResult,
	clearSelection,
	preselectedTrade,
	searchTrades,
	disabled = false,
	readOnly = false
}: any) => {
	const store = useFactiivStore();
	const { activeProfile } = store;
	const { refreshedFetch } = useAuthenticatedFetch();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const [search, setSearch] = useState<string>("");
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [enableSearch, setEnableSearch] = useState<boolean>(false);
	const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
	const [debouncedValue, setDebouncedValue] = useState("");

	const { data: tradelinesList, isLoading } = useQuery<Trade[]>(
		["searchTradelines", { debouncedValue }],
		async () => {
			if (!debouncedValue) {
				return;
			}

			const data = await refreshedFetch(
				`${apiUrl}/trades/history/${activeProfile.id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`,
					},
				}
			);

			const trades = await data.json();
			if (!Array.isArray(trades.payload)) {
				return [trades.payload];
			}

			return trades.payload;
		},
		{ refetchOnWindowFocus: false }
	);

	const handleSearch = async () => {
		await delay(500);
		setDebouncedValue(search);

		if (!clearSelection || !!search) return;

		setSelectedTrade(null);
		onSelectResult(null);
		setIsOpen(false);
	};

	useEffect(() => {
		if (!preselectedTrade || enableSearch) {
			handleSearch();
			return;
		}

		if (selectedTrade) {
			return;
		}

		const { fromProfileId } = preselectedTrade;
		handleSelection(preselectedTrade, fromProfileId === activeProfile.id);
	}, [search, preselectedTrade]);

	const delay = (delay: number) => new Promise((res) => setTimeout(res, delay));

	const handleSelection = (trade: Trade, isMyTrade: boolean) => {
		if (!trade) return;

		setEnableSearch(false);
		setSelectedTrade(trade);
		onSelectResult(trade);
		setSearch(
			() =>
				`${isMyTrade ? trade.toCompanyName : trade.fromCompanyName} - ${
					trade.relationshipId
				}`
		);
		setIsOpen(false);
	};

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(() => event.target.value);
		setEnableSearch(true);
		setIsOpen(true);
	};

	return (
		<div className={` ${className} `}>
			{/* {isLoading && <LoadingOverlay />} */}
			{title && (
				<p className="mb-1 text-sm font-medium text-gray-500">{title}</p>
			)}
			<div className="relative mt-1">
				<div className="relative w-full cursor-default overflow-hidden rounded-lg bg-pearl text-left border-2 border-onyx focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
					<input
						placeholder="search by connection name"
						className="w-full border-none py-4 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
						type="text"
						aria-expanded="false"
						onChange={handleOnChange}
						value={search}
						disabled={disabled}
						readOnly={readOnly}
					/>
				</div>
				<ClickOutsideWrapper
					show={isOpen}
					clickOutsideHandler={() => {
						setIsOpen(false);
					}}
				>
					{!isLoading &&
					isOpen &&
					!!tradelinesList?.length &&
					search &&
					!searchTrades ? (
							<ul className="absolute z-[5] mt-1 max-h-60 w-full overflow-auto rounded-md bg-pearl border-2 border-onyx py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-fade-in">
								{tradelinesList?.map((trade: Trade) => {
									const {
										id,
										fromProfileId,
										relationshipId,
										amount,
										balance,
										fromCompanyName,
										toCompanyName,
									} = trade;
									const isFromMyProfile = fromProfileId === activeProfile.id;

									return (
										<li
											className={
												"relative cursor-default select-none py-2 pl-14 pr-4 cursor-pointer " +
											(selectedTrade?.id === id
												? "text-white bg-topaz"
												: "text-onyx hover:bg-gold-lighter ")
											}
											tabIndex={-1}
											role="option"
											aria-selected="true"
											onClick={() => handleSelection(trade, isFromMyProfile)}
											data-id={id}
											key={id}
										>
											<span className="flex flex-col">
												<span className="block truncate font-medium">
													{isFromMyProfile ? toCompanyName : fromCompanyName} -{" "}
													{relationshipId}
												</span>
												<span className="block truncate font-medium text-xs">
												${balance} / ${amount}
												</span>
											</span>
											{/* {imagePath && (
											<span className="absolute inset-y-0 left-0 flex items-center pl-3">
												<img
													className="h-8 w-8 rounded-full border-2 border-onyx"
													src={imagePath}
													alt=""
												/>
											</span>
										)} */}
										</li>
									);
								})}
							</ul>
						) : null}
				</ClickOutsideWrapper>
			</div>
			{form?.touched?.connection && form.errors.connection ? (
				<div className="text-red-500">{<>{form.errors.connection}</>}</div>
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

export default SearchTradelines;
