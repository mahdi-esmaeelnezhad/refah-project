import React from "react";
import closeIcon from "../../assets/close.svg";
import likeIcon from "../../assets/Like.svg";
import shaparakIcon from "../../assets/img/shaparak.png";
import iranKishIcon from "../../assets/img/iranKish.png";
import { Button } from "../Ui/Button/button";
import { useModal } from "../../hooks/useModal";
import { usePaymentStore } from "../../hooks/usePaymentStore";

interface SuccessPaymentModalProps {
  transactionType: string;
  date: string;
  time: string;
  trackingNumber: string;
  referenceNumber: string;
}

const SuccessPaymentModal: React.FC<SuccessPaymentModalProps> = ({
  transactionType,
  date,
  time,
  trackingNumber,
  referenceNumber,
}) => {
  const { isSuccessPaymentOpen, closeSuccessPayment } = useModal();
  const editableAmount = usePaymentStore((state) => state.editableAmount);

  if (!isSuccessPaymentOpen) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const handlePrint = () => {
    // اینجا باید منطق چاپ فاکتور پیاده‌سازی شود
  };

  const handleSendDigital = () => {
    // اینجا باید منطق ارسال فاکتور دیجیتال پیاده‌سازی شود
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[499px] bg-white rounded-[15px] shadow-lg z-50">
        <div className="flex flex-col p-6 relative">
          <div className="flex justify-between">
            <div onClick={closeSuccessPayment} style={{ cursor: "pointer" }}>
              <img src={closeIcon} alt="close" className="w-10 h-10" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img src={likeIcon} alt="Success" />

            <div
              style={{
                textAlign: "center",
                fontSize: "23px",
                fontWeight: 700,
                marginBottom: "20px",
                color: "#479E55",
              }}
            >
              پرداخت موفق
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

              <div className="flex flex-col gap-2 w-full mt-10 mb-10">
                <Button
                  label="چاپ فاکتور"
                  color="#7485E5"
                  onClick={handlePrint}
                  style={{
                    width: "366px",
                    height: "48px",
                    color: "white",
                    borderRadius: "15px",
                  }}
                />
                <Button
                  label="ارسال فاکتور دیجیتال"
                  color="#7485E5B2"
                  onClick={handleSendDigital}
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
      </div>
    </>
  );
};

export default SuccessPaymentModal;
