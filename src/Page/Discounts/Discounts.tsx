import React, { useState } from "react";
import discountIcon from "../../assets/discountIcon.svg";
import ProductDiscount from "../../Components/Discounts/ProductDiscount";
import AddDiscount from "../../Components/Discounts/AddDiscount";

const Discounts: React.FC = () => {
  const [view, setView] = useState<"list" | "add">("list");

  const handleAddDiscount = () => {
    setView("add");
  };

  const handleBack = () => {
    setView("list");
  };

  return (
    <div className="flex flex-col gap-4">
      <style>
        {`
        ._inputWrapper_uxij4_18 {
          padding: 0px !important;
          padding-right: 16px !important;
          height: 48px !important;
        }
        ._tagButton_uxij4_53 {
          height: 48px !important;
          border-radius:55px 0px 0px 55px !important;
          width: 130px !important;
          background-color: #7485E5 !important;
        }
      `}
      </style>
      {view === "list" && (
        <>
          <div className="flex items-center mb-4 gap-2">
            <img src={discountIcon} alt="discount" />
            <span className="text-black text-[30px] font-medium">تخفیف</span>
          </div>
        </>
      )}

      {view === "list" && <ProductDiscount onAddDiscount={handleAddDiscount} />}

      {view === "add" && <AddDiscount onBack={handleBack} />}
    </div>
  );
};

export default Discounts;
