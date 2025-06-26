import React, { useState } from "react";
import Input from "../Ui/Input/input";
import DropDownCustom from "../Ui/DropDownCustom/DropDownCustom";
import { Button } from "../Ui/Button/button";
import closeIcon from "../../assets/close.svg";
import "./modal.css";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { categoryId: string; categoryName: string }[];
  units: string[];
  brands: string[];
  onAdd: (data: any) => void;
}

const initialState = {
  name: "",
  barcode: "",
  category: null,
  brand: null,
  salePrice: "",
  basePrice: "",
  stock: "",
  minStock: "",
  unit: null,
  description: "",
  show: true,
};
const labelProdeut = {
  paddingRight: 10,
  marginTop: 8,
  fontSize: 20,
  fontWeight: 500,
};
const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  categories,
  units,
  brands,
  onAdd,
}) => {
  const [form, setForm] = useState(initialState);
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
    setForm(initialState);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <>
      <style>
        {`
        ._inputWrapper_18uty_18 {
          background-color: #E7E7E7;
        }
      `}
      </style>
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />
      <div
        className="fixed top-1/2 left-1/2 z-50 bg-white rounded-lg shadow-lg"
        style={{
          width: 1137,
          height: 637,
          transform: "translate(-50%, -50%)",
          padding: 40,
          display: "flex",
          flexDirection: "column",
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
            onClick={onClose}
          />
        </div>
        {/* Form Rows */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}
        >
          {/* Row 1 */}
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ flex: 1 }}>
              <span style={labelProdeut}>نام کالا :</span>
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
              <span style={labelProdeut}>بارکد :</span>
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
              <span style={labelProdeut}>دسته‌بندی :</span>
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
          </div>
          {/* Row 2 */}
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ flex: 1 }}>
              <span style={labelProdeut}>برند :</span>
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
            <div style={{ flex: 1 }}>
              <span style={labelProdeut}>قیمت فروش (ریال) :</span>
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
              <span style={labelProdeut}>قیمت اولیه (ریال) :</span>
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
          </div>
          {/* Row 3 */}
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ flex: 1 }}>
              <span style={labelProdeut}>موجودی :</span>

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
              <span style={labelProdeut}>حداقل موجودی (دریافت اعلان) : </span>
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
            <div style={{ flex: 1 }}>
              <span style={labelProdeut}>واحد : </span>

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
          </div>
        </div>
        {/* توضیحات و دکمه و چک باکس */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 32,
          }}
        >
          <div className="flex flex-col gap-2">
            <span style={labelProdeut}>توضیحات :</span>
            <Input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              width={638}
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: 30,
              alignItems: "center",
              gap: 8,
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
