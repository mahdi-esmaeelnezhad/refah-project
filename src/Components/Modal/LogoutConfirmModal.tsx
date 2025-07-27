import React from "react";
import closeIcon from "../../assets/close.svg";
import warningIcon from "../../assets/warning.svg";
import { Button } from "../Ui/Button/button";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[499px] bg-white rounded-[15px] shadow-lg z-50">
        <div className="flex flex-col p-6 relative">
          <div className="flex justify-between mb-5">
            <div onClick={onClose} style={{ cursor: "pointer" }}>
              <img src={closeIcon} alt="close" className="w-10 h-10" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={warningIcon} alt="Warning" className="w-16 h-16 mb-4" />

            <div
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: 400,
                marginBottom: "30px",
                color: "#363636",
                lineHeight: "1.5",
              }}
            >
              آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <Button
                label="انصراف"
                color="#7485E5"
                onClick={onClose}
                style={{
                  width: "166px",
                  height: "48px",
                  color: "white",
                  borderRadius: "15px",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              />
              <Button
                label="تایید خروج"
                color="#DE4949"
                onClick={onConfirm}
                style={{
                  width: "166px",
                  height: "48px",
                  color: "white",
                  borderRadius: "15px",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutConfirmModal;
