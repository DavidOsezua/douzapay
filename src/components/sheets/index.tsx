import React, { type ComponentType, type FC, useEffect, useRef } from "react";
import SheetControlButton from "./sheet-control-button";
import { Sheet, SheetContent, SheetHeader } from "../ui/sheet";
import StepIndicator from "./step-indicator";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { useSheetStore, type SheetType } from "@/zustand/sheetStore";
import { useIsMobile } from "@/hooks/use-mobile";
import TransactionDetails from "./contents/transaction-details";
import Deposit from "./contents/deposit";
import Withdraw from "./contents/withdraw";
import Transfer2Card from "./contents/transfer2card";
import Transfer2Wallet from "./contents/transfer2Wallet";
import CardDetails from "./contents/card-details";
import CreateCard from "./contents/create-card";
import CreateSapphireCard from "./contents/create-sapphire-card";
import CreatePlatinumCard from "./contents/create-platinum-card";
import CreateCardholder from "./contents/create-cardholder";
import EditProfile from "./contents/edit-profile";
import Referral from "./contents/referral";
import TermsAndConditions from "./contents/terms-conditions";
import AuthenticatorVerification from "./contents/authenticator-verification";
import AddContact from "./contents/add-contact";
import ContactUs from "./contents/contact-us";
import SubmitTxHash from "./contents/submit-txHash";
import PendingCards from "./contents/pending-cards";
import PendingCardDetails from "./contents/pending-card-details";
import AutoDeposit from "./contents/auto-deposit";

interface SheetContentConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
}

export type SheetPayload = {
  "transaction-details": {
    transactionData: Transaction | CardTransaction;
    type: "wallet" | "card";
  };
  deposit: {
    amount: number;
    token: string;
    depositOrder: DepositOrder | null;
  };
  autoDeposit: {
    wallet: DepositWallet;
  };
  withdraw: {};
  transfer2Card: {};
  transfer2Wallet: {};
  internalTransfer: {};
  cardDetails: { cardData: Card };
  createCard: {};
  createSapphireCard: { price?: number };
  createPlatinumCard: {
    bin: {
      id: number;
      bin: string;
      network: string;
      price: number;
      defaultPrice: number;
      topUpFee: number;
    };
  };
  createCardholder: { binId: number };
  pendingCards: {};
  pendingCardDetails: { cardData: PendingCard };
  editProfile: {};
  referral: {};
  termsCondition: {};
  twoFactor: {};
  addContact: {};
  contactUs: {};
  tutorials: {};
  watchTutorial: { variant: "welcome" | "reminder" };
  submitTxHash: { depositOrderId: number };
};

// Map sheet types to components
const sheetContentMap: Record<Exclude<SheetType, null>, SheetContentConfig> = {
  "transaction-details": {
    component: TransactionDetails,
    props: { transactionData: {}, type: "wallet" },
  },
  deposit: {
    component: Deposit,
    props: { amount: 0, token: "", depositOrder: null },
  },
  autoDeposit: {
    component: AutoDeposit,
    props: { wallet: {} as DepositWallet },
  },
  withdraw: {
    component: Withdraw,
    props: {},
  },
  pendingCards: {
    component: PendingCards,
    props: {},
  },
  pendingCardDetails: {
    component: PendingCardDetails,
    props: { cardData: {} },
  },
  transfer2Card: {
    component: Transfer2Card,
    props: {},
  },
  transfer2Wallet: {
    component: Transfer2Wallet,
    props: {},
  },
  // Rendered by its own standalone <InternalTransferSheet /> (see
  // src/components/sheets/internal-transfer-sheet.tsx) instead of this
  // centralized Radix-based sheet, so this entry is never actually reached.
  internalTransfer: {
    component: () => null,
    props: {},
  },
  cardDetails: {
    component: CardDetails,
    props: { cardData: {} },
  },
  createCard: {
    component: CreateCard as any,
    props: {},
  },
  createSapphireCard: {
    component: CreateSapphireCard as any,
    props: {},
  },
  createPlatinumCard: {
    component: CreatePlatinumCard as any,
    props: {
      bin: { id: 0, bin: "", network: "", price: 0, defaultPrice: 0, topUpFee: 0 },
    },
  },
  createCardholder: {
    component: CreateCardholder as any,
    props: { binId: 0 },
  },
  editProfile: {
    component: EditProfile as any,
    props: {},
  },
  referral: {
    component: Referral as any,
    props: {},
  },
  termsCondition: {
    component: TermsAndConditions as any,
    props: {},
  },
  twoFactor: {
    component: AuthenticatorVerification as any,
    props: {},
  },
  addContact: {
    component: AddContact as any,
    props: {},
  },
  contactUs: {
    component: ContactUs as any,
    props: {},
  },
  submitTxHash: {
    component: SubmitTxHash as any,
    props: { depositOrderId: "" },
  },
};


type SideSheetProps = React.ComponentProps<typeof SheetPrimitive.Root>;

const SideSheet: FC<SideSheetProps> = (props) => {
  const {
    activeSheet,
    isOpen,
    step,
    totalSteps,
    showSteps,
    closeSheet,
    setStep,
    payload,
  } = useSheetStore();
  const isMobile = useIsMobile();
  const prevStepRef = useRef(step);

  // Push initial history state when sheet opens at step 1
  useEffect(() => {
    if (!activeSheet || !isOpen || step !== 1) return;
    window.history.pushState({ sheet: activeSheet, step: 1 }, "");
    prevStepRef.current = 1;
  }, [isOpen, step, activeSheet]);

  // Push history state only when advancing steps (forward)
  useEffect(() => {
    if (!activeSheet || !isOpen) return;
    if (step > prevStepRef.current) {
      window.history.pushState({ sheet: activeSheet, step }, "");
      prevStepRef.current = step;
    } else {
      prevStepRef.current = step;
    }
  }, [step, isOpen, activeSheet]);

  // Listen for back navigation (popstate)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (!isOpen || !activeSheet) return;
      if (e.state?.sheet === activeSheet) {
        // Back to a previous step in this sheet
        setStep(e.state.step);
      } else {
        // Back out of the sheet entirely (from step 1)
        closeSheet();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, activeSheet, setStep, closeSheet]);

  if (!activeSheet || activeSheet === "internalTransfer") return null;

  const { component: ContentComponent, props: defaultProps } =
    sheetContentMap[activeSheet];

  const contentProps = {
    ...defaultProps,
    ...payload,
    ...(step && { step }),
    setStep,
    closeSheet,
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => !open && closeSheet()}
      {...props}
    >
      <SheetContent
        style={{
          width: isMobile ? "100%" : "465px",
          maxWidth: isMobile ? "100%" : "465px",
        }}
        className="sheet-content overflow-y-auto border-none bg-[#181818] px-4 text-white [&>[data-testid='close-button']]:hidden [&>button]:hidden [&>button[aria-label='Close']]:hidden"
      >
        <SheetHeader />
        <div>
          <>
            <SheetControlButton
              closeSheet={closeSheet}
              currentStep={step}
              setStep={setStep}
              sheet={activeSheet}
            />
            {step && totalSteps && showSteps && (
              <StepIndicator currentStep={step} totalSteps={totalSteps} />
            )}
          </>

          <div className="relative">
            <div className="relative z-10">
              <ContentComponent {...contentProps} />
            </div>
            {/* <img
              src="/images/bg-logo.svg"
              alt=""
              className="absolute top-1/2 right-1/2 z-0 size-60 translate-x-1/2 -translate-y-1/2"
            /> */}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideSheet;
