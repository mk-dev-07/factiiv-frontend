import React from "react";
import { IAdminTrades } from "../../../types/adminTrades.interface";
import { ArrowRightSvg } from "../../svgs/ArrowRightSvg";

const AdminTradesCard = ({
	tradeId,
	reportingBusiness,
	receivingBusiness,
	balance,
	total,
	type,
	activityCard,
	date,
	status,
}: IAdminTrades) => {
	const createdAt: Date = new Date(date || "");

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	const formattedDate: string = createdAt.toLocaleDateString("en-US", options);
	return (
		<div
			className={
				"block hover:bg-gold-lighter " +
				(!status || status?.toLowerCase() === "pending"
					? ""
					: status.toLowerCase() === "accepted"
						? "bg-green-100"
						: "bg-red-100")
			}
		>
			<div className="flex items-center px-4 py-4 sm:px-6">
				<div className="flex min-w-0 flex-1 items-center">
					<div className="min-w-0 px-4 md:w-[600px] md:grid md:grid-cols-2 md:gap-12">
						<div>
							<p className="truncate text-lg font-bold text-onyx">
								{`[${("" + (status || "pending"))?.toUpperCase()}] `}
								trade ID: {tradeId}
							</p>
							<p className="mt-0 flex items-center text-sm text-onyx">
								<span className="truncate">
									reporting business: <b>{reportingBusiness}</b>
								</span>
							</p>
							<p className="mt-0 flex items-center text-sm text-onyx">
								<span className="truncate">
									receiving business: <b>{receivingBusiness}</b>
								</span>
							</p>
						</div>
						<div className="hidden md:block">
							<div className="mt-1">
								{activityCard ? (
									<p className="text-sm text-gray-900">
										date{" "}
										<time>
											<b>{formattedDate}</b>
										</time>
									</p>
								) : (
									<>
										<p className="text-sm text-gray-900">
											balance{" "}
											<time>
												<b>{balance}</b>
											</time>
										</p>
										<p className="mt-0 flex items-center text-sm text-onyx">
											total:&nbsp; <b>{total}</b>
										</p>
									</>
								)}
								<p className="mt-0 flex items-center text-sm text-onyx">
									type:&nbsp; <b>{type}</b>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div>
					<ArrowRightSvg styleProps="h-6 w-6 text-onyx" />
				</div>
			</div>
		</div>
	);
};

export default AdminTradesCard;
