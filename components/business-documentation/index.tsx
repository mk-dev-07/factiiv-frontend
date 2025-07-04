import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useFactiivStore } from "../../store";
import getConfig from "next/config";
import { useMutation } from "react-query";
import FileIconSvg from "../svgs/FileIconSvg";
import Profile from "../../types/profile.interface";
import Tooltip from "../tooltip";

const BusinessDocumentation = ({
	activeProfile,
	aoiFilePath,
	einFilePath,
	token,
	profileId,
	onFileUpload: onFileUpdate,
	isAdmin = false,
}: {
	activeProfile?: Profile;
	aoiFilePath?: string;
	einFilePath?: string;
	token: string | null;
	profileId: string | undefined;
	onFileUpload: (profile?: Profile) => void;
	isAdmin?: boolean;
}) => {
	const store = useFactiivStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin });
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();

	const aoiInputRef = useRef<HTMLInputElement>(null);
	const einInputRef = useRef<HTMLInputElement>(null);
	const [fileUpdateError, setFileUpdateError] = useState("");
	const [newAoiFileUploaded, setnewAoiFileUploaded] = useState<boolean>(false);
	const [newEinFileUploaded, setNewEinFileUploaded] = useState<boolean>(false);

	const [aoiDocumentPath, setAoiDocumentPath] = useState<string>();
	useEffect(() => {
		setAoiDocumentPath(aoiFilePath);
	}, [aoiFilePath]);

	const [einDocumentPath, setEinDocumentPath] = useState<string>();

	useEffect(() => {
		setEinDocumentPath(einFilePath);
	}, [einFilePath]);

	const uploadFileToServer = async (file: File, type: "AOI" | "EIN") => {
		setFileUpdateError("");
		if (!file) {
			setFileUpdateError("No file provided, please add file for upload.");
			return;
		}

		if (!token) {
			setFileUpdateError(
				"Unable to upload files because of invalid credentials."
			);
			return;
		}

		const body = new FormData();
		body.append("document", file);

		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);

		const uploadRoute = isAdmin ? "admins/documents" : "profiles/documents";

		const response = await refreshedFetch(
			`${apiUrl}/${uploadRoute}/${type}/${profileId}`,
			{
				method: "POST",
				headers,
				body,
			}
		);

		const data = await response.json();

		if (!response.ok) {
			setFileUpdateError("There was an error with uploading your file.");
			return;
		}

		onFileUpdate?.(data.payload);
	};

	const { mutate: deleteFile } = useMutation(async (type: "EIN" | "AOI") => {
		setFileUpdateError("");
		const headers = new Headers();
		headers.append("Authorization", `Bearer ${store.token}`);

		if (!profileId) {
			return;
		}

		try {
			const response = await refreshedFetch(
				apiUrl + `/profiles/documents/${type}/${profileId}`,
				{
					method: "DELETE",
					headers,
				}
			);

			if (!response.ok) {
				setFileUpdateError("There was an error removing files");
				setTimeout(() => {
					setFileUpdateError("");
				}, 3000);
				return;
			}

			const profile = await response.json();
			onFileUpdate?.(profile.payload);
		} catch (error) {
			console.log(error);
		}
	});

	const clearField = (file: "EIN" | "AOI") => {
		if (file === "EIN" && einDocumentPath) {
			deleteFile("EIN");
		}

		if (file === "AOI" && aoiDocumentPath) {
			deleteFile("AOI");
		}
	};

	return (
		<div
			id="documentation"
			className="border-2 border-onyx target:border-topaz rounded-md bg-pearl p-2 lg:p-6 mb-6"
		>
			<div className="mb-4">
				<p className="font-medium text-2xl">business documentation</p>
			</div>
			<div className="grid grid-cols-4 gap-4 mt-6">
				<div className="col-span-4 mb-5">
					<label htmlFor="aoiFile" className="block font-medium text-onyx">
						articles of incorporation{" "}
						<Tooltip text="Articles of incorporation is a legal document that document the creation of a corporation. It can be uploaded in a .pdf format."></Tooltip>
					</label>
					<div className="mt-1 flex items-center relative">
						{aoiDocumentPath && (
							<a
								href={rootUrl + aoiDocumentPath + `?t=${Date.now()}`}
								target="_blank"
								rel="noreferrer"
							>
								<FileIconSvg></FileIconSvg>
							</a>
						)}
						{(newEinFileUploaded || newAoiFileUploaded || !activeProfile?.aoiDocumentPath ||
							activeProfile?.aoiDocumentApproved ||
							activeProfile?.isDocsReviewed || isAdmin) && 
							<>
								<div className="ml-4 flex">
									<div className="cursor-pointer relative flex items-center rounded-md bg-pearl border-2 border-onyx focus-within:outline-none focus-within:ring-2 focus-within:ring-topaz focus-within:ring-offset-2 focus-within:ring-offset-blue-gray-50 hover:bg-blue-gray-50">
										<label
											htmlFor="aoiFile"
											className="py-2 px-3 relative text-sm font-medium text-blue-gray-900 cursor-pointer"
										>
											<span>upload</span>
											<span className="sr-only">
												change articles of incorporation
											</span>
										</label>
										<input
											ref={aoiInputRef}
											id="aoiFile"
											name="aoiFile"
											type="file"
											accept=".pdf,.doc,.docx,.odt"
											className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0 z-[-1]"
											onChange={() => {
												const aoiFile = aoiInputRef?.current?.files?.[0];

												if (!aoiFile) return;

												setnewAoiFileUploaded(true);
												uploadFileToServer(aoiFile, "AOI");
											}}
										/>
									</div>
									{aoiDocumentPath && (
										<button
											id="remove-document-aoi"
											type="button"
											className="ml-3 rounded-md border border-transparent bg-transparent py-2 px-3 text-sm font-medium text-blue-gray-900 hover:text-blue-gray-700 focus:border-blue-gray-300 focus:outline-none focus:ring-2 focus:ring-topaz focus:ring-offset-2 focus:ring-offset-blue-gray-50"
											onClick={() => clearField("AOI")}
										>
											remove
										</button>
									)}
								</div>
								<small className="absolute bottom-[-20px]">only .pdf, .doc, .docx and .odt files are allowed</small>
							</>
						}
					</div>
					{/* {aoiFileName && <p className="mt-4">{aoiFileName}</p>} */}
					{!isAdmin && <>
						{!newAoiFileUploaded &&
						activeProfile?.aoiDocumentPath &&
						!activeProfile?.aoiDocumentApproved &&
						(!activeProfile?.isDocsReviewed ? (
							<div className="text-red-500">Not reviewed yet.</div>
						) : activeProfile?.articlesOfIncorporationNote ? (
							<div className="text-red-500">
								{activeProfile?.articlesOfIncorporationNote ||
									"Rejected by admin"}
							</div>
						) : null)}
					</>}
					
				</div>
				<div className="col-span-4 mb-5">
					<label htmlFor="einFile" className="block font-medium text-onyx">
						EIN documentation{" "}
						<Tooltip text="Here you need to upload the document that verifies your employer identification number. It can be uploaded in a .pdf format."></Tooltip>
					</label>
					<div className="mt-1 flex items-center relative">
						{einDocumentPath && (
							<a
								href={rootUrl + einDocumentPath + `?t=${Date.now()}`}
								target="_blank"
								rel="noreferrer"
							>
								<FileIconSvg></FileIconSvg>
							</a>
						)}
						{(newAoiFileUploaded || newEinFileUploaded || !activeProfile?.einDocumentPath ||
							activeProfile?.einDocumentApproved ||
							activeProfile?.isDocsReviewed || isAdmin) && 
							<>
								<div className="ml-4 flex">
									<div className="cursor-pointer relative flex items-center rounded-md bg-pearl border-2 border-onyx focus-within:outline-none focus-within:ring-2 focus-within:ring-topaz focus-within:ring-offset-2 focus-within:ring-offset-blue-gray-50 hover:bg-blue-gray-50">
										<label
											htmlFor="einFile"
											className="py-2 px-3 relative text-sm font-medium text-blue-gray-900 cursor-pointer"
										>
											<span>upload</span>
											<span className="sr-only">change ein documentation</span>
										</label>
										<input
											ref={einInputRef}
											id="einFile"
											name="einFile"
											type="file"
											accept=".pdf,.doc,.docx,.odt"
											className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0 z-[-1]"
											onChange={() => {
												const einFile = einInputRef?.current?.files?.[0];

												if (!einFile) return;

												setNewEinFileUploaded(true);
												uploadFileToServer(einFile, "EIN");
											}}
										/>
									</div>
									{einDocumentPath && (
										<button
											id="remove-document-aoi"
											type="button"
											className="ml-3 rounded-md border border-transparent bg-transparent py-2 px-3 text-sm font-medium text-blue-gray-900 hover:text-blue-gray-700 focus:border-blue-gray-300 focus:outline-none focus:ring-2 focus:ring-topaz focus:ring-offset-2 focus:ring-offset-blue-gray-50"
											onClick={() => clearField("EIN")}
										>
											remove
										</button>
									)}
								</div>	
								<small className="absolute bottom-[-20px]">only .pdf, .doc, .docx and .odt files are allowed</small>
							</>
						}
					</div>
					{!isAdmin && <>
						{!newEinFileUploaded &&
						einDocumentPath &&
						!activeProfile?.einDocumentApproved &&
						(!activeProfile?.isDocsReviewed ? (
							<div className="text-red-500">Not reviewed yet.</div>
						) : activeProfile?.einDocumentsNote ? (
							<div className="text-red-500">
								{activeProfile?.einDocumentsNote || "Rejected by admin"}
							</div>
						) : null)}
					</>}
				</div>
			</div>
			{fileUpdateError && (
				<div className="mt-2">
					<p className="text-red-500">{fileUpdateError}</p>
				</div>
			)}
		</div>
	);
};

export default BusinessDocumentation;
