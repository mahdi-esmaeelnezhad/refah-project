import React from "react";
import closeIcon from "../../assets/close.svg";
import { Button } from "../Ui/Button/button";
import { useModal } from "../../hooks/useModal";

interface FailedPaymentModalProps {
  amount: number;
  transactionType: string;
  date: string;
  time: string;
  trackingNumber: string;
  referenceNumber: string;
}

const FailedPaymentModal: React.FC<FailedPaymentModalProps> = ({
  amount,
  transactionType,
  date,
  time,
  trackingNumber,
  referenceNumber,
}) => {
  const { isFailedPaymentOpen, closeFailedPayment, openCartPaymentLoading } =
    useModal();

  if (!isFailedPaymentOpen) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const handleRetry = () => {
    closeFailedPayment();
    openCartPaymentLoading();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[499px] bg-white rounded-[15px] shadow-lg z-50">
        <div className="flex flex-col p-6 relative">
          <div className="flex justify-between mb-5">
            <div onClick={closeFailedPayment} style={{ cursor: "pointer" }}>
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
                color: "#DE4949",
              }}
            >
              پرداخت ناموفق بود
            </div>

            <div
              style={{
                width: "100%",
                backgroundColor: "#F5F5F5",
                borderRadius: "15px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <div className="flex justify-between mb-3">
                <span style={{ color: "#666" }}>نوع تراکنش:</span>
                <span style={{ fontWeight: 500 }}>{transactionType}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span style={{ color: "#666" }}>مبلغ:</span>
                <span style={{ fontWeight: 500 }}>
                  {formatNumber(amount)} ریال
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span style={{ color: "#666" }}>تاریخ:</span>
                <span style={{ fontWeight: 500 }}>{date}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span style={{ color: "#666" }}>ساعت:</span>
                <span style={{ fontWeight: 500 }}>{time}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span style={{ color: "#666" }}>شماره پیگیری:</span>
                <span style={{ fontWeight: 500 }}>{trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#666" }}>شماره مرجع:</span>
                <span style={{ fontWeight: 500 }}>{referenceNumber}</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button
                label="تلاش مجدد"
                color="#DE4949"
                onClick={handleRetry}
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

export default FailedPaymentModal;
