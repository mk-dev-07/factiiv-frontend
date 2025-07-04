import React, { useCallback, useEffect, useState } from "react";
import SubmissionDetails from "../submission-details";
import SubmissionHeader from "../submission-header";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import { useFactiivStore, useAdminStore } from "../../store";
import { useMutation } from "react-query";
import getConfig from "next/config";
import { useQuery, useQueryClient } from "react-query";
import LoadingOverlay from "../loading-overlay";
import { ObjectType } from "typescript";
import { serialize } from "../../utils/data.utils";

interface IOnboarding {
	businessName?: string;
	isOwner?: boolean;
	ownerName?: string;
	businessVertical?: string;
	businessAddress?: string;
	businessPhone?: string;
	businessEmail?: string;
	businessWebsite?: string;
	businessEIN?: number | string;
	id?: string;
	businessNameBoolReviewed?: boolean | undefined;
	reviewedStatus?: boolean;
	businessNameNoteReviewed?: string;
	isOwnerBoolReviewed?: boolean | undefined;
	isOwnerNoteReviewed?: string;
	isBusinessVerticalBoolReviewed?: boolean | undefined;
	isBusinessVerticalNoteReviewed?: string;
	isOwnerNameBoolReviewed?: boolean | undefined;
	isOwnerNameNoteReviewed?: string;
	isBusinessAddressBoolReviewed?: boolean | undefined;
	isBusinessAddressNoteReviewed?: string;
	isPhoneNumberBoolReviewed?: boolean | undefined;
	isPhoneNumberNoteReviewed?: string;
	isBusinessEmailBoolReviewed?: boolean | undefined;
	isBusinessEmailNoteReviewed?: string;
	isBusinessWebsiteBoolReviewed?: boolean | undefined;
	isBusinessWebsiteNoteReviewed?: string;
	isEinBoolReviewed?: boolean | undefined;
	isEinNoteReviewed?: string;
	onComplete?: () => void;
}

const OnboardingTable = ({
	businessName,
	isOwner,
	ownerName,
	businessVertical,
	businessAddress,
	businessPhone,
	businessEmail,
	businessWebsite,
	businessEIN,
	id,
	reviewedStatus,
	businessNameBoolReviewed,
	businessNameNoteReviewed,
	isOwnerBoolReviewed,
	isOwnerNoteReviewed,
	isBusinessVerticalBoolReviewed,
	isBusinessVerticalNoteReviewed,
	isOwnerNameBoolReviewed,
	isOwnerNameNoteReviewed,
	isBusinessAddressBoolReviewed,
	isBusinessAddressNoteReviewed,
	isPhoneNumberBoolReviewed,
	isPhoneNumberNoteReviewed,
	isBusinessEmailBoolReviewed,
	isBusinessEmailNoteReviewed,
	isBusinessWebsiteBoolReviewed,
	isBusinessWebsiteNoteReviewed,
	isEinBoolReviewed,
	isEinNoteReviewed,
	onComplete,
}: IOnboarding & { formik?: any }) => {
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const [isLoading, setIsLoading] = useState(false);
	const result: string[] = [];
	const [resetValues, setResetValues] = useState(result);

	// TODO: Add required later on if :D
	const onboardingYupScheme = Yup.object().shape({
		isBusinessName: Yup.bool(),
		isIsOwner: Yup.bool(),
		isOwnerName: Yup.bool(),
		isIndustry: Yup.bool(),
		businessAdressBool: Yup.bool(),
		isPhoneNumber: Yup.bool(),
		isEmail: Yup.bool(),
		isWebsite: Yup.bool(),
		isEin: Yup.bool(),
	});

	const formik = useFormik({
		// inital values of formik
		initialValues: {
			businessNameNote: businessNameNoteReviewed || "",
			isOwnerNote: isOwnerNoteReviewed || "",
			ownerNameNote: isOwnerNameNoteReviewed || "",
			businessVerticalNote: reviewedStatus
				? isBusinessVerticalNoteReviewed
				: "",
			businessAdressNote: isBusinessAddressNoteReviewed || "",
			businessPhoneNote: isPhoneNumberNoteReviewed || "",
			businessEmailNote: isBusinessEmailNoteReviewed || "",
			businessWebsiteNote: isBusinessWebsiteNoteReviewed || "",
			businessEINNote: isEinNoteReviewed || "",
			// businessNameBool: reviewedStatus === true ? businessNameBoolReviewed : 0,
			isIsOwner: isOwnerBoolReviewed,
			isIndustry: isBusinessVerticalBoolReviewed,
			businessAdressBool: isBusinessAddressBoolReviewed,
			isPhoneNumber: isPhoneNumberBoolReviewed,
			isEmail: isBusinessEmailBoolReviewed,
			isWebsite: isBusinessWebsiteBoolReviewed,
			isEin: isEinBoolReviewed,
			isBusinessName: businessNameBoolReviewed,
			isOwnerName: isOwnerNameBoolReviewed,
			enableSubmission: 0,
		},
		validationSchema: onboardingYupScheme,
		onSubmit: async (values) => {
			setIsLoading(true);
			// request body for post request
			if (resetValues.length > 0) {
				const body: any = {};
				resetValues.forEach(value => {
					body[value] = false;
				});
				if(resetValues.includes("businessAdressBool")) {
					body.isStreet = false;
					body.isCity = false;
					body.isState = false;
					body.isZip = false;
					body.isCountry = false;
				}

				if (id) reset({ body: JSON.stringify(serialize(body)), postId: id });
			} else {
				const body = {
					isBusinessName: values.isBusinessName,
					businessNameNote: !values.isBusinessName
						? values.businessNameNote?.trim() || "Rejected by admin"
						: null,
					isIsOwner: values.isIsOwner,
					isOwnerNote: !values.isIsOwner
						? values.isOwnerNote?.trim() || "Rejected by admin"
						: null,
					isOwnerName: values.isOwnerName,
					ownerNameNote: !values.isOwnerName
						? values.ownerNameNote?.trim() || "Rejected by admin"
						: null,
					isIndustry: values.isIndustry,
					businessVerticalNote: !values.isIndustry
						? values.businessVerticalNote?.trim() || "Rejected by admin"
						: null,
					isStreet: values.businessAdressBool,
					isCity: values.businessAdressBool,
					isState: values.businessAdressBool,
					isZip: values.businessAdressBool,
					isCountry: values.businessAdressBool,
					businessAddressNote: !values.businessAdressBool
						? values.businessAdressNote?.trim() || "Rejected by admin"
						: null,
					isPhoneNumber: values.isPhoneNumber,
					businessPhoneNote: !values.isPhoneNumber
						? values.businessPhoneNote?.trim() || "Rejected by admin"
						: null,
					isWebsite: values.isWebsite,
					businessWebsiteNote: !values.isWebsite
						? values.businessWebsiteNote?.trim() || "Rejected by admin"
						: null,
					isEmail: values.isEmail,
					businessEmailNote: !values.isEmail
						? values.businessEmailNote?.trim() || "Rejected by admin"
						: null,
					isEin: values.isEin,
					businessEINNote: !values.isEin
						? values.businessEINNote?.trim() || "Rejected by admin"
						: null,
				};

				if (id) mutate({ body: JSON.stringify(serialize(body)), postId: id });
			}
		},
	});

	const queryClient = useQueryClient();
	// mutation for post request in react-query
	const { mutate } = useMutation(
		async ({ body, postId }: { body: string; postId: string }) => {
			try {
				const res = await fetch(
					`${apiUrl}/admins/profiles/verify-data/${postId}`,
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
					console.log(await res.json());
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
				`${apiUrl}/admins/profiles/reset-data/${postId}`,
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
				console.log(await res.json());
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

	// factiiv Store
	const store = useFactiivStore();

	interface IAdminInfo {
		firstName: string;
		lastName: string;
	}
	// admin Store
	const adminStore = useAdminStore();
	const [enableSubmission, setEnableSubmission] = useState(0);
	// callback for submission details
	const handleEnableSubmissionChange = useCallback(
		(fieldName: string, newEnableSubmission: boolean) => {
			// setEnableSubmission(newEnableSubmission);
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
								formikNameBool="isBusinessName"
								formikNameNote="businessNameNote"
								subLabel="business name"
								subFixedValue={businessName}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.businessNameNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								boolValue={formik.values.isBusinessName}
								isReviewed={reviewedStatus}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								formikNameBool="isIsOwner"
								formikNameNote="isOwnerNote"
								subLabel="is owner"
								subFixedValue={isOwner}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.isOwnerNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								boolValue={formik.values.isIsOwner}
								isReviewed={reviewedStatus}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								formikNameBool="isOwnerName"
								formikNameNote="ownerNameNote"
								subLabel="owner name"
								subFixedValue={ownerName}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.ownerNameNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								boolValue={formik.values.isOwnerName}
								isReviewed={reviewedStatus}
								handleResetValues={handleResetValues}
							/>

							{/* done */}
							<SubmissionDetails
								formikNameBool="isIndustry"
								formikNameNote="businessVerticalNote"
								subLabel={"business vertical"}
								subFixedValue={businessVertical}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.businessVerticalNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								boolValue={formik.values.isIndustry}
								isReviewed={reviewedStatus}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								formikNameBool="businessAdressBool"
								formikNameNote="businessAdressNote"
								subLabel="business address"
								subFixedValue={businessAddress}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.businessAdressNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								boolValue={formik.values.businessAdressBool}
								isReviewed={reviewedStatus}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								formikNameBool="isPhoneNumber"
								formikNameNote="businessPhoneNote"
								subLabel="business phone"
								subFixedValue={businessPhone}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.businessPhoneNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								boolValue={formik.values.isPhoneNumber}
								isReviewed={reviewedStatus}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								formikNameBool="isEmail"
								formikNameNote="businessEmailNote"
								subLabel="business email"
								subFixedValue={businessEmail}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.businessEmailNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								boolValue={formik.values.isEmail}
								isReviewed={reviewedStatus}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								formikNameBool="isWebsite"
								formikNameNote="businessWebsiteNote"
								subLabel={`business website [${reviewedStatus}]`}
								subFixedValue={businessWebsite}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.businessWebsiteNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								boolValue={formik.values.isWebsite}
								isReviewed={reviewedStatus}
								handleResetValues={handleResetValues}
							/>
							{/* done */}
							<SubmissionDetails
								formikNameBool="isEin"
								formikNameNote="businessEINNote"
								subLabel="business EIN"
								subFixedValue={businessEIN}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.businessEINNote}
								onEnableSubmissionChange={handleEnableSubmissionChange}
								boolValue={formik.values.isEin}
								isReviewed={reviewedStatus}
								handleResetValues={handleResetValues}
							/>
						</tbody>
					</table>
				</div>
				<div className="my-3 max-w-xs mx-auto">
					<button
						type="submit"
						className="group grid w-full disabled"
						id="submit-onboarding"
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

export default OnboardingTable;
