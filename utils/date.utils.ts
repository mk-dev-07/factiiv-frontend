import isToday from "date-fns/isToday";
import isYesterday from "date-fns/isYesterday";
import isThisWeek from "date-fns/isThisWeek";
import { Locale } from "date-fns";

/**
 * Converts date to string using Intl API. The default format is "Dec 2020".
 * If the formatting using Intl API fails, it formats the date manually to
 * the following format - "12.2020";
 *
 * @param date - date object
 * @param options - formatting options
 * @returns - formatted result
 */
export const dateToString = (
	date: Date,
	options: Intl.DateTimeFormatOptions = {
		month: "short",
		day: "numeric",
		year: "numeric",
	}
) => {
	try {
		return new Intl.DateTimeFormat("en-US", options).format(date);
	} catch (error) {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		return `${month}.${year}`;
	}
};

export const convertDateToPeriod = (
	date: Date,
	options?: { locale: { code: "en-US" } }
) => {
	if (isToday(date)) {
		return "today";
	}

	if (isYesterday(date)) {
		return "today";
	}

	if (isThisWeek(date, options)) {
		return "this week";
	}

	return "earlier";
};
const convertUTCDateToLocalDate = (date: Date) => {
	const newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
	const offset = date.getTimezoneOffset() / 60;
	const hours = date.getHours();
	newDate.setHours(hours - offset);
	return newDate;   
};

export const stringToDate = (date: string): string => {
	date = convertUTCDateToLocalDate(new Date(date)).toString();
	const formattedDate =
		new Date(date).toLocaleDateString("en-US", {
			month: "2-digit",
			day: "2-digit",
			year: "2-digit",
		}) +
		" " +
		new Date(date).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});

	return formattedDate;
};
