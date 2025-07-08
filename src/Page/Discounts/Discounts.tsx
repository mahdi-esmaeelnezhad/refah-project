import React, { useState } from "react";
import discountIcon from "../../assets/discountIcon.svg";
import CustomerDiscount from "../../Components/Discounts/CustomerDiscount";
import ProductDiscount from "../../Components/Discounts/ProductDiscount";
import AddDiscount from "../../Components/Discounts/AddDiscount";

const Discounts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"customer" | "product">(
    "customer"
  );
  const [view, setView] = useState<"list" | "add">("list");
  const [, setMobileNumber] = useState("");
  const [, setCouponCode] = useState("");
  const [, setCustomerData] = useState<{
    mobile: string;
    name: string;
  } | null>(null);

  const handleTabChange = (tab: "customer" | "product") => {
    setActiveTab(tab);
    setView("list");
    setCustomerData(null);
    setMobileNumber("");
    setCouponCode("");
  };

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
          <div
            style={{
              width: "100%",
              height: 60,
              background: "#E7E7E7",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => handleTabChange("customer")}
              style={{
                width: "50%",
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  activeTab === "customer" ? "#7485E5" : "transparent",
                color: activeTab === "customer" ? "#fff" : "#000",
                fontWeight: 500,
                fontSize: 16,
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.2s",
                userSelect: "none",
              }}
            >
              تخفیف مشتری
            </div>
            <div
              style={{
                width: 1,
                height: 37,
                background: "#D1D1D1",
                margin: "0 8px",
                alignSelf: "center",
              }}
            />
            <div
              onClick={() => handleTabChange("product")}
              style={{
                width: "50%",
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: activeTab === "product" ? "#7485E5" : "transparent",
                color: activeTab === "product" ? "#fff" : "#000",
                fontWeight: 500,
                fontSize: 16,
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.2s",
                userSelect: "none",
              }}
            >
              تخفیف کالا
            </div>
          </div>
        </>
      )}

      {activeTab === "customer" && view === "list" && <CustomerDiscount />}

      {activeTab === "product" && view === "list" && (
        <ProductDiscount onAddDiscount={handleAddDiscount} />
      )}

      {activeTab === "product" && view === "add" && (
        <AddDiscount onBack={handleBack} />
      )}
    </div>
  );
};

export default Discounts;
