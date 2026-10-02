import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/zustand/sheetStore";
import { useMemo, useState } from "react";
import { useGetSupportedTokens, useGetUserWallet } from "@/hooks/use-queries";
import { getCurrencyIconPath } from "@/lib/utils";
import { NETWORK_ICON_MAP } from "@/lib/token-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Info } from "lucide-react";

// Appended on the frontend, not returned by /users/supported-tokens. Its id
// is a sentinel (never a real token id) so selecting it never hits
// GET /users/wallet/{id} directly — see handleSubmit, which instead reuses
// the ERC20-USDC wallet's address, since Arbitrum shares Ethereum's address
// space.
const ARB_USDC_TOKEN: SupportedToken = {
  id: -1,
  symbol: "USDC",
  name: "USD Coin",
  type: "ARB",
  contractAddress: "",
  decimals: 6,
  networkId: -1,
  isActive: true,
  createdAt: "",
  updatedAt: "",
  network: {
    id: -1,
    name: "Arbitrum",
    symbol: "ARB",
    rpcUrl: "",
    explorerUrl: "",
    isActive: true,
  },
};

const SelectAutoDeposit = ({ closeModal }: { closeModal: () => void }) => {
  const [activeOption, setActiveOption] = useState<SupportedToken | null>(null);
  const { openSheet } = useSheetStore();
  const { data: fetchedTokens, isLoading } = useGetSupportedTokens();
  const tokens = useMemo(
    () => (fetchedTokens ? [...fetchedTokens, ARB_USDC_TOKEN] : fetchedTokens),
    [fetchedTokens],
  );
  const { mutateAsync: getUserWallet, isPending: isGettingWallet } =
    useGetUserWallet();

  const handleSubmit = async () => {
    if (!activeOption) return;
    try {
      let res;
      if (activeOption.id === ARB_USDC_TOKEN.id) {
        const erc20Usdc = fetchedTokens?.find(
          (t) => t.symbol === "USDC" && t.type === "ERC20",
        );
        if (!erc20Usdc) {
          toast.error("USDC (ARB) deposits aren't available right now");
          return;
        }
        const erc20Wallet = await getUserWallet(erc20Usdc.id);
        res = { ...erc20Wallet, token: { ...erc20Wallet.token, type: "ARB" } };
      } else {
        res = await getUserWallet(activeOption.id);
      }
      closeModal();
      openSheet("autoDeposit", null, { wallet: res });
    } catch {
      // The mutation's own onError already toasts.
    }
  };

  return (
    <div className="">
      <h4 className="mb-4 text-sm font-medium">Select Payment Method</h4>
      <SelectPaymentMethod
        tokens={tokens}
        isLoading={isLoading}
        activeOption={activeOption}
        setActiveOption={setActiveOption}
      />

      {activeOption?.type === "ARB" && (
        <div className="mt-4 flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
          <Info className="text-dark-primary-200 mt-0.5 size-4 shrink-0" />
          <p className="text-dark-primary-200 text-xs leading-4">
            Your USDC-ARB deposit will be automatically swapped to
            USDC-ERC20. This may take up to 10 minutes, and the USDC will
            then be available in your wallet.
          </p>
        </div>
      )}

      {activeOption && (
        <div className="mt-4 px-3 py-3 text-center">
          <p className="text-xs font-semibold text-red-400">Disclaimer</p>
          <p className="text-[#B9BCCC] mt-1 text-xs">
            {activeOption.type === "TRC20"
              ? "TRC20 deposits may take up to 5 minutes to fund your Virtual Card after blockchain confirmation."
              : `${activeOption.type} deposits may take up to 10 minutes to fund your Virtual Card after blockchain confirmation.`}
          </p>
        </div>
      )}

      <Button
        isLoading={isGettingWallet}
        onClick={handleSubmit}
        disabled={!activeOption || isGettingWallet}
        className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 h-11 w-full rounded-md"
      >
        Continue
      </Button>
    </div>
  );
};

export const SelectPaymentMethod = ({
  tokens,
  isLoading,
  activeOption,
  setActiveOption,
}: {
  tokens: SupportedToken[] | undefined;
  isLoading: boolean;
  activeOption: SupportedToken | null;
  setActiveOption: (value: SupportedToken | null) => void;
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2.5">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-md py-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {tokens?.map((token) => (
        <div
          role="button"
          key={token.id}
          onClick={() => setActiveOption(token)}
          className={`rounded-md py-4 hover:cursor-pointer ${
            activeOption?.id === token.id
              ? "text-[#242424] bg-[#E1E1E1]"
              : "bg-[#181818B2] text-white"
          }`}
        >
          <div className="flex flex-col items-center">
            <div
              className={
                activeOption?.id === token.id ? "opacity-100" : "opacity-50"
              }
            >
              <div className="relative size-8 shrink-0">
                <img
                  src={getCurrencyIconPath(
                    token.symbol,
                    activeOption?.id !== token.id,
                  )}
                  alt={token.symbol + token.type}
                  className="size-full"
                />
                {NETWORK_ICON_MAP[token.type] && (
                  <img
                    src={NETWORK_ICON_MAP[token.type]}
                    alt={token.type}
                    className="absolute -right-1 -bottom-1 size-3.5 rounded-full border border-white"
                  />
                )}
              </div>
            </div>
            <p className="mt-4 text-sm">
              {token.symbol + " (" + token.type + ")"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectAutoDeposit;
