
export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api2.shopp.market";
export const PRODUCT_ENDPOINTS = {
  shopItems: `${BASE_URL}/api/shop_biz/cache/item/list`,
  cacheCategoryList: `${BASE_URL}/api/shop_biz/cache/category/list`,
  factorList : `${BASE_URL}/api/shop_biz/sale/list'`
};