import { isAdmin } from "@firebase/util";
import { useFormik } from "formik";
import getConfig from "next/config";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import ArticleSvg from "../../../components/svgs/ArticleSvg";
import { LogoAdminSvg } from "../../../components/svgs/LogoAdminSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import useProtected from "../../../hooks/useProtected";
import { useFactiivStore, useAdminStore } from "../../../store";
import * as Yup from "yup";
import { CallTracker } from "assert";
import Profile from "../../../types/profile.interface";
import { states } from "../../../data/states";
import IndustryFormField from "../../../components/form/industry-form-field";

const CreateBusiness = () => {
	const store = useFactiivStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });
	const router = useRouter();
	const {
		publicRuntimeConfig: { apiUrl, rootUrl },
	} = getConfig();
	const adminStore = useAdminStore();

	const [createUserError, setCreateUserError] = useState<string>("");

	const [isLoading, setIsLoading] = useState(false);

	const WEBSITE_REGEX =
		/^(?:(https?):\/\/)?(www\.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			factiivLink: "",
			ownerName: "",
			isOwner: false,
			businessName: "",
			ein: "",
			businessPhone: "",
			businessWebsite: "",
			street: "",
			city: "",
			stateOrProvince: "",
			zipOrPostalCode: "",
			country: "",
			googleBusinessListing: "",
			listedNumber: "",
			businessEmail: "",
			industry: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object({
			firstName: Yup.string(),
			lastName: Yup.string(),
			email: Yup.string()
				.email("account email must be a valid email")
				.required("please, enter the user email"),
			factiivLink: Yup.string().matches(/^\S*$/, "whitespace not allowed"),
			ownerName: Yup.string().required("please, enter the owner name"),
			isOwner: Yup.boolean(),
			businessName: Yup.string().required("please, enter the business name"),
			ein: Yup.string()
				.when("country", {
					is: (country: string) => country === "United States",
					then: (schema) =>
						schema.matches(
							/^\d{2}-\d{7}$/,
							"EIN number must only contain digits in xx-xxxxxxx format"
						),
					otherwise: (schema) =>
						schema.matches(
							/[0-9-]+/,
							"EIN number must only contain digits and dashes"
						),
				})
				.required("please, enter the EIN number"),
			businessEmail: Yup.string()
				.email("business email must be a valid email")
				.required("please, enter an email associated with this business"),
			businessPhone: Yup.string().matches(
				/^[+]?([ (]?[0-9]+[- )]?)+$/,
				"please, enter a phone number"
			),
			businessWebsite: Yup.string().matches(
				WEBSITE_REGEX,
				"business website must be a valid URL"
			),
			street: Yup.string(),
			city: Yup.string(),
			stateOrProvince: Yup.string(),
			zipOrPostalCode: Yup.string(),
			country: Yup.string(),
			industry: Yup.string().required(
				"please, enter a business vertical the business is in"
			),
			googleBusinessListing: Yup.string().matches(
				WEBSITE_REGEX,
				"google business listing must be a valid URL"
			),
			listedNumber: Yup.string(),
		}),
		onSubmit: async (values) => {
			if (!values) return;
			setIsLoading(true);

			const [_, username] = values.email.match(/(.+)@.+/) ?? [];

			const createUserData = {
				...values,
				username: username || values.email,
				phone: values.businessPhone,
				website: values.businessWebsite,
				stateOrProvince: values.stateOrProvince,
				zipOrPostalCode: values.zipOrPostalCode,
				factiivAddress: values.factiivLink,
				googleBusinessListing: values.googleBusinessListing || null,
				listedNumber: values.listedNumber || null,
			};

			try {
				await createUser(createUserData, adminStore.token);
				setIsLoading(false);

				router.push("/admin/dashboard");
			} catch (error: unknown) {
				setIsLoading(false);
				console.log(error);
				setCreateUserError(
					(error as Error)?.message ||
						"There was an error creating user and profile!"
				);
			}
		},
	});

	const createUser = async (data: any, token: string | null) => {
		const response = await refreshedFetch(`${apiUrl}/admins/profiles`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});
		const json = await response.json();

		if (!response.ok) {
			// throw new Error(json.message);
			throw new Error(json?.errors?.[0]);
		}

		return json;
	};

	return (
		<div
			data-gr-ext-installed
			data-new-gr-c-s-check-loaded="14.1098.0"
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full astro-FRXN4BQ7"
		>
			<Head>
				<title>Information queue | factiiv</title>
			</Head>
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)] astro-FRXN4BQ7">
				<AdminSidebar />
				<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0 astro-FRXN4BQ7">
					{" "}
					{/*
          <Search client:visible /> */}
				</div>
				<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24 astro-FRXN4BQ7">
					<LogoAdminSvg />
				</div>

				<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6 astro-FRXN4BQ7">
					<MobileNav />
				</div>
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6 astro-FRXN4BQ7">
					<div className=" pb-12 astro-FRXN4BQ7">
						{" "}
						<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
							{" "}
							owner account{" "}
						</h2>{" "}
						<form onSubmit={formik.handleSubmit}>
							<div className="border-2 border-onyx rounded-md bg-pearl p-2 lg:p-6 mb-6">
								<div className="mb-4">
									<p className="font-medium text-2xl">account data</p>
								</div>
								<div className="grid grid-cols-4 gap-4">
									<div className="col-span-4 lg:col-span-2">
										<div>
											<label className="block font-medium text-onyx">
												first name
											</label>
											<div className="mt-1">
												<input
													value={formik.values.firstName}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													id="firstName"
													name="firstName"
													type="text"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formik.touched.firstName && formik.errors.firstName ? (
												<div className="text-red-500">
													{formik.errors.firstName}
												</div>
											) : null}
										</div>
									</div>
									<div className="col-span-4 lg:col-span-2">
										<div>
											<label className="block font-medium text-onyx">
												last name
											</label>
											<div className="mt-1">
												<input
													value={formik.values.lastName}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													id="lastName"
													name="lastName"
													type="text"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formik.touched.lastName && formik.errors.lastName ? (
												<div className="text-red-500">
													{formik.errors.lastName}
												</div>
											) : null}
										</div>
									</div>
									<div className="col-span-4 lg:col-span-2">
										<div>
											<label className="block font-medium text-onyx">
												account email
											</label>
											<div className="mt-1">
												<input
													value={formik.values.email}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													id="email"
													name="email"
													type="email"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formik.touched.email && formik.errors.email ? (
												<div className="text-red-500">
													{formik.errors.email}
												</div>
											) : null}
										</div>
									</div>
								</div>
							</div>
							<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
								{" "}
								business detail{" "}
							</h2>{" "}
							<div className="border-2 border-onyx target:border-topaz rounded-md bg-pearl p-2 lg:p-6 mb-6">
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
													value={formik.values.factiivLink}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													type="text"
													className="block w-full rounded border-2 border-onyx pl-[8.5rem] pr-12 py-2 focus:border-topaz focus:ring-topaz bg-gray-100"
												/>
											</div>
											{formik.touched.factiivLink &&
											formik.errors.factiivLink ? (
													<div className="text-red-500">
														{formik.errors.factiivLink}
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
													value={formik.values.ownerName}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													type="text"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formik.touched.ownerName && formik.errors.ownerName ? (
												<div className="text-red-500">
													{formik.errors.ownerName}
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
														checked={formik.values.isOwner}
														onBlur={formik.handleBlur}
														onChange={formik.handleChange}
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
													value={formik.values.businessName}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													type="text"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formik.touched.businessName &&
											formik.errors.businessName ? (
													<div className="text-red-500">
														{formik.errors.businessName}
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
													value={formik.values.ein}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													type="text"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formik.touched.ein && formik.errors.ein ? (
												<div className="text-red-500">{formik.errors.ein}</div>
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
													value={formik.values.businessPhone}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													type="tel"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formik.touched.businessPhone &&
											formik.errors.businessPhone ? (
													<div className="text-red-500">
														{formik.errors.businessPhone}
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
													value={formik.values.businessWebsite}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													type="text"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formik.touched.businessWebsite &&
											formik.errors.businessWebsite ? (
													<div className="text-red-500">
														{formik.errors.businessWebsite}
													</div>
												) : null}
										</div>
									</div>
									<div className="col-span-4">
										<div>
											<label
												htmlFor="businessWebsite"
												className="block font-medium text-onyx"
											>
												business email
											</label>
											<div className="mt-1">
												<input
													id="businessEmail"
													name="businessEmail"
													value={formik.values.businessEmail}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													type="email"
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formik.touched.businessEmail &&
											formik.errors.businessEmail ? (
													<div className="text-red-500">
														{formik.errors.businessEmail}
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
														value={formik.values.street}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														type="text"
														autoFocus={false}
														placeholder=" "
														autoComplete="street-address"
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.street && formik.errors.street ? (
													<div className="text-red-500">
														{formik.errors.street}
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
														value={formik.values.city}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														type="text"
														placeholder=" "
														autoComplete="address-level2"
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.city && formik.errors.city ? (
													<div className="text-red-500">
														{formik.errors.city}
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
														value={formik.values.stateOrProvince}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														type="text"
														placeholder=" "
														autoComplete="address-level1"
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.stateOrProvince &&
												formik.errors.stateOrProvince ? (
														<div className="text-red-500">
															{formik.errors.stateOrProvince}
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
														value={formik.values.zipOrPostalCode}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														type="text"
														placeholder=" "
														autoComplete="postal-code"
														spellCheck="false"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													/>
												</div>
												{formik.touched.zipOrPostalCode &&
												formik.errors.zipOrPostalCode ? (
														<div className="text-red-500">
															{formik.errors.zipOrPostalCode}
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
														value={formik.values.country}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														autoComplete="country-name"
														className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
													>
														<option value="" disabled>
															select your country
														</option>
														{states.map((state) => (
															<option key={state.id} value={state.name}>
																{state.name}
															</option>
														))}
														{/* kantri */}
													</select>
												</div>
											</div>
										</div>
										<IndustryFormField 
											formik={formik}
											isAdmin={true}
										></IndustryFormField>
									</div>
								</div>
							</div>
							{/* Business listing and 411 number */}
							<div className="border-2 border-onyx target:border-topaz rounded-md bg-pearl p-2 lg:p-6 mb-6">
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
													value={formik.values.googleBusinessListing}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formik.touched.googleBusinessListing &&
											formik.errors.googleBusinessListing ? (
													<div className="text-red-500">
														{formik.errors.googleBusinessListing}
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
													value={formik.values.listedNumber}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													placeholder=" "
													spellCheck="false"
													className="block w-full !text-lg placeholder:text-lg bg-white appearance-none rounded border-2 border-onyx px-3 py-3 focus:border-topaz focus:outline-none sm:text-sm"
												/>
											</div>
											{formik.touched.listedNumber &&
											formik.errors.listedNumber ? (
													<div className="text-red-500">
														{formik.errors.listedNumber}
													</div>
												) : null}
										</div>
									</div>
								</div>
							</div>
							{createUserError && (
								<div className="flex justify-center align-center">
									<p className="text-red-500">{createUserError}</p>
								</div>
							)}
							<div className="my-3 max-w-xs mx-auto">
								<button
									type="submit"
									className="group grid w-full disabled"
									id="admin-create-business-submit"
									disabled={isLoading}
								>
									<span className="col-end-2 row-start-1 row-end-2 bg-onyx rounded border-2 border-onyx will-change-transform h-full"></span>
									<span className="bg-topaz subpixel-antialiased group-hover:-translate-y-1 translate-x-0 will-change-transform focus:-translate-y-1 focus:outline-none transition-transform text-white border-2 border-onyx rounded text-sm xs:text-lg font-medium py-3 px-6 flex items-center justify-center space-x-4 col-end-2 row-start-1 row-end-2">
										complete
									</span>
								</button>
							</div>
						</form>
						<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto astro-FRXN4BQ7">
							<div className="w-full"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// export default Information;
export default dynamic(() => Promise.resolve(CreateBusiness), { ssr: false });
