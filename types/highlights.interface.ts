import { ReactNode } from "react";

export interface IHighlights {
	name: string;
	number: string | number;
	desc: string;
	linkLabel: string;
	linkTo: string;
	subscript?: string;
	superscript?: string;
	InfoTooltip?: () => JSX.Element;
}
