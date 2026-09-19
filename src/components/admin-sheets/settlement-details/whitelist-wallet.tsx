import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGetWallets } from "../../../hooks/use-queries";
import { useAdminModals, useUser } from "@/zustand/store";
import LineLoader from "@/components/line-loader";
import { DataTable } from "@/pages/admin-dashboard/_misc/data-table";
import { walletColumns } from "../_misc/column";

const WhitelistWallet = () => {
  const { user } = useUser();
  const { data: wallets, isLoading } = useGetWallets({
    whiteLabelId: user.whiteLabelId,
  });

  return (
    <>
      <div className="text-primary-500 mt-4 bg-[#DFEEFF] px-4 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Wallet Management</h2>
        </div>
      </div>
      <div className="flex h-[calc(100vh-160px)] flex-col p-4">
        <p className="text-primary-500/70">
          Add and whitelist your wallets for receiving settlements
        </p>
        {wallets?.data.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            No Wallet whitelisted yet
          </div>
        ) : (
          <div className="mt-4 flex flex-1 flex-col">
            {isLoading ? (
              <LineLoader />
            ) : (
              <DataTable data={wallets?.data || []} columns={walletColumns} />
            )}
          </div>
        )}

        <Button
          onClick={() => useAdminModals.setState({ addWalletIsOpen: true })}
          className="w-full gap-2.5"
        >
          <Plus className="size-5" />
          <span>Add New Wallet</span>
        </Button>
      </div>
    </>
  );
};

export default WhitelistWallet;
