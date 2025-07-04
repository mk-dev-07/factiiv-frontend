import React, { useEffect } from "react";
import SearchSvg from "../../svgs/SearchSvg";

const AdminSearch = ({
	placeholderValue,
	searchValue,
	setSearchValue,
	handleSearch,
}: {
	placeholderValue: string;
	searchValue: string;
	setSearchValue: React.Dispatch<React.SetStateAction<string>>;
	handleSearch: (searchValue: string) => void;
}) => {
	// Search trade when Enter is pressed
	useEffect(() => {
		const keyDownHandler = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleSearch(searchValue);
			}
		};
		document.addEventListener("keydown", keyDownHandler);
		return () => {
			document.removeEventListener("keydown", keyDownHandler);
		};
	});

	return (
		<div className="flex items-stretch space-x-4">
			<input
				value={searchValue}
				onChange={(e) => {
					setSearchValue(e.target.value);
					handleSearch?.(e.target.value);
				}}
				placeholder={placeholderValue}
				className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm h-12"
			/>
			<button
				id="admin-submit-search"
				onClick={()=> handleSearch(searchValue)}
				className="bg-topaz flex-none subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm h-12 xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2"
			>
				<SearchSvg />
			</button>
		</div>
	);
};

export default AdminSearch;
