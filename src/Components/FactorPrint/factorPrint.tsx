// FactorPrintWeb.tsx
import React from "react";
import "./factorPrint.css";
import { Button } from "../Ui/Button/button";
import closeIcon from "../../assets/close.svg";

interface ShopBizItemDto {
  itemId: string;
  sku: string;
  name: string;
  unitType: string;
  categoryId: string;
  price: number;
  discount: number;
  discountPerItem: number;
  description: string;
  brandId: string | null;
  statusType: string;
  saleCount: number;
  totalAmount: number;
}
interface Customer {
  id: string;
  displayName: string;
  mobile: string;
}
interface ShopBizPaymentDto {
  id: string;
  saleTxId: string;
  status: number;
  method: number;
  receiveAmount: number;
  totalAmount: number;
}
interface Factor {
  id: string;
  shopId: string;
  shopFarsiName: string;
  shopAddress: string;
  shopTelephoneNumber: string;
  saleStatus: string;
  deliveryStatus: string;
  offlineCode: number;
  tip: number;
  amount: number;
  totalAmount: number;
  tax: number;
  createdDate: string; // ISO date
  version: number;
  shopBizItemDtoList: ShopBizItemDto[];
  shopBizPaymentDtoList: ShopBizPaymentDto[];
  customerDto: Customer;
  hasOpinion: boolean;
  receiptCode: string;
  deviceDate: string; // ISO date
  userDiscount: number;
  shopBizSalePaymentMethod: number;
  shopBizPaymentAmount: number;
  shippingCost: number;
  isBNPL: boolean;
  taxInvoiceType: string;
}
interface Props {
  factordetail: Factor; // Directly pass the Factor object
  onClose: () => void;
}
const FactorPrintWeb: React.FC<Props> = ({ factordetail, onClose }) => {
  const factor = factordetail; // Use factordetail directly as it's already a Factor object
  const formatPrice = (price?: number) =>
    price?.toLocaleString("fa-IR") + " ریال";

  const handlePrint = () => {
    window.print();
  };

  if (!factor) return null; // Or a loading spinner, but factordetail should always be present now

  return (
    <>
      <div className="fixed inset-0 bg-[#92929280] backdrop-blur-sm z-40" />

      <section className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[999] factor-container w-[527px] h-[757px]">
        <div className="factor-header">
          <button onClick={onClose} className="close-button">
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <div className="factor-row">
          <span>شماره فاکتور: {factor.receiptCode}</span>
          <span>
            {new Date(factor.createdDate).toLocaleDateString("fa-IR")}
          </span>{" "}
          {/* Format date */}
        </div>
        <div className="factor-row">
          <span>نام مشتری: {factor.customerDto?.displayName}</span>
          <span>{factor.customerDto?.mobile}</span>
        </div>
        <div className="factor-table-header flex justify-between px-4">
          <span className="w-[25%] ">نام کالا</span>
          <span className="w-[25%]">مقدار</span>
          <span className="w-[25%]">قیمت (ریال)</span>
          <span className="w-[25%]">جمع کل (ریال)</span>
        </div>
        {factor.shopBizItemDtoList.map((item, index) => (
          <div
            className="factor-table-row flex justify-between px-4"
            key={index}
          >
            <span className=" w-[25%]">{item.name}</span>
            <span className="w-[25%] pr-4">{item.saleCount}</span>
            <span className="w-[25%] pr-2">{formatPrice(item.price)}</span>{" "}
            {/* Use item.price */}
            <span className="w-[25%] pr-2">
              {formatPrice(item.totalAmount)}
            </span>
          </div>
        ))}
        {/* <hr /> */}
        <div className="factor-summary px-4">
          <span>
            تعداد اقلام:{" "}
            {factor.shopBizItemDtoList.reduce(
              (acc, curr) => acc + curr.saleCount,
              0
            )}
          </span>{" "}
          {/* Calculate total items */}
          <span></span>
          <span>مبلغ کل:</span>
          <span>{formatPrice(factor.amount)}</span>
        </div>
        <div className="factor-summary px-4">
          <span>تخفیف:</span>
          <span>{formatPrice(factor.userDiscount)}</span>
        </div>
        <div className="factor-summary px-4">
          <span>مالیات بر ارزش افزوده:</span>
          <span>{formatPrice(factor.tax)}</span> {/* Use actual tax */}
        </div>
        <div className="factor-summary px-4">
          <span>هزینه ارسال:</span>
          <span>{formatPrice(factor.shippingCost)}</span>
        </div>
        <div className="factor-total px-4 mt-10">
          <strong>جمع مبلغ پرداختی:</strong>
          <strong>{formatPrice(factor.totalAmount)}</strong>
        </div>
        <div className="factor-debt px-4">
          <strong>بدهی این فاکتور:</strong>
          <strong>
            {formatPrice(
              factor.shopBizPaymentDtoList.find((p) => p.method === 0)
                ?.totalAmount || 0
            )}
          </strong>{" "}
          {/* Calculate debt */}
        </div>
        <div className="print-button-container mt-20 flex justify-center">
          <Button
            label="چاپ فاکتور"
            color="#7485E5"
            radius={15}
            style={{ width: "366px", height: "48px", marginTop: "20px" }}
            onClick={handlePrint}
          />
        </div>
      </section>
    </>
  );
};
export default FactorPrintWeb;
