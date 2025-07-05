export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api2.shopp.market";
export const PRODUCT_ENDPOINTS = {
  factorList : `${BASE_URL}/api/shop_biz/sale/list`,
  updateCustomer: `${BASE_URL}/api/shop_biz/customers`,
  shoppInfo: `${BASE_URL}/api/account_shop_biz`,
  cacheCategoryList: `${BASE_URL}/api/shop_biz/cache/category/list`,
  addProduct: `${BASE_URL}/api/shop_biz/shop_items`,
  deleteProduct: (id: string | number) => `${BASE_URL}/api/shop_biz/shop_items/${id}`,
  customerList: `${BASE_URL}/api/shop_biz/customers/list`,
  addCustomer: `${BASE_URL}/api/shop_biz/customers`,
  deleteCustomer: (id: string | number) => `${BASE_URL}/api/shop_biz/customers/${id}`,
  customerSalesList: `${BASE_URL}/api/shop_biz/report/customer_sales`,
  customerInfo: `${BASE_URL}/api/shop_biz/report/customer_sales`,
};