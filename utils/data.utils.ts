export const encodeData = <T>(data: T) => {
	return encodeURI(JSON.stringify(data));
};
export const decodeData = <T extends object>(data: string | null): T | null => {
	if (!data) return null;
	return JSON.parse(decodeURI(data)) satisfies T;
};

export const serialize = (data: {
	[key: string]: string | boolean | number | null | undefined;
}) => {
	return Object.fromEntries(
		Object.entries(data).filter(
			([key, value]) => value !== null && value !== undefined
		)
	);
};

export const daysLateLabel = (daysLate: number): string => { // 90
	if (daysLate <= 30) return "on-time";
	if (daysLate > 90) return "90+";
	if (daysLate > 60) return "60+";
	return "30+";
};
