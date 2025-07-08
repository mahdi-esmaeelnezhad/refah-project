import React, { useState, useEffect } from "react";
import CourierModal from "../Modal/CourierModal";
import editPaykIcon from "../../assets/editPayk.svg";
import addIcon from "../../assets/add.svg";
import { DialPad } from "../Base/SideMenu/DialPad";
import Tooltip from "../Base/SideMenu/Tooltip";
import SuccessModal from "../Modal/SuccessModal";
import { formatPersianNumber } from "../../utils/numberToPersianWord";

interface Courier {
  id: string;
  name: string;
  nationalCode: string;
  phone: string;
  plate?: string;
  address?: string;
}

const COURIERS_KEY = "couriers";
const FIXED_COST_KEY = "courier_fixed_cost";

const CouriersSettings: React.FC = () => {
  const [couriers, setCouriers] = useState<Courier[]>(() => {
    const saved = localStorage.getItem(COURIERS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editCourier, setEditCourier] = useState<Courier | null>(null);

  const [fixedCost, setFixedCost] = useState(() => {
    const cost = localStorage.getItem(FIXED_COST_KEY);
    return cost ? formatPersianNumber(cost) : "";
  });
  const [dialPadOpen, setDialPadOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(COURIERS_KEY, JSON.stringify(couriers));
  }, [couriers]);

  useEffect(() => {
    localStorage.setItem(FIXED_COST_KEY, fixedCost.replace(/[^\d]/g, ""));
  }, [fixedCost]);

  const handleAdd = (data: any) => {
    setCouriers([...couriers, { ...data, id: Date.now().toString() }]);
  };

  const handleEdit = (data: any) => {
    setCouriers(
      couriers.map((c) => (c.id === editCourier?.id ? { ...c, ...data } : c))
    );
    setEditCourier(null);
  };

  const handleFixedCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^۰-۹0-9]/g, "");
    value = value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
    setFixedCost(formatPersianNumber(value));
  };

  const handleFixedCostSubmit = () => {
    const englishValue = fixedCost
      .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
      .replace(/,/g, "");
    setFixedCost(formatPersianNumber(englishValue));
    localStorage.setItem(FIXED_COST_KEY, englishValue);
    setSuccessModal(true);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: 383,
          background: "#EFEFEF",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <div
          style={{
            paddingLeft: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 197,
              height: 48,
              background: "#D1D1D1",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 20,
            }}
          >
            مدیریت پیک‌ها
          </div>
          <button
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              width: 281,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              gap: 8,
              cursor: "pointer",
            }}
            onClick={() => {
              setModalOpen(true);
              setEditCourier(null);
            }}
          >
            <img src={addIcon} alt="add" style={{ width: 24, height: 24 }} />
            افزودن پیک
          </button>
        </div>
        {/* جدول پیک‌ها */}
        <section className="w-full text-right mt-8 flex flex-col gap-2 overflow-y-auto">
          <div className="flex justify-between">
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[50px]">
              #
            </div>
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[300px]">
              نام پیک
            </div>
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[200px]">
              شماره موبایل
            </div>
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[200px]">
              پلاک موتور
            </div>
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center min-w-[200px]">
              کد ملی
            </div>
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center min-w-[400px]">
              آدرس
            </div>
            <div className=" h-10 p-4 rounded-md flex items-center justify-center min-w-[35px]"></div>
          </div>
          <section
            className="overflow-y-auto relative"
            style={{ maxHeight: 200 }}
          >
            {couriers?.map((item, index) => (
              <div
                key={item.id}
                className={`flex justify-between py-1 font-21 ${
                  (index + 1) % 2 === 1 ? "bg-our-choice-200 rounded-md" : ""
                }`}
              >
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[50px]">
                  {(index + 1).toLocaleString("fa-ir")}
                </div>
                <div
                  className="h-[49px] p-4 rounded-md flex items-center justify-center w-[300px]"
                  style={{ textAlign: "center" }}
                >
                  {item.name}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[200px] font-semibold">
                  {item.phone}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[200px] font-semibold">
                  {item.plate}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[200px]">
                  {item.nationalCode}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[400px]">
                  {item.address}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[35px]">
                  <div>
                    <img
                      src={editPaykIcon}
                      alt="edit"
                      style={{ width: 24, height: 24, cursor: "pointer" }}
                      onClick={() => {
                        setEditCourier(item);
                        setModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>
        </section>
        <CourierModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditCourier(null);
          }}
          onSubmit={editCourier ? handleEdit : handleAdd}
          initialData={editCourier || undefined}
        />
      </div>
      <div
        style={{
          width: "100%",
          height: 166,
          background: "#EFEFEF",
          padding: 24,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          marginTop: 24,
          gap: 16,
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 600 }}>
          هزینه ثابت پیک (ریال) :
        </span>
        <div style={{ position: "relative" }}>
          <input
            value={fixedCost}
            onChange={handleFixedCostChange}
            onFocus={() => setDialPadOpen(true)}
            readOnly
            style={{
              width: 224,
              height: 45,
              borderRadius: 55,
              background: "#fff",
              border: "1px solid #E7e7e7",
              fontSize: 18,
              padding: "0 16px",
              textAlign: "center",
            }}
          />
          {dialPadOpen && (
            <div
              style={{
                position: "absolute",
                top: "-370px",
                left: 80,
                zIndex: 10,
              }}
            >
              <Tooltip
                component={
                  <DialPad
                    value={fixedCost}
                    onChange={(val: string) => setFixedCost(val)}
                    onConfirm={() => {
                      setDialPadOpen(false);
                      setFixedCost(fixedCost);
                    }}
                    onClose={() => setDialPadOpen(false)}
                  />
                }
                isOpen={dialPadOpen}
                setIsOpen={(isOpen) => {
                  if (!isOpen) {
                    setDialPadOpen(false);
                  } else {
                    setDialPadOpen(true);
                  }
                }}
                children={undefined}
              ></Tooltip>
            </div>
          )}
        </div>
        <button
          style={{
            background: "var(--color-primary)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            width: 122,
            height: 45,
            fontSize: 18,
            fontWeight: 600,
            cursor: "pointer",
            marginRight: 25,
          }}
          onClick={handleFixedCostSubmit}
        >
          تایید
        </button>
      </div>
      <SuccessModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
      />
    </>
  );
};

export default CouriersSettings;
