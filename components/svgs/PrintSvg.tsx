export const PrintSvg = () => {
	return (
		<svg
			className="w-6 h-6"
			viewBox="0 0 24 24"
			strokeWidth="2"
			stroke="currentColor"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline
				vectorEffect="non-scaling-stroke"
				points="6 9 6 2 18 2 18 9"
			></polyline>
			<path
				vectorEffect="non-scaling-stroke"
				d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
			></path>
			<rect
				vectorEffect="non-scaling-stroke"
				x="6"
				y="14"
				width="12"
				height="8"
			></rect>
		</svg>
	);
};
