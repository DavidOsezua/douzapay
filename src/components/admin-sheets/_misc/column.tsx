import Copy from "@/components/copy";
import { Button } from "@/components/ui/button";
import { formatAddress, getCurrencyIconPath } from "@/lib/utils";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useDeleteWalletAdmin } from "@/hooks/use-mutations";
import { useQueryClient } from "@tanstack/react-query";

const ActionsCell = ({ row }: CellContext<Wallet, unknown>) => {
  const queryClient = useQueryClient();
  const { mutate: deleteWallet, isPending: isDeletePending } =
    useDeleteWalletAdmin({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["wallets"] });
      },
    });
  return (
    <Button
      disabled={isDeletePending}
      isLoading={isDeletePending}
      onClick={() => deleteWallet({ addressId: row.original.id })}
      variant="ghost"
      className="rounded-full px-2 py-1 text-red-600"
    >
      <Trash2 className="size-4" />
    </Button>
  );
};

export const walletColumns: ColumnDef<Wallet>[] = [
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
    accessorKey: "coin",
    header: "Coin",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <img
            src={getCurrencyIconPath(row.original.crypto)}
            className="size-4"
            alt={row.original.crypto}
          />
          <span className="text-xs text-[#161B33]">{row.original.crypto}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "network",
    header: "Network",
    cell: ({ row }) => (
      <div className="text-xs text-[#07111B]">{row.original.network}</div>
    ),
  },
  {
    accessorKey: "address",
    header: "Wallet address",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-1">
          <span className="font-urbanist text-semibold max-w-xs truncate text-xs text-[#161B33]">
            {formatAddress(row.original.walletAddress)}
          </span>
          <Copy text={row.original.walletAddress} side="left" />
        </div>
      );
    },
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isPending = status === "pending";

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className={`h-auto rounded-full px-2 py-1 text-xs ${
              isPending
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            <span className="capitalize">{status}</span>
          </Button>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ActionsCell,
  },
];
