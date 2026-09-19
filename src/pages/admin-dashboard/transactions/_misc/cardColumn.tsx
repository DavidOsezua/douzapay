import { Button } from "@/components/ui/button";
import { useAdminModals } from "@/zustand/store";
import { ChevronDown, Text } from "lucide-react";
import moment from "moment";
import { ColumnDef } from "@tanstack/react-table";

export const cardTopUpColumn: ColumnDef<CardTransaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return (
        <div>{moment(row.original.transactionTime).format("MM-DD-YYYY")}</div>
      );
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => (
      <div>{moment(row.original.transactionTime).format("hh:mm:ss A")}</div>
    ),
  },
  {
    header: "Top-up Amount",
    cell: ({ row }) => (
      <div className="text-primary-blue font-medium">
        {row.original.amount.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "fee",
    header: "Fee",
    cell: ({ row }) => <div>{row.original.fee.toFixed(2)}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as string;
      let statusColor = "";
      let bgColor = "";
      let content = "";

      if (status === "Success") {
        statusColor = "text-primary-green";
        bgColor = "bg-primary-green/10";
        content = "Successful";
      } else if (status === "Fail") {
        statusColor = "text-primary-red";
        bgColor = "bg-primary-red/10";
        content = "Failed";
      } else if (status === "Closed") {
        statusColor = "text-primary-brown";
        bgColor = "bg-primary-brown/10";
        content = "Closed";
      }

      return (
        <div className={`flex items-center gap-1 ${statusColor}`}>
          <div className={`rounded-full px-3 py-1 ${bgColor}`}>{content}</div>
          {status === "successful" || status === "failed" ? (
            <ChevronDown className="ml-1 size-4" />
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Button
        onClick={() => {
          useAdminModals.setState({
            cardTopupDetailsIsOpen: true,
            cardTopupDetailsData: row.original,
          });
        }}
        variant="ghost"
        className="bg-primary-purple/10 hover:bg-primary-purple/20 text-primary-blue flex h-auto items-center gap-1 rounded-full p-2 py-1"
      >
        <Text className="size-4" />
        <span>Details</span>
      </Button>
    ),
  },
];

export const cardWithdrawalColumn: ColumnDef<CardTransaction>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return (
        <div>
          {moment(row.original.transactionTime).format("ddd - MMM - DD")}
        </div>
      );
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      return <div>{moment(row.original.transactionTime).format("hh:mmA")}</div>;
    },
  },
  {
    header: "Spent Amount",
    cell: ({ row }) => (
      <div className="text-primary-blue font-medium">
        {row.original.amount.toFixed(2)}
      </div>
    ),
  },
  {
    header: "Merchant",
    cell: ({ row }) => <div>{row.original.merchantName}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as string;
      let statusColor = "";
      let bgColor = "";
      let content = "";

      if (status === "Success") {
        statusColor = "text-primary-green";
        bgColor = "bg-primary-green/10";
        content = "Successful";
      } else if (status === "Fail") {
        statusColor = "text-primary-red";
        bgColor = "bg-primary-red/10";
        content = "Failed";
      } else if (status === "Closed") {
        statusColor = "text-primary-brown";
        bgColor = "bg-primary-brown/10";
        content = "Closed";
      } else if (status === "Pending") {
        statusColor = "text-primary-brown";
        bgColor = "bg-primary-brown/10";
        content = "Pending";
        // hover = "hover:bg-primary-brown/20";
      }

      return (
        <div className="flex items-center">
          <div className={`rounded-full px-3 py-1 ${bgColor} ${statusColor}`}>
            {content}
          </div>
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
            cardSpendingDetailsIsOpen: true,
            cardSpendingDetailsData: row.original,
          });
        }}
        variant="ghost"
        className="bg-primary-blue/10 hover:bg-primary-blue/20 text-primary-blue flex h-auto items-center gap-1 rounded-full p-2 py-1"
      >
        <Text className="size-4" />
        <span>Details</span>
      </Button>
    ),
  },
];

export const cardTransactionsColumns: ColumnDef<CardTransaction>[] = [
  {
    header: "Sn",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return (
        <div>
          {moment(row.original.transactionTime).format("ddd - MMM - DD")}
        </div>
      );
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      return <div>{moment(row.original.transactionTime).format("hh:mmA")}</div>;
    },
  },
  {
    header: "Spent Amount",
    cell: ({ row }) => (
      <div className="text-primary-blue font-medium">
        {row.original.amount.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "remark",
    header: "Remark",
    cell: ({ row }) => <div>{row.original.remark || "_"}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as string;
      let statusColor = "";
      let bgColor = "";
      let content = "";

      if (status === "Success") {
        statusColor = "text-primary-green";
        bgColor = "bg-primary-green/10";
        content = "Successful";
      } else if (status === "Fail") {
        statusColor = "text-primary-red";
        bgColor = "bg-primary-red/10";
        content = "Failed";
      } else if (status === "Closed") {
        statusColor = "text-primary-brown";
        bgColor = "bg-primary-brown/10";
        content = "Closed";
      }

      return (
        <div className="flex items-center">
          <div className={`rounded-full px-3 py-1 ${bgColor} ${statusColor}`}>
            {content}
          </div>
        </div>
      );
    },
  },
];
