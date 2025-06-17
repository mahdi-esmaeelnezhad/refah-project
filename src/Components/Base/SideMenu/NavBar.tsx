import { useState } from "react";
import JalaliDate from "../../../utils/helper";
import {
  CalendarIcon,
  NofiIcon,
  SavedFactorsIcon,
  WifiIcon,
  ProductsIcon,
  SearchIcon,
  CloseSmIcon,
} from "../../icons";
import Input from "../../Ui/Input/input";
import Tooltip from "./Tooltip";
import SavedFactorsTooltip from "./SavedFactorsTooltip";

export function NavBar({ children = "" }) {
  const [searchProduct, setSearchProduct] = useState("");
  const [isSavedFactorsOpen, setIsSavedFactorsOpen] = useState(false);
  const [savedFactors] = useState([
    {
      id: "234",
      amount: 4200000,
      customerName: "معصومه ده بالا",
      time: "13:59",
      products: [
        "پنیر",
        "تخم مرغ",
        "نان تست",
        "بستنی",
        "شیر",
        "کره",
        "ماست",
        "خامه",
        "کیک",
        "کنسرو",
      ],
    },
    {
      id: "235",
      amount: 1850000,
      customerName: "علی محمدی",
      time: "14:30",
      products: ["برنج", "روغن", "شکر", "چای", "قهوه"],
    },
    {
      id: "236",
      amount: 3200000,
      customerName: "مریم حسینی",
      time: "15:15",
      products: ["گوشت", "مرغ", "ماهی", "سبزیجات", "میوه"],
    },
  ]);

  const handleDeleteFactor = (id: string) => {
    console.log("Deleting factor:", id);
  };

  return (
    <>
      <section
        style={{
          position: "fixed",
          width: "1575px",
          height: "42px",
          left: "53px",
          top: "22px",
          zIndex: 10,
        }}
        className="flex items-center gap-[26px]"
      >
        {children}
        <div className="relative">
          <Tooltip
            component={
              <SavedFactorsTooltip
                factors={savedFactors}
                onDelete={handleDeleteFactor}
              />
            }
            isOpen={isSavedFactorsOpen}
            setIsOpen={setIsSavedFactorsOpen}
          >
            <span
              className="bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-3 px-4 min-w-[286px] font-23 cursor-pointer"
              onClick={() => setIsSavedFactorsOpen(!isSavedFactorsOpen)}
            >
              <SavedFactorsIcon />
              فاکتورهای ذخیره شده
              <div className="absolute -top-2 -right-2 w-[28px] h-[29px] bg-[#49CD3D] rounded-full flex items-center justify-center text-white text-[14px] font-[500] font-21">
                {savedFactors.length}
              </div>
            </span>
          </Tooltip>
        </div>

        <span
          className="bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-3 px-4 min-w-[186px] font-23"
          onClick={() => console.log("Clicked")}
        >
          <ProductsIcon />
          محصولات
        </span>

        <Input
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          placeholder="کالای مورد نظر خود را جستجو کنید"
          style={{ minWidth: "484px", marginBottom: 0 }}
          icon={<SearchIcon />}
          height={42}
        />

        <span
          className="bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-3 font-23 px-4 min-w-36"
          onClick={() => console.log("Clicked")}
        >
          <NofiIcon />
          اعلانات
        </span>

        <span
          className="bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-4 font-23 px-4  min-w-[302px]"
          onClick={() => console.log("Clicked")}
        >
          <JalaliDate />
          <CalendarIcon />
        </span>

        <span
          className="bg-primary rounded-2xl h-10 w-10 p-2 flex justify-center items-center"
          onClick={() => console.log("Clicked")}
        >
          <WifiIcon />
        </span>
      </section>
    </>
  );
}
