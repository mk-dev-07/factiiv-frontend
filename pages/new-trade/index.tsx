import Head from "next/head";
import * as Yup from "yup";
import Sidebar from "../../components/sidebar";
import HeaderActions from "../../components/header-actions";
import CalendarPicker from "../../components/calendar-picker";
import { useFormik } from "formik";
import useProtected from "../../hooks/useProtected";
import { useFactiivStore } from "../../store";
import SearchConnections from "../../components/search-connections";
import { useMutation, useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import { Trade } from "../../types/trade.interface";
import Profile from "../../types/profile.interface";
import { TradeRole, TradeType } from "../../constants/trade.enum";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { decodeData } from "../../utils/data.utils";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import getConfig from "next/config";
import { LogoSvg } from "../../components/svgs/LogoSvg";

const NewTrade = () => {
	useProtected();
	const store = useFactiivStore();
	const router = useRouter();
	const query = useSearchParams();
	const { refreshedFetch } = useAuthenticatedFetch();

	const [tradeError, setTradeError] = useState<string>("");
	const [connection, setConnection] = useState<Profile | Partial<Profile>>();

	const { mutate: createTrade, isLoading: isSubmittingNewTrade } = useMutation({
		mutationKey: "newTrade",
		mutationFn: async ({ token, body }: { token: string; body: string }) => {
			const {
				publicRuntimeConfig: { apiUrl },
			} = getConfig();

			try {
				const response = await refreshedFetch(`${apiUrl}/trades`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body,
				});

				if (!response.ok) {
					// user does not exist
					// user was delited
					// user not activated - handled
					// this profile does not belong to you
					// this profile (fromProfile) is not verified
					// toProfile not found
					// typeDesc needs to be defined
					// relationshipDescription needs to be defined
					setIsLoading(false);
					const result = await response.json();
					throw new Error(result?.errors?.at(0));
				}

				const tradeData = (await response?.json()) ?? null;

				if (!tradeData) {
					setIsLoading(false);
					return;
				}

				router.push("/new-trade-submitted");
			} catch (error: unknown) {
				setTradeError(
					(error as Error)?.message || "There was an error, please try again"
				);
			}
		},
	});
	const [isLoading, setIsLoading] = useState(false);

	const newTradeValidationSchema = Yup.object().shape({
		connection: Yup.string().required("Connection is required"),
		relationDescription: Yup.string(),
		relationshipDate: Yup.string().required("Date is required"),
		typeDesc: Yup.string().required("This field is required"),
		amount: Yup.number().moreThan(0).required("This field is required"),
		amountCurrency: Yup.string(),
		balance: Yup.number().min(0).required("This field is required"),
		// .test(
		// 	"balanceMoreThanAmount",
		// 	"balance should be less or equal to amount",
		// 	(value, context) => {
		// 		return value <= context.parent.amount;
		// 	}
		// ),
		balanceCurrency: Yup.string(),
	});

	const newTradeForm = useFormik({
		initialValues: {
			typeDesc: "borrow",
			amount: "0",
			connection: "",
			relationshipDate: new Date().toISOString(),
			relationDescription: TradeRole.LENDER,
			amountCurrency: "USD",
			balance: "0",
			balanceCurrency: "USD",
		},
		validationSchema: newTradeValidationSchema,
		validateOnChange: true,
		onSubmit: async ({ connection: connectionId, ...values }) => {
			setIsLoading(true);
			const token = store.token;
			const { businessName, factiivAddress, id } = store.activeProfile;
			setTradeError("");

			if (!values || !connection || !token) {
				setIsLoading(false);
				return;
			}

			const body = JSON.stringify({
				...values,
				// from me
				fromProfileId: id,
				fromAddress: factiivAddress,
				fromCompanyName: businessName,
				fromRate: "",
				// to them
				toProfileId: connectionId,
				toAddress: connection.factiivAddress,
				toCompanyName: connection.businessName,
				toRate: "",
			});

			createTrade({ token, body });
		},
	});

	const [isProfileVerified, setIsProfileVerified] = useState<boolean>(false);
	useEffect(() => {
		const connection = decodeData<Profile>(query.get("data") ?? null);
		setIsProfileVerified(store?.activeProfile?.profileDataStatus);
		if (!connection) return;

		handleSelectResult(connection);
	}, [query]);

	//relationDescription (renderBuyFormSection() and renderBorrowFormSection()) radio buttons separatelly - because of formik bugs
	const [relationDescription, setRelationDescription] = useState<TradeRole>(
		TradeRole.LENDER
	);
	const handleRelationChange = (e: any) => {
		setRelationDescription(e.target.value);
		newTradeForm.setFieldValue("relationDescription", e.target.value);
	};

	const handleSelectResult = (
		connectionProfile: Profile | Partial<Profile> | undefined
	) => {
		if (!connectionProfile) return;

		setConnection(connectionProfile);
		newTradeForm.setFieldValue("connection", connectionProfile.id);
	};

	const renderBuyFormSection = () => {
		return (
			<div id="buy" className="">
				<p className="mt-3 mb-1 text-sm font-medium text-gray-500">your role</p>
				<span id="control" className="w-full flex">
					<button
						id="role-seller"
						type="button"
						className={
							"relative inline-block items-center rounded-l text-center border-2 px-4 py-1 text-sm font-medium focus:z-10 focus:outline-none w-24 " +
							(relationDescription === TradeRole.SELLER
								? "bg-topaz text-white border-onyx"
								: "text-onyx border-onyx bg-white hover:bg-gray-50")
						}
					>
						<input
							className="opacity-0 absolute w-full h-full [appearance:none] left-0 top-0 cursor-pointer"
							type="radio"
							name="relationDescription"
							id="seller"
							value={TradeRole.SELLER}
							checked={relationDescription === TradeRole.SELLER}
							onChange={handleRelationChange}
						/>
						seller
					</button>
					<button
						id="role-buyer"
						type="button"
						className={
							"relative -ml-px inline-block items-center rounded-r text-center border-2 px-4 py-1 text-sm font-medium focus:z-10 focus:outline-none w-24 " +
							(relationDescription === TradeRole.BUYER
								? "bg-topaz text-white border-onyx"
								: "text-onyx border-onyx bg-white hover:bg-gray-50")
						}
					>
						<input
							className="opacity-0 absolute w-full h-full [appearance:none] left-0 top-0 cursor-pointer"
							type="radio"
							name="relationDescription"
							id="buyer"
							value={TradeRole.BUYER}
							checked={relationDescription === TradeRole.BUYER}
							onChange={handleRelationChange}
						/>
						buyer
					</button>
				</span>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
					<div>
						<p className="mb-1 text-sm font-medium text-gray-500">
							{newTradeForm.values.typeDesc === "borrow"
								? "high credit limit of loan"
								: "total cost"}
						</p>
						<div>
							<div className="relative mt-1 rounded">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<span className="text-onyx">$</span>
								</div>
								<input
									type="number"
									className="block w-full rounded border-2 border-onyx pl-7 pr-12 py-2 focus:border-topaz focus:ring-topaz"
									placeholder="0"
									pattern="[0-9]+"
									min={0}
									name="amount"
									id="amount"
									onChange={newTradeForm.handleChange}
									onBlur={newTradeForm.handleBlur}
								/>
								<div className="absolute inset-y-0 right-0 flex items-center border-l-2 border-onyx">
									<label htmlFor="currency" className="sr-only">
										Currency
									</label>
									<select
										className="h-full rounded border-2 border-transparent bg-transparent py-0 pl-4 pr-7 text-onyx focus:border-topaz focus:ring-topaz"
										name="amountCurrency"
										id="amountCurrency"
										value={newTradeForm.values.amountCurrency}
										onChange={newTradeForm.handleChange}
										onBlur={newTradeForm.handleBlur}
									>
										<option>USD</option>
										<option>CAD</option>
									</select>
								</div>
							</div>
							{newTradeForm.touched.amount && newTradeForm.errors.amount ? (
								<div className="text-red-500">
									{<>{newTradeForm.errors.amount}</>}
								</div>
							) : null}
						</div>
					</div>
					<div>
						<p className="mb-1 text-sm font-medium text-gray-500">
							outstanding balance
						</p>
						<div>
							<div className="relative mt-1 rounded">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<span className="text-onyx">$</span>
								</div>
								<input
									type="number"
									className="block w-full rounded border-2 border-onyx pl-7 pr-12 py-2 focus:border-topaz focus:ring-topaz"
									placeholder="0"
									min={0}
									name="balance"
									id="balance"
									pattern="[0-9]+"
									onChange={newTradeForm.handleChange}
									onBlur={newTradeForm.handleBlur}
								/>
								<div className="absolute inset-y-0 right-0 flex items-center border-l-2 border-onyx">
									<label htmlFor="balanceCurrency" className="sr-only">
										Currency
									</label>
									<select
										id="balanceCurrency"
										name="balanceCurrency"
										className="h-full rounded border-2 border-transparent bg-transparent py-0 pl-4 pr-7 text-onyx focus:border-topaz focus:ring-topaz"
										value={newTradeForm.values.balanceCurrency}
										onChange={newTradeForm.handleChange}
										onBlur={newTradeForm.handleBlur}
									>
										<option>USD</option>
										<option>CAD</option>
									</select>
								</div>
							</div>
							{newTradeForm.touched.balance && newTradeForm.errors.balance ? (
								<div className="text-red-500">
									{<>{newTradeForm.errors.balance}</>}
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderBorrowFormSection = () => {
		return (
			<div id="borrow" className="">
				<p className="mt-3 mb-1 text-sm font-medium text-gray-500">your role</p>
				<span id="control" className="w-full flex">
					<button
						id="role-lender"
						type="button"
						className={
							"relative inline-block items-center rounded-l text-center border-2 px-4 py-1 text-sm font-medium focus:z-10 focus:outline-none w-24 " +
							(relationDescription === TradeRole.LENDER
								? "bg-topaz text-white border-onyx"
								: "text-onyx border-onyx bg-white hover:bg-gray-50")
						}
					>
						<input
							className="opacity-0 absolute w-full h-full [appearance:none] left-0 top-0 cursor-pointer"
							type="radio"
							name="relationDescription"
							id="lender"
							value={TradeRole.LENDER}
							checked={relationDescription === TradeRole.LENDER}
							onChange={handleRelationChange}
						/>
						lender
					</button>
					<button
						id="role-borrower"
						type="button"
						className={
							"relative -ml-px inline-block items-center rounded-r text-center border-2 px-4 py-1 text-sm font-medium focus:z-10 focus:outline-none w-24 " +
							(relationDescription === TradeRole.BORROWER
								? "bg-topaz text-white border-onyx"
								: "text-onyx border-onyx bg-white hover:bg-gray-50")
						}
					>
						<input
							className="opacity-0 absolute w-full h-full [appearance:none] left-0 top-0 cursor-pointer"
							type="radio"
							name="relationDescription"
							id="borrower"
							value={TradeRole.BORROWER}
							checked={relationDescription === TradeRole.BORROWER}
							onChange={handleRelationChange}
						/>
						borrower
					</button>
				</span>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
					<div>
						<p className="mb-1 text-sm font-medium text-gray-500">
							high credit limit of loan
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
									name="amount"
									id="amount"
									min={0}
									pattern="[0-9]+"
									onChange={newTradeForm.handleChange}
									onBlur={newTradeForm.handleBlur}
								/>
								<div className="absolute inset-y-0 right-0 flex items-center border-l-2 border-onyx">
									<label htmlFor="amountCurrency" className="sr-only">
										Currency
									</label>
									<select
										id="amountCurrency"
										name="amountCurrency"
										className="h-full rounded border-2 border-transparent bg-transparent py-0 pl-4 pr-7 text-onyx focus:border-topaz focus:ring-topaz"
										value={newTradeForm.values.amountCurrency}
										onChange={newTradeForm.handleChange}
										onBlur={newTradeForm.handleBlur}
									>
										<option>USD</option>
										<option>CAD</option>
									</select>
								</div>
							</div>
							{newTradeForm.touched.amount && newTradeForm.errors.amount ? (
								<div className="text-red-500">
									{<>{newTradeForm.errors.amount}</>}
								</div>
							) : null}
						</div>
					</div>
					<div>
						<p className="mb-1 text-sm font-medium text-gray-500">
							outstanding balance
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
									name="balance"
									id="balance"
									min={0}
									pattern="[0-9]+"
									onChange={newTradeForm.handleChange}
									onBlur={newTradeForm.handleBlur}
								/>
								<div className="absolute inset-y-0 right-0 flex items-center border-l-2 border-onyx">
									<label htmlFor="balanceCurrency" className="sr-only">
										Currency
									</label>
									<select
										id="balanceCurrency"
										name="balanceCurrency"
										className="h-full rounded border-2 border-transparent bg-transparent py-0 pl-4 pr-7 text-onyx focus:border-topaz focus:ring-topaz"
										value={newTradeForm.values.balanceCurrency}
										onChange={newTradeForm.handleChange}
										onBlur={newTradeForm.handleBlur}
									>
										<option>USD</option>
										<option>CAD</option>
									</select>
								</div>
							</div>
							{newTradeForm.touched.balance && newTradeForm.errors.balance ? (
								<div className="text-red-500">
									{<>{newTradeForm.errors.balance}</>}
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
				<title>New trade | factiiv</title>
			</Head>
			<div className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full astro-UHFQUROE">
				<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] astro-UHFQUROE">
					<Sidebar />
					<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 astro-UHFQUROE">
						{/* <Search client:visible /> */}
					</div>
					<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 astro-UHFQUROE">
						<LogoSvg></LogoSvg>
					</div>
					<HeaderActions></HeaderActions>
					{/* animate-fade-in */}
					<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 px-2 xs:px-4 sm:px-6 astro-UHFQUROE">
						<div className=" pb-12 astro-UHFQUROE">
							<main className="lg:px-6 w-full">
								<form onSubmit={newTradeForm.handleSubmit}>
									<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
										{" "}
										new trade{" "}
									</h2>
									<SearchConnections
										form={newTradeForm}
										value={connection}
										onSelectResult={handleSelectResult}
										title="choose a connection"
										linkHref="/new-connection"
										linkLabel={
											<>
												<strong>+</strong> add new connection
											</>
										}
									></SearchConnections>
									{newTradeForm?.touched?.connection &&
									newTradeForm.errors.connection ? (
											<div className="text-red-500">
												{<>{newTradeForm.errors.connection}</>}
											</div>
										) : null}
									<p className="mt-3 mb-1 text-sm font-medium text-gray-500">
										trade opened date
									</p>
									<span id="control" className="w-full flex">
										<CalendarPicker
											onDateSelected={(date: string) =>
												newTradeForm.setFieldValue("relationshipDate", date)
											}
											value={
												new Date().toISOString().slice(0, 10)
											}
										/>
									</span>
									{newTradeForm.touched.relationshipDate &&
									newTradeForm.errors.relationshipDate ? (
											<div className="text-red-500">
												{<>{newTradeForm.errors.relationshipDate}</>}
											</div>
										) : null}
									<p className="mt-3 mb-1 text-sm font-medium text-gray-500">
										trade type
									</p>
									<span id="control" className="w-full flex">
										<button
											id="trade-borrow"
											type="button"
											className={
												"relative inline-block items-center rounded-l text-center border-2 px-4 py-1 text-sm font-medium focus:z-10 focus:outline-none w-24 " +
												(newTradeForm.values.typeDesc === TradeType.BORROW
													? "bg-topaz text-white border-onyx"
													: "text-onyx border-onyx bg-white hover:bg-gray-50")
											}
										>
											<input
												className="opacity-0 absolute w-full h-full [appearance:none] left-0 top-0 cursor-pointer"
												type="radio"
												name="typeDesc"
												id="borrow"
												value={TradeType.BORROW}
												onChange={newTradeForm.handleChange}
												onBlur={newTradeForm.handleBlur}
												onClick={() => {
													setRelationDescription(TradeRole.LENDER);
													newTradeForm.setFieldValue(
														"relationDescription",
														TradeRole.LENDER
													);
												}}
											/>
											borrow
										</button>
										<button
											id="trade-buysell"
											type="button"
											className={
												"relative -ml-px inline-block items-center rounded-r text-center border-2 px-4 py-1 text-sm font-medium focus:z-10 focus:outline-none w-24 " +
												(newTradeForm.values.typeDesc === TradeType.BUYSELL
													? "bg-topaz text-white border-onyx"
													: "text-onyx border-onyx bg-white hover:bg-gray-50")
											}
										>
											<input
												className="opacity-0 absolute w-full h-full [appearance:none] left-0 top-0 cursor-pointer"
												type="radio"
												name="typeDesc"
												id="buy"
												value={TradeType.BUYSELL}
												onChange={newTradeForm.handleChange}
												onBlur={newTradeForm.handleBlur}
												onClick={() => {
													setRelationDescription(TradeRole.BUYER);
													newTradeForm.setFieldValue(
														"relationDescription",
														TradeRole.BUYER
													);
												}}
											/>
											buy/sell
										</button>
									</span>
									{newTradeForm.touched.typeDesc &&
									newTradeForm.errors.typeDesc ? (
											<div className="text-red-500">
												{<>{newTradeForm.errors.typeDesc}</>}
											</div>
										) : null}
									{newTradeForm.values.typeDesc === TradeType.BUYSELL
										? renderBuyFormSection()
										: renderBorrowFormSection()}
									{!!tradeError && (
										<div className="mx-auto w-full flex justify-center mt-6">
											<p className="text-red-500 text-xl">{tradeError}</p>
										</div>
									)}
									<div className="mx-auto max-w-max mt-6 flex flex-col justify-center">
										<button
											disabled={
												!isProfileVerified || isLoading || isSubmittingNewTrade
											}
											id="submit-trade"
											type="submit"
											className={
												"relative group block mt-1 animate-fade-in w-full" +
												(!isProfileVerified || isLoading || isSubmittingNewTrade
													? " cursor-not-allowed opacity-50"
													: " cursor-pointer")
											}
										>
											<span className="bg-topaz z-[2] relative group-hover:-translate-y-1 focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 w-full flex items-center justify-center space-x-4 will-change-transform ">
												submit
											</span>
											<span className="absolute inset-0 bg-onyx z-[1] rounded"></span>
										</button>
									</div>
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

export default NewTrade;
