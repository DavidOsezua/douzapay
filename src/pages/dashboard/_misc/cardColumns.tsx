import moment from "moment";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/zustand/sheetStore";
import { Text } from "lucide-react";
import {
  CARD_TRANSACTION_LABELS,
  formatAmount,
  getCardTransactionDisplayAmount,
  getCardTransactionSign,
  getTransactionStatusMeta,
} from "@/lib/utils";

export const cardColumns: ColumnDef<CardTransaction>[] = [
  {
    header: "Type",
    cell: ({ row }) => {
      return (
        <div className="break-word w-[200px] text-wrap">
          {row.original.merchantName ||
            CARD_TRANSACTION_LABELS[row.original.type] ||
            "-"}
        </div>
      );
    },
  },

  {
    header: "Merchant",
    cell: ({ row }) => {
      return (
        <div className="break-word w-[200px] text-wrap">
          {row.original.detail || row.original.merchantName || "-"}
        </div>
      );
    },
  },
  {
    header: "Amount",
    cell: ({ row }) => {
      const { amount, currency } = getCardTransactionDisplayAmount(
        row.original,
      );
      return (
        <div className="whitespace-nowrap">
          {getCardTransactionSign(
            row.original.type,
            amount,
            row.original.status,
          )}
          {formatAmount(amount)} {currency?.toUpperCase()}
        </div>
      );
    },
  },
  {
    header: "Date",
    cell: ({ row }) => (
      <div className="font-normal">
        {moment(row.original.transactionTime).format("DD-MM hh:mm A")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return (
        <div>
          <Button
            className="text-primary-500 bg-dark-primary-50 flex h-auto items-center gap-1 rounded-full px-4 py-2 text-xs text-[10px] hover:bg-white"
            onClick={() =>
              useSheetStore.getState().openSheet("transaction-details", null, {
                transactionData: row.original,
                type: "card",
              })
            }
          >
            <Text className="size-2.5" />
            <span>Details</span>
          </Button>
        </div>
      );
    },
  },
];

export const StatusBadge = ({
  status,
  className,
}: {
  status?: string | null;
  className?: string;
}) => {
  const statusConfig = {
    completed: { color: "text-green-500", bgColor: "bg-green-50" },
    failed: { color: "text-[#FF6E7A]", bgColor: "bg-red-50" },
    rejected: { color: "text-[#FF6E7A]", bgColor: "bg-[#FF6E7A1A]" },
    pending: { color: "text-[#FFE261]", bgColor: "bg-[#FFE2611A]" },
    closed: { color: "text-[#9CA3AF]", bgColor: "bg-[#9CA3AF1A]" },
  };

  const { key, label } = getTransactionStatusMeta(status);
  const config = statusConfig[key];

  return (
    <div
      className={`inline-flex items-center rounded-full px-4 py-2 text-[10px] ${config.color} ${config.bgColor} ${className}`}
    >
      <span className="mr-1">●</span>
      {label}
    </div>
  );
};
