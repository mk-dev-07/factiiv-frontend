import React, { useEffect, useState } from "react";
import AdminAccountCard from "../admin-account-card";
import BusinessListingsCard from "../admin-business-listings-card";
import AdminSearch from "../admin-search";
import AdminTradesCard from "../admin-trades-card";

interface IDataManagementMain {
	placeholderValue: string;
	searchValue: string;
	setSearchValue: React.Dispatch<React.SetStateAction<string>>;
	handleSearch: () => void;
	mainData: any;
	handleSelect: (id: string) => void;
	accounts?: boolean;
	businesses?: boolean;
	trades?: boolean;
	activity?: boolean;
	numberOf?: number;
}

const DataManagementMain = ({
	placeholderValue,
	searchValue,
	setSearchValue,
	handleSearch,
	mainData,
	handleSelect,
	accounts,
	businesses,
	trades,
	activity,
	numberOf,
}: IDataManagementMain) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const totalPages = Math.ceil(mainData.length / itemsPerPage);
	const [itemsForPage, setItemsForPage] = useState<any>([]);

	useEffect(() => {
		setItemsForPage(() => {
			const startIndex = (currentPage - 1) * itemsPerPage;
			const endIndex = startIndex + itemsPerPage;
			return mainData.slice(startIndex, endIndex);
		});
	}, [mainData, currentPage]);

	const handlePrevious = () => {
		setCurrentPage(currentPage - 1);
	};

	const handleNext = () => {
		setCurrentPage(currentPage + 1);
	};
	return (
		<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
			<div className=" pb-12">
				<main className="lg:px-6 w-full">
					<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
						{accounts && "accounts"}
						{businesses && "businesses"}
						{trades && "trades"}
						{activity && "activity"}
						{numberOf && ` ${numberOf}`}
					</h2>
					<AdminSearch
						placeholderValue={placeholderValue}
						searchValue={searchValue}
						setSearchValue={setSearchValue}
						handleSearch={handleSearch}
					/>
					<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
						<ul role="list" className="divide-y-2 divide-onyx">
							{itemsForPage.map((item: any) => {
								return (
									<li
										key={item.id}
										onClick={() => handleSelect(item.id)}
										className="cursor-pointer"
									>
										{accounts && (
											<AdminAccountCard
												name={
													item.firstName !== ""
														? `${item.firstName} ${item.lastName}`
														: item.email
												}
												email={item.email}
												joinedOn={item.createdAt}
												numberOfBusinesses={item.profiles.length}
												imagePath={item.imagePath}
											/>
										)}
										{businesses && (
											<BusinessListingsCard
												key={item.id ? item.id : "no id"}
												businessName={
													item.businessName
														? item.businessName
														: "no business name"
												}
												businessOwner={
													item.ownerName && item.ownerName !== ""
														? item.ownerName
														: "no owner name"
												}
												createdAt={
													item.dateCreated ? item.dateCreated : "date uknown"
												}
												tradesNumber={item.myTrades ? item.myTrades.length : 0}
												profileImgURL={
													"https://ui-avatars.com/api/?name=King+Padberg"
												}
											/>
										)}
										{trades && (
											<AdminTradesCard
												tradeId={item.id}
												reportingBusiness={item.fromCompanyName}
												receivingBusiness={item.toCompanyName}
												balance={`$${parseInt(item.balance)}`}
												total={`$${parseInt(item.amount)}`}
												type={item.typeDesc}
												status={item.status}
											/>
										)}
										{activity && (
											<AdminTradesCard
												activityCard
												tradeId={item.tradeId}
												reportingBusiness={item.reportingBusiness}
												receivingBusiness={item.receivingBusiness}
												date={item.activityDate}
												type={item.activityType}
											/>
										)}
									</li>
								);
							})}
							{searchValue !== "" && mainData.length === 0 && (
								<h1 className="p-6">No matches found...</h1>
							)}
						</ul>
					</div>
					<div className="mt-4">
						<nav
							className="flex items-center justify-between px-4 py-3 sm:px-6"
							aria-label="Pagination"
						>
							<div className="hidden sm:block">
								<p className="text-sm text-gray-700">
									showing
									<span className="font-medium">
										{" "}
										{(currentPage - 1) * itemsPerPage + 1}
									</span>{" "}
									to
									<span className="font-medium">
										{" "}
										{(currentPage - 1) * itemsPerPage + itemsPerPage <
										mainData.length
											? (currentPage - 1) * itemsPerPage + itemsPerPage
											: mainData.length}
									</span>{" "}
									of
									<span className="font-medium"> {mainData.length}</span> items
								</p>
							</div>
							<div className="flex flex-1 justify-between sm:justify-end">
								<button
									id="pagination-previous"
									onClick={handlePrevious}
									disabled={currentPage === 1}
									className={`${
										currentPage === 1 && "cursor-not-allowed"
									} relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
								>
									previous
								</button>
								<button
									id="pagination-next"
									onClick={handleNext}
									disabled={currentPage === totalPages}
									className={`${
										currentPage === totalPages && "cursor-not-allowed"
									} relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
								>
									next
								</button>
							</div>
						</nav>
					</div>
				</main>
			</div>
		</div>
	);
};

export default DataManagementMain;
