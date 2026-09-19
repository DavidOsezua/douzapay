import { create } from "zustand";
import type { ModalPayload } from "@/components/modals";

type ModalType = keyof ModalPayload | null;

interface ModalState {
  isOpen: boolean;
  modalType: ModalType;
  modalProps: ModalPayload[keyof ModalPayload] | Record<string, any>;
  openModal: (
    modalType: ModalType,
    modalProps?: ModalPayload[keyof ModalPayload],
  ) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  isOpen: false,
  modalType: null,
  modalProps: {},
  openModal: (modalType, modalProps) =>
    set({ isOpen: true, modalType, modalProps }),
  closeModal: () => set({ isOpen: false, modalType: null, modalProps: {} }),
}));
