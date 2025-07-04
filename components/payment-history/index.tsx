import { useEffect, useMemo, useState } from "react";
import { ActivityType } from "../../constants/trade.enum";
import { useFactiivStore } from "../../store";
import { PaymentHistoryTableData } from "../../types/score-details.interface";
import { Activity, Trade } from "../../types/trade.interface";
import { dateToString } from "../../utils/date.utils";
import OverdueCalendar from "../overdue-calendar";
import PaymentHistoryTable from "../payment-history-table";
import { usePaymentHistory } from "../../hooks/usePaymentHistory";
import Tooltip from "../tooltip";

interface PaymentHistoryProps {
	trades: Trade[] | undefined;
	showFact?: boolean;
	showOverdueCalendar?: boolean;
	showExplanationTooltip?: boolean;
	showViewLink?: boolean;
	filter?: (activity: Activity) => boolean;
}

const PaymentHistory = ({
	trades,
	showFact = true,
	showOverdueCalendar = false,
	showExplanationTooltip = false,
	showViewLink = false,
	filter,
}: PaymentHistoryProps) => {
	const { numberOfLatePayments, activitiesData, onTimePayments } =
		usePaymentHistory(trades || [], filter);

	return (
		<>
			<h2
				id="payment-history"
				className="text-xl text-onyx font-medium dark:text-pearl-shade my-3"
			>
				{" "}
				payment history{" "}
				{showExplanationTooltip && (
					<Tooltip text="Payment history is about how often you pay on time. The more times you pay on time, the better your score will be."></Tooltip>
				)}
			</h2>
			<div className="max-w-sm mb-6">
				<div className="flex space-x-4 mb-2">
					<div className="rounded bg-gold-lighter flex-1 flex flex-col items-center py-2 border-2 border-onyx">
						<p className="font-extrabold text-sm sm:text-base">
							on-time payments
						</p>
						<p className="font-extrabold text-3xl">
							{Math.floor(Number(onTimePayments))}%
						</p>
					</div>
					<div className="rounded bg-gold-lighter flex-1 flex flex-col items-center py-2 border-2 border-onyx">
						<p className="font-extrabold text-sm sm:text-base">late payments</p>
						<p className="font-extrabold text-3xl">
							{numberOfLatePayments || 0}
						</p>
					</div>
				</div>
				{showFact && (
					<div className="relative mt-4">
						<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
							<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
								<b className="text-bold text-onyx px-1">fact</b>
							</p>
							<p>
								late payments can make you a greater risk to lenders
							</p>
						</div>
						<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
					</div>
				)}
			</div>
			{/* overdueCalendar */}
			{showOverdueCalendar && trades?.[0] && (
				<OverdueCalendar trade={trades[0]} />
			)}
			<div className="w-full overflow-x-auto bg-pearl rounded-md border-2 border-onyx">
				<PaymentHistoryTable
					data={activitiesData}
					showViewLink={showViewLink}
				></PaymentHistoryTable>
			</div>
			{!!activitiesData?.length && (
				<nav
					className="flex items-center justify-between px-4 py-3 sm:px-6"
					aria-label="Pagination"
				>
					<div className="hidden sm:block">
						<p className="text-sm text-gray-700">
							{" "}
							showing <span className="font-medium">1</span> to{" "}
							<span className="font-medium">{activitiesData.length}</span> of{" "}
							<span className="font-medium">{activitiesData.length}</span> items{" "}
						</p>
					</div>
					{/* {activitiesData.length > 6 && (
						<div className="flex flex-1 justify-between sm:justify-end">
							<a
								href="#"
								className="relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								previous
							</a>
							<a
								href="#"
								className="relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
							>
								next
							</a>
						</div>
					)} */}
				</nav>
			)}
		</>
	);
};

export default PaymentHistory;
