import { useNavigate } from "react-router-dom";
import FactorIcon from "../../Icons/FactorIcon";
import HomeIcon from "../../Icons/HomeIcon";
import ProductsIcon from "../../Icons/ProductsIcon";
import SuperMarket from "../../Icons/SuperMarket";
import MenuItem from "./MenuItem";
import TypoImage from "../../../assets/images/typo-logo.png"; // ensure this path is correct

const menuItems = [
  { label: "صفحه نخست", icon: <HomeIcon />, path: "/dashboard" },
  { label: "فاکتور‌ها", icon: <FactorIcon />, path: "/factors" },
  { label: "محصولات", icon: <ProductsIcon />, path: "/products" },
  { label: "کالای ثبت نشده", icon: <SuperMarket />, path: "/unregistered" },
  { label: "ضایعات", icon: <SuperMarket />, path: "/waste" },
  { label: "تخفیف", icon: <SuperMarket />, path: "/discounts" },
  { label: "مشتریان", icon: <SuperMarket />, path: "/customers" },
  { label: "ارسال با پیک", icon: <SuperMarket />, path: "/delivery" },
  { label: "نسیه", icon: <SuperMarket />, path: "/credit" },
  { label: "تنظیمات", icon: <SuperMarket />, path: "/settings" },
];

export default function SideMenu() {
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path);
  };

  return (
    <section className="fixed w-[246px] h-[972px] bg-[var(--color-primary)] text-white p-7 flex flex-col justify-between">
      <ul className="flex flex-col gap-[30px]">
        <MenuItem textClassName="font-23 text-bold" icon={<SuperMarket />}>
          سوپرمارکت آبی
        </MenuItem>
        <hr className="border-white/20" />

        {menuItems.map(({ label, icon, path }) => (
          <MenuItem
            key={label}
            textClassName="font-21"
            icon={icon}
            onClick={() => goTo(path)}
            className="cursor-pointer hover:text-gray-200 transition-colors"
          >
            {label}
          </MenuItem>
        ))}
      </ul>

      <div className="text-center text-regular">
        <img src={TypoImage} alt="logo" className="mx-auto mb-1" />
        نسخه 1.2.4
      </div>
    </section>
  );
}
