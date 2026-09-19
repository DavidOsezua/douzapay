import { Button } from "@/components/ui/button";
import { ChevronDown, LucideBarChart } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "sn",
    header: "SN",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "spentAmount",
    header: "Spent Amount",
    cell: ({ row }) => row.original.spentAmount,
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => row.original.balance,
  },
  {
    accessorKey: "cardType",
    header: "Card Type",
  },
  {
    accessorKey: "website",
    header: "Website",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: () => (
      <Button
        variant="ghost"
        className="bg-primary-green/10 text-primary-green flex h-auto items-center gap-1 rounded-full p-0 py-1"
      >
        <span className="mb-1">Successful</span>
        <ChevronDown className="size-3" />
      </Button>
    ),
  },
  {
    header: "Actions",
    cell: () => (
      <Button
        variant="ghost"
        className="bg-primary-purple/10 text-primary-purple flex h-auto items-center gap-1 rounded-full p-0 py-1"
      >
        <LucideBarChart className="size-3 rotate-90" />
        <span className="mb-1">Details</span>
      </Button>
    ),
  },
];
