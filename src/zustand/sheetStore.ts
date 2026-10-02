// store/sheetStore.ts
import type { SheetPayload } from "@/components/sheets";
import { create } from "zustand";

export type SheetType =
  | "transaction-details"
  | "deposit"
  | "autoDeposit"
  | "withdraw"
  | "pendingCards"
  | "pendingCardDetails"
  | "transfer2Card"
  | "transfer2Wallet"
  | "internalTransfer"
  | "cardDetails"
  | "createCard"
  | "createSapphireCard"
  | "createPlatinumCard"
  | "createCardholder"
  | "editProfile"
  | "referral"
  | "termsCondition"
  | "twoFactor"
  | "addContact"
  | "contactUs"
  | "submitTxHash"
  | "swap-details"
  | "statement"
  | null;

interface SheetState {
  activeSheet: SheetType;
  isOpen: boolean;
  step: number | null;
  totalSteps: number | null;
  showSteps: boolean;
  payload: SheetPayload[keyof SheetPayload] | null;
  openSheet: <T extends Exclude<SheetType, null>>(
    sheetType: T,
    totalSteps?: number | null,
    payload?: SheetPayload[T],
    showSteps?: boolean,
  ) => void;
  closeSheet: () => void;
  setStep: (step: number) => void;
}

export const useSheetStore = create<SheetState>((set) => ({
  activeSheet: null,
  isOpen: false,
  step: null,
  totalSteps: null,
  showSteps: true,
  payload: null,
  openSheet: (
    sheetType,
    totalSteps = null,
    payload = undefined,
    showSteps = true,
  ) =>
    set({
      activeSheet: sheetType,
      isOpen: true,
      step: 1,
      totalSteps,
      showSteps,
      payload,
    }),
  closeSheet: () =>
    set({
      activeSheet: null,
      isOpen: false,
      step: null,
      totalSteps: null,
    }),
  setStep: (step) => set((state) => ({ step: state.totalSteps ? step : null })),
}));
