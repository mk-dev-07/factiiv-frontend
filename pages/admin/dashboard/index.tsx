import getConfig from "next/config";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import MobileNav from "../../../components/admin/admin-mobile-nav";
import AdminSidebar from "../../../components/admin/admin-sidebar";
import DataManagementCard from "../../../components/data-management-card";
import HighlightCard from "../../../components/highlight-card";
import LoadingOverlay from "../../../components/loading-overlay";
import { LogoAdminSvg } from "../../../components/svgs/LogoAdminSvg";
import MenuSvg from "../../../components/svgs/MenuSvg";
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch";
import { useAdminStore } from "../../../store";
import { IUser } from "../../../types/user.interface";
import QueueCard from "../../../components/queue-card";
import { IQueueCardItem } from "../../../types/queuecard.interface";

const getApiUrl = () => {
	const {
		publicRuntimeConfig: { apiUrl },
	} = getConfig();

	return apiUrl;
};

const NormalAdmin = () => {
	const adminStore = useAdminStore();
	const { refreshedFetch } = useAuthenticatedFetch({ isAdmin: true });

	// const [onboardingNumber, setOnboardingNumber] = useState<number>(0);
	// const [documentationNumber, setDocumentationNumber] = useState<number>(0);
	// const [informationNumber, setInformationNumber] = useState<number>(0);
	// const [errorNumber, setErrorNumber] = useState<number>(10);

	const [accountsNumber, setAccountsNumber] = useState<number>(0);
	const [businessesNumber, setBusinessesNumber] = useState<number>(0);
	const [tradesNumber, setTradesNumber] = useState<number>(0);
	const [activitiesNumber, setActivitiesNumber] = useState<number>(0);

	const [adminsNumber, setAdminsNumber] = useState<number>(0);
	const [isSuperadmin, setIsSuperadmin] = useState(false);
	const [onboardingStat, setOnboardingStat] = useState<IQueueCardItem[]>();
	const [documentStat, setDocumentStat] = useState<IQueueCardItem[]>();
	const [profileInfoStat, setProfileInfoStat] = useState<IQueueCardItem[]>();

	//FETCH INFO (UNVERIFIED)
	// const fetchInfo = async () => {
	// 	try {
	// 		const response = await refreshedFetch(
	// 			`${getApiUrl()}/admins/profiles-info-count/unverified`,
	// 			{
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 					Authorization: `Bearer ${adminStore.token}`,
	// 				},
	// 			}
	// 		);
	// 		const data = await response.json();
	// 		return data.payload;
	// 	} catch (error) {
	// 		console.error(error);
	// 		return null;
	// 	}
	// };

	// FETCH ADMINS
	const fetchAdmins = async () => {
		try {
			const response = await refreshedFetch(`${getApiUrl()}/admins/admin-count`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
			});
			const data = await response.json();
			return data.payload;
		} catch (error) {
			console.error(error);
		}
	};

	// FETCH USERS - paged
	const fetchUsers = async () => {
		try {
			const response = await refreshedFetch(`${getApiUrl()}/admins/users-count`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${adminStore.token}`,
				},
			});
			const data = await response.json();
			return data.payload;
		} catch (error) {
			console.error(error);
		}
	};

	const fetchStatData = async () => {
		try {
			const response = await refreshedFetch(
				`${getApiUrl()}/admins/stat-data`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${adminStore.token}`,
					},
				}
			);
			const data = await response.json();
			return data?.payload;
		} catch (error) {
			console.error(error);
		}
	};

	// const infoQuery = useQuery({
	// 	queryKey: ["info"],
	// 	queryFn: fetchInfo,
	// 	onSuccess: (dataResponse) => {
	// 		if (dataResponse) {
	// 			setInformationNumber(dataResponse ?? 0);
	// 		}
	// 	},
	// });

	const usersQuery = useQuery({
		queryKey: ["users"],
		queryFn: fetchUsers,
		onSuccess: (dataResponse) => {
			setAccountsNumber(dataResponse ?? 0);
		},
	});


	const insertBulk =async ()=>{
		try {
			const res = await refreshedFetch(
				`${getApiUrl()}/admins/bulkuser`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${adminStore.token}`,
					}
				}
			);
			const data = await res.json();
			console.log("data", data);
		} catch (e) {
			console.log(e);
		}
	};

	const statQuery = useQuery({
		queryKey: ["stats", accountsNumber],
		queryFn: fetchStatData,
		onSuccess: (statData:any) => {
			console.log("statData", statData);
			const { admin } = adminStore;
			const { id: adminId } = admin || {};

			if (!adminId) return;

			const profileStat = statData.profileStat;
			setOnboardingStat((prev) => {
				const list = [];
				const awaiting = profileStat.filter((profile: { profileDataStatus: any; isReviewed: any; }) => !profile.profileDataStatus && !profile.isReviewed);
				const approved = profileStat.filter((profile: { profileDataStatus: any; isReviewed: any; }) => profile.profileDataStatus && profile.isReviewed);
				const rejected = profileStat.filter((profile: { profileDataStatus: any; isReviewed: any; }) => !profile.profileDataStatus && profile.isReviewed);
				list.push({count: awaiting.length ? awaiting[0].count : 0, lable: "Awaiting review", link: "/admin/onboarding?status=awaiting"},);
				list.push({count: approved.length ? approved[0].count : 0, lable: "Approved", link: "/admin/onboarding?status=approved"},);
				list.push({count: rejected.length ? rejected[0].count : 0, lable: "Rejected", link: "/admin/onboarding?status=rejected"},);
				
				return list;
			});

			const docStat = statData.docStat;
			setDocumentStat((prev) => {
				const list = [];
				const awaiting = docStat.filter((profile: { profileDocsStatus: any; isDocsReviewed: any; }) => !profile.profileDocsStatus && !profile.isDocsReviewed);
				const approved = docStat.filter((profile: { profileDocsStatus: any; isDocsReviewed: any; }) => profile.profileDocsStatus && profile.isDocsReviewed);
				const rejected = docStat.filter((profile: { profileDocsStatus: any; isDocsReviewed: any; }) => !profile.profileDocsStatus && profile.isDocsReviewed);
				list.push({count: awaiting.length ? awaiting[0].count : 0, lable: "Awaiting review", link: "/admin/documentation?status=awaiting"},);
				list.push({count: approved.length ? approved[0].count : 0, lable: "Approved", link: "/admin/documentation?status=approved"},);
				list.push({count: rejected.length ? rejected[0].count : 0, lable: "Rejected", link: "/admin/documentation?status=rejected"},);
				
				return list;
			});

			const infoStat = statData.profileInfoStat;
			setProfileInfoStat((prev) => {
				const list = [];
				const awaiting = infoStat.filter((profile: { verifiedStatus: any; isReviewed: any; }) => !profile.verifiedStatus && !profile.isReviewed);
				const approved = infoStat.filter((profile: { verifiedStatus: any; isReviewed: any; }) => profile.verifiedStatus && profile.isReviewed);
				const rejected = infoStat.filter((profile: { verifiedStatus: any; isReviewed: any; }) => !profile.verifiedStatus && profile.isReviewed);
				list.push({count: awaiting.length ? awaiting[0].count : 0, lable: "Awaiting review", link: "/admin/information?status=awaiting"},);
				list.push({count: approved.length ? approved[0].count : 0, lable: "Approved", link: "/admin/information?status=approved"},);
				list.push({count: rejected.length ? rejected[0].count : 0, lable: "Rejected", link: "/admin/information?status=rejected"},);
				
				return list;
			});
			setBusinessesNumber(statData.businessCount ?? 0);
			setTradesNumber(statData.tradeCount ?? 0);
			setActivitiesNumber(statData.activityCount ?? 0);
			// setOnboardingNumber(statData.onboardingCount ?? 0);
			// setDocumentationNumber(statData.docCount ?? 0);
		},
		enabled: !!accountsNumber && accountsNumber >= 0,
	});

	const adminsQuery = useQuery({
		queryKey: ["admins"],
		queryFn: fetchAdmins,
		onSuccess: (dataResponse) => {
			setAdminsNumber(dataResponse ? (dataResponse -1) : 0);
		},
		enabled: !!isSuperadmin,
	});

	useEffect(() => {
		setIsSuperadmin(!!adminStore?.admin?.isPrimary);
	}, [adminStore.admin]);

	return (
		<div
			className="h-full bg-pearl-shade dark:bg-onyx text-onyx dark:text-pearl font-prox relative w-full"
			data-new-gr-c-s-check-loaded="14.1098.0"
			data-gr-ext-installed
		>
			{(statQuery.isLoading ||
				adminsQuery.isLoading) && <LoadingOverlay />}
			<Head>
				<title>Admin dashboard | factiiv</title>
			</Head>
			<div className="h-full grid grid-cols-1 md:grid-cols-[minmax(180px,_240px)_minmax(580px,_1140px)] xl:grid-cols-[minmax(240px,_380px)_minmax(800px,_1300px)_minmax(240px,_380px)]">
				<AdminSidebar />
				<div className="col-start-2 col-end-3 row-start-1 row-end-2 hidden w-1/2 py-6 lg:block h-0">
					{/* <Search client:visible /> */}
				</div>
				<div className="col-start-1 col-end-2 row-start-1 row-end-2 p-2 xs:p-4 sm:p-6 md:hidden w-24">
					<LogoAdminSvg />
				</div>
				<div className="col-start-1 col-end-3 row-start-1 row-end-2 justify-self-end md:col-start-2 xl:col-start-3 py-2 xs:py-4 pr-2 xs:pr-4 sm:py-6 sm:pr-6 astro-FRXN4BQ7">
					<MobileNav />
				</div>
				<div className="w-full min-h-[calc(100vh_-_7rem)] md:col-start-2 md:col-span-1 animate-fade-in px-2 xs:px-4 sm:px-6">
					<div className=" pb-12">
						<main className="lg:px-6 w-full">
							{/* <button onClick={insertBulk}>click here</button> */}
							<div>
								{/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> */}
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{/* <HighlightCard
										name="onboarding queue"
										number={onboardingNumber}
										desc="businesses waiting"
										linkLabel="view queue"
										linkTo="/admin/onboarding"
									/>
									<HighlightCard
										name="documentation queue"
										number={documentationNumber}
										desc="docs to review"
										linkLabel="view docs"
										linkTo="/admin/documentation"
									/>
									<HighlightCard
										name="information queue"
										number={informationNumber}
										desc="data points to review"
										linkLabel="view info"
										linkTo="/admin/information"
									/> */}
									{/* <HighlightCard
										name="error queue"
										number={1}
										desc="errors to review"
										linkLabel="view issues"
										linkTo="/admin/issues"
									/> */}
									<QueueCard
										name="onboarding queue"
										linkLabel="view queue"
										linkTo="/admin/onboarding"
										itemList={onboardingStat}
									/>
									<QueueCard
										name="documentation queue"
										linkLabel="view queue"
										linkTo="/admin/documentation"
										itemList={documentStat}
									/>
									<QueueCard
										name="information queue"
										linkLabel="view queue"
										linkTo="/admin/information"
										itemList={profileInfoStat}
									/>
									{/* <QueueCard
										name="error queue"
										linkLabel="view queue"
										linkTo="/admin/onboarding"
									/> */}
								</div>
								<h2 className="text-xl text-onyx font-medium dark:text-pearl-shade my-3">
									data management
								</h2>
								<div className="w-full md:w-1/3 p-2 border-2 border-onyx bg-pearl rounded-md">
									<div className="grid grid-cols-2 gap-3">
										{isSuperadmin && (
											<DataManagementCard
												label="admins"
												number={adminsNumber}
												linkTo="/admin/admins"
												fullWidth={true}
											/>
										)}
										<DataManagementCard
											label="accounts"
											number={accountsNumber}
											linkTo="/admin/accounts"
										/>
										<DataManagementCard
											label="businesses"
											number={businessesNumber}
											linkTo="/admin/businesses"
										/>
										<DataManagementCard
											label="trades"
											number={tradesNumber}
											linkTo="/admin/trades"
										/>
										<DataManagementCard
											label="activity"
											number={activitiesNumber}
											linkTo="/admin/activity"
										/>
									</div>
								</div>
							</div>
						</main>
					</div>
				</div>
				<div className="hidden xl:block animate-fade-in-next w-52 xl:w-72 mx-auto">
					<div className="w-full">
						
					</div>
				</div>
			</div>
		</div>
	);
};

// export default NormalAdmin;
export default dynamic(() => Promise.resolve(NormalAdmin), { ssr: false });
