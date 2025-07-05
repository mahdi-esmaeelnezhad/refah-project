import React from "react";
import { Button } from "../Ui/Button/button";

interface CustomerOptionProps {
  product: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  showDelete: boolean;
}

const CustomerOption: React.FC<CustomerOptionProps> = ({
  product,
  onEdit,
  onDelete,
  showDelete,
}) => {
  return (
    <div
      className={`w-[161px] h-[${
        showDelete ? "130px" : "86px"
      }] bg-white rounded-lg shadow-lg py-4 pr-2 relative z-[9999] flex flex-col items-center justify-center`}
    >
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
        onClick={() => onEdit(product.id)}
      ></Button>

      {showDelete && (
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
          onClick={() => onDelete(product.id)}
        ></Button>
      )}
    </div>
  );
};

export default CustomerOption;
