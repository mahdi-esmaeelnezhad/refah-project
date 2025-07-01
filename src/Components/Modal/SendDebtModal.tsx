import React from "react";
import closeIcon from "../../assets/close.svg";
import infoFull from "../../assets/infoFull.svg";
import { Button } from "../Ui/Button/button";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  mobile: string;
}

const SendDebtModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  mobile,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[453px] h-[291px] bg-white rounded-lg shadow-lg z-50">
        <div className="flex rounded-sm flex-col items-center p-6 relative">
          <img
            src={closeIcon}
            alt="close"
            className="w-6 h-6 absolute top-4 right-4 cursor-pointer"
            onClick={onClose}
          />
          <img src={infoFull} alt="trash" className="w-10 h-10 mb-4 mt-2" />
          <p className="text-[25px] font-[500] text-center mb-6">
            آیا مایل به ارسال پیامک بدهی به شماره {mobile} هستید؟
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              label="بله"
              color="#7485E5"
              radius={15}
              style={{
                width: "135px",
                height: "48px",
                fontSize: "23px",
                fontWeight: "600",
              }}
              onClick={onDelete}
            />
            <Button
              label="انصراف"
              color="#DE4949"
              variant="outline"
              radius={15}
              style={{
                width: "135px",
                height: "48px",
                fontSize: "23px",
                fontWeight: "600",
                border: "2px solid #DE4949",
              }}
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SendDebtModal;
