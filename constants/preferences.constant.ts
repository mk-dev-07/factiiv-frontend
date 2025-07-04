export const preferencesData = [
	{
		id: 1,
		title: "trade activity",
		items: [
			{
				key: "isNewTradeReported",
				label: "new trade reported",
				description:
					"when a new trade has been reported against a business you own by another user.",
			},
			{
				key: "isNewActivityReported",
				label: "new activity reported",
				description:
					"when new trade activity has been reported against a business you own by another user.",
			},
			{
				key: "isNewTradeEntered",
				label: "new trade entered",
				description:
					"when a new trade has been entered by an admin or bulk upload.",
			},
			{
				key: "isNewActivityEntered",
				label: "new activity entered",
				description:
					"when new trade activity has been entered by an admin or bulk upload",
			},
			{
				key: "isresponse",
				label: "response",
				description: "when another user responds to a trade reported by you.",
			},
			{
				key: "isAccountTradeActivityUpdate",
				label: "account/trade/activity update",
				description:
					"when an admin has updated information on your account or one of your trades.",
			},
		],
	},
	{
		id: 2,
		title: "improvements and issues",
		items: [
			{
				key: "isImprovements",
				label: "improvements",
				description:
					"when you are missing information for factiiv verification.",
			},
			{
				key: "isIssueResolution",
				label: "issue resolution",
				description:
					"when admin responses to your support requests have been made.",
			},
		],
	},
	{
		id: 3,
		title: "AI Assist (coming soon)",
		items: [
			{
				key: "isRecommendations",
				label: "recommendations",
				description:
					"get credit improvement recommendations from our AI engine.",
			},
			{
				key: "isBusinessOwnership",
				label: "business ownership",
				description: "when our AI thinks you may own a business.",
			},
			{
				key: "isBusinessMerge",
				label: "business merge",
				description:
					"when our AI wants to merge multiple existing business entries.",
			},
		],
	},
	{
		id: 4,
		title: "factiiv updates",
		items: [
			{
				key: "isPlatformUpdates",
				label: "platform updates",
				description:
					"stay up to date on all the new developments on the factiiv platform.",
			},
		],
	},
];