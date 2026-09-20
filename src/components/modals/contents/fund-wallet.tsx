import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTransfer2Card } from "@/hooks/use-mutations";
import { formatAmount } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useModalStore } from "@/zustand/modalStore";

const FundWallet = ({
  cardData,
}: {
  closeModal: () => void;
  cardData: Card;
}) => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { openModal } = useModalStore();
  const { mutateAsync: transfer2Card, isPending: isTransferPending } =
    useTransfer2Card({
      id: cardData.id,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", "deposit"] });
        openModal("success", { type: "card-withdrawal" });
      },
    });

  const onSubmit = () => {
    transfer2Card({
      side: "withdraw",
      amount: amount,
    });
  };

  return (
    <div className="relative">
      <h4 className="mt-6 text-sm font-medium">Card balance</h4>
      <p className="text-2xl font-medium">
        ${formatAmount(cardData?.balance?.available)}
      </p>
      <h4 className="mt-2 text-sm font-medium">Amount</h4>
      <Input
        type="number"
        value={amount}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9.]/g, "");
          setAmount(value);
          if (Number(value) > Number(cardData?.balance?.available)) {
            setError("Amount exceeds your card balance");
          } else {
            setError("");
          }
        }}
        placeholder="Enter amount"
        className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E] text-white placeholder:text-[#B9BCCC] relative mt-2 h-11 lg:text-xs lg:placeholder:text-xs"
        tabIndex={0}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <div className="mt-6">
        <h4 className="text-xl font-semibold">Transfer to wallet</h4>
      </div>
      <p className="mt-3 text-xs" style={{ color: "#E1E1E1" }}>
        ⚠️ Withdrawals exceeding $5,000 may take longer than usual to process
        due to additional security and compliance checks.
      </p>
      <Button
        isLoading={isTransferPending}
        onClick={onSubmit}
        disabled={
          Number(amount) <= 0 ||
          Number(amount) > Number(cardData?.balance?.available) ||
          isTransferPending
        }
        className="text-dark-text-400 bg-dark-primary-main hover:bg-dark-primary-100 mt-4 h-11 w-full rounded-md"
      >
        Continue
      </Button>
    </div>
  );
};

export default FundWallet;
