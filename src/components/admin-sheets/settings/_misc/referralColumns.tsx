import { formatAmount } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

export const referralColumns: ColumnDef<Referral>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="text-xs text-[#161B33]">{row.original.id}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="text-xs text-[#161B33] capitalize">
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-xs text-[#07111B]">{row.original.email}</div>
    ),
  },
  {
    accessorKey: "earnings",
    header: "Commission",
    cell: ({ row }) => (
      <div className="text-xs text-green-600">
        ${formatAmount(row.original.earnedRefCommission)}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-xs text-[#161B33]">
        {moment(row.original.createdAt).format("DD-MM-YY hh:mm A")}
      </div>
    ),
  },
];
