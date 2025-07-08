import React from "react";
import closeIcon from "../../assets/close.svg";
import netIcon from "../../assets/netClose.svg";

interface Props {
  open: boolean;
  onClose: () => void;
}

const InternetDisconnectedModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: 433,
          height: 277,
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        {/* Close Icon */}
        <img
          src={closeIcon}
          alt="close"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            cursor: "pointer",
            width: 24,
            height: 24,
          }}
          onClick={onClose}
        />

        {/* Wifi Icon */}
        <img
          src={netIcon}
          alt="wifi"
          className="w-[65px] h-[65px] mb-4 rounded-full"
        />

        {/* Message */}
        <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 32 }}>
          اتصال اینترنت برقرار نیست
        </div>

        {/* Confirm Button */}
        <button
          onClick={onClose}
          style={{
            background: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            width: "162px",
            height: "48px",
            border: "none",
            borderRadius: "15px",
            fontSize: 23,
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "auto",
          }}
        >
          <span>تایید</span>
        </button>
      </div>
    </div>
  );
};

export default InternetDisconnectedModal;
