import React, { useState, useRef } from "react";
import DatePicker from "../Ui/DatePicker/DatePicker";

interface FactorFilterProps {
  onApply: (filters: any) => void;
  onReset: () => void;
  showReset: boolean;
}

const FactorFilter: React.FC<FactorFilterProps> = ({
  onApply,
  onReset,
  showReset,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [minCount, setMinCount] = useState("");
  const [maxCount, setMaxCount] = useState("");
  const [gender, setGender] = useState<any>("0");

  // Calendar state management - only one can be open at a time
  const [openCalendar, setOpenCalendar] = useState<"start" | "end" | null>(
    null
  );

  // Refs for positioning
  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  const handleApply = () => {
    onApply({ startDate, endDate, minCount, maxCount, gender });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setMinCount("");
    setMaxCount("");
    setGender(null);
    setOpenCalendar(null);
    onReset();
  };

  const handleDateSelect = (date: Date, type: "start" | "end") => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setOpenCalendar(null);
  };

  const handleCalendarToggle = (type: "start" | "end") => {
    if (openCalendar === type) {
      setOpenCalendar(null);
    } else {
      setOpenCalendar(type);
    }
  };

  const filterBoxStyle = {
    width: 1512,
    height: 137,
    borderRadius: 15,
    background: "#ECECEC",
    padding: 24,
    margin: "16px 0",
    display: "flex",
    flexDirection: "row" as const,
    gap: 12,
    position: "relative" as const,
  };

  const filterBoxStyleFilter = {
    width: "100%",
    flexDirection: "column" as const,
    gap: 12,
    position: "relative" as const,
  };

  const rowStyle = {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 4,
    height: 48,
    position: "relative" as const,
  };

  const filterItemStyle = {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    width: 350,
    margin: "0 5px",
    position: "relative" as const,
  };

  const labelStyle = {
    fontSize: 19,
    fontWeight: 500,
    color: "#000",
    marginLeft: 6,
  };

  const inputStyle = {
    borderRadius: 55,
    width: "80%",
    height: 39,
    background: "#fff",
    border: "1px solid #D1D1D1",
    padding: "0 12px",
    fontSize: 16,
    outline: "none",
    cursor: "pointer",
  };

  const dateInputStyle = {
    borderRadius: 55,
    width: "80%",
    height: 39,
    background: "#fff",
    border: "1px solid #D1D1D1",
    padding: "0 12px",
    fontSize: 16,
    outline: "none",
    cursor: "pointer",
    textAlign: "center" as const,
  };

  const verticalLine = (
    <div
      style={{
        width: 1,
        height: 40,
        background: "#B4B4B4",
        margin: "0 16px",
        alignSelf: "center",
      }}
    />
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("fa-IR");
  };

  //   const genderOptions = [{ name: "زن" }, { name: "مرد" }];

  return (
    <div style={filterBoxStyle}>
      <div style={filterBoxStyleFilter}>
        <div style={rowStyle}>
          {/* Date Range */}
          <div style={filterItemStyle}>
            <label style={{ ...labelStyle, width: 100 }}>از تاریخ</label>
            <div style={{ position: "relative" }}>
              <input
                ref={startDateInputRef}
                type="text"
                style={{ ...dateInputStyle, width: 150 }}
                value={formatDate(startDate)}
                onClick={() => handleCalendarToggle("start")}
                placeholder="انتخاب تاریخ"
                readOnly
              />
              {openCalendar === "start" && (
                <DatePicker
                  selectedDate={startDate}
                  onDateSelect={(date) => handleDateSelect(date, "start")}
                  onClose={() => setOpenCalendar(null)}
                  anchorRef={
                    startDateInputRef as React.RefObject<HTMLInputElement>
                  }
                />
              )}
            </div>
            <label style={{ ...labelStyle, marginRight: 10, marginLeft: 10 }}>
              تا
            </label>
            <div style={{ position: "relative" }}>
              <input
                ref={endDateInputRef}
                type="text"
                style={{ ...dateInputStyle, width: 150 }}
                value={formatDate(endDate)}
                onClick={() => handleCalendarToggle("end")}
                placeholder="انتخاب تاریخ"
                readOnly
              />
              {openCalendar === "end" && (
                <DatePicker
                  selectedDate={endDate}
                  onDateSelect={(date) => handleDateSelect(date, "end")}
                  onClose={() => setOpenCalendar(null)}
                  anchorRef={
                    endDateInputRef as React.RefObject<HTMLInputElement>
                  }
                />
              )}
            </div>
          </div>

          {verticalLine}
          {/* Factor Count Range */}
          <div
            style={{
              ...filterItemStyle,
              width: "400px",
              flexDirection: "row",
              gap: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <label style={{ ...labelStyle, width: 200 }}>
                تعداد فاکتور از
              </label>
              <input
                type="number"
                style={{ ...inputStyle, cursor: "text" }}
                value={minCount}
                onChange={(e) => setMinCount(e.target.value)}
                placeholder="حداقل"
              />
            </div>
            <div style={{ width: 16 }} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <label style={labelStyle}>تا</label>
              <input
                type="number"
                style={{ ...inputStyle, cursor: "text" }}
                value={maxCount}
                onChange={(e) => setMaxCount(e.target.value)}
                placeholder="حداکثر"
              />
            </div>
          </div>
          {verticalLine}
          {/* Payment Type */}
          <div className="flex items-center">
            <span style={labelStyle}>جنسیت :</span>
            <div
              style={{
                width: 228,
                height: 48,
                background: "#D1D1D1",
                marginTop: 8,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <div
                onClick={() => setGender("0")}
                style={{
                  width: 114,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: gender === "0" ? "#7485E5" : "transparent",
                  color: gender === "0" ? "#fff" : "#000",
                  fontWeight: 500,
                  fontSize: 16,
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  userSelect: "none",
                }}
              >
                زن
              </div>
              <div
                style={{
                  width: 1,
                  height: 37,
                  background: "#D1D1D1",
                  margin: "0 8px",
                  alignSelf: "center",
                }}
              />
              <div
                onClick={() => setGender("1")}
                style={{
                  width: 114,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: gender === "1" ? "#7485E5" : "transparent",
                  color: gender === "1" ? "#fff" : "#000",
                  fontWeight: 500,
                  fontSize: 16,
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  userSelect: "none",
                }}
              >
                مرد
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleApply}
          style={{
            width: 159,
            height: 39,
            borderRadius: 15,
            background: "#7485E5",
            color: "#fff",
            fontWeight: 500,
            fontSize: 17,
            border: "none",
            marginRight: 24,
            cursor: "pointer",
          }}
        >
          اعمال فیلتر
        </button>
        {showReset && (
          <button
            onClick={handleReset}
            style={{
              width: 159,
              height: 39,
              borderRadius: 15,
              background: "#fff",
              color: "#7485E5",
              fontWeight: 500,
              fontSize: 17,
              border: "2px solid #7485E5",
              marginTop: 12,
              marginRight: 24,
              cursor: "pointer",
            }}
          >
            لغو فیلترها
          </button>
        )}
      </div>
    </div>
  );
};

export default FactorFilter;
