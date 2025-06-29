
export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api2.shopp.market";
export const PRODUCT_ENDPOINTS = {
  shopItems: `${BASE_URL}/api/shop_biz/cache/item/list`,
  cacheCategoryList: `${BASE_URL}/api/shop_biz/cache/category/list`,
  factorList : `${BASE_URL}/api/shop_biz/sale/list`,
  updateCustomer: `${BASE_URL}/api/shop_biz/customers`,
  customerList: `${BASE_URL}/api/shop_biz/customers/list?page=0&size=1000&sort=id,desc`,
  customerSalesList: `${BASE_URL}/api/shop_biz/report/customer_sales`,
  customerInfo: `${BASE_URL}/api/shop_biz/report/customer_sales`,
  deleteCustomer: `${BASE_URL}/api/shop_biz/customers`,
};