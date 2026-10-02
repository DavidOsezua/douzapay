import { useUser } from "@/zustand/store";
import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { ClipboardEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCardTransactionDisplayAmount(transaction: CardTransaction): {
  amount: number;
  currency: string;
} {
  if (transaction.type === "TransferIn" || transaction.type === "TransferOut") {
    return { amount: transaction.amount, currency: transaction.currency };
  }
  if (transaction.transactionCurrency === "USD") {
    return {
      amount: transaction.transactionAmount,
      currency: transaction.transactionCurrency,
    };
  }
  return { amount: transaction.amount, currency: transaction.currency };
}

// ── Card transaction type / status helpers ────────────────────────────────
// Single source of truth shared by the mobile list, the desktop table and the
// detail sheet. Card processors feed this list with different vocabularies:
//   provider A: TransferIn/TransferOut/Fee_Consumption/auth/Void/Consumption
//   provider B: recharge/recharge_return/auth/refund/void/maintain_fee
// `verification` (a $0 card-binding check) is deliberately left neutral.

export const CARD_TRANSACTION_LABELS: Record<string, string> = {
  TransferIn: "Card Deposit",
  TransferOut: "Card Withdrawal",
  Topup: "Top-up",
  recharge: "Top-up",
  recharge_return: "Top-up Return",
  Consumption: "Purchase",
  Fee_Consumption: "Fee",
  maintain_fee: "Fee",
  auth: "Authorization",
  Void: "Void",
  void: "Void",
  verification: "Verification",
  refund: "Refund",
};

// Which way a card transaction moves the balance. Types not listed here
// (`verification`, unknowns) are neutral / unsigned.
const CARD_TRANSACTION_DIRECTION: Record<string, "in" | "out"> = {
  TransferIn: "in",
  Topup: "in",
  recharge: "in",
  Void: "in",
  void: "in",
  refund: "in",
  TransferOut: "out",
  recharge_return: "out",
  Consumption: "out",
  Fee_Consumption: "out",
  auth: "out",
  maintain_fee: "out",
};

export function getCardTransactionDirection(
  type: string,
): "in" | "out" | "neutral" {
  return CARD_TRANSACTION_DIRECTION[type] ?? "neutral";
}

// "+", "-" or "" for a card transaction amount. Unsigned when the amount is 0
// or the transaction has not settled (pending / failed / voided) — no balance
// change has actually happened, so a signed figure would mislead.
export function getCardTransactionSign(
  type: string,
  amount: number,
  status?: string | null,
): "" | "+" | "-" {
  if (!amount) return "";
  if (!getTransactionStatusMeta(status).settled) return "";
  const direction = getCardTransactionDirection(type);
  return direction === "in" ? "+" : direction === "out" ? "-" : "";
}

// The card APIs report status in mixed casing and with a few synonyms
// ("fail" vs "Failed", "succeed" vs "Completed", "authorized" while a hold is
// still open). Normalise to one of five keys, a display label, and whether the
// money has actually finished moving (`settled`).
export type TransactionStatusKey =
  | "completed"
  | "pending"
  | "failed"
  | "rejected"
  | "closed";

export function getTransactionStatusMeta(status?: string | null): {
  key: TransactionStatusKey;
  label: string;
  settled: boolean;
} {
  switch (status?.toLowerCase()) {
    case "completed":
    case "success":
    case "succeed":
      return { key: "completed", label: "Completed", settled: true };
    case "closed":
      return { key: "closed", label: "Closed", settled: true };
    case "failed":
    case "fail":
      return { key: "failed", label: "Failed", settled: false };
    case "rejected":
      return { key: "rejected", label: "Rejected", settled: false };
    case "void":
      return { key: "closed", label: "Voided", settled: false };
    case "authorized":
      return { key: "pending", label: "Authorized", settled: false };
    case "processing":
      return { key: "pending", label: "Processing", settled: false };
    default:
      // pending, waiting, or anything unrecognised
      return { key: "pending", label: "Pending", settled: false };
  }
}

// Truncates (never rounds up) to `decimalPlaces`, so a displayed money amount
// never overstates what the account actually holds — e.g. 1.99974 -> 1.99,
// not 2.00. Goes through a decimal string rather than `Math.floor(num *
// 10**n) / 10**n`, since that multiplication can itself introduce floating-
// point error (1.1 * 100 === 109.99999999999999) and truncate a value that
// shouldn't be.
//
// The buffer `toFixed` is rounded to first has to sit well clear of
// `decimalPlaces`: `toFixed` itself rounds, and a buffer that's too tight
// (previously `decimalPlaces + 4`) lets that rounding cascade across the cut
// point — e.g. 1.999999999999 at a 6-digit buffer rounds to "2.000000"
// before truncation ever sees it, turning 1.99 into 2.00. A fixed +10 buffer
// keeps the rounding step comfortably inside the noise floor of ordinary
// float arithmetic instead of touching digits the truncation cares about.
function truncateToDecimals(num: number, decimalPlaces: number): number {
  const buffer = Math.min(decimalPlaces + 10, 100);
  const [whole, frac = ""] = num.toFixed(buffer).split(".");
  const truncatedFrac = frac.slice(0, decimalPlaces).padEnd(decimalPlaces, "0");
  return Number(`${whole}.${truncatedFrac}`);
}

export function formatAmount(
  amount: number | string | undefined,
  decimalPlaces: number = 2,
): string {
  const num = typeof amount === "number" ? amount : parseFloat(amount || "0");
  if (isNaN(num)) {
    return "0.00";
  }

  return truncateToDecimals(num, decimalPlaces).toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}

export function formatAmountWithRate(
  amount: number | string | undefined,
  rate: number = 1,
  decimalPlaces: number = 2,
): string {
  const currency = useUser.getState().user?.preferredCurrency || "USD";
  const num = typeof amount === "number" ? amount : parseFloat(amount || "0");
  if (isNaN(num)) {
    return "0.00";
  }

  const convertedAmount = truncateToDecimals(num / rate, decimalPlaces);

  const currencySymbols: Record<string, string> = {
    USD: "$",
    GBP: "£",
    EUR: "€",
  };

  const symbol = currencySymbols[currency?.toUpperCase()] || "";

  return (
    symbol +
    convertedAmount.toLocaleString("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    })
  );
}

export function getCurrencyIconPath(
  currency: string,
  inactive: boolean = false,
) {
  const currencyIconMap: Record<string, Record<string, string>> = {
    "USDC-ERC20": {
      active: "/images/usdc.svg",
      inactive: "/images/usdc-inactive.svg",
    },
    "USDT-TRC20": {
      active: "/images/trcusdt.svg",
      inactive: "/images/trcusdt-inactive.svg",
    },
    "USDT-ERC20": {
      active: "/images/ercusdt.svg",
      inactive: "/images/ercusdt-inactive.svg",
    },
    BTC: { active: "/icons/btc.svg", inactive: "/icons/btc.svg" },
    ETH: { active: "/icons/eth.svg", inactive: "/icons/eth.svg" },
    USDT: { active: "/icons/usdt.svg", inactive: "/icons/usdt.svg" },
    USDC: { active: "/icons/usdc.svg", inactive: "/icons/usdc.svg" },
    ERC20: { active: "/icons/erc20.svg", inactive: "/icons/erc20.svg" },
    TRC20: { active: "/icons/trc20.png", inactive: "/icons/trc20.png" },
    USD: { active: "/icons/usd.svg", inactive: "/icons/usd.svg" },
    GBP: { active: "/icons/gbp.svg", inactive: "/icons/gbp.svg" },
    EUR: { active: "/icons/eur.svg", inactive: "/icons/eur.svg" },
  };

  const icons = currencyIconMap[currency.toUpperCase()];
  return icons ? icons[inactive ? "inactive" : "active"] : "";
}

export function formatAddress(address: string) {
  if (address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const handlePaste = async <
  T extends HTMLInputElement | HTMLTextAreaElement,
>(
  setValue: (value: string) => void,
  event?: ClipboardEvent<T>,
): Promise<void> => {
  if (event) {
    event.preventDefault();
  }
  try {
    const text = await navigator.clipboard.readText();
    setValue(text);
  } catch {
    // ignore
  }
};

export function getDayDate(dayOfWeek: string): string {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const todayIndex = weekdays.indexOf(dayOfWeek);
  if (todayIndex === -1) {
    throw new Error("Invalid day string. Must be 'Sunday' to 'Saturday'.");
  }

  const daysUntilNextDay = (7 - todayIndex) % 7 || 7;
  const nextSunday = moment().add(daysUntilNextDay, "days");

  return nextSunday.format("YYYY-MM-DD");
}

export function getCurrencyFlagPath(currency: string) {
  const currencyFlagMap: Record<string, string> = {
    USD: "/images/us.png",
    GBP: "/images/uk.png",
    EUR: "/images/euro.png",
  };
  return currencyFlagMap[currency.toUpperCase()] || "";
}
