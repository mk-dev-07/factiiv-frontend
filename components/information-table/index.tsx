import React, { useCallback, useEffect, useState } from "react";
import SubmissionDetails from "../submission-details";
import SubmissionHeader from "../submission-header";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useFactiivStore, useAdminStore } from "../../store";
import { useMutation } from "react-query";
import getConfig from "next/config";
import LoadingOverlay from "../loading-overlay";

interface IInformationTable {
	registeredState?: string;
	businessSize?: string;
	businessStartDate?: string;
	interestedInFunding?: boolean;
	interestedIn?: string[];
	id?: string;
	profileId?: string;
	reviewedStatus?: boolean;
	registeredStateBoolReview?: boolean | undefined;
	registeredStateNoteReview?: string;
	businessSizeBoolReview?: boolean | undefined;
	businessSizeNoteReview?: string;
	businessStartDateBoolReview?: boolean | undefined;
	businessStartDateNoteReview?: string;
	interestedInFundingBoolReview?: boolean | undefined;
	interestedInFundingNoteReview?: string;
	interestedInBoolReview?: boolean | undefined;
	interestedInNoteReview?: string;
	onComplete?: () => void;
}

const InformationTable = ({
	registeredState,
	businessSize,
	businessStartDate,
	interestedInFunding,
	interestedIn,
	id,
	profileId,
	reviewedStatus,
	registeredStateBoolReview,
	registeredStateNoteReview,
	businessSizeBoolReview,
	businessSizeNoteReview,
	businessStartDateBoolReview,
	businessStartDateNoteReview,
	interestedInFundingBoolReview,
	interestedInFundingNoteReview,
	interestedInBoolReview,
	interestedInNoteReview,
	onComplete,
}: IInformationTable & { formik?: any }) => {
	// TODO: Add more protection to the routes
	// useProtectedAdmin();
	// useProtectedSuperadmin();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const [isLoading, setIsLoading] = useState(false);
	const result: string[] = [];
	const [resetValues, setResetValues] = useState(result);

	// TODO: Add required later on if :D
	const informationYupScheme = Yup.object().shape({
		registeredStateBool: Yup.bool(),
		isBusinessSize: Yup.bool(),
		isBusinessStartDate: Yup.bool(),
		interestInFunding: Yup.bool(),
		interestedInBool: Yup.bool(),
	});

	const formik = useFormik({
		initialValues: {
			registeredStateNote: registeredStateNoteReview || "",
			businessSizeNote: businessSizeNoteReview || "",
			businessStartDateNote: businessStartDateNoteReview || "",
			interestedInFundingNote: interestedInFundingNoteReview || "",
			interestedInNote: interestedInNoteReview || "",
			registeredStateBool: registeredStateBoolReview,
			isBusinessSize: businessSizeBoolReview,
			isBusinessStartDate: businessStartDateBoolReview,
			interestInFunding: interestedInFundingBoolReview,
			interestedInBool: interestedInBoolReview,
			enableSubmission: 0,
		},
		validationSchema: informationYupScheme,
		onSubmit: async (values) => {
			setIsLoading(true);
			if (resetValues.length > 0) {
				const body: any = {};
				resetValues.forEach(value => {
					body[value] = false;
				});
				if(resetValues.includes("registeredStateBool")) {
					body.isState = false;
					body.isCity = false;
				}

				if(resetValues.includes("interestedInBool")) {
					body.isCreditChecked = false;
					body.isLinesOfCredit = false;
					body.isBusinessCreditCards = false;
					body.isSbaLoans = false;
					body.isVendorAccounts = false;
					body.interestedIn = false;
				}

				if (profileId) reset({ body: JSON.stringify(body), postId: profileId });
			} else {
				const body = {
					isState: !!values.registeredStateBool,
					isCity: !!values.registeredStateBool,
					isBusinessSize: !!values.isBusinessSize,
					isBusinessStartDate: !!values.isBusinessStartDate,
					isCreditChecked: !!values.interestedInBool,
					interestInFunding: !!values.interestInFunding,
					isLinesOfCredit: !!values.interestedInBool,
					isBusinessCreditCards: !!values.interestedInBool,
					isSbaLoans: !!values.interestedInBool,
					isVendorAccounts: !!values.interestedInBool,
					registeredStateNote: !values.registeredStateBool
						? values.registeredStateNote || "Rejected by admin"
						: null,
					businessSizeNote: !values.isBusinessSize
						? values.businessSizeNote || "Rejected by admin"
						: null,
					businessStartDateNote: !values.isBusinessStartDate
						? values.businessStartDateNote || "Rejected by admin"
						: null,
					interestedInFundingNote: !values.interestInFunding
						? values.interestedInFundingNote || "Rejected by admin"
						: null,
					interestedInNote: !values.interestedInBool
						? values.interestedInNote || "Rejected by admin"
						: null,
					interestedIn: !!values.interestedInBool,
				};

				if (profileId) mutate({ body: JSON.stringify(body), postId: profileId });
			}
		},
	});

	const { mutate } = useMutation(
		async ({ body, postId }: { body: string; postId: string }) => {
			try {
				const res = await fetch(
					`${apiUrl}/admins/profiles/verify-info/${postId}`,
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
					const result = await res.json();
					console.log(result);
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
			const res = await fetch(
				`${apiUrl}/admins/profiles/reset-info/${postId}`,
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
				const result = await res.json();
				console.log(result);
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

	const adminStore = useAdminStore();
	const store = useFactiivStore();
	interface IAdminInfo {
		firstName: string;
		lastName: string;
	}
	const [enableSubmission, setEnableSubmission] = useState(0);

	const handleEnableSubmissionChange = useCallback(
		(fieldName: string, newEnableSubmission: boolean) => {
			formik.setFieldValue(fieldName, newEnableSubmission);
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
								subLabel="registered state"
								subFixedValue={registeredState}
								formikNameNote="registeredStateNote"
								formikNameBool="registeredStateBool"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.registeredStateNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								isReviewed={reviewedStatus}
								boolValue={formik.values.registeredStateBool}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								subLabel="business size"
								subFixedValue={businessSize}
								formikNameBool="isBusinessSize"
								formikNameNote="businessSizeNote"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.businessSizeNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								isReviewed={reviewedStatus}
								boolValue={formik.values.isBusinessSize}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								subLabel="business start date"
								subFixedValue={businessStartDate}
								formikNameBool="isBusinessStartDate"
								formikNameNote="businessStartDateNote"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.businessStartDateNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								isReviewed={reviewedStatus}
								boolValue={formik.values.isBusinessStartDate}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								subLabel="interested in funding"
								subFixedValue={interestedInFunding}
								formikNameBool="interestInFunding"
								formikNameNote="interestedInFundingNote"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.interestedInFundingNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								isReviewed={reviewedStatus}
								boolValue={formik.values.interestInFunding}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								subLabel="interested in"
								subFixedValue={interestedIn}
								formikNameBool="interestedInBool"
								formikNameNote="interestedInNote"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.interestedInNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								isReviewed={reviewedStatus}
								boolValue={formik.values.interestedInBool}
								handleResetValues={handleResetValues}
							/>
						</tbody>
					</table>
				</div>
				<div className="my-3 max-w-xs mx-auto">
					<button
						type="submit"
						className="group grid w-full"
						id="submit-info"
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

export default InformationTable;
