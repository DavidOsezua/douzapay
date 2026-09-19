import { useUser } from "@/zustand/store";
import { useGetRate } from "./use-queries";
import { formatAmountWithRate } from "@/lib/utils";

/**
 * Hook that formats amounts using the user's preferred currency conversion rate
 * Automatically fetches the rate based on user's preferredCurrency setting
 */
export const useFormatAmountWithCurrency = () => {
  const { user } = useUser();
  const preferredCurrency = user?.preferredCurrency || "USD";

  const isUSD = preferredCurrency === "USD";

  const { data: rateData } = useGetRate(preferredCurrency);

  return (
    amount: number | string | undefined,
    decimalPlaces: number = 2,
  ): string => {
    const rate = isUSD ? 1 : rateData?.rate || 1;
    return formatAmountWithRate(amount, rate, decimalPlaces);
  };
};
