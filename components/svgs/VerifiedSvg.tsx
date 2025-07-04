import { PropsWithoutRef } from "react";

const VerifiedSvg = ({
	className,
}: PropsWithoutRef<{ className?: string }>) => {
	return (
		<svg
			className={className || "h-8 w-8"}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
		>
			<g>
				<path
					fill="#95f78b"
					stroke="currentColor"
					strokeMiterlimit="10"
					strokeWidth="2"
					d="M19.583 10.048c0 1.006-.89 1.86-1.185 2.767-.305.94-.097 2.15-.667 2.934-.575.79-1.795.964-2.586 1.54-.783.57-1.322 1.68-2.262 1.985-.908.294-1.992-.277-2.998-.277-1.005 0-2.09.571-2.997.277-.941-.306-1.48-1.415-2.263-1.985-.79-.576-2.01-.75-2.586-1.54-.57-.783-.361-1.994-.667-2.934-.295-.908-1.185-1.76-1.185-2.767 0-1.006.89-1.858 1.185-2.766.306-.941.097-2.151.667-2.934.576-.79 1.796-.965 2.586-1.54.783-.57 1.322-1.68 2.263-1.985.907-.295 1.991.277 2.997.277 1.006 0 2.09-.572 2.998-.277.94.305 1.479 1.415 2.262 1.985.79.576 2.01.75 2.586 1.54.57.782.362 1.994.667 2.934.294.907 1.185 1.76 1.185 2.766Z"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					fill="none"
					stroke="currentColor"
					strokeLinejoin="round"
					strokeWidth="2.499"
					d="m5.84 10.153 2.91 2.84 5.178-5.89"
					vectorEffect="non-scaling-stroke"
				/>
			</g>
		</svg>
	);
};

export default VerifiedSvg;
