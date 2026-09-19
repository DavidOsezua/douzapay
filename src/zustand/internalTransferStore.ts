import { create } from "zustand";

export type Payee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

interface InternalTransferState {
  confirmedPayee: Payee | null;
  confirmedAsset: UserAsset | null;
  setConfirmedPayee: (payee: Payee | null) => void;
  setConfirmedAsset: (asset: UserAsset | null) => void;
  reset: () => void;
}

export const useInternalTransferStore = create<InternalTransferState>()(
  (set) => ({
    confirmedPayee: null,
    confirmedAsset: null,
    setConfirmedPayee: (payee) => set({ confirmedPayee: payee }),
    setConfirmedAsset: (asset) => set({ confirmedAsset: asset }),
    reset: () => set({ confirmedPayee: null, confirmedAsset: null }),
  }),
);
