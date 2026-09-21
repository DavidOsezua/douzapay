import React, { type ComponentType, type FC } from "react";
import { Sheet, SheetContent, SheetHeader } from "../../ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { useSheetStore, type SheetType } from "@/zustand/settlementSheetStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "../../ui/button";
import SettlementDetails from "./settlement-details";
import WhitelistWallet from "./whitelist-wallet";

interface SheetContentConfig {
  component: ComponentType<any>;
  props: Record<string, any>;
}

export type SheetPayload = {
  "settlement-details": { settlementData: any | null };
  "whitelist-wallet": { settlementData?: any | null };
};

const sheetContentMap: Record<Exclude<SheetType, null>, SheetContentConfig> = {
  "settlement-details": {
    component: SettlementDetails,
    props: { settlementData: null },
  },
  "whitelist-wallet": {
    component: WhitelistWallet,
    props: { settlementData: null },
  },
};

type SideSheetProps = React.ComponentProps<typeof SheetPrimitive.Root>;

const SettlementSideSheet: FC<SideSheetProps> = (props) => {
  const {
    activeSheet,
    isOpen,
    closeSheet,
    payload,
    setStep,
    totalSteps,
    step,
  } = useSheetStore();
  const isMobile = useIsMobile();
  if (!activeSheet) return null;

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
          width: isMobile ? "100%" : "650px",
          maxWidth: isMobile ? "100%" : "650px",
        }}
        className="sheet-content overflow-y-auto [&>[data-testid='close-button']]:hidden [&>button]:hidden [&>button[aria-label='Close']]:hidden"
      >
        <SheetHeader />
        <div className="font-dmsans pb-8">
          <>
            <SheetControlButton
              closeSheet={closeSheet}
              currentStep={step}
              setStep={setStep}
              sheet={activeSheet}
            />
            {step && totalSteps && (
              <StepIndicator currentStep={step} totalSteps={totalSteps} />
            )}
          </>
          <ContentComponent {...contentProps} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettlementSideSheet;

interface SheetControlButtonProps {
  currentStep?: number | null;
  setStep?: (step: number) => void;
  closeSheet: () => void;
  sheet?: SheetType;
}

export const SheetControlButton: React.FC<SheetControlButtonProps> = ({
  currentStep = 1,
  setStep,
  closeSheet,
  // sheet,
}) => {
  // const { openSheet } = useSheetStore();
  const isFirstStep = currentStep === 1;
  const handleClick = () => {
    // if (sheet === "deposit-fiat" || sheet === "add-account") {
    //   openSheet("settings");
    // } else
    if (isFirstStep) {
      closeSheet();
    } else {
      setStep?.((currentStep as number) - 1);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute top-2 left-2"
      onClick={handleClick}
    >
      {isFirstStep ? <X /> : <ArrowLeft />}
    </Button>
  );
};

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <div className="flex items-center gap-2.5 px-4">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`h-2 w-12 grow rounded-full ${
            index < currentStep ? "bg-[#4C7FE7]" : "bg-[#F3F5F7]"
          }`}
        />
      ))}
    </div>
  );
};
