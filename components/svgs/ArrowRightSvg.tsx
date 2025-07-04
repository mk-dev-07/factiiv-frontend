export const ArrowRightSvg = ({ styleProps }: { styleProps: string }) => {
	return (
		<svg
			className={styleProps}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			aria-hidden="true"
		>
			<polyline strokeWidth="2" points="9 6 15 12 9 18"></polyline>
		</svg>
		// <svg className={styleProps} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
		//     <polyline vectorEffect="non-scaling-stroke" points="15 6 9 12 15 18"></polyline>
		// </svg>
	);
};
