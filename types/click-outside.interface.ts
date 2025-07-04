import { PropsWithChildren } from "react";

export interface ClickOutsideWrapperProps extends PropsWithChildren {
	clickOutsideHandler: () => void;
	show: boolean;
	className?: string;
}
