import { Button } from "@/components/ui/button";
import { useGetUserAssets } from "@/hooks/use-queries";
import { AssetCardSelectSkeleton } from "@/components/skeletons/asset-card-skeleton";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";
import { useInternalTransferStore } from "@/zustand/internalTransferStore";
import { useSheetStore } from "@/zustand/sheetStore";
import { useEffect, useState } from "react";

import { ICON_MAP, NETWORK_ICON_MAP } from "@/lib/token-icons";

const InternalTransferAssetSelect = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const { data: userAssets, isLoading: assetsLoading } = useGetUserAssets();
  const formatAmount = useFormatAmountWithCurrency();
  const { confirmedAsset, setConfirmedAsset } = useInternalTransferStore();
  const { setStep } = useSheetStore();
  const [selectedId, setSelectedId] = useState<number | null>(
    confirmedAsset?.tokenId ?? null,
  );

  useEffect(() => {
    if (userAssets && userAssets.length > 0 && selectedId == null) {
      setSelectedId(userAssets[0].tokenId);
    }
  }, [userAssets]);

  const totalBalance = (userAssets ?? []).reduce(
    (sum: number, a) => sum + Number(a.balance),
    0,
  );

  const handleContinue = () => {
    const asset = (userAssets ?? []).find((a) => a.tokenId === selectedId);
    if (!asset) return;
    setConfirmedAsset(asset);
    setStep(2);
    closeModal();
  };

  return (
    <div className="relative z-[999] text-white">
      <h4 className="mt-6 text-sm font-medium">Wallet balance</h4>
      <p className="text-2xl font-medium">{formatAmount(totalBalance)}</p>

      <h4 className="mt-4 text-sm font-medium">
        Select your sub wallet to send from
      </h4>
      <div className="mt-2 flex gap-2">
        {assetsLoading ? (
          <>
            <AssetCardSelectSkeleton />
            <AssetCardSelectSkeleton />
          </>
        ) : (
          (userAssets ?? []).map((asset) => {
            const label = `${asset.token.type}-${asset.token.symbol}`;
            const icon = ICON_MAP[asset.token.symbol] ?? "/icons/usdt.svg";
            const networkIcon = NETWORK_ICON_MAP[asset.token.type];
            const isSelected = selectedId === asset.tokenId;
            const balanceStr = Number(asset.balance).toFixed(2);
            const [intPart, decPart] = balanceStr.split(".");
            return (
              <button
                key={asset.tokenId}
                onClick={() => setSelectedId(asset.tokenId)}
                style={{
                  flex: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "8px",
                  borderRadius: "14px",
                  padding: "12px",
                  background: isSelected
                    ? "linear-gradient(360deg, #6EF7FF 0%, #3FD8E8 100%)"
                    : "#434861",
                  border: isSelected
                    ? "1.5px solid #3FD8E8"
                    : "1.5px solid #CECECE2E",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "24px",
                      height: "24px",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={icon}
                      alt={label}
                      style={{ width: "100%", height: "100%" }}
                    />
                    {networkIcon && (
                      <img
                        src={networkIcon}
                        alt={asset.token.type}
                        style={{
                          position: "absolute",
                          bottom: "-4px",
                          right: "-4px",
                          width: "13px",
                          height: "13px",
                          borderRadius: "50%",
                          background: "#181818",
                        }}
                      />
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "11px",
                      color: isSelected ? "#080808" : "rgba(255,255,255,0.7)",
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    margin: 0,
                    color: isSelected ? "#080808" : "white",
                    lineHeight: 1,
                  }}
                >
                  {intPart}
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>
                    .{decPart}
                  </span>
                </p>
              </button>
            );
          })
        )}
      </div>

      {!assetsLoading && (userAssets ?? []).length === 0 && (
        <p className="mt-4 text-center text-sm text-white/50">
          No wallets available to send from.
        </p>
      )}

      <Button
        disabled={selectedId == null}
        onClick={handleContinue}
        className="bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 mb-6 h-11 w-full font-semibold text-[#242424] disabled:opacity-50"
      >
        Continue
      </Button>
    </div>
  );
};

export default InternalTransferAssetSelect;
