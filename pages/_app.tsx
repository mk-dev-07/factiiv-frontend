import "../styles/globals.css";
import type { AppProps } from "next/app";
// import Layout from "../components/Layout";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import getConfig from "next/config";
import { useFactiivStore } from "../store";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SnackbarProvider } from "notistack";

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const queryClient = new QueryClient();
	const store = useFactiivStore();
	const { user } = store;
	const {
		publicRuntimeConfig: { isProduction },
	} = getConfig();

	useEffect(() => {
		const beforeUnloadHandler = () => {
			window.sessionStorage.setItem("lastActive", Date.now() + "");
		};

		window.addEventListener("beforeunload", beforeUnloadHandler);
		return () => {
			window.removeEventListener("beforeunload", beforeUnloadHandler);
		};
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<SnackbarProvider maxSnack={3} autoHideDuration={2000} anchorOrigin={{horizontal: "center", vertical: "bottom"}}>
				<ThemeProvider enableSystem={true} attribute="class">
					<Component {...pageProps} />
				</ThemeProvider>
			</SnackbarProvider>
			{!isProduction && <ReactQueryDevtools initialIsOpen={false} />}
		</QueryClientProvider>
	);
}
