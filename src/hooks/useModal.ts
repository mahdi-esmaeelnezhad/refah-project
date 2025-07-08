// useModal.ts
import { create } from 'zustand';

// Add these interfaces here (same as in factor.tsx and FactorPrintWeb.tsx)
interface ShopBizItemDto {
  itemId: string;
  sku: string;
  name: string;
  unitType: string;
  categoryId: string;
  price: number;
  discount: number;
  discountPerItem: number;
  description: string;
  brandId: string | null;
  statusType: string;
  saleCount: number;
  totalAmount: number;
}
interface Customer {
  id: string;
  displayName: string;
  mobile: string;
}
interface ShopBizPaymentDto {
  id: string;
  saleTxId: string;
  status: number;
  method: number;
  receiveAmount: number;
  totalAmount: number;
}

interface Factor {
  id: string;
  shopId: string;
  shopFarsiName: string;
  shopAddress: string;
  shopTelephoneNumber: string;
  saleStatus: string;
  deliveryStatus: string;
  offlineCode: number;
  tip: number;
  amount: number;
  totalAmount: number;
  tax: number;
  createdDate: string; // ISO date
  version: number;
  shopBizItemDtoList: ShopBizItemDto[]; // Corrected type
  shopBizPaymentDtoList: ShopBizPaymentDto[]; // Corrected type
  customerDto: Customer; // Corrected type and made required
  hasOpinion: boolean;
  receiptCode: string;
  deviceDate: string; // ISO date
  userDiscount: number;
  shopBizSalePaymentMethod: number;
  shopBizPaymentAmount: number;
  shippingCost: number;
  isBNPL: boolean;
  taxInvoiceType: string;
}

interface ModalState {
  isOpen: boolean;
  isCategoryOpen: boolean;
  barcode: string;
  isCartPaymentOpen: boolean;
  isCartPaymentLoading: boolean;
  isCartPaymentPassword: boolean;
  isSendSmsModalOpen: boolean;
  isSuccessPaymentOpen: boolean;
  isFailedPaymentOpen: boolean;
  isProductNotFoundOpen: boolean;
  isCloseSendSmsModal: boolean;
  isSendPaykModalOpen: boolean;
  notFoundBarcode: string;
  // New states for FactorPrintWeb modal
  isFactorPrintOpen: boolean;
  selectedFactorForPrint: Factor | null;
  openModal: (barcode: string) => void;
  closeModal: () => void;
  openProductNotFoundModal: (barcode: string) => void;
  closeProductNotFoundModal: () => void;
  openCartPayment: () => void;
  closeCartPayment: () => void;
  openCartPaymentLoading: () => void;
  closeCartPaymentLoading: () => void;

  closeSendSmsModal: () => void;
  openSendSmsModal: () => void;
  openCartPaymentPassword: () => void;
  closeCartPaymentPassword: () => void;
  openSuccessPayment: () => void;
  closeSuccessPayment: () => void;
  openFailedPayment: () => void;
  closeFailedPayment: () => void;
  openSendPaykModal: () => void;
  closeSendPaykModal: () => void;
  // New functions for FactorPrintWeb modal
  openFactorPrintModal: (factor: Factor) => void;
  closeFactorPrintModal: () => void;
}

export const useModal = create<ModalState>((set) => ({
  isOpen: false,
  isCategoryOpen: false,
  barcode: '',
  isCartPaymentOpen: false,
  isCloseSendSmsModal: false,
  isCartPaymentLoading: false,
  isSendSmsModalOpen : false,
  isCartPaymentPassword: false,
  isSuccessPaymentOpen: false,
  isFailedPaymentOpen: false,
  isProductNotFoundOpen: false,
  isSendPaykModalOpen: false,
  notFoundBarcode: '',
  isFactorPrintOpen: false, // Initial state for FactorPrintWeb modal
  selectedFactorForPrint: null, // Initial state for selected factor data
  openModal: (barcode: string) => set({ isOpen: true, barcode }),
  closeModal: () => set({ isOpen: false, barcode: '' }),
  openProductNotFoundModal: (barcode: string) => set({ isProductNotFoundOpen: true, notFoundBarcode: barcode }),
  closeProductNotFoundModal: () => set({ isProductNotFoundOpen: false, notFoundBarcode: '' }),
  openCartPayment: () => set({ isCartPaymentOpen: true }),
  closeCartPayment: () => set({ isCartPaymentOpen: false }),
  openCartPaymentLoading: () => set({ isCartPaymentLoading: true }),
  closeSendSmsModal: () => set({ isSendSmsModalOpen: false }),
  closeCartPaymentLoading: () => set({ isCartPaymentLoading: false }),
  openSendSmsModal: () => set({ isSendSmsModalOpen: true }),
  openCartPaymentPassword: () => set({ isCartPaymentPassword: true }),
  closeCartPaymentPassword: () => set({ isCartPaymentPassword: false }),
  openSuccessPayment: () => set({ isSuccessPaymentOpen: true }),
  closeSuccessPayment: () => set({ isSuccessPaymentOpen: false }),
  openFailedPayment: () => set({ isFailedPaymentOpen: true }),
  closeFailedPayment: () => set({ isFailedPaymentOpen: false }),
  openSendPaykModal: () => set({ isSendPaykModalOpen: true }),
  closeSendPaykModal: () => set({ isSendPaykModalOpen: false }),
  openFactorPrintModal: (factor: Factor) => set({ isFactorPrintOpen: true, selectedFactorForPrint: factor }),
  closeFactorPrintModal: () => set({ isFactorPrintOpen: false, selectedFactorForPrint: null }),
}));