import CardOptions from "./options";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<AdminCard>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userName",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: "userEmail",
    header: "Email",
    cell: ({ row }) => row.original.userEmail || "N/A",
  },

  {
    accessorKey: "cards",
    header: "Cards Type",
    cell: ({ row }) => <div>{row.original.network}</div>,
  },

  {
    accessorKey: "cards_no",
    header: "Cards No",
    cell: ({ row }) => (
      <div className="font-semibold text-[#001788]">{`**** ${row.original.last4}`}</div>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={`flex h-auto items-center justify-center gap-1 rounded-full px-2 py-1 font-medium ${row.original.status === "Active" ? "text-primary-green bg-primary-green/10" : "text-primary-red bg-primary-red/10"}`}
      >
        {row.original.status === "Active"
          ? "Active"
          : row.original.status === "Frozen"
            ? "Inactive"
            : row.original.status === "Inactive" && "Deleted"}
      </div>
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <CardOptions
        status={row.original.status}
        id={row.original.id}
        card={row.original}
      />
    ),
  },
];
