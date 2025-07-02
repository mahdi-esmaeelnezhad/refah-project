export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api2.shopp.market";

export const BASE_ENDPOINTS = {
    shoppInfo: `${BASE_URL}/api/account_shop_biz`,
    cacheCategoryList: `${BASE_URL}/api/shop_biz/cache/category/list`,
    cacheBrandList: `${BASE_URL}/api/shop_biz/cache/brand/list`,
    cacheProductList: `${BASE_URL}/api/shop_biz/cache/item/list`,
    shopCacheVersion: (shopId: string | number) => `${BASE_URL}/api/shop_biz/cache/version/${shopId}`,
  };
  
