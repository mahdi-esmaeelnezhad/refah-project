import React, { useState } from "react";
import closeIcon from "../../assets/close.svg";
import taraIcon from "../../assets/img/taraLogo.png";
import digipayIcon from "../../assets/digipyIcon.svg";
import barcodeKhanIcon from "../../assets/img/barcodeKhan copy.png";
import creditCardIcon from "../../assets/creditCard copy.svg";
import { Button } from "../Ui/Button/button";

interface CreditCard {
  id: number;
  number: string;
  amount: number;
}

interface BarcodeCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: "tara" | "digipay";
  totalAmount: number;
  onSuccess: (creditAmount: number, remainingAmount: number) => void;
}

const BarcodeCreditModal: React.FC<BarcodeCreditModalProps> = ({
  isOpen,
  onClose,
  paymentMethod,
  totalAmount,
  onSuccess,
}) => {
  const [creditCards] = useState<CreditCard[]>([
    { id: 1, number: "1234-5678-9012-3456", amount: 500000 },
    { id: 2, number: "9876-5432-1098-7654", amount: 300000 },
  ]);

  if (!isOpen) return null;

  const totalCreditAmount = creditCards.reduce(
    (sum, card) => sum + card.amount,
    0
  );
  const remainingAmount = totalAmount - totalCreditAmount;

  const handleCreditPayment = () => {
    onSuccess(totalCreditAmount, remainingAmount);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1368px] h-[826px] bg-white rounded-[15px] shadow-lg z-50 overflow-hidden">
        <div className="flex h-full">
          <div className="w-[400] flex-1 p-8 flex flex-col">
            <div className="flex items-center my-6">
              <img
                src={paymentMethod === "tara" ? taraIcon : digipayIcon}
                alt={paymentMethod}
                style={{ width: "60px", height: "60px", marginLeft: "15px" }}
              />
              <span
                style={{
                  fontSize: "23px",
                  fontWeight: 700,
                }}
              >
                پرداخت اعتباری از طریق{" "}
                {paymentMethod === "tara" ? "تارا" : "دیجی پی"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                style={{
                  width: "402px",
                  height: "49px",
                  backgroundColor: "#EFEFEF",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",

                  padding: "0 16px",
                  marginBottom: "20px",
                  borderRadius: "10px",
                }}
              >
                <span style={{ fontSize: "20px", fontWeight: 500 }}>
                  مبلغ کل
                </span>
                <span style={{ fontSize: "20px", fontWeight: 500 }}>
                  {totalAmount.toLocaleString("fa-IR")} ریال
                </span>
              </div>

              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 400,
                  color: "#363636",
                  marginBottom: "30px",
                }}
              >
                پرداخت را می‌توان از طریق چند کارت اعتباری انجام داد
              </div>

              <div className="flex flex-col items-center">
                <img
                  src={barcodeKhanIcon}
                  alt="barcode khan"
                  style={{
                    width: "207px",
                    height: "426px",
                    marginBottom: "20px",
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: 500,
                    color: "#7485E5",
                  }}
                >
                  بارکد اعتباری مشتری را اسکن کنید
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#F8F8F8",
              borderRadius: "15px",
              position: "relative",
              left: "50px",
            }}
            className="w-[798px] h-[706px] mt-10 p-8"
          >
            <div className="flex items-center mb-6">
              <img
                src={creditCardIcon}
                alt="credit card"
                style={{ width: "40px", height: "40px", marginLeft: "15px" }}
              />
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 600,
                }}
              >
                کارت اعتباری
              </span>
            </div>

            <div className="space-y-4">
              {creditCards.map((card, index) => (
                <div key={card.id} className="flex flex-col items-center gap-4">
                  <div className="w-full">
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: 500,
                        color: "#7485E5",
                        minWidth: "120px",
                      }}
                    >
                      {index + 1}. کارت شماره {index + 1}
                    </span>
                  </div>
                  <div className="flex px-8 justify-between w-full flex-row items-center">
                    <div
                      style={{
                        width: "288px",
                        height: "48px",
                        backgroundColor: "#E7E7E7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "55px",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      {card.number}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: 500 }}>
                      به مبلغ
                    </span>
                    <div
                      style={{
                        width: "150px",
                        height: "48px",
                        backgroundColor: "#E7E7E7",
                        display: "flex",
                        borderRadius: "55px",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      {card.amount.toLocaleString("fa-IR")}
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: 500 }}>
                      ریال
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "270px" }} className="mt-8 space-y-4">
              <div className="flex justify-between gap-4">
                <div
                  style={{
                    width: "350px",
                    height: "46px",
                    backgroundColor: "#7E7E7E",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 16px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  <span>مبلغ اعتبار اختصاص یافته</span>
                  <span>{totalCreditAmount.toLocaleString("fa-IR")} ریال</span>
                </div>
                <div
                  style={{
                    width: "350px",
                    height: "46px",
                    backgroundColor: "#E99C43",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 16px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  <span>مبلغ باقی مانده</span>
                  <span>{remainingAmount.toLocaleString("fa-IR")} ریال</span>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <Button
                  label="پرداخت اعتباری"
                  color="#479E55"
                  radius={15}
                  style={{
                    width: "483px",
                    height: "43px",
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                  onClick={handleCreditPayment}
                />
                <Button
                  label="انصراف"
                  color="#DE4949"
                  radius={15}
                  style={{
                    width: "199px",
                    height: "43px",
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                  onClick={onClose}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            cursor: "pointer",
          }}
        >
          <img src={closeIcon} alt="close" className="w-10 h-10" />
        </div>
      </div>
    </>
  );
};

export default BarcodeCreditModal;
