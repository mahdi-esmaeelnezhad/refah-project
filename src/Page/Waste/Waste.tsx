import React, { useState } from "react";
import { Button } from "../../Components/Ui/Button/button";
import Input from "../../Components/Ui/Input/input";
import { CloseSmIcon } from "../../Components/icons";
import {
  commaSeparator,
  numberToPersianToman,
} from "../../utils/numberToPersianWord";
import Tooltip from "../../Components/Base/SideMenu/Tooltip";
import { DialPad } from "../../Components/Base/SideMenu/DialPad";
import NoBarcodeModal from "../../Components/Modal/NoBarcodeModal";
import { useModal } from "../../hooks/useModal";
import DeleteModal from "../../Components/Modal/DeleteModal";
import CartPaymentModal from "../../Components/Modal/CartPaymentModal";
import CartPaymentLoading from "../../Components/Modal/CartPaymentLoading";
import CartPaymentPassword from "../../Components/Modal/CartPaymentPassword";
import SuccessPaymentModal from "../../Components/Modal/SuccessPaymentModal";
import FailedPaymentModal from "../../Components/Modal/FailedPaymentModal";
import editIcon from "../../assets/edit.svg";
import closeIcon from "../../assets/close.svg";

interface WasteItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  originalPrice: number;
  salePrice: number;
  total: number;
}

const Waste: React.FC = () => {
  const { isOpen, barcode, closeModal, openCartPayment } = useModal();
  const [paymentMethod, setPaymentMethod] = useState("کارتی");
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] =
    useState<WasteItem | null>(null);
  const [newSalePrice, setNewSalePrice] = useState("");
  const [items, setItems] = useState<WasteItem[]>(
    [...Array(50)].map((_, index) => ({
      id: index + 1,
      name: "بستنی کالا",
      quantity: "1",
      unit: "عدد",
      originalPrice: 120000,
      salePrice: 80000,
      total: 80000,
    }))
  );
  const [tempQuantity, setTempQuantity] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceNumber] = useState("256");
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Calculate totals
  const totalItems = items.length;
  const totalAmount = items.reduce((sum, item) => {
    const quantity = parseInt(item.quantity) || 0;
    return sum + item.originalPrice * quantity;
  }, 0);

  const finalAmount = items.reduce((sum, item) => {
    const quantity = parseInt(item.quantity) || 0;
    return sum + item.salePrice * quantity;
  }, 0);

  const handleModalSubmit = (data: { productName: string; price: string }) => {
    closeModal();
    console.log(data);
  };

  const handleQuantityClick = (itemId: number, currentQuantity: string) => {
    setSelectedItemId(itemId);
    setTempQuantity(currentQuantity);
    setOpenTooltipId(itemId);
  };

  const handleQuantityChange = (newValue: string) => {
    setTempQuantity(newValue);

    if (selectedItemId !== null && newValue) {
      setItems(
        items.map((item) => {
          if (item.id === selectedItemId) {
            const newQuantity = parseFloat(newValue);
            return {
              ...item,
              quantity: newValue,
              total: item.salePrice * newQuantity,
            };
          }
          return item;
        })
      );
    }
  };

  const handleQuantityConfirm = () => {};

  const handleDialPadClose = () => {
    setOpenTooltipId(null);
    setSelectedItemId(null);
    setTempQuantity("");
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEditPrice = (item: WasteItem) => {
    setSelectedItemForEdit(item);
    setNewSalePrice(item.salePrice.toString());
    setIsEditPriceModalOpen(true);
  };

  const handleEditPriceConfirm = () => {
    if (selectedItemForEdit && newSalePrice) {
      setItems(
        items.map((item) => {
          if (item.id === selectedItemForEdit.id) {
            const newPrice = parseFloat(newSalePrice);
            return {
              ...item,
              salePrice: newPrice,
              total: newPrice * parseFloat(item.quantity),
            };
          }
          return item;
        })
      );
    }
    setIsEditPriceModalOpen(false);
    setSelectedItemForEdit(null);
    setNewSalePrice("");
  };

  const handlePayment = () => {
    openCartPayment();
  };

  const handleCartPaymentConfirm = (amount: number) => {
    setPaymentAmount(amount);
  };

  return (
    <>
      <style>
        {`
        ._inputWrapper_uxij4_18 {
          padding: 0px !important;
          padding-right: 16px !important;
          height: 48px !important;
        }
        ._tagButton_uxij4_53 {
          height: 48px !important;
          border-radius:55px 0px 0px 55px !important;
          width: 130px !important;
        }
      `}
      </style>
      <section
        style={{
          position: "fixed",
          width: "1575px",
          height: "848px",
          left: "53px",
          top: "90px",
          zIndex: 1,
          backgroundColor: "#fff",
          padding: "30px",
        }}
      >
        <NoBarcodeModal
          isOpen={isOpen}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          barcode={barcode}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onDelete={handleDeleteConfirm}
          invoiceNumber={invoiceNumber}
        />
        <CartPaymentModal
          totalAmount={finalAmount}
          onConfirm={handleCartPaymentConfirm}
          paymentType={paymentMethod === "نقدی" ? "cash" : "card"}
        />
        <CartPaymentLoading amount={paymentAmount} />
        <CartPaymentPassword amount={paymentAmount} />
        <SuccessPaymentModal
          amount={paymentAmount}
          transactionType={paymentMethod === "نقدی" ? "نقدی" : "خرید"}
          date={new Date().toLocaleDateString("fa-IR")}
          time={new Date().toLocaleTimeString("fa-IR")}
          trackingNumber={Math.random().toString(36).substring(7)}
          referenceNumber={Math.random().toString(36).substring(7)}
          totalAmount={finalAmount}
          paymentType={paymentMethod === "نقدی" ? "cash" : "card"}
        />
        <FailedPaymentModal
          amount={paymentAmount}
          transactionType="خرید"
          date={new Date().toLocaleDateString("fa-IR")}
          time={new Date().toLocaleTimeString("fa-IR")}
          trackingNumber={Math.random().toString(36).substring(7)}
          referenceNumber={Math.random().toString(36).substring(7)}
        />
        {isEditPriceModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "15px",
                padding: "30px",
                width: "499px",
                position: "relative",
              }}
            >
              <div className="flex justify-between mb-5">
                <div
                  onClick={() => {
                    setIsEditPriceModalOpen(false);
                    setSelectedItemForEdit(null);
                    setNewSalePrice("");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img src={closeIcon} alt="close" className="w-10 h-10" />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "23px",
                    fontWeight: 500,
                    marginBottom: "20px",
                  }}
                >
                  تغییر قیمت کالا
                </div>

                <div
                  style={{
                    width: "402px",
                    height: "43px",
                    backgroundColor: "#EFEFEF",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 16px",
                    marginBottom: "20px",
                    borderRadius: "15px",
                  }}
                >
                  <span style={{ fontSize: "20px", fontWeight: 500 }}>
                    قیمت اصلی کالا:
                  </span>
                  <span style={{ fontSize: "20px", fontWeight: 500 }}>
                    {selectedItemForEdit?.originalPrice.toLocaleString("fa-IR")}{" "}
                    ریال
                  </span>
                </div>

                <div
                  style={{
                    color: "#363636",
                    fontSize: "17px",
                    fontWeight: 400,
                    marginTop: "30px",
                    marginBottom: "10px",
                  }}
                >
                  قیمت فروش کالای ضایعاتی را براساس ارزش آن وارد نمایید
                </div>

                <div
                  style={{
                    width: "402px",
                    height: "51px",
                    backgroundColor: "#D1D1D1",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 16px",
                    marginBottom: "20px",
                    borderRadius: "15px",
                  }}
                >
                  <span
                    style={{
                      color: "#000000",
                      fontSize: "20px",
                      fontWeight: 500,
                    }}
                  >
                    قیمت فروش:
                  </span>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      value={newSalePrice}
                      onChange={(e) =>
                        setNewSalePrice(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      style={{
                        width: "207px",
                        height: "36px",
                        backgroundColor: "white",
                        border: "none",
                        padding: "0 16px",
                        textAlign: "center",
                        fontSize: "20px",
                        fontWeight: 500,
                        borderRadius: "15px",
                        direction: "ltr",
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "84px",
                    marginBottom: "30px",
                  }}
                >
                  <Button
                    label="تایید"
                    color="#479E55"
                    onClick={handleEditPriceConfirm}
                    style={{
                      width: "166px",
                      height: "48px",
                      color: "white",
                      borderRadius: "15px",
                    }}
                  />
                  <Button
                    label="انصراف"
                    color="#DE4949"
                    onClick={() => {
                      setIsEditPriceModalOpen(false);
                      setSelectedItemForEdit(null);
                      setNewSalePrice("");
                    }}
                    style={{
                      width: "166px",
                      height: "48px",
                      color: "white",
                      borderRadius: "15px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items Section */}
        <div
          style={{
            position: "absolute",
            width: "1030px",
            height: "846px",
            right: 0,
            top: 0,
            background: "#FFFFFF",
            borderRadius: "10px",
          }}
          className="p-8"
        >
          <div className="flex items-center justify-between gap-8 max-h-10">
            <Input
              placeholder="بارکد کالا را وارد کنید"
              hasButton
              buttonText="ثبت بارکد"
              value=""
              onChange={() => {}}
              style={{
                width: "445px",
                borderRadius: "55px",
                border: "2px solid #7485E5",
              }}
              backgroundColor="#F8F8F8"
            />
            <Button
              label="حذف"
              color="#DE4949"
              style={{ height: 48 }}
              onClick={handleDeleteClick}
            />
          </div>

          <div className="flex items-center justify-between gap-8 max-h-10 mt-8">
            <span className="bg-[#D1D1D1] font-21 text-black px-4 py-2 rounded-md">
              فاکتور فروش ضایعات {invoiceNumber}
            </span>
            <span className="bg-[#D1D1D1] font-21 text-black px-4 py-2 rounded-md">
              تعداد اقلام {totalItems}
            </span>
          </div>

          <section className="w-full text-right mt-8 flex flex-col gap-2 overflow-y-auto h-[640px]">
            <div className="flex justify-between">
              <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center">
                #
              </div>
              <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[216px]">
                نام کالا
              </div>
              <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[108px]">
                مقدار
              </div>
              <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[86px]">
                واحد
              </div>
              <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[120px]">
                قیمت اصلی
              </div>
              <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[135px]">
                قیمت فروش
              </div>
              <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[158px]">
                جمع کل (ریال)
              </div>
            </div>
            <section className="overflow-y-auto relative">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex justify-between py-1 font-21 ${
                    item.id % 2 === 1 ? "bg-our-choice-200 rounded-md" : ""
                  }`}
                >
                  <div className="h-10 w-10 p-4 rounded-md flex items-center justify-center">
                    {item.id}
                  </div>
                  <div className="h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[216px] font-semibold">
                    {item.name}
                  </div>
                  <div className="flex items-center justify-center min-w-[108px]">
                    <Tooltip
                      component={
                        <DialPad
                          value={
                            selectedItemId === item.id
                              ? tempQuantity
                              : item.quantity
                          }
                          onChange={handleQuantityChange}
                          onConfirm={handleQuantityConfirm}
                          onClose={handleDialPadClose}
                        />
                      }
                      isOpen={openTooltipId === item.id}
                      setIsOpen={(isOpen) => {
                        if (!isOpen) {
                          setOpenTooltipId(null);
                          setSelectedItemId(null);
                          setTempQuantity("");
                        } else {
                          setOpenTooltipId(item.id);
                        }
                      }}
                    >
                      <span
                        className="bg-our-choice h-10 min-w-10 px-2 overflow-hidden flex justify-center items-center rounded-md font-semibold cursor-pointer"
                        onClick={() =>
                          handleQuantityClick(item.id, item.quantity)
                        }
                      >
                        {selectedItemId === item.id
                          ? tempQuantity
                          : item.quantity}
                      </span>
                    </Tooltip>
                  </div>
                  <div className="h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[86px]">
                    {item.unit}
                  </div>
                  <div className="h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[120px]">
                    {item.originalPrice.toLocaleString("fa-IR")}
                  </div>
                  <div className="h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[135px] relative">
                    <div
                      style={{
                        width: "135px",
                        height: "41px",
                        backgroundColor: "#DEDEDE",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      {item.salePrice.toLocaleString("fa-IR")}
                    </div>
                    <img
                      src={editIcon}
                      alt="edit"
                      style={{
                        position: "absolute",
                        left: "25px",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEditPrice(item)}
                    />
                  </div>
                  <div className="h-10 w-10 rounded-md flex items-center justify-center min-w-[158px] font-23 gap-3">
                    {item.total.toLocaleString("fa-IR")}
                    <CloseSmIcon
                      onClick={() => {
                        /* handle delete */
                      }}
                    />
                  </div>
                </div>
              ))}
            </section>
          </section>
        </div>

        {/* Invoice Section */}
        <div
          style={{
            position: "absolute",
            width: "568px",
            height: "846px",
            left: 0,
            top: 0,
            background: "#FFFFFF",
            borderRadius: "10px",
          }}
          className="p-8"
        >
          <div className="rounded-xl space-y-4 text-right">
            <div
              style={{
                width: "502px",
                height: "463px",
                backgroundColor: "#F8F8F8",
                borderRadius: "15px",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: "21px",
                  fontWeight: 600,
                  color: "black",
                  width: "100%",
                  textAlign: "start",
                }}
              >
                فاکتور ضایعات
              </div>

              <div className="flex flex-col gap-4 font-21">
                <div className="flex justify-between px-4 py-2">
                  <span>مبلغ</span>
                  <span>
                    {commaSeparator(totalAmount)}
                    <span className="mx-1 font-16">ریال</span>
                  </span>
                </div>
                <div className="flex justify-between bg-[#EFEFEF] rounded-lg px-4 py-2">
                  <span>تعداد اقلام</span>
                  <span className="font-16">{totalItems} عدد</span>
                </div>
                <div className="flex justify-between font-semibold rounded-lg px-4 py-2">
                  <span>مبلغ کل</span>
                  <span className="font-16">
                    {commaSeparator(finalAmount)} ریال
                  </span>
                </div>
              </div>
              <div
                style={{ backgroundColor: "#E7E7E7" }}
                className="flex justify-between font-semibold rounded-lg px-4 py-4"
              >
                <span>مبلغ قابل پرداخت</span>
                <span className="font-16">
                  {commaSeparator(finalAmount)} ریال
                </span>
              </div>

              <div
                style={{ marginTop: "-20px" }}
                className="text-center text-gray-600 font-19"
              >
                {numberToPersianToman(finalAmount)}
              </div>
            </div>

            <div
              style={{ marginTop: 140 }}
              className="space-y-2 border border-black rounded-xl p-6 relative"
            >
              <div className="font-semibold bg-white absolute -top-5 px-2 font-25">
                پرداخت:
              </div>
              <div className="flex gap-2 items-center justify-between font-25">
                {["کارتی", "نقدی"].map((method) => (
                  <div key={method} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`payment-${method}`}
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="w-4 h-4 accent-primary"
                    />
                    <label
                      htmlFor={`payment-${method}`}
                      className="font-21 cursor-pointer"
                    >
                      {method}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full text-white py-2 rounded-lg text-lg font-semibold min-h-[70px]"
              label={""}
              onClick={handlePayment}
            >
              پرداخت
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Waste;
