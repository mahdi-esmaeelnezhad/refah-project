import { useEffect, useState } from "react";
import JalaliDate from "../../../utils/helper";
import { deleteInvoiceByNumber } from "../../../utils/invoiceService";
import {
  CalendarIcon,
  NofiIcon,
  SavedFactorsIcon,
  ProductsIcon,
  SearchIcon,
} from "../../icons";
import WifiIcon from "../../../assets/wifi.svg";
import Input from "../../Ui/Input/input";
import Tooltip from "./Tooltip";
import SavedFactorsTooltip from "./SavedFactorsTooltip";
import NotificationsTooltip from "./NotificationsTooltip";
import { useNetworkStatus } from "../../../hooks/useNetworkStatus";
import InternetDisconnectedModal from "../../Modal/InternetDisconnectedModal";

interface NavBarProps {
  children?: React.ReactNode;
  showFullNav?: boolean;
}

export function NavBar({ children = "", showFullNav = false }: NavBarProps) {
  const [searchProduct, setSearchProduct] = useState("");
  const [isSavedFactorsOpen, setIsSavedFactorsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [savedFactors, setSavedFactors] = useState<any[]>([]);
  const isOnline = useNetworkStatus();
  const [showModal, setShowModal] = useState(false);

  // تابع برای بارگذاری فاکتورهای ذخیره شده
  const loadSavedInvoices = () => {
    try {
      const savedInvoices = JSON.parse(
        localStorage.getItem("savedInvoices") || "[]"
      );

      // تبدیل فاکتورها به فرمت مورد نیاز SavedFactorsTooltip
      const formattedFactors = savedInvoices.map((invoice: any) => ({
        id: invoice.invoiceNumber,
        amount: invoice.finalAmount,
        customerName: invoice.customer.name,
        time: new Date(invoice.date).toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        products: invoice.items.map((item: any) => item.name),
      }));

      setSavedFactors(formattedFactors);
    } catch (error) {
      console.error("خطا در بارگذاری فاکتورهای ذخیره شده:", error);
      // در صورت خطا، داده‌های نمونه نمایش بده
    }
  };

  // بارگذاری فاکتورهای ذخیره شده از localStorage
  useEffect(() => {
    loadSavedInvoices();
  }, []);

  // گوش دادن به تغییرات فاکتورهای ذخیره شده
  useEffect(() => {
    const handleInvoicesUpdated = () => {
      loadSavedInvoices();
    };

    window.addEventListener("invoicesUpdated", handleInvoicesUpdated);

    return () => {
      window.removeEventListener("invoicesUpdated", handleInvoicesUpdated);
    };
  }, []);

  // Sample notifications data for badge count
  const notifications = [
    {
      id: 1,
      message: "دو عدد کالای ثبت نشده وجود دارد",
      type: "unregistered",
    },
    {
      id: 2,
      message: "سه کالا موجودی کمتر از حداقل دارند",
      type: "low_stock",
    },
    {
      id: 3,
      message: "یک کالا تاریخ انقضای نزدیک دارد",
      type: "expired",
    },
    {
      id: 4,
      message: "پرداخت فاکتور ۲۳۴ در انتظار تایید است",
      type: "payment",
    },
  ];

  const handleDeleteFactor = (id: string) => {
    const success = deleteInvoiceByNumber(id);
    if (success) {
    } else {
      console.error("خطا در حذف فاکتور");
    }
  };

  useEffect(() => {
    console.log(isOnline, "isOnline");

    if (!isOnline) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isOnline]);

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
        <div
          className="relative"
          style={{ visibility: showFullNav ? "visible" : "hidden" }}
        >
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
              <div className="absolute -top-2 -left-2 w-[28px] h-[29px] bg-[#49CD3D] rounded-full flex items-center justify-center text-white text-[14px] font-[500] font-21">
                {savedFactors.length}
              </div>
            </span>
          </Tooltip>
        </div>

        <span
          className="bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-3 px-4 min-w-[186px] font-23"
          // onClick={() => console.log("Clicked")}
          style={{ visibility: showFullNav ? "visible" : "hidden" }}
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
          height={48}
        />

        <div className="relative">
          <span
            className="bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-3 font-23 px-4 min-w-36 cursor-pointer"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <NofiIcon />
            اعلانات
            <div className="absolute -top-2 -left-2 w-[28px] h-[29px] bg-[#49CD3D] rounded-full flex items-center justify-center text-white text-[14px] font-[500] font-21">
              {notifications.length}
            </div>
          </span>
          <NotificationsTooltip
            isOpen={isNotificationsOpen}
            setIsOpen={setIsNotificationsOpen}
          />
        </div>

        <span
          className="bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-4 font-23 px-4  min-w-[302px]"
          // onClick={() => console.log("Clicked")}
        >
          <JalaliDate />
          <CalendarIcon />
        </span>

        <span
          className={`rounded-full p-2 transition-colors duration-300 ${
            isOnline ? "bg-primary" : "bg-red-500"
          }`}
        >
          <img
            src={WifiIcon}
            alt="wifi"
            style={{
              width: 24,
              height: 24,
            }}
          />
        </span>
      </section>
      <InternetDisconnectedModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
