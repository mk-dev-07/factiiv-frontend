import { useState } from "react";
import { usePopper } from "react-popper";

const Tooltip = ({ text = "" }: { text: string }) => {
	if (!text) {
		return null;
	}

	const [referenceElement, setReferenceElement] =
		useState<HTMLButtonElement | null>(null);
	const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
		null
	);
	const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		modifiers: [{ name: "arrow", options: { element: arrowElement } }],
	});

	return (
		<span className="print:hidden text-topaz cursor-pointer relative align-middle text-xl inline-flex ">
			<button
				type="button"
				className="text-onyx cursor-default relative block group rounded-full w-5 h-5 peer overflow-visible inline"
				ref={setReferenceElement}
			>
				{/* Tooltip icon */}
				<svg
					viewBox="0 0 20 20"
					fill="currentColor"
					className="w-5 h-5 relative"
				>
					<path
						fillRule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
						clipRule="evenodd"
					></path>
				</svg>{" "}
				<div
					ref={setPopperElement}
					style={styles.popper}
					{...attributes.popper}
					className="absolute group-hover:visible z-10 invisible inline-block px-3 py-2 bottom-full left-0 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 w-64 tooltip dark:bg-gray-700"
				>
					{text}
					<div ref={setArrowElement} style={styles.arrow} />
				</div>
			</button>
		</span>
	);
};

export default Tooltip;
