import { useEffect } from "react";
import { useSelector } from "react-redux";
import useRequest from "../../hooks/useRequest";
import { BASE_ENDPOINTS } from "../../endpoint/base/base";
import { PRODUCT_ENDPOINTS } from "../../endpoint/product/product";
import type { RootState } from "../../store/store";
import axios from "axios";

const ShopInfoInitializer: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);

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
  const { execute: getCustomers } = useRequest<any>(
    PRODUCT_ENDPOINTS.customerList,
    "POST",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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
            const cacheProductListRes = await getCacheProductList({
              shopId,
              version: cacheRes.data.product,
            });
            localStorage.setItem(
              "cacheProductList",
              JSON.stringify(cacheProductListRes?.data)
            );

            const searchPayload = {
              conditionType: "OR",
              conditions: [],
              values: [],
            };
            const customersRes = await getCustomers({
              searchPayload,
              page: 1,
              sort: "id,desc",
              size: 100, // تعداد بیشتری مشتری دریافت کن
            });
            localStorage.setItem(
              "customers",
              JSON.stringify(customersRes?.data)
            );
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
