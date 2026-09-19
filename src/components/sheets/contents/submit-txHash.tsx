import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitTransactionHash } from "@/hooks/use-mutations";
import { handleError } from "@/lib/helper";
import { useModalStore } from "@/zustand/modalStore";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const SubmitTxHash = ({
  closeSheet,
  depositOrderId,
}: {
  closeSheet: () => void;
  depositOrderId: string;
}) => {
  const { openModal } = useModalStore();
  const queryClient = useQueryClient();
  const [txId, setTxId] = useState("");

  const { mutateAsync: submitTransactionHash, isPending: isSubmittingHash } =
    useSubmitTransactionHash({
      id: depositOrderId,
    });

  const handleConfirm = async () => {
    try {
      await submitTransactionHash({ transactionHash: txId });
      queryClient.invalidateQueries({
        queryKey: ["deposits"],
      });
      queryClient.invalidateQueries({
        queryKey: ["depositOrder"],
      });
      queryClient.invalidateQueries({
        queryKey: ["recentTransactions"],
      });
      openModal("success", { type: "deposit" });
      closeSheet();
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div>
      <div className="mt-6">
        <p className="mt-4 text-lg">Enter Transaction Hash</p>
        <p className="text-xs text-[#D4D4D4]">
          Enter Transaction hash to complete deposit
        </p>
        <h4 className="mt-4 text-xs">Enter Transaction Hash</h4>
        <Input
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder="Enter Transaction Hash"
          className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E] mt-1 h-11 text-xs text-white placeholder:text-xs placeholder:text-white/50"
        />
        <div
          className="mt-4 rounded-lg px-4 py-2 text-[14px]"
          style={{
            background:
              "linear-gradient(129.49deg, #2D3351 3.6%, #434A6D 100%)",
          }}
        >
          <h6>NOTE</h6>
          <p className="mt-1 font-semibold tracking-wide text-red-400">
            Your transaction will not be approved until you input the correct
            transaction hash
          </p>
        </div>
        <Button
          disabled={!txId || isSubmittingHash}
          isLoading={isSubmittingHash}
          onClick={() => handleConfirm()}
          className="text-dark-text-50 bg-primary-100 hover:bg-dark-primary-main/80 mt-6 mb-8 w-full font-semibold"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default SubmitTxHash;
