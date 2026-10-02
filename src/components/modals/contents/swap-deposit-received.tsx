import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  CircleCheck,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/zustand/modalStore";
import { useProceedSwap } from "@/hooks/use-mutations";
import { formatAmount } from "@/lib/utils";
import SwapTokenIcon from "@/pages/dashboard/_misc/swap/swap-token-icon";
import { formatTokenAmount } from "@/pages/dashboard/_misc/swap/swap-helpers";

const cardClass = "rounded-2xl border border-white/10 bg-white/5";

const labelClass = "text-[10px] font-normal text-white/50";

// Token disc with two translucent ripple circles behind it.
const RippleDisc = ({
  symbol,
  src,
}: {
  symbol: string;
  src?: string | null;
}) => (
  <div className="relative">
    <span className="short:hidden absolute -inset-3 rounded-full bg-white/5" />
    <span className="short:hidden absolute -inset-6 rounded-full bg-white/5" />
    <SwapTokenIcon
      symbol={symbol}
      src={src}
      className="short:size-12 relative z-10 size-16 lg:size-24"
    />
  </div>
);

const SwapDepositReceived = ({
  swap,
}: {
  swap: Swap;
  closeModal: () => void;
}) => {
  const openModal = useModalStore((s) => s.openModal);

  const { mutate: proceed, isPending } = useProceedSwap({
    onSuccess: (updated) => openModal("swapProcessing", { swap: updated }),
  });

  return (
    <div>
      <div className="short:mt-1 short:mb-3 pointer-events-none relative mt-6 mb-3 flex items-center justify-center">
        <RippleDisc symbol={swap.fromSymbol} src={swap.fromIcon} />
        <span className="short:size-8 relative z-20 mx-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#242424] lg:size-12">
          <ArrowRight className="short:size-3.5 size-4 lg:size-5" />
        </span>
        <RippleDisc symbol={swap.toSymbol} src={swap.toIcon} />
      </div>

      <div className="short:max-h-[calc(100dvh-11rem)] max-h-[calc(100dvh-16rem)] overflow-y-auto pb-1">
        <p className="short:mt-1 short:text-[11px] mt-1 flex items-center justify-center gap-1.5 text-xs text-dark-success-200">
          <CircleCheck className="size-3.5" /> Deposit Received
        </p>
        <h3 className="short:mt-1 short:text-lg mt-1.5 text-center text-2xl font-semibold">
          You&apos;ve deposited {swap.fromSymbol}
        </h3>
        <p className="short:mt-1 short:text-[11px] short:leading-4 mt-2 text-center text-sm leading-5 font-light text-white/70">
          You can only fund your card with stablecoins. Would you like to swap
          your received {swap.fromSymbol} to {swap.toSymbol} or withdraw it
          back to your wallet?
        </p>

        <div
          className={`${cardClass} short:mt-2 short:py-1.5 mt-5 flex items-center justify-between px-4 py-2.5`}
        >
          <div>
            <p className={labelClass}>Deposited Amount</p>
            <p className="short:text-sm mt-1 text-lg font-semibold">
              {formatTokenAmount(swap.fromAmount)} {swap.fromSymbol}
            </p>
            {swap.amountUsd != null && (
              <p className={labelClass}>${formatAmount(swap.amountUsd)} USD</p>
            )}
          </div>
          <span className="short:px-2.5 short:py-1 short:text-[11px] rounded-full bg-dark-primary-main/10 px-3 py-1.5 text-xs text-dark-primary-200">
            {swap.networkLabel}
          </span>
        </div>

        <div
          className={`${cardClass} short:py-1.5 mt-2 flex items-center justify-between px-4 py-2.5`}
        >
          <div className="flex items-center gap-3">
            <SwapTokenIcon
              symbol={swap.fromSymbol}
              src={swap.fromIcon}
              className="short:size-8 size-10"
            />
            <div>
              <p className={labelClass}>From</p>
              <p className="short:text-sm font-semibold">{swap.fromSymbol}</p>
              <p className={labelClass}>{swap.fromName}</p>
            </div>
          </div>
          <ArrowRight className="short:size-4 size-5 text-white/70" />
          <div className="flex items-center gap-3">
            <SwapTokenIcon
              symbol={swap.toSymbol}
              src={swap.toIcon}
              className="short:size-8 size-10"
            />
            <div>
              <p className={labelClass}>To</p>
              <p className="short:text-sm font-semibold">{swap.toSymbol}</p>
              <p className={labelClass}>{swap.toNetworkLabel}</p>
            </div>
          </div>
        </div>

        <div className="short:p-2 mt-3 flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
          <Info className="short:size-3.5 mt-0.5 size-4 shrink-0 text-dark-primary-200" />
          <p className="short:text-[11px] short:leading-[14px] text-xs leading-4 text-dark-primary-200">
            Swapping will convert your {swap.fromSymbol} to {swap.toSymbol} at
            the current market rate, and the {swap.toSymbol} will be available
            in your wallet to fund your card.
          </p>
        </div>

        <div className="short:mt-3 short:space-y-2 mt-4 space-y-3">
          <Button
            onClick={() => proceed(swap)}
            disabled={isPending}
            className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 short:py-1.5 h-auto w-full justify-start gap-3 rounded-xl px-3 py-3 text-left disabled:opacity-100"
          >
            <span className="short:size-7 flex size-9 items-center justify-center rounded-lg bg-[#242424]/15">
              <ArrowLeftRight className="short:size-4 size-5" />
            </span>
            <span className="grow">
              <span className="short:text-[13px] block text-sm font-semibold">
                Proceed to Swap
              </span>
              <span className="short:text-[11px] block text-xs font-normal">
                Convert {swap.fromSymbol} to {swap.toSymbol}
              </span>
            </span>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </Button>

          <Button
            onClick={() => openModal("swapWithdraw", { swap })}
            disabled={isPending}
            className="short:py-1.5 h-auto w-full justify-start gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left text-white hover:bg-white/10"
          >
            <span className="short:size-7 flex size-9 items-center justify-center rounded-lg bg-white/10">
              <ArrowUpRight className="short:size-4 size-5" />
            </span>
            <span className="grow">
              <span className="short:text-[13px] block text-sm font-semibold">
                Withdraw back to wallet
              </span>
              <span className="short:text-[11px] block text-xs font-normal text-white/70">
                Send {swap.fromSymbol} back to your wallet
              </span>
            </span>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwapDepositReceived;
