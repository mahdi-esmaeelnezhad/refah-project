import React, { useState, useEffect } from "react";
import Input from "../Ui/Input/input";
import { Checkbox } from "../Ui/Checkbox/checkbox";
import DropDownCustom from "../Ui/DropDownCustom/DropDownCustom";
import DatePicker from "../Ui/DatePicker/DatePicker";
import useRequest from "../../hooks/useRequest";
import { useSelector } from "react-redux";
import { PRODUCT_ENDPOINTS } from "../../endpoint/product/product";
import type { RootState } from "../../store/store";

interface Product {
  id: string;
  name: string;
}

interface Category {
  id: string;
  title: string;
}

interface AddDiscountProps {
  onBack: () => void;
}

const AddDiscount: React.FC<AddDiscountProps> = ({ onBack }) => {
  const [discountName, setDiscountName] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "amount">(
    "percentage"
  );
  const [discountValue, setDiscountValue] = useState("");
  const [applyToAllInvoices, setApplyToAllInvoices] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [applyToProducts, setApplyToProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [applyToCategories, setApplyToCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // API data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);

  const { execute: itemRequest } = useRequest<any>(
    PRODUCT_ENDPOINTS.shopItems,
    "POST",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const { execute: categoryRequest } = useRequest<Category[]>(
    PRODUCT_ENDPOINTS.cacheCategoryList,
    "POST",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const shopId = localStorage.getItem("shoppId");
    if (!shopId) return;

    try {
      setIsLoadingProducts(true);
      const response = await itemRequest({
        page: 0,
        row: 1000, // Get all products
        shopId: shopId,
      });

      if (response?.data && Array.isArray(response.data)) {
        const processedProducts: Product[] = response.data.map((item: any) => ({
          id: item.id || item.itemDto?.id || "",
          name: item.name || item.itemDto?.name || "",
        }));
        setProducts(processedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    const shopId = localStorage.getItem("shoppId");
    if (!shopId) return;

    try {
      setIsLoadingCategories(true);
      const response = await categoryRequest({ shopId });

      if (response?.data && Array.isArray(response.data)) {
        const processedCategories: Category[] = response.data.map(
          (cat: any) => ({
            id: cat.id || "",
            title: cat.title || "",
          })
        );
        setCategories(processedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Close date pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".date-picker-container")) {
        setShowStartDatePicker(false);
        setShowEndDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //   const handleSubmit = () => {
  //     console.log("Discount form submitted:", {
  //       discountName,
  //       discountType,
  //       discountValue,
  //       applyToAllInvoices,
  //       startDate,
  //       endDate,
  //       applyToProducts,
  //       selectedProducts,
  //       applyToCategories,
  //       selectedCategories,
  //     });
  //   };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const persian = gregorianToPersian(date);
    return `${persian.year}/${persian.month}/${persian.day}`;
  };

  // Persian calendar conversion function
  const gregorianToPersian = (date: Date) => {
    const year = date.getFullYear();
    let persianYear = year - 621;
    let persianMonth, persianDay;

    const dayOfYear =
      Math.floor(
        (date.getTime() - new Date(year, 0, 1).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (dayOfYear < 80) {
      persianYear--;
      persianDay = dayOfYear + 286;
    } else {
      persianDay = dayOfYear - 79;
    }

    if (persianDay <= 186) {
      persianMonth = Math.ceil(persianDay / 31);
    } else {
      persianDay -= 186;
      persianMonth = 7 + Math.ceil(persianDay / 30);
    }

    return { year: persianYear, month: persianMonth, day: persianDay };
  };

  return (
    <>
      {/* Back Button */}
      <div className="flex w-full items-center mb-6 justify-end">
        <div
          onClick={onBack}
          style={{
            background: "#7485E5",
            width: "194px",
            height: "42px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            flexDirection: "row-reverse",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: "500", color: "#ffff" }}>
            بازگشت
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-6">
        {/* Discount Name */}
        <div className="flex items-center gap-4">
          <span
            style={{
              fontSize: "23px",
              fontWeight: "600",
              color: "#000",
              minWidth: "200px",
            }}
          >
            نام تخفیف:
          </span>
          <Input
            type="text"
            placeholder="نام تخفیف را وارد کنید"
            value={discountName}
            onChange={(e) => setDiscountName(e.target.value)}
            style={{
              width: "314px",
              height: "48px",
              borderRadius: "78px",
              backgroundColor: "#E7E7E7",
            }}
            placeholderStyle={{
              fontSize: "18px",
              color: "#7E7E7E",
              fontWeight: "400",
            }}
          />
        </div>

        {/* Discount Type */}
        <div className="flex items-center gap-4 mt-10">
          <span
            style={{
              fontSize: "23px",
              fontWeight: "600",
              color: "#000",
              minWidth: "200px",
            }}
          >
            نوع تخفیف:
          </span>
          <div
            style={{
              width: "400px",
              height: "48px",
              background: "#E7E7E7",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => setDiscountType("percentage")}
              style={{
                width: "50%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                borderRadius: "10px",
                justifyContent: "center",
                background:
                  discountType === "percentage" ? "#7485E5" : "transparent",
                color: discountType === "percentage" ? "#fff" : "#000",
                fontWeight: 500,
                fontSize: 16,
                cursor: "pointer",
                transition: "all 0.2s",
                userSelect: "none",
              }}
            >
              درصد
            </div>
            <div
              style={{
                width: 1,
                height: "70%",
                background: "#D1D1D1",
                alignSelf: "center",
              }}
            />
            <div
              onClick={() => setDiscountType("amount")}
              style={{
                width: "50%",
                height: "100%",
                display: "flex",
                borderRadius: "10px",
                alignItems: "center",
                justifyContent: "center",
                background:
                  discountType === "amount" ? "#7485E5" : "transparent",
                color: discountType === "amount" ? "#fff" : "#000",
                fontWeight: 500,
                fontSize: 16,
                cursor: "pointer",
                transition: "all 0.2s",
                userSelect: "none",
              }}
            >
              مبلغ
            </div>
          </div>
        </div>

        {/* Discount Value */}
        <div className="flex items-center gap-4 mt-10">
          <span
            style={{
              fontSize: "23px",
              fontWeight: "600",
              color: "#000",
              minWidth: "200px",
            }}
          >
            مقدار تخفیف:
          </span>
          <Input
            type="number"
            placeholder={
              discountType === "percentage" ? "درصد تخفیف" : "مبلغ تخفیف"
            }
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            style={{
              width: "314px",
              height: "48px",
              borderRadius: "78px",
              backgroundColor: "#E7E7E7",
            }}
            placeholderStyle={{
              fontSize: "18px",
              color: "#7E7E7E",
              fontWeight: "400",
            }}
          />
        </div>

        {/* Apply to All Invoices */}
        <div className="flex items-center gap-4 mt-10">
          <div style={{ width: "35px", height: "35px" }}>
            <Checkbox
              checked={applyToAllInvoices}
              onChange={(checked) => setApplyToAllInvoices(checked)}
            />
          </div>
          <span style={{ fontSize: "23px", fontWeight: "600", color: "#000" }}>
            اعمال بر تمامی فاکتور ها در زمانبندی از تاریخ
          </span>
          <div
            className="date-picker-container"
            style={{ position: "relative" }}
          >
            <div
              onClick={() => setShowStartDatePicker(true)}
              style={{ cursor: "pointer" }}
            >
              <Input
                type="text"
                placeholder="تاریخ شروع"
                value={formatDate(startDate)}
                onChange={() => {}}
                style={{
                  width: "198px",
                  height: "48px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              />
            </div>
            {showStartDatePicker && (
              <DatePicker
                selectedDate={startDate}
                onDateSelect={(date) => {
                  setStartDate(date);
                  setShowStartDatePicker(false);
                }}
                onClose={() => setShowStartDatePicker(false)}
                style={{
                  top: 470,
                  right: 700,
                }}
              />
            )}
          </div>
          <span style={{ fontSize: "23px", fontWeight: "600", color: "#000" }}>
            تا تاریخ
          </span>
          <div
            className="date-picker-container"
            style={{ position: "relative" }}
          >
            <div
              onClick={() => setShowEndDatePicker(true)}
              style={{ cursor: "pointer" }}
            >
              <Input
                type="text"
                placeholder="تاریخ پایان"
                value={formatDate(endDate)}
                onChange={() => {}}
                style={{
                  width: "198px",
                  height: "48px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              />
            </div>
            {showEndDatePicker && (
              <DatePicker
                selectedDate={endDate}
                onDateSelect={(date) => {
                  setEndDate(date);
                  setShowEndDatePicker(false);
                }}
                style={{
                  top: 470,
                  right: 960,
                }}
                onClose={() => setShowEndDatePicker(false)}
              />
            )}
          </div>
        </div>

        {/* Apply to Products */}
        <div className="flex items-center gap-4 mt-10">
          <div style={{ width: "35px", height: "35px" }}>
            <Checkbox
              checked={applyToProducts}
              onChange={(checked) => setApplyToProducts(checked)}
            />
          </div>
          <span style={{ fontSize: "23px", fontWeight: "600", color: "#000" }}>
            اعمال بر روی محصولات
          </span>
          {true && (
            <DropDownCustom
              options={products}
              value={selectedProducts.length > 0 ? selectedProducts[0] : null}
              onChange={(product) => setSelectedProducts([product])}
              getLabel={(product) => product.name}
              placeholder={
                isLoadingProducts ? "در حال بارگذاری..." : "انتخاب محصولات"
              }
              width={300}
              height={48}
              style={{
                backgroundColor: "#E7E7E7",
                width: "231px",
                height: "48px",
                borderRadius: "78px",
              }}
              //   inputBackgroundColor="#fff"
              disabled={isLoadingProducts}
            />
          )}
        </div>

        {/* Apply to Categories */}
        <div className="flex items-center gap-4 mt-10">
          <div style={{ width: "35px", height: "35px" }}>
            <Checkbox
              checked={applyToCategories}
              onChange={(checked) => setApplyToCategories(checked)}
            />
          </div>
          <span style={{ fontSize: "23px", fontWeight: "600", color: "#000" }}>
            اعمال بر روی دسته بندی
          </span>
          {true && (
            <DropDownCustom
              options={categories}
              value={
                selectedCategories.length > 0 ? selectedCategories[0] : null
              }
              onChange={(category) => setSelectedCategories([category])}
              getLabel={(category) => category.title}
              placeholder={
                isLoadingCategories ? "در حال بارگذاری..." : "انتخاب دسته‌بندی"
              }
              width={300}
              height={48}
              style={{
                backgroundColor: "#E7E7E7",
                width: "231px",
                height: "48px",
                borderRadius: "78px",
              }}
              //   inputBackgroundColor="#fff"
              disabled={isLoadingCategories}
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          {/* <Button
            label="ذخیره تخفیف"
            color="#7485E5"
            onClick={handleSubmit}
            style={{
              width: "200px",
              height: "48px",
              borderRadius: "15px",
              fontSize: "18px",
              fontWeight: "600",
            }}
          /> */}
        </div>
      </div>
    </>
  );
};

export default AddDiscount;
