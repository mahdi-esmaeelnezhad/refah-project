import { useState } from "react";
import { Button } from "../../Ui/Button/button";
import Input from "../../Ui/Input/input";
import { Switch } from "../../Ui/switch/switch";
import { BinIcon, CloseSmIcon } from "../../icons";
import {
  commaSeparator,
  numberToPersianToman,
} from "../../../utils/numberToPersianWord";
import { Radio } from "../../Ui/Radio/radio";
import Tooltip from "./Tooltip";
import { DialPad } from "./DialPad";

interface Item {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  price: number;
  discount: string;
  total: number;
}

export function Content({ children = "" }) {
  const [deliveryMedivod, setDeliveryMedivod] = useState("حضوری");
  const [paymentMedivod, setPaymentMedivod] = useState("کارتی");
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>(
    [...Array(50)].map((_, index) => ({
      id: index + 1,
      name: "بستنی کالا",
      quantity: "1",
      unit: "عدد",
      price: 120000,
      discount: "-",
      total: 120000,
    }))
  );
  const [tempQuantity, setTempQuantity] = useState("");

  const handleQuantityClick = (itemId: number, currentQuantity: string) => {
    console.log(90);

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
              total: item.price * newQuantity,
            };
          }
          return item;
        })
      );
    }
  };

  const handleQuantityConfirm = () => {
    console.log(100);
  };

  const handleDialPadClose = () => {
    console.log(100);
    // close dial pad
    setOpenTooltipId(null);
    setSelectedItemId(null);
    setTempQuantity("");
  };

  return (
    <section
      style={{
        position: "fixed",
        width: "1575px",
        height: "848px",
        left: "53px",
        top: "100px",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          width: "988px",
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
              minWidth: "441px",
            }}
          />

          <Button label="مشتری" color="#DAA51A"></Button>
          <Button label="ذخیره" color="#4973DE"></Button>
          <Button label="حذف" color="#DE4949"></Button>
        </div>

        <div className="flex items-center justify-between gap-8 max-h-10 mt-8">
          <span className="bg-[#D1D1D1] font-21 text-black px-4 py-2 rounded-md">
            فاکتور فروش 256
          </span>
          <Input
            placeholder="معصومه ده بالا"
            value=""
            onChange={() => {}}
            style={{
              minWidth: "441px",
            }}
          />
          <span className="bg-[#D1D1D1] font-21 text-black px-4 py-2 rounded-md">
            تعداد اقلام ۳
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
              قیمت(ریال)
            </div>
            <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[108px]">
              تخفیف
            </div>
            <div className="bg-our-choice h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[158px]">
              جمع کل (ریال)
            </div>
          </div>
          <section className="overflow-y-auto">
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
                      className="bg-our-choice h-10 w-10 flex justify-center items-center rounded-md font-semibold cursor-pointer"
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
                  {item.price.toLocaleString()}
                </div>
                <div className="h-10 w-10 p-4 rounded-md flex items-center justify-center min-w-[108px]">
                  {item.discount}
                </div>
                <div className="h-10 w-10 rounded-md flex items-center justify-center min-w-[158px] font-23 gap-3">
                  {item.total.toLocaleString()}
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
          <div className="flex flex-col gap-4 font-21 bg-our-choice-100 p-4 rounded-lg">
            <div className="flex justify-between px-4 py-2">
              <span>مبلغ</span>
              <span>
                ۷۶۰,۰۰۰
                <span className="mx-1 font-16">ریال</span>
              </span>
            </div>
            <div className="flex justify-between bg-[#EFEFEF] rounded-lg px-4 py-2">
              <span>مالیات بر ارزش افزوده</span>
              <span>
                <span className="mx-1 font-16"> - ریال</span>{" "}
                <Switch
                  on={false}
                  onToggle={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </span>
            </div>
            <div className="flex justify-between  px-4 py-2">
              <span>تخفیف</span>
              <span className="flex items-center">
                <span className="mx-1">-</span>
                <BinIcon />
              </span>
            </div>
            <div className="flex justify-between bg-[#EFEFEF] rounded-lg px-4 py-2">
              <span>تعداد اقلام</span>
              <span className=" font-16">۸ عدد</span>
            </div>
            <div className="flex justify-between font-semibold rounded-lg px-4 py-2">
              <span>مبلغ کل</span>
              <span className=" font-16">۱,۲۱۰,۰۰۰ ریال</span>
            </div>
            <div className="flex justify-between text-lg font-bold bg-[#E7E7E7] rounded-lg px-4 py-2">
              <span>مبلغ قابل پرداخت</span>
              <span>
                {commaSeparator(1210000)} <span className=" font-16">ریال</span>
              </span>
            </div>
            <div className="text-center text-sm text-gray-600 font-19">
              {numberToPersianToman(1210000)}
            </div>
            <input
              type="text"
              placeholder="موبایل خریدار را جهت فاکتور دیجیتال وارد کنید"
              className="w-full border rounded-md px-3 py-2 mt-2 text-sm"
            />
          </div>

          <div className="flex justify-between items-center py-5 rounded-md">
            <span className="font-25 ml-2">تحویل:</span>
            <div className="bg-[#E7E7E7] flex justify-between items-center flex-grow rounded-lg">
              <button
                onClick={() => setDeliveryMedivod("پیک")}
                className={`flex-1 py-2 rounded-md text-sm font-medium font-23 h-12 ${
                  deliveryMedivod === "پیک"
                    ? "bg-success text-white"
                    : "bg-[#E7E7E7]"
                }`}
              >
                پیک
              </button>
              <button
                onClick={() => setDeliveryMedivod("حضوری")}
                className={`flex-1 py-2 rounded-md text-sm font-medium font-23 h-12 ${
                  deliveryMedivod === "حضوری"
                    ? "bg-success text-white"
                    : "bg-[#E7E7E7]"
                }`}
              >
                حضوری
              </button>
            </div>
          </div>

          <div className="space-y-2 border border-black rounded-xl p-6 relative">
            <div className="font-semibold bg-white absolute -top-5 px-2 font-25">
              پرداخت:
            </div>
            <div className="flex gap-2 items-center justify-between font-25">
              {["کارتی", "نقدی", "نسیه", "اعتباری"].map((medivod) => (
                <>
                  <Radio
                    name={paymentMedivod}
                    value={medivod}
                    selected={paymentMedivod === medivod}
                    onChange={() => setPaymentMedivod(medivod)}
                  >
                    {medivod}
                  </Radio>
                </>
              ))}
            </div>
          </div>

          {/* <Button
            className='w-full text-white py-2 rounded-lg text-lg font-semibold min-h-[70px]'
            label={''}
          >
            پرداخت
          </Button> */}
        </div>
      </div>
    </section>
  );
}
