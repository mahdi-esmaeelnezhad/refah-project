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
import ProductsTooltip from "./ProductsTooltip";
import { useNetworkStatus } from "../../../hooks/useNetworkStatus";
import InternetDisconnectedModal from "../../Modal/InternetDisconnectedModal";

interface NavBarProps {
  children?: React.ReactNode;
  showFullNav?: boolean;
  onLoadSavedFactor?: (factor: any) => void;
  onSelectProduct?: (product: any) => void; // اضافه شد
}

export function NavBar({
  children = "",
  showFullNav = false,
  onLoadSavedFactor,
  onSelectProduct,
}: NavBarProps) {
  const [searchProduct, setSearchProduct] = useState("");
  const [isSavedFactorsOpen, setIsSavedFactorsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false); // اضافه شد
  const [savedFactors, setSavedFactors] = useState<any[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  const [unregisteredCount, setUnregisteredCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const isOnline = useNetworkStatus();
  const [showModal, setShowModal] = useState(false);

  const loadSavedInvoices = () => {
    try {
      const savedInvoices = JSON.parse(
        localStorage.getItem("savedInvoices") || "[]"
      );
      setPendingInvoices(savedInvoices);
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
      setPendingInvoices([]);
      setSavedFactors([]);
    }
  };

  const loadUnregisteredCount = () => {
    try {
      const unregisteredProducts = JSON.parse(
        localStorage.getItem("unregisteredProducts") || "[]"
      );
      setUnregisteredCount(unregisteredProducts.length);
    } catch (error) {
      setUnregisteredCount(0);
    }
  };
  const toPersianNumber = (number: string) => {
    return number.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };

  const updateNotifications = () => {
    const updated = [
      {
        id: "unregistered",
        message: `${unregisteredCount} عدد کالای ثبت نشده وجود دارد`,
        type: "unregistered",
        count: unregisteredCount,
      },
      ...pendingInvoices.map((invoice: any) => ({
        id: invoice.invoiceNumber,
        message: `فاکتور ${invoice.invoiceNumber} در انتظار تایید است`,
        type: "pending_invoice",
      })),
    ];
    setNotifications(updated);
  };

  useEffect(() => {
    loadSavedInvoices();
    loadUnregisteredCount();
  }, []);

  useEffect(() => {
    const handleInvoicesUpdated = () => {
      loadSavedInvoices();
    };
    window.addEventListener("invoicesUpdated", handleInvoicesUpdated);
    return () => {
      window.removeEventListener("invoicesUpdated", handleInvoicesUpdated);
    };
  }, []);

  useEffect(() => {
    updateNotifications();
  }, [unregisteredCount, pendingInvoices]);

  useEffect(() => {
    const handleStorageChange = () => {
      loadUnregisteredCount();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isOnline]);

  const handleDeleteFactor = (id: string) => {
    const success = deleteInvoiceByNumber(id);
    if (success) {
      loadSavedInvoices();
    } else {
      console.error("خطا در حذف فاکتور");
    }
  };

  const handleLoadFactor = (factor: any) => {
    // بستن tooltip
    setIsSavedFactorsOpen(false);

    // فراخوانی تابع بارگذاری فاکتور در Content
    if (onLoadSavedFactor) {
      onLoadSavedFactor(factor);
    }

    // حذف فاکتور از لیست ذخیره شده
    handleDeleteFactor(factor.id);
  };

  const handleProductSelect = (product: any) => {
    // بستن tooltip
    setIsProductsOpen(false);

    // فراخوانی تابع انتخاب محصول در Content
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
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
          // zIndex: 10,
        }}
        className="flex items-center gap-[26px]"
      >
        {children}
        <div
          className="relative"
          style={{ visibility: showFullNav ? "visible" : "hidden" }}
        >
          <Tooltip
            top={60}
            left={1500}
            component={
              <SavedFactorsTooltip
                factors={savedFactors}
                onDelete={handleDeleteFactor}
                onLoadFactor={handleLoadFactor}
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
                {toPersianNumber(savedFactors.length.toString())}
              </div>
            </span>
          </Tooltip>
        </div>

        <div
          className="relative"
          style={{ visibility: showFullNav ? "visible" : "hidden" }}
        >
          <Tooltip
            top={60}
            left={1000}
            component={
              <ProductsTooltip
                isOpen={isProductsOpen}
                setIsOpen={setIsProductsOpen}
                onSelectProduct={handleProductSelect}
                onOpenAddProduct={() => setIsProductsOpen(false)}
              />
            }
            isOpen={isProductsOpen}
            setIsOpen={setIsProductsOpen}
          >
            <span
              className="bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-3 px-4 min-w-[286px] font-23 cursor-pointer"
              onClick={() => setIsProductsOpen(!isProductsOpen)}
            >
              <ProductsIcon />
              محصولات
            </span>
          </Tooltip>
          {/* <span
            className="bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-3 px-4 min-w-[286px] font-23 cursor-pointer"
            onClick={() => setIsProductsOpen(!isProductsOpen)}
          >
            <ProductsIcon />
            محصولات
          </span>
          <ProductsTooltip
            isOpen={isProductsOpen}
            setIsOpen={setIsProductsOpen}
            onSelectProduct={handleProductSelect}
            onOpenAddProduct={() => setIsProductsOpen(false)}
          /> */}
        </div>

        <Input
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          placeholder="کالای مورد نظر خود را جستجو کنید"
          style={{ minWidth: "384px", marginBottom: 0 }}
          icon={<SearchIcon />}
          height={48}
        />

        <div className="relative">
          <span
            className="bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-3 font-23 px-4 min-w-36 cursor-pointer"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Tooltip
              top={130}
              left={500}
              component={
                <NotificationsTooltip
                  isOpen={isNotificationsOpen}
                  setIsOpen={setIsNotificationsOpen}
                  notifications={notifications}
                  closeNotification={(id: string) => removeNotification(id)}
                />
              }
              isOpen={isNotificationsOpen}
              setIsOpen={setIsNotificationsOpen}
            >
              <span className="flex items-center gap-3">
                <NofiIcon />
                <span>اعلانات</span>
              </span>
            </Tooltip>
            <div className="absolute -top-2 -left-2 w-[28px] h-[29px] bg-[#49CD3D] rounded-full flex items-center justify-center text-white text-[14px] font-[500] font-21">
              {toPersianNumber(notifications.length.toString())}
            </div>
          </span>
        </div>

        <span className="bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-4 font-23 px-4  min-w-[302px]">
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
