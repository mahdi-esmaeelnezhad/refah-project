import React, { useState } from "react";
import Input from "../Ui/Input/input";
import DropDownCustom from "../Ui/DropDownCustom/DropDownCustom";
import { Button } from "../Ui/Button/button";
import closeIcon from "../../assets/close.svg";

interface ProductRegistrationTooltipProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  initialData: {
    name: string;
    barcode: string;
    price: number;
    unit: string;
  };
}

const ProductRegistrationTooltip: React.FC<ProductRegistrationTooltipProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialData,
}) => {
  const [form, setForm] = useState({
    name: initialData.name,
    barcode: initialData.barcode,
    category: null as any,
    brand: null as any,
    salePrice: initialData.price.toString(),
    basePrice: initialData.price.toString(),
    stock: "",
    minStock: "",
    unit: { name: initialData.unit } as any,
    description: "",
    show: true,
  });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.name) newErrors.name = "این فیلد اجباری است";
    if (!form.barcode) newErrors.barcode = "این فیلد اجباری است";
    if (!form.category) newErrors.category = "این فیلد اجباری است";
    if (!form.brand) newErrors.brand = "این فیلد اجباری است";
    if (!form.salePrice) newErrors.salePrice = "این فیلد اجباری است";
    if (!form.basePrice) newErrors.basePrice = "این فیلد اجباری است";
    return newErrors;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onAdd(form);
    handleCancel();
  };

  const handleCancel = () => {
    setForm({
      name: initialData.name,
      barcode: initialData.barcode,
      category: null as any,
      brand: null as any,
      salePrice: initialData.price.toString(),
      basePrice: initialData.price.toString(),
      stock: "",
      minStock: "",
      unit: { name: initialData.unit } as any,
      description: "",
      show: true,
    });
    setErrors({});
    onClose();
  };

  const labelProduct = {
    paddingRight: 10,
    marginTop: 8,
    fontSize: 20,
    fontWeight: 500,
  };

  // Sample data for dropdowns
  const categories = [
    { categoryId: "1", categoryName: "دسته‌بندی ۱" },
    { categoryId: "2", categoryName: "دسته‌بندی ۲" },
    { categoryId: "3", categoryName: "دسته‌بندی ۳" },
  ];
  const brands = ["برند نمونه ۱", "برند نمونه ۲", "برند نمونه ۳"];
  const units = ["عدد", "کیلوگرم", "گرم", "لیتر"];

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        width: "1515px",
        background: "#fff",
        borderRadius: 8,
        zIndex: 1000,
        padding: 40,
        boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 700 }}>تعریف کالا</span>
        <img
          src={closeIcon}
          alt="close"
          style={{ cursor: "pointer" }}
          onClick={handleCancel}
        />
      </div>

      {/* Form Rows */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}
      >
        {/* Row 1 */}
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ flex: 1 }}>
            <span style={labelProduct}>نام کالا :</span>
            <span
              style={{ color: "#DE4949", fontSize: 25, marginBottom: "20px" }}
            >
              *
            </span>
            <Input
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
              width={299}
              height={48}
              placeholder="نام کالا"
              placeholderStyle={{
                color: "#7E7E7E",
                fontSize: 17,
                fontWeight: 500,
              }}
              style={{ borderRadius: 55, background: "#E7E7E7" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <span style={labelProduct}>بارکد :</span>
            <span
              style={{ color: "#DE4949", fontSize: 25, marginBottom: "20px" }}
            >
              *
            </span>
            <Input
              required
              value={form.barcode}
              onChange={(e) => handleChange("barcode", e.target.value)}
              error={errors.barcode}
              width={299}
              height={48}
              placeholder="بارکد"
              placeholderStyle={{
                color: "#7E7E7E",
                fontSize: 17,
                fontWeight: 500,
              }}
              style={{ borderRadius: 55, background: "#E7E7E7" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <span style={labelProduct}>دسته‌بندی :</span>
            <DropDownCustom
              options={categories}
              value={form.category}
              borderRadius={55}
              onChange={(v) => handleChange("category", v)}
              getLabel={(o) => o.categoryName}
              placeholder="دسته‌بندی"
              width={299}
              height={48}
              style={{ borderRadius: 15 }}
              inputBackgroundColor="#E7E7E7"
            />
            {errors.category && (
              <div
                style={{
                  color: "#DE4949",
                  fontSize: 20,
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                {errors.category}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <span style={labelProduct}>برند :</span>
            <span
              style={{ color: "#DE4949", fontSize: 25, marginBottom: "20px" }}
            >
              *
            </span>
            <DropDownCustom
              options={brands.map((b) => ({ name: b }))}
              value={form.brand}
              borderRadius={55}
              onChange={(v) => handleChange("brand", v)}
              getLabel={(o) => o.name}
              placeholder="برند"
              width={299}
              height={48}
              style={{ borderRadius: 15 }}
              inputBackgroundColor="#E7E7E7"
            />
            {errors.brand && (
              <div
                style={{
                  color: "#DE4949",
                  fontSize: 20,
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                {errors.brand}
              </div>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ flex: 1 }}>
            <span style={labelProduct}>قیمت فروش (ریال) :</span>
            <span
              style={{ color: "#DE4949", fontSize: 25, marginBottom: "20px" }}
            >
              *
            </span>
            <Input
              required
              value={form.salePrice}
              onChange={(e) => handleChange("salePrice", e.target.value)}
              error={errors.salePrice}
              width={299}
              height={48}
              placeholder="قیمت فروش"
              placeholderStyle={{
                color: "#7E7E7E",
                fontSize: 17,
                fontWeight: 500,
              }}
              style={{ borderRadius: 55, background: "#E7E7E7" }}
              type="number"
            />
          </div>
          <div style={{ flex: 1 }}>
            <span style={labelProduct}>قیمت اولیه (ریال) :</span>
            <span
              style={{ color: "#DE4949", fontSize: 25, marginBottom: "20px" }}
            >
              *
            </span>
            <Input
              required
              value={form.basePrice}
              onChange={(e) => handleChange("basePrice", e.target.value)}
              error={errors.basePrice}
              width={299}
              height={48}
              placeholder="قیمت اولیه"
              placeholderStyle={{
                color: "#7E7E7E",
                fontSize: 17,
                fontWeight: 500,
              }}
              style={{ borderRadius: 55, background: "#E7E7E7" }}
              type="number"
            />
          </div>
          <div style={{ flex: 1 }}>
            <span style={labelProduct}>موجودی :</span>
            <Input
              value={form.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              width={299}
              height={48}
              placeholder="موجودی"
              placeholderStyle={{
                color: "#7E7E7E",
                fontSize: 17,
                fontWeight: 500,
              }}
              style={{ borderRadius: 55, background: "#E7E7E7" }}
              type="number"
            />
          </div>
          <div style={{ flex: 1 }}>
            <span style={labelProduct}>حداقل موجودی (دریافت اعلان) : </span>
            <Input
              value={form.minStock}
              onChange={(e) => handleChange("minStock", e.target.value)}
              width={299}
              height={48}
              placeholder="حداقل موجودی"
              placeholderStyle={{
                color: "#7E7E7E",
                fontSize: 17,
                fontWeight: 500,
              }}
              style={{ borderRadius: 55, background: "#E7E7E7" }}
              type="number"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ flex: 1 }}>
            <span style={labelProduct}>واحد : </span>
            <DropDownCustom
              options={units.map((u) => ({ name: u }))}
              borderRadius={55}
              value={form.unit}
              onChange={(v) => handleChange("unit", v)}
              getLabel={(o) => o.name}
              placeholder="واحد"
              width={299}
              height={48}
              style={{ borderRadius: 15 }}
              inputBackgroundColor="#E7E7E7"
            />
          </div>
          <div style={{ flex: 3 }}>
            <span style={labelProduct}>توضیحات :</span>
            <Input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              width="100%"
              height={48}
              placeholder="توضیحات"
              placeholderStyle={{
                color: "#7E7E7E",
                fontSize: 17,
                fontWeight: 500,
              }}
              style={{ borderRadius: 55, background: "#E7E7E7" }}
            />
          </div>
        </div>
      </div>

      {/* Checkbox and Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 32,
          gap: 16,
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 18,
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          <input
            type="checkbox"
            checked={form.show}
            onChange={(e) => handleChange("show", e.target.checked)}
            style={{ marginLeft: 8, width: 18, height: 18 }}
          />
          نمایش کالا
        </label>
        <Button
          label="افزودن کالا"
          color="#7485E5"
          radius={15}
          style={{ width: 242, height: 48, fontSize: 20, fontWeight: 600 }}
          onClick={handleSubmit}
        />
        <Button
          label="انصراف"
          color="#DE4949"
          radius={15}
          style={{ width: 242, height: 48, fontSize: 20, fontWeight: 600 }}
          onClick={handleCancel}
        />
      </div>
    </div>
  );
};

export default ProductRegistrationTooltip;
