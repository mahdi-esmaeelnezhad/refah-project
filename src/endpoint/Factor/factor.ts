export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api2.shopp.market";
export const FACTOR_ENDPOINTS = {

  factor : `${BASE_URL}/api/shop_biz/sale`,
  // add page and size to the url
  factorList : (page: number, size: number) => `${BASE_URL}/api/shop_biz/user/report/seller_simple_sale/list?page=${page}&size=${size}`
  // factorList : `${BASE_URL}/api/shop_biz/sale/list`,
  // factorDetail : `${BASE_URL}/api/shop_biz/sale/`
}