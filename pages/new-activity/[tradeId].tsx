import Head from "next/head";
import React, { PropsWithoutRef, useEffect, useMemo, useState } from "react";
//SVGs
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import useProtected from "../../hooks/useProtected";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { useFactiivStore } from "../../store";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import CalendarPicker from "../../components/calendar-picker";
import { Activity, Trade } from "../../types/trade.interface";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { ActivityType } from "../../constants/trade.enum";
import SearchTradelines from "../../components/search-tradelines";
import getConfig from "next/config";
import DaysLateBuckets from "./daysLateBuckets";
import useTrade from "../../hooks/useTrade";
import { isDate, isValid } from "date-fns";
import { LogoSvg } from "../../components/svgs/LogoSvg";

export async function getServerSideProps(context: any) {
	const { tradeId } = context?.params || {};

	return {
		props: {
			tradeId,
		},
	};
}

const NewActivity = ({ tradeId }: PropsWithoutRef<{ tradeId: string }>) => {
	useProtected();
	const store = useFactiivStore();
	// const { activeProfile } = store;
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const [isLoading, setIsLoading] = useState(false);
	const [activityType, setActivityType] = useState<ActivityType>(
		ActivityType.PAYMENT
	);
	// const [tradeId, setTradeId] = useState<string>();
	// const [tradeline, setTradeline] = useState<Trade>();

	const newActivityMutation = useMutation({
		mutationKey: "newActivity",
		mutationFn: async ({
			profileId,
			token,
			body,
		}: {
			profileId: string;
			token: string;
			body: string;
		}) => {
			try {
				const data = await refreshedFetch(`${apiUrl}/activities/${profileId}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body,
				});

				if (!data.ok) {
					setIsLoading(false);
					const error = await data.json();

					throw new Error(
						(Array.isArray(error?.errors) && error?.errors?.join?.("\n")) ||
							error?.message ||
							(typeof error === "string" && error)
					);
				}

				const tradeData = (await data?.json()) ?? null;

				if (!tradeData) {
					setIsLoading(false);
					throw new Error();
				}

				router.push("/new-activity-submitted");
			} catch (error) {
				const errorMessage = (error as Error)?.message;
				newActivityForm.setStatus(
					errorMessage || "There was an error with activity creation process."
				);

				setTimeout(() => {
					newActivityForm.setStatus("");
				}, 3000);
			}
		},
	});

	const newActivityValidationSchema = Yup.object().shape({
		tradeId: Yup.string().required("Tradeline is required"),
		activityDate: Yup.string().required("Date is required"),
		activityType: Yup.string(),
		daysLate: Yup.number().min(0).required("This is required"),
		paymentAmount: Yup.number().when("activityType", {
			is: ActivityType.PAYMENT,
			then: (schema) => schema.min(0).required("Payment amount is required"),
			otherwise: (schema) => schema.min(0),
		}),
		chargeAmount: Yup.number().when("activityType", {
			is: ActivityType.CHARGE,
			then: (schema) => schema.min(0).required("Charge is required"),
			otherwise: (schema) => schema.min(0),
		}),
		interest: Yup.number().when("activityType", {
			is: ActivityType.CHARGE,
			then: (schema) => schema.min(0).required("Interest is required"),
			otherwise: (schema) => schema.min(0),
		}),
	});

	const newActivityForm = useFormik({
		initialValues: {
			tradeId: "",
			activityDate: new Date().toISOString(),
			activityType: ActivityType.PAYMENT,
			daysLate: 0,
			paymentAmount: 0,
			chargeAmount: 0,
			interest: 0,
		},
		validationSchema: newActivityValidationSchema,
		validateOnChange: true,
		onSubmit: (values: Partial<Activity>) => {
			setIsLoading(true);
			const token = store.token;
			const profileId = store.activeProfile.id;

			if (!values || !trade?.id || !token || !profileId || isDateTaken) {
				setIsLoading(false);
				return;
			}

			const body = JSON.stringify({
				...values,
			});

			newActivityMutation.mutate({ profileId, token, body });
		},
	});

	const handleActivityTypeClick = (activityType: ActivityType) => {
		setActivityType(activityType);
		newActivityForm.setFieldValue("activityType", activityType);
	};

	const { data: trade, isLoading: isTradeLoading } = useTrade([tradeId]);

	const hasPendingActivity = useMemo(() => {
		return (
			trade?.activities?.some(
				(activity) => activity?.adminStatus?.toLowerCase() === "pending"
			) || false
		);
	}, [trade, trade?.activities]);

	const [isDateTaken, setIsDateTaken] = useState<boolean>(false);
	useEffect(() => {
		if (
			!newActivityForm.values.activityDate ||
			!isValid(new Date(newActivityForm.values.activityDate))
		) {
			return;
		}

		const { activities = [] } = trade || {};
		const datesTaken =
			activities.map((activity) => activity.activityDate.slice(0, 10)) || [];

		const selectedDateValue = newActivityForm.values.activityDate?.slice(0, 10);
		setIsDateTaken(datesTaken.includes(selectedDateValue));
	}, [trade, trade?.activities, newActivityForm.values.activityDate]);

	const handleSelectResult = (trade: Trade) => {
		if (!trade) return;

		newActivityForm.setFieldValue("tradeId", trade.id);
	};

	useEffect(() => {
		if (!tradeId) return;

		newActivityForm.setFieldValue("tradeId", tradeId);
	}, []);

	const renderPaymentForm = () => {
		return (
			<div id="payment" className={"fade-in "}>
				<p className="mt-3 mb-1 text-sm font-medium text-gray-500">
					days late
				</p>
				{trade && <DaysLateBuckets
					tradeDate={trade?.relationshipDate}
					onChange={(daysLate) =>
						newActivityForm.setFieldValue("daysLate", daysLate)
					}
				></DaysLateBuckets>}
				{newActivityForm.touched.daysLate && newActivityForm.errors.daysLate ? (
					<div className="text-red-500">
						{<>{newActivityForm.errors.daysLate}</>}
					</div>
				) : null}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
					<div>
						<p className="mb-1 text-sm font-medium text-gray-500">
							payment amount
						</p>
						<div>
							<div className="relative mt-1 rounded">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<span className="text-onyx">$</span>
								</div>
								<input
									type="text"
									className="block w-full rounded border-2 border-onyx pl-7 pr-12 py-2 focus:border-topaz focus:ring-topaz"
									placeholder="0"
									id="paymentAmount"
									name="paymentAmount"
									pattern="[0-9]+"
									onChange={newActivityForm.handleChange}
									onBlur={newActivityForm.handleBlur}
								/>
								<div className="absolute inset-y-0 right-0 flex items-center border-l-2 border-onyx">
									<label htmlFor="currency" className="sr-only">
										Currency
									</label>
									<select
										id="currency"
										name="currency"
										className="h-full rounded border-2 border-transparent bg-transparent py-0 pl-4 pr-7 text-onyx focus:border-topaz focus:ring-topaz"
									>
										<option>USD</option>
										<option>CAD</option>
									</select>
								</div>
							</div>
							{newActivityForm.touched.paymentAmount &&
							newActivityForm.errors.paymentAmount ? (
									<div className="text-red-500">
										{<>{newActivityForm.errors.paymentAmount}</>}
									</div>
								) : null}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderChargeForm = () => {
		return (
			<div id="charge" className={"fade-in "}>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
					<div>
						<p className="mb-1 text-sm font-medium text-gray-500">
							charge amount
						</p>
						<div>
							<div className="relative mt-1 rounded">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<span className="text-onyx">$</span>
								</div>
								<input
									type="text"
									className="block w-full rounded border-2 border-onyx pl-7 pr-12 py-2 focus:border-topaz focus:ring-topaz"
									placeholder="0"
									id="chargeAmount"
									name="chargeAmount"
									pattern="[0-9]+"
									onChange={newActivityForm.handleChange}
									onBlur={newActivityForm.handleBlur}
								/>
								<div className="absolute inset-y-0 right-0 flex items-center border-l-2 border-onyx">
									<label htmlFor="currency" className="sr-only">
										Currency
									</label>
									<select
										id="currency"
										name="currency"
										className="h-full rounded border-2 border-transparent bg-transparent py-0 pl-4 pr-7 text-onyx focus:border-topaz focus:ring-topaz"
									>
										<option>USD</option>
										<option>CAD</option>
									</select>
								</div>
							</div>
							{newActivityForm.touched.chargeAmount &&
							newActivityForm.errors.chargeAmount ? (
									<div className="text-red-500">
										{<>{newActivityForm.errors.chargeAmount}</>}
									</div>
								) : null}
						</div>
					</div>
					<div>
						<p className="mb-1 text-sm font-medium text-gray-500">interest</p>
						<div>
							<div className="relative mt-1 rounded">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<span className="text-onyx">$</span>
								</div>
								<input
									type="text"
									className="block w-full rounded border-2 border-onyx pl-7 pr-12 py-2 focus:border-topaz focus:ring-topaz"
									placeholder="0"
									id="interest"
									name="interest"
									onChange={newActivityForm.handleChange}
									onBlur={newActivityForm.handleBlur}
								/>
								<div className="absolute inset-y-0 right-0 flex items-center border-l-2 border-onyx">
									<label htmlFor="currency" className="sr-only">
										Currency
									</label>
									<select
										id="currency"
										name="currency"
										className="h-full rounded border-2 border-transparent bg-transparent py-0 pl-4 pr-7 text-onyx focus:border-topaz focus:ring-topaz"
									>
										<option>USD</option>
										<option>CAD</option>
									</select>
								</div>
							</div>
							{newActivityForm.touched.interest &&
							newActivityForm.errors.interest ? (
									<div className="text-red-500">
										{<>{newActivityForm.errors.interest}</>}
									</div>
								) : null}
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-pearl-shade dark:bg-onyx">
			<Head>
				<title>New activity | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full astro-UHFQUROE">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] astro-UHFQUROE">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 astro-UHFQUROE">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 astro-UHFQUROE">
						<LogoSvg />
					</div>
					<HeaderActions></HeaderActions>
					{/*  animate-fade-in */}
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 px-2 xs:px-4 sm:px-6 astro-UHFQUROE">
						<div className=" pb-12 astro-UHFQUROE">
							<main className="lg:px-6 w-full">
								<form onSubmit={newActivityForm.handleSubmit}>
									<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
										{" "}
										new activity{" "}
									</h2>
									<p className="mb-1 text-sm font-medium text-gray-500">
										choose a trade line
									</p>
									<SearchTradelines
										readOnly={true}
										disabled={true}
										preselectedTrade={trade}
										onSelectResult={handleSelectResult}
									></SearchTradelines>
									{newActivityForm.touched.tradeId &&
									newActivityForm.errors.tradeId ? (
											<div className="text-red-500">
												{<>{newActivityForm.errors.tradeId}</>}
											</div>
										) : null}
									<p className="mt-3 mb-1 text-sm font-medium text-gray-500">
										activity date
									</p>
									{trade && (
										<span id="control" className="w-full flex">
											<CalendarPicker
												minDate={trade?.relationshipDate}
												value={
													newActivityForm.values.activityDate ||
													new Date().toISOString().slice(0, 10)
												}
												onDateSelected={(dateString: string) => {
													newActivityForm.setFieldValue(
														"activityDate",
														dateString
													);
												}}
											></CalendarPicker>
										</span>
									)}
									{newActivityForm.touched.activityDate &&
									newActivityForm.errors.activityDate ? (
											<div className="text-red-500">
												{<>{newActivityForm.errors.activityDate}</>}
											</div>
										) : null}
									<p className="mt-3 mb-1 text-sm font-medium text-gray-500">
										activity type
									</p>
									<span id="control" className="w-full flex">
										<button
											id="activity-payment"
											onClick={() =>
												handleActivityTypeClick(ActivityType.PAYMENT)
											}
											type="button"
											className={
												"border-onyx relative inline-block items-center rounded-l text-center border-2 px-4 text-sm font-medium focus:z-10 focus:outline-none w-32 py-2 " +
												(activityType === ActivityType.PAYMENT
													? "bg-topaz text-white"
													: "text-onyx bg-white hover:bg-gray-50")
											}
										>
											payment
										</button>
										<button
											id="activity-carge"
											onClick={() =>
												handleActivityTypeClick(ActivityType.CHARGE)
											}
											type="button"
											className={
												"border-onyx relative -ml-px inline-block items-center text-center border-2 px-4 text-sm font-medium focus:z-10 focus:outline-none w-32 py-2 " +
												(activityType === ActivityType.CHARGE
													? "bg-topaz text-white"
													: "text-onyx bg-white hover:bg-gray-50")
											}
										>
											charge
										</button>
										<button
											id="activity-collections"
											onClick={() =>
												handleActivityTypeClick(ActivityType.COLLECTIONS)
											}
											type="button"
											className={
												"border-onyx relative inline-block items-center text-center border-2 px-4 text-sm font-medium focus:z-10 focus:outline-none w-32 py-2 " +
												(activityType === ActivityType.COLLECTIONS
													? "bg-red-500 text-white"
													: "text-onyx bg-white hover:bg-gray-50")
											}
										>
											collections
										</button>
										<button
											id="activity-chargeoff"
											onClick={() =>
												handleActivityTypeClick(ActivityType.CHARGEOFF)
											}
											type="button"
											className={
												"border-onyx relative -ml-px inline-block items-center rounded-r text-center border-2 px-4 text-sm font-medium focus:z-10 focus:outline-none w-32 py-2 " +
												(activityType === ActivityType.CHARGEOFF
													? "bg-red-500 text-white"
													: "text-onyx bg-white hover:bg-gray-50")
											}
										>
											charge-off
										</button>
									</span>
									{activityType === ActivityType.PAYMENT
										? renderPaymentForm()
										: null}
									{activityType === ActivityType.CHARGE
										? renderChargeForm()
										: null}
									<div className="mx-auto max-w-max mt-6">
										<button
											id="submit-activity"
											type="submit"
											disabled={
												!store?.activeProfile?.profileDataStatus ||
												isLoading ||
												isTradeLoading ||
												isDateTaken ||
												hasPendingActivity
											}
											className={`relative group block mt-1 animate-fade-in w-full ${
												!store?.activeProfile?.profileDataStatus ||
												isLoading ||
												isTradeLoading ||
												isDateTaken ||
												hasPendingActivity
													? "cursor-not-allowed opacity-50"
													: ""
											}`}
										>
											<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4 will-change-transform">
												submit
											</span>
											<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
										</button>
									</div>
									{newActivityForm.status && (
										<div className="mx-auto max-w-max flex justify-center mt-3">
											<h2 className="text-red-500 text-xl">
												{newActivityForm.status}
											</h2>
										</div>
									)}
									{isDateTaken && (
										<div className="mx-auto max-w-max flex justify-center mt-3">
											<p className="text-red-500">
												You cannot create two activities on the same date.
											</p>
										</div>
									)}
									{hasPendingActivity && (
										<div className="mx-auto max-w-max flex justify-center mt-3">
											<p className="text-red-500">
												{
													"This trade has a pending activity. Another activity can not be created until verification by an admin."
												}
											</p>
										</div>
									)}
								</form>
							</main>
						</div>
					</div>
					<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto astro-UHFQUROE">
						<div className="w-full mt-12">
							<div className="w-full sticky top-6">
								<div className="relative mt-4">
									<div className="bg-gold-lighter border-2 border-onyx rounded p-4 pt-6 relative z-[2]">
										<p className="absolute -top-2 -left-2 border-2 border-onyx rounded bg-gold">
											<b className="text-bold text-onyx px-1">fact</b>
										</p>
										<p>
											when you report a new trade the other party has the option
											to confirm or deny the details
										</p>
									</div>
									<div className="absolute -bottom-2 -right-2 bg-onyx h-full w-full rounded z-[1]"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewActivity;
