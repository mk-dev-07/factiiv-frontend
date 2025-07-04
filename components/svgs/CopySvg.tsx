interface ICopy {
	copied: boolean;
}

export const CopySvg = ({ copied }: ICopy) => {
	return (
		<svg
			className="w-6 h-6 overflow-visible"
			viewBox="0 0 24 24"
			strokeWidth="2"
			stroke="currentColor"
			fill="none"
		>
			<g>
				<path d="M16 6h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"></path>
				<rect x="8" y="4" width="8" height="4" rx="1" ry="1"></rect>
			</g>
			<g id="check-icon" className={copied ? "" : "hidden"}>
				<path d="M2 2 l2 2 M12 -1 l0 3 M22 2 l-2 2 M8 14 l3 3 l5 -6"></path>
			</g>
		</svg>
	);
};
