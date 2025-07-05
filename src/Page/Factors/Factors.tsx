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
// import optionIcon from "../../assets/option.svg";
// import Tooltip from "../../Components/Base/SideMenu/Tooltip";
// import factorTooltip from "../../Components/FactorTooltip/FactorTooltip"

interface Factor {
  id: number;
  receiptCode: string;
  createdDate: string;
  totalAmount: number;
  saleCount: number;
  debtStatus: "بدهکار" | "تسویه";
  paymentType: "کارت" | "نقدی" | "اعتباری" | "ترکیبی" | "نسیه";
  isCourier: boolean;
  isCanceled: boolean;
  isWaste: boolean;
}

type TabKey = "today" | "credit" | "debt" | "courier" | "canceled" | "waste";

const tabFilters: Record<TabKey, (f: Factor) => boolean> = {
  today: (f) =>
    new Date(f.createdDate).toDateString() === new Date().toDateString(),
  credit: (f) => f.paymentType === "اعتباری",
  debt: (f) => f.paymentType === "نسیه",
  courier: (f) => f.isCourier,
  canceled: (f) => f.isCanceled,
  waste: (f) => f.isWaste,
};

const pageSize = 20;

const Factors: React.FC = () => {
  const [fakeFactors] = useState<Factor[]>(
    [...Array(150)].map((_, index) => ({
      id: index + 1,
      receiptCode: Math.random().toString(36).substring(2, 15),
      createdDate: new Date().toISOString(),
      totalAmount: Math.floor(1000000 + Math.random() * 9000000),
      saleCount: Math.floor(1 + Math.random() * 10),
      debtStatus: Math.random() < 0.5 ? "بدهکار" : "تسویه",
      paymentType:
        Math.random() < 0.2
          ? "کارت"
          : Math.random() < 0.4
          ? "نقدی"
          : Math.random() < 0.6
          ? "اعتباری"
          : Math.random() < 0.8
          ? "ترکیبی"
          : "نسیه",
      isCourier: Math.random() < 0.3,
      isCanceled: Math.random() < 0.1,
      isWaste: Math.random() < 0.05,
    }))
  );
  // const token = useSelector((state: any) => state.auth.token);

  const [factors, setFactors] = useState<Factor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFactorId, setSelectedFactorId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const filteredFactors = useMemo(() => {
    let filtered = factors.filter(tabFilters[activeTab]);
    if (filtered.length === 0 && activeTab === "today") {
      filtered = factors;
    }
    if (search.trim()) {
      filtered = factors.filter((f) => f.receiptCode.includes(search));
    }
    return filtered;
  }, [factors, activeTab, search]);

  const pagedFactors = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredFactors.slice(startIndex, startIndex + pageSize);
  }, [filteredFactors, currentPage]);

  const totalPages = Math.ceil(filteredFactors.length / pageSize);

  useEffect(() => {
    setFactors([...fakeFactors]);
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key as TabKey);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const productSectionMaxHeight = showFilter ? 450 : 600;
  const handleFilterApply = (filters: any) => {
    // Apply date range filter
    let filtered = factors.filter(tabFilters[activeTab]);

    if (filters.startDate) {
      filtered = filtered.filter(
        (f) => new Date(f.createdDate) >= filters.startDate
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (f) => new Date(f.createdDate) <= filters.endDate
      );
    }
    if (filters.minCount) {
      filtered = filtered.filter(
        (f) => f.saleCount >= parseInt(filters.minCount)
      );
    }
    if (filters.maxCount) {
      filtered = filtered.filter(
        (f) => f.saleCount <= parseInt(filters.maxCount)
      );
    }
    if (filters.paymentType) {
      filtered = filtered.filter(
        (f) => f.paymentType === filters.paymentType.name
      );
    }

    // Update the filtered factors
    setFactors(filtered);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setFactors([...fakeFactors]);
    setCurrentPage(1);
  };

  return (
    <>
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
          showReset={factors.length !== fakeFactors.length}
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
          //set max height dynamic when filteredFactors.length is less than 20
          style={{
            maxHeight: productSectionMaxHeight,
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
                  {item.receiptCode}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[210px]">
                  {new Date(item.createdDate).toLocaleDateString("fa-IR")}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[210px] font-semibold">
                  {item.totalAmount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[170px]">
                  {item.saleCount}
                </div>
                <div
                  className="h-[49px] p-4 rounded-md flex items-center justify-center w-[170px]"
                  style={{
                    color: item.debtStatus === "بدهکار" ? "red" : "green",
                  }}
                >
                  {item.debtStatus}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[170px]">
                  <div>{item.paymentType}</div>
                  {/* <Tooltip
                  component={
                    <ProductOption
                      product={item}
                      onEdit={() => handleEditProduct(item)}
                      onDelete={() => handleDeleteProduct(item)}
                    />
                  }
                  isOpen={openProductTooltipId === item.id}
                  setIsOpen={(isOpen) =>
                    setOpenProductTooltipId(isOpen ? item.id : null)
                  }
                >
                  <img
                    className="relative right-[60px] cursor-pointer"
                    style={{ height: "25px", width: "5px", marginTop: "12px" }}
                    src={optionIcon}
                    alt="options"
                  />
                </Tooltip> */}
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

      {selectedFactorId && (
        <FactorPrintWeb
          factorId={selectedFactorId}
          onClose={() => setSelectedFactorId(null)}
        />
      )}
    </>
  );
};

export default Factors;
