import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { useDeposit } from "@/hooks/use-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { formatAmount } from "@/lib/utils";
import { useUser } from "@/zustand/store";
import { useSheetStore } from "@/zustand/sheetStore";
import { useGetRate } from "@/hooks/use-queries";

const SelectDeposit = ({ closeModal }: { closeModal: () => void }) => {
  const [activeOption, setActiveOption] = useState<Token | null>(null);
  const [amount, setAmount] = useState("");
  const user = useUser((state) => state.user);
  const { openSheet } = useSheetStore();
  const { mutateAsync: deposit, isPending: isDepositing } = useDeposit();
  const queryClient = useQueryClient();

  const preferredCurrency = user?.preferredCurrency || "USD";
  const { data: rateData } = useGetRate(preferredCurrency);
  const rate = rateData?.rate || 1;

  // Convert amount from preferred currency to USDT
  const usdtAmount = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;
    if (preferredCurrency.toUpperCase() === "USD") {
      return numAmount;
    }
    return numAmount * rate;
  }, [amount, rate, preferredCurrency]);

  const handleSubmit = async () => {
    try {
      const res = await deposit({
        amount: usdtAmount.toString(),
        currency: tokens.find((token) => token.title === activeOption)?.coin,
        network: tokens.find((token) => token.title === activeOption)?.network,
      });
      queryClient.invalidateQueries({
        queryKey: ["recentTransactions"],
      });
      closeModal();
      openSheet("deposit", 2, {
        amount: usdtAmount,
        token: activeOption || "",
        depositOrder: res,
      });
    } catch {
      // The mutation's own onError already toasts.
    }
  };

  return (
    <div>
      <h4 className="mb-4 text-sm font-medium">Select Payment Method</h4>
      <SelectPaymentMethod
        activeOption={activeOption}
        setActiveOption={setActiveOption}
      />

      {activeOption && (
        <div className="mt-4 px-3 py-3 text-center">
          <p className="text-xs font-semibold text-red-400">Disclaimer</p>
          <p className="text-dark-text-300 mt-1 text-xs">
            {activeOption.startsWith("TRC20")
              ? "TRC20 deposits may take up to 5 minutes to fund your Virtual Card after blockchain confirmation."
              : "ERC20 deposits may take up to 10 minutes to fund your Virtual Card after blockchain confirmation."}
          </p>
        </div>
      )}

      <h4 className="mt-6 text-sm font-medium">Amount ({preferredCurrency})</h4>
      <div className="relative">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Enter amount in ${preferredCurrency}`}
          className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E] text-white mt-2 h-11 lg:text-xs lg:placeholder:text-xs"
        />
        {amount && parseFloat(amount) > 0 && (
          <p className="mt-1 text-xs">≈ {formatAmount(usdtAmount)} USDT</p>
        )}
      </div>
      <Button
        isLoading={isDepositing}
        onClick={handleSubmit}
        disabled={!activeOption || Number(amount) <= 0 || isDepositing}
        className="text-primary-500 bg-primary-100 hover:bg-primary-100/90 mt-6 h-11 w-full rounded-md"
      >
        Continue
      </Button>
    </div>
  );
};

export type Token = "ERC20-USDC" | "TRC20-USDT" | "ERC20-USDT";

export const tokens: Array<TokenObj> = [
  {
    title: "ERC20-USDC",
    network: "ERC20",
    coin: "USDC",
    altTitle: "USDC (ERC20)",
    icon: "/images/usdc.svg",
    inactiveIcon: "/images/usdc-inactive.svg",
    address: "0xfa96639d581c3cbc0ddaa4f065edef4eb77f4967",
  },
  {
    title: "TRC20-USDT",
    network: "TRC20",
    coin: "USDT",
    altTitle: "USDT (TRC20)",
    icon: "/images/trcusdt.svg",
    inactiveIcon: "/images/trcusdt-inactive.svg",
    address: "TYpC6EdZeDVHQ64V6vabvcCcV7jghvibGK",
  },
  {
    title: "ERC20-USDT",
    network: "ERC20",
    coin: "USDT",
    altTitle: "USDT (ERC20)",
    icon: "/images/ercusdt.svg",
    inactiveIcon: "/images/ercusdt-inactive.svg",
    address: "0xfa96639d581c3cbc0ddaa4f065edef4eb77f4967",
  },
];

type TokenObj = {
  title: Token;
  network: string;
  coin: string;
  altTitle: string;
  icon: string;
  inactiveIcon: string;
  address: string;
};

export const SelectPaymentMethod = ({
  activeOption,
  setActiveOption,
}: {
  activeOption: Token | null;
  setActiveOption: (value: Token | null) => void;
}) => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {tokens.map((option) => (
        <div
          role="button"
          key={option.title}
          onClick={() => setActiveOption(option.title as Token)}
          className={`rounded-md py-4 hover:cursor-pointer ${
            activeOption === option.title
              ? "text-primary-500 bg-dark-input-100 border-dark-selected-2 border"
              : "bg-dark-primary-50 text-dark-text-300"
          }`}
        >
          <div
            className={`flex flex-col items-center opacity-50 ${
              activeOption === option.title ? "opacity-100" : "opacity-50"
            }`}
          >
            {activeOption === option.title ? (
              <img src={option.icon} alt={option.title} className="size-8" />
            ) : (
              <img
                src={option.inactiveIcon}
                alt={option.title}
                className="size-8"
              />
            )}
            <p className="mt-4 text-sm">{option.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectDeposit;
