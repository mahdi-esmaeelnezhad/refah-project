import React, { useState, useRef, useEffect } from "react";

interface DropDownCustomProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  placeholder?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  inputPlaceholder?: string;
  disabled?: boolean;
  inputBackgroundColor?: string;
  borderRadius?: number | string;
}

function DropDownCustom<T extends { [key: string]: any }>({
  options,
  value,
  onChange,
  getLabel,
  placeholder = "انتخاب کنید",
  width = 299,
  height = 48,
  style = {},
  inputPlaceholder = "جستجو...",
  disabled = false,
  inputBackgroundColor = "#E7E7E7",
  borderRadius = 15,
}: DropDownCustomProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const filteredOptions = options.filter((option) =>
    getLabel(option).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      ref={ref}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        position: "relative",
        ...style,
      }}
    >
      <div
        onClick={() => !disabled && setOpen((prev) => !prev)}
        style={{
          background: inputBackgroundColor,
          borderRadius:
            typeof borderRadius === "number"
              ? `${borderRadius}px`
              : borderRadius,
          border: "1px solid #D1D1D1",
          height: typeof height === "number" ? `${height}px` : height,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          fontSize: 20,
          fontWeight: 500,
          color: value ? "#000" : "#7E7E7E",
          cursor: disabled ? "not-allowed" : "pointer",
          boxSizing: "border-box",
        }}
      >
        {value ? getLabel(value) : placeholder}
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top:
              typeof height === "number"
                ? `${height + 4}px`
                : `calc(${height} + 4px)`,
            left: 0,
            width: "100%",
            background: "#fff",
            border: "1px solid #D1D1D1",
            borderRadius: 15,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            zIndex: 100,
            maxHeight: 260,
            overflowY: "auto",
            padding: 0,
          }}
        >
          <div
            style={{
              padding: "8px 12px 8px 12px",
              background: "#E7E7E7",
              borderRadius: 55,
              margin: 8,
              marginBottom: 0,
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={inputPlaceholder}
              style={{
                width: "100%",
                height: 32,
                border: "none",
                outline: "none",
                background: inputBackgroundColor,
                borderRadius: 15,
                fontSize: 17,
                fontWeight: 500,
                color: "#222",
                padding: "0 10px",
              }}
            />
          </div>
          <div>
            {filteredOptions.length === 0 && (
              <div
                style={{
                  padding: "12px 0",
                  textAlign: "center",
                  color: "#7E7E7E",
                  fontSize: 18,
                  fontWeight: 500,
                  background: "#fff",
                  borderRadius: 15,
                }}
              >
                موردی یافت نشد
              </div>
            )}
            {filteredOptions.map((option, idx) => (
              <div
                key={getLabel(option) + idx}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setSearch("");
                }}
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  background: idx % 2 === 0 ? "#fff" : "#F8F8F8",
                  padding: "12px 18px",
                  cursor: "pointer",
                  borderBottom:
                    idx === filteredOptions.length - 1
                      ? "none"
                      : "1px solid #ECECEC",
                  transition: "background 0.2s",
                }}
              >
                {getLabel(option)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DropDownCustom;
