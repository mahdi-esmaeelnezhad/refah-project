import { useEffect } from "react";
// import { useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { BASE_ENDPOINTS } from "../../endpoint/base/base";
import { PRODUCT_ENDPOINTS } from "../../endpoint/product/product";
// import type { RootState } from "../../store/store";
import axios from "axios";
import { ProductDataService } from "../../utils/productService";
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
const ShopInfoInitializer: React.FC = () => {
  const token = localStorage.getItem("token");

  const { execute: getShopInfo } = useRequest<any>(
    BASE_ENDPOINTS.shoppInfo,
    "GET",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { execute: getCacheCategoryList } = useRequest<any>(
    BASE_ENDPOINTS.cacheCategoryList,
    "POST",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { execute: getCacheBrandList } = useRequest<any>(
    BASE_ENDPOINTS.cacheBrandList,
    "POST",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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

    // بررسی نیاز به به‌روزرسانی
    if (
      !ProductDataService.shouldUpdateData() &&
      ProductDataService.hasData()
    ) {
      return;
    }

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
      let processedData: ProductItem[] = cacheProductList.map((item: any) => ({
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
      }));
      const availableProducts = processedData.filter(
        (item) => item.isAvailable
      );

      // ذخیره با استفاده از سرویس
      ProductDataService.setProductData(availableProducts);

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
    }
  };
  // const { execute: getCacheProductList } = useRequest<any>(
  //   BASE_ENDPOINTS.cacheProductList,
  //   "POST",
  //   {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }
  // );
  useEffect(() => {
    const fetchShopInfo = async () => {
      if (!token) return;
      try {
        const shopInfoRes: any = await getShopInfo();
        const shopInfo = shopInfoRes?.data;
        localStorage.setItem("shopInfo", JSON.stringify(shopInfo));

        const shopId = shopInfo?.extraData.shopId;
        if (shopId) {
          localStorage.setItem("shopId", shopId.toString());

          const cacheRes = await axios.get(
            BASE_ENDPOINTS.shopCacheVersion(shopId),
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          localStorage.setItem(
            "shopCacheVersion",
            JSON.stringify(cacheRes.data)
          );
          if (cacheRes.data) {
            const cacheCategoryListRes = await getCacheCategoryList({
              shopId,
              version: cacheRes.data.category,
            });
            localStorage.setItem(
              "cacheCategoryList",
              JSON.stringify(cacheCategoryListRes?.data)
            );
            const cacheBrandListRes = await getCacheBrandList({
              shopId,
              version: cacheRes.data.brand,
            });
            localStorage.setItem(
              "cacheBrandList",
              JSON.stringify(cacheBrandListRes?.data)
            );

            const searchPayload = {
              conditionType: "OR",
              conditions: [],
              values: [],
            };
            const customersRes = await axios.post(
              PRODUCT_ENDPOINTS.customerList(0, 1000),
              {
                searchPayload,
                sort: "id,desc",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("customersRes", customersRes);
            localStorage.setItem(
              "customers",
              JSON.stringify(customersRes?.data)
            );
            getInfo();
          }
        }
      } catch (err) {
        console.error("Error fetching shop info or cache version", err);
      }
    };
    fetchShopInfo();
  }, [token]);

  return null;
};

export default ShopInfoInitializer;
