import { ColumnDef } from "@tanstack/react-table";

export const referralColumn: ColumnDef<User>[] = [
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
    header: "Balance",
    cell: ({ row }) => (
      <div className="text-primary-green font-medium">
        USD{row.original.balance.toFixed(2)}
      </div>
    ),
  },
  {
    header: "Referral Earnings",
    cell: ({ row }) => (
      <div className="font-medium">
        USD{row.original.totalCommisions.toFixed(2)}
      </div>
    ),
  },
];
