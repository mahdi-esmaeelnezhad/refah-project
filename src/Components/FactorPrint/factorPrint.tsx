// FactorPrintWeb.tsx
import React, { useEffect, useState } from "react";
import "./factorPrint.css";

interface FactorItem {
  name: string;
  saleCount: number;
  totalAmount: number;
}

interface FactorData {
  receiptCode: string;
  createdDate: string;
  shopFarsiName: string;
  shopTelephoneNumber: string;
  shopBizItemDtoList: FactorItem[];
  amount: number;
  userDiscount: number;
  shippingCost: number;
  totalAmount: number;
}

interface Props {
  factorId: number | string;
  onClose: () => void;
}

const FactorPrintWeb: React.FC<Props> = ({ factorId, onClose }) => {
  const [factor, setFactor] = useState<FactorData | null>(null);

  useEffect(() => {
    // شبیه‌سازی درخواست API
    const fetchFactor = async () => {
      const fakeData: FactorData = {
        receiptCode: "12345",
        createdDate: "1403/04/01",
        shopFarsiName: "فروشگاه نمونه",
        shopTelephoneNumber: "021-12345678",
        shopBizItemDtoList: [
          { name: "کالای A", saleCount: 2, totalAmount: 50000 },
          { name: "کالای B", saleCount: 1, totalAmount: 75000 },
        ],
        amount: 125000,
        userDiscount: 5000,
        shippingCost: 10000,
        totalAmount: 130000,
      };
      setFactor(fakeData);
    };

    fetchFactor();
  }, [factorId]);

  const formatPrice = (price?: number) =>
    price?.toLocaleString("fa-IR") + " ریال";

  if (!factor) return <p>در حال بارگذاری...</p>;

  return (
    <section className="factor-container">
      <div className="factor-header">
        <button onClick={onClose} className="close-button">
          ×
        </button>
      </div>

      <div className="factor-row">
        <span>شماره فاکتور: {factor.receiptCode}</span>
        <span>{factor.createdDate}</span>
      </div>
      <div className="factor-row">
        <span>نام مشتری: {factor.shopFarsiName}</span>
        <span>{factor.shopTelephoneNumber}</span>
      </div>

      <div className="factor-table-header">
        <span>نام کالا</span>
        <span>مقدار</span>
        <span>قیمت (ریال)</span>
        <span>جمع کل (ریال)</span>
      </div>

      {factor.shopBizItemDtoList.map((item, index) => (
        <div className="factor-table-row" key={index}>
          <span>{item.name}</span>
          <span>{item.saleCount}</span>
          <span>{formatPrice(item.totalAmount)}</span>
          <span>{formatPrice(item.totalAmount)}</span>
        </div>
      ))}

      <hr />
      <div className="factor-summary">
        <span>تعداد اقلام: {factor.shopBizItemDtoList.length}</span>
        <span></span>
        <span>مبلغ کل:</span>
        <span>{formatPrice(factor.amount)}</span>
      </div>

      <div className="factor-summary">
        <span>تخفیف:</span>
        <span>{formatPrice(factor.userDiscount)}</span>
      </div>

      <div className="factor-summary">
        <span>مالیات بر ارزش افزوده:</span>
        <span>۰ ریال</span>
      </div>

      <div className="factor-summary">
        <span>هزینه ارسال:</span>
        <span>{formatPrice(factor.shippingCost)}</span>
      </div>

      <div className="factor-total">
        <strong>جمع مبلغ پرداختی:</strong>
        <strong>{formatPrice(factor.totalAmount)}</strong>
      </div>

      <div className="factor-debt">
        <strong>بدهی این فاکتور:</strong>
        <strong>۰ ریال</strong>
      </div>
    </section>
  );
};

export default FactorPrintWeb;
