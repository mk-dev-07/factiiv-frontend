/* eslint-disable linebreak-style */

import React, { useState } from "react";

interface Option {
	id: number;
	name: string;
	slug: string;
	description: string;
}

interface MultiSelectCheckboxProps {
	label: string;
	options: Option[];
	selectedValues: string[];
	onChange: (values: string[]) => void;
	onEdit?: (item: Option) => void;
	hideEditButton?: boolean;
}

const MultiSelectCheckbox: React.FC<MultiSelectCheckboxProps> = ({
	label,
	options,
	selectedValues,
	onChange,
	onEdit,
	hideEditButton = false,
}) => {
	const [showAll, setShowAll] = useState(false);
	const visibleOptions = showAll ? options : options.slice(0, 10);

	const handleCheckboxChange = (value: string) => {
		const currentIndex = selectedValues.indexOf(value);
		let newSelected: string[] = [];

		if (currentIndex === -1) {
			newSelected = [...selectedValues, value];
		} else {
			newSelected = selectedValues.filter((item) => item !== value);
		}

		onChange(newSelected);
	};

	return (
		<div className="space-y-2">
			<label className="block font-medium text-onyx">{label}</label>

			{/* Show selected tags/categories */}
			<div className="space-y-2">
				{selectedValues.length > 0 ? (
					<div className="flex flex-wrap gap-2 mt-2">
						{selectedValues.map((value, i) => (
							<span
								key={i}
								className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-full"
							>
								{value}
							</span>
						))}
					</div>
				) : (
					<p className="text-gray-500">No {label.toLowerCase()} selected</p>
				)}
			</div>

			{/* Display the checkbox options */}
			<div className="grid grid-cols-1 gap-2 mt-4 sm:grid-cols-2">
				{visibleOptions.map((option) => (
					<label
						key={option.id}
						className="inline-flex items-center space-x-2 cursor-pointer"
					>
						<input
							type="checkbox"
							className="rounded text-topaz focus:ring-topaz"
							checked={selectedValues.includes(option.name)}
							onChange={() => handleCheckboxChange(option.name)}
						/>
						<span>{option.name}</span>

						{/* Conditionally render the edit button */}
						{!hideEditButton && onEdit && (
							<button
								onClick={() => onEdit(option)}
								className="px-2 py-1 ml-2 text-base text-gray-600 rounded hover:text-topaz hover:bg-gray-100"
								title={`Edit ${option.name}`}
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
							</button>
						)}
					</label>
				))}
			</div>

			{/* Show more/less options */}
			{visibleOptions.length < options.length && (
				<button
					onClick={() => setShowAll(!showAll)}
					className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
				>
					{showAll ? "- Show less" : `+ Show ${options.length - 10} more`}
				</button>
			)}
		</div>
	);
};

export default MultiSelectCheckbox;
