import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { dateToString } from "../../utils/date.utils";
import ClickOutsideWrapper from "../click-outside";
import Calendar from "../calendar";

const CalendarPicker = ({
	value,
	minDate,
	onDateSelected,
}: {
	value?: string;
	minDate?: string;
	onDateSelected: (date: string) => void;
}) => {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();
	const [minimumDate, setMinimumDate] = useState<Date | undefined>();

	const handleDateChange = (date: Date, type?: "year" | "month" | "day") => {
		setSelectedDate(date ?? new Date());
		onDateSelected(date?.toISOString() ?? new Date());

		if (type && type !== "day") {
			return;
		}

		setIsCalendarOpen(false);
	};

	useEffect(() => {
		minDate && setMinimumDate(new Date(minDate));

		if (!value) {
			return;
		}
		setSelectedDate(new Date(value));
		onDateSelected(value);
	}, []);

	return (
		<div className="relative ">
			<button
				id="open-calendar"
				type="button"
				className="border-2 border-onyx rounded bg-pearl py-2 px-6"
				onClick={() => setIsCalendarOpen(true)}
			>
				{selectedDate ? dateToString(selectedDate) : "Pick a Date"}
			</button>
			{isCalendarOpen && (
				<>
					<ClickOutsideWrapper
						clickOutsideHandler={() => {
							selectedDate && handleDateChange(selectedDate);
							setIsCalendarOpen(false);
						}}
						show={isCalendarOpen}
					>
						<div className="absolute left-[33px] md:left-0 top-1/2 transform -translate-y-1/2 scale-125 md:scale-150 z-10 max-w-[90vw] md:max-w-[300px] ">
							<Calendar
								value={selectedDate}
								minDate={minimumDate}
								onDateSelected={handleDateChange}
							></Calendar>
						</div>
					</ClickOutsideWrapper>
				</>
			)}
		</div>
	);
};
export default CalendarPicker;
