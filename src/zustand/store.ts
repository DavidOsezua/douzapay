import { create } from "zustand";

export const useAuthenticatorCode = create(() => ({
  authModalIsOpen: false,
}));

export const useUser = create<{ user: Partial<UserProfile> | null }>((set) => ({
  user: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    balance: 0,
  },

  setUser: (user: UserProfile) => set({ user }),
}));

export const useWalletStore = create(() => ({
  wallet: {
    id: "",
    balances: [] as unknown[],
  },
}));

export const useDepositStore = create(() => ({
  depositOrder: {
    amount: "0",
    completed: false,
    id: null as number | null,
    status: "pending" as DepositOrder["status"],
    userId: "",
  },
}));

export const useTransferStore = create(() => ({
  transferOptionIsOpen: false,
}));

type CardsState = {
  cardId: string | null;
  cardStatus: Card["status"] | null;
  freezeIsOpen: boolean;
  deleteIsOpen: boolean;
  isCardDetailsOpen: boolean;
  isConfirmPasswordOpen: boolean;
};

export const useCardsStore = create<CardsState>(() => ({
  cardId: null,
  cardStatus: null,
  freezeIsOpen: false,
  deleteIsOpen: false,
  isCardDetailsOpen: false,
  isConfirmPasswordOpen: false,
}));

type AdminModalsState = {
  createUserIsOpen: boolean;
  createCardIsOpen: boolean;
  editUserIsOpen: boolean;
  editUserData: Partial<User> | null;
  deleteUserIsOpen: boolean;
  deleteUserData: Partial<User> | null;
  createCardData: Partial<User> | null;
  transactionDetailsIsOpen: boolean;
  transactionDetailsData: any;

  cardDetailsIsOpen: boolean;
  cardDetailsData: Partial<AdminCard> | null;

  assignCardIsOpen: boolean;
  assignCardData: Partial<AdminCard> | null;

  cardTopupDetailsData: any;
  cardTopupDetailsIsOpen: boolean;
  cardSpendingDetailsData: any;
  cardSpendingDetailsIsOpen: boolean;

  transferCommisionIsOpen: boolean;
  transferCommisionData: Partial<User> | null;

  deleteCardIsOpen: boolean;
  deleteCardData: Partial<AdminCard> | null;

  freezeCardIsOpen: boolean;
  freezeCardData: Partial<AdminCard> | null;

  addWalletIsOpen: boolean;

  // Set by earnings.tsx's "Settle" button but never read anywhere; kept for
  // parity with existing (already inert) behavior.
  settlementIsOpen?: boolean;
  settlementData?: any;
};

export const useAdminModals = create<AdminModalsState>(() => ({
  createUserIsOpen: false,
  createCardIsOpen: false,
  editUserIsOpen: false,
  editUserData: null,
  deleteUserIsOpen: false,
  deleteUserData: null,
  createCardData: null,
  transactionDetailsIsOpen: false,
  transactionDetailsData: null,

  cardDetailsIsOpen: false,
  cardDetailsData: null,

  assignCardIsOpen: false,
  assignCardData: null,

  cardTopupDetailsData: null,
  cardTopupDetailsIsOpen: false,
  cardSpendingDetailsData: null,
  cardSpendingDetailsIsOpen: false,

  transferCommisionIsOpen: false,
  transferCommisionData: null,

  deleteCardIsOpen: false,
  deleteCardData: null,

  freezeCardIsOpen: false,
  freezeCardData: null,

  addWalletIsOpen: false,
}));

export const useLoadingStore = create((set) => ({
  stateIsLoading: false,
  setIsLoading: (isLoading: boolean) => set({ stateIsLoading: isLoading }),
}));
