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
  return (
    <div className="w-[477.5px] bg-white rounded-lg shadow-lg p-4 relative z-[9999]">
      {factors.map((factor) => (
        <div
          key={factor.id}
          className="w-[441px] bg-[#F2F2F2] rounded-[15px] p-4 mb-4"
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
                onClick={() => onDelete(factor.id)}
                alt="trash"
                className="cursor-pointer w-8 h-8 mb-4 mt-2"
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
      ))}
    </div>
  );
};

export default SavedFactorsTooltip;
