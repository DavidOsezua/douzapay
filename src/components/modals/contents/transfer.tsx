import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/zustand/sheetStore";
import { useState } from "react";

const Transfer = ({ closeModal }: { closeModal: () => void }) => {
  const [option, setOption] = useState<"card" | "wallet" | "internal">(
    "card",
  );
  const { openSheet } = useSheetStore();

  return (
    <div className="text-white mx-auto text-lg">
      <p className="text-lg font-semibold">Transfer</p>
      <p className="text-sm font-light">
        Please select where you would like to transfer from your available
        balance to
      </p>
      <div className="mt-4 space-y-2.5">
        <div
          onClick={() => {
            setOption("card");
          }}
          className={`flex h-12 cursor-pointer items-center justify-between gap-4 rounded-lg px-2.5 py-2 text-sm ${option == "card" ? "bg-[#181818B2] text-white border border-dark-primary-main" : "border-[#6EF7FF2E] border"}`}
        >
          <span>Transfer to card</span>
          <div
            className={`size-3 rounded-full border ${option === "card" ? "bg-dark-primary-main border-transparent" : "border-dark-primary-main"}`}
          />
        </div>
        <div
          onClick={() => {
            setOption("wallet");
          }}
          className={`flex h-12 cursor-pointer items-center justify-between gap-4 rounded-lg px-2.5 py-2 text-sm ${option == "wallet" ? "bg-[#181818B2] text-white border border-dark-primary-main" : "border-[#6EF7FF2E] border"}`}
        >
          <span>Transfer to wallet</span>
          <div
            className={`size-3 rounded-full border ${option === "wallet" ? "bg-dark-primary-main border-transparent" : "border-dark-primary-main"}`}
          />
        </div>
        <div
          onClick={() => {
            setOption("internal");
          }}
          className={`flex h-12 cursor-pointer items-center justify-between gap-4 rounded-lg px-2.5 py-2 text-sm ${option == "internal" ? "bg-[#181818B2] text-white border border-dark-primary-main" : "border-[#6EF7FF2E] border"}`}
        >
          <div className="flex flex-col gap-0.5">
            <span>Transfer to KrypKard users</span>
            <span className="text-xs font-light opacity-70">
              Send via email, instantly and free
            </span>
          </div>
          <div
            className={`size-3 shrink-0 rounded-full border ${option === "internal" ? "bg-dark-primary-main border-transparent" : "border-dark-primary-main"}`}
          />
        </div>
      </div>
      <div className="mt-6">
        <Button
          onClick={() => {
            if (option === "card") openSheet("transfer2Card");
            else if (option === "wallet") openSheet("transfer2Wallet");
            else {
              closeModal();
              openSheet("internalTransfer", 2, {}, false);
            }
          }}
          className="gradient-button mx-auto h-11 w-full !rounded-md"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Transfer;
