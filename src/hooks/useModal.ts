import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  barcode: string;
  openModal: (barcode: string) => void;
  closeModal: () => void;
}

export const useModal = create<ModalState>((set) => ({
  isOpen: false,
  barcode: '',
  openModal: (barcode: string) => set({ isOpen: true, barcode }),
  closeModal: () => set({ isOpen: false, barcode: '' }),
})); 