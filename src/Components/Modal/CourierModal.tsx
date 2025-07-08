import React, { useState, useEffect } from "react";
import MapIcon from "../../assets/map.svg";
import closeIcon from "../../assets/close.svg";

interface CourierForm {
  name: string;
  nationalCode: string;
  phone: string;
  plate?: string;
  address?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CourierForm) => void;
  initialData?: CourierForm;
}
const labelProdeut = {
  paddingRight: 10,
  marginTop: 8,
  fontSize: 20,
  fontWeight: 500,
};
const CourierModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState<CourierForm>({
    name: "",
    nationalCode: "",
    phone: "",
    plate: "",
    address: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else
      setForm({
        name: "",
        nationalCode: "",
        phone: "",
        plate: "",
        address: "",
      });
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.nationalCode || !form.phone) return;
    onSubmit(form);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: 700,
          minHeight: 350,
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: 32,
        }}
      >
        <div className="absolute top-[10px] left-[10px]">
          <img
            src={closeIcon}
            alt="close"
            style={{ width: 32, height: 32, cursor: "pointer" }}
            onClick={onClose}
          />
        </div>
        <div
          className="flex justify-center mt-10"
          style={{ fontSize: 24, fontWeight: 600, marginBottom: 32 }}
        >
          تعریف پیک
        </div>
        <div style={{ display: "flex", gap: 32, marginBottom: 16 }}>
          <div>
            <span style={labelProdeut}>نام پیک :</span>
            <span
              style={{ color: "#DE4949", fontSize: 25, marginBottom: "20px" }}
            >
              *
            </span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="نام پیک"
              style={{
                width: 299,
                height: 55,
                borderRadius: 55,
                background: "#E7e7e7",
                border: "none",
                padding: "0 16px",
                fontSize: 18,
                marginTop: 10,
              }}
            />
          </div>
          <div>
            <span style={labelProdeut}>کد ملی :</span>
            <span
              style={{ color: "#DE4949", fontSize: 25, marginBottom: "20px" }}
            >
              *
            </span>
            <input
              name="nationalCode"
              value={form.nationalCode}
              onChange={handleChange}
              placeholder="کد ملی"
              style={{
                width: 299,
                height: 55,
                borderRadius: 55,
                background: "#E7e7e7",
                border: "none",
                padding: "0 16px",
                fontSize: 18,
                marginTop: 10,
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, marginBottom: 16 }}>
          <div>
            <span style={labelProdeut}>شماره تلفن :</span>
            <span
              style={{ color: "#DE4949", fontSize: 25, marginBottom: "20px" }}
            >
              *
            </span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="شماره تلفن"
              style={{
                width: 299,
                height: 55,
                borderRadius: 55,
                background: "#E7e7e7",
                border: "none",
                padding: "0 16px",
                fontSize: 18,
                marginTop: 10,
              }}
            />
          </div>
          <div>
            <span style={labelProdeut}>پلاک موتور :</span>
            <input
              name="plate"
              value={form.plate}
              onChange={handleChange}
              placeholder="پلاک موتور (اختیاری)"
              style={{
                width: 299,
                height: 55,
                borderRadius: 55,
                background: "#E7e7e7",
                border: "none",
                padding: "0 16px",
                fontSize: 18,
                marginTop: 10,
              }}
            />
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
          }}
        >
          <span style={labelProdeut}>آدرس :</span>
          <div className="flex items-center gap-2 mt-4">
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="آدرس (اختیاری)"
              style={{
                width: 630,
                height: 55,
                borderRadius: 55,
                background: "#E7e7e7",
                border: "none",
                padding: "0 16px",
                fontSize: 18,
              }}
            />
            <img src={MapIcon} alt="map" style={{ width: 32, height: 32 }} />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              width: 242,
              height: 48,
              border: "none",
              borderRadius: 15,
              fontSize: 20,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {initialData ? "ویرایش پیک" : "افزودن پیک"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourierModal;
