import React, { useState, useMemo, useEffect } from "react";
import productLabel from "../../assets/productLabel.svg";
import Pagination from "../../Components/Pagination/Pagination";
import arrowDown from "../../assets/arrow-down.svg";
import optionIcon from "../../assets/option.svg";
import { Button } from "../../Components/Ui/Button/button";
import Input from "../../Components/Ui/Input/input";
import filterIcon from "../../assets/filter.svg";
import CrediteFilter from "../../Components/CrediteFilter/CrediteFilter";
import Tooltip from "../../Components/Base/SideMenu/Tooltip";
import CreditTooltip from "../../Components/CreditTooltip/CreditTooltip";
import CreditFactor from "../../Components/CreditFactor/CreditFactor";
import DebtPaymentModal from "../../Components/Modal/DebtPaymentModal";
import SendDebtModal from "../../Components/Modal/SendDebtModal";
import CartPaymentLoading from "../../Components/Modal/CartPaymentLoading";
import CartPaymentPassword from "../../Components/Modal/CartPaymentPassword";
import SuccessPaymentModal from "../../Components/Modal/SuccessPaymentModal";
import FailedPaymentModal from "../../Components/Modal/FailedPaymentModal";
import { useModal } from "../../hooks/useModal";
import { usePaymentStore } from "../../hooks/usePaymentStore";

interface FactorInfo {
  id: number;
  factorNumber: number;
  productCount: number;
  date: Date;
  price: number;
  debt: number;
  paymentType: string;
}

interface Item {
  id: number;
  name: string;
  mobile: string;
  totalFactor: number;
  totalDebt: number;
  nationalitiCode: string;
  address: string;
  totalPrice: number;
  factorInfo: FactorInfo[];
}
const pageSize = 20;
// const paymentTypes = ["کارتی", "نقدی", "نسیه", "اعتباری"];
// const generateMobileNumber = (): string =>
//   "09" +
//   Math.floor(Math.random() * 1_000_000_000)
//     .toString()
//     .padStart(9, "0");

// const generatePersianAddress = (): string => {
//   const cities = [
//     "تهران",
//     "مشهد",
//     "اصفهان",
//     "تبریز",
//     "شیراز",
//     "اهواز",
//     "کرج",
//     "قم",
//     "ارومیه",
//     "رشت",
//   ];
//   const streets = [
//     "ولی‌عصر",
//     "انقلاب",
//     "آزادی",
//     "مطهری",
//     "شریعتی",
//     "سعدی",
//     "فاطمی",
//     "کارگر",
//     "نارمک",
//     "پاسداران",
//   ];
//   const alleys = [
//     "یکم",
//     "دوم",
//     "سوم",
//     "چهارم",
//     "پنجم",
//     "ششم",
//     "هفتم",
//     "هشتم",
//     "نهم",
//     "دهم",
//   ];

//   const city = cities[Math.floor(Math.random() * cities.length)];
//   const street = streets[Math.floor(Math.random() * streets.length)];
//   const alley = alleys[Math.floor(Math.random() * alleys.length)];
//   const plaque = Math.floor(1 + Math.random() * 200);
//   const postalCode = Math.floor(1000000000 + Math.random() * 8999999999);

//   return `ایران، ${city}، خیابان ${street}، کوچه ${alley}، پلاک ${plaque}، کد پستی ${postalCode}`;
// };

const Credit: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
  //   const [, setSelectedItemId] = useState<number | null>(null);
  const [isDebtPaymentOpen, setIsDebtPaymentOpen] = useState(false);
  const [isSendDebtOpen, setIsSendDebtOpen] = useState(false);
  const [debtPaymentItem, setDebtPaymentItem] = useState<Item | null>(null);
  const [sendDebtMobile, setSendDebtMobile] = useState<string | null>(null);

  // State برای فرآیند پرداخت
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentType, setPaymentType] = useState<"card" | "cash">("card");
  const [transactionData, setTransactionData] = useState({
    trackingNumber: "",
    referenceNumber: "",
    date: "",
    time: "",
  });

  const setPaymentAmountStore = usePaymentStore(
    (state) => state.setEditableAmount
  );

  const [finalData, setFinalData] = useState<Item[]>([]);

  // Function to load and process credit data
  const loadCreditData = () => {
    // Read credit invoices from localStorage
    const creditInvoices = JSON.parse(
      localStorage.getItem("creditInvoices") || "[]"
    );
    console.log(creditInvoices, "creditInvoices");

    // Group invoices by customer
    const customerMap = new Map<string, Item>();

    creditInvoices.forEach((invoice: any, index: number) => {
      const customerKey = invoice.customer.phone;

      if (customerMap.has(customerKey)) {
        // Customer already exists, add this invoice to their factorInfo
        const existingCustomer = customerMap.get(customerKey)!;
        existingCustomer.factorInfo.push({
          id: existingCustomer.factorInfo.length + 1,
          factorNumber: parseInt(invoice.invoiceNumber),
          productCount: invoice.items.length,
          date: new Date(invoice.date),
          price: invoice.finalAmount,
          debt: invoice.creditAmount,
          paymentType: "نسیه",
        });
        existingCustomer.totalFactor = existingCustomer.factorInfo.length;
        existingCustomer.totalDebt += invoice.creditAmount;
        existingCustomer.totalPrice += invoice.finalAmount;
      } else {
        // New customer
        const newCustomer: Item = {
          id: index + 1,
          name: invoice.customer.name,
          mobile: invoice.customer.phone,
          nationalitiCode: invoice.customer.nationalCode || "",
          address: invoice.customer?.address || "",
          factorInfo: [
            {
              id: 1,
              factorNumber: parseInt(invoice.invoiceNumber),
              productCount: invoice.items.length,
              date: new Date(invoice.date),
              price: invoice.finalAmount,
              debt: invoice.creditAmount,
              paymentType: "نسیه",
            },
          ],
          totalFactor: 1,
          totalDebt: invoice.creditAmount,
          totalPrice: invoice.finalAmount,
        };
        customerMap.set(customerKey, newCustomer);
      }
    });

    const result = Array.from(customerMap.values());
    setFinalData(result);
  };

  // Load data on component mount
  useEffect(() => {
    loadCreditData();
  }, []);

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      loadCreditData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [items, setItems] = useState<Item[]>(finalData);

  // Update items when finalData changes
  useEffect(() => {
    setItems(finalData);
  }, [finalData]);

  const totalPages = Math.ceil(items.length / pageSize);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (!value) {
      setItems(finalData);
    } else {
      const filtered = finalData.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.mobile.includes(value)
      );
      setItems(filtered);
    }
    setCurrentPage(1);
  };

  const handleFilterApply = (filters: any) => {
    let filtered = finalData;

    if (filters.minCount) {
      filtered = filtered.filter(
        (item) => item.totalFactor >= filters.minCount
      );
    }
    if (filters.maxCount) {
      filtered = filtered.filter(
        (item) => item.totalFactor <= filters.maxCount
      );
    }
    if (filters.startDate) {
      filtered = filtered.filter((item) =>
        item.factorInfo.some((f) => new Date(f.date) >= filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter((item) =>
        item.factorInfo.some((f) => new Date(f.date) <= filters.endDate)
      );
    }

    setItems(filtered);
    setCurrentPage(1);
    setShowFilter(false);
  };

  //   const handleEditCategory = (id: string) => {
  //     console.log("Edit:", id);
  //   };

  //   const handleDeleteCategory = (id: string) => {
  //     console.log("Delete:", id);
  //     setOpenTooltipId(null);
  //   };

  //   const handleOpenDebtPayment = (item: Item) => {
  //     setDebtPaymentItem(item);
  //     setIsDebtPaymentOpen(true);
  //   };

  const handleOpenSendDebt = (mobile: string) => {
    setSendDebtMobile(mobile);
    setIsSendDebtOpen(true);
  };

  const {
    openCartPaymentLoading,
    openCartPaymentPassword,
    openSuccessPayment,
    openFailedPayment,
    isCartPaymentLoading,
    isCartPaymentPassword,
    isSuccessPaymentOpen,
    isFailedPaymentOpen,
  } = useModal();

  const handlePaymentConfirm = async (
    amount: number,
    type: "card" | "cash"
  ) => {
    setPaymentAmount(amount);
    setPaymentType(type);
    setIsDebtPaymentOpen(false);

    if (type === "card") {
      // فرآیند پرداخت کارتی
      try {
        setPaymentAmountStore(amount);
        openCartPaymentLoading();

        // شبیه‌سازی فرآیند پرداخت
        setTimeout(() => {
          openCartPaymentPassword();
        }, 2000);
      } catch (error) {
        console.error("خطا در اتصال به دستگاه کارت‌خوان:", error);
        openFailedPayment();
      }
    } else {
      // فرآیند پرداخت نقدی - مستقیماً به موفقیت
      setTransactionData({
        trackingNumber: Math.random().toString(36).substring(7),
        referenceNumber: Math.random().toString(36).substring(7),
        date: new Date().toLocaleDateString("fa-IR"),
        time: new Date().toLocaleTimeString("fa-IR"),
      });
      openSuccessPayment();
    }
  };

  return (
    <>
      {selectedItem ? (
        <CreditFactor
          {...selectedItem}
          onBack={() => setSelectedItem(null)}
          onPayDebt={() => {
            setDebtPaymentItem(selectedItem);
            setIsDebtPaymentOpen(true);
          }}
          onSendDebt={() => {
            setSendDebtMobile(selectedItem.mobile);
            setIsSendDebtOpen(true);
          }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center mb-4">
            <img src={productLabel} alt="label" />
            <span className="text-black mr-2 text-[30px] font-medium">
              نسیه -
            </span>
            <span className="text-[#7E7E7E] text-[23px] font-normal">
              {items.length} فاکتور
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex">
              <Input
                type="text"
                width="603px"
                height={48}
                placeholder="نام یا شماره تلفن همراه مشتری را جست‌وجو کنید"
                onChange={(e) => handleSearch(e.target.value)}
                value={search}
                style={{
                  borderRadius: "55px",
                  border: "2px solid #7485E5",
                  marginLeft: "15px",
                  marginBottom: "5px",
                  backgroundColor: "#fff",
                }}
                placeholderStyle={{
                  fontSize: "19px",
                  fontWeight: "400",
                  color: "#7E7E7E",
                }}
              />
              <Button
                label="فیلتر"
                color="#7485E5"
                radius={15}
                style={{ width: "175px", height: "48px", marginLeft: "15px" }}
                onClick={() => setShowFilter((prev) => !prev)}
              >
                <img src={filterIcon} className="relative bottom-6 right-3" />
                <img
                  src={arrowDown}
                  alt="arrow"
                  className={`absolute right-[66px] bottom-[24px] transition-transform ${
                    showFilter ? "rotate-180" : ""
                  }`}
                />
              </Button>
              <Button
                label="تازه‌سازی"
                color="#479E55"
                radius={15}
                style={{ width: "175px", height: "48px", marginLeft: "15px" }}
                onClick={loadCreditData}
              />
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
          {showFilter && (
            <CrediteFilter
              onApply={handleFilterApply}
              onReset={() => {
                setItems(finalData);
                setCurrentPage(1);
              }}
              showReset={items !== finalData}
            />
          )}
          <div className="mt-4 w-full h-[50px] bg-[#E7E7E7] rounded-[10px] flex justify-center items-center">
            <span className="text-[23px] font-semibold">مشتری‌های نسیه</span>
          </div>
          <section className="w-full mt-4 flex flex-col gap-2 overflow-y-auto text-right">
            <div className="flex justify-between">
              {[
                "#",
                "نام مشتری",
                "موبایل",
                "مجموع فاکتور",
                "میزان بدهی (ریال)",
              ].map((title, i) => (
                <div
                  key={i}
                  className={`bg-our-choice h-10 p-4 rounded-md flex items-center justify-center ${
                    i === 0 ? "w-[50px]" : "w-[360px]"
                  }`}
                >
                  {title}
                </div>
              ))}
            </div>
            <div
              className="overflow-y-auto relative"
              style={{ height: showFilter ? 350 : 500 }}
            >
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex justify-between py-1 font-21 ${
                      index % 2 === 0 ? "bg-our-choice-200 rounded-md" : ""
                    }`}
                  >
                    <div className="w-[50px] p-4 flex items-center justify-center">
                      {(currentPage - 1) * pageSize + index + 1}
                    </div>
                    <div className="w-[360px] p-4 flex items-center justify-center">
                      {item.name}
                    </div>
                    <div className="w-[360px] p-4 flex items-center justify-center">
                      {item.mobile}
                    </div>
                    <div className="w-[360px] p-4 flex items-center justify-center font-semibold">
                      {item.totalFactor}
                    </div>
                    <div className="w-[380px] p-4 flex items-center justify-center font-semibold relative">
                      <div className="bg-[#DE4949] w-[165px] h-[35px] flex items-center justify-center text-white text-[21px] font-bold rounded-[10px]">
                        {item.totalDebt.toLocaleString("fa-IR")}
                      </div>
                      <Tooltip
                        isOpen={openTooltipId === item.id}
                        setIsOpen={(isOpen) =>
                          setOpenTooltipId(isOpen ? item.id : null)
                        }
                        position="bottom"
                        component={
                          <CreditTooltip
                            credit={item}
                            onInfo={() => handleOpenSendDebt(item.mobile)}
                            onEdit={() => setSelectedItem(item)}
                            onClose={() => setOpenTooltipId(null)}
                          />
                        }
                      >
                        <img
                          src={optionIcon}
                          alt=""
                          className="relative right-[80px] cursor-pointer"
                        />
                      </Tooltip>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-full text-gray-500">
                  {items.length === 0
                    ? "هیچ موردی یافت نشد"
                    : "در حال بارگذاری..."}
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {isDebtPaymentOpen && debtPaymentItem && (
        <DebtPaymentModal
          totalDebt={debtPaymentItem.totalDebt}
          onConfirm={handlePaymentConfirm}
          onClose={() => setIsDebtPaymentOpen(false)}
        />
      )}

      {isSendDebtOpen && sendDebtMobile && (
        <SendDebtModal
          isOpen={isSendDebtOpen}
          onClose={() => setIsSendDebtOpen(false)}
          onDelete={() => {
            setIsSendDebtOpen(false);
          }}
          mobile={sendDebtMobile}
        />
      )}

      {/* مدال‌های فرآیند پرداخت */}
      {isCartPaymentLoading && <CartPaymentLoading amount={paymentAmount} />}
      {isCartPaymentPassword && <CartPaymentPassword amount={paymentAmount} />}
      {isSuccessPaymentOpen && (
        <SuccessPaymentModal
          amount={paymentAmount}
          transactionType={paymentType === "cash" ? "نقدی" : "خرید"}
          date={transactionData.date}
          time={transactionData.time}
          trackingNumber={transactionData.trackingNumber}
          referenceNumber={transactionData.referenceNumber}
          totalAmount={debtPaymentItem?.totalDebt || 0}
          paymentType={paymentType}
        />
      )}
      {isFailedPaymentOpen && (
        <FailedPaymentModal
          amount={paymentAmount}
          transactionType="خرید"
          date={transactionData.date}
          time={transactionData.time}
          trackingNumber={transactionData.trackingNumber}
          referenceNumber={transactionData.referenceNumber}
        />
      )}
    </>
  );
};

export default Credit;
