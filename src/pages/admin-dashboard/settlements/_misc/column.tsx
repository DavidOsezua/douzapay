import { ColumnDef } from "@tanstack/react-table";
import { formatAmount, formatAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "lucide-react";
import { useSheetStore } from "@/zustand/settlementSheetStore";
import moment from "moment";
import Copy from "@/components/copy";

export const settlementColumns: ColumnDef<Settlement>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="text-xs">{row.original.id}</div>,
  },
  {
    accessorKey: "depositFee",
    header: "Deposit Fees",
    cell: ({ row }) => (
      <div className="text-xs">${formatAmount(row.original.depositFee)}</div>
    ),
  },
  {
    accessorKey: "withdrawFee",
    header: "Withdraw Fees",
    cell: ({ row }) => (
      <div className="text-xs">${formatAmount(row.original.withdrawalFee)}</div>
    ),
  },
  {
    accessorKey: "cardFee",
    header: "Card Fee",
    cell: ({ row }) => (
      <div className="text-xs">
        ${formatAmount(row.original.cardCreationFee)}
      </div>
    ),
  },
  {
    accessorKey: "referrals",
    header: "Referrals",
    cell: ({ row }) => (
      <div className="text-xs">
        $
        {formatAmount(
          row.original.referralFee ||
            row.original.settledReferrals?.reduce(
              (acc, curr) => acc + parseFloat(curr.amount),
              0,
            ),
        )}
      </div>
    ),
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => (
      <div className="text-xs font-medium text-green-600">
        $
        {formatAmount(
          row.original.depositFee +
            row.original.withdrawalFee +
            row.original.cardCreationFee +
            (row.original.referralFee || 0),
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.original.status || "Completed";
      const statusColor =
        status === "Pending" ? "text-[#FFB82B]" : "text-[#27993A]";
      return (
        <div className={`text-xs font-medium ${statusColor}`}>{status}</div>
      );
    },
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    cell: ({ row }) => (
      <div className="text-xs">
        {moment(row.original.createdAt).format("DD-MMM-YY")}
      </div>
    ),
  },
  {
    accessorKey: "txid",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs">
        {formatAddress(row.original.transactionHash || "")}{" "}
        {row.original.transactionHash && (
          <Copy text={row.original.transactionHash} />
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      if (row.original.status === "Pending") return null;
      return (
        <Button
          onClick={() =>
            useSheetStore.getState().openSheet("settlement-details", null, {
              settlementData: row.original,
            })
          }
          variant="ghost"
          className="bg-primary-purple/10 hover:bg-primary-purple/20 text-primary-purple flex h-auto items-center gap-1 rounded-full p-2 py-1 font-medium"
        >
          <Text className="size-4" />
          <span>Details</span>
        </Button>
      );
    },
  },
];
