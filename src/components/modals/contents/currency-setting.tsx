import { Button } from "@/components/ui/button";
import { useState } from "react";
import { handleError } from "@/lib/helper";
import { useGetRate } from "@/hooks/use-queries";
import { getCurrencyFlagPath } from "@/lib/utils";
import { useUpdatePreferredCurrency } from "@/hooks/use-mutations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/zustand/store";

const CurrencySetting = ({ closeModal }: { closeModal: () => void }) => {
  const user = useUser((state) => state.user);
  const queryClient = useQueryClient();
  const [activeOption, setActiveOption] = useState<{
    id: string;
    symbol: string;
    type: string;
  } | null>(
    currencies.find((c) => c.symbol === user?.preferredCurrency) || null,
  );
  const { mutateAsync: updatePreferredCurrency, isPending: isUpdatingUser } =
    useUpdatePreferredCurrency();
  const { isLoading: isLoadingRate } = useGetRate(activeOption?.symbol || "");

  const handleSubmit = async () => {
    if (!activeOption) return;
    try {
      await updatePreferredCurrency(activeOption.symbol);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["rate"] });
      toast.success("Currency preference updated successfully");
      closeModal();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <h4 className="mb-4 text-sm font-medium">Currency setting</h4>
      <p className="text-white mb-4 text-xs">
        Kindly select your preferred transaction currency. The selected currency
        will be used to display all deposit, withdrawal, and card transactions.
      </p>
      <SelectPreferredCurrency
        activeOption={activeOption}
        setActiveOption={setActiveOption}
      />
      <Button
        isLoading={isUpdatingUser || isLoadingRate}
        onClick={handleSubmit}
        disabled={!activeOption || isUpdatingUser || isLoadingRate}
        className="text-[#080808] bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 h-11 w-full rounded-md"
      >
        {isLoadingRate ? "Loading Rate..." : "Update setting"}
      </Button>
    </div>
  );
};

const currencies = [
  { id: "USD", symbol: "USD", type: "US Dollar" },
  { id: "GBP", symbol: "GBP", type: "British Pound" },
  { id: "EUR", symbol: "EUR", type: "Euro" },
];

export const SelectPreferredCurrency = ({
  activeOption,
  setActiveOption,
}: {
  activeOption: { id: string; symbol: string; type: string } | null;
  setActiveOption: (
    value: { id: string; symbol: string; type: string } | null,
  ) => void;
}) => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {currencies.map((currency) => (
        <div
          role="button"
          key={currency.id}
          onClick={() => setActiveOption(currency)}
          className={`rounded-md border py-4 hover:cursor-pointer ${
            activeOption?.id === currency.id
              ? "bg-dark-primary-main text-[#080808]"
              : "text-white bg-[#181818B2] border-[#8F9DB066]"
          }`}
        >
          <div className="flex flex-col items-center">
            <img
              src={getCurrencyFlagPath(currency.symbol)}
              alt={currency.symbol}
              className="size-8"
            />
            <p className="mt-4 text-center text-sm">
              {currency.symbol + " (" + currency.type + ")"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CurrencySetting;
