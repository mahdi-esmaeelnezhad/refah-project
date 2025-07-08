import React from "react";
import successIcon from "../../assets/success.svg"; // مسیر صحیح آیکون موفقیت را قرار دهید

interface Props {
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<Props> = ({ open, onClose }) => {
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
        <img
          src={successIcon}
          alt="success"
          style={{
            width: 65,
            height: 65,
            marginBottom: 16,
            borderRadius: "50%",
          }}
        />
        <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 32 }}>
          عملیات با موفقیت انجام شد
        </div>
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

export default SuccessModal;
