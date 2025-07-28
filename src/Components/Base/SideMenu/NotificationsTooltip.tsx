import React, { useEffect, useRef } from "react";
import InfoIcon from "../../../assets/infoIcon.svg";
import CloseIcon from "../../../assets/close.svg";

interface Notification {
  id: string;
  message: string;
  type: "unregistered" | "low_stock" | "expired" | "payment";
}

interface NotificationsTooltipProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  notifications: Notification[];
  closeNotification: (id: string) => void;
}

const NotificationsTooltip: React.FC<NotificationsTooltipProps> = ({
  isOpen,
  setIsOpen,
  notifications,
  closeNotification,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

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
        left: "0",
        width: "384px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        padding: "20px",
        marginTop: "10px",
        height: "400px", // ارتفاع ثابت
        overflowY: "auto", // اسکرول در صورت نیاز
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          height: "100%",
        }}
      >
        {notifications.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "#666",
              fontSize: "16px",
            }}
          >
            هیچ اعلانی وجود ندارد
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                width: "100%",
                minHeight: "103px",
                backgroundColor: "#4973DE",
                borderRadius: "8px",
                padding: "12px",
                position: "relative",
                flexShrink: 0,
              }}
            >
              {/* Top icons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <img src={InfoIcon} alt="info" style={{ color: "white" }} />
                <img
                  src={CloseIcon}
                  alt="close"
                  onClick={() => closeNotification(notification.id)}
                  style={{ filter: "invert(1)", cursor: "pointer" }}
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
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsTooltip;
