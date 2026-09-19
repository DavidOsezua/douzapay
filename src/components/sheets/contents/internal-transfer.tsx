import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLookupPayee } from "@/hooks/use-mutations";
import {
  useGetInternalTransferHistory,
  useGetUserAssets,
} from "@/hooks/use-queries";
import { useModalStore } from "@/zustand/modalStore";
import { useInternalTransferStore } from "@/zustand/internalTransferStore";
import { useUser } from "@/zustand/store";
import { ChevronDown, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

import { ICON_MAP, NETWORK_ICON_MAP } from "@/lib/token-icons";

const InternalTransfer = ({ step }: { step: number }) => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { openModal } = useModalStore();
  const user = useUser((state) => state.user);
  const {
    confirmedPayee,
    confirmedAsset,
    setConfirmedPayee,
    setConfirmedAsset,
    reset,
  } = useInternalTransferStore();
  const { data: historyData, isLoading: historyLoading } =
    useGetInternalTransferHistory();
  const beneficiaries = historyData?.data ?? [];
  const { data: userAssets } = useGetUserAssets();

  const {
    mutate: lookup,
    data: payee,
    isPending: isLooking,
    reset: resetPayee,
  } = useLookupPayee();

  // Reset store state when sheet unmounts
  useEffect(() => () => reset(), []);

  // Always clear payee on every email change to prevent stale-recipient race
  useEffect(() => {
    resetPayee();
    if (!EMAIL_RE.test(email)) return;
    const timer = setTimeout(() => lookup(email), 600);
    return () => clearTimeout(timer);
  }, [email]);

  // Reset amount when the selected asset changes
  useEffect(() => {
    setAmount("");
  }, [confirmedAsset?.tokenId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowTokenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Only treat payee as valid when its email matches what the user typed
  const validPayee =
    payee?.email?.toLowerCase() === email.trim().toLowerCase() ? payee : null;
  const isSelf = !!(validPayee && user && validPayee.id === user.id);
  const payeeName = validPayee
    ? `${validPayee.firstName} ${validPayee.lastName}`
    : "";

  const handleContinueStep1 = () => {
    if (!validPayee || isSelf) return;
    setConfirmedPayee(validPayee);
    setAmount("");
    openModal("internalTransferAssetSelect");
  };

  const handleContinueStep2 = () => {
    if (!confirmedPayee || !confirmedAsset || !amount) return;
    const parsed = parseFloat(amount);
    if (parsed <= 0 || parsed > Number(confirmedAsset.balance)) return;
    openModal("confirmInternalTransfer", {
      toUserId: confirmedPayee.id,
      payeeName: `${confirmedPayee.firstName} ${confirmedPayee.lastName}`,
      payeeEmail: confirmedPayee.email,
      assetId: confirmedAsset.tokenId,
      amount: parsed,
      tokenSymbol: confirmedAsset.token.symbol,
    });
  };

  if (step === 2 && confirmedPayee && confirmedAsset) {
    const label = `${confirmedAsset.token.type}-${confirmedAsset.token.symbol}`;
    const icon = ICON_MAP[confirmedAsset.token.symbol] ?? "/icons/usdt.svg";
    const networkIcon = NETWORK_ICON_MAP[confirmedAsset.token.type];
    const balance = Number(confirmedAsset.balance);
    const numAmount = parseFloat(amount) || 0;
    const overBalance = numAmount > 0 && numAmount > balance;
    const initials =
      `${confirmedPayee.firstName?.[0] ?? ""}${confirmedPayee.lastName?.[0] ?? ""}`.toUpperCase();

    return (
      <div className="mt-4 flex h-full flex-col px-2 text-white">
        <h2 className="font-semibold">Send to {confirmedPayee.firstName}</h2>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              {confirmedPayee.firstName} {confirmedPayee.lastName}
            </p>
            <p className="text-xs text-white/50">{confirmedPayee.email}</p>
          </div>
          <div
            className="text-white flex size-10 shrink-0 items-center justify-center rounded-full border border-[#CECECE] text-sm font-semibold"
            style={{
              background:
                "linear-gradient(129.49deg, rgba(42, 42, 42, 0.5) 3.6%, rgba(28, 28, 28, 0.5) 100%)",
            }}
          >
            {initials}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#B9BCCC]">
          Payee will receive
        </p>

        {/* Token selector */}
        <div className="relative mt-2 flex justify-center" ref={dropdownRef}>
          <button
            onClick={() => setShowTokenDropdown((v) => !v)}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition hover:bg-white/10"
          >
            <div className="relative size-5">
              <img src={icon} alt={label} className="size-full" />
              {networkIcon && (
                <img
                  src={networkIcon}
                  alt={confirmedAsset.token.type}
                  className="absolute -right-1 -bottom-1 size-3 rounded-full"
                  style={{ background: "#181818" }}
                />
              )}
            </div>
            <span className="text-[#B9BCCC]">{label}</span>
            <ChevronDown className="size-3.5 text-[#B9BCCC]" />
          </button>

          {showTokenDropdown && (
            <div className="bg-dark-card-3 absolute top-full z-10 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-white/10 shadow-xl">
              {(userAssets ?? []).map((asset) => {
                const aLabel = `${asset.token.type}-${asset.token.symbol}`;
                const aIcon = ICON_MAP[asset.token.symbol] ?? "/icons/usdt.svg";
                const isActive = asset.tokenId === confirmedAsset.tokenId;
                return (
                  <button
                    key={asset.tokenId}
                    onClick={() => {
                      setConfirmedAsset(asset);
                      setShowTokenDropdown(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-white/10 ${isActive ? "bg-white/10" : ""}`}
                  >
                    <img src={aIcon} alt={aLabel} className="size-4" />
                    <span className="text-[#B9BCCC]">{aLabel}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Amount input */}
        <div className="mt-3 flex flex-col items-center">
          <input
            autoFocus
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent text-center text-5xl font-bold text-white outline-none placeholder:text-white/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <p className="mt-1 text-sm text-white/40">
            ≈ {numAmount.toFixed(2)} {confirmedAsset.token.symbol}
          </p>
          {overBalance && (
            <p className="mt-1 text-xs text-[#FF6E7A]">Insufficient balance</p>
          )}
        </div>

        {/* Summary card */}
        <div
          className="mt-5 rounded-xl border px-6 py-2 text-sm"
          style={{
            borderColor: "#CECECE2E",
            background:
              "linear-gradient(129.49deg, rgba(67, 72, 97, 0.1) 3.6%, rgba(95, 104, 149, 0.1) 100%)",
          }}
        >
          <div className="flex items-center justify-between py-3">
            <span className="font-light text-white/60">{label} Balance</span>
            <div className="flex items-center gap-2">
              <span>
                {balance.toFixed(2)} {confirmedAsset.token.symbol}
              </span>
              <button
                onClick={() => setAmount(balance.toString())}
                className="text-xs font-normal text-[#3FD8E8]"
              >
                Max
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-light text-white/60">Send fee (0%)</span>
            <span>0 {confirmedAsset.token.symbol}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-light text-white/60">
              Payee will receive
            </span>
            <span>
              {numAmount.toFixed(2)} {confirmedAsset.token.symbol}
            </span>
          </div>
        </div>

        {/* Footer — pinned to bottom of flex column */}
        <div className="mt-auto flex flex-col items-center gap-3 pt-5 pb-8">
          <div className="flex items-center gap-1.5 text-center text-xs text-white/50">
            <Zap className="size-3.5 shrink-0 fill-white/50" />
            <span>Usually arrives in less than 5 mins.</span>
          </div>
          <Button
            onClick={handleContinueStep2}
            disabled={!amount || parseFloat(amount) <= 0 || overBalance}
            className="bg-dark-primary-main hover:bg-dark-primary-main/80 h-11 w-full font-semibold text-[#242424] disabled:opacity-40"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Step 1
  return (
    <div className="mt-4 px-2 text-white">
      <h2 className="font-semibold">Send to Krypt Kard User</h2>

      <div className="mt-6 space-y-4">
        <div>
          <p className="mb-2 text-xs">Email</p>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Krypt Kard user email"
            className="h-11 rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white placeholder:text-white/50 lg:text-xs lg:placeholder:text-xs"
          />
        </div>

        {validPayee && !isSelf && (
          <div>
            <p className="mb-2 text-xs">Payee full name</p>
            <Input
              readOnly
              value={payeeName}
              className="h-11 rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white lg:text-xs"
            />
          </div>
        )}

        {isSelf && (
          <p className="text-xs text-[#FF6E7A]">
            You can&apos;t send to yourself.
          </p>
        )}

        {validPayee && !isSelf && (
          <p className="text-[11px] leading-4 text-[#D4D4D4]">
            Please verify the recipient&apos;s details before continuing.
            Transfers to the wrong account may not be reversible.
          </p>
        )}
      </div>

      <Button
        onClick={handleContinueStep1}
        disabled={!validPayee || isLooking || isSelf}
        isLoading={isLooking}
        className="bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 h-11 w-full font-semibold text-[#242424] disabled:opacity-40"
      >
        Continue
      </Button>

      <div className="mt-8">
        <p className="mb-4 text-sm font-medium">Recent</p>
        {historyLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-dark-card-3 h-12 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : beneficiaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-bold">No Transfers Yet</p>
            <p className="mt-2 max-w-[220px] text-sm font-light text-[#8C8C8C]">
              You haven&apos;t sent money to any Krypt Kard user yet. Your
              transfers will appear here once you send money.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {beneficiaries.map((item) => {
              const initials =
                `${item.firstName?.[0] ?? ""}${item.lastName?.[0] ?? ""}`.toUpperCase();
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.id === user?.id) return;
                    setConfirmedPayee({
                      id: item.id,
                      firstName: item.firstName,
                      lastName: item.lastName,
                      email: item.email,
                    });
                    setAmount("");
                    openModal("internalTransferAssetSelect");
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-white/5"
                >
                  <div
                    className="text-white flex size-9 shrink-0 items-center justify-center rounded-full border border-[#CECECE] text-xs font-semibold"
                    style={{
                      background:
                        "linear-gradient(129.49deg, rgba(42, 42, 42, 0.5) 3.6%, rgba(28, 28, 28, 0.5) 100%)",
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-medium">
                      {item.firstName} {item.lastName}
                    </p>
                    <p className="text-xs text-[#8C8C8C]">{item.email}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalTransfer;
