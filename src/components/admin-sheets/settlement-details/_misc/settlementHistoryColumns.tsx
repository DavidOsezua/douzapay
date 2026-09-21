import { ColumnDef } from "@tanstack/react-table";
import { formatAddress, formatAmount } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "lucide-react";
import { useSheetStore } from "@/zustand/settlementSheetStore";

export const transactionColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="text-xs">{row.original.id}</div>,
  },
  {
    accessorKey: "wallet",
    header: "Wallet",
    cell: ({ row }) => (
      <div className="text-xs">{formatAddress(row.original.wallet)}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="text-xs capitalize">{row.original.type}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="text-xs font-medium text-green-600">
        +${formatAmount(row.original.amount)}
      </div>
    ),
  },
  {
    accessorKey: "txid",
    header: "TxID",
    cell: ({ row }) => (
      <div className="text-xs">{formatAddress(row.original.txid)}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div className="text-xs">{row.original.date}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-xs font-medium text-green-500">
        {row.original.status}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
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
