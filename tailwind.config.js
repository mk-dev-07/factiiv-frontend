/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	darkMode: "none",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./app/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			screens: {
				xs: "360px",
				...defaultTheme.screens,
			},
			backgroundImage: {
				animation: {
					"fade-in": "fade-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) both",
					"fade-in-next":
						"fade-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) .25s both",
					jello: "jello 0.7s linear .8s both",
				},
				keyframes: {
					"fade-in": {
						"0%": {
							transform: "translateY(15px)",
							transformOrigin: "50% 50%",
							filter: "blur(1px)",
							opacity: "0",
						},
						"100%": {
							transform: "translateY(0)",
							transformOrigin: "50% 50%",
							filter: "blur(0)",
							opacity: "1",
						},
					},
					// 'fade-in': {
					//     '0%': {
					//         transform: 'translateY(200px) scaleY(1.2) scaleX(0.9)',
					//         transformOrigin: '50% 50%',
					//         filter: 'blur(4px)',
					//         opacity: '0'
					//     },
					//     '100%': {
					//         transform: 'translateY(0) scaleY(1) scaleX(1)',
					//         transformOrigin: '50% 50%',
					//         filter: 'blur(0)',
					//         opacity: '1'
					//     },
					// },
					jello: {
						"0%, 100%": {
							transform: "transform: scale3d(1, 1, 1)",
						},
						"30%": {
							transform: "scale3d(0.75, 1.25, 1)",
						},
						"40%": {
							transform: "scale3d(1.25, 0.75, 1)",
						},
						"50%": {
							transform: "scale3d(0.85, 1.15, 1)",
						},
						"65%": {
							transform: "scale3d(1.05, 0.95, 1)",
						},
						"75%": {
							transform: "scale3d(0.95, 1.05, 1)",
						},
					},
				},
			},
			fontFamily: {
				prox: "'proxima-nova'",
			},
			colors: {
				gold: "#EFBC73",
				"gold-dark": "#E1A45E",
				"gold-light": "#F5CC91",
				"gold-lighter": "#FEEBCF",
				"gold-lightest": "#FEF5E8",
				topaz: "#409AF4",
				"topaz-dark": "#3C70EB",
				"topaz-light": "#75BAFF",
				"topaz-lighter": "#DEEDFE",
				"topaz-lightest": "#F3F9FF",
				pearl: "#fffcfb",
				"pearl-shade": "#f7f4ef",
				onyx: "#142935",
				"onyx-light": "#193F4C",
				"onyx-lighter": "#487A8B",
			},
		},
	},
	plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
