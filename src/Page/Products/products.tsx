import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../../Components/Ui/Button/button";
import filterIcon from "../../assets/filter.svg";
import { useModal } from "../../hooks/useModal";
import Input from "../../Components/Ui/Input/input";
import productLabel from "../../assets/productLabel.svg";
import addIcon from "../../assets/add.svg";
import NoShowCategoryModal from "../../Components/Modal/NoShowCategoryModal";
import optionIcon from "../../assets/option.svg";
import arrowDownn from "../../assets/arrow-down.svg";

import starFull from "../../assets/starFull.svg";
import Tooltip from "../../Components/Base/SideMenu/Tooltip";
import CategoryOption from "../../Components/ToolTipProduct/categortOption";
import ProductOption from "../../Components/ToolTipProduct/ProductOption";
import Pagination from "../../Components/Pagination/Pagination";
import ProductsFilter from "../../Components/ProductsFilter/ProductsFilter";
import AddProductModal from "../../Components/Modal/AddProductModal";
import useRequest from "../../hooks/useRequest";
import { PRODUCT_ENDPOINTS } from "../../endpoint/product/product";
import axios from "axios";
import { BASE_ENDPOINTS } from "../../endpoint/base/base";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../store/store";

interface ProductItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  brandId: string;
  categoryName: string;
  brandName: string;
  sku: string;
  unitType: string;
  onlineStockThreshold: number;
  discount?: number;
  govId: string;
  vatRate: string;
  isAvailable: boolean;
}

// interface Category {
//   id: string;
//   title: string;
// }

interface CategoryOption {
  categoryId: string;
  categoryName: string;
}

const Products: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState(1);

  const [showFilter, setShowFilter] = useState(false);
  const [categoryDelete, setCategoryDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [finalData, setFinalData] = useState<ProductItem[]>([]);
  const [allFinalData, setAllFinalData] = useState<ProductItem[]>([]);
  const [availableCategories, setAvailableCategories] = useState<
    CategoryOption[]
  >([]);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);

  const [, setOpenTooltipId] = useState<string | null>(null);
  const [, setSelectedItemId] = useState<number | null>(null);
  const [showCategoryId, setShowCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openCategoryTooltipId, setOpenCategoryTooltipId] = useState<
    string | null
  >(null);
  const [openProductTooltipId, setOpenProductTooltipId] = useState<
    string | null
  >(null);
  const [editProduct, setEditProduct] = useState<ProductItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<ProductItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const token = localStorage.getItem("token");
  const shopId = localStorage.getItem("shopId");
  const { execute: addProductRequest } = useRequest(
    PRODUCT_ENDPOINTS.addProduct,
    "POST",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  useEffect(() => {
    getCategory();
    getInfo();
  }, []);

  const getCategory = async () => {
    const cacheCategoryList = localStorage.getItem("cacheCategoryList");
    if (!cacheCategoryList) return;
    setCategoriesCount(cacheCategoryList.length);
  };
  const { execute: getCacheProductList } = useRequest<any>(
    BASE_ENDPOINTS.cacheProductList,
    "POST",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const getInfo = async () => {
    const shopId = localStorage.getItem("shopId");
    if (!shopId) return;

    try {
      setIsLoading(true);
      setError(null);
      // please json parse
      const cacheCategoryList = JSON.parse(
        localStorage.getItem("cacheCategoryList") || "[]"
      );
      const cacheBrandList = JSON.parse(
        localStorage.getItem("cacheBrandList") || "[]"
      );
      const res: any = await getCacheProductList({ shopId });
      const cacheProductList = res.data;
      if (
        cacheProductList &&
        Array.isArray(cacheProductList) &&
        cacheCategoryList &&
        Array.isArray(cacheCategoryList) &&
        cacheBrandList &&
        Array.isArray(cacheBrandList)
      ) {
        // const categoriesResponse = await categoryRequest({ shopId });
        const categoryMap = new Map<string, string>();
        const brandMap = new Map<string, string>();

        if (cacheCategoryList) {
          cacheCategoryList?.forEach((cat: any) => {
            categoryMap.set(cat.id, cat.title);
          });
        }
        let processedData: ProductItem[] = cacheProductList.map(
          (item: any) => ({
            id: item.id || item.itemDto?.id || "",
            name: item.name || item.itemDto?.name || "",
            price: item.price || item.itemDto?.price || 0,
            categoryId: item.categoryId || "",
            brandId: item.brandId || "",
            brandName: brandMap.get(item.brandId) || item.brandName || "",
            sku: item.sku || "",
            govId: item.govId || "",
            isAvailable: item.isAvailable || false,
            vatRate: item.vatRate || "",
            categoryName:
              categoryMap.get(item.categoryId) || item.categoryName || "",
            unitType: item.unitType || "",
            onlineStockThreshold: item.onlineStockThreshold || 0,
            discount: item.discount || 0,
          })
        );
        const availableProducts = processedData.filter(
          (item) => item.isAvailable
        );
        setFinalData(availableProducts);
        setAllFinalData(availableProducts);
        localStorage.setItem(
          "finalDataStorage",
          JSON.stringify(availableProducts)
        );
        const availableCategoriesArray: CategoryOption[] = [];
        availableProducts.forEach((item) => {
          if (item.categoryId && categoryMap.has(item.categoryId)) {
            const existing = availableCategoriesArray.find(
              (cat) => cat.categoryId === item.categoryId
            );
            if (!existing) {
              availableCategoriesArray.push({
                categoryId: item.categoryId,
                categoryName: categoryMap.get(item.categoryId) || "",
              });
            }
          }
        });

        setAvailableCategories(availableCategoriesArray);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("خطا در بارگذاری محصولات");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSeachProduct = (value: string) => {
    if (!allFinalData) return;

    setSearchTerm(value);

    let searchData: ProductItem[] = [];
    let baseData = selectedCategoryId
      ? allFinalData.filter((item) => item.categoryId === selectedCategoryId)
      : allFinalData;

    baseData.forEach((item) => {
      if (
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.id.includes(value)
      ) {
        searchData.push(item);
      }
    });

    setFinalData(value ? searchData : baseData);
    setCurrentPage(1);
  };
  const closeCategoryModal = () => {
    setCategoryDelete(false);
  };
  const deleteCategoryHandler = () => {
    if (!showCategoryId || !availableCategories || !finalData) return;

    const filteredData = finalData.filter(
      (item) => item.categoryId !== showCategoryId
    );

    setFinalData(filteredData);
    setAllFinalData(filteredData);
    localStorage.setItem("finalDataStorage", JSON.stringify(filteredData));

    const updatedCategories = availableCategories.filter(
      (item) => item.categoryId !== showCategoryId
    );
    setAvailableCategories(updatedCategories);
    setCategoryDelete(false);
  };
  const handleDeleteCategory = (id: string) => {
    setOpenTooltipId(null);
    setOpenCategoryTooltipId(null);
    setCategoryDelete(true);
    setShowCategoryId(id);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      // If same category is clicked again, remove filter
      setSelectedCategoryId(null);
      setFinalData(allFinalData);
      setCurrentPage(1);
    } else {
      // Filter by selected category
      setSelectedCategoryId(categoryId);
      const filteredData = allFinalData.filter(
        (item) => item.categoryId === categoryId
      );
      setFinalData(filteredData);
      setCurrentPage(1);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("fa-ir").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStockStatus = (stock: number) => {
    return stock === 0 ? "عدم موجودی" : stock.toString();
  };

  const itemsPerPage = 20;
  const totalPages = Math.ceil((finalData?.length || 0) / itemsPerPage);

  const paginatedData = useMemo(() => {
    if (!finalData) return [];

    return finalData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [finalData, currentPage]);

  const categoryOptions = useMemo(() => {
    return availableCategories || [];
  }, [availableCategories]);

  const unitTypes = useMemo(() => {
    if (!allFinalData) return [];
    const types = allFinalData.map((item) => item.unitType);
    return [...new Set(types)];
  }, [allFinalData]);

  const productSectionMaxHeight = showFilter ? 385 : 535;

  const brands = ["برند نمونه ۱", "برند نمونه ۲", "برند نمونه ۳"];
  const unitsItem = ["عدد", "وزن"];

  const handleEditProduct = (item: ProductItem) => {
    setEditProduct(item);
    setIsEditModalOpen(true);
  };
  const getUnitTypeValue = (unit: string | number) => {
    if (unit === "عدد" || unit === 0 || unit === "0") return 0;
    if (unit === "وزن" || unit === 1 || unit === "1") return 1;
    return unit;
  };
  const submitEditProduct = async (data: any) => {
    try {
      const body = {
        categoryId: {
          id: data.category?.categoryId || "",
        },
        id: data.id || "",
        name: data.name || "",
        price: String(data.salePrice) || "",
        shopId: shopId,
        sku: data.sku || "",
        unitType: getUnitTypeValue(data.unit?.name),
        vatRate: data.vatRate || 0,
        govId: data.govId || "",
      };
      await addProductRequest(body);
      alert("کالا با موفقیت ویرایش شد");
      setIsEditModalOpen(false);
      getInfo();
    } catch (error) {
      alert("خطا در ویرایش کالا");
      console.error("Error editing product:", error);
    }
  };
  const handleDeleteProduct = (item: ProductItem) => {
    setDeleteProduct(item);
    setIsDeleteModalOpen(true);
  };
  const submitDeleteProduct = async () => {
    if (!deleteProduct) return;
    try {
      await axios.delete(PRODUCT_ENDPOINTS.deleteProduct(deleteProduct.id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("کالا با موفقیت حذف شد");
      setIsDeleteModalOpen(false);
      getInfo();
    } catch (error) {
      alert("خطا در حذف کالا");
      console.error("Error deleting product:", error);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={getInfo}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

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
        categories={categoryOptions}
        units={unitsItem}
        brands={brands}
        onAdd={async (data) => {
          try {
            const body = {
              categoryId: {
                id: data.category?.categoryId || "",
              },
              id: "",
              name: data.name || "",
              price: String(data.salePrice) || "",
              shopId: shopId,
              sku: data.sku || "",
              unitType: getUnitTypeValue(data.unit?.name),
              vatRate: data.vatRate || 0,
              govId: data.govId || "",
            };
            await addProductRequest(body);
            alert("کالا با موفقیت تعریف شد");
            closeModal();
            getInfo();
          } catch (error) {
            alert("خطا در تعریف کالا");
            console.error("Error adding product:", error);
          }
        }}
      />
      <AddProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        categories={categoryOptions}
        units={unitsItem}
        brands={brands}
        isEdit={true}
        initialData={editProduct}
        onAdd={submitEditProduct}
      />
      <NoShowCategoryModal
        isCategoryOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onCategoryDelete={submitDeleteProduct}
        message={`آیا مایل به حذف ${deleteProduct?.name} هستید؟`}
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
            value={searchTerm}
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
              if (!allFinalData) return;

              let filtered = allFinalData;

              // Apply category filter from selected category first
              if (selectedCategoryId) {
                filtered = filtered.filter(
                  (item) => item.categoryId === selectedCategoryId
                );
              }

              if (filters.category) {
                filtered = filtered.filter(
                  (item) => item.categoryId === filters.category.categoryId
                );
              }
              if (filters.brand) {
                filtered = filtered.filter(
                  (item) => item.brandName === filters.brand.name
                );
              }
              if (filters.unitType) {
                filtered = filtered.filter(
                  (item) => item.unitType === filters.unitType.name
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
              setSelectedCategoryId(null);
              setSearchTerm("");
            }}
            showReset={finalData !== allFinalData}
          />
        )}
        <div style={{ position: "relative", marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Container for scrollable categories */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                paddingBottom: 8,
                flex: 1,
                marginRight: 16, // Space for fixed add button
              }}
              className="hide-scrollbar"
            >
              <div
                className="flex mx-1 mt-2 p-4"
                style={{
                  borderRadius: "5px",
                  backgroundColor: "#DEDEDE",
                  minWidth: 140,
                  maxWidth: 140,
                  height: 56,
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <img
                  style={{ marginBottom: "5px" }}
                  src={starFull}
                  alt="star"
                />
              </div>
              {availableCategories?.map((item) => (
                <div
                  key={item.categoryId}
                  className="flex justify-between mx-1 px-4 mt-2 px-4 py-2 cursor-pointer"
                  style={{
                    borderRadius: "5px",
                    backgroundColor:
                      selectedCategoryId === item.categoryId
                        ? "#7485E5"
                        : "#DEDEDE",
                    color:
                      selectedCategoryId === item.categoryId
                        ? "white"
                        : "black",
                    // minWidth: 250,
                    // maxWidth: 800,
                    height: 56,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => handleCategoryClick(item.categoryId)}
                >
                  <span
                    className="ml-8 py-2"
                    style={{
                      fontSize: "20px",
                      fontWeight: 500,
                      color:
                        selectedCategoryId === item.categoryId
                          ? "white"
                          : "black",
                    }}
                  >
                    {item.categoryName}
                  </span>
                  <div className="relative">
                    <Tooltip
                      component={
                        <CategoryOption
                          category={item}
                          onDelete={handleDeleteCategory}
                        />
                      }
                      isOpen={openCategoryTooltipId === item.categoryId}
                      setIsOpen={(isOpen) => {
                        if (!isOpen) {
                          setOpenCategoryTooltipId(null);
                          setSelectedItemId(null);
                        } else {
                          setOpenCategoryTooltipId(item.categoryId);
                        }
                      }}
                    >
                      {/* <img
                        style={{
                          height: "25px",
                          width: "5px",
                          marginTop: "12px",
                        }}
                        src={optionIcon}
                        alt="options"
                      /> */}
                      <span
                        className="flex"
                        style={{ width: "100%", height: "100%" }}
                      >
                        <div style={{ visibility: "hidden" }}>&</div>
                        <img
                          style={{
                            height: "25px",
                            width: "5px",
                            filter:
                              selectedCategoryId === item.categoryId
                                ? "brightness(0) invert(1)"
                                : "none",
                          }}
                          src={optionIcon}
                          alt="options"
                        />
                      </span>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>

            {/* Fixed add button outside scrollable area */}
            <div
              style={{
                minWidth: 56,
                maxWidth: 56,
                height: 56,
                background: "#DEDEDE",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
                flexShrink: 0, // Prevent shrinking
              }}
              onClick={() => {
                /* اکشن افزودن دسته‌بندی */
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 300 }}>+</span>
              {/* <img
                src={addIcon}
                alt="افزودن دسته"
                style={{ width: 27, height: 27, filter: "invert(1)" }}
              /> */}
            </div>
          </div>
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>
        </div>
      </div>
      <section
        style={{ zIndex: 1 }}
        className="w-full text-right mt-8 flex flex-col gap-2 overflow-y-auto"
      >
        <div className="flex justify-between">
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[50px]">
            #
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[400px]">
            نام کالا
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[180px]">
            قیمت اولیه (ریال)
          </div>
          <div className="bg-our-choice h-10 p-4 rounded-md flex items-center justify-center w-[180px]">
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
          {paginatedData?.map((item, index) => (
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
              <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[300px]">
                {item.categoryName}
              </div>
              <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[150px]">
                {getStockStatus(item.onlineStockThreshold)}
              </div>
              <div className="h-[49px] p-4 rounded-md flex items-center justify-center min-w-[180px]">
                <div>{item.discount ? formatNumber(item.discount) : "-"}</div>
                <Tooltip
                  left={20}
                  component={
                    <ProductOption
                      product={item}
                      onEdit={() => handleEditProduct(item)}
                      onDelete={() => handleDeleteProduct(item)}
                    />
                  }
                  isOpen={openProductTooltipId === item.id}
                  setIsOpen={(isOpen) =>
                    setOpenProductTooltipId(isOpen ? item.id : null)
                  }
                >
                  <img
                    className="relative right-[60px] cursor-pointer"
                    style={{ height: "25px", width: "5px", marginTop: "12px" }}
                    src={optionIcon}
                    alt="options"
                  />
                </Tooltip>
              </div>
            </div>
          ))}
        </section>
      </section>
    </>
  );
};

export default Products;
