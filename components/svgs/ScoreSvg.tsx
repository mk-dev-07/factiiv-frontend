import React from "react";
import { useCountUp } from "react-countup";
export const ScoreSvg = ({ factiivScore = 0 }: { factiivScore?: number }) => {
	const countUpRef = React.useRef(null);
	useCountUp({
		ref: countUpRef,
		start: 0,
		end: factiivScore,
		delay: 1,
		duration: 2.5,
	});
	return (
		<>
			<svg viewBox="0 0 400 200" className="text-onyx-light">
				{/* POOR ICON */}
				{factiivScore <= 250 && (
					<g className="animate-fade-in">
						<circle
							cx="200.058"
							cy="91.499"
							r="21.64"
							fill="#f78e8a"
							stroke="currentColor"
							strokeMiterlimit="10"
							strokeWidth="1.249"
							vectorEffect="non-scaling-stroke"
						></circle>
						<line
							x1="208.722"
							y1="82.835"
							x2="191.394"
							y2="100.163"
							fill="none"
							stroke="currentColor"
							strokeLinejoin="round"
							strokeWidth="2.511"
							vectorEffect="non-scaling-stroke"
						></line>
						<line
							x1="208.722"
							y1="100.163"
							x2="191.394"
							y2="82.835"
							fill="none"
							stroke="currentColor"
							strokeLinejoin="round"
							strokeWidth="2.511"
							vectorEffect="non-scaling-stroke"
						></line>
					</g>
				)}
				{/* NEEDS IMPROVEMENT ICON */}
				{factiivScore > 250 && factiivScore <= 500 && (
					<g className="animate-fade-in">
						<circle
							cx="200.058"
							cy="91.271"
							r="21.64"
							fill="#eae58b"
							stroke="currentColor"
							strokeMiterlimit="10"
							strokeWidth="2.499"
							vectorEffect="non-scaling-stroke"
						></circle>
						<line
							x1="200.058"
							y1="79.958"
							x2="200.058"
							y2="95.089"
							fill="none"
							stroke="currentColor"
							strokeLinejoin="round"
							strokeWidth="2.511"
							vectorEffect="non-scaling-stroke"
						></line>
						<line
							x1="200.058"
							y1="99.083"
							x2="200.058"
							y2="102.585"
							fill="none"
							stroke="currentColor"
							strokeLinejoin="round"
							strokeWidth="2.511"
							vectorEffect="non-scaling-stroke"
						></line>
					</g>
				)}
				{/* LOOKING GOOD ICON */}
				{factiivScore > 500 && factiivScore <= 750 && (
					<g className="animate-fade-in">
						<circle
							cx="200.058"
							cy="91.271"
							r="21.64"
							fill="#bbed87"
							stroke="currentColor"
							strokeMiterlimit="10"
							strokeWidth="2.499"
							vectorEffect="non-scaling-stroke"
						></circle>
						<path
							d="M203.6,86.9V82.7a3.2,3.2,0,0,0-3.2-3.1L196.2,89v11.6h11.9a2.1,2.1,0,0,0,2.1-1.8l1.4-9.4a2,2,0,0,0-1.7-2.4h-6.3Zm-7.4,13.7H193a2.1,2.1,0,0,1-2.1-2.1V91.1A2.2,2.2,0,0,1,193,89h3.2"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
						></path>
					</g>
				)}
				{/* EXCELLENT ICON */}
				{factiivScore > 750 && factiivScore < 1000 && (
					<g className="animate-fade-in">
						<path
							d="M221.7,91.5c0,2.245-1.986,4.148-2.643,6.173-.682,2.1-.217,4.8-1.489,6.548-1.284,1.765-4.006,2.152-5.771,3.436-1.747,1.272-2.95,3.748-5.048,4.43-2.025.657-4.445-.618-6.689-.618s-4.664,1.275-6.689.618c-2.1-.682-3.3-3.158-5.049-4.43-1.764-1.284-4.487-1.671-5.771-3.436-1.271-1.747-.806-4.449-1.488-6.548-.658-2.025-2.644-3.928-2.644-6.173s1.986-4.147,2.644-6.173c.682-2.1.217-4.8,1.488-6.548,1.285-1.764,4.007-2.152,5.771-3.436,1.747-1.271,2.95-3.748,5.049-4.429,2.025-.658,4.444.617,6.689.617s4.664-1.275,6.689-.617c2.1.681,3.3,3.158,5.048,4.429,1.765,1.285,4.487,1.672,5.771,3.436,1.272,1.747.807,4.45,1.489,6.549C219.712,87.352,221.7,89.255,221.7,91.5Z"
							fill="#95f78b"
							stroke="currentColor"
							strokeMiterlimit="10"
							strokeWidth="2"
							vectorEffect="non-scaling-stroke"
						></path>
						<polyline
							points="191.033 91.734 197.527 98.072 209.082 84.927"
							fill="none"
							stroke="currentColor"
							strokeLinejoin="round"
							strokeWidth="2.499"
							vectorEffect="non-scaling-stroke"
						></polyline>
					</g>
				)}
				{/* INCREDIBLE ICON */}
				{factiivScore === 1000 && (
					<g className="animate-fade-in">
						<path
							d="M221.7,91.5c0,2.245-1.986,4.148-2.643,6.173-.682,2.1-.217,4.8-1.489,6.548-1.284,1.765-4.006,2.152-5.771,3.436-1.747,1.272-2.95,3.748-5.048,4.43-2.025.657-4.445-.618-6.689-.618s-4.664,1.275-6.689.618c-2.1-.682-3.3-3.158-5.049-4.43-1.764-1.284-4.487-1.671-5.771-3.436-1.271-1.747-.806-4.449-1.488-6.548-.658-2.025-2.644-3.928-2.644-6.173s1.986-4.147,2.644-6.173c.682-2.1.217-4.8,1.488-6.548,1.285-1.764,4.007-2.152,5.771-3.436,1.747-1.271,2.95-3.748,5.049-4.429,2.025-.658,4.444.617,6.689.617s4.664-1.275,6.689-.617c2.1.681,3.3,3.158,5.048,4.429,1.765,1.285,4.487,1.672,5.771,3.436,1.272,1.747.807,4.45,1.489,6.549C219.712,87.352,221.7,89.255,221.7,91.5Z"
							fill="#409af4"
							stroke="currentColor"
							strokeMiterlimit="10"
							strokeWidth="2"
							vectorEffect="non-scaling-stroke"
						></path>
						<polyline
							points="191.033 91.734 197.527 98.072 209.082 84.927"
							fill="none"
							stroke="white"
							strokeLinejoin="round"
							strokeWidth="2.499"
							vectorEffect="non-scaling-stroke"
						></polyline>
					</g>
				)}
				<path
					id="red"
					d="M91.5,91.5A152.965,152.965,0,0,0,46.55,200H2A197.411,197.411,0,0,1,59.99,59.99Z"
					fill="#f98f8a"
					stroke="currentColor"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
					strokeMiterlimit="1"
				></path>
				<path
					id="yellow"
					d="M200,46.55A152.965,152.965,0,0,0,91.5,91.5L59.99,59.99A197.411,197.411,0,0,1,200,2Z"
					fill="#efe9a3"
					stroke="currentColor"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
					strokeMiterlimit="1"
				></path>
				<path
					id="yellow-green"
					d="M340.007,60A197.351,197.351,0,0,0,200,2V46.55A152.985,152.985,0,0,1,308.507,91.5Z"
					fill="#bbed87"
					stroke="currentColor"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
					strokeMiterlimit="1"
				></path>
				<path
					id="green"
					d="M340.007,60A197.4,197.4,0,0,1,398,200h-44.55a153,153,0,0,0-44.94-108.5Z"
					fill="#95f78b"
					stroke="currentColor"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
					strokeMiterlimit="1"
				></path>
				<path
					className="fill-gold duration-1000 delay-[1000ms]"
					transform={`rotate(${0.18 * (factiivScore ?? 0)} 200 200)`}
					d="M398,200c0,109.359-88.64,198-198,198S2,309.357,2,200H46.55a153.449,153.449,0,1,0,306.9,0Z"
					stroke="currentColor"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
					strokeMiterlimit="1"
				></path>
				<path
					d="M200,2C90.65,2,2,90.65,2,200S90.65,398,200,398s198-88.647,198-198S309.353,2,200,2Zm0,351.447A153.449,153.449,0,1,1,353.45,200,153.448,153.448,0,0,1,200,353.45Z"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
					strokeMiterlimit="1"
				></path>
				<line
					x1="2.00488"
					y1="199.11181"
					x2="44.44"
					y2="199.11181"
					fill="none"
					stroke="#1e1c1c"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
				></line>
				<line
					x1="355.56455"
					y1="199.11181"
					x2="397.99967"
					y2="199.11181"
					fill="none"
					stroke="#1e1c1c"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
				></line>
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
				></text>
			</svg>
		</>
	);
};
