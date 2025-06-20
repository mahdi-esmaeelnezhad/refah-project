// import useRequest from "../../hooks/useRequest";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../store/store";

// export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api2.shopp.market";

// export const PRODUCT_ENDPOINTS = {
//   shopItems: `${BASE_URL}/api/user/shop_item/list`,
// };

// interface ProductItem {
//   id: string;
//   price: number;
//   statusType: string;
//   createdBy: string;
//   createdDate: string;
//   lastModifiedBy: string;
//   lastModifiedDate: string;
//   itemDto: {
//     id: string;
//     name: string;
//     sku: string;
//     itemPictureDefaultId: number;
//     description: string;
//     price: number;
//     categoryId: {
//       id: string;
//       title: string;
//     };
//     categoryName: string;
//     rootCategoryName: string;
//     defaultImageUrl: string;
//     unitType: string;
//   };
//   isAvailable: boolean;
//   sellType: string;
//   packingCost: number;
//   onlineStockThreshold: number;
//   offlineStockThreshold: number;
//   instantStock: number;
//   instantOnlineStock: number;
//   instantOfflineStock: number;
// }

// interface ShopItemsResponse {
//   items: ProductItem[];
//   count: number;
//   page: number;
//   row: number;
// }

// export const useShopItems = () => {
//   const token = useSelector((state: RootState) => state.auth.token);
//   console.log(token, "token");

//   return useRequest<ShopItemsResponse>(PRODUCT_ENDPOINTS.shopItems, "POST", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     data: {
//       page: 8,
//       row: 5,
//     },
//   });
// };



export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api2.shopp.market";
// const shopId = localStorage.getItem("shoppId");

export const PRODUCT_ENDPOINTS = {
  // shopItems: `${BASE_URL}/api/user/shop_item/list`,
  shopItems: `${BASE_URL}/api/shop_biz/cache/item/list`,
  cacheCategoryList: `${BASE_URL}/api/shop_biz/cache/category/list`,
  // cacheVersion: `/shop_biz/cache/version/${shopId}`,

};