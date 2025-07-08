import React from "react";
import { Button } from "../Ui/Button/button";

interface FactorOptionProps {
  factor: any;
  onShow: (id: string) => void;
  onDelete: (id: string) => void;
}

const FactorOption: React.FC<FactorOptionProps> = ({
  factor,
  onShow,
  onDelete,
}) => {
  return (
    <div className="w-[161px] h-[130px] bg-white rounded-lg shadow-lg py-4 pr-2 relative z-[9999]">
      <Button
        label="نمایش"
        color="#4973DE"
        radius={29}
        style={{
          width: "140px",
          height: "42px",
          fontFamily: "20px",
          fontWeight: 500,
          padding: 0,
        }}
        onClick={() => onShow(factor.id)}
      ></Button>
      <Button
        label="حذف"
        color="#DE4949"
        radius={29}
        className="mt-4"
        style={{
          width: "140px",
          height: "42px",
          fontFamily: "20px",
          fontWeight: 500,
          padding: 0,
        }}
        onClick={() => onDelete(factor.id)}
      ></Button>
    </div>
  );
};

export default FactorOption;
