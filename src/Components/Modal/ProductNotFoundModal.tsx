import React, { useState } from "react";
import { Button } from "../Ui/Button/button";
import warningIcon from "../../assets/warning.svg";
import closeIcon from "../../assets/close.svg";
import Input from "../Ui/Input/input";

interface ProductNotFoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  barcode: string;
  onProductAdded?: () => void; // callback برای به‌روزرسانی صفحه
}

const ProductNotFoundModal: React.FC<ProductNotFoundModalProps> = ({
  isOpen,
  onClose,
  barcode,
  onProductAdded,
}) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  // وقتی مودال باز می‌شود، focus را از input بارکد بردار
  React.useEffect(() => {
    if (isOpen) {
      // پاک کردن focus از هر input
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [isOpen]);

  const addProductToUnregistered = () => {
    try {
      // دریافت لیست کالاهای ثبت نشده از localStorage
      const unregisteredProducts = JSON.parse(
        localStorage.getItem("unregisteredProducts") || "[]"
      );

      // ایجاد محصول جدید
      const newProduct = {
        id: Date.now(), // استفاده از timestamp به عنوان ID
        name: productName.trim(),
        barcode: barcode,
        unit: "عدد", // مقدار پیش‌فرض
        price: parseInt(productPrice.replace(/,/g, "")) || 0, // حذف کاما و تبدیل به عدد
      };

      // اضافه کردن محصول جدید به لیست
      unregisteredProducts.push(newProduct);

      // ذخیره در localStorage
      localStorage.setItem(
        "unregisteredProducts",
        JSON.stringify(unregisteredProducts)
      );

      console.log("محصول جدید اضافه شد:", newProduct);

      // پاک کردن فیلدها
      setProductName("");
      setProductPrice("");

      // بستن مودال
      onClose();

      // فراخوانی callback برای به‌روزرسانی صفحه
      if (onProductAdded) {
        onProductAdded();
      }

      // نمایش پیام موفقیت
      alert("کالا با موفقیت به لیست کالاهای ثبت نشده اضافه شد");
    } catch (error) {
      console.error("خطا در اضافه کردن محصول:", error);
      alert("خطا در ثبت کالا. لطفاً دوباره تلاش کنید");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[407px] rounded-lg p-6 max-w-md mx-4">
        <div style={{ position: "relative", top: 0, right: 330 }}>
          <img
            src={closeIcon}
            alt="close"
            style={{ cursor: "pointer" }}
            onClick={onClose}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-3 mb-4">
          <img width={55} height={55} src={warningIcon} alt="warning" />
          <p className="text-[23px] font-semibold mb-6">
            کالا با بارکد
            {barcode} تعریف نشده است.
          </p>
          {/* add input for add product */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <span className="w-full font-medium text-[20px]">نام کالا :</span>
            <Input
              style={{
                width: "299px",
                height: "48px",
                borderRadius: "55px",
              }}
              placeholder="نام کالا"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center gap-3 mb-4">
            <span className="w-full font-medium text-[20px]">
              قیمت کالا (ریال) :{" "}
            </span>
            <Input
              style={{
                width: "299px",
                height: "48px",
                borderRadius: "55px",
              }}
              placeholder="قیمت کالا (ریال)"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center mt-10 gap-3">
          <Button
            label="ثبت کالا"
            color="#7485E5"
            onClick={() => {
              if (productName.trim() && productPrice.trim()) {
                addProductToUnregistered();
              } else {
                alert("لطفاً نام و قیمت کالا را وارد کنید");
              }
            }}
            style={{
              width: "135px",
              height: "40px",
            }}
          />
          <Button
            label="بستن"
            color="#DE4949"
            onClick={onClose}
            style={{
              width: "135px",
              height: "40px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductNotFoundModal;
