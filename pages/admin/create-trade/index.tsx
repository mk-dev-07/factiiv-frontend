import { useFormik } from "formik";
import * as Yup from "yup";
import Head from "next/head";
import React, {
	ChangeEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";

const CreateTrade = () => {
	const router = useRouter();
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	const adminStore = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });

	const [reportingBusinessProfile, setReportingBusinessProfile] =
		useState<Profile>();
	const [receivingBusinessProfile, setReceivingBusinessProfile] =
		useState<Profile>();
	const pageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	//VALIDATE FORM INPUT
	const [isCreatingTrade, setIsCreatingTrade] = useState<boolean>(false);
	const formik = useFormik({
		initialValues: {
			reportingBusiness: reportingBusinessProfile?.id,
			receivingBusiness: receivingBusinessProfile?.id,
			typeDesc: TradeType.BORROW,
			relationshipDate: new Date().toISOString().slice(0, 10),
			createdInFactiiv: new Date().toISOString().slice(0, 10),
			amount: "0",
			balance: "0",
			tradeStatus: "accepted",
			adminChecked: true,
			relationDescription: TradeRole.LENDER,
		},
		validationSchema: Yup.object({
			reportingBusiness: Yup.string().required(
				"please, enter receiving business"
			),
			receivingBusiness: Yup.string().required(
				"please, enter reporting business"
			),
			typeDesc: Yup.string()
				.oneOf(
					[TradeType.BUYSELL, TradeType.BORROW],
					"trade type must be one of the following: buy/sell or borrow"
				)
				.required("please, enter trade type"),
			relationshipDate: Yup.date().required("please, enter start date"),
			amount: Yup.string().when("typeDesc", {
				is: (value: TradeType) => value === TradeType.BORROW,
				then: () => Yup.string().required("please, enter credit limit"),
				otherwise: () => Yup.string().required("please, enter total cost"),
			}),
			balance: Yup.string().required("please, enter outstanding balance"),
			relationDescription: Yup.string().optional(),
		}),
		onSubmit: async (values) => {
			if (!reportingBusinessProfile || !receivingBusinessProfile) {
				formik.setStatus("Please select missing trade participant");
				return;
			}

			const data: ICreateTrade = {
				...values,
				amount: "" + values?.amount,
				balance: "" + values?.balance,
				relationshipDate: new Date(
					values.relationshipDate || new Date()
				).toISOString(),
				amountCurrency: "USD",
				balanceCurrency: "USD",
				// from me
				fromProfileId: reportingBusinessProfile.id,
				fromAddress: reportingBusinessProfile.factiivAddress,
				fromCompanyName: reportingBusinessProfile.businessName,
				fromRate: "",
				// to them
				toProfileId: receivingBusinessProfile.id,
				toAddress: receivingBusinessProfile.factiivAddress,
				toCompanyName: receivingBusinessProfile.businessName,
				toRate: "",
				// missing
				relationshipId: "",
				typeId: "",
				lifecycle: "",
				seen: false,
			};

			setIsCreatingTrade(true);
			let createdTrade: Trade;

			try {
				createdTrade = await createTrade(data);

				formik.setStatus(
					"trade created successfully!\ntaking you to the newly created trade details"
				);
				enqueueSnackbar(
					"trade created successfully!\ntaking you to the newly created trade details",
					{
						variant: "success",
					}
				);
			} catch (error) {
				formik.setStatus("something went wrong, please try again!");
				enqueueSnackbar("something went wrong, please try again!", {
					variant: "error",
				});
			}

			pageTimeoutRef.current = setTimeout(() => {
				formik.setStatus("");
				setIsCreatingTrade(false);

				if (createdTrade) {
					router.replace(`/admin/trade-detail/${createdTrade.id}`);
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

	// Create Trade Request
	interface ICreateTrade {
		relationshipId: string;
		typeId: string;
		typeDesc: string;
		relationDescription: string;
		amount: string;
		balance: string;
		toAddress: string;
		toCompanyName: string;
		toRate: string;
		fromAddress: string;
		fromCompanyName: string;
		fromRate: string;
		lifecycle: string;
		relationshipDate: string;
		amountCurrency: string;
		balanceCurrency: string;
		toProfileId: string;
		fromProfileId: string;
		seen: boolean;
	}

	const createTradeRequest = async (data: ICreateTrade) => {
		const response = await fetch(`${apiUrl}/admins/trades`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${adminStore.token}`,
			},
		});

		if (!response.ok) {
			const data = await response.json();

			throw new Error(
				data?.errors ||
					"there was an error with creating this trade, please check that all of the data is correct!"
			);
		}

		const updatedTrade = await response.json();
		return updatedTrade.payload as Trade;
	};

	const { mutateAsync: createTrade } = useMutation(createTradeRequest);
	// end of Create trade request

	const handleSelectReportingBusiness = (selectedProfile: Profile | null) => {
		if (!selectedProfile) return;
		setReportingBusinessProfile(() => {
			formik.setFieldValue("reportingBusiness", selectedProfile.id);
			return selectedProfile;
		});
	};

	const handleSelectReceivingBusiness = (selectedProfile: Profile | null) => {
		if (!selectedProfile) return;
		setReceivingBusinessProfile(() => {
			formik.setFieldValue("receivingBusiness", selectedProfile.id);
			return selectedProfile;
		});
	};

	const [reportingBusinessRole, receivingBusinessRole] = useMemo(() => {
		const { relationDescription, typeDesc } = formik?.values || {};
		if (!relationDescription || typeDesc === TradeType.BORROW) {
			return [TradeRole.LENDER, TradeRole.BORROWER];
		}

		return [TradeRole.SELLER, TradeRole.BUYER];
	}, [formik?.values?.typeDesc]);

	const handleAdminCheckedChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.preventDefault();
		formik.setFieldValue(
			"status",
			event.target.checked ? "accepted" : "rejected"
		);
		formik.handleChange(event);
	};

	const handleTradeTypeChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		// event.preventDefault();
		formik.setFieldValue(
			"relationDescription",
			event?.target?.value === TradeType.BORROW
				? TradeRole.LENDER
				: TradeRole.SELLER
		);
		formik.handleChange(event);
	};

	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="relative w-full h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox"
		>
			{/* {loadingTrades && <LoadingOverlay />} */}
			<Head>
				<title>Create Trade | factiiv</title>
			</Head>
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
				<AdminSidebar />
				<div className="hidden w-1/2 h-0 col-start-2 col-end-3 row-start-1 row-end-2 py-6 lg:block">
					{/* <Search client:visible /> */}
				</div>
				<div className="w-24 col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden">
					<AdminLogoSvg />
				</div>
				<div className="col-start-1 col-end-3 row-start-1 row-end-2 py-2 pr-2 justify-self-end md:col-start-2 xl:col-start-3 xs:py-4 xs:pr-4 sm:py-6 sm:pr-6 astro-FRXN4BQ7">
					<MobileNav />
				</div>
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
					{/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
					<div className="pb-12 ">
						{" "}
						<h2 className="my-3 text-xl font-medium text-onyx dark:text-pearl-shade">
							create trade
						</h2>
						{/* TRADE DETAIL */}
						<form
							onSubmit={formik.handleSubmit}
							className="p-2 mb-6 border-2 rounded-md border-onyx target:border-topaz bg-pearl lg:p-6"
						>
							<div className="mb-4">
								<p className="text-2xl font-medium">New trade</p>
							</div>
							<div className="grid grid-cols-4 gap-4">
								<div className="col-span-4 lg:col-span-2">
									<label className="block font-medium text-onyx">
										{/* reporting business -{" "}</span> */}
										{reportingBusinessProfile?.id ? (
											<>
												<Link
													className="underline"
													href={`/admin/business-detail/${reportingBusinessProfile.id}`}
													target="_blank"
												>
													reporting business
												</Link>{" "}
											</>
										) : (
											<span>reporting business </span>
										)}
										-{" "}
										<span className="px-2 py-0 rounded bg-gold-lighter">
											{reportingBusinessRole}
										</span>
										<AdminSearchConnections
											form={formik}
											fieldName="reportingBusiness"
											value={reportingBusinessProfile}
											onSelectResult={handleSelectReportingBusiness}
											excludeProfiles={
												receivingBusinessProfile
													? [receivingBusinessProfile]
													: []
											}
											showErrorState={!reportingBusinessProfile}
										></AdminSearchConnections>
									</label>
								</div>
								<div className="col-span-4 lg:col-span-2">
									<label className="block font-medium text-onyx">
										{/* receiving business -{" "} */}
										{receivingBusinessProfile?.id ? (
											<>
												<Link
													className="underline"
													href={`/admin/business-detail/${receivingBusinessProfile.id}`}
													target="_blank"
												>
													reporting business
												</Link>{" "}
											</>
										) : (
											<span>reporting business </span>
										)}
										-{" "}
										<span className="px-2 py-0 rounded bg-topaz-lighter">
											{receivingBusinessRole}
										</span>
										<AdminSearchConnections
											form={formik}
											fieldName="receivingBusiness"
											value={receivingBusinessProfile}
											onSelectResult={handleSelectReceivingBusiness}
											excludeProfiles={
												reportingBusinessProfile
													? [reportingBusinessProfile]
													: []
											}
											showErrorState={!receivingBusinessProfile}
										></AdminSearchConnections>
									</label>
								</div>
								<div className="grid grid-cols-6 col-span-4 gap-4">
									<div className="col-span-4 lg:col-span-2">
										<label
											className="block font-medium text-onyx"
											htmlFor="typeDesc"
										>
											Select trade type:
										</label>
										<select
											className="mt-1 block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
											id="typeDesc"
											name="typeDesc"
											value={formik.values.typeDesc}
											onChange={handleTradeTypeChange}
											onBlur={formik.handleBlur}
										>
											<option className="px-2 py-1" value="buysell">
												buy/sell
											</option>
											<option value="borrow">borrow</option>
										</select>
									</div>
									{formik.touched.typeDesc && formik.errors.typeDesc ? (
										<div className="text-red-500">{formik.errors.typeDesc}</div>
									) : null}
									<div className="col-span-4 lg:col-span-2">
										<div>
											<label className="block font-medium text-onyx">
												date started
											</label>
											<div className="mt-1">
												<input
													id="relationshipDate"
													name="relationshipDate"
													value={formik.values.relationshipDate}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													type="date"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm text-onyx dark:text-onyx [color-scheme:initial]"
												/>
											</div>
											{formik.touched.relationshipDate &&
											formik.errors.relationshipDate ? (
												<div className="text-red-500">
													{formik.errors.relationshipDate}
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
								<div className="grid grid-cols-6 col-span-4 gap-4">
									<div className="grid grid-cols-2 col-span-4 row-span-2 gap-4">
										<div className="col-span-2 lg:col-span-1">
											<div>
												<label className="block font-medium text-onyx">
													{formik.values.typeDesc === TradeType.BORROW
														? "high credit limit"
														: "total cost"}
												</label>
												<div className="mt-1">
													<input
														id="amount"
														name="amount"
														value={formik.values.amount}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														type="number"
														placeholder=" "
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.amount && formik.errors.amount ? (
													<div className="text-red-500">
														{formik.errors.amount}
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
														type="number"
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
														value={formik.values.tradeStatus}
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
									<div className="col-span-4 row-span-2 space-y-3 lg:col-span-2">
										<p className="block font-medium text-gray-500">
											confirmed by users
										</p>
										<div className="flex items-center space-x-4">
											<div className="flex-none w-6">
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
															className="block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm checked:bg-gray-300 checked:hover:bg-gray-300"
														/>
													</div>
												</div>
											</div>
											<label
												htmlFor="reportingBusinessCheck"
												className="text-sm"
											>
												<b>reporter</b> ({reportingBusinessRole}:{" "}
												{reportingBusinessProfile?.businessName ?? ""})
											</label>
										</div>
										<div className="flex items-center space-x-4">
											<div className="flex-none w-6">
												<div>
													<div className="mt-1">
														<input
															readOnly={true}
															checked={true}
															disabled={true}
															value=""
															type="checkbox"
															id="receivingBusinessCheck"
															placeholder=" "
															spellCheck="false"
															className="block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-gray-300 px-3 py-3 focus:outline-none sm:text-sm checked:bg-gray-300 checked:hover:bg-gray-300"
														/>
													</div>
												</div>
											</div>
											<label
												htmlFor="receivingBusinessCheck"
												className="text-sm"
											>
												<b>receiver</b> ({receivingBusinessRole}:{" "}
												{receivingBusinessProfile?.businessName || ""})
											</label>
										</div>
										<div className="flex items-center space-x-4">
											<div className="flex-none w-6">
												<div>
													<div className="mt-1">
														<input
															readOnly={true}
															checked={true}
															disabled={true}
															id="adminChecked"
															name="adminChecked"
															onBlur={formik.handleBlur}
															onChange={handleAdminCheckedChange}
															type="checkbox"
															placeholder=" "
															spellCheck={false}
															className="block w-full cursor-not-allowed !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm checked:bg-gray-300 checked:hover:bg-gray-300"
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
											<div className="mt-1 text-red-500">
												{formik.errors.adminChecked}
											</div>
										) : null}
									</div>
								</div>
							</div>
							<div className="pt-3 text-right">
								<button
									disabled={isCreatingTrade}
									type="submit"
									className={
										"inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2" +
										(isCreatingTrade ? " opacity-50" : "")
									}
								>
									create trade
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
					</div>
				</div>
				<div className="hidden mx-auto xl:block animate-fade-in-next w-52 xl:w-72">
					<div className="w-full"></div>
				</div>
			</div>
		</div>
	);
};

// TODO: find a way to make this work with SSR
export default dynamic(() => Promise.resolve(CreateTrade), { ssr: false });
