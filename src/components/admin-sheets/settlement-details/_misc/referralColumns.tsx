import { ColumnDef } from "@tanstack/react-table";
export const earningsData: EarningsItem[] = [
  {
    id: "00",
    name: "Johnnnn Doessshhhhh",
    email: "johndoe@gmail.com",
    earnings: 5.6,
    date: "Mon - April - 25",
  },
  {
    id: "00",
    name: "Johnnnn Doessshhhhh",
    email: "johndoe@gmail.com",
    earnings: 5.6,
    date: "Mon - April - 25",
  },
  {
    id: "00",
    name: "Johnnnn Doessshhhhh",
    email: "johndoe@gmail.com",
    earnings: 5.6,
    date: "Mon - April - 25",
  },
];

export type EarningsItem = {
  id: string;
  name: string;
  email: string;
  earnings: number;
  date: string;
};

export const referralColumns: ColumnDef<EarningsItem>[] = [
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
        {row.original.name}
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
    header: "Earnings",
    cell: ({ row }) => (
      <div className="text-xs text-green-600">
        ${row.original.earnings.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-xs text-[#161B33]">{row.original.date}</div>
    ),
  },
];
