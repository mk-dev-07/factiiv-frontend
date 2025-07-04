import React from "react";

const HighlightNumberSvg = ({
	number = 0,
	superscript,
	subscript,
}: {
	number: number | string;
	superscript?: string;
	subscript?: string;
}) => {
	return (
		<svg viewBox="0 0 50 15">
			<text
				className="font-extrabold text-lg text-onyx dark:text-pearl-shade fill-current"
				x="50%"
				y="65%"
				dominantBaseline="middle"
				textAnchor="middle"
			>
				{isNaN(parseInt(number + "")) ? 0 : number}
				{superscript && (
					<tspan className="text-[8px]" baselineShift="super">
						{superscript}
					</tspan>
				)}
				{subscript && (
					<tspan className="text-[4px]" baselineShift="sub">
						{subscript}
					</tspan>
				)}
			</text>
		</svg>
	);
};

export default HighlightNumberSvg;
