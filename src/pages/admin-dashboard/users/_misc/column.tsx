import { UserSettings, UserStatus } from "./userOptions";
import moment from "moment";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => <div className="font-medium">{info.row.original.id}</div>,
  },
  {
    header: "Name",
    cell: (info) => (
      <div>
        {info.row.original.firstName + " " + info.row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => info.row.original.email,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (info) => moment(info.row.original.createdAt).format("MMM DD, YYYY"),
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: (info) => {
      const value = info.row.original.balance;
      const formattedValue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
      return <div>{formattedValue}</div>;
    },
  },
  {
    accessorKey: "withdrawal",
    header: "Withdrawal",
    cell: (info) => {
      const value = info.row.original.totalWithdrawals ?? 0;
      const formattedValue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);

      return <div className={"text-primary-red"}>-{formattedValue}</div>;
    },
  },
  {
    accessorKey: "referrals",
    header: "Referrals",
    cell: (info) => <div>${info.row.original.totalCommisions.toFixed(2)}</div>,
  },

  {
    header: "Status",
    cell: (info) => {
      return (
        <UserStatus
          active={info.row.original.active}
          id={info.row.original.id}
        />
      );
    },
  },
  {
    header: "Actions",
    cell: (info) => <UserSettings user={info.row.original} />,
  },
];
