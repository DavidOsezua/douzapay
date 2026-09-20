import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/zustand/sheetStore";
import { useState } from "react";
import { handleError } from "@/lib/helper";
import { useGetSupportedTokens, useGetUserWallet } from "@/hooks/use-queries";
import { getCurrencyIconPath } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const SelectAutoDeposit = ({ closeModal }: { closeModal: () => void }) => {
  const [activeOption, setActiveOption] = useState<SupportedToken | null>(null);
  const { openSheet } = useSheetStore();
  const { mutateAsync: getUserWallet, isPending: isGettingWallet } =
    useGetUserWallet();

  const handleSubmit = async () => {
    if (!activeOption) return;
    try {
      const res = await getUserWallet(activeOption.id);
      closeModal();
      openSheet("autoDeposit", null, { wallet: res });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="">
      <h4 className="mb-4 text-sm font-medium">Select Payment Method</h4>
      <SelectPaymentMethod
        activeOption={activeOption}
        setActiveOption={setActiveOption}
      />

      {activeOption && (
        <div className="mt-4 px-3 py-3 text-center">
          <p className="text-xs font-semibold text-red-400">Disclaimer</p>
          <p className="text-[#B9BCCC] mt-1 text-xs">
            {activeOption.type === "TRC20"
              ? "TRC20 deposits may take up to 5 minutes to fund your Virtual Card after blockchain confirmation."
              : "ERC20 deposits may take up to 10 minutes to fund your Virtual Card after blockchain confirmation."}
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
  activeOption,
  setActiveOption,
}: {
  activeOption: SupportedToken | null;
  setActiveOption: (value: SupportedToken | null) => void;
}) => {
  const { data: tokens, isLoading } = useGetSupportedTokens();

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
              {activeOption?.id === token.id ? (
                <img
                  src={getCurrencyIconPath(token.symbol)}
                  alt={token.symbol + token.type}
                  className="size-8"
                />
              ) : (
                <img
                  src={getCurrencyIconPath(token.symbol, true)}
                  alt={token.symbol + token.type}
                  className="size-8"
                />
              )}
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
