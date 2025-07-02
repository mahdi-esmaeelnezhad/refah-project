export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api2.shopp.market";
export const PRODUCT_ENDPOINTS = {
  factorList : `${BASE_URL}/api/shop_biz/sale/list`,
  updateCustomer: `${BASE_URL}/api/shop_biz/customers`,
  addProduct: `${BASE_URL}/api/shop_biz/shop_items`,
  deleteProduct: (id: string | number) => `${BASE_URL}/api/shop_biz/shop_items/${id}`,
  customerList: `${BASE_URL}/api/shop_biz/customers/list`,
  customerSalesList: `${BASE_URL}/api/shop_biz/report/customer_sales`,
  customerInfo: `${BASE_URL}/api/shop_biz/report/customer_sales`,
  deleteCustomer: `${BASE_URL}/api/shop_biz/customers`,
};