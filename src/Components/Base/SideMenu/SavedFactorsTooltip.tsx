import React from "react";
import { commaSeparator } from "../../../utils/numberToPersianWord";
import trashIcon from "../../../assets/trash.svg";

interface Factor {
  id: string;
  amount: number;
  customerName: string;
  time: string;
  products: string[];
}

interface SavedFactorsTooltipProps {
  factors: Factor[];
  onDelete: (id: string) => void;
}

const SavedFactorsTooltip: React.FC<SavedFactorsTooltipProps> = ({
  factors,
  onDelete,
}) => {
  // CSS برای custom scrollbar
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;
  // مرتب کردن فاکتورها از جدید به قدیم بر اساس زمان
  const sortedFactors = [...factors].sort((a, b) => {
    // تبدیل زمان به timestamp برای مقایسه
    const timeA = new Date(`2000-01-01 ${a.time}`).getTime();
    const timeB = new Date(`2000-01-01 ${b.time}`).getTime();
    return timeB - timeA; // از جدید به قدیم
  });

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div
        className="w-[477.5px] bg-white rounded-lg shadow-lg p-4 relative z-[9999] custom-scrollbar"
        style={{
          maxHeight: "800px",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e0 #f1f5f9",
        }}
      >
        {sortedFactors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">هیچ فاکتور ذخیره شده‌ای وجود ندارد</p>
            <p className="text-sm mt-2">
              فاکتورهای جدید در اینجا نمایش داده می‌شوند
            </p>
          </div>
        ) : (
          sortedFactors.map((factor) => (
            <div
              key={factor.id}
              className="w-[441px] bg-[#F2F2F2] rounded-[15px] p-4 mb-4"
              // style={{
              //   overflowY: "auto",
              // }}
            >
              {/* First Row */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-[17px] font-[400] text-[#1F1F1F] font-21">
                  شماره فاکتور: {factor.id}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-[17px] font-[400] text-[#1F1F1F] font-21">
                    مبلغ: {commaSeparator(factor.amount)} ریال
                  </span>
                  <img
                    src={trashIcon}
                    onClick={() => {
                      if (
                        window.confirm(
                          `آیا از حذف فاکتور شماره ${factor.id} اطمینان دارید؟`
                        )
                      ) {
                        onDelete(factor.id);
                      }
                    }}
                    alt="trash"
                    className="cursor-pointer w-6 h-6 hover:opacity-70 transition-opacity"
                    title="حذف فاکتور"
                  />
                </div>
              </div>

              {/* Second Row */}
              <div className="flex justify-between items-center mb-4 pl-20">
                <span className="text-[17px] font-[400] text-[#1F1F1F] font-21">
                  {factor.customerName}
                </span>
                <span className="text-[17px] font-[400] text-[#1F1F1F] font-21">
                  ساعت: {factor.time}
                </span>
              </div>

              {/* Divider */}
              <div className="w-[415px] h-[1px] bg-white mx-auto mb-4" />

              {/* Products Tags */}
              <div className="flex flex-wrap gap-2">
                {factor.products.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-[37px] px-5 py-2 text-[#1F1F1F] text-[17px] font-[300] font-21"
                  >
                    {product}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default SavedFactorsTooltip;
