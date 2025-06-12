export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api2.shopp.market/api";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export interface ChangeShopResponse {
  success: boolean;
  message: string;
}

const endpoints = {
  auth: {
    login: "/api/authenticate_pardakhtyar",
    changePassword: "/api/shop_biz/change-password",
    forgotPassword: "/api/shop_biz/forgot-password",
    verifyOTP: "/api/shop_biz/verify-otp",
  },
  shop: {
    change: "/api/shop_biz/change_shop/s4u2IXzi0wSCSc1j36CByg,3D,3D",
    getDetails: "/api/shop_biz/details",
    update: "/api/shop_biz/update",
  },
} as const;

export const getFullUrl = (path: string): string => {
  return `${BASE_URL}${path}`;
};

export default endpoints;
