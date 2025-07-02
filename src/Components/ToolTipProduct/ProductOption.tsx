import React from "react";
import { Button } from "../Ui/Button/button";

interface ProductOptionProps {
  product: any;
  onEdit: () => void;
  onDelete: () => void;
}

const ProductOption: React.FC<ProductOptionProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-[161px] h-[130px] bg-white rounded-lg shadow-lg py-4 pr-2 relative z-[9999]">
      <Button
        label="ویرایش"
        color="#4973DE"
        radius={29}
        style={{
          width: "140px",
          height: "42px",
          fontFamily: "20px",
          fontWeight: 500,
          padding: 0,
        }}
        onClick={onEdit}
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
        onClick={onDelete}
      ></Button>
    </div>
  );
};

export default ProductOption;
