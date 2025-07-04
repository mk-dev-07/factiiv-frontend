/* eslint-disable linebreak-style */
"use client";

import React, { useState, useEffect } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import ReactDOM from "react-dom";

interface Category {
	name: string;
	slug: string;
	description: string;
}

interface SortedCategory {
	category_name: string;
	order: number;
}

interface SortableItemProps {
	categoryName: string;
}

interface SortableListProps {
	categoriesList: string[];
}

interface CategorySortModalProps {
	categories: Category[];
	currentSortedCategories?: SortedCategory[];
	isOpen: boolean;
	onClose: () => void;
	onSave: (sortedCategories: SortedCategory[]) => void;
}

const CategorySortModal: React.FC<CategorySortModalProps> = ({
	categories,
	currentSortedCategories = [],
	isOpen,
	onClose,
	onSave,
}) => {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [orderedCategories, setOrderedCategories] = useState<string[]>([]);

	useEffect(() => {
		if (isOpen) {
			const currentNames = currentSortedCategories
				.sort((a, b) => a.order - b.order)
				.map((cat) => cat.category_name);

			setSelectedCategories(currentNames);
			setOrderedCategories(currentNames);
		}
	}, [isOpen, currentSortedCategories]);

	const handleCategoryToggle = (categoryName: string) => {
		const isSelected = selectedCategories.includes(categoryName);

		if (isSelected) {
			setSelectedCategories((prev) =>
				prev.filter((name) => name !== categoryName)
			);
			setOrderedCategories((prev) =>
				prev.filter((name) => name !== categoryName)
			);
		} else {
			setSelectedCategories((prev) => [...prev, categoryName]);
			setOrderedCategories((prev) => [...prev, categoryName]);
		}
	};

	const handleSave = () => {
		const sortedCategories: SortedCategory[] = orderedCategories.map(
			(name, index) => ({
				category_name: name,
				order: index + 1,
			})
		);

		onSave(sortedCategories);
		onClose();
	};

	const handleCancel = () => {
		onClose();
	};

	const handleDragEnd = ({ oldIndex, newIndex }: any) => {
		const reorderedCategories = Array.from(orderedCategories);
		const [movedItem] = reorderedCategories.splice(oldIndex, 1);
		reorderedCategories.splice(newIndex, 0, movedItem);

		setOrderedCategories(reorderedCategories);
	};

	const SortableItem = SortableElement<SortableItemProps>(
		({ categoryName }: SortableItemProps) => (
			<div className="p-3 bg-white border rounded-lg shadow-sm select-none cursor-grabbing active:cursor-grab">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full text-onyx">
							{orderedCategories.indexOf(categoryName) + 1}
						</div>
						<h4 className="font-medium text-gray-900">{categoryName}</h4>
					</div>
				</div>
			</div>
		)
	);

	const SortableList = SortableContainer<SortableListProps>(
		({ categoriesList }: SortableListProps) => (
			<div className="space-y-2">
				{categoriesList.map((categoryName, index) => (
					<SortableItem
						key={categoryName}
						index={index}
						categoryName={categoryName}
					/>
				))}
			</div>
		)
	);

	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">
						Sort Categories for Frontend
					</h2>
					<p className="mt-1 text-sm text-gray-600">
						Select categories and drag to reorder them for frontend display
					</p>
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Available Categories */}
						<div>
							<h3 className="mb-4 text-lg font-medium text-gray-900">
								Available Categories
							</h3>
							<div className="space-y-2 max-h-[400px] overflow-y-auto">
								{categories.map((category) => (
									<div
										key={category.slug}
										className={`p-3 border rounded-lg cursor-pointer transition-colors ${
											selectedCategories.includes(category.name)
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 hover:border-gray-300"
										}`}
										onClick={() => handleCategoryToggle(category.name)}
									>
										<div className="flex items-center justify-between ">
											<div>
												<h4 className="font-medium text-gray-900">
													{category.name}
												</h4>
											</div>
											<div className="flex-shrink-0">
												{selectedCategories.includes(category.name) ? (
													<div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
														<svg
															className="w-3 h-3 text-white"
															fill="currentColor"
															viewBox="0 0 20 20"
														>
															<path
																fillRule="evenodd"
																d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																clipRule="evenodd"
															/>
														</svg>
													</div>
												) : (
													<div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Selected & Ordered Categories */}
						<div>
							<h3 className="text-lg font-medium text-gray-900 ">
								Selected Categories ({orderedCategories.length})
							</h3>
							<p className="mb-4 text-sm text-gray-600">
								Drag and drop to reorder
							</p>
							{orderedCategories.length === 0 ? (
								<div className="py-8 text-center text-gray-500">
									<p>No categories selected</p>
									<p className="mt-1 text-sm">
										Select categories from the left panel
									</p>
								</div>
							) : (
								<div className="min-h-[200px]">
									<SortableList
										categoriesList={orderedCategories}
										onSortEnd={handleDragEnd}
										lockAxis="y"
									/>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex justify-end px-6 py-4 space-x-3 border-t border-gray-200">
					<button
						onClick={handleCancel}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
					>
						Save Order
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
};

interface CategorySortManagerProps {
	categories: Category[];
	currentSortedCategories?: SortedCategory[];
	onSave: (sortedCategories: SortedCategory[]) => void;
}

const AdminCategoryModal: React.FC<CategorySortManagerProps> = ({
	categories,
	currentSortedCategories = [],
	onSave,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleSave = (sortedCategories: SortedCategory[]) => {
		onSave(sortedCategories);
		// Here you would typically make an API call to save the order
		console.log("Saving category order:", sortedCategories);
	};

	return (
		<div>
			<button
				onClick={() => setIsModalOpen(true)}
				className="inline-flex items-center px-4 py-2 font-medium border border-gray-300 rounded-md text-onyx focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				<svg
					className="w-4 h-4 mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
					/>
				</svg>
				Reorganize Categories For Frontend
			</button>

			<CategorySortModal
				categories={categories}
				currentSortedCategories={currentSortedCategories}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
			/>
		</div>
	);
};

export default AdminCategoryModal;

// Usage Example in your parent component:
/*
"use client";

import { useState, useEffect } from "react";
import CategorySortManager from "./CategorySortManager";

const YourParentComponent = () => {
  const [categories, setCategories] = useState([]);
  const [sortedCategories, setSortedCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchSortedCategories = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/sorted-categories');
        const data = await response.json();
        setSortedCategories(data);
      } catch (error) {
        console.error('Error fetching sorted categories:', error);
      }
    };

    fetchCategories();
    fetchSortedCategories();
  }, []);

  const handleSaveCategoryOrder = async (newSortedCategories) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/sorted-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSortedCategories),
      });

      if (response.ok) {
        setSortedCategories(newSortedCategories);
        // Show success message
        alert('Category order saved successfully!');
      } else {
        throw new Error('Failed to save category order');
      }
    } catch (error) {
      console.error('Error saving category order:', error);
      // Show error message
      alert('Error saving category order');
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
      
      <CategorySortManager
        categories={categories}
        currentSortedCategories={sortedCategories}
        onSave={handleSaveCategoryOrder}
      />
    </div>
  );
};

export default YourParentComponent;
*/
