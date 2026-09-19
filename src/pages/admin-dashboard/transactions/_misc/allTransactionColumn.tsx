import { Button } from "@/components/ui/button";
import { formatAmount } from "@/lib/utils";
import { useAdminModals } from "@/zustand/store";
import { Text } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

export const allTransactionsColumn: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    header: "Name",
    cell: ({ row }) => (
      <div>
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="text-primary-blue font-medium">
        USD {formatAmount(row.original.amount)}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <span className="text-primary-blue font-medium">
          {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let statusColor = "";
      let bgColor = "";
      let content = "";
      let hover = "";

      if (status === "pending") {
        statusColor = "text-primary-brown";
        bgColor = "bg-primary-brown/10";
        content = "Pending";
        hover = "hover:bg-primary-brown/20";
      } else if (status === "completed") {
        statusColor = "text-primary-green";
        bgColor = "bg-primary-green/10";
        hover = "hover:bg-primary-green/20";
        content = "Successful";
      } else if (status === "failed") {
        statusColor = "text-primary-red";
        bgColor = "bg-primary-red/10";
        content = "Failed";
        hover = "hover:bg-primary-red/20";
      } else if (status === "rejected") {
        statusColor = "text-primary-red";
        bgColor = "bg-primary-red/10";
        content = "Rejected";
        hover = "hover:bg-primary-red/20";
      }

      return (
        <Button
          className={`flex h-auto w-fit items-center justify-between gap-1 rounded-full px-2 py-1 font-medium ${bgColor} ${statusColor} ${hover}`}
        >
          <span>{content}</span>
        </Button>
      );
    },
  },
  {
    accessorKey: "transactionHash",
    header: "TxHash",
    cell: ({ row }) => {
      const transactionHash = row.original.transactionHash;

      return (
        <div>
          {transactionHash?.length > 6
            ? `${transactionHash?.slice(0, 6)}...${transactionHash?.slice(-6)}`
            : transactionHash
              ? transactionHash
              : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        onClick={() => {
          useAdminModals.setState({
            transactionDetailsIsOpen: true,
            transactionDetailsData: row.original,
          });
        }}
        variant="ghost"
        className="bg-primary-purple/10 hover:bg-primary-purple/20 text-primary-purple flex h-auto items-center gap-1 rounded-full p-2 py-1"
      >
        <Text className="size-4" />
        <span>Details</span>
      </Button>
    ),
  },
];
