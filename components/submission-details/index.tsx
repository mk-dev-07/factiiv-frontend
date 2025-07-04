import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";
import CheckmarkAdminSvg from "../svgs/CheckmarkAdminSvg";
import CloseAdminSvg from "../svgs/CloseAdminSvg";
import RefreshButtonSvg from "../svgs/RefreshButtonSvg";

interface ISubmissionDetails {
	subLabel?: string;
	subFixedValue?: string | number | boolean | string[];
	documentationTable?: boolean;
	onChange: (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
	value?: any;
	formikNameNote?: string;
	formikNameBool: string;
	onEnableSubmissionChange: (
		fieldName: string,
		enableSubmission: boolean
	) => void;
	isIsOwner?: boolean;
	isReviewed?: boolean;
	boolValue?: boolean;
	handleResetValues:(fieldName: string) => void;
}

const SubmissionDetails = ({
	subLabel,
	subFixedValue,
	documentationTable,
	formikNameNote,
	formikNameBool,
	onChange,
	value,
	isIsOwner,
	isReviewed = false,
	boolValue,
	onEnableSubmissionChange,
	handleResetValues,
}: ISubmissionDetails) => {
	const [noteValue, setNoteValue] = useState("");
	// const [enableSubmission, setEnableSubmission] = useState(!!boolValue);
	const [submissionStyle, setSubmissionStyle] = useState(
		isReviewed
			? boolValue
				? "bg-green-100"
				: "bg-red-100"
			: "hover:bg-gold-lightest"
	);
	// clears string value if user clicks that the submission is valid
	const handleEnableSubmissionChange = (newEnableSubmission: number) => {
		// setEnableSubmission(newEnableSubmission);
		onEnableSubmissionChange(formikNameBool, !!newEnableSubmission);
		if (newEnableSubmission) {
			onChange({ target: { name: formikNameNote, value: "" } } as ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement
			>);
		}
	};

	const handleReset = () => {
		setSubmissionStyle("hover:bg-gold-lightest bg-white");
		onEnableSubmissionChange(formikNameBool, false);
		onChange({ target: { name: formikNameNote, value: "" } } as ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement
		>);
		handleResetValues(formikNameBool);
	};

	const checkFixedValue = () => {
		if (typeof subFixedValue === "boolean") {
			return subFixedValue ? "yes" : "no";
		} else if (
			typeof subFixedValue === "string" ||
			typeof subFixedValue === "number"
		) {
			return subFixedValue;
		} else if (typeof subFixedValue === "object") {
			return subFixedValue.map((el, i) =>
				i < subFixedValue.length - 1 ? `${el}, ` : el
			);
		}
	};

	return (
		<tr
			className={
				// submissionStyle !== "" ? submissionStyle : "hover:bg-gold-lightest"
				submissionStyle
			}
		>
			<td className="whitespace-nowrap pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3">
				<b>{subLabel}</b>
			</td>
			<td className="whitespace-nowrap pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3">
				{documentationTable && subFixedValue && (
					<Link
						className="underline text-topaz-dark"
						href={typeof subFixedValue === "string" ? subFixedValue : "#"}
						target="_blank"
					>
						view upload ↗
					</Link>
				)}
				{documentationTable && !subFixedValue && (
					<div className="w-52 whitespace-normal py-3">
						<p>No file uploaded</p>
					</div>
				)}
				{!documentationTable && (
					<div className="w-52 whitespace-normal py-3">
						<p>{checkFixedValue()}</p>
					</div>
				)}
			</td>
			<td className="whitespace-nowrap duration-300 transition-all pt-6 py-4 pl-4 pr-3 text-sm font-medium text-onyx sm:pl-6 md:pl-3">
				<textarea
					className={`duration-300 text-sm transition-all rounded ${
						boolValue ?? true
							? "h-9 opacity-50 resize-none overflow-hidden bg-pearl/75"
							: "h-16"
					}`}
					placeholder={""}
					value={value}
					onChange={(e) => onChange(e)}
					disabled={boolValue ?? true}
					name={formikNameNote}
				></textarea>
			</td>
			<td className="relative whitespace-nowrap pl-3 pr-4 text-center text-sm font-medium sm:pr-6 md:pr-0">
				<div className="flex items-center space-x-3 justify-end pr-4">
					<button
						type="button"
						id="mark-refresh"
						onClick={() => {
							handleReset();
						}}
						className={`text-onyx ${
							boolValue ? "bg-white-200" : "bg-white-300"
						} rounded flex items-center justify-center border-2 border-onyx h-10 w-10`}
					>
						<RefreshButtonSvg />
					</button>
					<button
						type="button"
						id="mark-incorrect"
						onClick={() => {
							handleEnableSubmissionChange(0);
							setSubmissionStyle("bg-red-100");
						}}
						className={`text-onyx ${
							boolValue ? "bg-red-200" : "bg-red-300"
						} rounded flex items-center justify-center border-2 border-onyx h-10 w-10`}
					>
						<CloseAdminSvg />
					</button>
					<button
						type="button"
						id="mark-correct"
						onClick={() => {
							handleEnableSubmissionChange(1);
							setSubmissionStyle("bg-green-100");
						}}
						className={`text-onyx ${
							boolValue ? "bg-green-300" : "bg-green-200"
						} rounded flex items-center justify-center border-2 border-onyx h-10 w-10`}
					>
						<CheckmarkAdminSvg />
					</button>
				</div>
			</td>
		</tr>
	);
};

export default SubmissionDetails;
