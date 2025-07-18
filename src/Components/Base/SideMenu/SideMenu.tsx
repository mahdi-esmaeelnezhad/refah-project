import { useNavigate, useLocation } from "react-router-dom";
import FactorIcon from "../../Icons/FactorIcon";
import HomeIcon from "../../Icons/HomeIcon";
import ProductsIcon from "../../Icons/ProductsIcon";
import SuperMarket from "../../Icons/SuperMarket";
import MenuItem from "./MenuItem";
import TypoImage from "../../../assets/images/typo-logo.png"; // ensure this path is correct
import { useEffect, useState } from "react";
import UnregisteredIcon from "../../Icons/UnregisterdIcon";
import WasteIcon from "../../Icons/WasteIcon";
import DiscountIcon from "../../Icons/DiscountIcon";
import CustomerIcon from "../../Icons/CustomerIcon";
import DeliveryIcon from "../../Icons/DeliveryIcon";
import CreditIcon from "../../Icons/CreditIcon";
import SettingsIcon from "../../Icons/SettingsIcon";

const menuItems = [
  { label: "صفحه نخست", icon: <HomeIcon />, path: "/dashboard" },
  { label: "فاکتور‌ها", icon: <FactorIcon />, path: "/factors" },
  { label: "محصولات", icon: <ProductsIcon />, path: "/products" },
  {
    label: "کالای ثبت نشده",
    icon: <UnregisteredIcon />,
    path: "/unregistered",
  },
  { label: "ضایعات", icon: <WasteIcon />, path: "/waste" },
  { label: "تخفیف", icon: <DiscountIcon />, path: "/discounts" },
  { label: "مشتریان", icon: <CustomerIcon />, path: "/customers" },
  { label: "ارسال با پیک", icon: <DeliveryIcon />, path: "/delivery" },
  { label: "نسیه", icon: <CreditIcon />, path: "/credit" },
  { label: "تنظیمات", icon: <SettingsIcon />, path: "/settings" },
];

export default function SideMenu() {
  const [shopInfo, setShopInfo] = useState<any>(null);
  const [unregisteredCount, setUnregisteredCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path: string) => {
    navigate(path);
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

  useEffect(() => {
    const shopInfo = localStorage.getItem("shopInfo");
    setShopInfo(JSON.parse(shopInfo || "{}"));
    loadUnregisteredCount();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      loadUnregisteredCount();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  return (
    <section className="fixed w-[246px] h-[972px] bg-[var(--color-primary)] text-white p-7 flex flex-col justify-between">
      <ul className="flex flex-col gap-[30px]">
        <MenuItem
          style={{
            textAlign: "unset",
          }}
          textClassName="font-23 text-bold gap-[0px]"
          icon={<SuperMarket />}
        >
          {shopInfo?.extraData?.shopName}
        </MenuItem>
        <hr className="border-white/20" />

        {menuItems.map(({ label, icon, path }) => {
          const isActive = location.pathname === path;
          const isUnregisteredPage = path === "/unregistered";
          const showBadge =
            isUnregisteredPage && !isActive && unregisteredCount > 0;

          return (
            <MenuItem
              key={label}
              textClassName="font-21"
              icon={icon}
              onClick={() => goTo(path)}
              className="cursor-pointer hover:text-gray-200 transition-colors relative"
              style={{ position: "relative" }}
              badge={showBadge ? unregisteredCount : undefined}
            >
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    left: "-27.5px",
                    //rotation 180deg
                    transform: "rotate(180deg)",
                    top: "-15px",
                    // transform: "translateY(-50%)",
                    width: 0,
                    height: 0,
                    borderTop: "35px solid transparent",
                    borderBottom: "35px solid transparent",
                    borderRight: "40px solid #eaeaea",
                    zIndex: 2,
                  }}
                />
              )}
              {label}
            </MenuItem>
          );
        })}
      </ul>

      <div className="text-center text-regular">
        <img src={TypoImage} alt="logo" className="mx-auto mb-1" />
        نسخه 1.2.4
      </div>
    </section>
  );
}
