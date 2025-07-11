import React, { useState, useEffect } from "react";
import { Button } from "../../Ui/Button/button";
import Input from "../../Ui/Input/input";
import { BinIcon, CloseSmIcon } from "../../icons";
import CloseIcon from "../../../assets/close.svg";

import {
  commaSeparator,
  numberToPersianToman,
} from "../../../utils/numberToPersianWord";
import Tooltip from "./Tooltip";
import { DialPad } from "./DialPad";
import NoBarcodeModal from "../../Modal/NoBarcodeModal";
import { useModal } from "../../../hooks/useModal";
import DeleteModal from "../../Modal/DeleteModal";
import CartPaymentModal from "../../Modal/CartPaymentModal";
import CartPaymentLoading from "../../Modal/CartPaymentLoading";
import CartPaymentPassword from "../../Modal/CartPaymentPassword";
import SuccessPaymentModal from "../../Modal/SuccessPaymentModal";
import FailedPaymentModal from "../../Modal/FailedPaymentModal";
import CustomerTooltip from "./CustomerTooltip";
import CustomerDefinitionModal from "../../Modal/CustomerDefinitionModal";
import CreditPaymentModal from "../../Modal/CreditPaymentModal";
import BarcodeCreditModal from "../../Modal/BarcodeCreditModal";
import ProductNotFoundModal from "../../Modal/ProductNotFoundModal";
import { useBarcodeScanner } from "../../../hooks/useBarcodeScanner";
import { findProductByBarcode } from "../../../utils/productService";
import { saveInvoice } from "../../../utils/invoiceService";
import barcodeImage from "../../../assets/img/barcode.png";
import SendSmsModal from "../../Modal/SendSmsModal";
import SendPaykModal from "../../Modal/SendPaykModal";
import useRequest from "../../../hooks/useRequest";
import { FACTOR_ENDPOINTS } from "../../../endpoint/Factor/factor";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface Item {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  price: number;
  discount: number | string;
  total: number;
  vatRate?: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  debt: number;
  address: string;
  nationalCode: string;
}

const Content: React.FC = () => {
  const {
    isOpen,
    barcode,
    closeModal,
    openCartPayment,
    isProductNotFoundOpen,
    notFoundBarcode,
    openProductNotFoundModal,
    closeProductNotFoundModal,
    openSuccessPayment,
    closeSuccessPayment,
    openSendSmsModal,
    closeSendSmsModal,
    isSendSmsModalOpen,
    openSendPaykModal,
    closeSendPaykModal,
    isSendPaykModalOpen,
  } = useModal();
  const [deliveryMedivod, setDeliveryMedivod] = useState("حضوری");
  const [paymentMedivod, setPaymentMedivod] = useState("کارتی");
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isCustomerTooltipOpen, setIsCustomerTooltipOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isCustomerDefinitionModalOpen, setIsCustomerDefinitionModalOpen] =
    useState(false);
  const [isCreditPaymentModalOpen, setIsCreditPaymentModalOpen] =
    useState(false);
  const [isBarcodeCreditModalOpen, setIsBarcodeCreditModalOpen] =
    useState(false);
  const [selectedCreditMethod, setSelectedCreditMethod] = useState<
    "tara" | "digipay" | null
  >(null);
  const [, setIsCreditSuccessModalOpen] = useState(false);
  const [, setCreditPaymentAmount] = useState(0);
  const [, setCreditRemainingAmount] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [showCreditInfo, setShowCreditInfo] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [payAtLocation, setPayAtLocation] = useState(false);
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState<
    string | null
  >(null);
  const [tempQuantity, setTempQuantity] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("256");
  const [, setShowCashInfo] = useState(false);
  const [partialPayments, setPartialPayments] = useState<
    { amount: number; type: string }[]
  >([]);

  const [vatSwitch, setVatSwitch] = useState(false);
  // حذف state های مربوط به saved factors
  // const [isSavedFactorsOpen, setIsSavedFactorsOpen] = useState(false);
  // const [savedFactors, setSavedFactors] = useState<any[]>([]);

  const generateNewInvoiceNumber = () => {
    try {
      const savedInvoices = JSON.parse(
        localStorage.getItem("savedInvoices") || "[]"
      );
      const nextNumber = savedInvoices.length + 1;
      setInvoiceNumber(nextNumber.toString());
    } catch (error) {
      console.error("خطا در تولید شماره فاکتور:", error);
    }
  };
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isBarcodeInputFocused, setIsBarcodeInputFocused] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const barcodeInputRef = React.useRef<HTMLInputElement>(null);

  const { isListening } = useBarcodeScanner({
    onBarcodeScanned: React.useCallback((barcode: string) => {
      handleBarcodeScanned(barcode);
    }, []),
    enabled: true,
  });

  const totalItems = items.length;
  const totalAmount = items.reduce((sum, item) => {
    const quantity = parseInt(item.quantity) || 0;
    return sum + item.price * quantity;
  }, 0);

  const totalDiscount = items.reduce((sum, item) => {
    if (item.discount !== "-") {
      const discountAmount =
        typeof item.discount === "number"
          ? item.discount
          : parseInt(item.discount.toString()) || 0;
      return sum + discountAmount;
    }
    return sum;
  }, 0);

  const totalPartialPaid = partialPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const totalVat = items.reduce((sum, item) => {
    const vatRate = item.vatRate ? parseFloat(item.vatRate) : 0;
    if (!vatRate) return sum;
    const quantity = parseInt(item.quantity) || 0;
    return sum + (item.price * quantity * vatRate) / 100;
  }, 0);
  const finalAmount =
    totalAmount -
    totalDiscount -
    (showCreditInfo ? creditAmount : 0) -
    totalPartialPaid +
    (vatSwitch ? totalVat : 0);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
      setIsBarcodeInputFocused(true);
    }
    generateNewInvoiceNumber();
    // حذف loadSavedFactors();
  }, []);

  // ارسال handler به GlobalHeader برای ارتباط با NavBar
  useEffect(() => {
    const event = new CustomEvent("setLoadFactorHandler", {
      detail: { handler: handleLoadSavedFactor },
    });
    window.dispatchEvent(event);
  }, []); // فقط یک بار اجرا شود

  // حذف event listener برای saved factors
  // useEffect(() => {
  //   const handleStorageChange = (e: StorageEvent) => {
  //     if (e.key === "savedInvoices") {
  //       loadSavedFactors();
  //     }
  //   };
  //   window.addEventListener("storage", handleStorageChange);
  //   return () => window.removeEventListener("storage", handleStorageChange);
  // }, []);

  useEffect(() => {
    if (!isProductNotFoundOpen && barcodeInputRef.current) {
      const timer = setTimeout(() => {
        barcodeInputRef.current?.focus();
        setIsBarcodeInputFocused(true);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isProductNotFoundOpen]);

  const handleModalSubmit = (data: { productName: string; price: string }) => {
    closeModal();
    console.log(data);
  };

  const handleQuantityClick = (itemId: number, currentQuantity: string) => {
    setSelectedItemId(itemId);
    setTempQuantity(currentQuantity);
    setOpenTooltipId(itemId);
  };

  const handleQuantityChange = (newValue: string) => {
    setTempQuantity(newValue);

    if (selectedItemId !== null && newValue) {
      setItems(
        items.map((item) => {
          if (item.id === selectedItemId) {
            const newQuantity = parseFloat(newValue);
            return {
              ...item,
              quantity: newValue,
              total: item.price * newQuantity,
            };
          }
          return item;
        })
      );
    }
  };

  const handleQuantityConfirm = () => {};

  const handleDialPadClose = () => {
    setOpenTooltipId(null);
    setSelectedItemId(null);
    setTempQuantity("");
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setItems([]);
    setSelectedCustomer(null);
    setShowCreditInfo(false);
    setCreditAmount(0);
    setSuccessMessage("فاکتور با موفقیت حذف شد");
    setTimeout(() => setSuccessMessage(""), 3000);
    setIsDeleteModalOpen(false);
  };

  const handleSaveInvoice = () => {
    if (items.length === 0) {
      alert("هیچ محصولی برای ذخیره وجود ندارد");
      return;
    }

    if (!selectedCustomer) {
      alert("لطفاً یک مشتری انتخاب کنید");
      return;
    }

    try {
      const newInvoice = {
        id: Date.now(),
        invoiceNumber: invoiceNumber,
        date: new Date().toISOString(),
        customer: selectedCustomer || {
          name: "",
          phone: "",
          debt: 0,
          address: "",
          nationalCode: "",
        },
        items: items,
        totalAmount,
        totalDiscount,
        finalAmount,
        paymentMethod: paymentMedivod,
        deliveryMethod: deliveryMedivod,
        status: "saved",
      };

      const success = saveInvoice(newInvoice);

      if (success) {
        setItems([]);
        setSelectedCustomer(null);
        setShowCreditInfo(false);
        setCreditAmount(0);
        generateNewInvoiceNumber();
        // حذف loadSavedFactors();
        setSuccessMessage("فاکتور با موفقیت ذخیره شد");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert("خطا در ذخیره فاکتور");
      }
    } catch (error) {
      alert("خطا در ذخیره فاکتور");
    }
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handlePayment = () => {
    if (payAtLocation) {
      openSendPaykModal();
      return;
    }

    if (deliveryMedivod === "پیک" && !payAtLocation) {
      setPendingPaymentMethod(paymentMedivod);
      openSendPaykModal();
      return;
    }

    if (paymentMedivod === "اعتباری") {
      setIsCreditPaymentModalOpen(true);
    } else if (paymentMedivod === "نسیه") {
      if (!selectedCustomer) {
        alert("برای پرداخت نسیه حتماً باید مشتری انتخاب کنید");
        return;
      }
      openCartPayment();
    } else if (paymentMedivod === "کارتی" || paymentMedivod === "نقدی") {
      openCartPayment();
    }
  };

  const handleCartPaymentConfirm = (amount: number) => {
    setPaymentAmount(amount);

    const currentPaymentMethod = pendingPaymentMethod || paymentMedivod;
    if (currentPaymentMethod !== "نسیه") {
      setPartialPayments((prev) => [
        ...prev,
        {
          amount,
          type:
            currentPaymentMethod === "نقدی"
              ? "1"
              : currentPaymentMethod === "نسیه"
              ? "credit"
              : "card",
        },
      ]);
    }

    if (currentPaymentMethod === "نسیه") {
      setCreditAmount(amount);
      setTimeout(() => {
        openSendSmsModal();
      }, 100);
      return;
    }

    openSuccessPayment();
  };

  const handleCreditMethodSelect = (method: "tara" | "digipay") => {
    setSelectedCreditMethod(method);
    setIsCreditPaymentModalOpen(false);
    setIsBarcodeCreditModalOpen(true);
  };

  const handleCreditPaymentSuccess = (
    creditAmount: number,
    remainingAmount: number
  ) => {
    setIsBarcodeCreditModalOpen(false);
    setSelectedCreditMethod(null);
    setCreditPaymentAmount(creditAmount);
    setCreditRemainingAmount(remainingAmount);
    setIsCreditSuccessModalOpen(true);
  };

  const handleSmsVerificationSuccess = () => {
    closeSendSmsModal();
    setShowCreditInfo(true);
    openSuccessPayment();
  };

  const handleSuccessPaymentClose = () => {
    closeSuccessPayment();

    if (deliveryMedivod === "پیک") {
      const paykInvoice = {
        id: Date.now(),
        invoiceNumber,
        date: new Date().toISOString(),
        customer: selectedCustomer || {
          name: "مشتری ناشناس",
          phone: "",
          address: "",
        },
        items,
        totalAmount,
        totalDiscount,
        finalAmount,
        paymentMethod: payAtLocation
          ? "پرداخت در محل"
          : pendingPaymentMethod || paymentMedivod,
        deliveryMethod: "پیک",
        courier: { type: "shop", name: "پیک فروشگاه" },
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      try {
        const existingPaykInvoices = JSON.parse(
          localStorage.getItem("paykInvoices") || "[]"
        );
        existingPaykInvoices.push(paykInvoice);
        localStorage.setItem(
          "paykInvoices",
          JSON.stringify(existingPaykInvoices)
        );
      } catch (error) {}
    }

    const currentPaymentMethod = pendingPaymentMethod || paymentMedivod;
    if (
      currentPaymentMethod === "نسیه" &&
      selectedCustomer &&
      creditAmount > 0
    ) {
      const creditInvoice = {
        id: Date.now(),
        invoiceNumber: invoiceNumber,
        date: new Date().toISOString(),
        customer: selectedCustomer,
        items: items,
        totalAmount,
        totalDiscount,
        finalAmount: finalAmount + creditAmount,
        creditAmount: creditAmount,
        remainingAmount: finalAmount,
        paymentMethod: "نسیه",
        deliveryMethod: deliveryMedivod,
        status: "credit",
      };

      const existingCreditCustomers = JSON.parse(
        localStorage.getItem("creditCustomers") || "[]"
      );

      const existingCustomerIndex = existingCreditCustomers.findIndex(
        (customer: any) => customer.mobile === selectedCustomer.phone
      );

      if (existingCustomerIndex !== -1) {
        existingCreditCustomers[existingCustomerIndex].invoices.push(
          creditInvoice
        );
        existingCreditCustomers[existingCustomerIndex].totalFactor =
          existingCreditCustomers[existingCustomerIndex].invoices.length;
        existingCreditCustomers[existingCustomerIndex].totalDebt +=
          creditAmount;
        existingCreditCustomers[existingCustomerIndex].totalPrice +=
          finalAmount + creditAmount;
      } else {
        const newCreditCustomer = {
          id: Date.now(),
          name: selectedCustomer.name,
          mobile: selectedCustomer.phone,
          nationalCode: selectedCustomer.nationalCode || "",
          address: selectedCustomer.address || "",
          invoices: [creditInvoice],
          totalFactor: 1,
          totalDebt: creditAmount,
          totalPrice: finalAmount + creditAmount,
          createdAt: new Date().toISOString(),
        };
        existingCreditCustomers.push(newCreditCustomer);
      }

      localStorage.setItem(
        "creditCustomers",
        JSON.stringify(existingCreditCustomers)
      );

      const existingInvoices = JSON.parse(
        localStorage.getItem("creditInvoices") || "[]"
      );
      existingInvoices.push(creditInvoice);
      localStorage.setItem("creditInvoices", JSON.stringify(existingInvoices));
    }
  };

  const handleRemainingPayment = () => {
    setShowCashInfo(true);
    closeSuccessPayment();
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerTooltipOpen(false);
  };

  const handleOpenCustomerDefinition = () => {
    setIsCustomerDefinitionModalOpen(true);
  };

  const handleAddCustomer = (customerData: any) => {
    console.log("New customer data:", customerData);
  };

  const handleBarcodeScanned = React.useCallback(
    (barcode: string) => {
      const product = findProductByBarcode(barcode);

      if (product) {
        const existingItem = items.find((item) => item.name === product.name);

        if (existingItem) {
          setItems(
            items.map((item) =>
              item.id === existingItem.id
                ? {
                    ...item,
                    quantity: (parseInt(item.quantity) + 1).toString(),
                    total: item.price * (parseInt(item.quantity) + 1),
                    vatRate: product.vatRate || "0", // string
                  }
                : item
            )
          );
        } else {
          const newItem: Item = {
            id: items.length + 1,
            name: product.name,
            quantity: "1",
            unit: product.unitType || "عدد",
            price: product.price,
            discount: product.discount || 0,
            total: product.price,
            vatRate: product.vatRate || "0", // string
          };

          setItems([...items, newItem]);
        }
        setSuccessMessage(`محصول ${product.name} با موفقیت اضافه شد`);
        setTimeout(() => setSuccessMessage(""), 3000);
        if (barcodeInputRef.current) {
          barcodeInputRef.current.focus();
          setIsBarcodeInputFocused(true);
        }
      } else {
        console.warn(`محصولی با بارکد ${barcode} پیدا نشد`);
        openProductNotFoundModal(barcode);
      }
    },
    [items, openProductNotFoundModal]
  );

  const handleBarcodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcodeInput(e.target.value);
  };

  const handleBarcodeSubmit = () => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    const englishBarcode = barcodeInput.replace(
      /[۰-۹]/g,
      (d) => englishDigits[persianDigits.indexOf(d)]
    );

    if (englishBarcode.trim()) {
      handleBarcodeScanned(englishBarcode.trim());
      setBarcodeInput("");
    }
  };

  const handleBarcodeInputFocus = () => {
    setIsBarcodeInputFocused(true);
  };

  const handleBarcodeInputBlur = () => {
    setIsBarcodeInputFocused(false);
  };

  const handleSendPaykConfirm = (customerData: any, courierData: any) => {
    closeSendPaykModal();

    savePaykInvoice(customerData, courierData);
    if (payAtLocation) {
      setPaymentAmount(finalAmount);
      openSuccessPayment();
      return;
    }

    if (pendingPaymentMethod === "اعتباری") {
      setIsCreditPaymentModalOpen(true);
    } else if (pendingPaymentMethod === "نسیه") {
      if (!selectedCustomer) {
        alert("برای پرداخت نسیه حتماً باید مشتری انتخاب کنید");
        return;
      }
      openCartPayment();
    } else if (
      pendingPaymentMethod === "کارتی" ||
      pendingPaymentMethod === "نقدی"
    ) {
      openCartPayment();
    }

    setPendingPaymentMethod(null);
  };

  const savePaykInvoice = (customerData: any, courierData: any) => {
    const paykInvoice = {
      id: Date.now(),
      invoiceNumber,
      date: new Date().toISOString(),
      customer: customerData,
      items,
      totalAmount,
      totalDiscount,
      finalAmount,
      paymentMethod: payAtLocation
        ? "پرداخت در محل"
        : pendingPaymentMethod || paymentMedivod,
      deliveryMethod: "پیک",
      courier: courierData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const existingPaykInvoices = JSON.parse(
        localStorage.getItem("paykInvoices") || "[]"
      );
      existingPaykInvoices.push(paykInvoice);
      localStorage.setItem(
        "paykInvoices",
        JSON.stringify(existingPaykInvoices)
      );
    } catch (error) {}
  };

  const { token } = useSelector((state: RootState) => state.auth);

  const { execute: printFactor } = useRequest(FACTOR_ENDPOINTS.factor, "POST", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handlePrintFactor = async () => {
    function generateUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }
    try {
      const payload = {
        customerId: selectedCustomer?.id || "",
        mobile: selectedCustomer?.phone || "",
        amount: paymentAmount,
        customerNote: "",
        customerType: "",
        deliveryStatus: deliveryMedivod === "حضوری" ? "3" : "2",
        dynamicCode: 0,
        isBNPL: partialPayments.filter((p) => p.type !== "0").length > 0,
        isPrinted: true,
        receiptCode: "2",
        saleStatus: "1010",
        shopBizItemDtoList: items,
        shopBizPaymentDtoList: partialPayments.filter((p) => p.type !== "0"),
        shopBizUuid: generateUUID(),
        tableNumber: "",
        taxInvoicePattern: 1,
        taxInvoiceType: 2,
        tax: 0,
        userDiscount: 0,
      };
      await printFactor(payload);
    } catch (e) {
      console.error(e);
    }
  };

  // تابع برای بارگذاری فاکتور ذخیره شده در Content
  const handleLoadSavedFactor = (factor: any) => {
    // پاک کردن داده‌های فعلی
    setItems([]);
    setSelectedCustomer(null);
    setShowCreditInfo(false);
    setCreditAmount(0);
    setPartialPayments([]);

    // بارگذاری داده‌های فاکتور ذخیره شده
    try {
      const savedInvoices = JSON.parse(
        localStorage.getItem("savedInvoices") || "[]"
      );
      const savedFactor = savedInvoices.find(
        (invoice: any) => invoice.invoiceNumber === factor.id
      );

      if (savedFactor) {
        // تنظیم شماره فاکتور
        setInvoiceNumber(savedFactor.invoiceNumber);

        // تنظیم مشتری
        setSelectedCustomer({
          id: savedFactor.customer.id || Date.now(),
          name: savedFactor.customer.name,
          phone: savedFactor.customer.phone,
          debt: savedFactor.customer.debt || 0,
          address: savedFactor.customer.address || "",
          nationalCode: savedFactor.customer.nationalCode || "",
        });

        // تنظیم آیتم‌ها
        const loadedItems = savedFactor.items.map(
          (item: any, index: number) => ({
            id: index + 1,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            discount: item.discount,
            total: item.total,
            vatRate: item.vatRate || "0",
          })
        );
        setItems(loadedItems);

        // تنظیم روش پرداخت و تحویل
        setPaymentMedivod(savedFactor.paymentMethod || "کارتی");
        setDeliveryMedivod(savedFactor.deliveryMethod || "حضوری");

        setSuccessMessage(
          `فاکتور ${savedFactor.invoiceNumber} با موفقیت بارگذاری شد`
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("خطا در بارگذاری فاکتور:", error);
      setSuccessMessage("خطا در بارگذاری فاکتور");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // حذف توابع مربوط به saved factors
  // const loadSavedFactors = () => { ... };
  // const handleDeleteFactor = (id: string) => { ... };

  return (
    <>
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
      <section
        style={{
          position: "fixed",
          width: "1575px",
          height: "848px",
          left: "53px",
          top: "90px",
          zIndex: 1,
          backgroundColor: "#fff",
          padding: "30px",
        }}
      >
        <NoBarcodeModal
          isOpen={isOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          barcode={barcode}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onDelete={handleDeleteConfirm}
          invoiceNumber={invoiceNumber}
        />
        <CartPaymentModal
          totalAmount={finalAmount}
          onConfirm={handleCartPaymentConfirm}
          paymentType={
            pendingPaymentMethod === "نقدی"
              ? "cash"
              : pendingPaymentMethod === "نسیه"
              ? "credit"
              : paymentMedivod === "نقدی"
              ? "cash"
              : paymentMedivod === "نسیه"
              ? "credit"
              : "card"
          }
        />
        <CartPaymentLoading amount={paymentAmount} />
        <CartPaymentPassword amount={paymentAmount} />
        <SuccessPaymentModal
          amount={paymentAmount}
          transactionType={
            payAtLocation
              ? "پرداخت در محل"
              : pendingPaymentMethod === "نقدی"
              ? "نقدی"
              : pendingPaymentMethod === "نسیه"
              ? "نسیه"
              : paymentMedivod === "نقدی"
              ? "نقدی"
              : paymentMedivod === "نسیه"
              ? "نسیه"
              : "خرید"
          }
          date={new Date().toLocaleDateString("fa-IR")}
          time={new Date().toLocaleTimeString("fa-IR")}
          trackingNumber={Math.random().toString(36).substring(7)}
          referenceNumber={Math.random().toString(36).substring(7)}
          totalAmount={finalAmount}
          paymentType={
            payAtLocation
              ? "cash"
              : pendingPaymentMethod === "نقدی"
              ? "cash"
              : pendingPaymentMethod === "نسیه"
              ? "credit"
              : paymentMedivod === "نقدی"
              ? "cash"
              : paymentMedivod === "نسیه"
              ? "credit"
              : "card"
          }
          onClose={handleSuccessPaymentClose}
          onRemainingPayment={handleRemainingPayment}
          onPrint={handlePrintFactor}
        />
        <FailedPaymentModal
          amount={paymentAmount}
          transactionType="خرید"
          date={new Date().toLocaleDateString("fa-IR")}
          time={new Date().toLocaleTimeString("fa-IR")}
          trackingNumber={Math.random().toString(36).substring(7)}
          referenceNumber={Math.random().toString(36).substring(7)}
        />
        <CustomerDefinitionModal
          isOpen={isCustomerDefinitionModalOpen}
          onClose={() => setIsCustomerDefinitionModalOpen(false)}
          onAdd={handleAddCustomer}
        />
        <CreditPaymentModal
          isOpen={isCreditPaymentModalOpen}
          onClose={() => setIsCreditPaymentModalOpen(false)}
          onSelectMethod={handleCreditMethodSelect}
        />
        <BarcodeCreditModal
          isOpen={isBarcodeCreditModalOpen}
          onClose={() => {
            setIsBarcodeCreditModalOpen(false);
            setSelectedCreditMethod(null);
          }}
          paymentMethod={selectedCreditMethod || "tara"}
          totalAmount={finalAmount}
          onSuccess={handleCreditPaymentSuccess}
        />
        <ProductNotFoundModal
          isOpen={isProductNotFoundOpen}
          onClose={closeProductNotFoundModal}
          barcode={notFoundBarcode}
          onProductAdded={() => {
            if (
              confirm(
                "کالا با موفقیت اضافه شد. آیا می‌خواهید به صفحه کالاهای ثبت نشده بروید؟"
              )
            ) {
              window.location.href = "/unregistered";
            }
          }}
        />
        <SendSmsModal
          isOpen={isSendSmsModalOpen}
          onClose={closeSendSmsModal}
          customerPhone={selectedCustomer?.phone || ""}
          onSuccess={handleSmsVerificationSuccess}
          onCancel={closeSendSmsModal}
        />
        <div
          style={{
            position: "absolute",
            width: "1030px",
            height: "920px",
            right: 0,
            top: 0,
            background: "#FFFFFF",
            borderRadius: "10px",
          }}
          className="p-8"
        >
          <div className="flex items-center justify-between gap-8 max-h-10">
            <div className="flex items-center gap-2">
              <Input
                ref={barcodeInputRef}
                placeholder="بارکد کالا را وارد کنید"
                hasButton
                buttonText="ثبت بارکد"
                value={barcodeInput}
                onChange={handleBarcodeInputChange}
                onFocus={handleBarcodeInputFocus}
                onBlur={handleBarcodeInputBlur}
                onButtonClick={handleBarcodeSubmit}
                style={{
                  width: "445px",
                  borderRadius: "55px",
                  border: "2px solid #7485E5",
                }}
              />
              {isListening && isBarcodeInputFocused && (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span></span>
                </div>
              )}
              {isListening && !isBarcodeInputFocused && (
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span></span>
                </div>
              )}
              {successMessage && (
                <div className="flex items-center gap-1 text-green-600 text-sm animate-fade-in">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span></span>
                </div>
              )}
            </div>

            <div style={{ position: "relative" }}>
              <Button
                label="مشتری"
                color="#DAA51A"
                onClick={() => setIsCustomerTooltipOpen(!isCustomerTooltipOpen)}
                disabled={items.length === 0}
              />
              <CustomerTooltip
                isOpen={isCustomerTooltipOpen}
                setIsOpen={setIsCustomerTooltipOpen}
                onSelectCustomer={handleCustomerSelect}
                onOpenCustomerDefinition={handleOpenCustomerDefinition}
              />
            </div>

            {/* حذف دکمه فاکتورهای ذخیره شده */}

            <Button
              label="ذخیره"
              color="#4973DE"
              onClick={handleSaveInvoice}
              disabled={items.length === 0}
            ></Button>
            <Button
              label="حذف"
              color="#DE4949"
              onClick={handleDeleteClick}
              disabled={items.length === 0}
            ></Button>
          </div>

          <div className="flex items-center justify-between gap-8 max-h-10 mt-8">
            <span className="bg-[#D1D1D1] font-21 text-black px-4 py-2 rounded-md">
              فاکتور فروش {invoiceNumber}
            </span>
            {/* just show when selectedCustomer */}
            {selectedCustomer ? (
              <div className="pr-10 pl-4 flex justify-between rounded-[43px] items-center gap-2 w-[523px] h-[43px] bg-[#FFD976]">
                <span className="f-[20px] text-medium">
                  {selectedCustomer ? selectedCustomer.name : ""}
                </span>
                <div className="flex gap-4 items-center">
                  <span className="f-20 text-medium">
                    {selectedCustomer ? selectedCustomer.phone : ""}
                  </span>
                  <img
                    src={CloseIcon}
                    onClick={() => setSelectedCustomer(null)}
                  />
                </div>
              </div>
            ) : null}
            {/* <Input
              placeholder="انتخاب مشتری"
              value={selectedCustomer ? selectedCustomer.name : ""}
              onChange={() => {}}
              style={{
                minWidth: "441px",
              }}
              disabled={items.length === 0}
            /> */}
            <span className="bg-[#D1D1D1] font-21 text-black px-4 py-2 rounded-md">
              تعداد اقلام {totalItems}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[640px] mt-8">
              <img
                src={barcodeImage}
                alt="بارکد"
                className="w-[397px] h-[400px] object-contain mb-4 opacity-60"
              />
              <p className="text-[#B0BBF5] font-23 text-center">
                بارکد کالا را اسکن کنید
              </p>
            </div>
          ) : (
            <section className="w-full text-right mt-8 flex flex-col gap-2 overflow-y-auto h-[640px]">
              <div className="flex justify-between">
                <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center">
                  #
                </div>
                <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[216px]">
                  نام کالا
                </div>
                <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[108px]">
                  مقدار
                </div>
                <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[86px]">
                  واحد
                </div>
                <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[120px]">
                  قیمت(ریال)
                </div>
                <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[108px]">
                  تخفیف
                </div>
                <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[158px]">
                  جمع کل (ریال)
                </div>
              </div>
              <section className="overflow-y-auto relative h-[610px]">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex justify-between py-1 font-21 ${
                      item.id % 2 === 1 ? "bg-our-choice-200 rounded-md" : ""
                    }`}
                  >
                    <div className="h-10 w-10 p-4 rounded-md flex items-center justify-center">
                      {item.id}
                    </div>
                    <div className="h-10 w-10 p-4 rounded-md flex items-center text-[16px] justify-center min-w-[216px] font-semibold">
                      {item.name}
                    </div>
                    <div className="flex items-center justify-center min-w-[108px]">
                      <Tooltip
                        component={
                          <DialPad
                            value={
                              selectedItemId === item.id
                                ? tempQuantity
                                : item.quantity
                            }
                            onChange={handleQuantityChange}
                            onConfirm={handleQuantityConfirm}
                            onClose={handleDialPadClose}
                          />
                        }
                        isOpen={openTooltipId === item.id}
                        setIsOpen={(isOpen) => {
                          if (!isOpen) {
                            setOpenTooltipId(null);
                            setSelectedItemId(null);
                            setTempQuantity("");
                          } else {
                            setOpenTooltipId(item.id);
                          }
                        }}
                      >
                        <span
                          className="bg-our-choice h-10 min-w-10 px-2 overflow-hidden flex justify-center items-center rounded-md font-semibold cursor-pointer"
                          onClick={() =>
                            handleQuantityClick(item.id, item.quantity)
                          }
                        >
                          {selectedItemId === item.id
                            ? tempQuantity
                            : item.quantity}
                        </span>
                      </Tooltip>
                    </div>
                    <div className="h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[86px]">
                      {item.unit}
                    </div>
                    <div className="h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[120px]">
                      {item.price.toLocaleString("fa-IR")}
                    </div>
                    <div className="h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[108px]">
                      {item.discount.toLocaleString("fa-IR")}
                    </div>
                    <div className="h-10 w-10 rounded-md flex items-center justify-center min-w-[158px] font-23 gap-3">
                      {item.total.toLocaleString("fa-IR")}
                      <CloseSmIcon
                        onClick={() => {
                          /* handle delete */
                        }}
                      />
                    </div>
                  </div>
                ))}
              </section>
            </section>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            width: "568px",
            height: "920px",
            left: 0,
            top: 0,
            background: "#FFFFFF",
            borderRadius: "10px",
          }}
          className="p-8"
        >
          <div className="rounded-xl space-y-4 text-right">
            <div className="flex flex-col gap-4 font-21 bg-our-choice-100 p-4 rounded-lg">
              <div className="flex justify-between px-4 py-2">
                <span>مبلغ</span>
                <span>
                  {commaSeparator(totalAmount)}
                  <span className="mx-1 font-16">ریال</span>
                </span>
              </div>
              <div className="flex justify-between bg-[#EFEFEF] rounded-lg px-4 py-2">
                <span>مالیات بر ارزش افزوده</span>
                <span className="flex items-center gap-2">
                  <span className="mx-1 font-16">
                    {commaSeparator(totalVat)} ریال
                  </span>{" "}
                  <label
                    style={{
                      display: "inline-block",
                      position: "relative",
                      width: 64,
                      height: 28,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={vatSwitch}
                      onChange={() => setVatSwitch((v) => !v)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: vatSwitch ? "#7485E5" : "#ccc",
                        borderRadius: 28,
                        transition: "background 0.2s",
                        display: "block",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: vatSwitch ? 40 : 2,
                          top: 2,
                          width: 24,
                          height: 24,
                          background: "#fff",
                          borderRadius: "50%",
                          transition: "left 0.2s",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                          display: "block",
                        }}
                      />
                    </span>
                  </label>
                </span>
              </div>
              <div className="flex justify-between px-4 py-2">
                <span>تخفیف</span>
                <span className="flex items-center">
                  <span className="mx-1">
                    {totalDiscount > 0 ? commaSeparator(totalDiscount) : "-"}
                  </span>
                  <BinIcon />
                </span>
              </div>
              <div className="flex justify-between bg-[#EFEFEF] rounded-lg px-4 py-2">
                <span>تعداد اقلام</span>
                <span className="font-16">{totalItems} عدد</span>
              </div>
              <div className="flex justify-between font-semibold rounded-lg px-4 py-2">
                <span>مبلغ کل</span>
                <span className="font-16">
                  {commaSeparator(totalAmount)} ریال
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold bg-[#E7E7E7] rounded-lg px-4 py-2">
                <span>مبلغ قابل پرداخت</span>
                <span>
                  {commaSeparator(finalAmount)}{" "}
                  <span className="font-16">ریال</span>
                </span>
              </div>
              <div className="text-center text-sm text-gray-600 font-19">
                {numberToPersianToman(finalAmount)}
              </div>
              <input
                type="text"
                placeholder="موبایل خریدار را جهت فاکتور دیجیتال وارد کنید"
                className="w-full border rounded-md px-3 py-2 mt-2 text-sm"
              />
            </div>

            <div className="flex justify-between items-center py-5 rounded-md">
              <span className="font-25 ml-2">تحویل:</span>
              <div className="bg-[#E7E7E7] flex justify-between items-center flex-grow rounded-lg">
                <button
                  onClick={() => setDeliveryMedivod("پیک")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium font-23 h-12 ${
                    deliveryMedivod === "پیک"
                      ? "bg-success text-white"
                      : "bg-[#E7E7E7]"
                  }`}
                >
                  پیک
                </button>
                <button
                  onClick={() => setDeliveryMedivod("حضوری")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium font-23 h-12 ${
                    deliveryMedivod === "حضوری"
                      ? "bg-success text-white"
                      : "bg-[#E7E7E7]"
                  }`}
                >
                  حضوری
                </button>
              </div>
            </div>

            <div className="space-y-2 border border-black rounded-xl p-6 relative">
              <div className="font-semibold bg-white absolute -top-5 px-2 font-25">
                پرداخت:
              </div>
              <div className="flex gap-2 items-center justify-between font-25">
                {["کارتی", "نقدی", "نسیه", "اعتباری"].map((medivod) => (
                  <div key={medivod} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`payment-${medivod}`}
                      name="paymentMethod"
                      value={medivod}
                      checked={paymentMedivod === medivod}
                      onChange={() => setPaymentMedivod(medivod)}
                      disabled={payAtLocation}
                      className="w-4 h-4 accent-primary"
                    />
                    <label
                      htmlFor={`payment-${medivod}`}
                      className={`font-21 cursor-pointer ${
                        payAtLocation ? "opacity-50" : ""
                      }`}
                    >
                      {medivod}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {deliveryMedivod === "پیک" && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <input
                  type="checkbox"
                  id="payAtLocation"
                  checked={payAtLocation}
                  onChange={(e) => setPayAtLocation(e.target.checked)}
                  style={{
                    width: "31px",
                    height: "31px",
                    borderRadius: "15px",
                  }}
                  className="accent-primary"
                />
                <label
                  htmlFor="payAtLocation"
                  className="font-23 text-center cursor-pointer font-semibold"
                >
                  پرداخت در محل
                </label>
              </div>
            )}

            {showCreditInfo && (
              <div className="w-full h-[48px] bg-[#E99C43] rounded-lg flex items-center justify-center text-white font-medium mb-4">
                مبلغ {creditAmount.toLocaleString("fa-IR")} ریال نسیه تعلق گرفته
                است
              </div>
            )}
            {partialPayments.length > 0 && (
              <div className="flex flex-col gap-2 mb-4">
                {partialPayments.map((p, idx) => (
                  <div
                    key={idx}
                    className="w-full h-[48px] bg-[#E99C43] rounded-lg flex items-center justify-center text-white font-medium"
                  >
                    مبلغ {p.amount.toLocaleString("fa-IR")} ریال به صورت{" "}
                    {p.type} پرداخت شد
                  </div>
                ))}
              </div>
            )}
            <Button
              className="w-full text-white py-2 rounded-lg text-lg font-semibold min-h-[70px]"
              label={""}
              onClick={handlePayment}
              disabled={items.length === 0}
            >
              پرداخت
            </Button>
          </div>
        </div>
      </section>

      {/* SendPaykModal */}
      <SendPaykModal
        isOpen={isSendPaykModalOpen}
        onClose={closeSendPaykModal}
        onConfirm={handleSendPaykConfirm}
      />
    </>
  );
};

export default Content;
