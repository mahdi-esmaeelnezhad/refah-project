import React, { useState } from "react";
import warningIcon from "../../assets/warning.svg";
import closeIcon from "../../assets/close.svg";
import Input from "../Ui/Input/input";
import { Button } from "../Ui/Button/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { productName: string; price: string }) => void;
  barcode: string;
}

const NoBarcodeModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  barcode,
}) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ productName, price });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />

      {/* Modal */}
      <div className="fixed rounded-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[407px] h-[507px] bg-white rounded-lg shadow-lg z-50">
        <div className="flex flex-col rounded-sm  items-center p-6 relative">
          <img
            src={closeIcon}
            alt="close"
            className="w-6 h-6 absolute top-4 right-4 cursor-pointer"
            onClick={onClose}
          />
          {/* Warning Icon */}
          <img src={warningIcon} alt="warning" className="w-16 h-16 mb-4" />

          <div>
            <p className="text-[23px] font-[500] text-center mb-8">
              کالا با بارکد {barcode}
              <br />
              تعریف نشده است.
            </p>

            {/* Input Fields */}
            <div className="w-full space-y-6">
              <div className="flex flex-col">
                <label className="text-[20px] font-[500] mb-2">نام کالا:</label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="نام کالا را وارد کنید"
                  placeholderStyle={{
                    fontSize: "17px",
                    fontWeight: 500,
                    color: "#7E7E7E",
                  }}
                  style={{
                    width: "299px",
                    height: "48px",
                    borderRadius: "55px",
                    textAlign: "right",
                    backgroundColor: "#E7E7E7",
                  }}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[20px] font-[500] mb-2">
                  قیمت کالا (ریال):
                </label>
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="قیمت کالا را وارد کنید"
                  placeholderStyle={{
                    fontSize: "17px",
                    fontWeight: 500,
                    color: "#7E7E7E",
                  }}
                  style={{
                    width: "299px",
                    height: "48px",
                    borderRadius: "55px",
                    textAlign: "right",
                    backgroundColor: "#E7E7E7",
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                label="ثبت کالا"
                color="#7485E5"
                radius={15}
                style={{
                  width: "135px",
                  height: "48px",
                  fontSize: "23px",
                  fontWeight: "600",
                }}
                onClick={handleSubmit}
              />
              <Button
                label="انصراف"
                color="#DE4949"
                radius={15}
                style={{
                  width: "135px",
                  height: "48px",
                  fontSize: "23px",
                  fontWeight: "600",
                }}
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoBarcodeModal;
