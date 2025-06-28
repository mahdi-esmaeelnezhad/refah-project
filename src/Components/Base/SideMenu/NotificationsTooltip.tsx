import React, { useEffect, useRef } from "react";
import InfoIcon from "../../../assets/infoIcon.svg";
import CloseIcon from "../../../assets/close.svg";

interface Notification {
  id: number;
  message: string;
  type: "unregistered" | "low_stock" | "expired" | "payment";
}

interface NotificationsTooltipProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NotificationsTooltip: React.FC<NotificationsTooltipProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const notifications: Notification[] = [
    {
      id: 1,
      message: "دو عدد کالای ثبت نشده وجود دارد",
      type: "unregistered",
    },
    {
      id: 2,
      message: "سه کالا موجودی کمتر از حداقل دارند",
      type: "low_stock",
    },
    {
      id: 3,
      message: "یک کالا تاریخ انقضای نزدیک دارد",
      type: "expired",
    },
    {
      id: 4,
      message: "پرداخت فاکتور ۲۳۴ در انتظار تایید است",
      type: "payment",
    },
  ];

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "absolute",
        top: "100%",
        right: 0,
        width: "384px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        padding: "20px",
        marginTop: "10px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              width: "340px",
              minHeight: "103px",
              backgroundColor: "#4973DE",
              borderRadius: "8px",
              padding: "12px",
              position: "relative",
            }}
          >
            {/* Top icons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                // marginBottom: "8px",
              }}
            >
              <img src={InfoIcon} alt="info" style={{ color: "white" }} />
              <img
                src={CloseIcon}
                alt="close"
                onClick={() => {}}
                style={{ filter: "invert(1)" }}
              />
            </div>

            {/* Message */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "40px",
                marginTop: "-10px",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "17px",
                  fontWeight: 500,
                  textAlign: "center",
                  lineHeight: "1.4",
                }}
              >
                {notification.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsTooltip;
