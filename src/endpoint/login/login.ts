export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://api2.shopp.market";

export const AUTH_ENDPOINTS = {
  login: `${BASE_URL}/api/authenticate_pardakhtyar`,
  resetPassword: `${BASE_URL}/api/account/reset_mobile_password/init`,
  verifyMobileCode: `${BASE_URL}/api/account/reset_mobile_password/mobile_code_verification`,
  changePassword: `${BASE_URL}/api/account/change_password`,
};
