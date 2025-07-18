import React, { useEffect, useState } from "react";
import closeIcon from "../../assets/close.svg";
import infoIcon from "../../assets/info.svg";
import { numberToPersianToman } from "../../utils/numberToPersianWord";
import cartPayment from "../../assets/img/cartPayment.png";
import editIcon from "../../assets/edit.svg";
import { Button } from "../Ui/Button/button";
import { useModal } from "../../hooks/useModal";
import { usePaymentStore } from "../../hooks/usePaymentStore";
import Tooltip from "../Base/SideMenu/Tooltip";
import { DialPad } from "../Base/SideMenu/DialPad";

interface CartPaymentModalProps {
  totalAmount: number;
  onConfirm: (amount: number) => void;
  paymentType?: "cash" | "card" | "credit";
}

const CartPaymentModal: React.FC<CartPaymentModalProps> = ({
  totalAmount,
  onConfirm,
  paymentType = "card",
}) => {
  const {
    isCartPaymentOpen,
    closeCartPayment,
    openCartPaymentLoading,
    closeCartPaymentLoading,
    openCartPaymentPassword,
    openSuccessPayment,
  } = useModal();
  const [editableAmountStr, setEditableAmountStr] = useState(
    totalAmount.toString()
  );
  const [editableAmount, setEditableAmount] = useState(totalAmount);
  const setPaymentAmount = usePaymentStore((state) => state.setEditableAmount);
  const [isAmountTooltipOpen, setIsAmountTooltipOpen] = useState(false);
  const toPersianNumber = (input: string | number): string => {
    const number = input.toString().replace(/,/g, "");

    const formatted = Number(number).toLocaleString("en-US");

    const persian = formatted.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

    return persian;
  };

  useEffect(() => {
    setEditableAmountStr(totalAmount.toString());
    setEditableAmount(totalAmount);
  }, [totalAmount]);

  if (!isCartPaymentOpen) return null;

  const handleConfirm = async () => {
    if (editableAmount > totalAmount) {
      alert("مبلغ وارد شده نمی‌تواند بیشتر از مبلغ کل باشد");
      return;
    }

    const englishVal = editableAmount
      .toString()
      .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));
    setEditableAmount(englishVal ? parseInt(englishVal, 10) : 0);
    onConfirm(englishVal ? parseInt(englishVal, 10) : 0);
    if (paymentType === "cash") {
      setPaymentAmount(editableAmount);
      closeCartPayment();
      openSuccessPayment();
    } else if (paymentType === "credit") {
      setPaymentAmount(editableAmount);
      closeCartPayment();
    } else {
      try {
        setPaymentAmount(editableAmount);
        closeCartPayment();
        openCartPaymentLoading();

        setTimeout(() => {
          closeCartPaymentLoading();
          openCartPaymentPassword();
        }, 2000);
      } catch (error) {
        console.error("خطا در اتصال به دستگاه کارت‌خوان:", error);
        alert("خطا در اتصال به دستگاه کارت‌خوان");
      }
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("fa-IR");
  };

  const handleDialPadAmountChange = (val: string) => {
    const englishVal = val.replace(/[\u0660-\u0669]/g, (d) =>
      String(d.charCodeAt(0) - 0x0660)
    );
    setEditableAmountStr(englishVal);
    setEditableAmount(englishVal ? parseInt(englishVal, 10) : 0);
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[499px] bg-white rounded-[15px] shadow-lg z-50">
        <div className="flex flex-col p-6 relative">
          <div className="flex justify-between mb-5">
            <div onClick={closeCartPayment} style={{ cursor: "pointer" }}>
              <img src={closeIcon} alt="close" className="w-10 h-10" />
            </div>
            <div style={{ cursor: "pointer" }}>
              <img src={infoIcon} alt="info" className="w-10 h-10" />
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
              {paymentType === "cash"
                ? "آیا وجه نقد دریافت گردید؟"
                : paymentType === "credit"
                ? "مبلغ پرداختی نسیه را وارد کنید"
                : "لطفا کارت را بکشید"}
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
                {formatNumber(totalAmount)} ریال
              </span>
            </div>

            <div
              style={{
                color: "#363636",
                fontSize: "17px",
                fontWeight: 400,
                marginTop: "30px",
                marginBottom: "10px",
              }}
            >
              مبلغ پرداختی برای پرداخت ترکیبی قابل ویرایش است
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
                <Tooltip
                  component={
                    <DialPad
                      value={editableAmountStr}
                      onChange={handleDialPadAmountChange}
                      onConfirm={() => setIsAmountTooltipOpen(false)}
                      onClose={() => setIsAmountTooltipOpen(false)}
                    />
                  }
                  isOpen={isAmountTooltipOpen}
                  setIsOpen={setIsAmountTooltipOpen}
                  position="bottom"
                >
                  <input
                    type="text"
                    value={toPersianNumber(editableAmountStr)}
                    readOnly
                    onClick={() => setIsAmountTooltipOpen(true)}
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
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
                <div
                  style={{
                    position: "absolute",
                    right: "150px",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <p style={{ fontSize: "16px", fontWeight: 500 }}>ریال</p>
                  <img src={editIcon} alt="edit" className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-600 font-19">
              {numberToPersianToman(editableAmountStr)}
            </div>

            {paymentType === "card" && (
              <img
                src={cartPayment}
                alt="Cart Payment"
                style={{
                  width: "100%",
                  marginBottom: "20px",
                  borderRadius: "15px",
                }}
              />
            )}
            {/* No image for credit payment */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "84px",
                marginBottom: "30px",
                marginTop: "30px",
              }}
            >
              <Button
                label="تایید"
                color="#479E55"
                onClick={handleConfirm}
                style={{
                  width: "166px",
                  height: "48px",
                  color: "white",
                  borderRadius: "15px",
                }}
                disabled={editableAmount === 0}
              />
              <Button
                label="انصراف"
                color="#DE4949"
                onClick={closeCartPayment}
                style={{
                  width: "166px",
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

export default CartPaymentModal;
