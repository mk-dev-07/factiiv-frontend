import Link from "next/link";
import React from "react";
import { IDataManagement } from "../../types/dataManagement.interface";
import DoubleArrowRight from "../svgs/DoubleArrowRight";

const DataManagementCard = ({
	label,
	number,
	linkTo,
	fullWidth,
}: IDataManagement) => {
	return (
		<Link
			href={linkTo}
			className={`${
				fullWidth ? "col-span-2 " : ""
			}border-2 border-onyx bg-gold-lighter hover:bg-gold-light justify-between pl-3 pr-1 group py-1 rounded flex items-center`}
		>
			<span className="block">
				<p className="text-sm">
					<b>{label}</b>
				</p>
				<p>{number}</p>
			</span>
			<DoubleArrowRight />
		</Link>
	);
};

export default DataManagementCard;
