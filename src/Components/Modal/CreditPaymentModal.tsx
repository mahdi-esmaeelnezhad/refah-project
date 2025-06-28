import React from "react";
import closeIcon from "../../assets/close.svg";
import taraIcon from "../../assets/taraIcon.svg";
import digipayIcon from "../../assets/digipyIcon.svg";

interface CreditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (method: "tara" | "digipay") => void;
}

const CreditPaymentModal: React.FC<CreditPaymentModalProps> = ({
  isOpen,
  onClose,
  onSelectMethod,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[499px] bg-white rounded-[15px] shadow-lg z-50">
        <div className="flex flex-col p-6 relative">
          <div className="flex justify-end mb-5">
            <div onClick={onClose} style={{ cursor: "pointer" }}>
              <img src={closeIcon} alt="close" className="w-10 h-10" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div
              style={{
                textAlign: "center",
                fontSize: "23px",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              پرداخت اعتباری
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: 500,
                marginBottom: "30px",
                color: "#363636",
              }}
            >
              انتخاب روش پرداخت اعتباری
            </div>

            <div className="flex flex-col items-center pb-10 gap-4 w-full">
              <button
                onClick={() => onSelectMethod("tara")}
                style={{
                  width: "366px",
                  height: "61px",
                  backgroundColor: "#479E55",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 20px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontSize: "22px",
                    fontWeight: 600,
                  }}
                >
                  پرداخت از طریق تارا
                </span>
                <img
                  src={taraIcon}
                  alt="tara"
                  style={{ width: "40px", height: "40px" }}
                />
              </button>

              <button
                onClick={() => onSelectMethod("digipay")}
                style={{
                  width: "366px",
                  height: "61px",
                  backgroundColor: "#479E55",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 20px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontSize: "22px",
                    fontWeight: 600,
                  }}
                >
                  پرداخت از طریق دیجی پی
                </span>
                <img
                  src={digipayIcon}
                  alt="digipay"
                  style={{ width: "40px", height: "40px" }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditPaymentModal;
