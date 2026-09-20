import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTransfer2Card } from "@/hooks/use-mutations";
import { useGetUserAssets } from "@/hooks/use-queries";
import { useQueryClient } from "@tanstack/react-query";
import { useModalStore } from "@/zustand/modalStore";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";

const iconMap: Record<string, string> = {
  USDT: "/icons/usdt.svg",
  USDC: "/icons/usdc.svg",
};

const networkIconMap: Record<string, string> = {
  TRC20: "/icons/trc20.png",
  ERC20: "/icons/erc20.svg",
};

const FundCard = ({ cardData }: { cardData: Card }) => {
  const queryClient = useQueryClient();
  const formatAmount = useFormatAmountWithCurrency();

  const { data: userAssets } = useGetUserAssets();
  const totalBalance = (userAssets ?? []).reduce(
    (sum: number, a: any) => sum + Number(a.balance),
    0,
  );

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { openModal } = useModalStore();

  // Fall back to first asset if none explicitly selected
  const effectiveAssetId = selectedAssetId ?? userAssets?.[0]?.id ?? null;
  const selectedAsset = (userAssets ?? []).find(
    (a: any) => a.id === effectiveAssetId,
  );
  const selectedBalance = selectedAsset ? Number(selectedAsset.balance) : 0;

  const { mutateAsync: transfer2Card, isPending: isTransferPending } =
    useTransfer2Card({
      id: cardData.id,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user", "deposits", "cardInfo", cardData.id],
        });
        openModal("success", {
          type: "card-topup",
          transaction: {
            id: cardData.id,
            amount,
            createdAt: new Date().toISOString(),
          },
        });
      },
    });

  const onSubmit = () => {
    transfer2Card({
      side: "fund",
      amount,
      assetId: selectedAsset?.tokenId,
    });
  };

  return (
    <div className="relative z-[999]">
      <h4 className="mt-6 text-sm font-medium">Wallet balance</h4>
      <p className="text-2xl font-medium">{formatAmount(totalBalance)}</p>

      <h4 className="mt-4 text-sm font-medium">
        Select your sub wallet to fund your card
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
              onClick={() => {
                setSelectedAssetId(asset.id);
                setAmount("");
                setError("");
              }}
              className={`flex flex-1 flex-col gap-1 rounded-xl border border-dark-primary-main p-2.5 text-left transition-all ${
                isSelected
                  ? "bg-[#E1E1E1]"
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
                  className={`text-[10px] leading-tight ${isSelected ? "text-[#242424]" : "text-white"}`}
                >
                  {label}
                </p>
              </div>
              <p
                className={`text-sm font-medium ${isSelected ? "text-[#242424]" : "text-white"}`}
              >
                {Number(asset.balance).toFixed(2)}
              </p>
            </button>
          );
        })}
      </div>

      <h4 className="mt-4 text-sm font-medium">Amount</h4>
      <Input
        type="text"
        inputMode="numeric"
        value={amount}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9.]/g, "");
          setAmount(value);
          if (Number(value) > selectedBalance) {
            setError("Amount exceeds selected wallet balance");
          } else {
            setError("");
          }
        }}
        placeholder="Enter amount"
        className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E] text-white placeholder:text-[#B9BCCC] relative mt-2 h-11 lg:text-xs lg:placeholder:text-xs"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      <div className="mt-4">
        <h4 className="text-sm font-semibold">Fund your Card</h4>
        <div className="mt-1 flex items-center gap-3 text-xs">
          <span>
            {cardData.firstName} {cardData.lastName}
          </span>
          <span>**** {cardData.last4}</span>
        </div>
      </div>

      <Button
        isLoading={isTransferPending}
        onClick={onSubmit}
        disabled={
          !effectiveAssetId ||
          Number(amount) <= 0 ||
          Number(amount) > selectedBalance ||
          isTransferPending
        }
        className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-100 mt-4 h-11 w-full rounded-md"
      >
        Continue
      </Button>
    </div>
  );
};

export default FundCard;
