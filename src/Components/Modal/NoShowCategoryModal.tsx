import React from "react";
import infored from "../../assets/infoRed.svg";
import closeIcon from "../../assets/close.svg";
import { Button } from "../Ui/Button/button";

interface NoShowModalProps {
  isCategoryOpen: boolean;
  onClose: () => void;
  onCategoryDelete: () => void;
  message?: string;
}

const NoShowCategoryModal: React.FC<NoShowModalProps> = ({
  isCategoryOpen,
  onClose,
  onCategoryDelete,
  message,
}) => {
  if (!isCategoryOpen) return null;

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

          <img src={infored} alt="trash" className="w-10 h-10 mb-4 mt-2" />

          <p className="text-[23px] font-[500] mb-6">
            {message ||
              "در صورت عدم نمایش یک دسته‌بندی، لیست محصولات در داخل لیست دسته‌بندی‌ها هم نمایش داده نمی‌شود."}
          </p>

          <div className="flex gap-4 my-4">
            <Button
              label=""
              color="#DE4949"
              radius={15}
              style={{
                width: "135px",
                height: "48px",
                fontSize: "23px",
                fontWeight: "600",
                padding: 0,
              }}
              onClick={onCategoryDelete}
            >
              <span>{message ? "حذف" : "عدم نمایش"}</span>
            </Button>
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

export default NoShowCategoryModal;
