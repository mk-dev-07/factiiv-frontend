import Link from "next/link";
import React from "react";
import { IHighlights } from "../../types/highlights.interface";
import { ArrowUpRight } from "../svgs/ArrowUpRight";
import { HeighlightRangeSvg } from "../svgs/HeighlightRangeSvg";
import { useRouter } from "next/router";
import HighlightNumberSvg from "../svgs/HighlightNumberSvg";

const mapSuperscriptSubscript = (value: string | undefined): string => {
	switch(value){
	case "hours":
		return "H";
	case "days":
		return "D";
	case "months":
		return "M";
	case "years":
		return "Y";
	case "%":
		return "%";
	default:
		return  "";
	}
};

const HighlightCard = ({
	name,
	number,
	desc,
	linkLabel,
	linkTo,
	subscript,
	superscript,
	InfoTooltip: TooltipChild,
}: IHighlights) => {
	const router = useRouter();
	return (
		<div className="rounded-lg bg-pearl dark:bg-onyx-light border-2 border-onyx-light font-prox">
			<div className="p-2 h-full w-full focus:outline-none flex flex-col">
				<h2 className="text-xl font-medium text-onyx dark:text-pearl-shade text-center">
					{name}{" "}
					{TooltipChild ? <TooltipChild /> : null}
				</h2>
				<div className="flex-1 flex flex-col items-center justify-center py-6 xl:py-10">
					{
						router.pathname.includes("/admin") ? (
							<HighlightNumberSvg
								number={number}
								superscript={superscript}
								subscript={subscript}
							/>
						) : (
							<HeighlightRangeSvg 
								value={Number(number)} 
								highRange={(Number(number) && (name === "factiivity" || name === "credit age")) ? 75 : Number(number) } 
								label={mapSuperscriptSubscript(subscript|| superscript)}
							/>
						)
					}
					
					<p className="xs:text-lg font-medium xl:text-sm 2xl:text-lg">{desc}</p>
				</div>
				<div className="mt-auto w-full">
					<Link href={linkTo} className="grid group flex-1 w-full">
						<span className="bg-onyx rounded will-change-transform col-end-2 row-start-1 row-end-2"></span>
						<span className="bg-onyx group-hover:-translate-y-1 will-change-transform group-hover:bg-topaz focus:-translate-y-1 focus:bg-topaz focus:outline-none border-2 transition-transform duration-150 border-onyx text-white rounded py-1 text-lg pl-4 pr-2 w-full flex items-center justify-between col-end-2 row-start-1 row-end-2">
							{linkLabel}
							<ArrowUpRight />
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default HighlightCard;
