import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/zustand/sheetStore";
import { useSwapCountdown } from "@/hooks/use-swap-countdown";
import { SWAP_ESTIMATED_MS } from "@/lib/swap";

const SwapProcessing = ({
  swap,
  closeModal,
}: {
  swap: Swap;
  closeModal: () => void;
}) => {
  const openSheet = useSheetStore((s) => s.openSheet);
  const { remaining, label } = useSwapCountdown(
    new Date(swap.updatedAt).getTime() + SWAP_ESTIMATED_MS,
  );

  return (
    <div className="my-4 flex w-full flex-col items-center gap-4">
      <div
        className="flex size-16 items-center justify-center rounded-full border border-dark-primary-main"
        style={{
          background:
            "linear-gradient(100.47deg, rgba(225, 225, 225, 0.4) 9.36%, rgba(225, 225, 225, 0.15) 100%)",
        }}
      >
        <Loader2 className="size-7 animate-spin text-dark-primary-main" />
      </div>
      <div className="mt-2 text-center">
        <p className="text-2xl font-medium">Swap in Progress</p>
        <p className="mx-auto mt-2 max-w-[85%] text-xs leading-4 font-light text-white/60">
          Your {swap.fromSymbol} is being swapped to {swap.toSymbol}. This
          usually takes a few minutes. We&apos;ll notify you once it&apos;s
          completed.
        </p>
        {remaining > 0 && (
          <div className="mt-3">
            <p className="text-xs text-white/60">Estimated completion in</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{label}</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex w-full items-center gap-2">
        <Button
          onClick={closeModal}
          className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 h-11 grow"
        >
          Continue
        </Button>
        <Button
          onClick={() => {
            closeModal();
            openSheet("swap-details", null, { swap }, false);
          }}
          className="border-dark-primary-main hover:bg-dark-primary-main hover:text-[#242424] h-11 grow border bg-transparent text-white"
        >
          See Details
        </Button>
      </div>
    </div>
  );
};

export default SwapProcessing;
