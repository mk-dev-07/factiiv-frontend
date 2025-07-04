import React from "react";
import { useCountUp } from "react-countup";

export const HeighlightRangeSvg = ({
	value, highRange, label
}: {
	value: number,
    highRange: number,
    label: string | undefined,
}) => {
	const countUpRef = React.useRef(null);
	useCountUp({
		ref: countUpRef,
		start: 0,
		end: value,
		delay: 1,
		duration: 2.5,
	});
	return (
		<svg viewBox="0 0 400 200" className="text-onyx-light ">
			<path
				id="red"
				d="M91.5,91.5A152.965,152.965,0,0,0,46.55,200H2A197.411,197.411,0,0,1,59.99,59.99Z"
				fill="#f98f8a"
				stroke="currentColor"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
				strokeMiterlimit="1"
			/>
			<path
				id="yellow"
				d="M200,46.55A152.965,152.965,0,0,0,91.5,91.5L59.99,59.99A197.411,197.411,0,0,1,200,2Z"
				fill="#f98f8a"
				stroke="currentColor"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
				strokeMiterlimit="1"
			/>
			<path
				id="yellow-green"
				d="M340.007,60A197.351,197.351,0,0,0,200,2V46.55A152.985,152.985,0,0,1,308.507,91.5Z"
				fill="#f98f8a"
				stroke="currentColor"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
				strokeMiterlimit="1"
			/>
			<path
				id="green"
				d="M340.007,60A197.4,197.4,0,0,1,398,200h-44.55a153,153,0,0,0-44.94-108.5Z"
				fill="#f98f8a"
				stroke="currentColor"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
				strokeMiterlimit="1"
			/>
			<path
				className="fill-topaz duration-1000 delay-[1000ms]"
				transform={`rotate(${1.8 * highRange} 200 200)`}
				d="M398,200c0,109.359-88.64,198-198,198S2,309.357,2,200H46.55a153.449,153.449,0,1,0,306.9,0Z"
				stroke="currentColor"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
				strokeMiterlimit="1"
			/>
			<path
				d="M200,2C90.65,2,2,90.65,2,200S90.65,398,200,398s198-88.647,198-198S309.353,2,200,2Zm0,351.447A153.449,153.449,0,1,1,353.45,200,153.448,153.448,0,0,1,200,353.45Z"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
				strokeMiterlimit="1"
			/>
			<line
				x1="2.00488"
				y1="199.11181"
				x2="44.44"
				y2="199.11181"
				fill="none"
				stroke="#1e1c1c"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
			/>
			<line
				x1="355.56455"
				y1="199.11181"
				x2="397.99967"
				y2="199.11181"
				fill="none"
				stroke="#1e1c1c"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
			/>
			<text
				className="font-bold font-prox text-8xl text-onyx dark:text-pearl-shade"
				textAnchor="middle"
				fill="currentColor"
				dominantBaseline="bottom"
				x="200"
				y="190"
				style={{
					fontWeight: 800,
				}}
				ref={countUpRef}
			>
			</text>
			<text className="text-4xl" stroke="currentColor" x="290" y="150">
				{label}
			</text>
		</svg>
	);
};
