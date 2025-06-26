import React from "react";

export interface Factor {
  id: number;
  receiptCode: string;
  createdDate: string;
  totalAmount: number;
  saleCount: number;
  debtStatus: "بدهکار" | "تسویه";
  paymentType: "کارت" | "نقدی" | "اعتباری" | "ترکیبی" | "نسیه";
  isCanceled: boolean;
  isWaste: boolean;
  isCourier: boolean;
}

interface Props {
  data: Factor[];
}

const FactorTable: React.FC<Props> = ({ data }) => (
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead>
      <tr style={{ backgroundColor: "#f1f1f1" }}>
        <th>#</th>
        <th>شماره فاکتور</th>
        <th>تاریخ</th>
        <th>مبلغ (ریال)</th>
        <th>تعداد اقلام</th>
        <th>وضعیت بدهی</th>
        <th>روش پرداخت</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, idx) => (
        <tr
          key={item.id}
          style={{
            backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white",
            textAlign: "center",
          }}
        >
          <td>{idx + 1}</td>
          <td>{item.receiptCode}</td>
          <td>{new Date(item.createdDate).toLocaleDateString("fa-IR")}</td>
          <td>
            {item.totalAmount
              ?.toString()
              ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </td>
          <td>{item.saleCount}</td>
          <td style={{ color: item.debtStatus === "بدهکار" ? "red" : "green" }}>
            {item.debtStatus}
          </td>
          <td>{item.paymentType}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default FactorTable;
