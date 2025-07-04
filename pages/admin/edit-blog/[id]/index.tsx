/* eslint-disable linebreak-style */
"use client";

import Head from "next/head";
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../../components/admin/admin-sidebar";
import AdminLogoSvg from "../../../../components/svgs/AdminLogoSvg";
import MobileNav from "../../../../components/admin/admin-mobile-nav";
import { useRouter } from "next/router";
import blogData from "../../../../data/blogData.js";
import MultiSelectCheckbox from "../../../../components/admin/admin-multi-select";

import dynamic from "next/dynamic";

// import AdminTextEditor from "../../../../components/admin/admin-text-editor";

const AdminTextEditor = dynamic(
	() => import("../../../../components/admin/admin-text-editor"),
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

interface Data {
	title: string;
	meta_title: string;
	meta_description: string;
	slug: string;
	permalink: string;
	description: string;
	status?: string;
	tags: string[];
	categories: string[];
	created_at: string;
	updated_at: string;
	feature_image: {
		url: string;
		alt_text: string;
	};
}

interface FormData {
	title: string;
	meta_title: string;
	meta_description: string;
	slug: string;
	permalink: string;
	description: string;
	status: string | undefined;
	created_at: string;
	updated_at: string;
	feature_image: {
		url: string;
		alt_text: string;
	};
	categories: string[];
	tags: string[];
}

const EditBlog = () => {
	const router = useRouter();
	const { id } = router.query;
	const [data, setData] = useState<Data | null>(null);

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

	useEffect(() => {
		if (data) {
			setFormData((prev) => ({
				...prev,
				status: data.status ?? "draft",
				tags: data.tags || [],
				categories: data.categories || [],
			}));
		}
	}, [data]);

	const [tagOptions, setTagOptions] = useState(tagData);
	const [categoryOptions, setCategoryOptions] = useState(categoryData);

	useEffect(() => {
		const blog = blogData.find((item) => item.id === Number(id));
		if (blog) {
			setData(blog);
		}
	}, [id]);

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

	// TODO: use this function to update the blog
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const firstParagraphContent = extractFirstParagraph(
			formData?.description ?? ""
		);

		const allData = {
			summary: firstParagraphContent,
			...formData,
		};

		console.log("Form Data:", allData);
	};

	return (
		<>
			<div
				data-gr-ext-installed
				data-new-gr-c-s-check-loaded="14.1098.0"
				className="relative w-full h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox"
			>
				<Head>
					<title>All Blog | factiiv</title>
				</Head>
				<div className="relative w-full h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox">
					<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
						<AdminSidebar />
						<div className="hidden w-1/2 h-0 col-start-2 col-end-3 row-start-1 row-end-2 py-6 lg:block"></div>
						<div className="w-24 col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden">
							<AdminLogoSvg />
						</div>
						<div className="col-start-1 col-end-3 row-start-1 row-end-2 py-2 pr-2 justify-self-end md:col-start-2 xl:col-start-3 xs:py-4 xs:pr-4 sm:py-6 sm:pr-6">
							<MobileNav />
						</div>
						<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
							<div className="p4-8">
								<h2 className="my-3 text-xl font-medium capitalize text-onyx">
									edit blog
								</h2>
							</div>
							{/* main content */}
							<div>
								<form
									className="p-2 mb-6 space-y-6 border-2 rounded-md border-onyx bg-pearl lg:p-6"
									onSubmit={handleSubmit}
								>
									<h3 className="text-2xl font-medium">Add Blog</h3>
									{/* Blog Title */}
									<div className="space-y-2">
										<label
											htmlFor="title"
											className="block font-medium text-onyx"
										>
											Blog Title
										</label>
										<input
											id="title"
											name="title"
											type="text"
											value={formData.title || data?.title}
											onChange={handleTitleChange}
											placeholder="Enter blog title"
											className="block w-full px-3 py-3 text-lg bg-white border-2 rounded appearance-none placeholder:text-lg border-onyx focus:border-topaz focus:outline-none"
										/>
									</div>

									{/* Feature Image */}
									<div className="space-y-2">
										<label className="block font-medium text-onyx">
											Feature Image
										</label>
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
												<div>
													<div>
														<img
															src={
																formData.feature_image.url ||
																data?.feature_image?.url
															}
															alt=""
															className="mx-auto rounded max-h-24"
														/>
													</div>
													<p className="text-gray-500">
														Click to update feature image
													</p>
												</div>
											)}
										</button>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										{/* Meta Description */}
										<div className="space-y-2">
											<label
												htmlFor="meta_title"
												className="block font-medium text-onyx"
											>
												Meta Title
											</label>
											<input
												id="meta_title"
												name="meta_title"
												type="text"
												value={formData.meta_title || data?.meta_title}
												onChange={handleChange}
												placeholder="SEO meta description"
												className="block w-full px-3 py-3 text-lg bg-white border-2 rounded appearance-none placeholder:text-lg border-onyx focus:border-topaz focus:outline-none"
											/>
										</div>

										{/* Slug & Permalink */}
										<div className="space-y-2">
											<label
												htmlFor="permalink"
												className="block font-medium text-onyx"
											>
												Permalink
											</label>
											<input
												id="permalink"
												name="permalink"
												type="text"
												value={formData.permalink || data?.permalink}
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
											value={
												formData.meta_description || data?.meta_description
											}
											onChange={handleChange}
											placeholder="Enter meta description"
											className="block w-full px-3 py-3 text-lg bg-white border-2 rounded appearance-none placeholder:text-lg border-onyx focus:border-topaz focus:outline-none"
										></textarea>
									</div>

									{data?.description && (
										<div>
											<AdminTextEditor
												onContentChange={handleEditorChange}
												initialContent={data.description}
											/>
										</div>
									)}

									{/* Status */}
									<div className="space-y-2">
										<label className="block font-medium text-onyx">
											Status
										</label>
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
												onChange={(values) =>
													setFormData({ ...formData, tags: values })
												}
												hideEditButton={true}
											/>
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
												hideEditButton={true}
											/>
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
												Update
											</span>
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>

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
		</>
	);
};

export default EditBlog;
