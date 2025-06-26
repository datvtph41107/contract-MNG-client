import type React from "react";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronDown, faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./DateRangePicker.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface DateRangePickerProps {
    value?: DateRange;
    onChange: (range: DateRange) => void;
    placeholder?: string;
    disabled?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    value = { startDate: null, endDate: null },
    onChange,
    placeholder = "Chọn khoảng thời gian",
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectingStart, setSelectingStart] = useState(true);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const months = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
    ];

    const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatDate = (date: Date | null) => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
        const vnDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));

        const day = vnDate.getDate().toString().padStart(2, "0");
        const month = (vnDate.getMonth() + 1).toString().padStart(2, "0");
        const year = vnDate.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const getDisplayText = () => {
        if (value.startDate && value.endDate) {
            return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
        }
        if (value.startDate) {
            return formatDate(value.startDate);
        }
        return placeholder;
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const isDateInRange = (date: Date) => {
        if (!value.startDate || !value.endDate) return false;
        return date >= value.startDate && date <= value.endDate;
    };

    const isDateSelected = (date: Date) => {
        return (
            (value.startDate && date.getTime() === value.startDate.getTime()) ||
            (value.endDate && date.getTime() === value.endDate.getTime())
        );
    };

    const handleDateClick = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today || disabled) return;

        if (selectingStart || !value.startDate) {
            onChange({ startDate: date, endDate: null });
            setSelectingStart(false);
        } else {
            if (date < value.startDate) {
                onChange({ startDate: date, endDate: value.startDate });
            } else {
                onChange({ startDate: value.startDate, endDate: date });
            }
            setSelectingStart(true);
            setIsOpen(false);
        }
    };

    const isDateDisabled = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange({ startDate: null, endDate: null });
        setSelectingStart(true);
    };

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentMonth((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
            return newDate;
        });
    };

    const days = getDaysInMonth(currentMonth);

    return (
        <div className={cx("date-range-picker")} ref={dropdownRef}>
            <div className={cx("date-input", { disabled })} onClick={() => !disabled && setIsOpen(!isOpen)}>
                <FontAwesomeIcon icon={faCalendarAlt} className={cx("calendar-icon")} />
                <span className={cx("date-text", { placeholder: !value.startDate && !value.endDate })}>{getDisplayText()}</span>
                {(value.startDate || value.endDate) && (
                    <button type="button" className={cx("clear-button")} onClick={handleClear}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                )}
                <FontAwesomeIcon icon={faChevronDown} className={cx("dropdown-icon", { open: isOpen })} />
            </div>

            {isOpen && (
                <div className={cx("calendar-dropdown")}>
                    <div className={cx("calendar-header")}>
                        <button type="button" className={cx("nav-button")} onClick={() => navigateMonth("prev")}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <h3 className={cx("month-year")}>
                            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        <button type="button" className={cx("nav-button")} onClick={() => navigateMonth("next")}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>

                    <div className={cx("calendar-grid")}>
                        <div className={cx("weekdays")}>
                            {weekDays.map((day) => (
                                <div key={day} className={cx("weekday")}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className={cx("days")}>
                            {days.map((date, index) => (
                                <div key={index} className={cx("day-cell")}>
                                    {date && (
                                        <button
                                            type="button"
                                            className={cx("day", {
                                                selected: isDateSelected(date),
                                                "in-range": isDateInRange(date),
                                                today: date.toDateString() === new Date().toDateString(),
                                                disabled: isDateDisabled(date),
                                            })}
                                            onClick={() => handleDateClick(date)}
                                            disabled={isDateDisabled(date)}
                                        >
                                            {date.getDate()}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
