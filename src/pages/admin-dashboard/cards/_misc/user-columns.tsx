import { Button } from "@/components/ui/button";
import { useAdminModals } from "@/zustand/store";
import { Edit } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    header: "Name",
    cell: ({ row }) => (
      <div>{`${row.original.firstName} ${row.original.lastName}`}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    header: "Created ",
    cell: ({ row }) => (
      <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>
    ),
  },
  {
    header: "Time",
    cell: ({ row }) => (
      <div>{new Date(row.original.createdAt).toLocaleTimeString()}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (info) => (
      <Button
        onClick={() => {
          useAdminModals.setState({
            createCardIsOpen: true,
            createCardData: info.row.original,
          });
        }}
        variant="ghost"
        className="bg-primary-purple/10 text-primary-purple flex h-auto items-center gap-1 rounded-full p-2 py-1"
      >
        <Edit className="size-4" />
        <span>Create Card</span>
      </Button>
    ),
  },
];
