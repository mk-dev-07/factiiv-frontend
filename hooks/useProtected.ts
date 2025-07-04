import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "../config/firebase";
import { useFactiivStore } from "../store";
import { isBefore, isValid, subMinutes } from "date-fns";

const useProtected = () => {
	const router = useRouter();

	const store = useFactiivStore();
	const { user, sessionExpirationTime } = store;

	const excludedRoutes = ["/login", "/register", "/share-report"];
	const verifyRoutes = ["/verifying"];
	const onboardingRoutes = [
		"/verification-complete",
		"/passphrase-warning",
		"/passphrase",
		"/passphrase-confirm",
		"/account-created",
		"/business-created",
	];

	const invalidateUser = () => {
		store.logout();
		router.push("/login");
	};

	const onAuthStateChangedHandler = (authState: User | null) => {
		const lastActive = window.sessionStorage.getItem("lastActive");
		const lastActiveDate = new Date(lastActive + "");
		const date30MinutesAgo = subMinutes(new Date(), 30);
		const isLastActiveMoreThan30MinutesAgo = isBefore(
			lastActiveDate,
			date30MinutesAgo
		);

		if (
			!lastActive?.match(/[0-9]+/g) &&
			isValid(lastActiveDate) &&
			isLastActiveMoreThan30MinutesAgo
		) {
			invalidateUser();
			return;
		}

		if (sessionExpirationTime < Date.now()) {
			invalidateUser();
			return;
		}

		if (!authState || !user) {
			invalidateUser();
			return;
		}

		const isUserActivated = user?.userActivated;
		const isOnVerifyRoute = verifyRoutes.includes(router.pathname);
		const isOnExcludedRoute = excludedRoutes.includes(router.pathname);
		if (!isUserActivated && !isOnVerifyRoute && !isOnExcludedRoute) {
			router.push("/verification");
			return;
		}

		const hasProfiles =
			(user?.profiles?.length ?? 0) > 0 || !!store?.activeProfile?.id;
		const isOnOnboardingAndAllowedRoute = [
			"/verification",
			"/verifying",
			"/account-created",
			...onboardingRoutes,
		].includes(router.pathname);
		if (
			isUserActivated &&
			!hasProfiles &&
			!isOnOnboardingAndAllowedRoute &&
			!isOnExcludedRoute
		) {
			router.push("/core?step=1");
			return;
		}
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(onAuthStateChangedHandler);
		return () => unsubscribe();
	}, []);
};

export default useProtected;
