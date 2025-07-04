export const CheckmarkSvg = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="mx-auto animate-jello origin-center text-onyx"
			height="100"
			width="100"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth="2"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline
				vectorEffect="non-scaling-stroke"
				fill="#EFBC73"
				stroke="currentColor"
				points="2 12 5.5 8.5 10.5 13.5 20 4 22 6 9 19 2 12"
			>
				<animate
					attributeName="points"
					dur=".65s"
					keyTimes="0;0.33;0.66;1"
					calcMode="spline"
					keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
					values="2 12 5.5 8.5 5.5 8.5 5.5 8.5 5.5 8.5 2 12 2 12; 2 12 5.5 8.5 10.5 13.5 10.5 13.5 12.5 15.5 9 19 2 12; 2 12 5.5 8.5 10.5 13.5 10.5 13.5 12.5 15.5 9 19 2 12; 2 12 5.5 8.5 10.5 13.5 20 4 22 6 9 19 2 12"
					repeatCount="once"
				></animate>
			</polyline>
			<polyline
				vectorEffect="non-scaling-stroke"
				fill="#409AF4"
				stroke="currentColor"
				points="2 12 4 10 9 15 18.5 5.5 20.5 7.5 9 19 2 12"
			>
				<animate
					attributeName="points"
					dur=".65s"
					keyTimes="0;0.33;0.66;1"
					calcMode="spline"
					keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
					values="2 12 4 10 4 10 4 10 4 10 2 12 2 12; 2 12 4 10 9 15 9 15 11 17 9 19 2 12; 2 12 4 10 9 15 9 15 11 17 9 19 2 12; 2 12 4 10 9 15 18.5 5.5 20.5 7.5 9 19 2 12"
					repeatCount="once"
				></animate>
			</polyline>
		</svg>
	);
};
