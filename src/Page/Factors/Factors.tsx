import React, { useEffect, useState } from "react";
import FactorPrintWeb from "../../Components/FactorPrint/factorPrint";
import FactorTabs from "../../Components/Factors/FactorsTabs";
import Pagination from "../../Components/Pagination/Pagination";
import { useMemo } from "react";
import Input from "../../Components/Ui/Input/input";
import filterIcon from "../../assets/filter.svg";
import arrowDownn from "../../assets/arrow-down.svg";
import { Button } from "../../Components/Ui/Button/button";
import FactorFilter from "../../Components/FactorFilter/FactorFilter";
// import useRequest from "../../hooks/useRequest";
import { FACTOR_ENDPOINTS } from "../../endpoint/Factor/factor";
import NoShowFactorModal from "../../Components/Modal/NoShowCategoryModal";
import optionIcon from "../../assets/option.svg";
import Tooltip from "../../Components/Base/SideMenu/Tooltip";
import FactorOption from "../../Components/FactorTooltip/FactorTooltip";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import axios from "axios";

// interface ShopBizItemDto {
//   itemId: string;
//   sku: string;
//   name: string;
//   unitType: string;
//   categoryId: string;
//   price: number;
//   discount: number;
//   discountPerItem: number;
//   description: string;
//   brandId: string | null;
//   statusType: string;
//   saleCount: number;
//   totalAmount: number;
// }

// interface Customer {
//   id: string;
//   displayName: string;
//   mobile: string;
// }

// interface ShopBizPaymentDto {
//   id: string;
//   saleTxId: string;
//   status: number;
//   method: number;
//   receiveAmount: number;
//   totalAmount: number;
// }

interface Factor {
  amount: number;
  amountBeforeTax: number;
  amountPure: number;
  amountUnpure: number;
  createdDate: string; // ISO date string
  customerName: string;
  deliveryStatus: string; // احتمالاً عدد به صورت string
  deviceDate: string; // ISO date string
  gender: string; // "0" یا "1" - ممکنه بهتر باشه به enum تبدیل بشه
  hasOpinion: boolean;
  id: string;
  isBNPL: boolean;
  mobile: string;
  nationalCode: string;
  offlineCode: number;
  payableAmount: number;
  receiptCode: string;
  saleStatus: string;
  shopBizPaymentAmount: number;
  shopBizSalePaymentMethod: number;
  shopCode: string;
  shopFarsiName: string;
  shopId: string;
  subscriptionCode: number;
  tax: number;
  taxInvoiceType: string;
  totalAmount: number;
  userDiscount: number;
  userFirstName: string;
  userLastName: string;
  username: string;
}

type TabKey = "today" | "credit" | "debt" | "courier" | "canceled" | "waste";
const tabFilters: Record<TabKey, (f: Factor) => boolean> = {
  today: (f) => {
    const factorDate = f.createdDate.split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    return factorDate === today;
  },
  credit: (f) => f.shopBizSalePaymentMethod === 0,
  debt: (f) => f.shopBizSalePaymentMethod === 11,
  courier: (f) => f.deliveryStatus === "3",
  canceled: (f) => f.saleStatus === "CANCELED",
  waste: (f) => f.shopBizSalePaymentMethod === 15,
};
const pageSize = 20;
const Factors: React.FC = () => {
  const [realFactors, setRealFactors] = useState<Factor[]>([]);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [search, setSearch] = useState("");
  const [openProductTooltipId, setOpenProductTooltipId] = useState<
    string | null
  >(null);
  const [showFilter, setShowFilter] = useState(false);
  const [deleteFactor, setDeleteFactor] = useState<Factor | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    isFactorPrintOpen,
    selectedFactorForPrint,
    openFactorPrintModal,
    closeFactorPrintModal,
  } = useModal();

  const filteredFactors = useMemo(() => {
    let filtered = factors.filter(tabFilters[activeTab]);

    // Debug log for today filter

    // Apply search filter if there's a search term
    if (search.trim()) {
      filtered = filtered.filter((f) => f.receiptCode.includes(search));
    }

    return filtered;
  }, [factors, activeTab, search]);
  const pagedFactors = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredFactors.slice(startIndex, startIndex + pageSize);
  }, [filteredFactors, currentPage]);
  const totalPages = Math.ceil(filteredFactors.length / pageSize);
  const token = localStorage.getItem("token");
  const getFactors = async () => {
    const filter = {};
    const factorsRes = await axios.post(
      FACTOR_ENDPOINTS.factorList(0, 1000),
      {
        filter,
        sort: "id,desc",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Factors data:", factorsRes?.data);
    setRealFactors(factorsRes?.data);
    setFactors([...factorsRes?.data]);
    localStorage.setItem("factors", JSON.stringify(factorsRes?.data));
  };
  useEffect(() => {
    getFactors();
  }, []);
  const handleTabChange = (key: string) => {
    setActiveTab(key as TabKey);
    setCurrentPage(1);
  };
  const toPersianNumber = (number: string) => {
    return number.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };
  const toPersianNumberSeparator = (input: string | number): string => {
    const number = input.toString().replace(/,/g, "");

    const formatted = Number(number).toLocaleString("en-US");

    const persian = formatted.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

    return persian;
  };
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const productSectionMaxHeight = showFilter ? 400 : 550;
  const handleFilterApply = (filters: any) => {
    let filtered = [...realFactors]; // Start with all real factors

    // Apply tab filter first
    filtered = filtered.filter(tabFilters[activeTab]);

    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(
        (f) => new Date(f.createdDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (f) => new Date(f.createdDate) <= new Date(filters.endDate)
      );
    }
    // if (filters.minCount) {
    //   filtered = filtered.filter(
    //     (f) => f.saleCount >= parseInt(filters.minCount)
    //   );
    // }
    // if (filters.maxCount) {
    //   filtered = filtered.filter(
    //     (f) => f.saleCount <= parseInt(filters.maxCount)
    //   );
    // }
    if (filters.paymentType) {
      filtered = filtered.filter(
        (f) => f.shopBizSalePaymentMethod === filters.paymentType.id
      );
    }

    // Apply search filter if exists
    if (search.trim()) {
      filtered = filtered.filter((f) => f.receiptCode.includes(search));
    }

    setFactors(filtered);
    setCurrentPage(1);
  };
  const handleFilterReset = () => {
    setFactors([...realFactors]);
    setSearch("");
    setCurrentPage(1);
  };
  const handleShowFactor = (factor: Factor) => {
    openFactorPrintModal(factor as any);
    setOpenProductTooltipId(null);
  };
  const handleDeleteFactor = (factor: Factor) => {
    setDeleteFactor(factor);
    setIsDeleteModalOpen(true);
    setOpenProductTooltipId(null);
  };
  const submitDeleteFactor = async () => {
    if (!deleteFactor) return;
    // await axios.delete(FACTOR_ENDPOINTS.deleteFactor(deleteFactor.id), {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    setIsDeleteModalOpen(false);
    // getFactorList();
  };
  return (
    <>
      <NoShowFactorModal
        isCategoryOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onCategoryDelete={submitDeleteFactor}
        message={` آیا مایل به حذف فاکتور ${deleteFactor?.receiptCode} هستید؟`}
      />
      <div className="flex">
        <Input
          type="text"
          width={"603px"}
          height={48}
          placeholder="شماره فاکتور را جست‌وجو کنید"
          placeholderStyle={{
            fontSize: "19px",
            color: "#7E7E7E",
            fontWeight: "400",
          }}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            borderRadius: "55px",
            backgroundColor: "#fff",
            border: "2px solid #7485E5",
            marginBottom: "5px",
            marginLeft: "15px",
          }}
          value={search}
        />
        <Button
          label="فیلتر"
          color="#7485E5"
          radius={15}
          style={{
            width: "175px",
            height: "48px",
            marginLeft: "15px",
            position: "relative",
          }}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          <img
            src={filterIcon}
            style={{ position: "relative", bottom: "25px", right: "13px" }}
          />
          <img
            src={arrowDownn}
            style={{
              position: "relative",
              bottom: "48px",
              right: "108px",
              transition: "transform 0.2s",
              transform: showFilter ? "rotate(180deg)" : "rotate(0deg)",
            }}
            alt="arrow"
          />
        </Button>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {showFilter && (
        <FactorFilter
          onApply={handleFilterApply}
          onReset={handleFilterReset}
          showReset={factors.length !== realFactors.length}
        />
      )}
      <FactorTabs activeTab={activeTab} onChange={handleTabChange} />
      <section className="w-full text-right mt-8 flex flex-col gap-2 overflow-y-auto">
        <div className="flex justify-between">
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[50px]">
            #
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[310px]">
            شماره فاکتور
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[210px]">
            تاریخ
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[210px]">
            مبلغ (ریال)
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[170px]">
            تعداد اقلام
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[170px]">
            وضعیت بدهی
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[160px]">
            روش پرداخت
          </div>
        </div>
        <section
          className="overflow-y-auto relative"
          style={{
            maxHeight: productSectionMaxHeight,
            height: productSectionMaxHeight,
          }}
        >
          {pagedFactors && pagedFactors.length > 0 ? (
            pagedFactors.map((item, index) => (
              <div
                key={item.id}
                className={`flex justify-between py-1 font-21 ${
                  (index + 1) % 2 === 1 ? "bg-our-choice-200 rounded-md" : ""
                }`}
              >
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[50px]">
                  {(index + 1).toLocaleString("fa-ir")}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[310px]">
                  {toPersianNumber(item.receiptCode)}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[210px]">
                  {new Date(item.createdDate).toLocaleDateString("fa-IR")}
                </div>
                {/* <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[210px]">
                  {(() => {
                    const date = new Date(item.createdDate);
                    date.setDate(date.getDate() - 1);
                    return date.toLocaleDateString("fa-IR");
                  })()}
                </div> */}
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[210px] font-semibold">
                  {toPersianNumberSeparator(item.totalAmount)}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[170px]">
                  {/* {toPersianNumberSeparator(
                    item.shopBizItemDtoList.reduce(
                      (acc, curr) => acc + curr.saleCount,
                      0
                    )
                  )} */}
                </div>
                <div
                  className="h-[49px] p-4 rounded-md flex items-center justify-center w-[170px]"
                  style={{
                    color:
                      item.shopBizPaymentAmount < item.totalAmount
                        ? "red"
                        : "green",
                  }}
                >
                  {item.shopBizPaymentAmount < item.totalAmount
                    ? "بدهکار"
                    : "تسویه"}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[170px]">
                  <div>
                    {" "}
                    {item.shopBizSalePaymentMethod === 11
                      ? "نسیه"
                      : item.shopBizSalePaymentMethod === 4
                      ? "کارتی"
                      : item.shopBizSalePaymentMethod === 0
                      ? "اعتباری"
                      : item.shopBizSalePaymentMethod === 1
                      ? "نقدی"
                      : "ترکیبی"}
                  </div>
                  <Tooltip
                    positioning="parent"
                    top={40}
                    left={40}
                    component={
                      <FactorOption
                        factor={item}
                        onShow={() => handleShowFactor(item)}
                        onDelete={() => handleDeleteFactor(item)}
                      />
                    }
                    isOpen={openProductTooltipId === item.id}
                    setIsOpen={(isOpen) =>
                      setOpenProductTooltipId(isOpen ? item.id : null)
                    }
                  >
                    <img
                      className="relative left-[-50px] cursor-pointer"
                      style={{
                        height: "25px",
                        width: "5px",
                        marginTop: "12px",
                      }}
                      src={optionIcon}
                      alt="options"
                    />
                  </Tooltip>
                </div>
              </div>
            ))
          ) : (
            <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-full text-gray-500">
              {filteredFactors.length === 0
                ? "هیچ فاکتوری یافت نشد"
                : "در حال بارگذاری..."}
            </div>
          )}
        </section>
      </section>
      {isFactorPrintOpen && selectedFactorForPrint && (
        <FactorPrintWeb
          factordetail={selectedFactorForPrint}
          onClose={closeFactorPrintModal}
        />
      )}
    </>
  );
};
export default Factors;
