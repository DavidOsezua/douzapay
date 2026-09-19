import { ArrowLeft, X } from "lucide-react";
import { Button } from "../ui/button";
import type { SheetType } from "@/zustand/sheetStore";

interface SheetControlButtonProps {
  currentStep?: number | null;
  setStep?: (step: number) => void;
  closeSheet: () => void;
  sheet?: SheetType;
}

const SheetControlButton: React.FC<SheetControlButtonProps> = ({
  currentStep = 1,
  setStep,
  closeSheet,
  sheet,
}) => {
  const isFirstStep = currentStep === 1;
  const handleClick = () => {
    if (isFirstStep) {
      closeSheet();
    } else if (
      sheet === "send-fiat" &&
      (currentStep === 3 || currentStep === 4)
    ) {
      setStep?.(2);
    } else {
      setStep?.((currentStep as number) - 1);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className="absolute top-2 left-2 bg-transparent text-white hover:bg-white/10 hover:text-white"
      onClick={handleClick}
    >
      {isFirstStep ? <X /> : <ArrowLeft />}
    </Button>
  );
};

export default SheetControlButton;
