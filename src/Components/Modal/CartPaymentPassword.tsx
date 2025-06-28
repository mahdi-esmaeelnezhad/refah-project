import React, { useState, useRef, useEffect } from "react";
import closeIcon from "../../assets/close.svg";
import { Button } from "../Ui/Button/button";
import { useModal } from "../../hooks/useModal";

interface CartPaymentPasswordProps {
  amount: number;
}

const CartPaymentPassword: React.FC<CartPaymentPasswordProps> = ({}) => {
  const {
    isCartPaymentPassword,
    closeCartPaymentPassword,
    openSuccessPayment,
    openFailedPayment,
  } = useModal();
  const [password, setPassword] = useState<string[]>(Array(4).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null));

  useEffect(() => {
    setPassword(Array(4).fill(""));
  }, []);

  if (!isCartPaymentPassword) return null;

  const handlePasswordChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newPassword = [...password];
    newPassword[index] = value;
    setPassword(newPassword);

    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && password[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    const pin = password.join("");
    if (pin.length !== 4) {
      alert("لطفا رمز کارت را کامل وارد کنید");
      return;
    }

    try {
      // اینجا باید رمز را به دستگاه کارت‌خوان ارسال کنید
      // const response = await pos.sendPin(pin);

      // برای تست، اگر رمز 1234 باشد، پرداخت موفق است
      const isSuccess = pin === "1234";

      closeCartPaymentPassword();

      if (isSuccess) {
        // در حالت واقعی، این اطلاعات از دستگاه کارت‌خوان می‌آید
        // const transactionData = {
        //   amount,
        //   transactionType: "خرید",
        //   date: new Date().toLocaleDateString("fa-IR"),
        //   time: new Date().toLocaleTimeString("fa-IR"),
        //   trackingNumber: Math.random().toString(36).substring(7),
        //   referenceNumber: Math.random().toString(36).substring(7),
        // };
        openSuccessPayment();
      } else {
        openFailedPayment();
      }
    } catch (error) {
      console.error("خطا در پردازش پرداخت:", error);
      alert("خطا در پردازش پرداخت");
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
            <div
              onClick={closeCartPaymentPassword}
              style={{ cursor: "pointer" }}
            >
              <img src={closeIcon} alt="close" className="w-10 h-10" />
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
              لطفا رمز کارت را وارد کنید
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "30px",
                direction: "ltr",
              }}
            >
              {password.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  value={value}
                  onChange={(e) => handlePasswordChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    backgroundColor: "#E7E7E7",
                    width: "80px",
                    height: "80px",
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "500",
                    border: "1px solid #ccc",
                    borderRadius: "15px",
                    outline: "none",
                  }}
                  maxLength={1}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "84px",
                marginTop: "40px",
              }}
            >
              <Button
                label="انصراف"
                color="#DE4949"
                onClick={closeCartPaymentPassword}
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

export default CartPaymentPassword;
