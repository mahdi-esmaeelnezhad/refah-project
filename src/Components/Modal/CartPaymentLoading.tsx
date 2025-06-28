import React, { useEffect } from "react";
import closeIcon from "../../assets/close.svg";
import atmImage from "../../assets/img/atm.png";
import { Button } from "../Ui/Button/button";
import { useModal } from "../../hooks/useModal";
import { usePaymentStore } from "../../hooks/usePaymentStore";

const CartPaymentLoading: React.FC<{ amount: number }> = ({ amount }) => {
  const {
    isCartPaymentLoading,
    closeCartPaymentLoading,
    openCartPaymentPassword,
  } = useModal();
  const editableAmount = usePaymentStore((state) => state.editableAmount);

  useEffect(() => {
    // شبیه‌سازی کشیدن کارت
    const timer = setTimeout(() => {
      closeCartPaymentLoading();
      openCartPaymentPassword();
    }, 2000);

    return () => clearTimeout(timer);
  }, [closeCartPaymentLoading, openCartPaymentPassword]);

  if (!isCartPaymentLoading) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[499px] bg-white rounded-[15px] shadow-lg z-50">
        <div className="flex flex-col p-6 relative">
          <div className="flex justify-between mb-5">
            <div
              onClick={closeCartPaymentLoading}
              style={{ cursor: "pointer" }}
            >
              <img src={closeIcon} alt="close" className="w-10 h-10" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={atmImage}
              alt="ATM"
              style={{
                width: "100%",
                marginBottom: "20px",
                borderRadius: "15px",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "30px",
                marginBottom: "40px",
                width: "100%",
              }}
            >
              <Button
                label="انصراف"
                color="#DE4949"
                onClick={closeCartPaymentLoading}
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

export default CartPaymentLoading;
