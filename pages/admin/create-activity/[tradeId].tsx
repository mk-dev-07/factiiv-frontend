import { useFormik } from "formik";
import * as Yup from "yup";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import AdminSearch from "../../../components/admin/admin-search";
import { useDebounce } from "react-use";
import { AdminSearchType } from "../../../types/adminSearch.interface";
import { ActivityType } from "../../../constants/trade.enum";
import { URLSearchParams } from "url";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";

export async function getServerSideProps(context: any) {
	const { tradeId } = context.params;

	return {
		props: {
			urlTradeId: tradeId,
		}, // will be passed to the page component as props
	};
}

const ActivityDetail = ({ urlTradeId }: { urlTradeId: string }) => {
	const router = useRouter();
	const adminStore = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	//GET TRADE ID
	const [tradeId, setTradeId] = useState("");
	useEffect(() => {
		setTradeId(() => urlTradeId);
	}, [urlTradeId]);

	//FETCH TRADE DATA
	const fetchTrade = async () => {
		try {
			const response = await refreshedFetch(
				`${apiUrl}/admins/trades/${tradeId}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${adminStore.token}`,
					},
				}
			);
			const data = await response.json();

			if (!response.ok) {
				throw Error(
					data.errors || "There was an issue with getting trade details."
				);
			}

			return data.payload;
		} catch (error) {
			// console.error(error);
			enqueueSnackbar((error as Error)?.message, {
				variant: "error"
			});
			formik.status(error);
		}
	};
	const { isLoading, data: tradeDetails } = useQuery({
		queryKey: ["createActivityTradeDetails", tradeId],
		queryFn: fetchTrade,
		onSuccess: (activity: Trade) => {
			if (!activity) {
				return null;
			}
			return activity;
		},
		onError: (error) => {
			console.log(error);
			formik.setStatus(
				"There was an error geting trade data! Please make sure you have the correct url."
			);			
			enqueueSnackbar("There was an error geting trade data! Please make sure you have the correct url.", {
				variant: "error"
			});
			setTimeout(() => {
				formik.setStatus("");
			}, 3000);
		},
		refetchOnWindowFocus: false,
		enabled: !!tradeId,
	});

	//FORM STATES
	const [reportingBusiness, setReportingBusiness] = useState("");
	const [receivingBusiness, setReceivingBusiness] = useState("");
	const [reportingBusinessId, setReportingBusinessId] = useState("");
	const [receivingBusinessId, setReceivingBusinessId] = useState("");

	useEffect(() => {
		if (!tradeDetails) {
			
			return;
		}

		setReportingBusiness(tradeDetails.fromCompanyName);
		setReceivingBusiness(tradeDetails.toCompanyName);
		setReportingBusinessId(tradeDetails.fromProfileId);
		setReceivingBusinessId(tradeDetails.toProfileId);
	}, [tradeDetails]);

	const handleSwitch = () => {
		setReportingBusiness(receivingBusiness);
		setReportingBusinessId(receivingBusinessId);
		setReceivingBusiness(reportingBusiness);
		setReceivingBusinessId(reportingBusinessId);
	};

	const pageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	//VALIDATE FORM INPUT
	const formik = useFormik({
		initialValues: {
			reportingBusiness: tradeDetails?.fromCompanyName,
			receivingBusiness: tradeDetails?.toCompanyName,
			activityType: ActivityType.PAYMENT,
			activityDate: new Date().toISOString().slice(0, 10),
			createdAt: new Date().toISOString()?.slice(0, 10),
			amount: "",
			interest: "",
			status: "ACCEPTED",
			daysLate: "0",
			adminChecked: true,
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
				is: (value: ActivityType) => value === ActivityType.PAYMENT,
				then: () =>
					Yup.number()
						.test(
							"amountLessThanBalance",
							`amount should be less or equal to balance (${tradeDetails?.balance})`,
							(value, context) => {
								if (context.parent.activityType !== ActivityType.PAYMENT) {
									return true;
								}

								if (
									!tradeDetails?.balance ||
									value === undefined ||
									isNaN(parseInt(tradeDetails?.balance))
								) {
									return false;
								}

								return parseInt(tradeDetails?.balance) >= value;
							}
						)
						.required("please, enter valid amount"),
				otherwise: () => Yup.number(),
			}),
			interest: Yup.number().when("activityType", {
				is: (value: ActivityType) => value === ActivityType.CHARGE,
				then: () => Yup.number().required("please, enter valid interest"),
				otherwise: () => Yup.number(),
			}),
			daysLate: Yup.string()
				.oneOf(["0", "31", "61", "91"], "please, select a valid value")
				.required("please, select a value for days late"),
		}),
		onSubmit: async (values) => {
			const activityDate = new Date(values?.activityDate || new Date());
			const date = activityDate.toISOString();

			const daysLate = parseInt(values.daysLate);

			const updateRequestBody: ICreateActivity = {
				tradeId,
				reportingBusiness: reportingBusinessId,
				receivingBusiness: receivingBusinessId,
				activityType: values.activityType,
				activityDate: new Date(date ?? new Date()).toISOString(),
				paymentAmount:
					values.activityType === "payment" ? parseInt(values.amount) || 0 : 0,
				chargeAmount:
					values.activityType === "charge" ? parseInt(values.amount) || 0 : 0,
				interest: parseInt(values.interest) || 0,
				daysLate: isNaN(daysLate) ? 0 : daysLate,
			};

			setIsCreatingActivity(true);
			let isSuccess = false;

			try {
				await createActivity(updateRequestBody);

				formik.setStatus(
					"activity updated successfully!\ntaking you back to the trade details screen"
				);
				enqueueSnackbar("activity updated successfully!\ntaking you back to the trade details screen", {
					variant: "success"
				});
				isSuccess = true;
			} catch (error) {
				const errorMessage = (error as Error)?.message;
				formik.setStatus(
					errorMessage || "something went wrong, please try again!"
				);
				enqueueSnackbar(errorMessage || "something went wrong, please try again!", {
					variant: "error"
				});
			}

			pageTimeoutRef.current = setTimeout(() => {
				formik.setStatus("");
				setIsCreatingActivity(false);

				if (isSuccess) {
					router.replace(`/admin/trade-detail/${tradeId}`);
				}
			}, 3000);
		},
	});

	useEffect(() => {
		return () => {
			if (!pageTimeoutRef.current) return;

			window.clearTimeout(pageTimeoutRef.current);
		};
	}, []);


	// UPDATE FIELD VALUES BASED ON ACTIVITY TYPE
	useEffect(() => {
		if (formik.values.activityType === ActivityType.PAYMENT) {
			formik.setFieldValue("amount", formik.values.amount || 0);
			formik.setFieldValue("interest", 0);
			return;
		}

		if (formik.values.activityType === ActivityType.CHARGE) {
			formik.setFieldValue("amount", formik.values.amount || 0);
			formik.setFieldValue("interest", 0);
			return;
		}

		if (
			[ActivityType.COLLECTIONS, ActivityType.CHARGEOFF].includes(
				formik.values.activityType
			)
		) {
			formik.setFieldValue("amount", 0);
			formik.setFieldValue("interest", 0);
			return;
		}

		formik.setFieldValue("daysLate", 0);
	}, [formik.values.activityType]);

	// CREATE ACTIVITY REQUEST
	const [isCreatingActivity, setIsCreatingActivity] = useState<boolean>(false);

	interface ICreateActivity {
		tradeId: string;
		reportingBusiness: string;
		receivingBusiness: string;
		activityDate: string;
		activityType: string;
		daysLate: number;
		paymentAmount: number;
		chargeAmount: number;
		interest: number;
	}

	const createActivityRequest = async (data: ICreateActivity) => {
		const response = await refreshedFetch(`${apiUrl}/admins/activities`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${adminStore.token}`,
			},
		});

		if (!response.ok) {
			const data = await response.json();
			console.log(data);

			throw new Error(
				data.errors ||
					"there was an error with creating this activity, please check that all of the data is correct!"
			);
		}

		const updatedActivity = await response.json();
		return updatedActivity.payload;
	};

	const { isLoading: isSubmitting, mutateAsync: createActivity } = useMutation(
		createActivityRequest
	);
	// END OF CREATE ACTIVITY

	const isChargeOrPayment = useMemo(
		() => ["charge", "payment"].includes(formik.values.activityType),
		[formik.values.activityType]
	);

	const isFromProfileSetAsReportingBusiness = useMemo(() => {
		return reportingBusinessId === tradeDetails?.fromProfileId;
	}, [reportingBusinessId]);

	const label = useCallback(
		(isFromProfileSetAsReportingBusiness: boolean) => {
			if (!tradeDetails) {
				return;
			}

			if (isFromProfileSetAsReportingBusiness) {
				if (
					tradeDetails?.typeDesc === "borrow" &&
					tradeDetails.relationDescription === "borrower"
				) {
					return "borrower";
				}

				if (
					tradeDetails?.typeDesc === "borrow" &&
					tradeDetails.relationDescription === "lender"
				) {
					return "lender";
				}

				if (
					tradeDetails?.typeDesc === "buysell" &&
					tradeDetails.relationDescription === "buyer"
				) {
					return "buyer";
				}

				return "seller";
			} else {
				if (
					tradeDetails?.typeDesc === "borrow" &&
					tradeDetails.relationDescription === "borrower"
				) {
					return "lender";
				}
				if (
					tradeDetails?.typeDesc === "borrow" &&
					tradeDetails.relationDescription === "lender"
				) {
					return "borrower";
				}
				if (
					tradeDetails?.typeDesc === "buysell" &&
					tradeDetails.relationDescription === "buyer"
				) {
					return "seller";
				}
				return "buyer";
			}
		},
		[reportingBusinessId]
	);

	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full"
		>
			<Head>
				<title>Create Activity | factiiv</title>
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
							<div className="flex justify-between mb-3">
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									create activity
								</h2>
							</div>
							{/* <AdminSearch
								placeholderValue="search by trade ID"
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								handleSearch={handleSearch}
							/> */}
							<form
								onSubmit={formik.handleSubmit}
								className="relative border-2 border-onyx target:border-topaz rounded-md bg-pearl p-2 lg:p-6 mb-6"
							>
								{isLoading || isSubmitting ? (
									<LoadingOverlay className="absolute"></LoadingOverlay>
								) : null}
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
												{tradeDetails?.fromProfileId ? (
													<>
														<Link
															className="underline"
															href={`/admin/business-detail/${tradeDetails?.fromProfileId}`}
															target="_blank"
														>
															reporting business
														</Link>{" "}
													</>
												) : (
													<span>reporting business </span>
												)}
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
												{tradeDetails?.toProfileId ? (
													<>
														<Link
															className="underline"
															href={`/admin/business-detail/${tradeDetails?.toProfileId}`}
															target="_blank"
														>
															receiving business
														</Link>{" "}
													</>
												) : (
													<span>receiving business </span>
												)}
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
														className="cursor-not-allowed block w-full !text-lg placeholder:text-lg bg-gray-100 appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm [color-scheme:initial]"
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
															type="number"
															pattern="[0-9]+"
															placeholder="0"
															spellCheck="false"
															className={
																"block w-full !text-lg placeholder:text-lg appearance-none rounded border-2 px-3 py-3 focus:outline-none sm:text-sm " +
																(!isChargeOrPayment
																	? "cursor-not-allowed border-gray-300 bg-gray-100"
																	: "border-onyx focus:border-topaz bg-white")
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
															placeholder=" "
															spellCheck="false"
															className={
																"block w-full !text-lg placeholder:text-lg appearance-none rounded border-2 px-3 py-3 focus:outline-none sm:text-sm " +
																(formik.values.activityType !== "charge"
																	? "cursor-not-allowed border-gray-300 bg-gray-100"
																	: "border-onyx focus:border-topaz bg-white")
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
															value={formik.values.status}
															type="text"
															placeholder=" "
															spellCheck="false"
															className="cursor-not-allowed block w-full !text-lg placeholder:text-lg bg-gray-100 appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm"
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
															: "border-onyx focus:border-topaz bg-white ")
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
																className="cursor-not-allowed block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm checked:bg-gray-300 checked:hover:bg-gray-300"
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
																checked={true}
																disabled={true}
																value=""
																type="checkbox"
																placeholder=" "
																spellCheck="false"
																className="cursor-not-allowed block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm checked:bg-gray-300 checked:hover:bg-gray-300"
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
																	readOnly={true}
																	checked={true}
																	disabled={true}
																	id="adminChecked"
																	name="adminChecked"
																	type="checkbox"
																	placeholder=" "
																	spellCheck="false"
																	className="cursor-not-allowed block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm checked:bg-gray-300 checked:hover:bg-gray-300"
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
										disabled={!tradeDetails || isCreatingActivity}
										type="submit"
										className={`inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2 ${
											!tradeDetails || isCreatingActivity ? "opacity-50" : ""
										}`}
									>
										create activity
									</button>
									{/* {formik.status && (
										<div className="mt-2">
											{formik.status.split("\n").map((line: string) => (
												<p key={line}>{line}</p>
											))}
										</div>
									)} */}
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
