// store/sheetStore.ts
import type { SheetPayload } from "@/components/admin-sheets";
import { create } from "zustand";

export type SheetType = "settings" | null;

interface SheetState {
  activeSheet: SheetType;
  isOpen: boolean;
  step: number | null;
  totalSteps: number | null;
  payload: SheetPayload[keyof SheetPayload] | null;
  openSheet: <T extends Exclude<SheetType, null>>(
    sheetType: T,
    totalSteps?: number | null,
    payload?: SheetPayload[T],
  ) => void;
  closeSheet: () => void;
  setStep: (step: number) => void;
}

export const useSheetStore = create<SheetState>((set) => ({
  activeSheet: null,
  isOpen: false,
  step: null,
  totalSteps: null,
  payload: null,
  openSheet: (sheetType, totalSteps = null, payload = undefined) =>
    set({
      activeSheet: sheetType,
      isOpen: true,
      step: 1,
      totalSteps,
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
