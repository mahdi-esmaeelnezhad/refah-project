import React, { useState } from "react";
import closeIcon from "../../assets/close.svg";
import infoIcon from "../../assets/info.svg";
import { numberToPersianToman } from "../../utils/numberToPersianWord";
import cartPayment from "../../assets/img/cartPayment.png";
import rial from "../../assets/img/rial.png";
import editIcon from "../../assets/edit.svg";
import { Button } from "../Ui/Button/button";
import { useModal } from "../../hooks/useModal";

interface CartPaymentModalProps {
  totalAmount: number;
  onConfirm: (amount: number) => void;
}

const CartPaymentModal: React.FC<CartPaymentModalProps> = ({
  totalAmount,
  onConfirm,
}) => {
  const {
    isCartPaymentOpen,
    closeCartPayment,
    openCartPaymentLoading,
    closeCartPaymentLoading,
    openCartPaymentPassword,
  } = useModal();
  const [editableAmount, setEditableAmount] = useState(totalAmount);

  if (!isCartPaymentOpen) return null;

  const handleConfirm = async () => {
    if (editableAmount > totalAmount) {
      alert("مبلغ وارد شده نمی‌تواند بیشتر از مبلغ کل باشد");
      return;
    }

    try {
      // اینجا باید کتابخانه کارت‌خوان را import کنید
      // import { POSPayment } from 'pos-payment';

      // اتصال به دستگاه کارت‌خوان
      // const pos = new POSPayment({
      //   port: 'COM3', // پورت دستگاه
      //   baudRate: 9600,
      // });

      // ارسال مبلغ به دستگاه
      // await pos.sendAmount(editableAmount);

      // بستن مدال فعلی و باز کردن مدال لودینگ
      closeCartPayment();
      openCartPaymentLoading();

      // گوش دادن به رویداد کشیدن کارت
      // pos.on('cardSwiped', () => {
      //   closeCartPaymentLoading();
      //   openCartPaymentPassword();
      // });

      // برای تست، فعلاً با تایمر شبیه‌سازی می‌کنیم
      setTimeout(() => {
        closeCartPaymentLoading();
        openCartPaymentPassword();
      }, 2000);
    } catch (error) {
      console.error("خطا در اتصال به دستگاه کارت‌خوان:", error);
      alert("خطا در اتصال به دستگاه کارت‌خوان");
    }
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
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />

      {/* Modal */}
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
              لطفا کارت را بکشید
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

            <img
              src={cartPayment}
              alt="Cart Payment"
              style={{
                width: "100%",
                marginBottom: "20px",
                borderRadius: "15px",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "84px",
                marginBottom: "30px",
              }}
            >
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
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPaymentModal;
