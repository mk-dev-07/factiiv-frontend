/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "api.credit.factiiv.io",
			},
			// {
			// 	protocol: "http",
			// 	hostname: "localhost:9904/api/v1",
			// },
			{
				protocol: "http",
				hostname: "178.220.24.117",
				port: "9904",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	reactStrictMode: true,
	swcMinify: true,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});

		return config;
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/login",
				permanent: true,
			},
		];
	},
	serverRuntimeConfig: {},
	publicRuntimeConfig: {
		apiUrl: process.env.NEXT_PUBLIC_API_URL,
		serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
		rootUrl: process.env.NEXT_PUBLIC_ROOT_URL,
		environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
		isProduction: process.env.NEXT_PUBLIC_ENVIRONMENT === "production",
		isPaymentProduction:
			process.env.NEXT_PUBLIC_PAYMENT_ENVIRONMENT === "production",
		// firebase
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
		measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
		apiLoginID: process.env.API_LOGIN_ID,
		clientKey: process.env.API_CLIENT_KEY,
		chargebackInterestRate: parseFloat(
			process.env.NEXT_PUBLIC_CHARGEBACK_INTEREST_RATE
		),
	},
};

module.exports = nextConfig;
