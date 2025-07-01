import React, { useState, useMemo } from "react";
import { Button } from "../Ui/Button/button";
import Input from "../Ui/Input/input";
import Pagination from "../Pagination/Pagination";
import discountImage from "../../assets/img/discount.png";

interface Product {
  id: number;
  name: string;
  barcode: string;
  expiryDate: string;
  brand: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
}

interface CustomerDiscountProps {
  onBack?: () => void;
}

const CustomerDiscount: React.FC<CustomerDiscountProps> = ({}) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [customerData, setCustomerData] = useState<{
    mobile: string;
    name: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setIsLoading] = useState(false);

  const pageSize = 20;

  const [products] = useState<Product[]>(() =>
    Array.from({ length: 150 }, (_, index) => ({
      id: index + 1,
      name: `کالای ${index + 1}`,
      barcode: Math.random().toString(36).substring(2, 15),
      expiryDate: new Date(
        Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("fa-IR"),
      brand: `برند ${Math.floor(Math.random() * 10) + 1}`,
      originalPrice: Math.floor(100000 + Math.random() * 900000),
      discountedPrice: Math.floor(80000 + Math.random() * 700000),
      discount: Math.floor(5000 + Math.random() * 50000),
    }))
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return products.slice(startIndex, startIndex + pageSize);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / pageSize);

  const totals = useMemo(() => {
    const totalOriginal = products.reduce(
      (sum, product) => sum + product.originalPrice,
      0
    );
    const totalDiscounted = products.reduce(
      (sum, product) => sum + product.discountedPrice,
      0
    );
    const totalDiscount = products.reduce(
      (sum, product) => sum + product.discount,
      0
    );

    return {
      totalOriginal,
      totalDiscounted,
      totalDiscount,
    };
  }, [products]);

  const handleApplyDiscount = async () => {
    if (!mobileNumber.trim() && !couponCode.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      if (mobileNumber.trim()) {
        setCustomerData({
          mobile: mobileNumber,
          name: `مشتری ${Math.floor(Math.random() * 1000)}`,
        });
      } else if (couponCode.trim()) {
        console.log("Searching for coupon:", couponCode);
        setCustomerData({
          mobile: "کد تخفیف",
          name: `تخفیف ${couponCode}`,
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center justify-between gap-8 max-h-10">
          <Input
            placeholder="شماره تلفن همراه مشتری یا کد تخفیف"
            hasButton
            buttonText="اعمال تخفیف"
            value={mobileNumber || couponCode}
            onChange={(e) => {
              const value = e.target.value;
              if (value.startsWith("09") || value.length <= 11) {
                setMobileNumber(value);
                setCouponCode("");
              } else {
                setCouponCode(value);
                setMobileNumber("");
              }
            }}
            onButtonClick={handleApplyDiscount}
            style={{
              width: "445px",
              borderRadius: "55px",
              border: "2px solid #7485E5",
            }}
            backgroundColor="#F8F8F8"
          />
        </div>
        {customerData && (
          <div className="flex">
            <div
              style={{
                width: "309px",
                height: "42px",
                backgroundColor: "#D1D1D1",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 15px",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  color: "#000",
                }}
              >
                مشتری:
              </span>
              <span
                style={{
                  fontSize: "25px",
                  fontWeight: "600",
                  color: "#000",
                }}
              >
                {customerData.mobile}
              </span>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {!customerData && (
        <div
          className="flex items-center justify-center"
          style={{ marginTop: "100px" }}
        >
          <span
            style={{
              fontSize: "26px",
              fontWeight: "500",
              color: "#7485E599",
              opacity: 0.6,
              marginBottom: "20px",
            }}
          >
            برای نمایش لیست کالاهای تخفیفی، شماره تلفن همراه مشتری یا کد تخفیف
            را وارد کنید
          </span>
          <img
            src={discountImage}
            alt="discount"
            style={{
              width: "342px",
              height: "442px",
              marginBottom: "20px",
            }}
          />
        </div>
      )}

      {customerData && (
        <>
          <section className="w-full mt-4 flex flex-col gap-2 overflow-y-auto text-right">
            <div className="flex justify-between">
              {[
                "#",
                "نام کالا",
                "بارکد کالا",
                "تاریخ انقضا",
                "برند کالا",
                "قیمت اصلی (ریال)",
                "قیمت تخفیفی (ریال)",
                "تخفیف",
              ].map((title, i) => (
                <div
                  key={i}
                  className={`bg-our-choice h-10 p-4 rounded-md flex items-center justify-center ${
                    i === 0 ? "w-[50px]" : "w-[200px]"
                  }`}
                >
                  {title}
                </div>
              ))}
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "380px" }}>
              {paginatedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`flex justify-between py-1 font-21 ${
                    index % 2 === 0 ? "bg-our-choice-200 rounded-md" : ""
                  }`}
                >
                  <div className="w-[50px] p-4 flex items-center justify-center">
                    {(currentPage - 1) * pageSize + index + 1}
                  </div>
                  <div className="w-[200px] p-4 flex items-center justify-center">
                    {product.name}
                  </div>
                  <div className="w-[200px] p-4 flex items-center justify-center">
                    {product.barcode}
                  </div>
                  <div className="w-[200px] p-4 flex items-center justify-center">
                    {product.expiryDate}
                  </div>
                  <div className="w-[200px] p-4 flex items-center justify-center">
                    {product.brand}
                  </div>
                  <div className="w-[200px] p-4 flex items-center justify-center font-semibold">
                    {product.originalPrice.toLocaleString("fa-IR")}
                  </div>
                  <div className="w-[200px] p-4 flex items-center justify-center font-semibold">
                    {product.discountedPrice.toLocaleString("fa-IR")}
                  </div>
                  <div className="w-[200px] p-4 flex items-center justify-center font-semibold">
                    {product.discount.toLocaleString("fa-IR")}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#000000",
              opacity: 0.5,
              margin: "27px 0 10px 0",
            }}
          />

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "#000",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    color: "#363636",
                    marginLeft: "10px",
                  }}
                >
                  مبلغ کل:
                </span>
                <span style={{ fontSize: "24px", fontWeight: "600" }}>
                  {totals.totalOriginal.toLocaleString("fa-IR")}
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    color: "#363636",
                  }}
                >
                  ریال
                </span>
              </span>
            </div>
            <div className="flex flex-col">
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "#000",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    color: "#363636",
                    marginLeft: "10px",
                  }}
                >
                  مقدار با تخفیف:
                </span>
                <span style={{ fontSize: "24px", fontWeight: "600" }}>
                  {totals.totalDiscounted.toLocaleString("fa-IR")}
                </span>
                <span style={{ fontSize: "18px", fontWeight: "500" }}>
                  ریال
                </span>
              </span>
            </div>
            <div className="flex flex-col">
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "#000",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    color: "#363636",
                    marginLeft: "10px",
                  }}
                >
                  مقدار تخفیف:
                </span>
                <span style={{ fontSize: "24px", fontWeight: "600" }}>
                  {totals.totalDiscount.toLocaleString("fa-IR")}
                </span>
                <span style={{ fontSize: "18px", fontWeight: "500" }}>
                  ریال
                </span>
              </span>
            </div>
            <Button
              label="تایید لیست"
              color="#7485E5"
              style={{
                width: "292px",
                height: "48px",
                borderRadius: "15px",
                fontSize: "23px",
                fontWeight: "600",
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default CustomerDiscount;
