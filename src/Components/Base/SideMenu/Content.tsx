import React, { useState, useEffect } from "react";
import { Button } from "../../Ui/Button/button";
import Input from "../../Ui/Input/input";
import { BinIcon, CloseSmIcon } from "../../icons";
import CloseIcon from "../../../assets/close.svg";
import trashIcon from "../../../assets/trash.svg";

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
// import CartPaymentPassword from "../../Modal/CartPaymentPassword";
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
  sku?: string;
  itemId?: string;
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
  const [shopBizItemDtoList, setShopBizItemDtoList] = useState<any[]>([]);
  // const [shopBizPaymentDtoList, setShopBizPaymentDtoList] = useState<any[]>([]);
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
    { receiveAmount: number }[]
  >([]);

  const [vatSwitch, setVatSwitch] = useState(false);
  // حذف state های مربوط به saved factors
  // const [isSavedFactorsOpen, setIsSavedFactorsOpen] = useState(false);
  // const [savedFactors, setSavedFactors] = useState<any[]>([]);

  const generateNewInvoiceNumber = () => {
    try {
      // دریافت آخرین شماره فاکتور از localStorage
      const lastInvoiceNumber = localStorage.getItem("lastInvoiceNumber");
      let nextNumber = 1;

      if (lastInvoiceNumber) {
        nextNumber = parseInt(lastInvoiceNumber) + 1;
      }

      setInvoiceNumber(nextNumber.toString());
      // ذخیره شماره جدید در localStorage
      localStorage.setItem("lastInvoiceNumber", nextNumber.toString());
    } catch (error) {
      console.error("خطا در تولید شماره فاکتور:", error);
      setInvoiceNumber("1");
    }
  };
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isBarcodeInputFocused, setIsBarcodeInputFocused] = useState(false);
  const [isBarcodeDialPadOpen, setIsBarcodeDialPadOpen] = useState(false);
  const [mobileInput, setMobileInput] = useState("");
  const [isMobileInputFocused, setIsMobileInputFocused] = useState(false);
  const [, setSuccessMessage] = useState("");
  const barcodeInputRef = React.useRef<HTMLInputElement>(null);
  const mobileInputRef = React.useRef<HTMLInputElement>(null);
  const lastProcessedBarcodeRef = React.useRef<string>("");
  const barcodeProcessingRef = React.useRef(false);

  const { isListening } = useBarcodeScanner({
    onBarcodeScanned: React.useCallback((barcode: string) => {
      handleBarcodeScanned(barcode);
    }, []),
    enabled: !isProductNotFoundOpen && !isBarcodeInputFocused,
  });

  const totalItems = React.useMemo(() => items.length, [items.length]);

  const totalAmount = React.useMemo(
    () =>
      items.reduce((sum, item) => {
        const quantity = parseInt(item.quantity) || 0;
        return sum + item.price * quantity;
      }, 0),
    [items]
  );

  const totalDiscount = React.useMemo(
    () =>
      items.reduce((sum, item) => {
        if (item.discount !== "-") {
          const discountAmount =
            typeof item.discount === "number"
              ? item.discount
              : parseInt(item.discount.toString()) || 0;
          return sum + discountAmount;
        }
        return sum;
      }, 0),
    [items]
  );

  const totalPartialPaid = React.useMemo(
    () => partialPayments.reduce((sum, p) => sum + p.receiveAmount, 0),
    [partialPayments]
  );

  const totalVat = React.useMemo(
    () =>
      items.reduce((sum, item) => {
        const vatRate = item.vatRate ? parseFloat(item.vatRate) : 0;
        if (!vatRate) return sum;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (item.price * quantity * vatRate) / 100;
      }, 0),
    [items]
  );

  const finalAmount = React.useMemo(
    () =>
      totalAmount -
      totalDiscount -
      (showCreditInfo ? creditAmount : 0) -
      totalPartialPaid +
      (vatSwitch ? totalVat : 0),
    [
      totalAmount,
      totalDiscount,
      showCreditInfo,
      creditAmount,
      totalPartialPaid,
      vatSwitch,
      totalVat,
    ]
  );

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
      setIsBarcodeInputFocused(true);
    }

    // بررسی و تنظیم شماره فاکتور اولیه
    const lastInvoiceNumber = localStorage.getItem("lastInvoiceNumber");
    if (!lastInvoiceNumber) {
      localStorage.setItem("lastInvoiceNumber", "1");
      setInvoiceNumber("1");
    } else {
      // فقط شماره فعلی را تنظیم کن، نه شماره جدید تولید کن
      setInvoiceNumber(lastInvoiceNumber);
    }

    // حذف loadSavedFactors();
  }, []);

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
      }, 100);

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

  const handleRemoveProduct = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId));
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
    setPaymentAmount(0);
    setPartialPayments([]);
  };

  const handleSaveInvoice = () => {
    if (items.length === 0) {
      alert("هیچ محصولی برای ذخیره وجود ندارد");
      return;
    }

    // if (!selectedCustomer) {
    //   alert("لطفاً یک مشتری انتخاب کنید");
    //   return;
    // }

    try {
      const customerObj = selectedCustomer
        ? selectedCustomer
        : {
            id: Date.now(),
            name: "",
            phone: "",
            debt: 0,
            address: "",
            nationalCode: "",
          };
      const newInvoice = {
        id: Date.now(),
        invoiceNumber: invoiceNumber,
        date: new Date().toISOString(),
        customer: customerObj,
        items: items,
        totalAmount,
        totalDiscount,
        finalAmount,
        paymentMethod: paymentMedivod,
        deliveryMethod: deliveryMedivod,
        status: "saved",
        partialPayments: partialPayments,
        remainingAmount:
          finalAmount -
          partialPayments.reduce((sum, p) => sum + p.receiveAmount, 0), // مبلغ مانده
        paymentType: paymentMedivod,
      };

      const success = saveInvoice(newInvoice);

      if (success) {
        setItems([]);
        setSelectedCustomer(null);
        setShowCreditInfo(false);
        setCreditAmount(0);
        generateNewInvoiceNumber(); // این تابع شماره جدید تولید می‌کند
        setPaymentAmount(0); // صفر کردن مبلغ قابل پرداخت
        setPartialPayments([]); // حذف مبالغ پرداختی قبلی
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
  const toPersianNumber = (number: string) => {
    return number.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };
  const handleCartPaymentConfirm = (amount: number) => {
    setPaymentAmount(amount);

    const currentPaymentMethod = pendingPaymentMethod || paymentMedivod;
    if (currentPaymentMethod !== "نسیه") {
      setPartialPayments((prev) => [
        ...prev,
        {
          acceptorExternalNo: "",
          acceptorName: "",
          acceptorPhone: "",
          changeAmount: 0,
          id: generateUUID(),
          issuerName: "",
          maskPan: "",
          method:
            currentPaymentMethod === "نقدی"
              ? "1"
              : currentPaymentMethod === "نسیه"
              ? "10"
              : currentPaymentMethod === "کارتی"
              ? "4"
              : "0",
          note: "",
          receiveAmount: amount,
          referenceNo: "",
          saleTxId: generateUUID(),
          settleFailReason: "",
          status: "1",
          terminalSerial: "TP100004859",
          time: new Date().toISOString().split(".")[0] + "Z",
          totalAmount: amount,
          trace: "",

          // paymentId: generateUUID(),
          // paymentMethod: currentPaymentMethod,
          // paymentType: "1",
          // paymentTypeDescription: "1",
          // paymentTypeDescription: "1",
          // amount,
          // type:
          //   currentPaymentMethod === "نقدی"
          //     ? "1"
          //     : currentPaymentMethod === "نسیه"
          //     ? "credit"
          //     : "card",
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
    // ریست کامل فاکتور پس از پرداخت موفق
    setItems([]);
    setSelectedCustomer(null);
    setShowCreditInfo(false);
    setCreditAmount(0);
    setPaymentAmount(0);
    setPartialPayments([]);
    // تولید شماره فاکتور جدید
    generateNewInvoiceNumber();
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

  const handleProductSelect = React.useCallback(
    (product: any) => {
      // اضافه کردن محصول به فاکتور
      const existingItem = items.find((item) => item.name === product.name);

      if (existingItem) {
        setItems(
          items.map((item) =>
            item.id === existingItem.id
              ? {
                  ...item,
                  quantity: (parseInt(item.quantity) + 1).toString(),
                  total: item.price * (parseInt(item.quantity) + 1),
                }
              : item
          )
        );
      } else {
        const newItem: Item = {
          id: items.length + 1,
          name: product.name,
          quantity: "1",
          unit: getUnitLabel(String(product.unitType || "0")),
          price: product.price,
          discount: product.discount || 0,
          total: product.price,
          vatRate: product.vatRate || "0",
          sku: product.sku || "",
          itemId: product.id,
        };

        setItems([...items, newItem]);
      }
    },
    [items]
  );

  const handleBarcodeScanned = React.useCallback(
    (barcode: string) => {
      // جلوگیری از پردازش بارکدهای تکراری و همزمان
      if (!barcode || barcode.trim().length === 0) return;
      if (barcodeProcessingRef.current) return;
      if (lastProcessedBarcodeRef.current === barcode) return;

      barcodeProcessingRef.current = true;
      lastProcessedBarcodeRef.current = barcode;

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
                    vatRate: product.vatRate || "0",
                    sku: product.sku || "",
                    itemId: product.id,
                  }
                : item
            )
          );
        } else {
          const newItem: Item = {
            id: items.length + 1,
            name: product.name,
            quantity: "1",
            unit: getUnitLabel(String(product.unitType)),
            price: product.price,
            discount: product.discount || 0,
            total: product.price,
            vatRate: product.vatRate || "0",
            sku: product.sku || "",
            itemId: product.id,
          };

          setItems([...items, newItem]);
          const shop: any = {
            brokerage: 0,
            constructionFee: 0,
            discountPerItem: 0,
            govId: product.govId || "",
            isPrinted: false,
            itemId: product.id,
            name: product.name,
            price: product.price,
            saleCount: newItem.quantity || 1,
            sellerProfit: 0,
            sku: product.sku || "",
            totalAmount: product.price,
            unitType: product.unitType,
            vatRate: product.vatRate || "0",
          };
          setShopBizItemDtoList([...shopBizItemDtoList, shop]);
        }

        // Clear barcode input only when product is found
        setBarcodeInput("");
        if (barcodeInputRef.current) {
          barcodeInputRef.current.focus();
          setIsBarcodeInputFocused(true);
        }
      } else {
        console.warn(`محصولی با بارکد ${barcode} پیدا نشد`);
        openProductNotFoundModal(barcode);
      }

      // Reset processing flag after a delay to prevent overlapping scans - کاهش تاخیر برای سرعت بیشتر
      setTimeout(() => {
        barcodeProcessingRef.current = false;
        lastProcessedBarcodeRef.current = "";
      }, 100);
    },
    [items, openProductNotFoundModal, shopBizItemDtoList]
  );

  const handleBarcodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setBarcodeInput(newValue);

    // اگر بارکد با دستگاه اسکن شده (طول مناسب و سرعت بالا)
    if (newValue.length >= 8 && newValue.length <= 20) {
      // کاهش تاخیر به 20ms برای سرعت بیشتر در دستگاه‌های اندروید قدیمی
      setTimeout(() => {
        if (barcodeInput === newValue) {
          handleBarcodeScanned(newValue.trim());
          setBarcodeInput("");
        }
      }, 20);
    }
  };

  const handleBarcodeSubmit = () => {
    if (barcodeInput) {
      handleBarcodeScanned(barcodeInput.trim());
      setBarcodeInput("");
    }
  };

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBarcodeSubmit();
    }
  };

  const handleBarcodeInputFocus = () => {
    setIsBarcodeInputFocused(true);
  };

  const handleBarcodeInputBlur = () => {
    setIsBarcodeInputFocused(false);
  };

  const handleBarcodeInputClick = () => {
    // اگر روی input کلیک شد، dialPad را باز کن
    setIsBarcodeDialPadOpen(true);
  };

  const handleBarcodeDialPadChange = (value: string) => {
    setBarcodeInput(value);
  };

  const handleBarcodeDialPadClose = () => {
    setIsBarcodeDialPadOpen(false);
    // دوباره فوکوس روی input بارکد
    setTimeout(() => {
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
        setIsBarcodeInputFocused(true);
      }
    }, 100);
  };

  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileInput(e.target.value);
  };

  const handleMobileInputClick = () => {
    setIsMobileInputFocused(true);
  };

  const handleMobileDialPadChange = (value: string) => {
    setMobileInput(value);
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

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };
  const handlePrintFactor = async () => {
    try {
      // Calculate total amount from all partial payments
      const totalAmount = partialPayments.reduce(
        (sum, payment) => sum + payment.receiveAmount,
        0
      );

      // Create shopBizItemDtoList dynamically from current items with correct quantities
      const dynamicShopBizItemDtoList = items.map((item) => ({
        brokerage: 0,
        constructionFee: 0,
        // discount: typeof item.discount === "number" ? item.discount : 0,
        discountPerItem: 0,
        govId: "",
        isPrinted: false,
        itemId: item.itemId || "",
        name: item.name,
        price: item.price,
        saleCount: item.quantity.toString(), // Use actual quantity from items
        sellerProfit: 0,
        sku: item.sku || "",
        totalAmount: item.total,
        unitType: item.unit === "عدد" ? "0" : item.unit === "وزن" ? "1" : "0",
        vatRate: item.vatRate?.toString() || "0",
      }));

      const payload = {
        amount: totalAmount,
        createdDate: new Date().toISOString(),
        customerId: selectedCustomer?.id?.toString() || "",
        customerNote: "",
        customerType: "",
        deliveryStatus: deliveryMedivod === "حضوری" ? "3" : "2",
        deviceDate: new Date().toISOString().split(".")[0] + "Z",
        isBNPL: false,
        isPrinted: true,
        mobile: selectedCustomer?.phone || "",
        receiptCode: invoiceNumber,
        saleStatus: "1010",
        shopBizItemDtoList: dynamicShopBizItemDtoList,
        shopBizPaymentDtoList: partialPayments,
        shopBizUuid: generateUUID(),
        tableNumber: "",
        taxInvoicePattern: 3,
        taxInvoiceType: 2,
        taxIdDate: new Date().toISOString(),
        tax: 0,
        userDiscount: 0,
        tip: 0,
      };

      console.log("Print factor payload:", payload);
      await printFactor(payload);
      console.log("Print factor API call successful");
    } catch (e) {
      console.error("Error in print factor:", e);
    }
  };

  // تابع برای بارگذاری فاکتور ذخیره شده در Content
  const handleLoadSavedFactor = React.useCallback((factor: any) => {
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
            vatRate: item.vatRate || 0,
          })
        );
        setItems(loadedItems);

        // تنظیم روش پرداخت و تحویل
        setPaymentMedivod(savedFactor.paymentMethod || "کارتی");
        setDeliveryMedivod(savedFactor.deliveryMethod || "حضوری");

        // بارگذاری مبالغ پرداختی و مانده
        setPartialPayments(savedFactor.partialPayments || []);
        // اگر remainingAmount ذخیره شده بود، می‌توان آن را در state جداگانه قرار داد یا در نمایش استفاده کرد

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
  }, []);

  // حذف توابع مربوط به saved factors
  // const loadSavedFactors = () => { ... };
  // const handleDeleteFactor = (id: string) => { ... };

  // تابع کمکی برای تبدیل مقدار واحد به متن مناسب
  const getUnitLabel = (unit: string) => {
    if (unit === "0" || unit === "0") return "عدد";
    if (unit === "1" || unit === "1") return "وزن";
    return unit || "عدد";
  };

  // ارسال handler به GlobalHeader برای ارتباط با NavBar
  useEffect(() => {
    const event = new CustomEvent("setLoadFactorHandler", {
      detail: { handler: handleLoadSavedFactor },
    });
    window.dispatchEvent(event);

    const productEvent = new CustomEvent("setSelectProductHandler", {
      detail: { handler: handleProductSelect },
    });
    window.dispatchEvent(productEvent);
  }, [handleLoadSavedFactor, handleProductSelect]);

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
        style={
          {
            // position: "fixed",
            // width: "1575px",
            // height: "848px",
            // left: "53px",
            // top: "90px",
            // zIndex: 1,
            // backgroundColor: "#fff",
            // padding: "30px",
          }
        }
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
        {/* <CartPaymentPassword amount={paymentAmount} /> */}
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
          // autoPrint={true}
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
            width: "1020px",
            height: "800px",
            right: "-50px",
            marginLeft: "80px",
            top: 0,
            background: "#fff",
            borderRadius: "10px",
          }}
          className="p-8"
        >
          <div className="flex items-center justify-between gap-8 max-h-10">
            <div className="flex items-center gap-2">
              <Tooltip
                positioning="parent"
                top={60}
                left={0}
                component={
                  <DialPad
                    value={barcodeInput}
                    onChange={handleBarcodeDialPadChange}
                    onConfirm={() => {
                      handleBarcodeSubmit();
                      setIsBarcodeDialPadOpen(false);
                      // دوباره فوکوس روی input بارکد
                      setTimeout(() => {
                        if (barcodeInputRef.current) {
                          barcodeInputRef.current.focus();
                          setIsBarcodeInputFocused(true);
                        }
                      }, 100);
                    }}
                    onClose={handleBarcodeDialPadClose}
                  />
                }
                isOpen={isBarcodeDialPadOpen}
                setIsOpen={setIsBarcodeDialPadOpen}
              >
                <Input
                  ref={barcodeInputRef}
                  placeholder="بارکد کالا را وارد کنید"
                  hasButton
                  buttonText="ثبت بارکد"
                  value={barcodeInput}
                  onChange={handleBarcodeInputChange}
                  onFocus={handleBarcodeInputFocus}
                  onBlur={handleBarcodeInputBlur}
                  onClick={handleBarcodeInputClick}
                  onButtonClick={handleBarcodeSubmit}
                  onKeyDown={handleBarcodeKeyDown}
                  readOnly={true} // جلوگیری از باز شدن کیبورد
                  style={{
                    width: "445px",
                    borderRadius: "55px",
                    border: "2px solid #7485E5",
                    cursor: "pointer", // نشان دادن قابلیت کلیک
                  }}
                />
              </Tooltip>
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
              {/* {successMessage && (
                <div className="flex items-center gap-1 text-green-600 text-sm animate-fade-in">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span></span>
                </div>
              )} */}
            </div>

            <div style={{ position: "relative" }}>
              <Button
                label="مشتری"
                color="#DAA51A"
                //when a click , do not click on the button
                onClick={(e) => {
                  //onable the button
                  e.currentTarget.disabled = false;
                  // e.stopPropagation();
                  if (isCustomerTooltipOpen) {
                    setIsCustomerTooltipOpen(false);
                  } else {
                    setIsCustomerTooltipOpen(true);
                    //disable the button
                    // e.currentTarget.disabled = true;
                  }
                }}
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
              فاکتور فروش {toPersianNumber(invoiceNumber)}
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
              تعداد اقلام {toPersianNumber(totalItems.toString())}
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
                        positioning="parent"
                        top={38}
                        left={55}
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
                        <div className="flex items-center justify-center">
                          {selectedItemId === item.id ? (
                            <>
                              <button
                                style={{
                                  width: 30,
                                  height: 30,
                                  background: "#479E55",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: 6,
                                  fontSize: 22,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginLeft: 8,
                                  cursor: "pointer",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newValue = (
                                    Number(tempQuantity) + 1
                                  ).toString();
                                  setTempQuantity(newValue);
                                  handleQuantityChange(newValue); // این تابع همین کار را انجام می‌دهد
                                }}
                              >
                                +
                              </button>
                              <span
                                className="bg-our-choice h-10 min-w-10 px-2 overflow-hidden flex justify-center items-center rounded-md font-semibold cursor-pointer"
                                onClick={() =>
                                  handleQuantityClick(item.id, item.quantity)
                                }
                                style={{ fontSize: 18 }}
                              >
                                {toPersianNumber(tempQuantity)}
                              </span>
                              <button
                                style={{
                                  width: 30,
                                  height: 30,
                                  background: "#DE4949",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: 6,
                                  fontSize: 22,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginRight: 8,
                                  cursor: "pointer",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (Number(tempQuantity) <= 1) {
                                    // Remove product when quantity is 1 or less
                                    handleRemoveProduct(item.id);
                                    setOpenTooltipId(null);
                                    setSelectedItemId(null);
                                    setTempQuantity("");
                                  } else {
                                    // Decrease quantity
                                    const newValue = (
                                      Number(tempQuantity) - 1
                                    ).toString();
                                    setTempQuantity(newValue);
                                    handleQuantityChange(newValue);
                                  }
                                }}
                              >
                                {Number(tempQuantity) <= 1 ? (
                                  <img
                                    src={trashIcon}
                                    alt="حذف"
                                    style={{
                                      width: 24,
                                      height: 24,
                                      backgroundColor: "white",
                                    }}
                                  />
                                ) : (
                                  "-"
                                )}
                              </button>
                            </>
                          ) : (
                            <span
                              className="bg-our-choice h-10 min-w-10 px-2 overflow-hidden flex justify-center items-center rounded-md font-semibold cursor-pointer"
                              onClick={() =>
                                handleQuantityClick(item.id, item.quantity)
                              }
                              style={{ fontSize: 18 }}
                            >
                              {/* {item.quantity} to persian number*/}
                              {toPersianNumber(item.quantity)}
                            </span>
                          )}
                        </div>
                      </Tooltip>
                    </div>
                    <div className="h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[86px]">
                      {getUnitLabel(String(item.unit))}
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
                        onClick={() => handleRemoveProduct(item.id)}
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
            height: "800px",
            left: 0,
            top: 0,
            background: "#FFFFFF",
            borderRadius: "10px",
          }}
          className="p-8 flex flex-col"
        >
          <div className="rounded-xl space-y-4 text-right flex flex-col h-full">
            {/* بخش اسکرول‌خور */}
            <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
              <div className="flex justify-between px-4 py-2 mt-2">
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
              <div className="flex justify-between px-4 py-2 mt-2">
                <span>تخفیف</span>
                <span className="flex items-center">
                  <span className="mx-1">
                    {totalDiscount > 0 ? commaSeparator(totalDiscount) : "-"}
                  </span>
                  <BinIcon />
                </span>
              </div>
              <div className="flex justify-between bg-[#EFEFEF] rounded-lg px-4 py-2 mt-2">
                <span>تعداد اقلام</span>
                <span className="font-16">
                  {toPersianNumber(totalItems.toString())} عدد
                </span>
              </div>
              <div className="flex justify-between font-semibold rounded-lg px-4 py-2 mt-2">
                <span>مبلغ کل</span>
                <span className="font-16">
                  {commaSeparator(totalAmount)} ریال
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold bg-[#E7E7E7] rounded-lg px-4 py-2 mt-2">
                <span>مبلغ قابل پرداخت</span>
                <span>
                  {commaSeparator(finalAmount)}{" "}
                  <span className="font-16">ریال</span>
                </span>
              </div>
              <div className="text-center text-sm text-gray-600 font-21 py-2 mt-2">
                {numberToPersianToman(finalAmount)}
              </div>
              <div style={{ position: "relative" }} className="mt-2">
                <Tooltip
                  top={560}
                  left={340}
                  component={
                    <DialPad
                      value={mobileInput}
                      onChange={handleMobileDialPadChange}
                      onConfirm={() => setIsMobileInputFocused(false)}
                      onClose={() => setIsMobileInputFocused(false)}
                    />
                  }
                  isOpen={isMobileInputFocused}
                  setIsOpen={setIsMobileInputFocused}
                  position="bottom"
                >
                  {/* set width of input 100%  */}
                  <input
                    ref={mobileInputRef}
                    type="text"
                    placeholder="موبایل خریدار را جهت فاکتور دیجیتال وارد کنید"
                    className="w-full border rounded-md px-3 py-2 mt-10 f-21 cursor-pointer"
                    value={mobileInput}
                    onChange={handleMobileInputChange}
                    onClick={handleMobileInputClick}
                    readOnly
                    style={{
                      width: "500px",
                      outline: "none",
                      // border: "none",
                      borderRadius: "10px",
                      padding: "10px",
                      // backgroundColor: "#E7E7E7",
                      fontSize: "21px",
                    }}
                  />
                </Tooltip>
              </div>

              <div className="flex justify-between items-center py-5 mt-4 rounded-md">
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
            </div>
            <div className="space-y-2 border border-black rounded-xl p-6 relative mt-4">
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
            {/* بخش ثابت پایین */}
            {showCreditInfo && (
              <div className="w-full h-[48px] bg-[#E99C43] rounded-lg flex items-center justify-center text-white font-medium mb-4">
                مبلغ {creditAmount.toLocaleString("fa-IR")} ریال نسیه تعلق گرفته
                است
              </div>
            )}
            {partialPayments.length > 0 && (
              <div className=" bg-[#E99C43] p-4 flex flex-col gap-2 mb-4">
                {partialPayments.map((p, idx) => (
                  <div
                    key={idx}
                    className="w-full h-[48px] bg-[#B97321] rounded-lg flex items-center justify-center text-white font-medium relative"
                  >
                    مبلغ {p.receiveAmount.toLocaleString("fa-IR")} ریال به صورت{" "}
                    {paymentMedivod} پرداخت شد
                    {paymentMedivod === "نقدی" && (
                      <button
                        style={{
                          position: "absolute",
                          left: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          color: "white",
                          fontSize: 24,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setPartialPayments((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                          setPaymentAmount((prev) => prev + p.receiveAmount);
                        }}
                      >
                        ×
                      </button>
                    )}
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
