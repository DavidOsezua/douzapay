import moment from "moment";
import {
  ArrowRight,
  Check,
  CircleX,
  Info,
  TriangleAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Copy from "@/components/copy";
import { Button } from "@/components/ui/button";
import { useGetSwaps } from "@/hooks/use-queries";
import { useSwapCountdown } from "@/hooks/use-swap-countdown";
import { useUser } from "@/zustand/store";
import { SWAP_ESTIMATED_MS } from "@/lib/swap";
import { cn, formatAddress, formatAmount } from "@/lib/utils";
import SwapStatusBadge from "@/pages/dashboard/_misc/swap/swap-status-badge";
import SwapTokenIcon from "@/pages/dashboard/_misc/swap/swap-token-icon";
import {
  formatFromAmount,
  formatToAmount,
} from "@/pages/dashboard/_misc/swap/swap-helpers";

const cardClass = "rounded-2xl border border-white/10 bg-white/5";

const DetailRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between border-b border-white/10 py-3.5 last:border-b-0">
    <span className="text-sm text-white/70">{label}</span>
    <span className="flex items-center gap-2 text-right text-sm font-medium">
      {children}
    </span>
  </div>
);

const CopyValue = ({ value }: { value: string }) => (
  <>
    <span className="text-xs text-white/70">{formatAddress(value)}</span>
    <Copy icon="/icons/copy-light.svg" side="left" text={value} />
  </>
);

const SUPPORT_LINK = "https://t.me/duozapaysupport";

// Opens Telegram support with the swap's details already written out.
const SupportLink = ({
  swap,
  issue,
  className,
}: {
  swap: Swap;
  issue: string;
  className?: string;
}) => {
  const email = useUser((state) => state.user?.email);
  const amount = formatFromAmount(swap);
  const message = [
    "Hi Duozapay Support,",
    "",
    issue,
    "",
    `Swap ID: ${swap.id}`,
    swap.kind === "withdrawal"
      ? `Withdrawal: ${amount}`
      : `Swap: ${amount} → ${swap.toSymbol}`,
    `Network: ${swap.networkLabel}`,
    `Transaction hash: ${swap.transactionHash ?? "-"}`,
    `Date: ${moment(swap.createdAt).format("DD MMM YYYY, hh:mm A")}`,
    ...(email ? [`Account: ${email}`] : []),
    "",
    "Please assist.",
  ].join("\n");

  return (
    <a
      href={`${SUPPORT_LINK}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Contact Support on Telegram
    </a>
  );
};

// Shown once the estimated time is up and the swap (or withdrawal) still
// hasn't finished.
const SupportPrompt = ({ swap }: { swap: Swap }) => {
  const noun = swap.kind === "withdrawal" ? "withdrawal" : "swap";
  return (
    <div className="mt-4 rounded-2xl border border-[#FF6E7A]/30 bg-[#FF6E7A]/10 p-4">
      <p className="text-xs leading-5 text-[#FF6E7A]">
        This is taking longer than expected. If your {noun} still hasn&apos;t
        completed, contact our support team on Telegram. A message with your{" "}
        {noun} details is ready to send.
      </p>
      <SupportLink
        swap={swap}
        issue={`My ${noun} is taking longer than expected.`}
        className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#FF6E7A] py-3 text-sm font-semibold text-white"
      />
    </div>
  );
};

const EstimatedTime = ({ swap }: { swap: Swap }) => {
  const { remaining, label } = useSwapCountdown(
    new Date(swap.updatedAt).getTime() + SWAP_ESTIMATED_MS,
  );
  if (remaining <= 0) return <SupportPrompt swap={swap} />;

  return (
    <div className="mt-4 flex items-center justify-between rounded-2xl bg-dark-primary-main/10 px-4 py-3.5">
      <div>
        <p className="text-xs font-medium tracking-wide text-dark-primary-200 uppercase">
          Estimated time
        </p>
        <p className="mt-1 text-sm text-white/70">
          {swap.kind === "withdrawal" ? "Withdrawal" : "Swap"} should be
          completed in less than 10min
        </p>
      </div>
      <p className="pl-3 text-3xl font-semibold tabular-nums">{label}</p>
    </div>
  );
};

type View = "processing" | "completed" | "refunded" | "failed";

// Header title and body for each view; the wording differs for a withdrawal.
const getCopy = (view: View, swap: Swap) => {
  const withdrawal = swap.kind === "withdrawal";
  const { fromSymbol: from, toSymbol: to } = swap;

  switch (view) {
    case "processing":
      return withdrawal
        ? {
            title: "Withdrawal in Progress",
            body: `Your ${from} is being sent back to your external wallet. This usually takes a few minutes. We'll notify you once it's completed`,
          }
        : {
            title: "Swap in Progress",
            body: `Your ${from} is being swapped to ${to}. This usually takes a few minutes. We'll notify you once it's completed`,
          };
    case "refunded":
      return {
        title: "Deposit Refunded",
        body: `Your ${from} has been successfully sent back to your external wallet.`,
      };
    case "failed":
      return withdrawal
        ? {
            title: "Withdrawal Failed",
            body: `We couldn't send your ${from} back to your external wallet.`,
          }
        : {
            title: "Swap Failed",
            body: `We couldn't swap your ${from} to ${to}.`,
          };
    case "completed":
      return {
        title: "Swap Completed!",
        body: `Your ${from} has been successfully swapped to ${to} and is now available in your wallet.`,
      };
  }
};

const SwapDetails = ({
  swap: initialSwap,
  closeSheet,
}: {
  swap: Swap;
  closeSheet: () => void;
}) => {
  const navigate = useNavigate();
  const latest = (list?: Swap[]) =>
    list?.find((s) => s.id === initialSwap.id) ?? initialSwap;
  // Poll while the swap is unfinished, so it flips to its completed view (and
  // the support prompt stays away) if it finishes while the sheet is open.
  const { data: swaps } = useGetSwaps(undefined, (list) =>
    ["pending", "processing"].includes(latest(list).status),
  );
  const swap = latest(swaps);
  // A swap the backend still reports as pending right after starting is shown
  // as in progress; every other status has its own view.
  const view: View = swap.status === "pending" ? "processing" : swap.status;
  const { title, body } = getCopy(view, swap);
  const isWithdrawal = swap.kind === "withdrawal";
  const isRed = view === "failed";

  return (
    <div className="mt-6 flex flex-col px-1 pb-6 text-white">
      <div className="flex flex-col items-center text-center">
        {view === "processing" ? (
          <div className="relative my-1 flex size-20 items-center justify-center">
            <span className="absolute -inset-1.5 rounded-full bg-dark-primary-main/10" />
            <span className="relative flex size-20 items-center justify-center rounded-full bg-dark-primary-main/20">
              <svg
                viewBox="0 0 24 24"
                className="size-10 animate-spin text-dark-primary-main"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="2.5"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        ) : isRed ? (
          <div className="relative my-3 flex size-16 items-center justify-center">
            <span className="absolute -inset-4 rounded-full bg-[#FF5C5C]/[0.08]" />
            <span className="absolute -inset-2.5 rounded-full bg-[#FF5C5C]/[0.15]" />
            <span className="relative flex size-16 items-center justify-center rounded-full bg-[#FF5C5C]">
              {/* isRed is only ever true for view === "failed" (the only red
                  status View currently has), so this is the one reachable icon. */}
              <TriangleAlert className="size-8 text-white" strokeWidth={2.5} />
            </span>
          </div>
        ) : (
          <div className="relative my-3 flex size-16 items-center justify-center">
            <span className="absolute -inset-4 rounded-full bg-dark-success-200/[0.06]" />
            <span className="absolute -inset-2.5 rounded-full bg-dark-success-200/[0.08]" />
            <span className="relative flex size-16 items-center justify-center rounded-full bg-dark-success-200">
              <Check className="size-8 text-white" strokeWidth={3.5} />
            </span>
          </div>
        )}
        <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
        <p className="mt-1 max-w-[90%] text-sm leading-5 font-light text-white/70">
          {body}
        </p>
      </div>

      <div
        className={`${cardClass} mt-5 flex items-center justify-between p-4`}
      >
        <div className="flex items-center gap-3">
          <SwapTokenIcon
            symbol={swap.fromSymbol}
            src={swap.fromIcon}
            className="size-12"
          />
          <div>
            <p className="text-xs text-white/60">From</p>
            <p className="font-semibold">{formatFromAmount(swap)}</p>
            <p className="text-xs text-white/60">{swap.fromName}</p>
          </div>
        </div>
        {/* A withdrawal has no destination token, so only the From side shows */}
        {!isWithdrawal && (
          <>
            {isRed ? (
              <div className="flex items-center gap-1.5 text-[#FF6E7A]">
                <span className="w-3 border-t border-dashed border-[#FF6E7A]/70" />
                <CircleX className="size-5" />
                <span className="w-3 border-t border-dashed border-[#FF6E7A]/70" />
              </div>
            ) : (
              <ArrowRight className="size-5 text-white/70" />
            )}
            <div className="flex items-center gap-3">
              <SwapTokenIcon
                symbol={swap.toSymbol}
                src={swap.toIcon}
                className="size-12"
              />
              <div>
                <p className="text-xs text-white/60">To</p>
                <p className={cn("font-semibold", isRed && "text-white/40")}>
                  {formatToAmount(swap)}
                </p>
                <p className="text-xs text-white/60">{swap.toNetworkLabel}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={`${cardClass} mt-4 px-4`}>
        <DetailRow label="Status">
          <SwapStatusBadge status={swap.status} className="px-2.5 py-1" />
        </DetailRow>
        <DetailRow label="Date">
          {moment(swap.createdAt).format("MMM D, YYYY · h:mm A")}
        </DetailRow>
        {isRed || isWithdrawal ? (
          <DetailRow label="Amount">{formatFromAmount(swap)}</DetailRow>
        ) : (
          <>
            {swap.exchangeRate != null && (
              <DetailRow label="Exchange Rate">
                1 {swap.fromSymbol} = {formatAmount(swap.exchangeRate)}{" "}
                {swap.toSymbol}
              </DetailRow>
            )}
            {swap.toAmount != null && (
              <DetailRow label="You Received">
                <span className="text-dark-success-200">
                  {formatAmount(swap.toAmount)} {swap.toSymbol}
                </span>
              </DetailRow>
            )}
          </>
        )}
        <DetailRow label="Network">{swap.networkLabel}</DetailRow>
        {view === "refunded" ? (
          swap.withdrawalTxHash && (
            <DetailRow label="Withdrawal Transaction ID">
              <CopyValue value={swap.withdrawalTxHash} />
            </DetailRow>
          )
        ) : (
          <DetailRow label="Transaction ID">
            {swap.transactionHash ? (
              <CopyValue value={swap.transactionHash} />
            ) : (
              "-"
            )}
          </DetailRow>
        )}
        {swap.withdrawalAddress && (
          <DetailRow label="Withdrawal Address">
            <CopyValue value={swap.withdrawalAddress} />
          </DetailRow>
        )}
        {view === "failed" && (
          <DetailRow label="Swap ID">
            <CopyValue value={swap.id} />
          </DetailRow>
        )}
        {swap.gasFee != null && (
          <DetailRow label="Gas Fee">
            {swap.gasFee} {swap.fromSymbol}
            {swap.gasFeeUsd != null && ` (≈$${formatAmount(swap.gasFeeUsd)})`}
          </DetailRow>
        )}
      </div>

      {view === "processing" ? (
        <EstimatedTime swap={swap} />
      ) : view === "failed" ? (
        <div className="mt-4 flex gap-2 rounded-2xl border border-[#FF6E7A]/30 bg-[#FF6E7A]/10 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-[#FF6E7A]" />
          <p className="text-xs leading-4 text-[#FF6E7A]">
            Your {swap.fromSymbol} is safe. Contact our support team on
            Telegram and we&apos;ll{" "}
            {isWithdrawal
              ? "retry the withdrawal"
              : "help you retry the swap or withdraw it"}
            . A message with your details is ready to send.
          </p>
        </div>
      ) : view === "refunded" ? (
        <div className="mt-4 flex gap-2 rounded-2xl bg-dark-primary-main/10 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-dark-primary-200" />
          <p className="text-xs leading-4 text-dark-primary-200">
            Your {swap.fromSymbol} has been sent back to your external wallet
            address.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-dark-primary-200" />
          <p className="text-xs leading-4 text-dark-primary-200">
            The swapped {swap.toSymbol} is now available in your wallet and
            can be used to fund card instantly.
          </p>
        </div>
      )}

      <div className="sticky right-0 bottom-0 left-0 z-20 mt-8 flex items-center gap-3 bg-[#242424] pt-3 pb-6">
        <Button
          onClick={closeSheet}
          className="h-12 grow rounded-xl border border-white/20 bg-transparent text-white hover:bg-white/10"
        >
          Back
        </Button>
        {view === "failed" && (
          <SupportLink
            swap={swap}
            issue={isWithdrawal ? "My withdrawal failed." : "My swap failed."}
            className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 flex h-12 grow items-center justify-center rounded-xl text-sm font-semibold"
          />
        )}
        {view === "completed" && (
          <Button
            onClick={() => {
              closeSheet();
              navigate("/dashboard");
            }}
            className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 h-12 grow rounded-xl font-semibold"
          >
            Go to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
};

export default SwapDetails;
