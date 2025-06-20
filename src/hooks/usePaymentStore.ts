import { create } from 'zustand';

interface PaymentState {
  editableAmount: number;
  setEditableAmount: (amount: number) => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  editableAmount: 0,
  setEditableAmount: (amount) => set({ editableAmount: amount }),
})); 