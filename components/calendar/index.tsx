import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = ({
	value,
	maxDate,
	minDate,
	onDateSelected,
}: {
	value?: Date;
	maxDate?: Date;
	minDate?: Date;
	onDateSelected: (date: Date, type: "year" | "month" | "day") => void;
}) => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [{ showYearPicker, showMonthYearPicker }, setPickerState] = useState<{
		showYearPicker: boolean;
		showMonthYearPicker: boolean;
	}>({ showYearPicker: false, showMonthYearPicker: false });

	const handleSelectDate = (date: Date) => {
		if (showMonthYearPicker && !showYearPicker) {
			const month = date.getMonth();
			const newDate = new Date(selectedDate.setMonth(month));
			setSelectedDate(newDate);
			setPickerState((state) => ({ ...state, showMonthYearPicker: false }));
			onDateSelected(newDate, "month");
			return;
		}

		if (showYearPicker) {
			const year = date.getFullYear();
			const newDate = new Date(selectedDate.setFullYear(year));
			setSelectedDate(newDate);
			setPickerState((state) => ({ ...state, showYearPicker: false }));
			onDateSelected(newDate, "year");
			return;
		}

		setSelectedDate(date);
		onDateSelected(date, "day");
	};

	const handleHeaderClick = () => {
		if (!showMonthYearPicker) {
			setPickerState((state) => ({
				...state,
				showMonthYearPicker: true,
			}));
			return;
		}

		if (showMonthYearPicker && !showYearPicker) {
			setPickerState((state) => ({
				...state,
				showYearPicker: true,
			}));
		}
	};

	const getHeaderValue = useCallback(
		(date: Date) => {
			if (!showMonthYearPicker) {
				return date.toLocaleString("en-US", {
					month: "long",
					year: "numeric",
				});
			}

			return date
				?.toLocaleString("en-US", {
					year: "numeric",
				})
				?.toLocaleString();
		},
		[showMonthYearPicker]
	);

	useEffect(() => {
		if (!value) {
			return;
		}

		setSelectedDate(value);
	}, [value]);

	return (
		<DatePicker
			inline
			selected={selectedDate}
			onChange={handleSelectDate}
			className="w-full"
			showYearPicker={showYearPicker}
			showMonthYearPicker={showMonthYearPicker}
			minDate={minDate}
			maxDate={maxDate}
			yearItemNumber={12}
			calendarClassName="dp-calendar"
			shouldCloseOnSelect={false}
			renderCustomHeader={(props: any) => {
				const {
					date,
					decreaseMonth,
					increaseMonth,
					decreaseYear,
					increaseYear,
				} = props;

				return (
					<div>
						<button
							aria-label="Previous Month"
							className={
								"react-datepicker__navigation react-datepicker__navigation--previous flex align-center justify-center"
							}
							onClick={(e) => {
								e.preventDefault();
								if (showYearPicker) {
									decreaseYear();
									return;
								}

								decreaseMonth();
							}}
						>
							<span
								className={
									"react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
								}
							>
								{"<"}
							</span>
						</button>
						<span
							className="react-datepicker__current-month"
							onClick={handleHeaderClick}
						>
							{getHeaderValue(date)}
						</span>
						<button
							aria-label="Next Month"
							className={
								"react-datepicker__navigation react-datepicker__navigation--next flex align-center justify-center"
							}
							onClick={(e) => {
								e.preventDefault();
								if (showYearPicker) {
									increaseYear();
									return;
								}

								increaseMonth();
							}}
						>
							<span
								className={
									"react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
								}
							>
								{">"}
							</span>
						</button>
					</div>
				);
			}}
		/>
	);
};

export default Calendar;
