import Link from "next/link";
import React from "react";
import { ArrowUpRight } from "../svgs/ArrowUpRight";
import { useRouter } from "next/router";
import { IQueueCardItem, IQueueCardProps } from "../../types/queuecard.interface";

const list: IQueueCardItem[] = [
	{count: 200, lable: "Awaiting review", link: "/"},
	{count: 200, lable: "Approved", link: "/"},
	{count: 200, lable: "Rejected", link: "/"},
];

const QueueCard = ({
	name,
	linkLabel,
	linkTo,
	itemList = list,
	InfoTooltip: TooltipChild,
}: IQueueCardProps) => {
	const router = useRouter();
	return (
		<div className="rounded-lg bg-pearl dark:bg-onyx-light border-2 border-onyx-light font-prox">
			<div className="p-2 h-full w-full focus:outline-none flex flex-col">
				<h2 className="text-xl font-medium text-onyx dark:text-pearl-shade text-center">
					{name}{" "}
					{TooltipChild ? <TooltipChild /> : null}
				</h2>
				<div className="flex-1 flex flex-col items-center justify-end py-3 mt-6 space-y-2">
					{
						itemList?.map((item: IQueueCardItem, index: number) => (
							<Link 
								key={`${item.count}${index}`} 
								href={item.link} 
								className={`border-2 border-onyx rounded w-full p-3 ${item.lable.toLowerCase() === "approved" ? "bg-green-200" : item.lable.toLowerCase() === "rejected" ? "bg-red-200" : "bg-topaz-lighter"}`}
							>
								<b>{item.count}</b><span className="pl-2">{item.lable}</span>
							</Link>
						))
					}
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

export default QueueCard;
