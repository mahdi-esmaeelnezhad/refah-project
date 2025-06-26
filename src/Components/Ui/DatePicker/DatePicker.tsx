import React, { useState, useEffect, useRef } from "react";
import closeIcon from "../../../assets/close.svg";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLInputElement>;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateSelect,
  onClose,
  anchorRef,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  // Persian calendar conversion functions
  const gregorianToPersian = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // More accurate Persian calendar conversion
    // Persian year starts around March 21st (spring equinox)
    let persianYear = year - 621;
    let persianMonth, persianDay;

    // Calculate Persian date based on Gregorian date
    const dayOfYear =
      Math.floor(
        (date.getTime() - new Date(year, 0, 1).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    // Persian year starts around day 80 of Gregorian year (March 21st)
    if (dayOfYear < 80) {
      persianYear--;
      persianDay = dayOfYear + 286;
    } else {
      persianDay = dayOfYear - 79;
    }

    // Calculate Persian month
    if (persianDay <= 186) {
      persianMonth = Math.ceil(persianDay / 31);
    } else {
      persianDay -= 186;
      persianMonth = 7 + Math.ceil(persianDay / 30);
    }

    return { year: persianYear, month: persianMonth, day: persianDay };
  };

  const persianToGregorian = (
    persianYear: number,
    persianMonth: number,
    persianDay: number
  ) => {
    // Convert Persian date to Gregorian
    const gregorianYear = persianYear + 621;

    // Calculate day of Persian year
    let dayOfPersianYear;
    if (persianMonth <= 6) {
      dayOfPersianYear = (persianMonth - 1) * 31 + persianDay;
    } else {
      dayOfPersianYear = 186 + (persianMonth - 7) * 30 + persianDay;
    }

    // Convert to Gregorian day of year
    let gregorianDayOfYear;
    if (dayOfPersianYear <= 286) {
      gregorianDayOfYear = dayOfPersianYear + 79;
    } else {
      gregorianDayOfYear = dayOfPersianYear - 286;
    }

    // Create Gregorian date
    const gregorianDate = new Date(gregorianYear, 0, gregorianDayOfYear);
    return gregorianDate;
  };

  const getDaysInMonth = (year: number, month: number) => {
    const daysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];

    // Check if it's Esfand (month 12) and if it's a leap year
    if (month === 12) {
      // Persian leap years: 1399, 1403, 1407, 1411, 1415, etc.
      // Formula: (year - 1399) % 4 === 0
      const isLeapYear = (year - 1399) % 4 === 0;
      return isLeapYear ? 30 : 29;
    }

    return daysInMonth[month - 1];
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // Calculate the first day of the Persian month
    // 1 Farvardin 1398 was Thursday (4 in JavaScript Date, but we need Saturday=0)

    // Create the first day of the Persian month
    const firstDayOfMonth = persianToGregorian(year, month, 1);

    // Get the day of week (0=Saturday, 1=Sunday, ..., 6=Friday)
    const dayOfWeek = firstDayOfMonth.getDay();

    // Convert to Persian week start (Saturday = 0)
    return (dayOfWeek + 1) % 7;
  };

  const generateCalendarDays = () => {
    const persian = gregorianToPersian(currentMonth);
    const daysInMonth = getDaysInMonth(persian.year, persian.month);
    const firstDay = getFirstDayOfMonth(persian.year, persian.month);

    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateClick = (day: number) => {
    const persian = gregorianToPersian(currentMonth);
    const gregorianDate = persianToGregorian(persian.year, persian.month, day);
    onDateSelect(gregorianDate);
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    const persianToday = gregorianToPersian(today);
    const persianCurrent = gregorianToPersian(currentMonth);
    return (
      day === persianToday.day &&
      persianCurrent.month === persianToday.month &&
      persianCurrent.year === persianToday.year
    );
  };

  const isSelected = (day: number | null) => {
    if (!day || !selectedDate) return false;
    const persianSelected = gregorianToPersian(selectedDate);
    const persianCurrent = gregorianToPersian(currentMonth);
    return (
      day === persianSelected.day &&
      persianCurrent.month === persianSelected.month &&
      persianCurrent.year === persianSelected.year
    );
  };

  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const persianWeekDays = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنج‌شنبه",
    "جمعه",
  ];

  const getCurrentPersianDate = () => {
    const today = new Date();
    const persian = gregorianToPersian(today);
    return `${persian.year}/${persian.month}/${persian.day}`;
  };

  // Position calculation
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [anchorRef]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        (!anchorRef?.current ||
          !anchorRef.current.contains(event.target as Node))
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchorRef]);

  // Today click handler
  const handleTodayClick = () => {
    const today = new Date();
    onDateSelect(today);
    onClose();
  };

  const calendarDays = generateCalendarDays();

  return (
    <div
      ref={calendarRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: 430,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 9999,
        padding: 16,
        border: "1px solid #D1D1D1",
      }}
    >
      {/* Close icon */}
      <img
        src={closeIcon}
        alt="close"
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 20,
          height: 20,
          cursor: "pointer",
          zIndex: 1000,
        }}
        onClick={onClose}
      />

      {/* Header - Today clickable */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 16,
          cursor: "pointer",
          padding: "8px",
          borderRadius: "4px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#f5f5f5")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
        onClick={handleTodayClick}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "#4973DE",
            marginBottom: 8,
          }}
        >
          امروز
        </div>
        <div style={{ fontSize: 16, color: "#666" }}>
          {getCurrentPersianDate()}
        </div>
      </div>

      {/* Month/Year Selector */}
      <div
        style={{
          background: "#F2F2F2",
          width: 394,
          margin: "0 auto",
          borderRadius: 8,
          padding: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            position: "relative",
          }}
        >
          {/* Month Dropdown */}
          <div style={{ position: "relative" }} ref={monthDropdownRef}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #D1D1D1",
                borderRadius: 4,
                padding: "8px 12px",
                fontSize: 14,
                cursor: "pointer",
                minWidth: 100,
                textAlign: "center",
                userSelect: "none",
              }}
              onClick={() => {
                setShowMonthDropdown(!showMonthDropdown);
                setShowYearDropdown(false);
              }}
            >
              {persianMonths[gregorianToPersian(currentMonth).month - 1]}
            </div>
            {showMonthDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #D1D1D1",
                  borderRadius: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  zIndex: 10000,
                  width: 120,
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {persianMonths.map((month, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: 14,
                      borderBottom: "1px solid #f0f0f0",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fff")
                    }
                    onClick={() => {
                      const newDate = new Date(currentMonth);
                      //newDate.setMonth(index + 3);
                      // Convert Persian month index to Gregorian month
                      // Persian months: Farvardin(1) = March, Ordibehesht(2) = April, etc.
                      const gregorianMonth = (index + 2) % 12; // +2 because Persian year starts in March
                      newDate.setMonth(gregorianMonth);
                      setCurrentMonth(newDate);
                      setShowMonthDropdown(false);
                    }}
                  >
                    {month}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Year Dropdown */}
          <div style={{ position: "relative" }} ref={yearDropdownRef}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #D1D1D1",
                borderRadius: 4,
                padding: "8px 12px",
                fontSize: 14,
                cursor: "pointer",
                minWidth: 80,
                textAlign: "center",
                userSelect: "none",
              }}
              onClick={() => {
                setShowYearDropdown(!showYearDropdown);
                setShowMonthDropdown(false);
              }}
            >
              {gregorianToPersian(currentMonth).year}
            </div>
            {showYearDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #D1D1D1",
                  borderRadius: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  zIndex: 10000,
                  width: 100,
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {Array.from({ length: 10 }, (_, i) => 1398 + i).map((year) => (
                  <div
                    key={year}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: 14,
                      borderBottom: "1px solid #f0f0f0",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fff")
                    }
                    onClick={() => {
                      const newDate = new Date(currentMonth);
                      newDate.setFullYear(year + 621);
                      setCurrentMonth(newDate);
                      setShowYearDropdown(false);
                    }}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Calendar Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 4,
          }}
        >
          {/* Week day headers */}
          {persianWeekDays.map((day, index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
                fontSize: 10,
                fontWeight: 500,
                color: "#666",
                padding: "8px 4px",
                borderBottom: "1px solid #E0E0E0",
              }}
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => day && handleDateClick(day)}
              style={{
                textAlign: "center",
                fontSize: 19,
                fontWeight: 500,
                padding: "8px 4px",
                cursor: day ? "pointer" : "default",
                borderRadius: 4,
                background: isToday(day)
                  ? "#4973DE"
                  : isSelected(day)
                  ? "#E3F2FD"
                  : "transparent",
                color: isToday(day)
                  ? "#fff"
                  : isSelected(day)
                  ? "#4973DE"
                  : "#000",
                border: isSelected(day) ? "1px solid #4973DE" : "none",
                minHeight: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (day) {
                  e.currentTarget.style.backgroundColor = isToday(day)
                    ? "#3f5bb8"
                    : isSelected(day)
                    ? "#d1e7fd"
                    : "#f5f5f5";
                }
              }}
              onMouseLeave={(e) => {
                if (day) {
                  e.currentTarget.style.backgroundColor = isToday(day)
                    ? "#4973DE"
                    : isSelected(day)
                    ? "#E3F2FD"
                    : "transparent";
                }
              }}
            >
              {day ? day.toLocaleString("fa-IR") : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
