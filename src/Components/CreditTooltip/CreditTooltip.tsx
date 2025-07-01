import React from "react";
import { Button } from "../Ui/Button/button";

interface SavedFactorsTooltipProps {
  credit: any;
  onEdit: (id: string) => void;
  onInfo: (id: string) => void;
  onClose: () => void;
}

const CreditTooltip: React.FC<SavedFactorsTooltipProps> = ({
  credit,
  onEdit,
  onInfo,
  onClose,
}) => {
  return (
    <div className="w-[246px] flex flex-col gap-2 items-center justify-center h-[130px] bg-white rounded-lg shadow-lg py-4 pr-2 relative z-[999]">
      <Button
        label="نمایش"
        color="#4973DE"
        radius={29}
        style={{
          width: "195px",
          height: "42px",
          fontFamily: "20px",
          fontWeight: 500,
          padding: 0,
        }}
        onClick={() => {
          onEdit(credit.id);
          onClose();
        }}
      ></Button>
      <Button
        label="اطلاع رسانی بدهی"
        color="#7485E5"
        radius={29}
        className="mt-4"
        style={{
          width: "195px",
          height: "42px",
          fontFamily: "20px",
          fontWeight: 500,
          padding: 0,
        }}
        onClick={() => {
          onInfo(credit.id);
          onClose();
        }}
      ></Button>
    </div>
  );
};

export default CreditTooltip;
