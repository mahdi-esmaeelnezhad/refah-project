import React, { useState, useEffect } from "react";
import closeIcon from "../../assets/close.svg";
import sendPaykIcon from "../../assets/sendPaykIcon.svg";
import mapIcon from "../../assets/map.svg";
import { Button } from "../Ui/Button/button";
import DropDownCustom from "../Ui/DropDownCustom/DropDownCustom";
import Input from "../Ui/Input/input";

interface Customer {
  id: number;
  displayName: string;
  mobile: string;
  address?: string;
  nationalCode: string;
  debt: number;
  isArchive: boolean;
}

interface SendPaykModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customerData: any, courierData: any) => void;
}

const SendPaykModal: React.FC<SendPaykModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  const [courierName, setCourierName] = useState("");

  //get customers from localStorage and convert to array
  const response: any = localStorage.getItem("customers");
  console.log(response, "response");
  const apiCustomers: Customer[] = JSON.parse(response);

  let customers: Customer[] = [];
  if (apiCustomers) {
    customers = apiCustomers
      .filter((customer) => !customer.isArchive)
      .map((customer) => ({
        id: customer.id,
        displayName: customer.displayName || "نامشخص",
        mobile: customer.mobile || "",
        nationalCode: customer.nationalCode || "",
        address: customer.address || "",
        debt: customer.debt || 0,
        isArchive: customer.isArchive,
      }));
  }

  const courierOptions = [
    { value: "shop", label: "پیک فروشگاه" },
    { value: "bring", label: "میاره" },
    { value: "tpx", label: "TPX (تیپاکس)" },
  ];

  useEffect(() => {
    if (selectedCustomer) {
      setCustomerName(selectedCustomer.displayName);
      setCustomerPhone(selectedCustomer.mobile);
      setCustomerAddress(selectedCustomer.address || "آدرسی ثبت نشده است");
    }
  }, [selectedCustomer]);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleCourierSelect = (value: string) => {
    setSelectedCourier(value);
    const courier = courierOptions.find((c) => c.value === value);
    setCourierName(courier?.label || "");
  };

  const handleConfirm = () => {
    if (!selectedCustomer || !selectedCourier) {
      alert("لطفاً مشتری و پیک را انتخاب کنید");
      return;
    }

    const customerData = {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
    };

    const courierData = {
      type: selectedCourier,
      name: courierName,
    };

    onConfirm(customerData, courierData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[777px] h-[781px] bg-white rounded-[15px] shadow-lg z-50">
        <div className="flex flex-col p-6 relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <img
                src={sendPaykIcon}
                alt="send payk"
                className="w-[32px] h-[24px]"
              />
              <span className="font-23 font-semibold">ارسال با پیک</span>
            </div>
            <div onClick={onClose} style={{ cursor: "pointer" }}>
              <img src={closeIcon} alt="close" className="w-10 h-10" />
            </div>
          </div>

          {/* Customer Dropdown */}
          <div className="flex justify-center mt-6 flex-col items-center">
            <div className="flex justify-center mb-20">
              <DropDownCustom
                options={customers}
                value={selectedCustomer}
                onChange={handleCustomerSelect}
                getLabel={(customer) =>
                  `${customer.displayName} - ${customer.mobile}`
                }
                placeholder="انتخاب مشتری"
                inputPlaceholder="جستجو بر اساس نام یا شماره تلفن"
                style={{
                  width: "633px",
                  height: "48px",
                  borderRadius: "55px",
                }}
              />
            </div>

            {/* Customer Details */}
            <div className="flex gap-4 mb-10 w-[633px] justify-between">
              <Input
                placeholder="نام مشتری"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: "299px",
                  height: "48px",
                  borderRadius: "15px",
                }}
              />
              <Input
                placeholder="شماره تلفن"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: "299px",
                  height: "48px",
                  borderRadius: "15px",
                }}
              />
            </div>

            {/* Address */}
            <div className="flex items-center gap-3 mb-20 justify-center w-[633px]">
              <Input
                placeholder="آدرس"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                style={{
                  width: "591px",
                  height: "48px",
                  borderRadius: "15px",
                }}
              />
              <img src={mapIcon} alt="map" className="w-[32px] h-[32px]" />
            </div>

            {/* Courier Selection */}
            <div className="space-y-2 border w-[633px] border-black rounded-xl p-6 relative mb-10">
              <div className="font-semibold bg-white absolute -top-5 px-2 font-25">
                انتخاب پیک:
              </div>
              <div className="flex gap-2 items-center justify-between font-25">
                {courierOptions.map((courier) => (
                  <div key={courier.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`courier-${courier.value}`}
                      name="courierMethod"
                      value={courier.value}
                      checked={selectedCourier === courier.value}
                      onChange={() => handleCourierSelect(courier.value)}
                      className="w-4 h-4 accent-primary"
                    />
                    <label
                      htmlFor={`courier-${courier.value}`}
                      className="font-21 cursor-pointer"
                    >
                      {courier.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Courier Name Input */}
            <div className="flex justify-center mb-10">
              <Input
                placeholder="انتخاب پیک"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                style={{
                  width: "332px",
                  height: "48px",
                  borderRadius: "15px",
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex w-[600px] justify-between gap-4">
              <Button
                label="تایید"
                color="#7485E5"
                onClick={handleConfirm}
                style={{
                  width: "299px",
                  height: "48px",
                  borderRadius: "15px",
                }}
              />
              <Button
                label="بازگشت"
                color="#DE4949"
                onClick={onClose}
                style={{
                  width: "299px",
                  height: "48px",
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

export default SendPaykModal;
