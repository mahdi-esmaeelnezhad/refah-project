import React, { useState } from "react";
// import { BiBorderRadius } from "react-icons/bi";
import DropDownCustom from "../Ui/DropDownCustom/DropDownCustom";

interface ProductsFilterProps {
  categories: { categoryId: string; categoryName: string }[];
  unitTypes: string[];
  onApply: (filters: any) => void;
  onReset: () => void;
  showReset: boolean;
}

const ProductsFilter: React.FC<ProductsFilterProps> = ({
  categories = [],
  unitTypes = [],
  onApply,
  onReset,
  showReset,
}) => {
  const [brand, setBrand] = useState<{ name: string } | null>(null);
  const [category, setCategory] = useState<any>(null);
  const [discount, setDiscount] = useState("");
  const [unitType, setUnitType] = useState<any>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApply = () => {
    onApply({ brand, category, discount, unitType, minPrice, maxPrice });
  };

  const handleReset = () => {
    setBrand(null);
    setCategory(null);
    setDiscount("");
    setUnitType(null);
    setMinPrice("");
    setMaxPrice("");
    onReset();
  };

  const filterBoxStyle = {
    width: 1472,
    height: 137,
    borderRadius: 15,
    background: "#ECECEC",
    padding: 24,
    margin: "16px 0",
    display: "flex",
    flexDirection: "row" as const,
    gap: 12,
    position: "relative" as const,
  };
  const filterBoxStyleFilter = {
    width: "80%",
    flexDirection: "column" as const,
    gap: 12,
    position: "relative" as const,
  };
  const rowStyle = {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 0,
    height: 48,
    position: "relative" as const,
  };
  const filterItemStyle = {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    margin: "0 24px",
    position: "relative" as const,
  };
  const labelStyle = {
    fontSize: 19,
    fontWeight: 500,
    color: "#000",
    marginLeft: 6,
  };
  const labelStylePrice = {
    width: 100,
    fontSize: 19,
    fontWeight: 500,
    color: "#000",
    marginLeft: 6,
  };
  const inputStyle = {
    borderRadius: 55,
    width: "80%",
    height: 39,
    background: "#fff",
    border: "1px solid #D1D1D1",
    padding: "0 12px",
    fontSize: 16,
    outline: "none",
    cursor: "pointer",
  };
  const verticalLine = (
    <div
      style={{
        width: 1,
        height: 40,
        background: "#B4B4B4",
        margin: "0 16px",
        alignSelf: "center",
      }}
    />
  );

  return (
    <div style={filterBoxStyle}>
      <div style={filterBoxStyleFilter}>
        <div style={rowStyle}>
          {/* Brand */}
          <div style={filterItemStyle}>
            <label style={labelStyle}>برند</label>
            <DropDownCustom
              options={[
                { name: "برند نمونه ۱" },
                { name: "برند نمونه ۲" },
                { name: "برند نمونه ۳" },
              ]}
              value={brand}
              onChange={setBrand}
              getLabel={(o) => o.name}
              placeholder="انتخاب کنید"
              width={220}
              height={39}
              style={{ borderRadius: 15 }}
            />
          </div>
          {verticalLine}
          {/* Category */}
          <div style={filterItemStyle}>
            <label style={labelStyle}>دسته‌بندی</label>
            <DropDownCustom
              options={categories}
              value={category}
              onChange={setCategory}
              getLabel={(o) => o.categoryName}
              placeholder="انتخاب کنید"
              width={220}
              height={39}
              style={{ borderRadius: 15 }}
            />
          </div>
          {verticalLine}
          {/* Discount */}
          <div style={filterItemStyle}>
            <label style={labelStyle}>تخفیف</label>
            <input
              type="number"
              style={{ ...inputStyle, cursor: "text" }}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="میزان تخفیف (عدد)"
            />
          </div>
          {verticalLine}
          {/* Empty for alignment */}
          <div style={{ flex: 1 }} />
        </div>
        <div style={{ ...rowStyle, marginTop: 12 }}>
          {/* Unit Type */}
          <div style={filterItemStyle}>
            <label style={labelStyle}> واحد</label>
            <DropDownCustom
              options={unitTypes.map((u) => ({ name: u }))}
              value={unitType}
              onChange={setUnitType}
              getLabel={(o) => o.name}
              placeholder="انتخاب کنید"
              width={220}
              height={39}
              style={{ borderRadius: 15 }}
            />
          </div>
          {verticalLine}
          {/* Price Range */}
          <div
            style={{
              ...filterItemStyle,
              width: "400px",
              flexDirection: "row",
              gap: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <label style={labelStylePrice}>قیمت از</label>
              <input
                type="number"
                style={{ ...inputStyle, cursor: "text" }}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="حداقل"
              />
            </div>
            <div style={{ width: 16 }} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <label style={labelStyle}>تا</label>
              <input
                type="number"
                style={{ ...inputStyle, cursor: "text" }}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="حداکثر"
              />
            </div>
          </div>
          {verticalLine}
          {/* Empty for alignment */}
          <div style={{ flex: 2 }} />
          {/* Apply Button */}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handleApply}
          style={{
            width: 159,
            height: 39,
            borderRadius: 15,
            background: "#7485E5",
            color: "#fff",
            fontWeight: 500,
            fontSize: 17,
            border: "none",
            marginRight: 24,
            cursor: "pointer",
          }}
        >
          اعمال فیلتر
        </button>
        {showReset && (
          <button
            onClick={handleReset}
            style={{
              width: 159,
              height: 39,
              borderRadius: 15,
              background: "#fff",
              color: "#7485E5",
              fontWeight: 500,
              fontSize: 17,
              border: "2px solid #7485E5",
              marginTop: 12,
              marginRight: 24,
              cursor: "pointer",
            }}
          >
            لغو فیلترها
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductsFilter;
