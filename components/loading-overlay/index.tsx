import React from "react";
import { LoadingSvg } from "../svgs/LoadingSvg";

const LoadingOverlay = ({ className }: { className?: string }) => {
	return (
		<div
			className={
				(className ? className : "fixed") +
				" top-0 left-0 w-full h-full flex justify-center items-center bg-[#00000080] z-[9999]"
			}
		>
			<LoadingSvg />
		</div>
	);
};

export default LoadingOverlay;
