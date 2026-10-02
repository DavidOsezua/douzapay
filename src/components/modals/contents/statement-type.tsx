import { useState, type ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSheetStore } from "@/zustand/sheetStore";
import WalletIcon from "@/components/icons/wallet-icon";
import CardIcon from "@/components/icons/card-icon";
import type { IconProps } from "@/components/icons/type";

type Mode = "wallet" | "card";

const OPTIONS: { value: Mode; title: string; Icon: ComponentType<IconProps> }[] = [
  { value: "wallet", title: "Wallet", Icon: WalletIcon },
  { value: "card", title: "Card", Icon: CardIcon },
];

const StatementType = ({ closeModal }: { closeModal: () => void }) => {
  const [mode, setMode] = useState<Mode>("wallet");
  const { openSheet } = useSheetStore();

  const handleContinue = () => {
    closeModal();
    // Wallet is a single step (date form); card is two (pick a card, then the
    // date form) — totalSteps must be set for the sheet's setStep to do
    // anything, so only pass it for the card flow.
    openSheet("statement", mode === "card" ? 2 : null, { mode }, false);
  };

  return (
    <div className="text-white">
      <p className="text-lg font-semibold">Statement</p>
      <p className="text-sm font-light">
        Please select the statement you want to download
      </p>
      <div
        role="radiogroup"
        aria-label="Statement type"
        className="mt-4 space-y-2.5"
      >
        {OPTIONS.map(({ value, title, Icon }) => {
          const selected = mode === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setMode(value)}
              className={cn(
                "flex min-h-12 w-full items-center justify-between gap-4 rounded-lg border px-2.5 py-2 text-sm transition-all",
                selected
                  ? "text-[#242424] border-dark-primary-main bg-dark-primary-main"
                  : "border-white/15 hover:bg-white/[0.05]",
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={cn("size-5", !selected && "text-white/80")} />
                <span className="font-medium">{title}</span>
              </span>
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border",
                  selected ? "border-[#242424]" : "border-dark-primary-main",
                )}
              >
                {selected && <span className="size-2 rounded-full bg-[#242424]" />}
              </span>
            </button>
          );
        })}
      </div>
      <Button
        onClick={handleContinue}
        className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 h-11 w-full rounded-md"
      >
        Continue
      </Button>
    </div>
  );
};

export default StatementType;
