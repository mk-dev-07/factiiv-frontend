import React from "react";

const BankSvg = () => {
	return (
		<svg
			strokeWidth="1.5"
			viewBox="0 0 24 24"
			className="h-6 w-6 lg:h-8 lg:w-8 flex-none transition-transform"
		>
			<path
				fill="none"
				stroke="currentColor"
				strokeMiterlimit="10"
				d="M4.71 20.29h14.58m-14.58-2.9h14.58"
			></path>
			<path
				fill="none"
				stroke="currentColor"
				strokeLinejoin="round"
				d="m12 3.71 7.29 4.57H4.71L12 3.71z"
			></path>
			<path
				d="M6.9 17.39V9.67m3.4 7.72V9.67m3.4 7.72V9.67m3.4 7.72V9.67"
				fill="none"
				stroke="currentColor"
				strokeMiterlimit="10"
			></path>
		</svg>
	);
};

export default BankSvg;
