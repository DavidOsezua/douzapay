import { Button } from "@/components/ui/button";
import { useRequestInternalTransferOtp } from "@/hooks/use-mutations";
import { useModalStore } from "@/zustand/modalStore";
import { useUser } from "@/zustand/store";

import { ICON_MAP } from "@/lib/token-icons";

const ConfirmInternalTransfer = ({
  toUserId,
  payeeName,
  payeeEmail,
  assetId,
  amount,
  tokenSymbol,
  closeModal,
}: {
  toUserId: string;
  payeeName: string;
  payeeEmail: string;
  assetId: number;
  amount: number;
  tokenSymbol: string;
  closeModal: () => void;
}) => {
  const { openModal } = useModalStore();
  const user = useUser((s) => s.user);

  const initials = payeeName
    .split(" ")
    .slice(0, 2)
    .map((n) => n?.[0] ?? "")
    .join("")
    .toUpperCase();

  const { mutate: requestOtp, isPending } = useRequestInternalTransferOtp({
    onSuccess: () => {
      closeModal();
      openModal("otpInternalTransfer", {
        toUserId,
        payeeName,
        payeeEmail,
        assetId,
        amount,
        tokenSymbol,
      });
    },
  });

  const tokenIcon = ICON_MAP[tokenSymbol] ?? "/icons/usdt.svg";

  return (
    <div className="text-white">
      <h2 className="text-center text-base font-semibold">Confirm Payment</h2>

      <div className="mt-4 flex items-center gap-3">
        <div
          className="text-white flex size-10 shrink-0 items-center justify-center rounded-full border border-[#CECECE] text-sm font-semibold"
          style={{
            background:
              "linear-gradient(129.49deg, rgba(42, 42, 42, 0.5) 3.6%, rgba(28, 28, 28, 0.5) 100%)",
          }}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium">{payeeName}</p>
          <p className="text-xs text-white/50">{payeeEmail}</p>
        </div>
      </div>

      <div
        className="mt-4 rounded-xl border px-6 py-2 text-sm"
        style={{
          borderColor: "#CECECE2E",
          background:
            "linear-gradient(129.49deg, rgba(67, 72, 97, 0.1) 3.6%, rgba(95, 104, 149, 0.1) 100%)",
        }}
      >
        <div className="flex items-center justify-between py-3">
          <span className="font-light text-white/60">Send fee (0%)</span>
          <span>0 {tokenSymbol}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="font-light text-white/60">Payee will receive</span>
          <div className="flex items-center gap-1.5">
            <img src={tokenIcon} alt={tokenSymbol} className="size-4" />
            <span>
              {amount} {tokenSymbol}
            </span>
          </div>
        </div>
      </div>

      <div
        className="mt-2 flex items-center justify-between rounded-xl border px-6 py-4 text-sm"
        style={{
          borderColor: "#CECECE2E",
          background:
            "linear-gradient(129.49deg, rgba(67, 72, 97, 0.1) 3.6%, rgba(95, 104, 149, 0.1) 100%)",
        }}
      >
        <span className="font-light text-white/60">Method</span>
        <span>Internal Transfer</span>
      </div>

      <Button
        onClick={() =>
          requestOtp({
            purpose: "internal-transfer",
            emailAddress: user?.email ?? "",
            amount,
            toUserId,
            assetId,
          })
        }
        isLoading={isPending}
        disabled={isPending || !user?.email}
        className="bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 mb-2 h-11 w-full font-semibold text-[#242424]"
      >
        Continue
      </Button>
    </div>
  );
};

export default ConfirmInternalTransfer;
