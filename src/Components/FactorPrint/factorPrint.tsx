// FactorPrintWeb.tsx
import React, { useEffect, useState } from "react";
import "./factorPrint.css";
import { Button } from "../Ui/Button/button";
import closeIcon from "../../assets/close.svg";
import { FACTOR_ENDPOINTS } from "../../endpoint/Factor/factor";
import axios from "axios";

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
  let factor = factordetail;
  const [factorData, setFactorData] = useState<any>();
  const formatPrice = (price?: number) =>
    price?.toLocaleString("fa-IR") + " ریال";

  const factorDetailHandler = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(FACTOR_ENDPOINTS.factorDetail(factor.id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setFactorData(response.data);
    return response.data;
  };
  useEffect(() => {
    factorDetailHandler();
  }, [factor.id]);
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
          <span>شماره فاکتور: {factorData?.receiptCode}</span>
          <span>
            {new Date(factorData?.createdDate).toLocaleDateString("fa-IR")}
          </span>{" "}
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
        {factorData?.shopBizItemDtoList.map(
          (
            item: {
              name:
                | string
                | number
                | bigint
                | boolean
                | React.ReactElement<
                    unknown,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactPortal
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined;
              saleCount:
                | string
                | number
                | bigint
                | boolean
                | React.ReactElement<
                    unknown,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactPortal
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined;
              price: number | undefined;
              totalAmount: number | undefined;
            },
            index: React.Key | null | undefined
          ) => (
            <div
              className="factor-table-row flex justify-between px-4"
              key={index}
            >
              <span className=" w-[25%]">{item.name}</span>
              <span className="w-[25%] pr-4">{item.saleCount}</span>
              <span className="w-[25%] pr-2">
                {formatPrice(item.price)}
              </span>{" "}
              <span className="w-[25%] pr-2">
                {formatPrice(item.totalAmount)}
              </span>
            </div>
          )
        )}
        <div className="factor-summary px-4">
          <span>
            تعداد اقلام:{" "}
            {factorData?.shopBizItemDtoList.reduce(
              (acc: any, curr: { saleCount: any }) => acc + curr.saleCount,
              0
            )}
          </span>{" "}
          <span></span>
          <span>مبلغ کل:</span>
          <span>{formatPrice(factorData?.amount)}</span>
        </div>
        <div className="factor-summary px-4">
          <span>تخفیف:</span>
          <span>{formatPrice(factor.userDiscount)}</span>
        </div>
        <div className="factor-summary px-4">
          <span>مالیات بر ارزش افزوده:</span>
          <span>{formatPrice(factorData?.tax)}</span>
        </div>
        <div className="factor-summary px-4">
          <span>هزینه ارسال:</span>
          <span>{formatPrice(factorData?.shippingCost)}</span>
        </div>
        <div className="factor-total px-4 mt-10">
          <strong>جمع مبلغ پرداختی:</strong>
          <strong>{formatPrice(factorData?.totalAmount)}</strong>
        </div>
        <div className="factor-debt px-4">
          <strong>بدهی این فاکتور:</strong>
          <strong>
            {formatPrice(
              factorData?.shopBizPaymentDtoList.find(
                (p: { method: number }) => p.method === 0
              )?.totalAmount || 0
            )}
          </strong>{" "}
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
