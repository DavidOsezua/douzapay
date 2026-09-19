import { useState } from "react";
import { useBuyCards } from "@/hooks/use-mutations";
import { useGetUserAssets } from "@/hooks/use-queries";
import { useQueryClient } from "@tanstack/react-query";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";
import Throbber from "@/components/throbber";

const iconMap: Record<string, string> = {
  USDT: "/icons/usdt.svg",
  USDC: "/icons/usdc.svg",
};

const networkIconMap: Record<string, string> = {
  TRC20: "/icons/trc20.png",
  ERC20: "/icons/erc20.svg",
};

const SelectAssetForCard = ({
  cardPayload,
  total,
  onSuccess: closeSheet,
  closeModal,
}: {
  cardPayload: Omit<BuyCardPayload, "assetId">;
  total: number;
  onSuccess: () => void;
  closeModal: () => void;
}) => {
  const queryClient = useQueryClient();
  const formatAmount = useFormatAmountWithCurrency();
  const { data: userAssets } = useGetUserAssets();
  const totalBalance = (userAssets ?? []).reduce(
    (sum: number, a: any) => sum + Number(a.balance),
    0,
  );

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const effectiveAssetId = selectedAssetId ?? userAssets?.[0]?.id ?? null;
  const effectiveAsset =
    (userAssets ?? []).find((a: any) => a.id === effectiveAssetId) ??
    userAssets?.[0];

  const { mutate: createCard, isPending: isCreating } = useBuyCards({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      closeModal();
      closeSheet();
    },
  });

  const onSubmit = () => {
    createCard({ ...cardPayload, assetId: effectiveAsset?.tokenId });
  };

  return (
    <div>
      <h4 className="mt-2 text-sm font-medium">Wallet balance</h4>
      <p className="text-2xl font-medium">{formatAmount(totalBalance)}</p>

      <h4 className="mt-4 text-sm font-medium">
        Select your sub wallet to purchase your card
      </h4>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {(userAssets ?? []).map((asset: any) => {
          const label = `${asset.token.type}-${asset.token.symbol}`;
          const icon = iconMap[asset.token.symbol] ?? "/icons/usdt.svg";
          const networkIcon = networkIconMap[asset.token.type];
          const isSelected = effectiveAssetId === asset.id;
          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => setSelectedAssetId(asset.id)}
              className={`flex flex-1 flex-col gap-1 rounded-xl border border-dark-primary-main p-2.5 text-left transition-all ${
                isSelected
                  ? "bg-[linear-gradient(360deg,#6EF7FF_0%,#3FD8E8_100%)]"
                  : "bg-[#181818B2]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="relative size-4 shrink-0">
                  <img src={icon} alt={label} className="size-full" />
                  {networkIcon && (
                    <img
                      src={networkIcon}
                      alt={asset.token.type}
                      className="absolute -right-1 -bottom-1 size-2.5 rounded-full"
                    />
                  )}
                </div>
                <p
                  className={`text-[10px] leading-tight ${isSelected ? "text-[#080808]" : "text-white"}`}
                >
                  {label}
                </p>
              </div>
              <p
                className={`text-sm font-medium ${isSelected ? "text-[#080808]" : "text-white"}`}
              >
                {Number(asset.balance).toFixed(2)}
              </p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!effectiveAsset?.tokenId || isCreating}
        className="bg-dark-primary-main mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-[#080808] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCreating ? <Throbber /> : <>BUY NOW · ${total.toFixed(2)}</>}
      </button>
    </div>
  );
};

export default SelectAssetForCard;
