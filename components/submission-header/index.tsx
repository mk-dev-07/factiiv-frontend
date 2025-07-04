import React from "react";

const SubmissionHeader = () => {
	return (
		<tr>
			<th
				scope="col"
				className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-onyx sm:pl-6 md:pl-3"
			>
				name
			</th>
			<th
				scope="col"
				className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-onyx sm:pl-6 md:pl-3"
			>
				data provided
			</th>
			<th
				scope="col"
				className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-onyx sm:pl-6 md:pl-3 whitespace-nowrap"
			>
				error notes
			</th>
			<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
				<span className="sr-only">view</span>
			</th>
		</tr>
	);
};

export default SubmissionHeader;
