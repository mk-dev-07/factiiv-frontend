import React, { MouseEvent, useCallback, useEffect, useState } from "react";
import SubmissionDetails from "../submission-details";
import SubmissionHeader from "../submission-header";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useFactiivStore, useAdminStore } from "../../store";
import { useMutation } from "react-query";
import getConfig from "next/config";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import LoadingOverlay from "../loading-overlay";
import { serialize } from "../../utils/data.utils";

interface IDocumentation {
	einDocuments: string;
	articlesOfIncorporation: string;
	id?: string;
	reviewedStatus?: boolean;
	isEinDocumentBoolReview?: boolean | undefined;
	isEinDocumentNoteReview?: string;
	isAoiDocumentBoolReview?: boolean | undefined;
	isAoiDocumentNoteReview?: string;
	onComplete?: () => void;
}

const DocumentationTable = ({
	einDocuments,
	articlesOfIncorporation,
	id,
	reviewedStatus,
	isEinDocumentBoolReview,
	isEinDocumentNoteReview,
	isAoiDocumentBoolReview,
	isAoiDocumentNoteReview,
	onComplete,
}: IDocumentation & { formik?: any }) => {
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();
	const result: string[] = [];
	const [isLoading, setIsLoading] = useState(false);
	const [resetValues, setResetValues] = useState(result);

	const documentYupScheme = Yup.object().shape({
		einDocumentApproved: Yup.bool(),
		einDocumentsNote: Yup.string(),
		aoiDocumentApproved: Yup.bool(),
		articlesOfIncorporationNote: Yup.string(),
	});
	// formik initial values
	const formik = useFormik({
		initialValues: {
			einDocumentsNote: isEinDocumentNoteReview || "",
			einDocumentApproved: isEinDocumentBoolReview,
			articlesOfIncorporationNote: isAoiDocumentNoteReview || "",
			aoiDocumentApproved: isAoiDocumentBoolReview,
			enableSubmission: 0,
		},
		validationSchema: documentYupScheme,
		onSubmit: async (values) => {
			setIsLoading(true);
			// post request body

			if (resetValues.length > 0) {
				const body: any = {};
				resetValues.forEach(value => {
					body[value] = false;
				});

				if (id) reset({ body: JSON.stringify(serialize(body)), postId: id });
			} else {
				const body = {
					einDocumentApproved: !!values.einDocumentApproved,
					einDocumentsNote: !values.einDocumentApproved
						? values.einDocumentsNote?.trim() || "Rejected by admin"
						: null,
					aoiDocumentApproved: !!values.aoiDocumentApproved,
					articlesOfIncorporationNote: !values.aoiDocumentApproved
						? values.articlesOfIncorporationNote?.trim() || "Rejected by admin"
						: null,
				};

				if (id) mutate({ body: JSON.stringify(serialize(body)), postId: id });
			}
		},
	});

	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });

	// react query mutation to post data
	const { mutate } = useMutation(
		async ({ body, postId }: { body: string; postId: string }) => {
			try {
				const res = await refreshedFetch(
					`${apiUrl}/admins/profiles/verify-docs/${postId}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${adminStore.token}`,
						},
						body,
					}
				);
				if (!res.ok) {
					setIsLoading(false);
					return;
				}

				const data = await res.json();
				setIsLoading(false);
				if (onComplete) {
					onComplete();
				}
			} catch (e) {
				console.log(e);
			}
		}
	);

	const reset = async ({ body, postId }: { body: string; postId: string }) => {
		try {
			const res = await refreshedFetch(
				`${apiUrl}/admins/profiles/reset-docs/${postId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${adminStore.token}`,
					},
					body,
				}
			);
			if (!res.ok) {
				setIsLoading(false);
				return;
			}

			const data = await res.json();
			setIsLoading(false);
			if (onComplete) {
				onComplete();
			}
		} catch (e) {
			console.log(e);
		}
	};
	// factiiv and admin store
	const store = useFactiivStore();
	interface IAdminInfo {
		firstName: string;
		lastName: string;
	}
	const adminStore = useAdminStore();
	// const [enableSubmission, setEnableSubmission] = useState(false);

	// handle enable submission change
	const handleEnableSubmissionChange = useCallback(
		(fieldName: string, newEnableSubmission: boolean) => {
			formik.setFieldValue(fieldName, newEnableSubmission);
			setResetValues((prev) => prev.filter((name) => name != fieldName));
		},
		[]
	);

	useEffect(() => {
		console.log("resetValues", resetValues);
	}, [resetValues]);

	const handleResetValues = useCallback((fieldName: string) => {
		setResetValues((prev) => [...prev, fieldName]);
	}, []);

	return (
		<form onSubmit={formik.handleSubmit}>
			{isLoading && <LoadingOverlay className={"absolute"}></LoadingOverlay>}

			<div className="origin-top p-3" style={{ position: "relative" }}>
				<p className="text-lg font-medium mb-2">submission details</p>
				<div className="w-full overflow-x-auto bg-pearl rounded-md border-2 border-onyx">
					<table className="min-w-full divide-y divide-onyx">
						<thead>
							<SubmissionHeader />
						</thead>
						<tbody className="divide-y divide-onyx">
							{/* done */}
							<SubmissionDetails
								subLabel="EIN documents"
								subFixedValue={einDocuments}
								documentationTable
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikNameBool="einDocumentApproved"
								onEnableSubmissionChange={handleEnableSubmissionChange}
								value={formik.values.einDocumentsNote}
								formikNameNote="einDocumentsNote"
								boolValue={formik.values.einDocumentApproved}
								isReviewed={reviewedStatus}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								subLabel="Articles of Incorporation"
								subFixedValue={articlesOfIncorporation}
								documentationTable
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								formikNameBool="aoiDocumentApproved"
								onEnableSubmissionChange={handleEnableSubmissionChange}
								value={formik.values.articlesOfIncorporationNote}
								formikNameNote="articlesOfIncorporationNote"
								isReviewed={reviewedStatus}
								boolValue={formik.values.aoiDocumentApproved}
								handleResetValues={handleResetValues}
							/>
						</tbody>
					</table>
				</div>
				<div className="my-3 max-w-xs mx-auto">
					{/* onClick={(event: MouseEvent) => {
						event.preventDefault();
						formik.submitForm();
					}} */}
					<button
						type="submit"
						className="group grid w-full"
						id="submit-documentation"
						disabled={isLoading}
					>
						<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>
						<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
							complete
						</span>
					</button>
				</div>
			</div>
		</form>
	);
};

export default DocumentationTable;
