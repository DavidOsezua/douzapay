import Copy from "@/components/copy";
import { tokens } from "@/components/modals/contents/select-deposit-method";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitTransactionHash } from "@/hooks/use-mutations";
import { formatAmount } from "@/lib/utils";
import { useModalStore } from "@/zustand/modalStore";
import { useUser } from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import QrCode from "react-qr-code";
import { toast } from "sonner";

const Deposit = ({
  amount,
  token,
  step,
  setStep,
  depositOrder,
  closeSheet,
}: {
  amount: number;
  token: string;
  step: number;
  depositOrder: DepositOrder | null;
  setStep: (step: number) => void;
  closeSheet: () => void;
}) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { openModal } = useModalStore();
  const [txId, setTxId] = useState("");
  const tokenOption = tokens.find((option) => option.title === token);

  const { mutateAsync: submitTransactionHash, isPending: isSubmittingHash } =
    useSubmitTransactionHash({
      id: depositOrder!.id,
    });

  const handleConfirm = async () => {
    try {
      await submitTransactionHash({ transactionHash: txId });
      queryClient.invalidateQueries({
        queryKey: ["deposits"],
      });
      queryClient.invalidateQueries({
        queryKey: ["recentTransactions"],
      });
      openModal("success", { type: "deposit" });
      closeSheet();
    } catch {
      toast.error("Something went wrong, try again");
    }
  };

  return (
    <div className="text-white mt-4 px-2">
      {step === 1 && (
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <img
              src={tokenOption?.icon}
              alt={tokenOption?.title}
              className="size-8"
            />
            <span className="text-sm">{tokenOption?.altTitle}</span>
          </div>
          <p className="mt-4 text-lg">Deposit {tokenOption?.altTitle}</p>
          <p className="text-xs text-[#D4D4D4]">
            Only send {tokenOption?.coin} on the {tokenOption?.network} network
            to this address.
          </p>
          <div className="mt-6 flex flex-col gap-4">
            <div className="self-start rounded-xl bg-white p-2 text-center lg:shrink-0">
              <div className="size-24">
                <QrCode
                  className="size-full"
                  value={tokenOption?.address as string}
                />
              </div>
              <span className="text-primary-50 text-[10px]">Scan this</span>
            </div>
            <div>
              <div>
                <p className="text-xs">ID</p>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span className="">{depositOrder?.id}</span>

                  <Copy
                    icon="/icons/copy-light.svg"
                    text={String(depositOrder?.id) || ""}
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs">
                  Send {tokenOption?.altTitle} to this address
                </p>
                <div className="bg-dark-input text-dark-text-400 border-dark-stroke-3 mt-2 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm backdrop-blur-lg">
                  <span
                    className="max-w-sm shrink overflow-hidden leading-5.5 font-medium text-ellipsis whitespace-nowrap"
                    title={tokenOption?.address}
                  >
                    {tokenOption?.address}
                  </span>
                  <Copy
                    icon="/icons/copy-light.svg"
                    text={tokenOption?.address as string}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>SEND FEE ({user?.depositFee}%)</span>
                  <span>
                    {formatAmount(((user?.depositFee || 0) / 100) * amount)}{" "}
                    {tokenOption?.coin}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>YOU WILL RECIEVE</span>
                  <span>
                    {formatAmount(
                      amount - ((user?.depositFee || 0) / 100) * amount,
                    )}{" "}
                    {tokenOption?.coin}
                  </span>
                </div>
              </div>

              <div className="bg-dark-input text-dark-text-400 mt-4 rounded-lg px-4 py-2 text-[10px]">
                <h6>PAYMENT INSTRUCTION</h6>
                <p className="mt-2 font-light">
                  If the transferred amount is inconsistent with the order
                  amount above, the account will not be credited.
                </p>
                <ul className="mt-2 list-disc pl-4 font-light">
                  <li>
                    If there is an amount after the decimal point, it must also
                    be transferred.
                  </li>
                  <li>
                    Some exchanges will deduct 1 USDT handling fee for
                    withdrawals. Please make sure that the transfer amount is
                    consistent with the order amount.
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 mb-8 w-full font-semibold"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6">
          <p className="mt-4 text-lg">Enter Transaction hash</p>
          <p className="text-xs text-[#D4D4D4]">
            Enter Transaction hash to complete deposit
          </p>
          <h4 className="mt-4 text-xs">Enter Transaction Hash</h4>
          <Input
            value={txId}
            onChange={(e) => setTxId(e.target.value)}
            placeholder="Enter Transaction hash"
            className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E] text-white mt-1 h-11 lg:text-xs lg:placeholder:text-xs"
          />
          <div className="bg-dark-input text-dark-text-400 mt-4 rounded-lg px-4 py-2 text-[14px]">
            <h6>NOTE</h6>
            <p className="mt-1 font-bold tracking-wide text-red-400">
              Your transaction will not be approved until you input the correct
              transaction hash
            </p>
          </div>
          <Button
            disabled={!txId || isSubmittingHash}
            isLoading={isSubmittingHash}
            onClick={() => handleConfirm()}
            className="text-dark-text-50 bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 mb-8 w-full font-semibold"
          >
            Confirm
          </Button>
        </div>
      )}
    </div>
  );
};

export default Deposit;
