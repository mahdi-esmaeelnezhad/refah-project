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
  address: string;
  nationalCode: string;
}

interface CustomerApiResponse {
  id: string;
  displayName: string;
  maxAllowedDebt: number;
  mobile: string;
  subscriptionCode: number;
  address: string;
  debt: number;
  isArchive: boolean;
  nationalCode: string;
  gender: string;
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

  // دریافت مشتریان از localStorage یا API
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (isOpen) {
      // وقتی tooltip باز می‌شود، مشتریان را از API دریافت کن
      fetchCustomersFromAPI();
    } else {
      // وقتی tooltip بسته می‌شود، state مشتریان را پاک کن
      setCustomers([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  // Listen for customer updates
  useEffect(() => {
    const handleCustomersUpdated = () => {
      if (isOpen) {
        fetchCustomersFromAPI();
      }
    };

    window.addEventListener("customersUpdated", handleCustomersUpdated);
    return () => {
      window.removeEventListener("customersUpdated", handleCustomersUpdated);
    };
  }, [isOpen]);

  const fetchCustomersFromAPI = async () => {
    try {
      const response: any = localStorage.getItem("customers");
      console.log("Raw localStorage data:", response);

      const apiCustomers: CustomerApiResponse[] = JSON.parse(response);
      console.log(apiCustomers, " apiCustomers");

      if (apiCustomers && apiCustomers.length > 0) {
        const convertedCustomers: Customer[] = apiCustomers
          .filter((customer) => !customer.isArchive)
          .map((customer, index) => ({
            id: customer.id ? parseInt(customer.id) || index + 1 : index + 1,
            name:
              customer.displayName && customer.displayName.trim() !== ""
                ? customer.displayName
                : "نامشخص",
            phone: customer.mobile || "",
            debt: customer.debt || 0,
            address: customer.address || "",
            nationalCode: customer.nationalCode || "",
          }));

        setCustomers(convertedCustomers);
      } else {
        // اگر داده‌ای در localStorage نباشد، آرایه خالی تنظیم کن
        setCustomers([]);
      }
    } catch (error) {
      console.error("خطا در دریافت مشتریان از API:", error);
      setCustomers([]);
    }
  };

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
        maxHeight: "1000px",
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
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(116, 134, 229, 0.3)",
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
            backgroundColor: "#F8F9FA",
            border: "1px solid #E9ECEF",
            padding: "0 20px",
            fontSize: "16px",
            marginBottom: "16px",
            transition: "all 0.2s ease",
            outline: "none",
          }}
          placeholderStyle={{
            color: "#7E7E7E",
          }}
        />
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            paddingRight: "4px",
          }}
        >
          {filteredCustomers.map((customer, index) => (
            <div
              key={`customer-${index}`}
              style={{
                width: "386px",
                backgroundColor: "#F8F9FA",
                borderRadius: "13px",
                padding: "12px 16px",
                marginBottom: "8px",
                cursor: "pointer",
                border: "1px solid #E9ECEF",
                transition: "all 0.2s ease",
              }}
              onClick={() => handleCustomerSelect(customer)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E9ECEF";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F8F9FA";
                e.currentTarget.style.transform = "translateY(0)";
              }}
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
