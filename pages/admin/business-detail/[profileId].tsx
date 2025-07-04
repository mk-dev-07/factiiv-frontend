import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import LoadingOverlay from "../../../components/loading-overlay";
import { LogoAdminSvg } from "../../../components/svgs/LogoAdminSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { useAdminStore } from "../../../store";
import AccountIcon from "../../../public/images/account.png";
import { Trade } from "../../../types/trade.interface";
import { useFormik } from "formik";
import * as Yup from "yup";
import AdminTradesCard from "../../../components/admin/admin-trades-card";
import { useRouter } from "next/router";
import getConfig from "next/config";
import Profile from "../../../types/profile.interface";
import BusinessDocumentation from "../../../components/business-documentation";
import { states } from "../../../data/states";
import IndustryFormField from "../../../components/form/industry-form-field";

export async function getServerSideProps(context: any) {
	const { profileId } = context.params;

	return {
		props: {
			profileId,
		},
	};
}

const BusinessDetail = ({ profileId }: { profileId: string }) => {
	const router = useRouter();
	const adminStore = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });

	const [factiivLink, setFactiivLink] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [ownerName, setOwnerName] = useState("");
	const [isOwner, setIsOwner] = useState<boolean>(false);
	const [businessEmail, setBusinessEmail] = useState("");
	const [ein, setEin] = useState("");
	const [businessPhone, setBusinessPhone] = useState("");
	const [businessWebsite, setBusinessWebsite] = useState("");
	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [stateOrProvince, setStateOrProvince] = useState("");
	const [zipOrPostalCode, setZipOrPostalCode] = useState("");
	const [country, setCountry] = useState("");
	const [industry, setIndustry] = useState("");

	const [googleBusinessListing, setGoogleBusinessListing] = useState("");
	const [listedNumber, setListedNumber] = useState("");

	const [isBusinessInfoLoading, setIsBusinessInfoLoading] = useState(false);
	const [isBusinessListingLoading, setIsBusinessListingLoading] =
		useState(false);

	//FETCH PROFILES
	const [profileInfo, setProfileInfo] = useState<Profile>();
	const {
		publicRuntimeConfig: { rootUrl },
	} = getConfig();

	const fetchProfiles = async (): Promise<Profile> => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();

		try {
			const response = await refreshedFetch(
				`${apiUrl}/admins/profiles/${profileId}`,
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
			return {} as Profile;
		}
	};

	const { isLoading: isProfileLoading, refetch: refetchProfile } = useQuery({
		queryKey: ["profiles", profileId],
		queryFn: fetchProfiles,
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
		onSuccess: (profile) => {
			if (!profile || !profile?.id) {
				router.push("/admin/businesses");
				return;
			}
			setProfileInfo(() => profile);
		},
	});

	useEffect(() => {
		if (profileInfo) {
			setFactiivLink(profileInfo.factiivAddress || "");
			setOwnerName(profileInfo.ownerName || "");
			setBusinessName(profileInfo.businessName || "");
			setBusinessEmail(profileInfo.email || "");
			setEin(profileInfo.ein || "");
			setBusinessPhone(profileInfo.phoneNumber || "");
			setBusinessWebsite(profileInfo.website || "");
			setStreet(profileInfo.street || "");
			setCity(profileInfo.city || "");
			setStateOrProvince(profileInfo.state || "");
			setZipOrPostalCode(profileInfo.zip || "");
			setCountry(profileInfo.country || "");
			setGoogleBusinessListing(profileInfo.googleBusiness || "");
			setListedNumber(profileInfo.phoneListing || "");
			setIsOwner(profileInfo.isOwner || false);
			setIndustry(profileInfo.industry || "");
		}
	}, [profileInfo]);

	//VALIDATE FORM INPUT
	const formikBusinessInfo = useFormik({
		initialValues: {
			factiivLink,
			ownerName,
			isOwner,
			businessName,
			ein,
			businessPhone,
			businessWebsite,
			businessEmail,
			street,
			city,
			stateOrProvince,
			zipOrPostalCode,
			country,
			industry,
		},
		enableReinitialize: true,
		validationSchema: Yup.object({
			factiivLink: Yup.string(),
			ownerName: Yup.string().required("please, enter the owner name"),
			isOwner: Yup.boolean(),
			businessName: Yup.string().required("please, enter business name"),
			businessEmail: Yup.string().email("business email must be a valid email"),
			ein: Yup.string()
				.required("please, enter ein")
				.when("country", {
					is: (country: string) => country === "United States",
					then: (schema: Yup.StringSchema) =>
						schema.matches(
							/^\d{2}-\d{7}$/,
							"EIN number must only contain digits in xx-xxxxxxx format"
						),
					otherwise: (schema: Yup.StringSchema) =>
						schema.matches(
							/[0-9-]+/,
							"EIN number must only contain digits and dashes"
						),
				}),
			businessPhone: Yup.string(),
			businessWebsite: Yup.string(),
			street: Yup.string(),
			city: Yup.string(),
			stateOrProvince: Yup.string(),
			zipOrPostalCode: Yup.string(),
			country: Yup.string(),
			industry: Yup.string().required(
				"please, enter a business vertical the business is in"
			),
		}),
		onSubmit: async (values) => {
			setIsBusinessInfoLoading(true);
			const updateRequestBody = {
				...values,
				factiivAddress: values.factiivLink,
				state: values.stateOrProvince,
				zip: values.zipOrPostalCode,
				phoneNumber: values.businessPhone,
				website: values.businessWebsite,
			};
			await handleBusinessInfoUpdate(updateRequestBody);

			setIsBusinessInfoLoading(false);
		},
	});

	//UPDATE BUSINESS INFO
	interface IUpdateBusinessInfo {
		factiivAddress: string;
		businessName: string;
		street: string;
		city: string;
		state: string;
		zip: string;
		country: string;
		phoneNumber: string;
		website: string;
		ein: string;
	}
	const updateBusinessInfo = async (data: IUpdateBusinessInfo) => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();
		const response = await fetch(`${apiUrl}/admins/profiles/${profileId}`, {
			method: "PUT",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${adminStore.token}`,
			},
		});

		if (!response.ok) {
			formikBusinessInfo.setStatus("something went wrong, please try again!");
			setTimeout(() => {
				formikBusinessInfo.setStatus("");
			}, 2000);
			setIsBusinessInfoLoading(false);
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		formikBusinessInfo.setStatus("business information updated successfully!");
		setTimeout(() => {
			formikBusinessInfo.setStatus("");
		}, 2000);

		const updatedBusinessInfo = await response.json();
		return updatedBusinessInfo;
	};

	const mutateBusinessInfo = useMutation(updateBusinessInfo);

	const handleBusinessInfoUpdate = (newData: IUpdateBusinessInfo) => {
		mutateBusinessInfo.mutate(newData);
	};

	//BUSINESS LISTINGS
	const formikBusinessListings = useFormik({
		initialValues: {
			googleBusinessListing,
			listedNumber,
		},
		enableReinitialize: true,
		validationSchema: Yup.object({
			googleBusinessListing: Yup.string().required(
				"please, enter google business listing"
			),
			listedNumber: Yup.string().required("please, enter 411 listed number"),
		}),
		onSubmit: async (values, { setStatus }) => {
			setIsBusinessListingLoading(true);
			const updateRequestBody = {
				googleBusiness: values.googleBusinessListing,
				phoneListing: values.listedNumber,
			};
			await handleBusinessListingsUpdate(updateRequestBody);
			setStatus("business listings updated successfully!");
			setIsBusinessListingLoading(true);
		},
	});

	const formikDocuments = useFormik({
		initialValues: {
			aoiFile: undefined,
			einFile: undefined,
		},
		enableReinitialize: true,
		validationSchema: Yup.object({
			aoiFile: Yup.mixed(),
			einFile: Yup.mixed(),
		}),
		onSubmit: () => {
			handleSubmitDocuments();
		},
	});

	//UPDATE BUSINESS LISTINGS
	interface IUpdateBusinessListings {
		googleBusiness: string;
		phoneListing: string;
	}
	const updateBusinessListings = async (data: IUpdateBusinessListings) => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();
		const response = await fetch(
			`${apiUrl}/admins/profiles/business-listings/${profileId}`,
			{
				method: "PUT",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
			}
		);
		if (!response.ok) {
			formikBusinessListings.setStatus(
				"something went wrong, please try again!"
			);
			setTimeout(() => {
				formikBusinessListings.setStatus("");
			}, 2000);
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		formikBusinessListings.setStatus("business listings updated successfully!");
		setTimeout(() => {
			formikBusinessListings.setStatus("");
		}, 2000);

		const updatedBusinessListings = await response.json();
		return updatedBusinessListings;
	};

	const mutateBusinessListings = useMutation(updateBusinessListings);

	const handleBusinessListingsUpdate = (newData: IUpdateBusinessListings) => {
		mutateBusinessListings.mutate(newData);
	};
	const [myTradesForPage, setMyTradesForPage] = useState<Trade[]>([]);
	const [tradesWithMeForPage, setTradesWithMeForPage] = useState<Trade[]>([]);

	//RENDER TRADES
	const myTrades = myTradesForPage?.map((trade: Trade) => {
		return (
			<li
				onClick={() => router.push(`/admin/trade-detail/${trade.id}`)}
				key={trade.id}
				className="cursor-pointer"
			>
				<AdminTradesCard
					tradeId={trade.id}
					reportingBusiness={trade.fromCompanyName}
					receivingBusiness={trade.toCompanyName}
					balance={`$${parseInt(trade.balance)}`}
					total={`$${parseInt(trade.amount)}`}
					type={trade.typeDesc}
					date={new Date(trade.createdAt)}
					status={trade.adminStatus}
				/>
			</li>
		);
	});

	const tradesWithMe = tradesWithMeForPage?.map((trade: Trade) => {
		return (
			<li
				onClick={() => router.push(`/admin/trade-detail/${trade.id}`)}
				key={trade.id}
				className="cursor-pointer"
			>
				<AdminTradesCard
					tradeId={trade.id}
					reportingBusiness={trade.fromCompanyName}
					receivingBusiness={trade.toCompanyName}
					balance={`$${parseInt(trade.balance)}`}
					total={`$${parseInt(trade.amount)}`}
					type={trade.typeDesc}
					date={new Date(trade.createdAt)}
					status={trade.adminStatus}
				/>
			</li>
		);
	});

	//TRADES PAGINATION
	const [myTradesCurrentPage, setMyTradesCurrentPage] = useState(1);
	const [tradesWithMeCurrentPage, setTradesWithMeCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const myTradesTotalPages = Math.ceil(
		(profileInfo?.myTrades?.length || 1) / itemsPerPage
	);
	const tradesWithMeTotalPages = Math.ceil(
		(profileInfo?.tradesWithMe?.length || 1) / itemsPerPage
	);
	

	useEffect(() => {
		setMyTradesForPage(() => {
			const startIndex = (myTradesCurrentPage - 1) * itemsPerPage;
			const endIndex = startIndex + itemsPerPage;
			return profileInfo?.myTrades?.slice(startIndex, endIndex) || [];
		});
	}, [profileInfo?.myTrades, myTradesCurrentPage]);

	useEffect(() => {
		setTradesWithMeForPage(() => {
			const startIndex = (tradesWithMeCurrentPage - 1) * itemsPerPage;
			const endIndex = startIndex + itemsPerPage;
			return profileInfo?.tradesWithMe?.slice(startIndex, endIndex) || [];
		});
	}, [profileInfo?.tradesWithMe, tradesWithMeCurrentPage]);

	const handlePreviousMyTrades = () => {
		setMyTradesCurrentPage(myTradesCurrentPage - 1);
	};

	const handleNextMyTrades = () => {
		setMyTradesCurrentPage(myTradesCurrentPage + 1);
	};

	const handlePreviousTradesWithMe = () => {
		setTradesWithMeCurrentPage(tradesWithMeCurrentPage - 1);
	};

	const handleNextTradesWithMe = () => {
		setTradesWithMeCurrentPage(tradesWithMeCurrentPage + 1);
	};

	const uploadFileToServer = (file: File, type: "AOI" | "EIN") => {
		const {
			publicRuntimeConfig: { apiUrl },
		} = getConfig();

		if (!file || !adminStore.token) {
			return new Promise((_, reject) =>
				reject("upload file to server failed because of [file || token]")
			);
		}

		const body = new FormData();
		body.append("document", file);

		const headers = new Headers();
		headers.append("Authorization", `Bearer ${adminStore.token}`);

		return refreshedFetch(`${apiUrl}/admins/documents/${type}/${profileId}`, {
			method: "POST",
			headers,
			body,
		});
	};

	const aoiInputRef = useRef<HTMLInputElement>(null);
	const einInputRef = useRef<HTMLInputElement>(null);

	const handleSubmitDocuments = async () => {
		if (!aoiInputRef.current || !einInputRef.current) return;

		const { aoiFile, einFile } = {
			aoiFile: aoiInputRef.current?.files?.[0],
			einFile: einInputRef.current?.files?.[0],
		};

		if (einFile) {
			try {
				await uploadFileToServer(einFile, "EIN");
			} catch (error) {
				console.log(error);
			}
		}

		if (aoiFile) {
			try {
				await uploadFileToServer(aoiFile, "AOI");
			} catch (error) {
				console.log(error);
			}
		}

		formikDocuments.setStatus("Both files have been uploaded");
		setTimeout(() => {
			formikDocuments.setStatus("");
		}, 2000);
	};

	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full"
		>
			{isProfileLoading && <LoadingOverlay />}
			<Head>
				<title>Business Detail | factiiv</title>
			</Head>
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
				<AdminSidebar />
				<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
					{" "}
					{/*
          <Search client:visible /> */}
				</div>
				<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
					<LogoAdminSvg />
				</div>
				<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6">
					<MobileNav />
				</div>
				{/* MAIN */}
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
					<div className=" pb-12">
						<main className="lg:px-6 w-full">
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								business detail
							</h2>
							<form
								onSubmit={formikBusinessInfo.handleSubmit}
								className="border-2 border-onyx target:border-topaz rounded-md bg-pearl p-2 lg:p-6 mb-6"
							>
								<div className="mb-4">
									<p className="font-medium text-2xl">business information</p>
								</div>
								<div className="grid grid-cols-4 gap-4">
									<div className="col-span-4">
										<div>
											<label
												htmlFor="factiivLink"
												className="block font-medium text-onyx"
											>
												factiiv link
											</label>
											<div className="relative mt-1 rounded">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pr-2 border-2 rounded-l border-onyx bg-gray-100">
													<span className="text-onyx">credit.factiiv.io/</span>
												</div>
												<input
													readOnly={true}
													disabled={true}
													id="factiivLink"
													name="factiivLink"
													value={formikBusinessInfo.values.factiivLink}
													onChange={formikBusinessInfo.handleChange}
													onBlur={formikBusinessInfo.handleBlur}
													type="text"
													className="block w-full rounded border-2 border-onyx pl-[8.5rem] pr-12 py-2 focus:border-topaz focus:ring-topaz bg-gray-100"
												/>
											</div>
											{formikBusinessInfo.touched.factiivLink &&
											formikBusinessInfo.errors.factiivLink ? (
													<div className="text-red-500">
														{formikBusinessInfo.errors.factiivLink}
													</div>
												) : null}
										</div>
									</div>
									<div className="col-span-4 lg:col-span-2">
										<div>
											<label
												htmlFor="ownerName"
												className="block font-medium text-onyx"
											>
												owner name
											</label>
											<div className="mt-1">
												<input
													id="ownerName"
													name="ownerName"
													value={formikBusinessInfo.values.ownerName}
													onChange={formikBusinessInfo.handleChange}
													onBlur={formikBusinessInfo.handleBlur}
													type="text"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formikBusinessInfo.touched.ownerName &&
											formikBusinessInfo.errors.ownerName ? (
													<div className="text-red-500">
														{formikBusinessInfo.errors.ownerName}
													</div>
												) : null}
										</div>
									</div>
									<div className="col-span-4 lg:col-span-2 flex">
										<div className="flex items-center space-x-4">
											<div>
												<div className="mt-1">
													<input
														id="isOwner"
														name="isOwner"
														checked={formikBusinessInfo.values.isOwner}
														onBlur={formikBusinessInfo.handleBlur}
														onChange={formikBusinessInfo.handleChange}
														type="checkbox"
														placeholder=" "
														spellCheck={false}
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
											</div>
										</div>
										<label
											htmlFor="isOwner"
											className="text-md flex items-center ml-3 select-none"
										>
											are you the owner of this business?
										</label>
									</div>
									<div className="col-span-4 lg:col-span-2">
										<div>
											<label
												htmlFor="businessName"
												className="block font-medium text-onyx"
											>
												full business name
											</label>
											<div className="mt-1">
												<input
													id="businessName"
													name="businessName"
													value={formikBusinessInfo.values.businessName}
													onChange={formikBusinessInfo.handleChange}
													onBlur={formikBusinessInfo.handleBlur}
													type="text"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formikBusinessInfo.touched.businessName &&
											formikBusinessInfo.errors.businessName ? (
													<div className="text-red-500">
														{formikBusinessInfo.errors.businessName}
													</div>
												) : null}
										</div>
									</div>
									<div className="col-span-4 lg:col-span-2">
										<div>
											<label
												htmlFor="ein"
												className="block font-medium text-onyx"
											>
												EIN
											</label>
											<div className="mt-1">
												<input
													id="ein"
													name="ein"
													value={formikBusinessInfo.values.ein}
													onChange={formikBusinessInfo.handleChange}
													onBlur={formikBusinessInfo.handleBlur}
													type="text"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formikBusinessInfo.touched.ein &&
											formikBusinessInfo.errors.ein ? (
													<div className="text-red-500">
														{formikBusinessInfo.errors.ein}
													</div>
												) : null}
										</div>
									</div>
									<div className="col-span-4 lg:col-span-2">
										<div>
											<label
												htmlFor="businessPhone"
												className="block font-medium text-onyx"
											>
												business phone
											</label>
											<div className="mt-1">
												<input
													id="businessPhone"
													name="businessPhone"
													value={formikBusinessInfo.values.businessPhone}
													onChange={formikBusinessInfo.handleChange}
													onBlur={formikBusinessInfo.handleBlur}
													type="tel"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formikBusinessInfo.touched.businessPhone &&
											formikBusinessInfo.errors.businessPhone ? (
													<div className="text-red-500">
														{formikBusinessInfo.errors.businessPhone}
													</div>
												) : null}
										</div>
									</div>
									<div className="col-span-4 lg:col-span-2">
										<div>
											<label
												htmlFor="businessWebsite"
												className="block font-medium text-onyx"
											>
												business website
											</label>
											<div className="mt-1">
												<input
													id="businessWebsite"
													name="businessWebsite"
													value={formikBusinessInfo.values.businessWebsite}
													onChange={formikBusinessInfo.handleChange}
													onBlur={formikBusinessInfo.handleBlur}
													type="text"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formikBusinessInfo.touched.businessWebsite &&
											formikBusinessInfo.errors.businessWebsite ? (
													<div className="text-red-500">
														{formikBusinessInfo.errors.businessWebsite}
													</div>
												) : null}
										</div>
									</div>
									<div className="col-span-4">
										<div>
											<label
												htmlFor="businessEmail"
												className="block font-medium text-onyx"
											>
												business email
											</label>
											<div className="mt-1">
												<input
													id="businessEmail"
													name="businessEmail"
													value={formikBusinessInfo.values.businessEmail}
													onChange={formikBusinessInfo.handleChange}
													onBlur={formikBusinessInfo.handleBlur}
													type="email"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formikBusinessInfo.touched.businessEmail &&
											formikBusinessInfo.errors.businessEmail ? (
													<div className="text-red-500">
														{formikBusinessInfo.errors.businessEmail}
													</div>
												) : null}
										</div>
									</div>
									<div className="grid grid-cols-6 gap-4 col-span-4">
										<div className="col-span-6">
											<div>
												<label
													htmlFor="street"
													className="block font-medium text-onyx"
												>
													street address
												</label>
												<div className="mt-1">
													<input
														id="street"
														name="street"
														value={formikBusinessInfo.values.street}
														onChange={formikBusinessInfo.handleChange}
														onBlur={formikBusinessInfo.handleBlur}
														type="text"
														autoFocus={false}
														placeholder=" "
														autoComplete="street-address"
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formikBusinessInfo.touched.street &&
												formikBusinessInfo.errors.street ? (
														<div className="text-red-500">
															{formikBusinessInfo.errors.street}
														</div>
													) : null}
											</div>
										</div>
										<div className="col-span-6 lg:col-span-2">
											<div>
												<label
													htmlFor="city"
													className="block font-medium text-onyx"
												>
													city
												</label>
												<div className="mt-1">
													<input
														id="city"
														name="city"
														value={formikBusinessInfo.values.city}
														onChange={formikBusinessInfo.handleChange}
														onBlur={formikBusinessInfo.handleBlur}
														type="text"
														placeholder=" "
														autoComplete="address-level2"
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formikBusinessInfo.touched.city &&
												formikBusinessInfo.errors.city ? (
														<div className="text-red-500">
															{formikBusinessInfo.errors.city}
														</div>
													) : null}
											</div>
										</div>
										<div className="col-span-6 lg:col-span-2">
											<div>
												<label
													htmlFor="stateOrProvince"
													className="block font-medium text-onyx"
												>
													state / province
												</label>
												<div className="mt-1">
													<input
														id="stateOrProvince"
														name="stateOrProvince"
														value={formikBusinessInfo.values.stateOrProvince}
														onChange={formikBusinessInfo.handleChange}
														onBlur={formikBusinessInfo.handleBlur}
														type="text"
														placeholder=" "
														autoComplete="address-level1"
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formikBusinessInfo.touched.stateOrProvince &&
												formikBusinessInfo.errors.stateOrProvince ? (
														<div className="text-red-500">
															{formikBusinessInfo.errors.stateOrProvince}
														</div>
													) : null}
											</div>
										</div>
										<div className="col-span-6 lg:col-span-2">
											<div>
												<label
													htmlFor="zipOrPostalCode"
													className="block font-medium text-onyx"
												>
													zip / postal code
												</label>
												<div className="mt-1">
													<input
														id="zipOrPostalCode"
														name="zipOrPostalCode"
														value={formikBusinessInfo.values.zipOrPostalCode}
														onChange={formikBusinessInfo.handleChange}
														onBlur={formikBusinessInfo.handleBlur}
														type="text"
														placeholder=" "
														autoComplete="postal-code"
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formikBusinessInfo.touched.zipOrPostalCode &&
												formikBusinessInfo.errors.zipOrPostalCode ? (
														<div className="text-red-500">
															{formikBusinessInfo.errors.zipOrPostalCode}
														</div>
													) : null}
											</div>
										</div>
										<div className="col-span-6 lg:col-span-3">
											<div>
												<label
													htmlFor="country"
													className="block font-medium text-onyx"
												>
													country
												</label>
												<div className="mt-1">
													<select
														id="country"
														name="country"
														value={formikBusinessInfo.values.country}
														onChange={formikBusinessInfo.handleChange}
														onBlur={formikBusinessInfo.handleBlur}
														autoComplete="country-name"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													>
														<option value="" disabled>
															select your country
														</option>
														{/* <option>United States</option>
														<option>Canada</option> */}
														{/* kantri */}
														{states.map((state) => (
															<option key={state.id} value={state.name}>
																{state.name}
															</option>
														))}
													</select>
												</div>
											</div>
										</div>
										<IndustryFormField
											formik={formikBusinessInfo}
											profile={profileInfo}
											isAdmin={true}
										></IndustryFormField>
									</div>
								</div>
								<div className="pt-3 text-right">
									<button
										type="submit"
										className="inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
										id="business-details-listings-submit"
										disabled={isBusinessInfoLoading}
									>
										save
									</button>
									{formikBusinessInfo.status && (
										<div className="mt-2">{formikBusinessInfo.status}</div>
									)}
								</div>
							</form>

							{/* BUSINESS DOCUMENTATION */}
							<BusinessDocumentation
								activeProfile={profileInfo}
								einFilePath={profileInfo?.einDocumentPath}
								aoiFilePath={profileInfo?.aoiDocumentPath}
								token={adminStore.token}
								profileId={profileInfo?.id}
								isAdmin={true}
								onFileUpload={() => {
									setTimeout(() => refetchProfile(), 200);
								}}
							></BusinessDocumentation>

							{/* BUSINESS LISTINGS */}
							<form
								id="listings"
								className="border-2 border-onyx target:border-topaz rounded-md bg-pearl p-2 lg:p-6 mb-6"
							>
								<div className="mb-4">
									<p className="font-medium text-2xl">business listings</p>
								</div>
								<div className="grid grid-cols-4 gap-4 mt-6">
									<div className="col-span-4 sm:col-span-2">
										<div>
											<label
												htmlFor="googleBusinessListing"
												className="block font-medium text-onyx"
											>
												Google business listing
											</label>
											<div className="mt-1">
												<input
													id="googleBusinessListing"
													name="googleBusinessListing"
													value={
														formikBusinessListings.values.googleBusinessListing
													}
													onChange={formikBusinessListings.handleChange}
													onBlur={formikBusinessListings.handleBlur}
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formikBusinessListings.touched.googleBusinessListing &&
											formikBusinessListings.errors.googleBusinessListing ? (
													<div className="text-red-500">
														{formikBusinessListings.errors.googleBusinessListing}
													</div>
												) : null}
										</div>
									</div>
									<div className="col-span-4 sm:col-span-2">
										<div>
											<label
												htmlFor="listedNumber"
												className="block font-medium text-onyx"
											>
												411 listed number
											</label>
											<div className="mt-1">
												<input
													id="listedNumber"
													name="listedNumber"
													value={formikBusinessListings.values.listedNumber}
													onChange={formikBusinessListings.handleChange}
													onBlur={formikBusinessListings.handleBlur}
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formikBusinessListings.touched.listedNumber &&
											formikBusinessListings.errors.listedNumber ? (
													<div className="text-red-500">
														{formikBusinessListings.errors.listedNumber}
													</div>
												) : null}
										</div>
									</div>
								</div>
								<div className="pt-3 text-right">
									<button
										type="submit"
										className="inline-flex justify-center rounded border border-transparent bg-onyx py-2 px-4 font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-onyx focus:ring-offset-2"
										id="business-detail-documents-submit"
										disabled={isBusinessListingLoading}
										onClick={formikBusinessListings.submitForm}
									>
										save
									</button>
									{formikBusinessListings.status && (
										<div className="mt-2">{formikBusinessListings.status}</div>
									)}
								</div>
							</form>
							{/* OWNER ACCOUNT */}
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								owner account
							</h2>
							<Link
								href={`/admin/account-detail/${
									profileInfo && profileInfo.userId
								}`}
								target="_blank"
								className="inline-flex items-center justify-start space-x-3 border-2 border-onyx hover:bg-gold-lighter rounded-md px-2 py-2"
							>
								<img
									src={profileInfo?.imagePath || AccountIcon.src}
									className="w-12 h-12 flex-none border-2 border-onyx rounded-full hidden xs:block"
									alt="Account pic"
									style={{objectFit: "cover"}}
								/>
								<span>
									<h3 className="font-bold text-xl">
										{profileInfo && profileInfo.ownerName}
									</h3>
									<p>{profileInfo && profileInfo.email}</p>
								</span>
							</Link>
							{/* TRADES */}
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								my trades
							</h2>
							{myTradesForPage?.length > 0 ? (
								<>
									<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
										<ul role="list" className="divide-y-2 divide-onyx">
											{myTrades}
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
														{(myTradesCurrentPage - 1) * itemsPerPage + 1}
													</span>{" "}
													to
													<span className="font-medium">
														{" "}
														{(myTradesCurrentPage - 1) * itemsPerPage + itemsPerPage <
														(profileInfo?.myTrades?.length ?? 1)
															? (myTradesCurrentPage - 1) * itemsPerPage + itemsPerPage
															: profileInfo?.myTrades?.length}
													</span>{" "}
													of
													<span className="font-medium">
														{" "}
														{profileInfo?.myTrades?.length}
													</span>{" "}
													items
												</p>
											</div>
											<div className="flex flex-1 justify-between sm:justify-end">
												<button
													onClick={handlePreviousMyTrades}
													disabled={myTradesCurrentPage === 1}
													className={`${
														myTradesCurrentPage === 1 && "cursor-not-allowed"
													} relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
												>
													previous
												</button>
												<button
													onClick={handleNextMyTrades}
													disabled={myTradesCurrentPage === myTradesTotalPages}
													className={`${
														myTradesCurrentPage === myTradesTotalPages && "cursor-not-allowed"
													} relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
												>
													next
												</button>
											</div>
										</nav>
									</div>
								</>
							) : (
								<div className="px-4 py-3 overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
									<h1>No trades...</h1>
								</div>
							)}
							<br/>
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								trades with me
							</h2>
							{tradesWithMeForPage?.length > 0 ? (
								<>
									<div className="overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
										<ul role="list" className="divide-y-2 divide-onyx">
											{tradesWithMe}
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
														{(tradesWithMeCurrentPage - 1) * itemsPerPage + 1}
													</span>{" "}
													to
													<span className="font-medium">
														{" "}
														{(tradesWithMeCurrentPage - 1) * itemsPerPage + itemsPerPage <
														(profileInfo?.tradesWithMe?.length ?? 1)
															? (tradesWithMeCurrentPage - 1) * itemsPerPage + itemsPerPage
															: profileInfo?.tradesWithMe?.length}
													</span>{" "}
													of
													<span className="font-medium">
														{" "}
														{profileInfo?.tradesWithMe?.length}
													</span>{" "}
													items
												</p>
											</div>
											<div className="flex flex-1 justify-between sm:justify-end">
												<button
													onClick={handlePreviousTradesWithMe}
													disabled={tradesWithMeCurrentPage === 1}
													className={`${
														tradesWithMeCurrentPage === 1 && "cursor-not-allowed"
													} relative inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
												>
													previous
												</button>
												<button
													onClick={handleNextTradesWithMe}
													disabled={tradesWithMeCurrentPage === tradesWithMeTotalPages}
													className={`${
														tradesWithMeCurrentPage === tradesWithMeTotalPages && "cursor-not-allowed"
													} relative ml-3 inline-flex items-center rounded-md border-2 border-onyx bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
												>
													next
												</button>
											</div>
										</nav>
									</div>
								</>
							) : (
								<div className="px-4 py-3 overflow-hidden bg-white border-2 border-onyx sm:rounded-md mt-6">
									<h1>No trades...</h1>
								</div>
							)}
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

export default BusinessDetail;
