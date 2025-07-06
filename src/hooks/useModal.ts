import { create } from 'zustand';

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
})); 