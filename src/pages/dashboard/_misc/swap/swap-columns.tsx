import moment from "moment";
import { type ColumnDef } from "@tanstack/react-table";
import { Text } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils";
import SwapStatusBadge from "./swap-status-badge";
import { SwapPairIcon } from "./swap-token-icon";
import {
  formatFromAmount,
  formatToAmount,
  getSwapSubtitle,
  useOpenSwap,
} from "./swap-helpers";

const ActionCell = ({ swap }: { swap: Swap }) => {
  const openSwap = useOpenSwap();

  return (
    <Button
      className="text-[#242424] flex h-auto items-center gap-1 rounded-full bg-dark-primary-main px-4 py-2 text-[10px] hover:bg-dark-primary-main/80"
      onClick={() => openSwap(swap)}
    >
      <Text className="size-2.5" />
      <span>{swap.status === "pending" ? "Review" : "Details"}</span>
    </Button>
  );
};

export const swapColumns: ColumnDef<Swap>[] = [
  {
    header: "Swap",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <SwapPairIcon
          from={row.original.fromSymbol}
          fromSrc={row.original.fromIcon}
          to={row.original.kind === "swap" ? row.original.toSymbol : undefined}
          toSrc={row.original.toIcon}
          size="size-7"
        />
        <div>
          <p className="font-medium">
            {row.original.fromSymbol}
            {row.original.kind === "swap" && ` → ${row.original.toSymbol}`}
          </p>
          <p className="text-[10px] text-white/60">
            {getSwapSubtitle(row.original)}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "From",
    cell: ({ row }) => (
      <span className="font-medium">{formatFromAmount(row.original)}</span>
    ),
  },
  {
    header: "To",
    cell: ({ row }) =>
      row.original.kind === "swap" ? (
        <span className="font-medium">{formatToAmount(row.original)}</span>
      ) : (
        <span>-</span>
      ),
  },
  {
    header: "Network",
    cell: ({ row }) => row.original.networkLabel,
  },
  {
    header: "TxId",
    cell: ({ row }) =>
      row.original.transactionHash
        ? formatAddress(row.original.transactionHash)
        : "-",
  },
  {
    header: "Date",
    cell: ({ row }) => (
      <span className="font-semibold">
        {moment(row.original.createdAt).format("DD-MM-YY hh:mm A")}
      </span>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => <SwapStatusBadge status={row.original.status} />,
  },
  {
    header: "Actions",
    cell: ({ row }) => <ActionCell swap={row.original} />,
  },
];
