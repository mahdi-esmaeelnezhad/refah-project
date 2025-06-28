import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
// import { useShopItems } from "../../endpoint/product/product";
import { Button } from "../../Components/Ui/Button/button";
import filterIcon from "../../assets/filter.svg";
import { useModal } from "../../hooks/useModal";
import Input from "../../Components/Ui/Input/input";
import useRequest from "../../hooks/useRequest";
import { useSelector } from "react-redux";
import productLabel from "../../assets/productLabel.svg";
import addIcon from "../../assets/add.svg";
import NoShowCategoryModal from "../../Components/Modal/NoShowCategoryModal";
import optionIcon from "../../assets/option.svg";
import arrowDownn from "../../assets/arrow-down.svg";

// import star from "../../assets/star.svg";
import starFull from "../../assets/starFull.svg";
import Tooltip from "../../Components/Base/SideMenu/Tooltip";
import CategoryOptiob from "../../Components/ToolTipProduct/categortOption";

import type { RootState } from "../../store/store";
import { PRODUCT_ENDPOINTS } from "../../endpoint/product/product";
import nextArrow from "../../assets/nextArrow.svg";
import previousArrow from "../../assets/perviosArrow.svg";
import Pagination from "../../Components/Pagination/Pagination";
import ProductsFilter from "../../Components/ProductsFilter/ProductsFilter";
import AddProductModal from "../../Components/Modal/AddProductModal";

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
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [isNoShowModalOpen, setIsNoShowModalOpen] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [categoryDelete, setCategoryDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [filterDiscount, setFilterDiscount] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [finalData, setFinalData] = useState(null);
  const [allFinalData, setAllFinalData] = useState(null);
  const [availableCategories, setAvailableCategories] = useState(null);
  const [categoriesCount, setCategoriesCount] = useState<Number | null>(null);
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [currentRow, setCurrentRow] = useState<string | null>(null);
  const [showCategoryId, setShowCategoryId] = useState<string | null>(null);
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
  useEffect(() => {
    categories = [];
    getVersion();
    getcategory();
    getInfo();
  }, []);

  const deleteProduct = async (id: any) => {
    console.log(id, "ia");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Custom-Header": "Custom Value",
        },
      };
      axios
        .get(
          `https://api2.shopp.market/api/operator/item/uV90PEhmKR7GYmhxXju73w،3D،3D`,
          config
        )
        .then((res) => {});
    } catch (error) {}
  };
  const getVersion = async () => {
    const shopId = localStorage.getItem("shoppId");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Custom-Header": "Custom Value",
        },
      };
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
        page: 8,
        row: 5,
        shopId: shopId,
        // data: JSON.parse(cacheVersionStorage)?.category,
      });

      if (response) {
        let availableCategoriesArray: any = [];
        // const data: any = response.data;
        for (let i = 0; i < response.data.length; i++) {
          categories?.map((category: { id: any; title: any }) => {
            if (response.data[i].categoryId === category.id) {
              response.data[i].categoryName = category.title;
              availableCategoriesArray.push({
                categoryName: response.data[i].categoryName,
                categoryId: response.data[i].categoryId,
              });
            }
          });
        }
        availableCategoriesArray = availableCategoriesArray.filter(
          (
            obj: { categoryId: any; categoryName: any },
            index: any,
            self: any[]
          ) =>
            index ===
            self.findIndex(
              (t) =>
                t.categoryId === obj.categoryId &&
                t.categoryName === obj.categoryName
            )
        );
        // availableCategoriesArray = [...new Set(availableCategoriesArray)];
        setAvailableCategories(availableCategoriesArray);

        setCategoriesCount(categories.length);
        setFinalData(response.data);
        setAllFinalData(response.data);
        localStorage.setItem("finalDataStorage", JSON.stringify(response.data));
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
  const handleSeachProduct = (value: string) => {
    let searchData: any = [];
    allFinalData?.map(
      (item: { name: string | string[]; sku: string | string[] }) => {
        if (item.name.includes(value) || item.sku === value) {
          searchData.push(item);
        }
      }
    );

    if (!value) {
      setFinalData(allFinalData);
    } else {
      setFinalData(searchData);
    }
    setCurrentPage(1);
  };
  const closeCategoryModal = () => {
    setCategoryDelete(false);
  };
  const deleteCategoryHandler = () => {
    const index = availableCategories?.findIndex(
      (item: { categoryId: string | null }) =>
        item.categoryId === showCategoryId
    );
    const filteCategoryFinalData = finalData.filter(
      (item: { categoryId: string | null }) =>
        item.categoryId !== showCategoryId
    );
    setFinalData(filteCategoryFinalData);
    setAllFinalData(filteCategoryFinalData);
    localStorage.setItem(
      "finalDataStorage",
      JSON.stringify(filteCategoryFinalData)
    );
    allOfData = filteCategoryFinalData;
    availableCategories.splice(index, 1);
    setCategoryDelete(false);
  };
  const handleEditCategory = (id: string) => {
    console.log(id);
  };
  const handleDeleteCategory = (id: string) => {
    setOpenTooltipId(null);
    setCategoryDelete(true);
    setShowCategoryId(id);
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

  const itemsPerPage = 20;
  const totalPages = Math.ceil((finalData?.length || 0) / itemsPerPage);

  const paginatedData = useMemo(() => {
    return finalData?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [finalData, currentPage]);

  const categoryOptions = useMemo(() => {
    return availableCategories?.map((item) => ({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
    }));
  }, [availableCategories]);

  const unitTypes = useMemo(() => {
    const types = allFinalData?.map((item) => item.unitType);
    return [...new Set(types)];
  }, [allFinalData]);

  const productSectionMaxHeight = showFilter ? 230 : 400;

  // Sample brands array (replace with real data if available)
  const brands = ["برند نمونه ۱", "برند نمونه ۲", "برند نمونه ۳"];
  const unitsItem = ["عدد", "کیلوگرم", "گرم", "لیتر"];

  return (
    <>
      <NoShowCategoryModal
        isCategoryOpen={categoryDelete}
        onClose={closeCategoryModal}
        onCategoryDelete={deleteCategoryHandler}
      />
      <AddProductModal
        isOpen={isOpen}
        onClose={closeModal}
        categories={categoryOptions || []}
        units={unitsItem || []}
        brands={brands}
        onAdd={(data) => {
          // اینجا می‌توانید داده را به سرور ارسال کنید یا به لیست اضافه کنید
          console.log("محصول جدید:", data);
        }}
      />
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
            onChange={(e) => handleSeachProduct(e.target.value)}
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
            style={{
              width: "175px",
              height: "48px",
              marginLeft: "15px",
              position: "relative",
            }}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <img
              src={filterIcon}
              style={{ position: "relative", bottom: "25px", right: "13px" }}
            />
            <img
              src={arrowDownn}
              style={{
                position: "relative",
                bottom: "48px",
                right: "108px",
                transition: "transform 0.2s",
                transform: showFilter ? "rotate(180deg)" : "rotate(0deg)",
              }}
              alt="arrow"
            />
          </Button>
          <Button
            label=""
            color="#7485E5"
            radius={15}
            style={{ width: "175px", height: "48px" }}
            onClick={() => openModal("")}
          >
            <span style={{ position: "relative", left: "-15px" }}>
              افزودن کالا
            </span>
            <img
              src={addIcon}
              style={{ position: "relative", bottom: "30px", left: "5px" }}
            />
          </Button>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        {showFilter && (
          <ProductsFilter
            categories={categoryOptions}
            unitTypes={unitTypes}
            onApply={(filters) => {
              let filtered = allFinalData;
              if (filters.category) {
                filtered = filtered.filter(
                  (item) => item.categoryId === filters.category
                );
              }
              if (filters.unitType) {
                filtered = filtered.filter(
                  (item) => item.unitType === filters.unitType
                );
              }
              if (filters.discount) {
                filtered = filtered.filter(
                  (item) =>
                    Number(item.discount || 0) >= Number(filters.discount)
                );
              }
              if (filters.minPrice) {
                filtered = filtered.filter(
                  (item) => Number(item.price) >= Number(filters.minPrice)
                );
              }
              if (filters.maxPrice) {
                filtered = filtered.filter(
                  (item) => Number(item.price) <= Number(filters.maxPrice)
                );
              }
              setFinalData(filtered);
              setCurrentPage(1);
            }}
            onReset={() => {
              setFinalData(allFinalData);
              setCurrentPage(1);
            }}
            showReset={finalData !== allFinalData}
          />
        )}
        <section className="flex flex-wrap mt-2">
          <div
            className="flex mx-1 mt-2 p-4 "
            style={{
              borderRadius: "5px",
              backgroundColor: "#DEDEDE",
            }}
          >
            <img style={{ marginBottom: "5px" }} src={starFull} />
          </div>
          {availableCategories?.map((item) => (
            <div
              key={item}
              className="flex justify-between al mx-1 mt-2 px-4 py-2"
              style={{
                borderRadius: "5px",
                backgroundColor: "#DEDEDE",
              }}
            >
              <span
                className="ml-8 py-2"
                style={{ fontSize: "20px", fontWeight: 500 }}
              >
                {item.categoryName}
              </span>

              <div className="relative">
                <Tooltip
                  component={
                    <CategoryOptiob
                      category={item}
                      onDelete={handleDeleteCategory}
                      onEdit={handleEditCategory}
                    />
                  }
                  isOpen={openTooltipId === item.categoryId}
                  setIsOpen={(isOpen) => {
                    if (!isOpen) {
                      setOpenTooltipId(null);
                      setSelectedItemId(null);
                    } else {
                      setOpenTooltipId(item.categoryId);
                    }
                  }}
                >
                  <img
                    style={{
                      height: "25px",
                      width: "5px",
                      marginTop: "12px",
                    }}
                    src={optionIcon}
                  />
                </Tooltip>
              </div>
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
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center min-w-[300px]">
            دسته‌بندی
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center min-w-[150px]">
            موجودی
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center min-w-[180px]">
            تخفیف (ریال)
          </div>
        </div>
        <section
          className="overflow-y-auto relative"
          style={{ maxHeight: productSectionMaxHeight }}
        >
          {paginatedData?.map(
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
                  onClick={() => deleteProduct(item.id)}
                >
                  {item.name}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[180px] font-semibold">
                  {formatNumber(item.price)}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[180px] font-semibold">
                  {formatNumber(item.price)}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[300px]">
                  {item.categoryName}
                </div>
                <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[150px]">
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
    </>
  );
};

export default Products;
