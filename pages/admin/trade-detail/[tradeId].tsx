import { useFormik, validateYupSchema } from "formik";
import * as Yup from "yup";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import AdminTradesCard from "../../../components/admin/admin-trades-card";
import LoadingOverlay from "../../../components/loading-overlay";
import AdminLogoSvg from "../../../components/svgs/AdminLogoSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { useAdminStore } from "../../../store";
import { Activity, Trade } from "../../../types/trade.interface";
import getConfig from "next/config";
import dynamic from "next/dynamic";
import SearchConnections from "../../../components/search-connections";
import Profile from "../../../types/profile.interface";
import AdminSearchConnections from "../../../components/admin/admin-search-connections";
import { TradeType, TradeRole } from "../../../constants/trade.enum";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";

export async function getServerSideProps(context: any) {
	const { tradeId } = context.params;

	return {
		props: {
			tradeId,
		},
	};
}

const TradeDetail = ({ tradeId }: { tradeId: string }) => {
	const router = useRouter();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const adminStore = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });

	// const [trade, setTrade] = useState<Trade | null>(null);
	const [reportingBusinessProfile, setReportingBusinessProfile] =
		useState<Partial<Profile>>();
	const [receivingBusinessProfile, setReceivingBusinessProfile] =
		useState<Partial<Profile>>();

	const [tradeActivites, setTradeActivities] = useState<Activity[]>([]);
	const [isUpdatingTrade, setIsUpdatingTrade] = useState<boolean>(false);

	//FETCH TRADES
	const fetchTrades = async () => {
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
			return data.payload as Trade;
		} catch (error) {
			console.error(error);
		}
	};

	const { data: trade, isLoading: loadingTrades } = useQuery({
		queryKey: ["trades", tradeId],
		queryFn: fetchTrades,
		onSuccess: (trade: Trade) => {
			if (!trade) {
				router.back();
				return;
			}
			// setTrade(trade);
			setTradeActivities(trade.activities);
		},
		enabled: !!tradeId,
	});

	useEffect(() => {
		if (!trade) {
			return;
		}

		setReportingBusinessProfile({
			businessName: trade.fromCompanyName,
			id: trade.fromProfileId,
		});
		setReceivingBusinessProfile({
			businessName: trade.toCompanyName,
			id: trade.toProfileId,
		});
	}, [trade]);

	const handleSelectActivity = (activityId: string) => {
		router.push(`/admin/activity-detail/${activityId}`);
	};

	//VALIDATE FORM INPUT
	const formik = useFormik({
		initialValues: {
			reportingBusiness: reportingBusinessProfile?.id,
			receivingBusiness: receivingBusinessProfile?.id,
			tradeType: trade?.typeDesc,
			dateStarted: trade?.relationshipDate.slice(0, 10),
			createdInFactiiv: trade?.createdAt.slice(0, 10),
			creditLimit: Math.floor(parseInt(trade?.amount || "0")).toString(),
			balance: Math.floor(parseInt(trade?.balance || "0")).toString(),
			tradeStatus: trade?.tradeStatus,
			adminChecked:
				trade?.adminStatus?.toLocaleLowerCase?.() === "accepted" || false,
			relationDescription: trade?.relationDescription,
			adminStatus: trade?.adminStatus?.toLocaleLowerCase?.()
		},
		enableReinitialize: true,
		validationSchema: Yup.object({
			reportingBusiness: Yup.string().required(
				"please, enter receiving business"
			),
			receivingBusiness: Yup.string().required(
				"please, enter reporting business"
			),
			tradeType: Yup.string()
				.oneOf(
					["buysell", "borrow"],
					"trade type must be one of the following: buysell or borrow"
				)
				.required("please, enter trade type"),
			dateStarted: Yup.date().required("please, enter start date"),
			creditLimit: Yup.string().required("please, enter credit limit"),
			balance: Yup.string().required("please, enter credit balance"),
			adminChecked: Yup.boolean(),
			relationDescription: Yup.string().optional(),
		}),
		onSubmit: (values) => {
			if (reportingBusinessProfile && receivingBusinessProfile) {
				handleSelectReportingBusiness({ ...reportingBusinessProfile });
				handleSelectReceivingBusiness({ ...receivingBusinessProfile });
			}

			const updateRequestBody = {
				tradeId: trade?.id,
				status: values.adminStatus?.toLowerCase() == "pending" ? "pending" : ( values.adminChecked ? "accepted" : "rejected"),
				reportingBusiness: values.reportingBusiness ?? trade?.fromProfileId,
				receivingBusiness: values.receivingBusiness ?? trade?.toProfileId,
				tradeType: values.tradeType || trade?.typeDesc || "",
				relationDescription:
					// TODO: update this if the trade type changes
					reportingBusinessRole ?? trade?.relationDescription,
				dateStarted: new Date(values.dateStarted || new Date()).toISOString(),
				highCreditLimit: values.creditLimit,
				outstandingBalance: values.balance,
			};
			handleUpdate(updateRequestBody);
		},
	});

	//ACTIVITY PAGINATION
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const totalPages = Math.ceil(tradeActivites?.length / itemsPerPage);
	const [itemsForPage, setItemsForPage] = useState<Activity[]>([]);

	useEffect(() => {
		setItemsForPage(() => {
			const startIndex = (currentPage - 1) * itemsPerPage;
			const endIndex = startIndex + itemsPerPage;
			return tradeActivites?.slice(startIndex, endIndex);
		});
	}, [tradeActivites, currentPage]);

	const handlePrevious = () => {
		setCurrentPage(currentPage - 1);
	};

	const handleNext = () => {
		setCurrentPage(currentPage + 1);
	};

	//UPDATE REQUEST
	interface IUpdateTrade {
		tradeId?: string;
		status: string;
		reportingBusiness?: string;
		receivingBusiness?: string;
		tradeType: string;
		relationDescription?: string;
		dateStarted: string;
		highCreditLimit: string;
		outstandingBalance: string;
	}

	const updateTrade = async (data: IUpdateTrade) => {
		setIsUpdatingTrade(true);
		const response = await fetch(`${apiUrl}/admins/trades/status`, {
			method: "PUT",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${adminStore.token}`,
			},
		});
		if (!response.ok) {
			const data = await response.json();
			console.log(data);
			formik.setStatus("something went wrong, please try again!");
			setTimeout(() => {
				formik.setStatus("");
			}, 2000);
			throw new Error(`HTTP error! status: ${response.status}`);
		} else {
			formik.setStatus("trade updated successfully!");
			enqueueSnackbar("trade updated successfully!", {
				variant: "success",
			});
			setTimeout(() => {
				formik.setStatus("");
			}, 2000);
		}

		setIsUpdatingTrade(false);

		const updatedTrade = await response.json();
		return updatedTrade;
	};

	const mutateTrade = useMutation(updateTrade);

	const handleUpdate = (newData: IUpdateTrade) => {
		mutateTrade.mutate(newData);
	};

	const handleSelectReportingBusiness = (
		selectedProfile: Profile | Partial<Profile> | null
	) => {
		if (!selectedProfile) return;
		setReportingBusinessProfile(() => {
			formik.setFieldValue("reportingBusiness", selectedProfile.id);
			return selectedProfile;
		});
	};

	const handleSelectReceivingBusiness = (
		selectedProfile: Profile | Partial<Profile> | null
	) => {
		if (!selectedProfile) return;
		setReceivingBusinessProfile(() => {
			formik.setFieldValue("receivingBusiness", selectedProfile.id);
			return selectedProfile;
		});
	};

	const [reportingBusinessRole, receivingBusinessRole] = useMemo(() => {
		const { relationDescription, typeDesc } = trade || {};
		if (!relationDescription) {
			return ["lender", "borrower"];
		}

		let otherProfileRole;
		if (typeDesc === TradeType.BORROW) {
			otherProfileRole =
				relationDescription === TradeRole.LENDER ? "borrower" : "lender";
		} else {
			otherProfileRole =
				relationDescription === TradeRole.SELLER ? "buyer" : "seller";
		}

		if (formik?.values?.tradeType === typeDesc) {
			return [relationDescription, otherProfileRole];
		}

		const counterProfileRole = {
			seller: "borrower",
			buyer: "lender",
			borrower: "seller",
			lender: "buyer",
		}[otherProfileRole];
		const profileRole = {
			seller: "borrower",
			buyer: "lender",
			borrower: "seller",
			lender: "buyer",
		}[relationDescription];

		return [profileRole, counterProfileRole];
	}, [formik?.values?.tradeType]);

	const updateStatus = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (!value) {
			return;
		}

		formik.setFieldValue("status", value === "<tru></tru>e" ? "accepted" : "rejected"
		);
		formik.setFieldValue("adminStatus", value === "<tru></tru>e" ? "accepted" : "rejected");
	};

	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full"
		>
			{loadingTrades && <LoadingOverlay />}
			<Head>
				<title>Trade detail | factiiv</title>
			</Head>
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
				<AdminSidebar />
				<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
					{/* <Search client:visible /> */}
				</div>
				<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
					<AdminLogoSvg />
				</div>
				<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6 astro-FRXN4BQ7">
					<MobileNav />
				</div>
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
					<div className=" pb-12">
						{" "}
						<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
							trade detail
						</h2>
						{/* TRADE DETAIL */}
						<form
							onSubmit={formik.handleSubmit}
							className="border-2 border-onyx target:border-topaz rounded-md bg-pearl p-2 lg:p-6 mb-6"
						>
							<div className="mb-4">
								<p className="font-medium text-2xl">trade ID: {trade?.id}</p>
							</div>
							<div className="grid grid-cols-4 gap-4">
								<div className="col-span-4 lg:col-span-2">
									<label className="block font-medium text-onyx">
										{/* reporting business -{" "}</span> */}
										<Link
											className={
												reportingBusinessProfile?.id ? "underline" : ""
											}
											href={
												reportingBusinessProfile?.id
													? `/admin/business-detail/${reportingBusinessProfile.id}`
													: "#"
											}
										>
											reporting business
										</Link>{" "}
										-{" "}
										<span className="bg-gold-lighter rounded px-2 py-0">
											{reportingBusinessRole}
										</span>
										{receivingBusinessProfile && reportingBusinessProfile && (
											<AdminSearchConnections
												form={formik}
												fieldName="reportingBusiness"
												value={reportingBusinessProfile}
												onSelectResult={handleSelectReportingBusiness}
												excludeProfiles={[receivingBusinessProfile]}
												showErrorState={!reportingBusinessProfile}
											></AdminSearchConnections>
										)}
									</label>
								</div>
								<div className="col-span-4 lg:col-span-2">
									<label className="block font-medium text-onyx">
										{/* receiving business -{" "} */}
										<Link
											className={
												receivingBusinessProfile?.id ? "underline" : ""
											}
											href={
												receivingBusinessProfile?.id
													? `/admin/business-detail/${receivingBusinessProfile.id}`
													: "#"
											}
										>
											receiving business
										</Link>{" "}
										-{" "}
										<span className="bg-topaz-lighter rounded px-2 py-0">
											{receivingBusinessRole}
										</span>
										{receivingBusinessProfile && reportingBusinessProfile && (
											<AdminSearchConnections
												form={formik}
												fieldName="receivingBusiness"
												value={receivingBusinessProfile}
												onSelectResult={handleSelectReceivingBusiness}
												excludeProfiles={[reportingBusinessProfile]}
												showErrorState={!receivingBusinessProfile}
											></AdminSearchConnections>
										)}
										{formik.touched.reportingBusiness &&
										formik.errors.reportingBusiness ? (
											<div className="text-red-500">
												{formik.errors.reportingBusiness}
											</div>
										) : null}
									</label>
								</div>
								<div className="grid grid-cols-6 gap-4 col-span-4">
									<div className="col-span-4 lg:col-span-2">
										<label
											className="block font-medium text-onyx"
											htmlFor="tradeType"
										>
											Select trade type:
										</label>
										<select
											className="mt-1 block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
											id="tradeType"
											name="tradeType"
											value={formik.values.tradeType}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										>
											<option className="py-1 px-2" value="buysell">
												buysell
											</option>
											<option value="borrow">borrow</option>
										</select>
									</div>
									{formik.touched.tradeType && formik.errors.tradeType ? (
										<div className="text-red-500">
											{formik.errors.tradeType}
										</div>
									) : null}
									<div className="col-span-4 lg:col-span-2">
										<div>
											<label className="block font-medium text-onyx">
												date started
											</label>
											<div className="mt-1">
												<input
													id="dateStarted"
													name="dateStarted"
													value={formik.values.dateStarted}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													type="date"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm [color-scheme:initial]"
												/>
											</div>
											{formik.touched.dateStarted &&
											formik.errors.dateStarted ? (
												<div className="text-red-500">
													{formik.errors.dateStarted}
												</div>
											) : null}
										</div>
									</div>
									<div className="col-span-4 lg:col-span-2">
										<div>
											<label className="block font-medium text-gray-500">
												date created in factiiv
											</label>
											<div className="mt-1">
												<input
													readOnly={true}
													disabled={true}
													value={formik.values.createdInFactiiv}
													type="date"
													placeholder=" "
													spellCheck="false"
													className="block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm [color-scheme:initial]"
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="grid grid-cols-6 gap-4 col-span-4">
									<div className="col-span-4 row-span-2 gap-4 grid grid-cols-2">
										<div className="col-span-2 lg:col-span-1">
											<div>
												<label className="block font-medium text-onyx">
													high credit limit
												</label>
												<div className="mt-1">
													<input
														id="creditLimit"
														name="creditLimit"
														value={formik.values.creditLimit}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														type="number"
														placeholder=" "
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.creditLimit &&
												formik.errors.creditLimit ? (
														<div className="text-red-500">
															{formik.errors.creditLimit}
														</div>
													) : null}
											</div>
										</div>
										<div className="col-span-2 lg:col-span-1">
											<div>
												<label className="block font-medium text-onyx">
													outstanding balance
												</label>
												<div className="mt-1">
													<input
														id="balance"
														name="balance"
														value={formik.values.balance}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														type="text"
														pattern="[0-9]+"
														placeholder=" "
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.balance && formik.errors.balance ? (
													<div className="text-red-500">
														{formik.errors.balance}
													</div>
												) : null}
											</div>
										</div>
										<div className="col-span-2 lg:col-span-1">
											<div>
												<label
													htmlFor="tradeStatus"
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
															formik?.values?.adminStatus == "pending" ? "pending" :( formik?.values.adminChecked
																? "accepted"
																: "rejected")
														}
														type="text"
														placeholder=" "
														spellCheck="false"
														className="block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.tradeStatus &&
												formik.errors.tradeStatus ? (
													<div className="text-red-500">
														{formik.errors.tradeStatus}
													</div>
												) : null}
											</div>
										</div>
										<div className="col-span-2 lg:col-span-1">
											<div>
												<label className="block font-medium text-gray-500">
													date closed
												</label>
												<div className="mt-1">
													<input
														readOnly={true}
														disabled={true}
														value="n/a"
														type="text"
														placeholder=" "
														spellCheck="false"
														className="block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm"
													/>
												</div>
											</div>
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
															id="reportingBusinessCheck"
															type="checkbox"
															placeholder=" "
															spellCheck="false"
															className="block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm !bg-gray-500 disabled:border-gray-500 hover:bg-gray-500 hover:checked:bg-gray-500"
														/>
													</div>
												</div>
											</div>
											<label
												htmlFor="reportingBusinessCheck"
												className="text-sm cursor-not-allowed"
											>
												<b>reporter</b> ({reportingBusinessRole}:{" "}
												{reportingBusinessProfile?.businessName ?? ""})
											</label>
										</div>
										<div className="flex items-center space-x-4">
											<div className="w-6 flex-none">
												<div>
													<div className="mt-1">
														<input
															readOnly={true}
															checked={
																(formik?.values?.tradeStatus?.toLowerCase() ||
																	"") === "accepted" || false
															}
															disabled={true}
															value=""
															type="checkbox"
															id="receivingBusinessCheck"
															placeholder=" "
															spellCheck="false"
															className="block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm !bg-gray-500 disabled:border-gray-500 hover:bg-gray-500 hover:checked:bg-gray-500"
														/>
													</div>
												</div>
											</div>
											<label
												htmlFor="receivingBusinessCheck"
												className="text-sm cursor-not-allowed"
											>
												<b>receiver</b> ({receivingBusinessRole}:{" "}
												{receivingBusinessProfile?.businessName || ""})
											</label>
										</div>
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
															spellCheck={false}
															className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
														/>
													</div>
												</div>
											</div>
											<label htmlFor="adminChecked" className="text-sm">
												<b>factiiv admin</b> (
												{`${adminStore.admin?.firstName} ${adminStore.admin?.lastName}`}
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
							<div className="pt-3 text-right">
								<button
									disabled={isUpdatingTrade}
									type="submit"
									className={
										"inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2" +
										(isUpdatingTrade ? " opacity-50" : "")
									}
								>
									save
								</button>
								{/* {formik.status && <div className="mt-2">{formik.status}</div>} */}
							</div>
						</form>
						{/* TRADE ACTIVITY HEADER */}
						<div className="flex justify-between align-center">
							<div className="text-xl text-onyx font-medium dark:text-pearl-shade flex items-center">
								{itemsForPage?.length !== 0 && <h2>trade activity</h2>}
							</div>
							{trade?.id ? (
								<Link
									href={`/admin/create-activity/${trade?.id}`}
									id="add-connection"
									className="relative group inline-block animate-fade-in "
								>
									<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-1 px-3 w-full flex items-center justify-center space-x-4 will-change-transform ">
										create activity
									</span>
									<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
								</Link>
							) : (
								<button className="relative group inline-block animate-fade-in opacity-50 cursor-not-allowed">
									<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-1 px-3 w-full flex items-center justify-center space-x-4 will-change-transform ">
										create activity
									</span>
									<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
								</button>
							)}
						</div>
						{/* TRADE ACTIVITY */}
						{itemsForPage?.length > 0 && (
							<>
								<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
									<ul role="list" className="divide-y-2 divide-onyx">
										{itemsForPage.map((activity: Activity) => {
											return (
												<li
													onClick={() => handleSelectActivity(activity.id)}
													className="cursor-pointer"
													key={activity.id}
												>
													<AdminTradesCard
														activityCard
														tradeId={tradeId}
														reportingBusiness={
															reportingBusinessProfile?.businessName
														}
														receivingBusiness={
															receivingBusinessProfile?.businessName
														}
														date={new Date(activity.activityDate)}
														type={activity.activityType}
														status={activity.adminStatus}
													/>
												</li>
											);
										})}
									</ul>
								</div>
								<div className="mt-4">
									<nav
										className="flex items-center justify-between px-4 py-3 sm:px-6"
										aria-label="Pagination"
									>
										<div className="hidden sm:block">
											<p className="text-sm text-gray-700">
												showing
												<span className="font-medium">
													{" "}
													{(currentPage - 1) * itemsPerPage + 1}
												</span>{" "}
												to
												<span className="font-medium">
													{" "}
													{(currentPage - 1) * itemsPerPage + itemsPerPage <
													tradeActivites.length
														? (currentPage - 1) * itemsPerPage + itemsPerPage
														: tradeActivites.length}
												</span>{" "}
												of
												<span className="font-medium">
													{" "}
													{tradeActivites.length}
												</span>{" "}
												items
											</p>
										</div>
										{itemsForPage?.length > itemsPerPage && (
											<div className="flex flex-1 justify-between sm:justify-end">
												<button
													onClick={handlePrevious}
													disabled={currentPage === 1}
													className={`${
														currentPage === 1 && "cursor-not-allowed"
													} relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
												>
													previous
												</button>
												<button
													onClick={handleNext}
													disabled={currentPage === totalPages}
													className={`${
														currentPage === totalPages && "cursor-not-allowed"
													} relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
												>
													next
												</button>
											</div>
										)}
									</nav>
								</div>
							</>
						)}
					</div>
				</div>
				<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto">
					<div className="w-full"></div>
				</div>
			</div>
		</div>
	);
};

// TODO: find a way to make this work with SSR
export default dynamic(() => Promise.resolve(TradeDetail), { ssr: false });
