import { useModalStore } from "@/zustand/modalStore";
import { useSheetStore } from "@/zustand/sheetStore";
import { formatAmount } from "@/lib/utils";

// Below 1 keep at least 3 decimals ("0.250"), up to 6 so small deposits like
// 0.001 ETH aren't rounded away. From 1 up trailing zeros are dropped, so
// "1,000 TRX" rather than "1,000.000 TRX".
export const formatTokenAmount = (amount: number) =>
  amount.toLocaleString("en-US", {
    minimumFractionDigits: amount >= 1 ? 0 : 3,
    maximumFractionDigits: 6,
  });

export const formatFromAmount = (swap: Swap) =>
  `${formatTokenAmount(swap.fromAmount)} ${swap.fromSymbol}`;

// The swap output is unknown until the backend reports it; show just the
// destination token until then.
export const formatToAmount = (swap: Swap) =>
  swap.toAmount == null
    ? swap.toSymbol
    : `${formatAmount(swap.toAmount)} ${swap.toSymbol}`;

const subtitles: Record<SwapKind, Partial<Record<SwapStatus, string>>> = {
  swap: {
    pending: "Awaiting confirmation",
    processing: "Swap in progress...",
    completed: "Swap completed",
    failed: "Swap failed",
  },
  withdrawal: {
    processing: "Withdrawal in progress...",
    refunded: "Deposit refunded",
    failed: "Withdrawal failed",
  },
};

export const getSwapSubtitle = (swap: Swap) =>
  subtitles[swap.kind][swap.status] ?? "";

// Pending swaps ask the user what to do with the deposit; everything else
// opens the read-only details sheet.
export const useOpenSwap = () => {
  const openModal = useModalStore((s) => s.openModal);
  const openSheet = useSheetStore((s) => s.openSheet);

  return (swap: Swap) => {
    if (swap.status === "pending") {
      openModal("swapDepositReceived", { swap });
    } else {
      openSheet("swap-details", null, { swap }, false);
    }
  };
};

const ADDRESS_PATTERNS: Record<SwapChain, RegExp> = {
  ERC20: /^0x[a-fA-F0-9]{40}$/,
  TRC20: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
};

export const isValidWalletAddress = (chain: SwapChain, address: string) =>
  ADDRESS_PATTERNS[chain].test(address.trim());

export const defaultSwapFilters: SwapListFilters = {
  status: "all",
  kind: "all",
  dateFrom: "",
  dateTo: "",
};
