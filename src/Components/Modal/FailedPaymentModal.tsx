import React from "react";
import closeIcon from "../../assets/close.svg";
import dislikeIcon from "../../assets/disLike.svg";
import shaparakIcon from "../../assets/img/Shaparak.png";
import iranKishIcon from "../../assets/img/iranKish.png";
import { Button } from "../Ui/Button/button";
import { useModal } from "../../hooks/useModal";
import { usePaymentStore } from "../../hooks/usePaymentStore";

interface FailedPaymentModalProps {
  amount: number;
  transactionType: string;
  date: string;
  time: string;
  trackingNumber: string;
  referenceNumber: string;
}

const FailedPaymentModal: React.FC<FailedPaymentModalProps> = ({
  transactionType,
  date,
  time,
  trackingNumber,
  referenceNumber,
}) => {
  const { isFailedPaymentOpen, closeFailedPayment, openCartPaymentLoading } =
    useModal();
  const editableAmount = usePaymentStore((state) => state.editableAmount);

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
          <div className="flex justify-between">
            <div onClick={closeFailedPayment} style={{ cursor: "pointer" }}>
              <img src={closeIcon} alt="close" className="w-10 h-10" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img
              src={dislikeIcon}
              alt="Failed"
              style={{
                width: "100px",
                height: "100px",
                marginBottom: "20px",
              }}
            />

            <div
              style={{
                textAlign: "center",
                fontSize: "23px",
                fontWeight: 700,
                marginBottom: "20px",
                color: "#DE4949",
              }}
            >
              پرداخت ناموفق
            </div>

            <div className="flex flex-col items-center">
              <div className="flex flex-col gap-2 w-full">
                <div
                  style={{
                    width: "366px",
                    height: "36px",
                    backgroundColor: "#F8F8F8",
                    borderRadius: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 15px",
                  }}
                >
                  <span>مبلغ:</span>
                  <span>{formatNumber(editableAmount)} ریال</span>
                </div>

                <div
                  style={{
                    width: "366px",
                    height: "36px",
                    backgroundColor: "#F8F8F8",
                    borderRadius: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 15px",
                  }}
                >
                  <span>نوع تراکنش:</span>
                  <span>{transactionType}</span>
                </div>

                <div
                  style={{
                    width: "366px",
                    height: "36px",
                    backgroundColor: "#F8F8F8",
                    borderRadius: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 15px",
                  }}
                >
                  <span>تاریخ و زمان:</span>
                  <span>
                    {date} - {time}
                  </span>
                </div>

                <div
                  style={{
                    width: "366px",
                    height: "36px",
                    backgroundColor: "#DEDEDE",
                    borderRadius: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 15px",
                  }}
                >
                  <span>شماره پیگیری:</span>
                  <span>{trackingNumber}</span>
                </div>

                <div
                  style={{
                    width: "366px",
                    height: "36px",
                    backgroundColor: "#DEDEDE",
                    borderRadius: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 15px",
                  }}
                >
                  <span>شماره مرجع:</span>
                  <span>{referenceNumber}</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "366px",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={shaparakIcon}
                  alt="Shaparak"
                  style={{ width: "120px" }}
                />
                <img
                  src={iranKishIcon}
                  alt="IranKish"
                  style={{ width: "120px" }}
                />
              </div>

              <Button
                label="تکرار تراکنش"
                color="#DAA51A"
                onClick={handleRetry}
                className="mt-10 mb-10"
                style={{
                  width: "366px",
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
