export const InfoSvg = () => {
	return (
		<svg
			className="h-6 w-6 text-onyx rounded-full"
			viewBox="0 0 24 24"
			stroke="none"
			fill="none"
		>
			<circle
				cx="12"
				cy="12"
				r="10.5"
				strokeWidth="2"
				stroke="currentColor"
			></circle>
			<circle
				className="text-onyx"
				fill="currentColor"
				cx="12"
				cy="7"
				r="1.5"
			></circle>
			<path
				className="text-onyx"
				fill="none"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
				stroke="currentColor"
				d="M9 12 h3 v7"
			></path>
		</svg>
	);
};
