import React from "react";
import { Button } from "../Ui/Button/button";

interface factorInfo {
  id: number;
  factorNumber: number;
  productCount: number;
  date: Date;
  price: number;
  debt: number;
  paymentType: string;
}
interface CreditFactorProps {
  id: number;
  name: string;
  mobile: string;
  totalFactor: number;
  totalDebt: number;
  nationalitiCode: number;
  address: string;
  totalPrice: number;
  factorInfo: factorInfo[];
  onBack: () => void;
  onPayDebt: () => void;
  onSendDebt: () => void;
}
const CreditFactor: React.FC<CreditFactorProps> = ({
  name,
  mobile,
  nationalitiCode,
  address,
  totalFactor,
  totalPrice,
  totalDebt,
  factorInfo,
  onBack,
  onPayDebt,
  onSendDebt,
}) => {
  return (
    <div>
      <div className="flex justify-end">
        <Button
          label="بازگشت"
          color="#7485E5"
          radius={15}
          style={{ width: 194, height: 42, marginBottom: 24 }}
          onClick={onBack}
        />
      </div>
      <div
        className="flex p-8 flex-col gap-8 w-[1494] h-[160]"
        style={{
          backgroundColor: "#EFEFEF",
          borderRadius: "15px",
        }}
      >
        <div className="flex justify-between">
          <div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              نام مشتری :
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              {name}
            </span>
          </div>
          <div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              شماره موبایل :
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              {/* write mobile number in persian */}
              {mobile}
            </span>
          </div>
          <div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              کد ملی :
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              {nationalitiCode}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              آدرس :
            </span>
            <span
              style={{
                fontSize: "23px",
                fontWeight: 500,
              }}
            >
              {address}
            </span>
          </div>
          <div>
            <Button
              label="ویرایش مشتری"
              color="#7485E5"
              radius={15}
              style={{
                width: "226px",
                height: "42px",
                fontFamily: "23px",
                fontWeight: 600,
              }}
            />
          </div>
        </div>
      </div>
      <div
        className="flex p-8 justify-between gap-4 w-[1494] h-[61] mt-4"
        style={{
          backgroundColor: "#EFEFEF",
          borderRadius: "15px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            تعداد فاکتور :
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            {totalFactor.toLocaleString("fa-IR")}
          </span>
        </div>
        <div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            مبلغ کل فاکتور :
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            {totalPrice
              .toLocaleString("fa-IR")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
        </div>
        <div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            مبلغ بدهی :
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            {totalDebt
              .toLocaleString("fa-IR")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
        </div>
      </div>
      <div
        className="mt-4"
        style={{
          width: "100%",
          height: "50px",
          backgroundColor: "#E7E7E7",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "23px",
            fontWeight: 600,
          }}
        >
          فاکتور نسیه
        </span>
      </div>
      <section className="w-full text-right mt-4 flex flex-col gap-2 overflow-y-auto">
        <div className="flex justify-between">
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[50px]">
            #
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[150px]">
            شماره فاکتور
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[150px]">
            تعداد اقلام
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[220px]">
            تاریخ
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[220px]">
            مبلغ(ریال)
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[220px]">
            میزان بدهی (ریال)
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[220px]">
            نوع پرداخت
          </div>
        </div>
        <section
          className="overflow-y-auto relative"
          style={{
            maxHeight: 170,
          }}
        >
          {factorInfo && factorInfo.length > 0 ? (
            factorInfo.map((item, index) => (
              <div key={item.id} style={{ position: "relative" }}>
                <div
                  className={`flex justify-between py-1 font-21 ${
                    (index + 1) % 2 === 1 ? "bg-our-choice-200 rounded-md" : ""
                  }`}
                >
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[50px]">
                    {(index + 1).toLocaleString("fa-IR")}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[150px]">
                    {item.factorNumber.toLocaleString("fa-IR")}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[150px]">
                    {item.productCount.toLocaleString("fa-IR")}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[220px] font-semibold">
                    {item.date.toLocaleDateString("fa-IR")}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[220px] font-semibold">
                    {item.price
                      .toLocaleString("fa-IR")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[220px] font-semibold">
                    <div
                      style={{
                        backgroundColor: "#DE4949",
                        width: "165px",
                        height: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px",
                        padding: "5px",
                        color: "#ffffff",
                        fontSize: "21px",
                        fontWeight: 600,
                      }}
                    >
                      <span>
                        {item.debt
                          ?.toLocaleString("fa-IR")
                          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[220px] font-semibold">
                    {item.paymentType}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-full text-gray-500">
              {factorInfo.length === 0
                ? "هیچ فاکتوری یافت نشد"
                : "در حال بارگذاری..."}
            </div>
          )}
        </section>
      </section>
      <div className="flex justify-end mt-8 gap-4" style={{ marginTop: 104 }}>
        <Button
          className="flex items-center justify-center"
          label="پرداخت بدهی"
          color="#479E55"
          radius={15}
          style={{ width: 303, height: 42, marginBottom: 24 }}
          onClick={onPayDebt}
        />
        <Button
          className="flex items-center justify-center"
          label="اطلاع رسانی بدهی"
          color="#7485E5"
          radius={15}
          style={{ width: 303, height: 42, marginBottom: 24, marginRight: 16 }}
          onClick={onSendDebt}
        />
      </div>
    </div>
  );
};

export default CreditFactor;
