import React, { useState, useMemo } from "react";
import { Button } from "../Ui/Button/button";
import SearchBox from "../Ui/Input/SearchBox";
import Pagination from "../Pagination/Pagination";
import addDiscountIcon from "../../assets/addDiscout.svg";

interface Discount {
  id: number;
  name: string;
  amount: number;
  status: "فعال" | "غیرفعال";
  details: string;
}

interface ProductDiscountProps {
  onAddDiscount: () => void;
}

const ProductDiscount: React.FC<ProductDiscountProps> = ({ onAddDiscount }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Fake data for discounts
  const [discounts] = useState<Discount[]>(() =>
    Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `تخفیف ${index + 1}`,
      amount: Math.floor(10000 + Math.random() * 90000),
      status: Math.random() > 0.3 ? "فعال" : "غیرفعال",
      details: `جزئیات تخفیف ${index + 1}`,
    }))
  );

  const filteredDiscounts = useMemo(() => {
    if (!searchTerm.trim()) return discounts;
    return discounts.filter((discount) =>
      discount.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [discounts, searchTerm]);

  const paginatedDiscounts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDiscounts.slice(startIndex, startIndex + pageSize);
  }, [filteredDiscounts, currentPage]);

  const totalPages = Math.ceil(filteredDiscounts.length / pageSize);

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="نام تخفیف را جستجو کنید"
            style={{
              width: "524px",
              height: "48px",
              borderRadius: "55px",
              border: "2px solid #7485E5",
              backgroundColor: "#fff",
            }}
          />
          <Button
            label=""
            color="#7485E5"
            onClick={onAddDiscount}
            style={{
              width: "231px",
              height: "48px",
              borderRadius: "15px",
              fontSize: "16px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <img src={addDiscountIcon} alt="addDiscount" />
            <span className="text-white text-[16px] font-medium">
              افزودن تخفیف
            </span>
          </Button>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <section className="w-full mt-4 flex flex-col gap-2 overflow-y-auto text-right">
        <div className="flex justify-between">
          {["#", "نام تخفیف", "مقدار تخفیف", "وضعیت", "جزئیات"].map(
            (title, i) => (
              <div
                key={i}
                className={`bg-our-choice h-10 p-4 rounded-md flex items-center justify-center ${
                  i === 0 ? "w-[50px]" : "w-[350px]"
                }`}
              >
                {title}
              </div>
            )
          )}
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
          {paginatedDiscounts.map((discount, index) => (
            <div
              key={discount.id}
              className={`flex justify-between py-1 font-21 ${
                index % 2 === 0 ? "bg-our-choice-200 rounded-md" : ""
              }`}
            >
              <div className="w-[50px] p-4 flex items-center justify-center">
                {(currentPage - 1) * pageSize + index + 1}
              </div>
              <div className="w-[350px] p-4 flex items-center justify-center">
                {discount.name}
              </div>
              <div className="w-[350px] p-4 flex items-center justify-center font-semibold">
                {discount.amount.toLocaleString("fa-IR")} ریال
              </div>
              <div className="w-[350px] p-4 flex items-center justify-center">
                <div className="px-3 py-1 rounded ">{discount.status}</div>
              </div>
              <div className="w-[350px] p-4 flex items-center justify-center">
                {discount.details}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProductDiscount;
