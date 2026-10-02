import { NETWORK_ICON_MAP } from "@/lib/token-icons";

export const SWAP_ESTIMATED_MS = 10 * 60 * 1000;

const TOKEN_NAMES: Record<string, string> = {
  ETH: "Ethereum",
  TRX: "Tron",
  USDT: "Tether",
  USDC: "USD Coin",
};

type RouteInfo = {
  chain: SwapChain;
  networkLabel: string;
  // Only used when the backend hasn't filled route.tokenIn / tokenOut.
  tokenIn: string;
  tokenOut: string;
  // Small network badges overlaid on the From/To coin icons.
  fromIcon?: string;
  toIcon?: string;
};

// The chain and network label aren't in /users/dex-transactions, so they're
// looked up by route name.
const ROUTES: Record<string, RouteInfo> = {
  uniswapV3: {
    chain: "ERC20",
    networkLabel: "Ethereum (ERC20)",
    tokenIn: "ETH",
    tokenOut: "USDC",
  },
  sunswapV4: {
    chain: "TRC20",
    networkLabel: "Tron (TRC20)",
    tokenIn: "TRX",
    tokenOut: "USDT",
  },
  // Cross-chain USDC bridge (Arbitrum -> Ethereum), not a token swap.
  cctp: {
    chain: "ERC20",
    networkLabel: "Arbitrum (ERC20)",
    tokenIn: "USDC",
    tokenOut: "USDC",
    fromIcon: NETWORK_ICON_MAP.ARB,
    toIcon: NETWORK_ICON_MAP.ERC20,
  },
};

const FALLBACK_ROUTE: RouteInfo = {
  chain: "ERC20",
  networkLabel: "Unknown network",
  tokenIn: "TOKEN",
  tokenOut: "USDT",
};

// refund_* statuses only exist once the user chose to withdraw instead of
// swap. Anything unrecognised (processing, queued, swapping) shows as a swap
// in progress.
const resolveState = (
  status: string,
): { kind: SwapKind; status: SwapStatus } => {
  switch (status.toLowerCase()) {
    case "pending":
      return { kind: "swap", status: "pending" };
    case "completed":
      return { kind: "swap", status: "completed" };
    case "failed":
      return { kind: "swap", status: "failed" };
    case "refund_pending":
      return { kind: "withdrawal", status: "processing" };
    case "refunded":
      return { kind: "withdrawal", status: "refunded" };
    case "refund_failed":
      return { kind: "withdrawal", status: "failed" };
    default:
      return { kind: "swap", status: "processing" };
  }
};

export const mapDexTransaction = (tx: DexTransaction): Swap => {
  const info = ROUTES[tx.route?.route] ?? FALLBACK_ROUTE;
  const fromSymbol = tx.route?.tokenIn ?? info.tokenIn;
  const toSymbol = tx.route?.tokenOut ?? info.tokenOut;
  const toName = TOKEN_NAMES[toSymbol] ?? toSymbol;
  const fromAmount = Number(tx.amount);
  const toAmount = tx.swapAmountOut == null ? null : Number(tx.swapAmountOut);

  return {
    id: tx.id,
    ...resolveState(tx.status),
    fromSymbol,
    fromName: TOKEN_NAMES[fromSymbol] ?? fromSymbol,
    fromIcon: info.fromIcon ?? null,
    toSymbol,
    toName,
    toIcon: info.toIcon ?? null,
    chain: info.chain,
    networkLabel: info.networkLabel,
    toNetworkLabel: `${toName} (${info.chain})`,
    fromAmount,
    toAmount,
    amountUsd: null,
    exchangeRate:
      toAmount != null && fromAmount > 0 ? toAmount / fromAmount : null,
    gasFee: null,
    gasFeeUsd: null,
    withdrawableAmount: fromAmount,
    transactionHash:
      tx.swapTxHash ?? tx.cctpMintTxHash ?? tx.transactionHash ?? null,
    withdrawalTxHash: null,
    withdrawalAddress: null,
    createdAt: tx.createdAt,
    updatedAt: tx.updatedAt,
  };
};
