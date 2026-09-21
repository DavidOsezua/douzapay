import { Button } from "@/components/ui/button";
import { formatAmount } from "@/lib/utils";
import { useAdminModals } from "@/zustand/store";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
export type CardItem = {
  id: string;
  accountId: string;
  type: "PrepaidCard";
  bin: string;
  last4: string;
  network: "VISA";
  provider: string;
  firstName: string;
  lastName: string;
  label: string;
  ipr: boolean;
  status: "Inactive";
  createTime: string;
  cardholderId: null | string;
  billingAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    country: string;
    postalCode: string;
    state: string;
  };
  balance: {
    available: string;
    pending: string;
    frozen: string;
    currency: string;
  };
};

export const cardColumns: ColumnDef<CardItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="text-xs text-[#161B33] capitalize">
        {row.original.firstName + " " + row.original.lastName}
      </div>
    ),
  },
  {
    header: "Cards Bal",
    cell: ({ row }) => {
      return (
        <div className="text-xs">
          ${formatAmount(row.original.balance?.available)}
        </div>
      );
    },
  },
  {
    header: "Network",
    cell: ({ row }) => {
      return <div className="text-xs">{row.original.network}</div>;
    },
  },
  {
    header: "Type",
    cell: ({ row }) => {
      const provider = row.original.provider;
      const isSapphire = provider === "int";
      return (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            isSapphire
              ? "bg-[#1B5D9F]/20 text-[#8CADCD]"
              : "bg-[#7144B6]/20 text-[#C6ACF0]"
          }`}
        >
          {isSapphire ? "Sapphire" : "Platinum"}
        </span>
      );
    },
  },
  {
    header: "Card No",
    cell: ({ row }) => (
      <div className="text-xs text-[#001788]">****{row.original.last4}</div>
    ),
  },
  {
    header: "Status",
    cell: ({ row }) => {
      return <div className="text-xs">{row.original.status}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      // const { openModal } = useModalStore();
      return (
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              useAdminModals.setState({
                freezeCardIsOpen: true,
                freezeCardData: row.original,
              });
            }}
            className="bg-primary-500 flex size-6 items-center justify-center rounded-full p-0"
          >
            <img
              src="/icons/freeze-light.svg"
              alt="freeze icon"
              className="size-4"
            />
          </Button>
          <Button
            onClick={() => {
              useAdminModals.setState({
                deleteCardIsOpen: true,
                deleteCardData: row.original,
              });
            }}
            className="flex size-6 items-center justify-center rounded-full bg-[#FF6E7A] p-0"
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
          </Button>
        </div>
      );
    },
  },
];
