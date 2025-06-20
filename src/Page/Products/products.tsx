import React, { useEffect, useState, useRef } from "react";
import axios, { Axios } from "axios";
// import { useShopItems } from "../../endpoint/product/product";
import { Button } from "../../Components/Ui/Button/button";
import filterIcon from "../../assets/filter.svg";
import Input from "../../Components/Ui/Input/input";
import SideMenu from "../../Components/Base/SideMenu/SideMenu";
import useRequest from "../../hooks/useRequest";
import { useSelector } from "react-redux";
import productLabel from "../../assets/productLabel.svg";
import addIcon from "../../assets/add.svg";
import optionIcon from "../../assets/option.svg";
import arrowDownn from "../../assets/arrow-down.svg";

import type { RootState } from "../../store/store";
import { PRODUCT_ENDPOINTS } from "../../endpoint/product/product";
interface ProductItem {
  id: string;
  price: number;
  statusType: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  itemDto: {
    id: string;
    name: string;
    sku: string;
    itemPictureDefaultId: number;
    description: string;
    price: number;
    categoryId: {
      id: string;
      title: string;
    };
    categoryName: string;
    rootCategoryName: string;
    defaultImageUrl: string;
    unitType: string;
  };
  isAvailable: boolean;
  sellType: string;
  packingCost: number;
  onlineStockThreshold: number;
  offlineStockThreshold: number;
  instantStock: number;
  instantOnlineStock: number;
  instantOfflineStock: number;
}
interface categoryResponse {
  id: string;
  title: string;
}

interface ProductsResponse {
  items: ProductItem[];
  count: number;
  page: number;
  row: number;
}

const Products: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [filterDiscount, setFilterDiscount] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [finalData, setFinalData] = useState(null);
  const [availableCategories, setAvailableCategories] = useState(null);

  const [categoriesCount, setCategoriesCount] = useState<Number | null>(null);
  const [searchProduct, setSearchProduct] = useState<string>("");

  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [currentRow, setCurrentRow] = useState<string | null>(null);
  const hasCalledApi = useRef(false);

  //   const { execute, data, loading, error } = useShopItems();
  const token = useSelector((state: RootState) => state.auth.token);
  let categories: any;

  const {
    execute: itemRequest,
    loading,
    error: loginError,
  } = useRequest<ProductsResponse>(PRODUCT_ENDPOINTS.shopItems, "POST", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const {
    execute: categoryRequest,
    loadingCategory,
    error,
  } = useRequest<categoryResponse>(
    PRODUCT_ENDPOINTS.cacheCategoryList,
    "POST",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  //   const {
  //     execute: versioRequest,
  //     loadingVersion,
  //     error: versionError,
  //   } = useRequest<{ data: any }>(PRODUCT_ENDPOINTS.cacheVersion, "GET", {});
  useEffect(() => {
    categories = [];
    getVersion();
    getcategory();
    getInfo();
    // if (!hasCalledApi.current) {
    //   hasCalledApi.current = true;
    //   execute();
    // }
  }, []);

  const getVersion = async () => {
    const shopId = localStorage.getItem("shoppId");
    try {
      //       const response = axios.get(
      //         `https://api2.shopp.market/api/shop_biz/cache/version/${shopId}` ,{},
      //         {
      //             headers: {
      //               'Content-Type': 'application/json',
      //               'Authorization': 'Bearer YOUR_TOKEN'
      //             }
      //           })
      // // {
      // //     headers: {
      // //         'Authorization': `Bearer ${token}`,
      // //         "Content-Type": "application/json",
      // //     }
      // // }

      //       );

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Custom-Header": "Custom Value",
        },
      };

      //   // Example GET request without body but with headers
      axios
        .get(
          `https://api2.shopp.market/api/shop_biz/cache/version/${shopId}`,
          config
        )
        .then((res) => {
          localStorage.setItem("cacheVersion", JSON.stringify(res?.data));
        });
    } catch (error) {}
  };
  const getcategory = async () => {
    const shopId = localStorage.getItem("shoppId");
    const token = localStorage.getItem("token");

    try {
      const response = await categoryRequest({
        shopId: shopId,
      });

      categories = response?.data;
    } catch (error) {}
  };
  const getInfo = async () => {
    const shopId = localStorage.getItem("shoppId");
    const token = localStorage.getItem("token");
    // let cacheVersionStorage = localStorage.getItem("cacheVersion");

    try {
      const response = await itemRequest({
        // page: 8,
        // row: 5,
        shopId: shopId,
        // data: JSON.parse(cacheVersionStorage)?.category,
      });

      if (response) {
        let availableCategoriesArray: any = [];
        // const data: any = response.data;
        for (let i = 0; i < response.data.length; i++) {
          console.log(0);

          categories?.map((category: { id: any; title: any }) => {
            console.log(1);

            if (response.data[i].categoryId === category.id) {
              console.log(2);

              response.data[i].categoryName = category.title;
              availableCategoriesArray.push(response.data[i].categoryName);
            }
          });
        }
        availableCategoriesArray = [...new Set(availableCategoriesArray)];
        setAvailableCategories(availableCategoriesArray);

        setCategoriesCount(categories.length);
        setFinalData(response.data);
      }
    } catch (error) {}
  };

  //   useEffect(() => {
  //     if (hasCalledApi.current) {
  //       execute();
  //     }
  //   }, [currentPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    // در اینجا می‌توانید فیلتر جستجو را اعمال کنید
  };

  const handleFilter = () => {
    setCurrentPage(1);
    // در اینجا می‌توانید فیلترها را اعمال کنید
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("fa-ir").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStockStatus = (stock: number) => {
    return stock === 0 ? "عدم موجودی" : stock.toString();
  };

  const getStockColor = (stock: number) => {
    return stock === 0 ? "#DE4949" : "#000000";
  };

  //   if (loading) {
  //     return (
  //       <div className="flex items-center justify-center h-screen">
  //         <div className="text-xl">در حال بارگذاری محصولات...</div>
  //       </div>
  //     );
  //   }

  //   if (error) {
  //     return (
  //       <div className="flex items-center justify-center h-screen">
  //         <div className="text-xl text-red-500">
  //           خطا در بارگذاری محصولات: {error}
  //         </div>
  //       </div>
  //     );
  //   }

  //   const totalPages = data ? Math.ceil(data.count / 5) : 0;

  return (
    <div className="flex">
      <SideMenu />

      {/* <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-[#7889F5] rounded mr-2"></div>
            <span className="text-xl font-medium text-black mr-2">
              محصولات -{" "}
            </span>
            <span className="text-base text-gray-600">
              {data?.count || 0} محصول / {data?.items?.length || 0} دسته بندی
            </span>
          </div> */}

      {/* <div className="flex items-center gap-4 mb-4">
            <div className="w-64">
              <Input
                placeholder="کالا را با نام یا بارکد جست‌وجو کنید"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ height: "38px", borderRadius: "25px" }}
              />
            </div>

            <Button
              label="فیلتر"
              color="#7889F5"
              onClick={() => setShowFilter(!showFilter)}
              style={{ height: "38px", borderRadius: "8px" }}
            />

            <Button
              label="افزودن محصول"
              color="#7889F5"
              onClick={() => console.log("Add product")}
              style={{ height: "38px", borderRadius: "8px" }}
            />

            {totalPages > 0 && (
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-[#7889F5] text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </div> */}

      {/* {showFilter && (
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">برند</label>
                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">انتخاب کنید</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    دسته بندی
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">انتخاب کنید</option>
                    {data?.items?.map((item) => (
                      <option
                        key={item.itemDto.categoryId.id}
                        value={item.itemDto.categoryId.id}
                      >
                        {item.itemDto.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    موجودی
                  </label>
                  <Input
                    placeholder="موجودی"
                    value={filterStock}
                    onChange={(e) => setFilterStock(e.target.value)}
                    style={{ height: "35px" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    قیمت از
                  </label>
                  <Input
                    placeholder="حداقل"
                    value={filterMinPrice}
                    onChange={(e) => setFilterMinPrice(e.target.value)}
                    style={{ height: "35px" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    قیمت تا
                  </label>
                  <Input
                    placeholder="حداکثر"
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(e.target.value)}
                    style={{ height: "35px" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">واحد</label>
                  <select
                    value={filterUnit}
                    onChange={(e) => setFilterUnit(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">انتخاب کنید</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <Button
                    label="اعمال فیلتر"
                    color="#7889F5"
                    onClick={handleFilter}
                    style={{ height: "35px", marginTop: "20px" }}
                  />
                </div>
              </div>
            </div>
          )} */}

      {/* <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-10 bg-gray-200 rounded flex items-center justify-center">
              ⭐
            </div>
            {data?.items?.map((item) => (
              <button
                key={item.itemDto.categoryId.id}
                className="bg-gray-200 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300"
              >
                {item.itemDto.categoryName}
              </button>
            ))}
            <button className="bg-gray-200 w-12 h-10 rounded flex items-center justify-center text-lg font-bold">
              +
            </button>
          </div> */}

      {/* <div className="grid grid-cols-8 gap-2 bg-gray-200 p-3 rounded mb-2">
            <div className="text-center font-medium">#</div>
            <div className="text-center font-medium">نام کالا</div>
            <div className="text-center font-medium">قیمت اولیه (ریال)</div>
            <div className="text-center font-medium">قیمت فروش (ریال)</div>
            <div className="text-center font-medium">دسته‌بندی</div>
            <div className="text-center font-medium">موجودی</div>
            <div className="text-center font-medium">تخفیف (ریال)</div>
            <div className="text-center font-medium">عملیات</div>
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto">
            {data?.items?.map((item, index) => (
              <div
                key={item.id}
                className={`grid grid-cols-8 gap-2 p-3 rounded ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="text-center text-sm">
                  {index + 1 + (currentPage - 1) * 5}
                </div>
                <div className="text-center text-sm">{item.itemDto.name}</div>
                <div className="text-center text-sm">
                  {formatNumber(item.itemDto.price)}
                </div>
                <div className="text-center text-sm">
                  {formatNumber(item.price)}
                </div>
                <div className="text-center text-sm">
                  {item.itemDto.categoryName}
                </div>
                <div
                  className="text-center text-sm"
                  style={{ color: getStockColor(item.onlineStockThreshold) }}
                >
                  {getStockStatus(item.onlineStockThreshold)}
                </div>
                <div className="text-center text-sm">-</div>
                <div className="text-center text-sm relative">
                  <button
                    onClick={() =>
                      setCurrentRow(currentRow === item.id ? null : item.id)
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    جزئیات
                  </button>
                  {currentRow === item.id && (
                    <div className="absolute top-full left-0 bg-white border rounded shadow-lg p-2 z-10">
                      <button className="block w-full text-left px-2 py-1 hover:bg-gray-100">
                        ویرایش
                      </button>
                      <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-600">
                        حذف
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div> */}

      {/* {(!data?.items || data.items.length === 0) && (
            <div className="text-center text-gray-500 mt-8">
              محصولی یافت نشد
            </div>
          )} */}
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
        <div className="flex items-center mb-4">
          <img src={productLabel} alt="" />
          <span
            className="text-black mr-2"
            style={{ fontSize: "30px", fontWeight: 500 }}
          >
            محصولات -{" "}
          </span>
          <span style={{ fontSize: "23px", fontWeight: 400, color: "#7E7E7E" }}>
            {finalData?.length || 0} محصول / {categoriesCount || 0} دسته بندی
          </span>
        </div>
        <div>
          <div className="flex">
            <Input
              type="text"
              width={"603px"}
              height={48}
              placeholder="کالا را با نام یا بارکدجست‌وجو کنید"
              placeholderStyle={{
                fontSize: "19px",
                color: "#7E7E7E",
                fontWeight: "400",
              }}
              value={searchProduct}
              onChange={(e) => {
                setSearchProduct(e.target.value);
              }}
              style={{
                borderRadius: "55px",
                backgroundColor: "#fff",
                border: "2px solid #7485E5",
                marginBottom: "5px",
                marginLeft: "15px",
              }}
            />
            <Button
              label="فیلتر"
              color="#7485E5"
              radius={15}
              style={{ width: "175px", height: "48px", marginLeft: "15px" }}
            >
              <img
                src={filterIcon}
                style={{ position: "relative", bottom: "25px", right: "13px" }}
              />
              <img
                src={arrowDownn}
                style={{ position: "relative", bottom: "48px", right: "108px" }}
              />
            </Button>
            <Button
              label=""
              color="#7485E5"
              radius={15}
              style={{ width: "175px", height: "48px" }}
            >
              <span style={{ position: "relative", left: "-15px" }}>
                افزودن کالا
              </span>
              <img
                src={addIcon}
                style={{ position: "relative", bottom: "30px", left: "5px" }}
              />
            </Button>
          </div>
          <section className="flex flex-wrap mt-2">
            {availableCategories?.map((item) => (
              <div
                key={item}
                className="flex justify-between al mx-1 mt-2 pr-5 pl-2 "
                style={{
                  borderRadius: "5px",
                  backgroundColor: "#DEDEDE",
                }}
              >
                <span
                  className="ml-8 py-2"
                  style={{ fontSize: "20px", fontWeight: 500 }}
                >
                  {item}
                </span>
                <img
                  style={{ height: "25px", width: "5px", marginTop: "12px" }}
                  src={optionIcon}
                />
              </div>
            ))}
          </section>
        </div>
        <section className="w-full text-right mt-8 flex flex-col gap-2 overflow-y-auto">
          <div className="flex justify-between">
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[50px]">
              #
            </div>
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[400px]">
              نام کالا
            </div>
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center  w-[180px]">
              قیمت اولیه (ریال)
            </div>
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center  w-[180px]">
              قیمت فروش (ریال)
            </div>
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center min-w-[200px]">
              دسته‌بندی
            </div>
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center min-w-[200px]">
              موجودی
            </div>
            <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center min-w-[180px]">
              تخفیف (ریال)
            </div>
          </div>
          <section className="overflow-y-auto relative max-h-[450px]">
            {finalData?.map(
              (
                item: {
                  id: React.Key | null | undefined;
                  name:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  price: number;
                  categoryName:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  onlineStockThreshold: number;
                },
                index: number
              ) => (
                <div
                  key={item.id}
                  className={`flex justify-between py-1 font-21 ${
                    (index + 1) % 2 === 1 ? "bg-our-choice-200 rounded-md" : ""
                  }`}
                >
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center w-[50px]">
                    {(index + 1).toLocaleString("fa-ir")}
                  </div>
                  <div
                    className="h-[49px] p-4 rounded-md flex items-center justify-center w-[400px]"
                    style={{ textAlign: "center" }}
                  >
                    {item.name}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[180px] font-semibold">
                    {formatNumber(item.price)}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[180px] font-semibold">
                    {formatNumber(item.price)}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[200px]">
                    {item.categoryName}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[200px]">
                    {item.onlineStockThreshold
                      ? getStockStatus(item.onlineStockThreshold)
                      : "عدم موجودی"}
                  </div>
                  <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[180px]">
                    -
                  </div>
                </div>
              )
            )}
          </section>
        </section>
      </section>
    </div>
  );
};

export default Products;
