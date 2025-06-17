import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  barcode: string;
  isCartPaymentOpen: boolean;
  isCartPaymentLoading: boolean;
  isCartPaymentPassword: boolean;
  isSuccessPaymentOpen: boolean;
  isFailedPaymentOpen: boolean;
  openModal: (barcode: string) => void;
  closeModal: () => void;
  openCartPayment: () => void;
  closeCartPayment: () => void;
  openCartPaymentLoading: () => void;
  closeCartPaymentLoading: () => void;
  openCartPaymentPassword: () => void;
  closeCartPaymentPassword: () => void;
  openSuccessPayment: () => void;
  closeSuccessPayment: () => void;
  openFailedPayment: () => void;
  closeFailedPayment: () => void;
}

export const useModal = create<ModalState>((set) => ({
  isOpen: false,
  barcode: '',
  isCartPaymentOpen: false,
  isCartPaymentLoading: false,
  isCartPaymentPassword: false,
  isSuccessPaymentOpen: false,
  isFailedPaymentOpen: false,
  openModal: (barcode: string) => set({ isOpen: true, barcode }),
  closeModal: () => set({ isOpen: false, barcode: '' }),
  openCartPayment: () => set({ isCartPaymentOpen: true }),
  closeCartPayment: () => set({ isCartPaymentOpen: false }),
  openCartPaymentLoading: () => set({ isCartPaymentLoading: true }),
  closeCartPaymentLoading: () => set({ isCartPaymentLoading: false }),
  openCartPaymentPassword: () => set({ isCartPaymentPassword: true }),
  closeCartPaymentPassword: () => set({ isCartPaymentPassword: false }),
  openSuccessPayment: () => set({ isSuccessPaymentOpen: true }),
  closeSuccessPayment: () => set({ isSuccessPaymentOpen: false }),
  openFailedPayment: () => set({ isFailedPaymentOpen: true }),
  closeFailedPayment: () => set({ isFailedPaymentOpen: false }),
})); 