import React, { useEffect, useState } from "react";
import Input from "../Ui/Input/input";
import { Button } from "../Ui/Button/button";
import closeIcon from "../../assets/close.svg";
import customerIcon from "../../assets/customer.svg";
import calendarIcon from "../../assets/date.svg";
import DatePicker from "../Ui/DatePicker/DatePicker";
import "./modal.css";

interface CustomerDefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  loading?: boolean;
  isEdit?: boolean;
  initialData?: any;
  // error?: string | null;
}

const initialState = {
  id: "",
  displayName: "",
  mobile: "",
  nationalCode: "",
  gender: "زن",
  birthDate: null as Date | null,
  address: "",
  isArchive: false,
};

const labelStyle = {
  paddingRight: 10,
  marginTop: 8,
  fontSize: 20,
  fontWeight: 500,
};

const errorStyle = {
  fontSize: 15,
  fontWeight: 400,
  color: "#DE4949",
  marginTop: 4,
};

const CustomerDefinitionModal: React.FC<CustomerDefinitionModalProps> = ({
  isOpen,
  isEdit,
  onClose,
  onAdd,
  loading = false,
  initialData,
  // error = null,
}) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<any>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerAnchor, setDatePickerAnchor] =
    useState<HTMLInputElement | null>(null);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.displayName)
      newErrors.displayName = "نام مشتری را به درستی وارد نشده است.";
    if (!form.mobile)
      newErrors.mobile = "تلفن همراه را به درستی وارد نشده است.";
    if (!form.nationalCode)
      newErrors.nationalCode = "کد ملی را به درستی وارد نشده است.";
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

  const handleDateSelect = (date: Date) => {
    handleChange("birthDate", date);
    setShowDatePicker(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("fa-IR");
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isEdit && initialData) {
      console.log(initialData, "initialData");

      setForm({
        displayName: initialData.displayName || "",
        mobile: initialData.mobile || "",
        nationalCode: initialData.nationalCode || "",
        gender: initialData.gender || "زن",
        birthDate: initialData.birthDate || null,
        address: initialData.address || "",
        isArchive: initialData.isArchive || false,
        id: initialData.id || "",
      });
    } else if (!isOpen) {
      setForm(initialState);
    }
  }, [isEdit, initialData, isOpen]);

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
          width: 732,
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={customerIcon} />
            <span style={{ fontSize: 22, fontWeight: 600 }}>
              {isEdit ? "ویرایش مشتری" : "تعریف مشتری"}
            </span>
          </div>
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
          <div style={{ display: "flex", gap: 32 }}>
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>نام مشتری :</span>
              <span
                style={{ color: "#DE4949", fontSize: 25, marginBottom: "20px" }}
              >
                *
              </span>
              <Input
                required
                value={form.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                error={errors.displayName}
                width={299}
                height={48}
                placeholder="نام مشتری"
                placeholderStyle={{
                  color: "#7E7E7E",
                  fontSize: 17,
                  fontWeight: 500,
                }}
                style={{ borderRadius: 55, background: "#E7E7E7" }}
              />
              {errors.displayName && (
                <div style={errorStyle}>{errors.displayName}</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>تلفن همراه :</span>
              <span
                style={{ color: "#DE4949", fontSize: 25, marginBottom: "20px" }}
              >
                *
              </span>
              <Input
                required
                value={form.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                error={errors.mobile}
                width={299}
                height={48}
                placeholder="تلفن همراه"
                placeholderStyle={{
                  color: "#7E7E7E",
                  fontSize: 17,
                  fontWeight: 500,
                }}
                style={{ borderRadius: 55, background: "#E7E7E7" }}
              />
              {errors.mobile && <div style={errorStyle}>{errors.mobile}</div>}
            </div>
          </div>

          <div style={{ display: "flex", gap: 32 }} className="mt-10">
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>کد ملی :</span>
              <span
                style={{ color: "#DE4949", fontSize: 25, marginBottom: "20px" }}
              >
                *
              </span>
              <Input
                value={form.nationalCode}
                onChange={(e) => handleChange("nationalCode", e.target.value)}
                width={299}
                height={48}
                placeholder="کد ملی"
                placeholderStyle={{
                  color: "#7E7E7E",
                  fontSize: 17,
                  fontWeight: 500,
                }}
                style={{ borderRadius: 55, background: "#E7E7E7" }}
              />
              {errors.nationalCode && (
                <div style={errorStyle}>{errors.nationalCode}</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>جنسیت :</span>
              <div
                style={{
                  width: 310,
                  height: 48,
                  background: "#D1D1D1",
                  marginTop: 8,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <div
                  onClick={() => handleChange("gender", "زن")}
                  style={{
                    width: 155,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      form.gender === "زن" ? "#7485E5" : "transparent",
                    color: form.gender === "زن" ? "#fff" : "#000",
                    fontWeight: 500,
                    fontSize: 16,
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    userSelect: "none",
                  }}
                >
                  زن
                </div>
                <div
                  style={{
                    width: 1,
                    height: 37,
                    background: "#D1D1D1",
                    margin: "0 8px",
                    alignSelf: "center",
                  }}
                />
                <div
                  onClick={() => handleChange("gender", "مرد")}
                  style={{
                    width: 155,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      form.gender === "مرد" ? "#7485E5" : "transparent",
                    color: form.gender === "مرد" ? "#fff" : "#000",
                    fontWeight: 500,
                    fontSize: 16,
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    userSelect: "none",
                  }}
                >
                  مرد
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 32 }} className="mt-10">
            <div style={{ flex: 1, position: "relative" }}>
              <span style={labelStyle}>تاریخ تولد :</span>
              <div style={{ position: "relative" }}>
                <Input
                  value={formatDate(form.birthDate)}
                  onChange={() => {}} // Read-only
                  width={299}
                  height={48}
                  placeholder="تاریخ تولد"
                  placeholderStyle={{
                    color: "#7E7E7E",
                    fontSize: 17,
                    fontWeight: 500,
                  }}
                  style={{
                    borderRadius: 55,
                    background: "#E7E7E7",
                    cursor: "pointer",
                    paddingRight: "5px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    const inputElement = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    setDatePickerAnchor(inputElement);
                    setShowDatePicker(true);
                  }}
                />
                <img
                  src={calendarIcon}
                  alt="calendar"
                  style={{
                    position: "absolute",
                    left: 32,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const inputElement = e.currentTarget.parentElement
                      ?.previousElementSibling
                      ?.previousElementSibling as HTMLInputElement;
                    setDatePickerAnchor(inputElement);
                    setShowDatePicker(true);
                  }}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>آدرس :</span>
              <Input
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                width={299}
                height={48}
                placeholder="آدرس"
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

        {loading && (
          <div
            style={{
              color: "#7486E5",
              fontSize: 16,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            لطفاً صبر کنید...
          </div>
        )}

        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 32 }}
        >
          <Button
            label={loading ? "در حال افزودن..." : "افزودن مشتری"}
            color="#7486E5"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: 242,
              height: 48,
              borderRadius: 55,
              fontSize: 18,
              fontWeight: 500,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          />
        </div>

        {/* Date Picker */}
        {showDatePicker && datePickerAnchor && (
          <DatePicker
            selectedDate={form.birthDate}
            onDateSelect={handleDateSelect}
            onClose={() => setShowDatePicker(false)}
            anchorRef={{ current: datePickerAnchor }}
            top={-730}
            left={-637}
          />
        )}
      </div>
    </>
  );
};

export default CustomerDefinitionModal;
