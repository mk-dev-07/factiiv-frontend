import { ClickOutsideWrapperProps } from "../../types/click-outside.interface";

const ClickOutsideWrapper = ({
	children,
	clickOutsideHandler,
	show,
	className,
}: ClickOutsideWrapperProps) => {
	return (
		<>
			{show && (
				<div
					className={className || "fixed w-screen h-screen top-0 left-0 z-[5]"}
					onClick={clickOutsideHandler}
				></div>
			)}
			{children}
		</>
	);
};

export default ClickOutsideWrapper;
