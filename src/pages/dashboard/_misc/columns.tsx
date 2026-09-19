import Copy from "@/components/copy";
import moment from "moment";
import { type CellContext, type ColumnDef } from "@tanstack/react-table";
import { formatAddress, getTransactionStatusMeta } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/zustand/sheetStore";
import { Text } from "lucide-react";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";

const AmountCell = ({ row }: CellContext<Transaction, unknown>) => {
  const formatAmount = useFormatAmountWithCurrency();
  const sign = row.original.type === "deposit" ? "+" : "-";
  return (
    <div>
      {sign}
      {formatAmount(row.original.amount)}
    </div>
  );
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    header: "Type",
    cell: ({ row }) => {
      return <TransactionType type={row.original.type} />;
    },
  },
  {
    header: "Amount",
    cell: AmountCell,
  },

  {
    header: "Currency Pair",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.currency || "-"}</div>;
    },
  },

  {
    header: "TxId",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.transactionHash ? (
          <>
            {formatAddress(row.original.transactionHash)}{" "}
            <Copy
              icon="./icons/copy-light.svg"
              text={row.original.transactionHash}
              side="left"
            />
          </>
        ) : (
          <span>-</span>
        )}
      </div>
    ),
  },

  {
    header: "Date",
    cell: ({ row }) => (
      <div className="font-normal">
        {moment(row.original.createdAt).format("DD-MM-YY hh:mm A")}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },

  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <Button
            className="text-primary-500 bg-dark-primary-50 flex h-auto items-center gap-1 rounded-full px-4 py-2 text-xs text-[10px] hover:bg-white"
            onClick={() =>
              useSheetStore.getState().openSheet("transaction-details", null, {
                transactionData: row.original,
                type: "wallet",
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

type Type =
  | "deposit"
  | "withdrawal"
  | "transfer"
  | "internal-transfer"
  | "card-topup"
  | "card-withdrawal"
  | "card-creation"
  | "referral-reward";

export const typeMap: Record<
  Type,
  { title: string; icon: string; style: string }
> = {
  deposit: {
    title: "Deposit",
    icon: "/icons/deposit.svg",
    style: "border-[#96FFC099] bg-[#8DFFC059]",
  },
  withdrawal: {
    title: "Withdrawal",
    icon: "/icons/withdrawal.svg",
    style: "border-[#FF505099] bg-[#FF505029]",
  },
  transfer: {
    title: "Transfer",
    icon: "/icons/transfer.svg",
    style: "border-[#FF505099] bg-[#FF6E7A]",
  },
  "internal-transfer": {
    title: "Internal Transfer",
    icon: "/icons/transfer.svg",
    style: "border-[#FF505099] bg-[#FF6E7A]",
  },
  "card-topup": {
    title: "Card Topup",
    icon: "/icons/withdrawal.svg",
    style: "border-[#FF505099] ",
  },
  "card-withdrawal": {
    title: "Card Withdrawal",
    icon: "/icons/deposit.svg",
    style: "border-dark-success-200 bg-[#8DFFC059] ",
  },
  "card-creation": {
    title: "Card Creation",
    icon: "/icons/withdrawal.svg",
    style: "border-[#FF505099] bg-[#FF505029]",
  },
  "referral-reward": {
    title: "Referral Reward",
    icon: "/icons/deposit.svg",
    style: "border-[#96FFC099] bg-[#8DFFC059]",
  },
};

export const TransactionType = ({ type }: { type: Type }) => {
  return (
    <div className={`flex items-center gap-1`}>
      <div
        className={`flex size-4 items-center justify-center rounded-full border ${typeMap[type]?.style}`}
      >
        <img
          className="size-2.5"
          src={typeMap[type]?.icon}
          alt={typeMap[type]?.title}
        />
      </div>
      <span className="capitalize">{typeMap[type]?.title}</span>
    </div>
  );
};
export const StatusBadge = ({
  status,
  className,
}: {
  status?: string | null;
  className?: string;
}) => {
  const statusConfig = {
    completed: { color: "text-dark-success-200" },
    failed: { color: "text-[#FF6E7A]" },
    rejected: { color: "text-[#FF6E7A]" },
    pending: { color: "text-[#FFE261]" },
    closed: { color: "text-[#9CA3AF]" },
  };

  const { key, label } = getTransactionStatusMeta(status);
  const config = statusConfig[key];

  return (
    <div
      className={`inline-flex items-center rounded-full px-4 py-2 text-[10px] ${config.color} ${className}`}
    >
      <span className="mr-1">●</span>
      {label}
    </div>
  );
};
