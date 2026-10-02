import moment from "moment";
import { ColumnDef } from "@tanstack/react-table";
import Copy from "@/components/copy";
import { formatAddress } from "@/lib/utils";
import { isWithdrawalStatus } from "@/lib/swap";
import { formatTokenAmount } from "@/pages/dashboard/_misc/swap/swap-helpers";
import SwapTokenIcon from "@/pages/dashboard/_misc/swap/swap-token-icon";

// Same palette convention as allTransactionColumn.tsx/cardColumn.tsx; "processing"
// has no equivalent there, so it uses the same blue already used for amounts.
const statusStyles: Record<SwapStatus, { color: string; bg: string }> = {
  pending: { color: "text-primary-brown", bg: "bg-primary-brown/10" },
  processing: { color: "text-primary-blue", bg: "bg-primary-blue/10" },
  completed: { color: "text-primary-green", bg: "bg-primary-green/10" },
  refunded: { color: "text-primary-green", bg: "bg-primary-green/10" },
  failed: { color: "text-primary-red", bg: "bg-primary-red/10" },
};

export const swapColumn: ColumnDef<AdminSwap>[] = [
  {
    accessorKey: "id",
    header: "ID",
    meta: { className: "hidden md:table-cell" },
  },
  {
    header: "User",
    cell: ({ row }) => (
      <div>
        <div>{row.original.userId}</div>
        {row.original.walletAddress && (
          <div className="text-primary-500/60 text-[10px]">
            {formatAddress(row.original.walletAddress)}
          </div>
        )}
      </div>
    ),
  },
  {
    header: "Date",
    cell: ({ row }) => (
      <div>{moment(row.original.createdAt).format("DD-MM-YY hh:mm A")}</div>
    ),
  },
  {
    header: "Pair",
    cell: ({ row }) => {
      const swap = row.original;
      const isWithdrawal = isWithdrawalStatus(swap.rawStatus);
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-1.5">
            <SwapTokenIcon
              symbol={swap.fromSymbol}
              src={swap.fromIcon}
              className="size-6"
            />
            {!isWithdrawal && (
              <SwapTokenIcon
                symbol={swap.toSymbol}
                src={swap.toIcon}
                className="size-6"
              />
            )}
          </div>
          <div>
            <p className="font-medium">
              {swap.fromSymbol}
              {!isWithdrawal && ` → ${swap.toSymbol}`}
            </p>
            <p className="text-primary-500/60 text-[10px]">
              {swap.networkLabel}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Amount",
    cell: ({ row }) => {
      const swap = row.original;
      const isWithdrawal = isWithdrawalStatus(swap.rawStatus);
      return (
        <div>
          <p>
            {formatTokenAmount(swap.fromAmount)} {swap.fromSymbol}
          </p>
          {!isWithdrawal && swap.toAmount != null && (
            <p className="text-primary-500/60 text-[10px]">
              → {formatTokenAmount(swap.toAmount)} {swap.toSymbol}
            </p>
          )}
        </div>
      );
    },
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-primary-blue font-medium">
        {isWithdrawalStatus(row.original.rawStatus) ? "Withdrawal" : "Swap"}
      </span>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const swap = row.original;
      const label = swap.rawStatus.replace(/_/g, " ");
      const content = label.charAt(0).toUpperCase() + label.slice(1);
      const style = statusStyles[swap.status];
      return (
        <span
          className={`inline-flex h-auto w-fit items-center rounded-full px-2 py-1 font-medium ${style.bg} ${style.color}`}
        >
          {content}
        </span>
      );
    },
  },
  {
    header: "TxHash",
    cell: ({ row }) => {
      const hash = row.original.transactionHash;
      if (!hash) return <div>-</div>;
      return (
        <div className="flex items-center gap-1">
          {formatAddress(hash)}
          <Copy text={hash} side="left" />
        </div>
      );
    },
  },
];
