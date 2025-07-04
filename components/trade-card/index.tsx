import Image from "next/image";
import React, { PropsWithoutRef, useCallback, useMemo, useState } from "react";
import { Trade } from "../../types/trade.interface";
import { dateToString } from "../../utils/date.utils";
import { ArrowUpRight } from "../svgs/ArrowUpRight";
import PlaceholderPic from "../../public/images/placeholder.png";
import { ActivityType, TradeRole, TradeType } from "../../constants/trade.enum";
import Link from "next/link";
import { useFactiivStore } from "../../store";
import InfoCircleSvg from "../svgs/InfoCircleSvg";
import PoorSvg from "../svgs/PoorSvg";
import getConfig from "next/config";
import { CheckmarkGreenSvg } from "../svgs/CheckmarkGreenSvg";

const TradeCard = ({
	trade,
	showSidebar = true,
	showDetailsButton = true,
	showInteractiveStatus = true,
	showRole = true,
	path,
}: PropsWithoutRef<{
	trade: Trade;
	showSidebar?: boolean;
	showDetailsButton?: boolean;
	showInteractiveStatus?: boolean;
	showRole?: boolean;
	path: string;
}>) => {
	const store = useFactiivStore();
	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	const showProfileImage = path.includes("connection-details");
	const showBusinessName = path.includes("connection-details");
	const {
		id: tradeId,
		relationshipDate: opened,
		updatedAt: lastActivity,
		typeDesc: tradeType,
		relationDescription: role,
		relationshipId,
		amount,
		balance,
		activities,
		toCompanyName,
		fromCompanyName,
		fromProfileId,
	} = trade;

	const dateFormat: Intl.DateTimeFormatOptions = {
		day: "numeric",
		month: "short",
		year: "numeric",
	};
	const creditUtilization = (parseInt(balance) / parseInt(amount)) * 100 || 0;
	const isBorrow = tradeType === TradeType.BORROW;
	const isTradeFromMe = fromProfileId === store.activeProfile.id;

	const [isInteractiveStatusOpen, setInteractiveStatusOpen] =
		useState<boolean>(false);

	const { paymentsCurrent, onTime, to30, to60, over60 } = useMemo(() => {
		if (
			trade?.adminStatus &&
			trade?.adminStatus?.toLowerCase() !== "accepted"
		) {
			return {
				paymentsCurrent: 0,
				onTime: 0,
				to30: 0,
				to60: 0,
				over60: 0,
			};
		}

		// const onTimeFromBalance =
		// 	Math.abs(parseInt(trade.amount ?? 0) - parseInt(trade.balance ?? 0)) /
		// 	parseInt(trade.amount ?? 1);
		const { total, ...values } = trade.activities
			.filter((activity) => activity.adminStatus?.toLowerCase() === "accepted")
			.filter((activity) => activity.activityType === ActivityType.PAYMENT)
			.reduce(
				(acc, activity) => {
					const value =
						(activity.paymentAmount ?? 0) / (parseInt(trade.amount) || 1);
					acc.total = acc.total + value;

					if (activity.daysLate > 30 && activity.daysLate <= 60) {
						return {
							...acc,
							to30: acc.to30 + value,
						};
					}

					if (activity.daysLate > 60 && activity.daysLate <= 90) {
						return {
							...acc,
							to60: acc.to60 + value,
						};
					}

					if (activity.daysLate > 90) {
						return {
							...acc,
							over60: acc.over60 + value,
						};
					}

					
					return {
						...acc,
						onTime: acc.onTime + value,
					};

					
				},
				{ onTime:0, to30: 0, to60: 0, over60: 0, total: 0 }
			);

		return {
			paymentsCurrent: total,
			...values,
		};
	}, [trade, trade.activities]);

	const { tradeStatus, adminStatus } = useMemo(() => {
		const { tradeStatus, adminStatus } = trade;
		return {
			tradeStatus: tradeStatus?.toLowerCase() ?? "pending",
			adminStatus: adminStatus?.toLowerCase() ?? "pending",
		};
	}, [trade]);

	const label = useCallback(
		(isFromProfileSetAsReportingBusiness: boolean) => {
			if (!trade) {
				return;
			}

			if (isFromProfileSetAsReportingBusiness) {
				if (
					trade?.typeDesc?.toLowerCase() === TradeType.BORROW &&
					trade.relationDescription?.toLowerCase() === TradeRole.BORROWER
				) {
					return "borrower";
				}

				if (
					trade?.typeDesc?.toLowerCase() === TradeType.BORROW &&
					trade.relationDescription?.toLowerCase() === TradeRole.LENDER
				) {
					return "lender";
				}

				if (
					trade?.typeDesc?.toLowerCase() === TradeType.BUYSELL &&
					trade.relationDescription?.toLowerCase() === TradeRole.BUYER
				) {
					return "buyer";
				}

				return "seller";
			} else {
				if (
					trade?.typeDesc?.toLowerCase() === TradeType.BORROW &&
					trade.relationDescription?.toLowerCase() === TradeRole.BORROWER
				) {
					return "lender";
				}
				if (
					trade?.typeDesc?.toLowerCase() === TradeType.BORROW &&
					trade.relationDescription?.toLowerCase() === TradeRole.LENDER
				) {
					return "borrower";
				}
				if (
					trade?.typeDesc?.toLowerCase() === TradeType.BUYSELL &&
					trade.relationDescription?.toLowerCase() === TradeRole.BUYER
				) {
					return "seller";
				}
				return "buyer";
			}
		},
		[trade]
	);

	return (
		<article className="border-2 border-onyx bg-pearl rounded-md overflow-hidden relative text-onyx">
			<div className="flex flex-col xs:flex-row">
				{showSidebar ? (
					<div className="bg-gray-400 bg-opacity-25 border-b-2 xs:border-r-2 xs:border-b-0 border-onyx">
						<p className="writing-vertical p-1 xs:p-0 inline-block xs:mb-auto xs:mt-2 xs:[writing-mode:vertical-lr] xs:rotate-180 w-6"></p>
					</div>
				) : null}
				<div className="px-4 pt-4 pb-6 flex-1 relative">
					{showInteractiveStatus && isInteractiveStatusOpen && (
						<div className="absolute block -top-[2px] left-0 right-0 bottom-0 bg-pearl z-[2] px-4 pt-2 w-full border-t-2 border-onyx">
							<span className="flex items-start justify-between">
								<span className="text-left flex flex-col">
									<span className="text-lg font-bold">payment status</span>{" "}
									<span>
										payments current:{" "}
										<b>{(paymentsCurrent * 100).toFixed(0)}%</b>
									</span>{" "}
									
									<span>
										on time: <b>{(onTime * 100).toFixed(0)}%</b>
									</span>
									<span>
										31-60 days beyond term: <b>{(to30 * 100).toFixed(0)}%</b>
									</span>
									<span>
										61-90 days beyond term: <b>{(to60 * 100).toFixed(0)}%</b>
									</span>
									<span>
										90+ days beyond term: <b>{(over60 * 100).toFixed(0)}%</b>
									</span>{" "}
								</span>{" "}
								<span onClick={() => setInteractiveStatusOpen(false)}>
									<span className="text-sm cursor-default">close</span>
								</span>
							</span>
						</div>
					)}
					<header className="flex items-start">
						{/* <pre>{JSON.stringify(trade, null, 2)}</pre> */}
						<div className="flex items-center justify-start space-x-3 pt-8 xs:pt-0 mr-auto object-fit">
							{!showProfileImage && (
								<img
									src={
										(isTradeFromMe && trade?.toProfilePhotoPath) ||
										(!isTradeFromMe && trade?.fromProfilePhotoPath)
											? (isTradeFromMe
											  	? trade?.toProfilePhotoPath
											  	: trade?.fromProfilePhotoPath)
											: PlaceholderPic.src
									}
									className="w-12 h-12 flex-none object-cover border-2 border-onyx rounded-full hidden xs:block"
									alt="Profile picture"
									style={{ objectFit: "cover" }}
								/>
							)}

							<div>
								{!showBusinessName && (
									<h3 className="font-bold text-xl">
										{isTradeFromMe ? toCompanyName : fromCompanyName}
									</h3>
								)}
								<p className="text-sm">
									opened{" "}
									<strong>{dateToString(new Date(opened), dateFormat)}</strong>
								</p>
							</div>
						</div>
						<div className="flex items-center justify-end space-x-3 pt-8 xs:pt-0">
							{isTradeFromMe ? (
								<span className="bg-topaz rounded px-2 py-1 text-pearl">
									initiated
								</span>
							) : (
								<span className="bg-gold rounded px-2 py-1">received</span>
							)}
						</div>
						{tradeStatus !== "pending" || adminStatus !== "pending" ? (
							<div className="h-8 w-8 ml-4">
								{tradeStatus === "accepted" && adminStatus !== "accepted" && (
									<PoorSvg></PoorSvg>
								)}
								{adminStatus === "accepted" && (
									<CheckmarkGreenSvg className=""></CheckmarkGreenSvg>
								)}
							</div>
						) : null}
					</header>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-base mt-4 mb-3 md:gap-6">
						{showInteractiveStatus &&
						adminStatus &&
						adminStatus.toLowerCase() !== "rejected" ? (
								<button
									id="interactive-status-open"
									onClick={() => setInteractiveStatusOpen(true)}
									className="flex justify-between items-center hover:bg-pearl-shade rounded-md px-2 border-2 border-pearl-shade"
								>
									<span className="text-left block">
										<p className="font-bold">status</p>
										{adminStatus ? <p className={`font-bold ${adminStatus.toLowerCase() === "pending" ? "text-yellow-500" : "text-green-500"}`} >{adminStatus}</p> : null}
									</span>
									<span>
										<InfoCircleSvg></InfoCircleSvg>
									</span>
								</button>
							) : (
								<div className="text-left block px-2">
									<p className="font-bold">status</p>
									{adminStatus ? <p 
										className={`font-bold ${(adminStatus.toLowerCase() === "pending") ? "text-yellow-500" : (adminStatus.toLowerCase() === "accepted" ?"text-green-500" : "text-red-500")}`}
									>{adminStatus}</p> : null}
								</div>
							)}

						<div className="px-2">
							<p className="font-bold">
								{" "}
								{isBorrow ? "high credit limit" : "total cost"}
							</p>
							<p>
								<span>$</span>
								<span>{Math.floor(Number(amount))}</span>
							</p>
						</div>
						<div className="px-2">
							<p className="font-bold">outstanding balance</p>
							<p>
								<span>$</span>
								<span>{Math.floor(Number(balance))}</span>
							</p>
						</div>
						{isBorrow ? (
							<div className="px-2">
								<p className="font-bold">credit utilization</p>
								<p>{Math.ceil(Number(creditUtilization))}%</p>
							</div>
						) : null}
						<div className="px-2">
							<p className="font-bold">
								trade type {showRole ? " / your role" : ""}
							</p>
							<p>
								{tradeType?.toLowerCase() === TradeType.BUYSELL
									? "buy/sell"
									: tradeType.toLowerCase()}
								{showRole ? " / " + label(isTradeFromMe) : ""}
							</p>
						</div>
						<div className="px-2">
							<p className="font-bold">last activity</p>
							<p>{dateToString(new Date(lastActivity), dateFormat)}</p>
						</div>
						<div className="px-2">
							<p className="font-bold">tradeID</p>
							<p>{relationshipId}</p>
						</div>
						{!isBorrow ? <div className="px-2"></div> : null}
						{showDetailsButton ? (
							<div className="px-2 flex items-end">
								<Link
									href={{
										pathname: `/trade-details/${tradeId}`,
									}}
									as={`/trade-details/${tradeId}`}
									className="grid group w-full"
								>
									<span className="bg-onyx w-full rounded will-change-transform col-end-2 row-start-1 row-end-2"></span>
									<span className="bg-onyx group-hover:-translate-y-1 will-change-transform group-hover:bg-topaz focus:-translate-y-1 focus:bg-topaz focus:outline-none border-2 transition-transform duration-150 border-onyx text-white rounded py-1 text-lg pl-4 pr-2 w-full flex items-center justify-between col-end-2 row-start-1 row-end-2">
										details
										<ArrowUpRight></ArrowUpRight>
									</span>
								</Link>
							</div>
						) : null}
					</div>
				</div>
			</div>
			<footer className="absolute bottom-0 left-0 right-0 w-full group z-[3]">
				<div className="bg-pearl dark:bg-onyx h-4 w-full rounded-sm relative overflow-hidden box-border">
					<div
						className="w-full h-4 border-r-2 duration-1000 delay-[2000ms] border-onyx-light absolute bg-gold"
						style={{
							...(creditUtilization
								? { transform: `translate(-${creditUtilization}%)` }
								: {}),
						}}
					></div>
					<div className="w-full h-4 border-t-2 border-onyx-light absolute inset-0"></div>
				</div>
			</footer>
		</article>
	);
};

export default TradeCard;
