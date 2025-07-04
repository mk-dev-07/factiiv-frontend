/* eslint-disable linebreak-style */
"use client";

import { useState } from "react";

import dynamic from "next/dynamic";
import MultiSelectCheckbox from "../../../components/admin/admin-multi-select";
import AddOptionModal from "../../../components/admin/admin-blog-select-modal";
import { useAdminStore } from "../../../store";

const AdminTextEditor = dynamic(
	() => import("../../../components/admin/admin-text-editor"),
	{
		ssr: false,
	}
);

const tagData = [
	{
		id: 1,
		name: "Technology",
		slug: "technology",
		description:
			"Technology is the art of arranging elements to create a visually appealing and user-friendly interface.",
	},
	{
		id: 2,
		name: "Design",
		slug: "design",
		description:
			"Design is the art of arranging elements to create a visually appealing and user-friendly interface.",
	},
	{
		id: 3,
		name: "Development",
		slug: "development",
		description:
			"Development is the art of arranging elements to create a visually appealing and user-friendly interface.",
	},
	{
		id: 4,
		name: "AI",
		slug: "ai",
		description:
			"AI is the art of arranging elements to create a visually appealing and user-friendly interface.",
	},
	{
		id: 5,
		name: "UI/UX",
		slug: "uiux",
		description:
			"UI/UX is the art of arranging elements to create a visually appealing and user-friendly interface.",
	},
];

const categoryData = [
	{
		id: 1,
		name: "Development",
		slug: "development",
		description:
			"Development is the art of arranging elements to create a visually appealing and user-friendly interface.",
	},
	{
		id: 2,
		name: "AI",
		slug: "ai",
		description:
			"AI is the art of arranging elements to create a visually appealing and user-friendly interface.",
	},
	{
		id: 3,
		name: "UI/UX",
		slug: "uiux",
		description:
			"UI/UX is the art of arranging elements to create a visually appealing and user-friendly interface.",
	},
	{
		id: 4,
		name: "News",
		slug: "news",
		description:
			"News is the art of arranging elements to create a visually appealing and user-friendly interface.",
	},
	{
		id: 5,
		name: "Tutorial",
		slug: "tutorial",
		description:
			"Tutorial is the art of arranging elements to create a visually appealing and user-friendly interface.",
	},
];

interface FormData {
	// other fields...
	title: string;
	meta_title: string;
	meta_description: string;
	slug: string;
	permalink: string;
	description: string;
	status: string;
	created_at: string;
	updated_at: string;
	feature_image: {
		url: string;
		alt_text: string;
	};
	categories: string[];
	tags: string[];
}

const AddBlog = () => {
	const adminStore = useAdminStore();
	const { admin } = adminStore || {};
	const [openModal, setOpenModal] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		title: "",
		meta_title: "",
		meta_description: "",
		slug: "",
		permalink: "",
		tags: [],
		categories: [],
		created_at: new Date().toLocaleDateString(),
		updated_at: "",
		description: "",
		status: "draft",
		feature_image: { url: "", alt_text: "" },
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState<"tag" | "category" | null>(null);
	const [editingItem, setEditingItem] = useState<{
		id: number;
		name: string;
		slug: string;
		description: string;
	} | null>(null);

	// Example static data
	const [tagOptions, setTagOptions] = useState(tagData);
	const [categoryOptions, setCategoryOptions] = useState(categoryData);

	// TODO: use this function to post tag/category to the database
	const handleAddOption = (
		type: "tag" | "category",
		value: { name: string; slug: string; description: string }
	) => {
		if (editingItem) {
			// Edit existing item
			const updatedItem = { ...editingItem, ...value };

			if (type === "tag") {
				setTagOptions((prev) =>
					prev.map((item) => (item.id === editingItem.id ? updatedItem : item))
				);
			} else if (type === "category") {
				setCategoryOptions((prev) =>
					prev.map((item) => (item.id === editingItem.id ? updatedItem : item))
				);
			}
		} else {
			// Add new item
			// TODO: this code is for testing purpose only. remove it when you have api
			const newOption = { ...value, id: Date.now() };

			if (type === "tag") {
				setTagOptions((prev) => [...prev, newOption]);
			} else if (type === "category") {
				setCategoryOptions((prev) => [...prev, newOption]);
			}
		}
	};

	const openAddModal = (type: "tag" | "category") => {
		setModalType(type);
		setEditingItem(null); // Clear any editing item
		setIsModalOpen(true);
	};

	const openEditModal = (
		type: "tag" | "category",
		item: { id: number; name: string; slug: string; description: string }
	) => {
		setModalType(type);
		setEditingItem(item);
		setIsModalOpen(true);
	};

	const closeAddModal = () => {
		setIsModalOpen(false);
		setModalType(null);
		setEditingItem(null); // Clear editing item
	};

	const [tempImage, setTempImage] = useState<{
		file: File | null;
		url: string;
		alt_text: string;
	}>({
		file: null,
		url: "",
		alt_text: "",
	});

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleEditorChange = (content: string) => {
		setFormData((prevData) => ({
			...prevData,
			description: content,
		}));
	};

	const handleStatusChange = (e: any) => {
		setFormData({ ...formData, status: e.target.value });
	};

	const handleImageUpload = () => {
		setOpenModal(true);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setTempImage({
					file: file,
					url: e.target?.result as string,
					alt_text: file.name,
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDone = () => {
		if (tempImage.file) {
			setFormData({
				...formData,
				feature_image: {
					// file: tempImage.file,
					url: tempImage.url,
					alt_text: tempImage.alt_text,
				},
			});
		}
		closeModal();
	};

	const closeModal = () => {
		setOpenModal(false);
		setTempImage({ file: null, url: "", alt_text: "" });
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value;

		const slug = title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.trim()
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-+/, "")
			.replace(/-+$/, "");

		setFormData({
			...formData,
			title,
			slug,
		});
	};

	const extractFirstParagraph = (htmlContent: string) => {
		if (!htmlContent) return "";

		const paragraphMatches = htmlContent.match(/<p[^>]*>(.*?)<\/p>/gs);

		if (!paragraphMatches || paragraphMatches.length === 0) {
			return "";
		}

		let summary = "";
		let wordCount = 0;
		const targetWordCount = 100;

		for (const match of paragraphMatches) {
			const content = match
				.replace(/<p[^>]*>(.*?)<\/p>/s, "$1")
				.replace(/<[^>]*>/g, "")
				.trim();

			if (content) {
				if (summary) {
					summary += " " + content;
				} else {
					summary = content;
				}

				wordCount = summary
					.split(/\s+/)
					.filter((word) => word.length > 0).length;

				if (wordCount >= targetWordCount) {
					break;
				}
			}
		}

		return summary;
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const firstParagraphContent = extractFirstParagraph(
			formData?.description ?? ""
		);

		const allData = {
			author: {
				name: admin?.username ?? "",
				email: admin?.email ?? "",
			},
			summary: firstParagraphContent,
			...formData,
		};

		console.log("Form Data:", allData);
	};

	return (
		<>
			<form
				className="p-2 mb-6 space-y-6 border-2 rounded-md border-onyx bg-pearl lg:p-6"
				onSubmit={handleSubmit}
			>
				<h3 className="text-2xl font-medium">Add Blog</h3>
				{/* Blog Title */}
				<div className="space-y-2">
					<label htmlFor="title" className="block font-medium text-onyx">
						Blog Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						value={formData.title}
						onChange={handleTitleChange}
						placeholder="Enter blog title"
						className="block w-full px-3 py-3 text-lg bg-white border-2 rounded appearance-none placeholder:text-lg border-onyx focus:border-topaz focus:outline-none"
					/>
				</div>

				{/* Feature Image */}
				<div className="space-y-2">
					<label className="block font-medium text-onyx">Feature Image</label>
					<button
						type="button"
						onClick={handleImageUpload}
						className="w-full p-4 text-center transition border border-dashed rounded-md border-onyx hover:bg-gray-100"
					>
						{formData.feature_image.url ? (
							<img
								src={formData.feature_image.url}
								alt="Preview"
								className="mx-auto max-h-24"
							/>
						) : (
							<p className="text-gray-500">Click to upload feature image</p>
						)}
					</button>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{/* Meta Description */}
					<div className="space-y-2">
						<label htmlFor="meta_title" className="block font-medium text-onyx">
							Meta Title
						</label>
						<input
							id="meta_title"
							name="meta_title"
							type="text"
							value={formData.meta_title}
							onChange={handleChange}
							placeholder="SEO meta description"
							className="block w-full px-3 py-3 text-lg bg-white border-2 rounded appearance-none placeholder:text-lg border-onyx focus:border-topaz focus:outline-none"
						/>
					</div>

					{/* Slug & Permalink */}
					<div className="space-y-2">
						<label htmlFor="permalink" className="block font-medium text-onyx">
							Permalink
						</label>
						<input
							id="permalink"
							name="permalink"
							type="text"
							value={formData.permalink}
							onChange={handleChange}
							placeholder="Enter permalink"
							className="block w-full px-3 py-3 text-lg bg-white border-2 rounded appearance-none placeholder:text-lg border-onyx focus:border-topaz focus:outline-none"
						/>
					</div>
				</div>

				{/* meta description */}
				<div className="space-y-2">
					<label
						htmlFor="meta_description"
						className="block font-medium text-onyx"
					>
						Meta Description
					</label>
					<textarea
						name="meta_description"
						id="meta_description"
						rows={4}
						value={formData.meta_description}
						onChange={handleChange}
						placeholder="Enter meta description"
						className="block w-full px-3 py-3 text-lg bg-white border-2 rounded appearance-none placeholder:text-lg border-onyx focus:border-topaz focus:outline-none"
					></textarea>
				</div>

				<div>
					<AdminTextEditor
						onContentChange={handleEditorChange}
						initialContent={formData.description}
					/>
				</div>

				{/* Status */}
				<div className="space-y-2">
					<label className="block font-medium text-onyx">Status</label>
					<div className="flex items-center space-x-6">
						<label className="inline-flex items-center">
							<input
								type="radio"
								name="status"
								value="draft"
								checked={formData.status === "draft"}
								onChange={handleStatusChange}
								className="form-radio"
							/>
							<span className="ml-2">Draft</span>
						</label>
						<label className="inline-flex items-center">
							<input
								type="radio"
								name="status"
								value="publish"
								checked={formData.status === "publish"}
								onChange={handleStatusChange}
								className="form-radio"
							/>
							<span className="ml-2">Publish</span>
						</label>
						<label className="inline-flex items-center">
							<input
								type="radio"
								name="status"
								value="archive"
								checked={formData.status === "archive"}
								onChange={handleStatusChange}
								className="form-radio"
							/>
							<span className="ml-2">Archive</span>
						</label>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-12 pt-8">
					{/* Tags */}
					<div className="flex items-start justify-between">
						<MultiSelectCheckbox
							label="Tags"
							options={tagOptions}
							selectedValues={formData.tags}
							onChange={(values) => setFormData({ ...formData, tags: values })}
							onEdit={(item) => openEditModal("tag", item)}
						/>
						<button
							type="button"
							onClick={() => openAddModal("tag")}
							className="px-3 py-1 text-base text-white rounded bg-topaz"
						>
							+
						</button>
					</div>

					{/* Categories */}
					<div className="flex items-start justify-between">
						<MultiSelectCheckbox
							label="Categories"
							options={categoryOptions}
							selectedValues={formData.categories}
							onChange={(values) =>
								setFormData({ ...formData, categories: values })
							}
							onEdit={(item) => openEditModal("category", item)}
						/>
						<button
							type="button"
							onClick={() => openAddModal("category")}
							className="px-3 py-1 text-base text-white rounded bg-topaz"
						>
							+
						</button>
					</div>
				</div>

				{/* Submit Button */}
				<div className="pt-4">
					<button
						type="submit"
						className="grid w-full group disabled"
						// disabled={isLoading}
					>
						<span className="h-full col-end-2 row-start-1 row-end-2 border-2 rounded bg-onyx border-onyx will-change-transform"></span>
						<span className="flex items-center justify-center col-end-2 row-start-1 row-end-2 px-6 py-3 space-x-4 text-sm subpixel-antialiased font-medium text-white transition-transform translate-x-0 border-2 rounded bg-topaz group-hover:-translate-y-1 will-change-transform focus:-translate-y-1 focus:outline-none border-onyx xs:text-lg">
							Publish
						</span>
					</button>
				</div>
			</form>

			{/* Image Upload Modal */}
			{openModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
						<h3 className="mb-4 text-lg font-semibold text-onyx">
							Upload Feature Image
						</h3>

						{/* File Input */}
						<div className="mb-4">
							<label className="block mb-1 text-sm font-medium text-gray-700">
								Choose Image
							</label>
							<input
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-0"
							/>
						</div>

						{/* Preview */}
						{tempImage.url && (
							<div className="mb-4">
								<img
									src={tempImage.url}
									alt={tempImage.alt_text || "Preview"}
									className="mx-auto rounded max-h-40"
								/>
							</div>
						)}

						{/* Alt Text */}
						<div className="mb-4">
							<label className="block mb-1 text-sm font-medium text-gray-700">
								Alt Text
							</label>
							<input
								type="text"
								value={tempImage.alt_text}
								onChange={(e) =>
									setTempImage({
										...tempImage,
										alt_text: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-onyx"
								placeholder="Describe the image"
							/>
						</div>

						{/* Actions */}
						<div className="flex justify-end space-x-2">
							<button
								type="button"
								onClick={closeModal}
								className="px-4 py-1 bg-gray-300 rounded-md hover:bg-gray-400"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleDone}
								className="grid group disabled"
								// disabled={isLoading}
							>
								<span className="h-full col-end-2 row-start-1 row-end-2 border-2 rounded bg-onyx border-onyx will-change-transform"></span>
								<span className="flex items-center justify-center col-end-2 row-start-1 row-end-2 px-6 py-1 space-x-4 text-sm subpixel-antialiased font-medium text-white transition-transform translate-x-0 border-2 rounded bg-topaz group-hover:-translate-y-1 will-change-transform focus:-translate-y-1 focus:outline-none border-onyx xs:text-lg">
									Done
								</span>
							</button>
						</div>
					</div>
				</div>
			)}

			<AddOptionModal
				opened={isModalOpen}
				onClose={closeAddModal}
				onAdd={(value) => {
					if (modalType) handleAddOption(modalType, value);
				}}
				label={
					modalType
						? modalType.charAt(0).toUpperCase() + modalType.slice(1)
						: ""
				}
				initialValues={editingItem || undefined}
				isEditing={!!editingItem}
			/>
		</>
	);
};

export default AddBlog;
