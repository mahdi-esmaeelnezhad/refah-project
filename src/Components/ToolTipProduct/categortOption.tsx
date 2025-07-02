import React from "react";
import { Button } from "../Ui/Button/button";

interface SavedFactorsTooltipProps {
  category: any;
  onDelete: (id: string) => void;
}

const SavedFactorsTooltip: React.FC<SavedFactorsTooltipProps> = ({
  category,
  onDelete,
}) => {
  return (
    <div className="w-[161px] h-[130px] bg-white rounded-lg shadow-lg py-4 pr-2 relative z-[9999]">
      <Button
        label="عدم نمایش"
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
        onClick={() => onDelete(category.categoryId)}
      ></Button>
    </div>
  );
};

export default SavedFactorsTooltip;
