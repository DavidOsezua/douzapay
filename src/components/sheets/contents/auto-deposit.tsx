import Copy from "@/components/copy";
import { Button } from "@/components/ui/button";
import { getCurrencyIconPath } from "@/lib/utils";
import { useUser } from "@/zustand/store";
import { useState } from "react";
import QrCode from "react-qr-code";
import { toast } from "sonner";

const AutoDeposit = ({
  wallet,
}: {
  wallet: DepositWallet;
  step: number;
  setStep: (step: number) => void;
  closeSheet: () => void;
}) => {
  const { user } = useUser();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet?.address as string);
    setIsCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleShare = async (address: string): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Deposit Address",
          text: `Send ${wallet?.token?.symbol} (${wallet?.token?.type}) to this address: ${address}`,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard");
    }
  };

  return (
    <div className="text-white mt-4 px-2">
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <img
            src={getCurrencyIconPath(wallet?.token?.symbol || "")}
            alt={wallet?.token?.symbol}
            className="size-8"
          />
          <span className="text-sm">
            {wallet?.token?.symbol} ({wallet?.token?.type})
          </span>
        </div>
        <p className="mt-4 text-lg">
          Deposit {wallet?.token?.symbol} ({wallet?.token?.type})
        </p>
        <p className="text-[#B9BCCC] text-xs uppercase">
          Deposit Fee ({user.depositFee}%)
        </p>
        <p className="text-[#B9BCCC] text-xs">
          Only send {wallet?.token?.symbol} on the {wallet?.token?.type} network
          to this address.
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <div className="mx-auto rounded-xl bg-white p-2 text-center lg:shrink-0">
            <div className="size-24">
              <QrCode className="size-full" value={wallet?.address as string} />
            </div>
            <span className="text-primary-50 text-[10px]">Scan this</span>
          </div>
          <div>
            <div className="mt-4">
              <div className="bg-transparent text-white border-[#8F9DB066] mt-2 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm backdrop-blur-lg">
                <span
                  className="max-w-sm shrink overflow-hidden leading-5.5 font-medium text-ellipsis whitespace-nowrap"
                  title={wallet?.address as string}
                >
                  {wallet?.address}
                </span>
                <Copy
                  icon="/icons/copy-light.svg"
                  text={wallet?.address as string}
                />
              </div>
            </div>
            <div className="mt-2.5 flex gap-2">
              <Button
                className="text-white w-1/2 rounded border border-[#CECECE2E] py-2.5"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
                }}
                onClick={() => handleShare(wallet?.address as string)}
              >
                Share
              </Button>
              <Button
                className="text-white w-1/2 rounded border border-[#CECECE2E] py-2.5"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
                }}
                onClick={() => handleCopy()}
              >
                {isCopied ? "Copied!" : "Copy Address"}
              </Button>
            </div>

            <p className="mx-2 mt-4 text-justify text-xs text-[#D4D4D4]">
              Only send{" "}
              <span className="text-white font-medium">
                {wallet?.token?.symbol}
              </span>{" "}
              on the{" "}
              <span className="text-white font-medium">
                {wallet?.token?.type}
              </span>{" "}
              network to this address. Your deposit will be credited to your
              wallet within minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoDeposit;
