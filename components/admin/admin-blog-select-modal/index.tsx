/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";

interface AddOptionModalProps {
	opened: boolean;
	onClose: () => void;
	onAdd: (value: { name: string; slug: string; description: string }) => void;
	label: string;
	initialValues?: { name: string; slug: string; description: string };
	isEditing?: boolean; // Add this prop
}

const AddOptionModal: React.FC<AddOptionModalProps> = ({
	opened,
	onClose,
	onAdd,
	label,
	initialValues,
	isEditing = false, // Add this prop
}) => {
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [description, setDescription] = useState("");

	// Update useEffect to handle initial values
	useEffect(() => {
		if (opened && initialValues) {
			setName(initialValues.name);
			setSlug(initialValues.slug);
			setDescription(initialValues.description);
		} else if (opened && !initialValues) {
			// Reset form when opening for add
			setName("");
			setSlug("");
			setDescription("");
		}
	}, [opened, initialValues]);

	const handleAdd = () => {
		const trimmedName = name.trim();
		const trimmedSlug = slug.trim();
		const trimmedDescription = description.trim();

		if (trimmedName && trimmedSlug && trimmedDescription) {
			onAdd({
				name: trimmedName,
				slug: trimmedSlug,
				description: trimmedDescription,
			});
			setName("");
			setSlug("");
			setDescription("");
		}
	};

	const handleClose = () => {
		setName("");
		setSlug("");
		setDescription("");
		onClose();
	};

	if (!opened) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
				<h3 className="mb-2 text-lg font-semibold text-onyx">
					{isEditing ? `Edit ${label}` : `Add New ${label}`}
				</h3>
				<div className="mb-4">
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md text-onyx"
						placeholder={`Enter ${label.toLowerCase()} name`}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleAdd();
						}}
					/>
				</div>
				<div className="mb-4">
					<input
						type="text"
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md text-onyx"
						placeholder={`Enter ${label.toLowerCase()} slug`}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleAdd();
						}}
					/>
				</div>
				<div className="mb-4">
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md text-onyx"
						placeholder={`Enter ${label.toLowerCase()} description`}
						rows={3}
					/>
				</div>
				<div className="flex justify-end space-x-2">
					<button
						onClick={handleClose}
						className="px-4 py-1 bg-gray-300 rounded-md hover:bg-gray-400 text-onyx"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleAdd}
						className="grid group disabled"
					>
						<span className="h-full col-end-2 row-start-1 row-end-2 border-2 rounded bg-onyx border-onyx will-change-transform"></span>
						<span className="flex items-center justify-center col-end-2 row-start-1 row-end-2 px-6 py-1 space-x-4 text-sm subpixel-antialiased font-medium text-white transition-transform translate-x-0 border-2 rounded bg-topaz group-hover:-translate-y-1 will-change-transform focus:-translate-y-1 focus:outline-none border-onyx xs:text-lg">
							{isEditing ? "Update" : "Add"}
						</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddOptionModal;
