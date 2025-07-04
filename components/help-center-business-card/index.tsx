import Link from "next/link";
import React, { ReactNode, useState } from "react";
import AdminAccountSvg from "../svgs/AdminAccountSvg";
import AdminMenuCloseSvg from "../svgs/AdminMenuCloseSvg";
import AdminMenuOpenSvg from "../svgs/AdminMenuOpenSvg";
interface IBusinessCard {
	submitTime?: string;
	reviewTime?: string;
	reviewBy?: string;
	businessName?: string;
	ownerName?: string;
	messages?: number;
	children: ReactNode;
	id?: string;
	img?: string;
}

const HelpCenterBusinessCard = ({
	submitTime,
	reviewTime,
	reviewBy,
	businessName,
	ownerName,
	messages,
	children,
	img,
	id,
}: IBusinessCard) => {
	const [openDetails, setOpenDetails] = useState(false);

	const toggleDetails = () => {
		setOpenDetails(!openDetails);
	};

	return (
		// TODO: FIX ANIMATION
		<div
			className="relative border-2 duration-300 ease-in-out transition-all border-onyx rounded-md bg-white "
			style={{ minHeight: 180 }}
		>
			<div className="absolute top-2 right-2 text-sm font-medium z-10 flex flex-col items-end h-[145px]">
				<button
					id="toggle-details"
					onClick={toggleDetails}
					className="flex sm:space-x-4 items-center px-1 rounded border-2 focus:outline-2 focus:ring-topaz focus:ring-4 focus:outline-onyx border-onyx bg-topaz-lighter hover:bg-topaz-light"
				>
					<span className="flex-none w-16 hidden sm:block">
						{openDetails ? "close" : "open"}
					</span>
					{openDetails ? <AdminMenuOpenSvg /> : <AdminMenuCloseSvg />}
				</button>
				{/* <div className="mt-auto text-xs xs:text-sm font-mono font-bold max-w-[60%] sm:max-w-none">
					{messages && <p>messages: {messages} (new)</p>}
					<p>submitted: {submitTime ? submitTime : "n/a"}</p>
					<p>reviewed: {reviewTime ? reviewTime : "n/a"}</p>
					<p>reviewed by: {reviewBy ? reviewBy : "n/a"}</p>
				</div> */}
			</div>
			<div className="p-3" style={{ position: "relative" }}>
				<p className="text-sm font-medium">business</p>
				<p className="text-lg font-extrabold underline decoration-topaz decoration-2 mb-1 -mt-1">
					{businessName}
				</p>
				<p>opened</p>
				<p>{submitTime ? submitTime : "n/a"}</p>
				<p>unread messages</p>
				<p>{messages}</p>
				{/* TODO: is there a real page for this? if not, remove the link */}
			</div>
			{openDetails && children}
		</div>
	);
};

export default HelpCenterBusinessCard;
