import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../Ui/Button/button";
import Input from "../../Ui/Input/input";
import customerIcon from "../../../assets/customer.svg";
import emptyAddIcon from "../../../assets/emrityAdd.svg";

interface Customer {
  id: number;
  name: string;
  phone: string;
  debt: number;
}

interface CustomerTooltipProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelectCustomer?: (customer: Customer) => void;
  onOpenCustomerDefinition?: () => void;
}

const CustomerTooltip: React.FC<CustomerTooltipProps> = ({
  isOpen,
  setIsOpen,
  onSelectCustomer,
  onOpenCustomerDefinition,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Fake customer data
  const customers: Customer[] = [
    {
      id: 1,
      name: "علی محمدی",
      phone: "09123456789",
      debt: 120000,
    },
    {
      id: 2,
      name: "مریم حسینی",
      phone: "09187654321",
      debt: 85000,
    },
    {
      id: 3,
      name: "احمد رضایی",
      phone: "09351234567",
      debt: 250000,
    },
  ];

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerSelect = (customer: Customer) => {
    onSelectCustomer?.(customer);
    setIsOpen(false);
  };

  const handleDefineCustomer = () => {
    setIsOpen(false);
    onOpenCustomerDefinition?.();
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("fa-IR");
  };

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "absolute",
        top: "100%",
        left: "-150px",
        width: "450px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        padding: "40px 30px",
        marginTop: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          label=""
          color="#7486E5"
          onClick={handleDefineCustomer}
          style={{
            width: "386px",
            height: "48px",
            borderRadius: "55px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <img
            src={customerIcon}
            alt="customer"
            style={{ width: "20px", height: "20px" }}
          />
          تعریف مشتری
        </Button>
        <Input
          placeholder="جستجو در مشتریان..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "430px",
            height: "48px",
            borderRadius: "55px",
            // backgroundColor: "#E7E7E7",
            border: "none",
            padding: "0 20px",
            fontSize: "16px",
            marginBottom: "16px",
          }}
          placeholderStyle={{
            color: "#7E7E7E",
          }}
        />
        <div style={{ maxHeight: "300px" }}>
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              style={{
                width: "386px",
                backgroundColor: "#EDEDED",
                borderRadius: "13px",
                padding: "12px 16px",
                marginBottom: "8px",
                cursor: "pointer",
              }}
              onClick={() => handleCustomerSelect(customer)}
            >
              {/* Customer Name Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "black",
                  }}
                >
                  {customer.name}
                </span>
                <Button
                  label=""
                  color="#7486E5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCustomerSelect(customer);
                  }}
                  style={{
                    width: "147px",
                    height: "40px",
                    borderRadius: "55px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    fontSize: "14px",
                  }}
                >
                  <img
                    src={emptyAddIcon}
                    alt="add"
                    style={{ width: "16px", height: "16px" }}
                  />
                  افزودن
                </Button>
              </div>

              {/* Phone and Debt Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#696969",
                    fontSize: "16px",
                  }}
                >
                  {customer.phone}
                </span>
                <span
                  style={{
                    color: "#696969",
                    fontSize: "16px",
                  }}
                >
                  بدهی: {formatNumber(customer.debt)} ریال
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerTooltip;
