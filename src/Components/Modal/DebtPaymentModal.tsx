import React, { useState } from "react";
import closeIcon from "../../assets/close.svg";
import infoFull from "../../assets/infoFull.svg";
import { numberToPersianToman } from "../../utils/numberToPersianWord";
import rial from "../../assets/img/rial.png";
import editIcon from "../../assets/edit.svg";
import { Button } from "../Ui/Button/button";

interface DebtPaymentModalProps {
  totalDebt: number;
  onConfirm: (amount: number, type: "card" | "cash") => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const DebtPaymentModal: React.FC<DebtPaymentModalProps> = ({
  totalDebt,
  onConfirm,
  isOpen = true,
  onClose,
}) => {
  const [editableAmount, setEditableAmount] = useState(totalDebt);

  if (!isOpen) return null;

  const handleCardPayment = () => {
    if (editableAmount > totalDebt) {
      alert("مبلغ وارد شده نمی‌تواند بیشتر از مبلغ کل باشد");
      return;
    }
    onConfirm(editableAmount, "card");
  };

  const handleCashPayment = () => {
    if (editableAmount > totalDebt) {
      alert("مبلغ وارد شده نمی‌تواند بیشتر از مبلغ کل باشد");
      return;
    }
    onConfirm(editableAmount, "cash");
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("fa-IR");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setEditableAmount(numValue);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[499px] bg-white rounded-[15px] shadow-lg z-50">
        <div className="flex flex-col p-6 relative">
          <div className="flex justify-between mb-5">
            <div onClick={onClose} style={{ cursor: "pointer" }}>
              <img src={closeIcon} alt="close" className="w-10 h-10" />
            </div>
            <div style={{ cursor: "pointer" }}>
              <img src={infoFull} alt="info" className="w-10 h-10" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div
              style={{
                textAlign: "center",
                fontSize: "23px",
                fontWeight: 500,
                marginBottom: "20px",
              }}
            >
              پرداخت بدهی
            </div>

            <div
              style={{
                width: "402px",
                height: "43px",
                backgroundColor: "#EFEFEF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 16px",
                marginBottom: "20px",
                borderRadius: "15px",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: 500 }}>
                مبلغ کل:
              </span>
              <span style={{ fontSize: "20px", fontWeight: 500 }}>
                {formatNumber(totalDebt)} ریال
              </span>
            </div>

            <div
              style={{
                width: "402px",
                height: "51px",
                backgroundColor: "#D1D1D1",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 16px",
                marginBottom: "20px",
                borderRadius: "15px",
              }}
            >
              <span
                style={{
                  color: "#000000",
                  fontSize: "20px",
                  fontWeight: 500,
                }}
              >
                مبلغ قابل پرداخت:
              </span>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={editableAmount}
                  onChange={handleAmountChange}
                  style={{
                    width: "207px",
                    height: "36px",
                    backgroundColor: "white",
                    border: "none",
                    padding: "0 16px",
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: 500,
                    borderRadius: "15px",
                    direction: "ltr",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "150px",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <img src={rial} alt="rial" className="w-6 h-6 ml-1" />
                  <img src={editIcon} alt="edit" className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: "17px",
                fontWeight: 400,
                marginBottom: "20px",
              }}
            >
              {numberToPersianToman(editableAmount)}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "30px",
              }}
            >
              <Button
                label="پرداخت کارتی"
                color="#479E55"
                onClick={handleCardPayment}
                style={{
                  width: "100%",
                  height: "48px",
                  color: "white",
                  borderRadius: "15px",
                }}
              />
              <Button
                label="پرداخت نقدی"
                color="#479E55"
                onClick={handleCashPayment}
                style={{
                  width: "100%",
                  height: "48px",
                  color: "white",
                  borderRadius: "15px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DebtPaymentModal;
