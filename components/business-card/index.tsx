import Link from "next/link";
import React, { ReactNode, useState } from "react";
import AdminAccountSvg from "../svgs/AdminAccountSvg";
import AdminMenuCloseSvg from "../svgs/AdminMenuCloseSvg";
import AdminMenuOpenSvg from "../svgs/AdminMenuOpenSvg";
import Image from "next/image";
import getConfig from "next/config";
import RefreshButtonSvg from "../svgs/RefreshButtonSvg";

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
	userProfileId?: string;
	status?: boolean | null;
}

const BusinessCard = ({
	submitTime,
	reviewTime,
	reviewBy,
	businessName,
	ownerName,
	messages,
	children,
	img,
	id,
	userProfileId,
	status = null,
}: IBusinessCard) => {
	const [openDetails, setOpenDetails] = useState(false);
	
	const toggleDetails = () => {
		setOpenDetails(!openDetails);
	};

	return (
		// TODO: FIX ANIMATION
		<div
			className={`relative border-2 duration-300 ease-in-out transition-all border-onyx rounded-md ${
				status === null ? "bg-white" : status ? "bg-green-100" : "bg-red-100"
			}`}
			style={{ minHeight: 180 }}
		>
			{/* {isLoading && <LoadingOverlay className={"absolute"}></LoadingOverlay>} */}
			<div className="absolute top-2 right-2 text-sm font-medium z-10 flex flex-col items-end h-[145px]">
				<div className="flex gap-x-3">
					{/* <button
						id="refresh-details"
						onClick={() => {
							if (onReset) 
								onReset(id);
						}}
						className="flex sm:space-x-4 items-center px-1 rounded border-2 focus:outline-2 focus:ring-topaz focus:ring-4 focus:outline-onyx border-onyx bg-topaz-lighter hover:bg-topaz-light"
					>
						<span className="flex-none w-16 hidden sm:block">reset</span>
						<RefreshButtonSvg />
					</button> */}
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
				</div>
				<div className="mt-auto text-xs xs:text-sm font-mono font-bold max-w-[60%] sm:max-w-none">
					{messages && <p>messages: {messages} (new)</p>}
					<p>submitted: {submitTime ? submitTime : "n/a"}</p>
					<p>reviewed: {reviewTime ? reviewTime : "n/a"}</p>
					<p>reviewed by: {reviewBy ? reviewBy : "n/a"}</p>
				</div>
			</div>
			<div className="p-3" style={{ position: "relative" }}>
				<p className="text-sm font-medium">business</p>
				<p className="text-lg font-extrabold underline decoration-topaz decoration-2 mb-1 -mt-1">
					{businessName}
				</p>
				<p className="text-sm font-medium">account owner</p>
				{/* TODO: is there a real page for this?*/}
				<Link
					href={`/admin/account-detail/${userProfileId}`}
					className="inline-flex items-center sm:space-x-4 p-2 border-2 border-onyx bg-pearl rounded sm:pr-4 hover:bg-gold-lighter"
				>
					<p className="font-bold">{ownerName}</p>
				</Link>
			</div>
			{openDetails && children}
		</div>
	);
};

export default BusinessCard;
