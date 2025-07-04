/* eslint-disable linebreak-style */
"use client";

import React, { useState, useMemo } from "react";
import AdminCategoryModal from "../../../components/admin/admin-category-modal";
import { setTimeout } from "timers";
import Link from "next/link";
import blogData from "../../../data/blogData.js";

interface SortedCategory {
	category_name: string;
	order: number;
}

const AllBlogsTable = () => {
	const [data, setData] = useState(blogData);
	const [dateRange, setDateRange] = useState<{
		startDate: Date | null;
		endDate: Date | null;
		key: string;
	}>({
		startDate: null,
		endDate: null,
		key: "selection",
	});
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [tempDateRange, setTempDateRange] = useState<{
		startDate: Date | null;
		endDate: Date | null;
		key: string;
	}>({
		startDate: null,
		endDate: null,
		key: "selection",
	});

	const [searchTerm, setSearchTerm] = useState("");
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const orderedCategories = categories;
	const [sortedCategories, setSortedCategories] = useState<SortedCategory[]>(
		[]
	);

	// Pagination states
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);

	// Filter data based on selected filters
	const filteredData = useMemo(() => {
		return data.filter((blog) => {
			// Date range filter
			const blogDate = new Date(blog.created_at);
			const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
			const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

			const dateMatch =
				(!start || blogDate >= start) && (!end || blogDate <= end);

			// Category filter
			const categoryMatch =
				!selectedCategory || blog.categories.includes(selectedCategory);

			// Search filter
			const searchMatch =
				searchTerm === "" ||
				blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				blog.author.name.toLowerCase().includes(searchTerm.toLowerCase());

			return dateMatch && categoryMatch && searchMatch;
		});
	}, [dateRange.startDate, dateRange.endDate, selectedCategory, searchTerm]);

	// Pagination calculations
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentData = filteredData.slice(startIndex, endIndex);

	// Handle category filter change
	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(e.target.value);
		setCurrentPage(1); // Reset to first page
	};

	// Clear all filters
	const clearFilters = () => {
		setDateRange({
			startDate: null,
			endDate: null,
			key: "selection",
		});
		setSelectedCategory("");
		setSearchTerm("");
		setCurrentPage(1);
	};

	// Date range utility functions
	const formatDate = (date: Date | null | undefined): string => {
		if (!date) return "";
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const getDateRangeText = () => {
		if (!dateRange.startDate && !dateRange.endDate) {
			return "Select date range";
		}
		if (dateRange.startDate && dateRange.endDate) {
			return `${formatDate(dateRange.startDate)} - ${formatDate(
				dateRange.endDate
			)}`;
		}
		if (dateRange.startDate) {
			return `From ${formatDate(dateRange.startDate)}`;
		}
		if (dateRange.endDate) {
			return `Until ${formatDate(dateRange.endDate)}`;
		}
		return "Select date range";
	};

	// Generate calendar days for date picker
	const generateCalendarDays = (
		year: number,
		month: number
	): (Date | null)[] => {
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days: (Date | null)[] = [];

		// Add empty cells for days before the first day of the month
		for (let i = 0; i < startingDayOfWeek; i++) {
			days.push(null);
		}

		// Add days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(new Date(year, month, day));
		}

		return days;
	};

	const getDateRangePresets = () => {
		const today = new Date();
		const startOfWeek = new Date(today);
		startOfWeek.setDate(today.getDate() - today.getDay());
		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(startOfWeek.getDate() + 6);

		const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

		const startOfYear = new Date(today.getFullYear(), 0, 1);
		const endOfYear = new Date(today.getFullYear(), 11, 31);

		// Last week
		const lastWeekStart = new Date(startOfWeek);
		lastWeekStart.setDate(startOfWeek.getDate() - 7);
		const lastWeekEnd = new Date(endOfWeek);
		lastWeekEnd.setDate(endOfWeek.getDate() - 7);

		// Last month
		const lastMonthStart = new Date(
			today.getFullYear(),
			today.getMonth() - 1,
			1
		);
		const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

		// Last year
		const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
		const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);

		return [
			{
				label: "Today",
				startDate: new Date(today),
				endDate: new Date(today),
			},
			{
				label: "This Week",
				startDate: startOfWeek,
				endDate: endOfWeek,
			},
			{
				label: "Last Week",
				startDate: lastWeekStart,
				endDate: lastWeekEnd,
			},
			{
				label: "This Month",
				startDate: startOfMonth,
				endDate: endOfMonth,
			},
			{
				label: "Last Month",
				startDate: lastMonthStart,
				endDate: lastMonthEnd,
			},
			{
				label: "This Year",
				startDate: startOfYear,
				endDate: endOfYear,
			},
			{
				label: "Last Year",
				startDate: lastYearStart,
				endDate: lastYearEnd,
			},
		];
	};

	const handlePresetClick = (preset: { startDate: Date; endDate: Date }) => {
		setTempDateRange({
			startDate: preset.startDate,
			endDate: preset.endDate,
			key: "selection",
		});
	};

	const handleDateClick = (date: Date) => {
		if (
			!tempDateRange.startDate ||
			(tempDateRange.startDate && tempDateRange.endDate)
		) {
			// Start new selection
			setTempDateRange({
				startDate: date,
				endDate: null,
				key: "selection",
			});
		} else if (tempDateRange.startDate && !tempDateRange.endDate) {
			// Complete the range
			if (date < tempDateRange.startDate) {
				setTempDateRange({
					startDate: date,
					endDate: tempDateRange.startDate,
					key: "selection",
				});
			} else {
				setTempDateRange({
					...tempDateRange,
					endDate: date,
				});
			}
		}
	};

	const handleDoneClick = () => {
		setDateRange(tempDateRange);
		setCurrentPage(1);
		setShowDatePicker(false);
	};

	const handleClearClick = () => {
		setTempDateRange({
			startDate: null,
			endDate: null,
			key: "selection",
		});
		setDateRange({ startDate: null, endDate: null, key: "selection" });
		setTimeout(() => {
			setShowDatePicker(false);
		}, 200);
	};

	const isPresetActive = (preset: {
		startDate: Date | string;
		endDate: Date | string;
	}) => {
		if (!tempDateRange.startDate || !tempDateRange.endDate) return false;

		// Compare dates by setting time to start of day for accurate comparison
		const presetStart = new Date(preset.startDate);
		presetStart.setHours(0, 0, 0, 0);
		const presetEnd = new Date(preset.endDate);
		presetEnd.setHours(0, 0, 0, 0);

		const rangeStart = new Date(tempDateRange.startDate);
		rangeStart.setHours(0, 0, 0, 0);
		const rangeEnd = new Date(tempDateRange.endDate);
		rangeEnd.setHours(0, 0, 0, 0);

		return (
			presetStart.getTime() === rangeStart.getTime() &&
			presetEnd.getTime() === rangeEnd.getTime()
		);
	};

	const isDateInRange = (date: Date) => {
		if (!tempDateRange.startDate) return false;
		if (!tempDateRange.endDate)
			return date.getTime() === tempDateRange.startDate.getTime();
		return date >= tempDateRange.startDate && date <= tempDateRange.endDate;
	};

	const isDateRangeStart = (date: Date) => {
		return (
			tempDateRange.startDate &&
			date.getTime() === tempDateRange.startDate.getTime()
		);
	};

	const isDateRangeEnd = (date: Date) => {
		return (
			tempDateRange.endDate &&
			date.getTime() === tempDateRange.endDate.getTime()
		);
	};

	// Toggle individual row selection
	const toggleRowSelection = (id: number) => {
		setSelectedRowIds((prev) =>
			prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
		);
	};

	// Toggle all rows on current page
	const toggleSelectAll = () => {
		const currentPageIds = currentData.map((blog) => blog.id);
		const areAllSelected = currentPageIds.every((id) =>
			selectedRowIds.includes(id)
		);

		if (areAllSelected) {
			setSelectedRowIds((prev) =>
				prev.filter((id) => !currentPageIds.includes(id))
			);
		} else {
			setSelectedRowIds((prev) => [...new Set([...prev, ...currentPageIds])]);
		}
	};

	// TODO: use this function to update blog status
	const handleStatusChange = (blog: any, newStatus: string) => {
		setData((prevData) =>
			prevData.map((item) =>
				item.id === blog.id ? { ...item, status: newStatus } : item
			)
		);
	};

	// TODO: use this function to update tag/category order in frontend
	const handleSaveCategoryOrder = async (newOrder: SortedCategory[]) => {
		// console.log("newOrder: ", newOrder); // getting the new order values, just send to DB
		const response = await fetch("/api/sorted-categories", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newOrder),
		});

		if (response.ok) {
			setSortedCategories(newOrder);
		}
	};

	// TODO: use this function to delete blogs
	const handleDeleteSelected = () => {
		const selectedIds = selectedRowIds;
		const updatedData = data.filter((blog) => !selectedIds.includes(blog.id));
		setData(updatedData);
		setSelectedRowIds([]);
	};

	return (
		<div
			className="pb-6 mx-auto max-w-7xl"
			onClick={(e) => {
				const target = e.target as Node;

				if (!(target instanceof Element)) return;

				if (!target.closest(".date-picker-container")) {
					setShowDatePicker(false);
				}
			}}
		>
			{/* Filters Section */}
			<div className="p-6 mb-10 bg-white border rounded-lg shadow-sm">
				<h2 className="mb-4 text-lg font-semibold text-gray-800">Filters</h2>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{/* Search Filter */}
					<div>
						<label className="block mb-2 text-sm font-medium text-gray-700">
							Search
						</label>
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setCurrentPage(1);
							}}
							placeholder="Search by title or author..."
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-topaz"
						/>
					</div>

					{/* Date Range Filter */}
					<div className="relative date-picker-container">
						<label className="block mb-2 text-sm font-medium text-gray-700">
							Date Range
						</label>
						<button
							onClick={() => setShowDatePicker(!showDatePicker)}
							className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-topaz"
						>
							{getDateRangeText()}
						</button>

						{showDatePicker && (
							<div className="absolute left-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg top-full">
								<div className="flex w-[480px]">
									{/* Preset Options */}
									<div className="p-4 border-r border-gray-200">
										<h3 className="mb-3 text-sm font-medium text-gray-700">
											Quick Select
										</h3>
										<div className="space-y-1">
											{getDateRangePresets().map((preset, index) => (
												<button
													key={index}
													onClick={() => handlePresetClick(preset)}
													className={`block w-full px-3 py-2 text-sm text-left rounded whitespace-nowrap ${
														isPresetActive(preset)
															? "bg-blue-100 text-blue-900 font-medium"
															: "text-gray-700 hover:bg-gray-100"
													}`}
												>
													{preset.label}
												</button>
											))}
										</div>
									</div>

									{/* Calendar */}
									<div className="p-4">
										<div className="flex items-center justify-between mb-4">
											<button
												onClick={() =>
													setCurrentMonth(
														new Date(
															currentMonth.getFullYear(),
															currentMonth.getMonth() - 1
														)
													)
												}
												className="p-1 rounded hover:bg-gray-100"
											>
												◀
											</button>
											<div className="font-medium">
												{currentMonth.toLocaleDateString("en-US", {
													month: "long",
													year: "numeric",
												})}
											</div>
											<button
												onClick={() =>
													setCurrentMonth(
														new Date(
															currentMonth.getFullYear(),
															currentMonth.getMonth() + 1
														)
													)
												}
												className="p-1 rounded hover:bg-gray-100"
											>
												▶
											</button>
										</div>

										<div className="grid grid-cols-7 gap-1 mb-2">
											{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
												<div
													key={day}
													className="p-2 text-xs font-medium text-center text-gray-500"
												>
													{day}
												</div>
											))}
										</div>

										<div className="grid grid-cols-7 gap-1">
											{generateCalendarDays(
												currentMonth.getFullYear(),
												currentMonth.getMonth()
											).map((date, index) => (
												<button
													key={index}
													onClick={() => date && handleDateClick(date)}
													disabled={!date}
													className={`p-2 text-sm rounded ${
														!date
															? "invisible"
															: isDateInRange(date)
															? isDateRangeStart(date) || isDateRangeEnd(date)
																? "bg-blue-600 text-white"
																: "bg-blue-100 text-blue-900"
															: "hover:bg-gray-100"
													}`}
												>
													{date?.getDate()}
												</button>
											))}
										</div>

										<div className="flex justify-between pt-3 mt-4 border-t">
											<button
												onClick={handleClearClick}
												className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100"
											>
												Clear
											</button>
											<button
												onClick={handleDoneClick}
												className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
											>
												Done
											</button>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Clear Filters Button */}
					<div className="flex items-end">
						<button
							onClick={clearFilters}
							className="w-full px-4 py-2 text-white transition-colors bg-gray-500 rounded-md hover:bg-gray-600"
						>
							Clear Filters
						</button>
					</div>
				</div>

				{/* Category Filters */}
				<div className="flex flex-col items-end justify-between w-full lg:flex-row">
					<div className="mt-4">
						<div className="w-[600px]">
							<label className="block mb-2 text-sm font-medium text-gray-700">
								Category
							</label>
							<select
								value={selectedCategory}
								onChange={handleCategoryChange}
								className="w-full px-3 max-h-[150px] overflow-y-auto py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-topaz"
							>
								<option value="">All Categories</option>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.name}>
										{cat.name}
									</option>
								))}
							</select>
						</div>
					</div>
					<div>
						<AdminCategoryModal
							categories={orderedCategories}
							currentSortedCategories={sortedCategories}
							onSave={handleSaveCategoryOrder}
						/>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="h-[30px]">
				{selectedRowIds.length > 0 && (
					<div className="flex items-center justify-start gap-x-2">
						<span className="text-sm text-gray-600">
							{selectedRowIds.length} item(s) selected
						</span>
						<button
							onClick={handleDeleteSelected}
							className="text-red-600 scale-110"
						>
							<svg
								stroke="currentColor"
								fill="currentColor"
								strokeWidth="0"
								viewBox="0 0 24 24"
								height="1em"
								width="1em"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path>
							</svg>
						</button>
					</div>
				)}
			</div>
			<div className="overflow-hidden bg-white border rounded-lg shadow-sm">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
									<input
										type="checkbox"
										checked={
											currentData.length > 0 &&
											currentData.every((blog) =>
												selectedRowIds.includes(blog.id)
											)
										}
										onChange={toggleSelectAll}
										className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-topaz"
									/>
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
									Thumbnail
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
									Title
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
									Categories
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
									Tag
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
									Author
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
									Publish Date
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
									Status
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
									Edit
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{currentData.length > 0 ? (
								currentData.map((blog, index) => {
									const rowIndex = startIndex + index + 1;
									return (
										<tr key={blog.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center justify-start gap-x-2">
													<input
														type="checkbox"
														checked={selectedRowIds.includes(blog.id)}
														onChange={() => toggleRowSelection(blog.id)}
														className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-topaz"
													/>
													<span>{rowIndex}</span>
												</div>
											</td>
											<td className="px-6 py-1 whitespace-nowrap">
												<img
													src={blog.feature_image.url}
													alt={blog.feature_image.alt_text}
													className="h-[35px] w-[70px] object-cover rounded-sm"
												/>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<p
													title={blog.title}
													className="text-sm max-w-[20ch] overflow-ellipsis truncate font-medium text-gray-900"
												>
													{blog.title}
												</p>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex flex-wrap gap-1">
													{blog.categories.map((category, index) => (
														<span
															key={index}
															className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
														>
															{category}
														</span>
													))}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex flex-wrap gap-1">
													{blog.tags.map((tag, index) => (
														<span
															key={index}
															className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
														>
															{tag}
														</span>
													))}
												</div>
											</td>
											<td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
												{blog.author.name}
											</td>
											<td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
												{new Date(blog.created_at).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<select
													value={blog.status}
													onChange={(e) =>
														handleStatusChange(blog, e.target.value)
													}
													className={`inline-flex min-w-[110px] cursor-pointer items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
														blog.status === "publish"
															? "bg-green-100 text-green-800"
															: "bg-yellow-100 text-yellow-800"
													}`}
												>
													<option value="published">Published</option>
													<option value="archived">Archived</option>
													<option value="draft">Draft</option>
												</select>
											</td>
											<td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
												<Link
													href={`/admin/edit-blog/${blog.id}`}
													className="flex items-center justify-start px-2 py-1 text-white rounded-md cursor-pointer bg-topaz gap-x-2"
												>
													<svg
														stroke="currentColor"
														fill="none"
														strokeWidth="2"
														viewBox="0 0 24 24"
														strokeLinecap="round"
														strokeLinejoin="round"
														height="1em"
														width="1em"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
														<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
													</svg>
													<span>Edit </span>
												</Link>
											</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-4 text-center text-gray-500"
									>
										No blogs found matching your filters.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between mt-6">
					<div className="flex items-center">
						<p className="text-sm text-gray-700">
							Page {currentPage} of {totalPages}
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
							className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<svg
								stroke="currentColor"
								fill="currentColor"
								strokeWidth="0"
								viewBox="0 0 512 512"
								height="1em"
								width="1em"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="48"
									d="M328 112 184 256l144 144"
								></path>
							</svg>
						</button>

						{/* Page numbers */}
						<div className="flex space-x-1">
							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								let pageNum: number;
								if (totalPages <= 5) {
									pageNum = i + 1;
								} else if (currentPage <= 3) {
									pageNum = i + 1;
								} else if (currentPage >= totalPages - 2) {
									pageNum = totalPages - 4 + i;
								} else {
									pageNum = currentPage - 2 + i;
								}

								return (
									<button
										key={pageNum}
										onClick={() => setCurrentPage(pageNum)}
										className={`px-3 py-0.5 text-sm border border-onyx font-medium rounded-sm ${
											currentPage === pageNum
												? "bg-topaz text-white"
												: "text-gray-500 bg-white hover:bg-gray-50"
										}`}
									>
										{pageNum}
									</button>
								);
							})}
						</div>

						<button
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
							className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<svg
								stroke="currentColor"
								fill="currentColor"
								strokeWidth="0"
								viewBox="0 0 512 512"
								height="1em"
								width="1em"
								xmlns="http://www.w3.org/2000/svg"
								className="rotate-180"
							>
								<path
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="48"
									d="M328 112 184 256l144 144"
								></path>
							</svg>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

const categories = [
	{
		id: 1,
		name: "Design",
		slug: "design",
		description:
			"Design is the art of arranging elements to create a visually appealing and user-friendly interface.",
	},
	{
		id: 2,
		name: "TypeScript",
		slug: "typescript",
		description:
			"TypeScript is a statically typed programming language that adds optional static typing to JavaScript.",
	},
	{
		id: 3,
		name: "React",
		slug: "react",
		description: "React is a JavaScript library for building user interfaces.",
	},
	{
		id: 4,
		name: "Next.js",
		slug: "nextjs",
		description:
			"Next.js is a framework for building server-rendered React applications.",
	},
	{
		id: 5,
		name: "Tailwind CSS",
		slug: "tailwindcss",
		description:
			"Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.",
	},
	{
		id: 6,
		name: "JavaScript",
		slug: "javascript",
		description:
			"JavaScript is a programming language used for web development.",
	},
	{
		id: 7,
		name: "Development",
		slug: "development",
		description:
			"Development refers to the process of creating and maintaining software applications.",
	},
];

export default AllBlogsTable;
