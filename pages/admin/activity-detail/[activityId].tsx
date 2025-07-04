import { useFormik } from "formik";
import * as Yup from "yup";
import Head from "next/head";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import { LogoAdminSvg } from "../../../components/svgs/LogoAdminSvg";
import SwitchSvg from "../../../components/svgs/SwitchSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { useAdminStore } from "../../../store";
import { Activity, Trade } from "../../../types/trade.interface";
import getConfig from "next/config";
import LoadingOverlay from "../../../components/loading-overlay";
import dynamic from "next/dynamic";
import { ActivityType } from "../../../constants/trade.enum";
import { daysLateLabel } from "../../../utils/data.utils";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";

export async function getServerSideProps(context: any) {
	const { activityId } = context.params;
	

	return {
		props: {
			urlActivityId: activityId,
		}, // will be passed to the page component as props
	};
}

const ActivityDetail = ({ urlActivityId }: { urlActivityId: string }) => {
	const adminStore = useAdminStore();
	const router = useRouter();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	//GET ACTIVITY ID
	const [activityId, setActivityId] = useState("");
	useEffect(() => {
		setActivityId(() => urlActivityId);
	});

	//FETCH ACTIVITY DATA
	const fetchActivity = async () => {
		try {
			const response = await fetch(
				`${apiUrl}/admins/activities/${activityId}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${adminStore.token}`,
					},
				}
			);
			const data = await response.json();
			return data.payload;
		} catch (error) {
			console.error(error);
		}
	};

	const { isLoading, data: activity } = useQuery({
		queryKey: ["activities", activityId],
		queryFn: fetchActivity,
		onSuccess: (activity: Activity) => {
			if (!activity) {
				return {};
			}
			return activity;
		},
		onError: (error) => {
			console.log(error);
		},
		enabled: !!activityId,
	});

	//FETCH TRADES
	const fetchTrades = async () => {
		try {
			const response = await refreshedFetch(
				`${apiUrl}/admins/trades/${activity?.tradeId}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${adminStore.token}`,
					},
				}
			);
			const data = await response.json();
			return data.payload;
		} catch (error) {
			console.error(error);
		}
	};

	const { data: trade } = useQuery({
		queryKey: ["trade", activity?.tradeId],
		queryFn: fetchTrades,
		onSuccess: (trade: Trade) => trade,
		onError: (error) => {
			console.log(error);
			formik.setStatus(
				"There was an error geting reporting and receiving business data!"
			);
			enqueueSnackbar("There was an error geting reporting and receiving business data!", {
				variant: "error"
			});
			setTimeout(() => {
				formik.setStatus("");
			}, 3000);
		},
		enabled: !!activity?.tradeId,
	});

	//FORM STATES
	const [reportingBusiness, setReportingBusiness] = useState("");
	const [receivingBusiness, setReceivingBusiness] = useState("");
	const [reportingBusinessId, setReportingBusinessId] = useState("");
	const [receivingBusinessId, setReceivingBusinessId] = useState("");

	const [adminChecked, setAdminChecked] = useState(true);
	useEffect(() => {
		if (!trade) {
			return;
		}

		setReportingBusiness(trade.fromCompanyName);
		setReceivingBusiness(trade.toCompanyName);
		setReportingBusinessId(trade.fromProfileId);
		setReceivingBusinessId(trade.toProfileId);
	}, [trade]);

	const handleSwitch = () => {
		setReportingBusiness(receivingBusiness);
		setReportingBusinessId(receivingBusinessId);
		setReceivingBusiness(reportingBusiness);
		setReceivingBusinessId(reportingBusinessId);
	};

	//VALIDATE FORM INPUT
	const formik = useFormik({
		initialValues: {
			reportingBusiness: trade?.fromCompanyName || "",
			receivingBusiness: trade?.toCompanyName || "",
			activityType: activity?.activityType ?? ActivityType.PAYMENT,
			activityDate: activity?.activityDate?.slice(0, 10),
			createdAt: activity?.createdAt?.slice(0, 10),
			amount:
				activity?.activityType === "payment"
					? Math.floor(activity?.paymentAmount) || ""
					: (activity?.chargeAmount && Math.floor(activity?.chargeAmount)) ||
					  "",
			interest:
				(activity?.activityType === "charge" &&
					Math.floor(activity?.interest)) ||
				"",
			status: activity?.activityStatus || "pending",
			daysLate: activity?.daysLate ?? 0,
			adminChecked:
				activity?.adminStatus?.toLowerCase() === "accepted" || false,
			adminStatus: activity?.adminStatus?.toLowerCase?.()
		},
		enableReinitialize: true,
		validationSchema: Yup.object({
			activityType: Yup.string()
				.oneOf(
					[
						ActivityType.PAYMENT,
						ActivityType.CHARGE,
						ActivityType.COLLECTIONS,
						ActivityType.CHARGEOFF,
					],
					"activity type must be one of the following: payment, charge, collections, or charge-off"
				)
				.required("please, enter activity type"),
			activityDate: Yup.string().required("please, enter date of activity"),
			amount: Yup.number().when("activityType", {
				is: (value: ActivityType) =>
					value === ActivityType.PAYMENT || value === ActivityType.CHARGE,
				then: () => Yup.number().required("please, enter valid amount"),
				otherwise: () => Yup.number(),
			}),
			interest: Yup.number().when("activityType", {
				is: (value: ActivityType) => value === ActivityType.CHARGE,
				then: () => Yup.number().required("please, enter valid interest"),
				otherwise: () => Yup.number(),
			}),
			adminChecked: Yup.boolean(),
			daysLate: Yup.string()
				.oneOf(["0", "31", "61", "91"], "please, select a valid value")
				.required("please, select a value for days late"),
		}),
		onSubmit: (values) => {
			const activityDate = new Date(values?.activityDate || new Date());
			const date = activityDate.toISOString();

			const updateRequestBody = {
				activityId: activityId,
				reportingBusiness: reportingBusinessId,
				receivingBusiness: receivingBusinessId,
				activityType: values.activityType,
				activityDate: date,
				paymentAmount:
					values.activityType === "payment"
						? parseInt(values.amount + "") || 0
						: 0,
				chargeAmount:
					values.activityType === "charge"
						? parseInt(values.amount + "") || 0
						: 0,
				interest: parseInt(values.interest + "") || 0,
				status: values.adminStatus?.toLowerCase() == "pending" ? "pending" : ( values.adminChecked ? "accepted" : "rejected"),
				daysLate:
					values.activityType === ActivityType.PAYMENT
						? parseInt(values.daysLate + "") ?? -1
						: -1,
			};
			updateActivity(updateRequestBody);
		},
	});

	//SET INTEREST TO 0 IF ACTIVITY TYPE = PAYMENT
	useEffect(() => {
		if (formik.values.activityType === ActivityType.PAYMENT) {
			formik.setFieldValue(
				"amount",
				formik.values.amount || activity?.paymentAmount || ""
			);
			formik.setFieldValue("interest", "");
			return;
		}

		if (formik.values.activityType === ActivityType.CHARGE) {
			formik.setFieldValue(
				"amount",
				formik.values.amount || activity?.chargeAmount || ""
			);
			formik.setFieldValue("interest", "");
			return;
		}

		if (
			[ActivityType.COLLECTIONS, ActivityType.CHARGEOFF].includes(
				formik.values.activityType
			)
		) {
			formik.setFieldValue("amount", "");
			formik.setFieldValue("interest", "");
			return;
		}
	}, [formik.values.activityType]);

	//UPDATE REQUEST
	interface IUpdateActivity {
		activityId: string;
		reportingBusiness: string;
		receivingBusiness: string;
		activityType: string;
		activityDate: string;
		paymentAmount: number;
		chargeAmount: number;
		interest: number;
		status: string;
	}
	const putActivity = async (data: IUpdateActivity) => {
		const response = await fetch(`${apiUrl}/admins/activities/status`, {
			method: "PUT",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${adminStore.token}`,
			},
		});

		const { payload: updatedTrade, errors } = await response.json();

		if (!response.ok) {
			formik.setStatus(
				errors?.[0] || "something went wrong, please try again!"
			);
			enqueueSnackbar(errors?.[0] || "something went wrong, please try again!", {
				variant: "error"
			});
			setTimeout(() => {
				formik.setStatus("");
			}, 3000);
			throw new Error(`HTTP error! status: ${response.status}`);
		} else {
			formik.setStatus("activity updated successfully!");
			enqueueSnackbar("activity updated successfully!", {
				variant: "success"
			});
			setTimeout(() => {
				formik.setStatus("");
			}, 3000);
		}
		return updatedTrade;
	};

	const isChargeOrPayment = useMemo(
		() => ["charge", "payment"].includes(formik.values.activityType),
		[formik.values.activityType]
	);

	const { isLoading: isSubmitting, mutate: updateActivity } =
		useMutation(putActivity);

	const isFromProfileSetAsReportingBusiness = useMemo(() => {
		return reportingBusinessId === trade?.fromProfileId;
	}, [reportingBusinessId]);

	const label = (isFromProfileSetAsReportingBusiness: boolean) => {
		if (isFromProfileSetAsReportingBusiness) {
			if (
				trade?.typeDesc === "borrow" &&
				trade.relationDescription === "borrower"
			)
				return "borrower";
			if (
				trade?.typeDesc === "borrow" &&
				trade.relationDescription === "lender"
			)
				return "lender";
			if (
				trade?.typeDesc === "buysell" &&
				trade.relationDescription === "buyer"
			)
				return "buyer";
			else return "seller";
		} else {
			if (
				trade?.typeDesc === "borrow" &&
				trade.relationDescription === "borrower"
			)
				return "lender";
			else if (
				trade?.typeDesc === "borrow" &&
				trade.relationDescription === "lender"
			)
				return "borrower";
			else if (
				trade?.typeDesc === "buysell" &&
				trade.relationDescription === "buyer"
			)
				return "seller";
			else return "buyer";
		}
	};

	const updateStatus = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (!value) {
			return;
		}

		formik.setFieldValue("status", value === "<tru></tru>e" ? "accepted" : "rejected"
		);
		formik.setFieldValue("adminStatus", value === "<tru></tru>e" ? "accepted" : "rejected");
	};

	// DELETE ACTIVITY
	const handleDelete = async (id: string) => {
		try {
			await refreshedFetch(`${apiUrl}/admins/activities/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
				body: JSON.stringify({ adminId: id }),
			});

			await refreshedFetch(`${apiUrl}/admins/compute-score/${activity?.tradeId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
			});


			router.push("/admin/dashboard");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full"
		>
			<Head>
				<title>Activity detail | factiiv</title>
			</Head>
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
				<div className="row-span-2 hidden h-full md:block">
					<AdminSidebar />
				</div>
				<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
					{/* <Search client:visible /> */}
				</div>
				<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
					<LogoAdminSvg />
				</div>
				<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6">
					<MobileNav />
				</div>
				{/* MAIN */}
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
					<div className="pb-12">
						<main className="lg:px-6 w-full">
							<div className="mb-4 astro-3BGDRPPS">
								<Link target="_blank"
									href={`/admin/trade-detail/${activity?.tradeId}`}
									className="font-medium text-lg astro-3BGDRPPS"
								>
									activity for trade ID: {activity?.tradeId}
								</Link>
							</div>
							<div className="flex justify-between items-stretch mb-3">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-auto">
									<span className="border-2 border-onyx bg-gold-light p-2 rounded astro-3BGDRPPS h-[50px] inline-block">activity</span> detail
								</h2>
								<button
											type="button"
											onClick={() => handleDelete(activityId)}
											id="admin-detail-delete-user"
											className="inline-flex justify-center items-center rounded border border-transparent bg-red-400 py-2 px-4 font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
										>
											delete activity
										</button>
								<Link
									target="_blank"
									href={`/admin/trade-detail/${activity?.tradeId}`}
									className="py-1 border-2 border-onyx flex items-center px-3 hover:bg-onyx/10 rounded"
								>
									← view trade
								</Link>
							</div>
							<form
								onSubmit={formik.handleSubmit}
								className="relative border-2 border-onyx target:border-topaz rounded-md p-2 lg:p-6 mb-6 bg-gold-light"
							>
								{isLoading ||
									(isSubmitting && (
										<LoadingOverlay className="absolute"></LoadingOverlay>
									))}
								{/* <div className="mb-4">
									<p className="font-medium text-2xl">
										trade ID: {activity?.tradeId}
									</p>
								</div> */}
								<div className="grid grid-cols-4 gap-4">
									<div
										id="flip"
										className="col-span-4 flex w-full items-center"
									>
										<div className="flex-1">
											<label
												id="first"
												className="block font-medium text-onyx position reporter"
											>
												{/* reportingbusiness -{" "} */}
												<Link
													className={trade?.fromProfileId ? "underline" : ""}
													href={
														trade?.fromProfileId
															? `/admin/business-detail/${trade?.fromProfileId}`
															: "#"
													}
												>
													reporting business
												</Link>{" "}
												-{" "}
												<span
													className={
														(isFromProfileSetAsReportingBusiness
															? "bg-gold-lighter"
															: "bg-topaz-lighter") + " rounded px-2 py-0"
													}
												>
													{label(isFromProfileSetAsReportingBusiness)}
												</span>
												<div className="relative w-full cursor-not-allowed overflow-hidden rounded-lg bg-pearl text-left border-2 border-onyx focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
													<span className="block w-full border-none py-4 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0">
														{formik.values.reportingBusiness || <>&nbsp;</>}
													</span>
												</div>
											</label>
										</div>
										<div className="flex-none w-24 flex items-center justify-center mt-6">
											<button
												type="button"
												onClick={handleSwitch}
												id="switcher"
												className="p-2"
											>
												<span title="switch business activity roles"></span>
												<SwitchSvg />
											</button>
										</div>
										<div className="flex-1">
											<label
												id="second"
												className="block font-medium text-onyx position"
											>
												{/* receiving business -{" "} */}
												<Link
													className={trade?.toProfileId ? "underline" : ""}
													href={
														trade?.toProfileId
															? `/admin/business-detail/${trade?.toProfileId}`
															: "#"
													}
												>
													receiving business
												</Link>{" "}
												-{" "}
												<span
													className={
														(!isFromProfileSetAsReportingBusiness
															? "bg-gold-lighter"
															: "bg-topaz-lighter") + " rounded px-2 py-0"
													}
												>
													{label(!isFromProfileSetAsReportingBusiness)}
												</span>
												<div className="relative w-full cursor-not-allowed overflow-hidden rounded-lg bg-pearl text-left border-2 border-onyx focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
													<span className="block w-full border-none py-4 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0">
														{formik.values.receivingBusiness || <>&nbsp;</>}
													</span>
												</div>
											</label>
										</div>
									</div>
									<div className="grid grid-cols-6 gap-4 col-span-4">
										<div className="col-span-4 lg:col-span-2">
											<label
												className="block font-medium text-onyx"
												htmlFor="activityType"
											>
												activity type
											</label>
											<select
												className="mt-1 block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												id="activityType"
												name="activityType"
												value={formik.values.activityType}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
											>
												<option value="payment">payment</option>
												<option value="charge">charge</option>
												<option value="collections">collections</option>
												<option value="chargeoff">charge-off</option>
											</select>
											{formik.touched.activityType &&
											formik.errors.activityType ? (
													<div className="text-red-500">
														{formik.errors.activityType}
													</div>
												) : null}
										</div>
										<div className="col-span-4 lg:col-span-2">
											<div>
												<label
													htmlFor="activityDate"
													className="block font-medium text-onyx"
												>
													date of activity
												</label>
												<div className="mt-1">
													<input
														id="activityDate"
														name="activityDate"
														value={formik.values.activityDate}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														type="date"
														placeholder=" "
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm [color-scheme:initial]"
													/>
													{formik.touched.activityDate &&
													formik.errors.activityDate ? (
															<div className="text-red-500">
																{formik.errors.activityDate}
															</div>
														) : null}
												</div>
											</div>
										</div>
										<div className="col-span-4 lg:col-span-2">
											<div>
												<label
													htmlFor="createdAt"
													className="block font-medium text-gray-500"
												>
													date created in factiiv
												</label>
												<div className="mt-1">
													<input
														readOnly={true}
														disabled={true}
														id="createdAt"
														name="createdAt"
														value={formik.values.createdAt}
														type="date"
														placeholder=" "
														spellCheck="false"
														className="cursor-not-allowed block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-gray-100 appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm [color-scheme:initial]"
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="grid grid-cols-6 gap-4 col-span-4">
										<div className="col-span-4 row-span-2 gap-4 grid grid-cols-2">
											<div className="col-span-2 lg:col-span-1">
												<div>
													<label
														htmlFor="amount"
														className="block font-medium text-onyx"
													>
														amount
													</label>
													<div className="mt-1">
														<input
															disabled={!isChargeOrPayment}
															id="amount"
															name="amount"
															value={formik.values.amount}
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															type="text"
															pattern="[0-9]+"
															placeholder="0"
															spellCheck="false"
															className={
																!isChargeOrPayment
																	? "cursor-not-allowed block w-full !text-lg placeholder:text-lg bg-gray-100 appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm"
																	: "block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
															}
														/>
														{formik.touched.amount && formik.errors.amount ? (
															<div className="text-red-500">
																{formik.errors.amount}
															</div>
														) : null}
													</div>
												</div>
											</div>
											<div className="col-span-2 lg:col-span-1">
												<div>
													<label
														htmlFor="interest"
														className="block font-medium text-onyx"
													>
														interest
													</label>
													<div className="mt-1">
														<input
															disabled={formik.values.activityType !== "charge"}
															id="interest"
															name="interest"
															value={formik.values.interest}
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															type="number"
															placeholder="0"
															spellCheck="false"
															className={
																formik.values.activityType !== "charge"
																	? "cursor-not-allowed block w-full cursor-not-allowed !text-lg placeholder:text-lg appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm bg-gray-100"
																	: "block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
															}
														/>
														{formik.touched.interest &&
														formik.errors.interest ? (
																<div className="text-red-500">
																	{formik.errors.interest}
																</div>
															) : null}
													</div>
												</div>
											</div>
											<div className="col-span-2 lg:col-span-1">
												<div>
													<label
														htmlFor="status"
														className="block font-medium text-gray-500"
													>
														status
													</label>
													<div className="mt-1">
														<input
															readOnly={true}
															disabled={true}
															id="status"
															name="status"
															value={
																formik?.values?.adminStatus?.toLowerCase() == "pending" ? "pending" :( formik?.values.adminChecked
																	? "accepted"
																	: "rejected")
															}
															type="text"
															placeholder=" "
															spellCheck="false"
															className="block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-gray-100 appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm"
														/>
													</div>
												</div>
											</div>
											<div className="col-span-2 lg:col-span-1">
												<label
													className="block font-medium text-onyx"
													htmlFor="daysLate"
												>
													days late
												</label>
												<select
													disabled={formik.values.activityType !== "payment"}
													id="daysLate"
													name="daysLate"
													value={formik.values.daysLate}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													className={
														"block w-full !text-lg placeholder:text-lg appearance-none rounded border-2 px-3 py-3 focus:outline-none sm:text-sm mt-1 " +
														(formik.values.activityType !== "payment"
															? "cursor-not-allowed border-gray-300 bg-gray-100"
															: "border-onyx focus:border-topaz bg-white")
													}
												>
													<option value="0">on-time</option>
													<option value="31">30+</option>
													<option value="61">60+</option>
													<option value="91">90+</option>
												</select>
												{formik.touched.daysLate && formik.errors.daysLate ? (
													<div className="text-red-500">
														{formik.errors.daysLate}
													</div>
												) : null}
											</div>
										</div>
										<div className="col-span-4 row-span-2 lg:col-span-2 space-y-3">
											<p className="block font-medium text-gray-500">
												confirmed by users
											</p>
											<div className="flex items-center space-x-4">
												<div className="w-6 flex-none">
													<div>
														<div className="mt-1">
															<input
																readOnly={true}
																checked={true}
																disabled={true}
																value=""
																type="checkbox"
																placeholder=" "
																spellCheck="false"
																className="cursor-not-allowed block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm !bg-gray-500 disabled:border-gray-500 hover:bg-gray-500 hover:checked:bg-gray-500"
															/>
														</div>
													</div>
												</div>
												<label className="text-sm">
													<b>reporter</b> (
													{label(isFromProfileSetAsReportingBusiness)}:{" "}
													{formik.values.reportingBusiness})
												</label>
											</div>
											<div className="flex items-center space-x-4">
												<div className="w-6 flex-none">
													<div>
														<div className="mt-1">
															<input
																readOnly={true}
																checked={
																	formik?.values?.status?.toLowerCase() ===
																		"accepted" || false
																}
																disabled={true}
																value=""
																type="checkbox"
																placeholder=" "
																spellCheck="false"
																className="cursor-not-allowed block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm !bg-gray-500 disabled:border-gray-500 hover:bg-gray-500 hover:checked:bg-gray-500"
															/>
														</div>
													</div>
												</div>
												<label className="text-sm">
													<b>receiver</b> (
													{label(!isFromProfileSetAsReportingBusiness)}:{" "}
													{formik.values.receivingBusiness}){" "}
												</label>
											</div>
											<div className="flex flex-col">
												<div className="flex items-center space-x-4">
													<div className="w-6 flex-none">
														<div>
															<div className="mt-1">
																<input
																	id="adminChecked"
																	name="adminChecked"
																	checked={formik.values.adminChecked}
																	onBlur={formik.handleBlur}
																	onChange={(e: ChangeEvent<HTMLInputElement>) => {
																		updateStatus(e);
																		formik.handleChange(e);
																	}}
																	type="checkbox"
																	placeholder=" "
																	spellCheck="false"
																	className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
																/>
															</div>
														</div>
													</div>
													<label htmlFor="adminChecked" className="text-sm">
														<b>factiiv admin</b> (
														{`${adminStore.admin?.firstName || ""} ${
															adminStore.admin?.lastName || ""
														}`}
														)
													</label>
												</div>
												{formik.touched.adminChecked &&
												formik.errors.adminChecked ? (
														<div className="text-red-500 mt-1">
															{formik.errors.adminChecked}
														</div>
													) : null}
											</div>
										</div>
									</div>
								</div>
								<div className="pt-3 text-right">
									<button
										disabled={!trade || !activity}
										type="submit"
										className={`inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2 ${
											!trade || !activity ? "opacity-50" : ""
										}`}
									>
										save
									</button>
									{/* {formik.status && <div className="mt-2">{formik.status}</div>} */}
								</div>
							</form>
						</main>
					</div>
				</div>
				<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto">
					<div className="w-full"></div>
				</div>
			</div>
		</div>
	);
};

// export default ActivityDetail;
export default dynamic(() => Promise.resolve(ActivityDetail), { ssr: false });
