import React, { useState, useMemo } from "react";
import productLabel from "../../assets/productLabel.svg";
import Pagination from "../../Components/Pagination/Pagination";
import arrowDownn from "../../assets/arrow-down.svg";
import ProductRegistrationTooltip from "../../Components/Modal/ProductRegistrationTooltip";

interface Item {
  id: number;
  name: string;
  barcode: string;
  unit: string;
  price: number;
}

const pageSize = 20;

const Unregistered: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  // بارگذاری کالاهای ثبت نشده از localStorage
  React.useEffect(() => {
    try {
      const unregisteredProducts = JSON.parse(
        localStorage.getItem("unregisteredProducts") || "[]"
      );

      if (unregisteredProducts.length === 0) {
        // اگر هیچ محصولی در localStorage نیست، داده‌های نمونه ایجاد کن
        const sampleItems = [...Array(2)].map((_, index) => ({
          id: index + 1,
          name: Math.random().toString(36).substring(2, 15),
          barcode: Math.random().toString(36).substring(2, 15),
          unit: Math.random().toString(36).substring(2, 15),
          price: Math.floor(1000000 + Math.random() * 9000000),
        }));
        setItems(sampleItems);
        localStorage.setItem(
          "unregisteredProducts",
          JSON.stringify(sampleItems)
        );
      } else {
        setItems(unregisteredProducts);
      }
    } catch (error) {
      console.error("خطا در بارگذاری کالاهای ثبت نشده:", error);
      // در صورت خطا، داده‌های نمونه نمایش بده
      const sampleItems = [...Array(150)].map((_, index) => ({
        id: index + 1,
        name: Math.random().toString(36).substring(2, 15),
        barcode: Math.random().toString(36).substring(2, 15),
        unit: Math.random().toString(36).substring(2, 15),
        price: Math.floor(1000000 + Math.random() * 9000000),
      }));
      setItems(sampleItems);
    }
  }, []);

  // گوش دادن به تغییرات localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      try {
        const unregisteredProducts = JSON.parse(
          localStorage.getItem("unregisteredProducts") || "[]"
        );
        setItems(unregisteredProducts);
      } catch (error) {
        console.error("خطا در به‌روزرسانی کالاها:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);

  const totalPages = Math.ceil(items.length / pageSize);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTooltipToggle = (itemId: number) => {
    if (openTooltipId === itemId) {
      setOpenTooltipId(null);
    } else {
      setOpenTooltipId(itemId);
    }
  };

  const handleAddProduct = (formData: any) => {
    console.log("Adding product:", formData);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center mb-4">
          <img src={productLabel} alt="" />
          <span
            className="text-black mr-2"
            style={{ fontSize: "30px", fontWeight: 500 }}
          >
            کالای ثبت نشده -
          </span>
          <span style={{ fontSize: "23px", fontWeight: 400, color: "#7E7E7E" }}>
            {items?.length || 0} عدد محصول ثبت نشده
          </span>
        </div>
        <img
          src={arrowDownn}
          style={{
            transition: "transform 0.2s",
          }}
          alt="arrow"
        />

        <div className="flex justify-end mb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <section className="w-full text-right mt-8 flex flex-col gap-2 overflow-y-auto">
        <div className="flex justify-between">
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[50px]">
            #
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[470px]">
            نام کالا
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[470px]">
            قیمت فروش (ریال)
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[470px]">
            بارکد
          </div>
        </div>
        <section className="overflow-y-auto relative" style={{ height: 650 }}>
          {paginatedItems && paginatedItems.length > 0 ? (
            paginatedItems.map((item, index) => (
              <div key={item.id} style={{ position: "relative" }}>
                <div
                  className={`flex justify-between py-1 font-21 ${
                    (index + 1) % 2 === 1 ? "bg-our-choice-200 rounded-md" : ""
                  }`}
                >
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[50px]">
                    {(currentPage - 1) * pageSize + index + 1}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[470px]">
                    {item.name}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[470px]">
                    {item.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[470px] font-semibold">
                    <span
                      style={{
                        width: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.barcode.toLocaleString()}
                    </span>
                    <img
                      src={arrowDownn}
                      alt="arrow"
                      style={{
                        position: "relative",
                        right: "150px",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        color: "black",
                        backgroundColor: "black",
                        transform:
                          openTooltipId === item.id
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                      onClick={() => handleTooltipToggle(item.id)}
                    />
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[50px]"></div>
                </div>

                {/* Product Registration Tooltip */}
                <ProductRegistrationTooltip
                  isOpen={openTooltipId === item.id}
                  onClose={() => setOpenTooltipId(null)}
                  onAdd={handleAddProduct}
                  initialData={{
                    name: item.name,
                    barcode: item.barcode,
                    price: item.price,
                    unit: item.unit,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-full text-gray-500">
              {items.length === 0
                ? "هیچ کالایی یافت نشد"
                : "در حال بارگذاری..."}
            </div>
          )}
        </section>
      </section>
    </>
  );
};

export default Unregistered;
