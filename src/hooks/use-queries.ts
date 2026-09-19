import {
  getAdminBins,
  getAdminStats,
  getUserAssets,
  getUserBins,
  getAllCards,
  getAllDeposits,
  getBIN,
  getCardBalance,
  getCardDetails,
  getCardholderCities,
  getCardholderCountries,
  getCardholders,
  getCardInfo,
  getCardInfoAdmin,
  getCardPurchases,
  getCards,
  getCardTransactions,
  getCardTransactionsAdmin,
  getDeposit,
  getDeposits,
  getInternalTransferHistory,
  getMerchant,
  getMerchantsStats,
  getOverview,
  getPendingCards,
  getPendingHolders,
  getRate,
  getRecentTransactions,
  getReferrals,
  getSettlements,
  getSupportedTokens,
  getUser,
  getUserCards,
  getUserReferrals,
  getUserReferralStats,
  getUserReferralList,
  getUsers,
  getUserWallet,
  getWallets,
} from "@/lib/api";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

export const useGetUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

export const useGetMerchant = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["merchant"],
    queryFn: () => getMerchant(id),
  });

export const useGetRecentTransactions = () => {
  return useQuery({
    queryKey: ["recentTransactions"],
    queryFn: getRecentTransactions,
  });
};

export const useGetSupportedTokens = () => {
  return useQuery({
    queryKey: ["supportedTokens"],
    queryFn: () => getSupportedTokens(),
  });
};

export const useGetUserWallet = () => {
  return useMutation({
    mutationFn: (id: number) => getUserWallet(id),
  });
};

export const useGetDeposits = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: ["deposits", page, limit],
    queryFn: () => getDeposits({ page, limit }),
    placeholderData: keepPreviousData,
  });
};

export const useGetCardTransactions = (filters: {
  page: number;
  limit: number;
  type?: string;
}) => {
  return useQuery({
    queryKey: ["userCardTransactions", { ...filters }],
    queryFn: () => getCardTransactions(filters),
    refetchOnMount: false,
  });
};

export const useGetDepositOrder = ({
  id,
  enabled,
}: {
  id: number | null | undefined;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["depositOrder", id],
    queryFn: () => getDeposit(id!),
    refetchInterval: (query) =>
      query.state.data?.completed || query.state.data?.status === "failed"
        ? false
        : 1000,
    enabled: enabled && !!id,
  });
};

export const useGetCards = () => {
  return useQuery({
    queryKey: ["cards"],
    queryFn: getCards,
    refetchOnMount: false,
  });
};

export const useGetUserCards = (id: string) => {
  return useQuery({
    queryKey: ["userCards", id],
    queryFn: () => getUserCards(id),
  });
};

export const useGetCardInfoAdmin = (id: string) => {
  return useQuery({
    queryKey: ["allCards", id],
    queryFn: () => getCardInfoAdmin(id),
  });
};

export const useGetPendingCards = () => {
  return useQuery({
    queryKey: ["pendingCards"],
    queryFn: getPendingCards,
    refetchOnMount: false,
  });
};

export const useGetPendingHolders = () => {
  return useQuery({
    queryKey: ["pendingHolders"],
    queryFn: getPendingHolders,
    refetchOnMount: false,
  });
};

export const useGetCardDetails = ({
  id,
  enabled,
}: {
  id: string | null | undefined;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["cardDetails", id],
    queryFn: () => getCardDetails(id!),
    enabled: enabled && !!id,
  });
};

export const useGetCardInfo = ({
  id,
  enabled,
}: {
  id: string | null | undefined;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["cardInfo", id],
    queryFn: () => getCardInfo(id!),
    enabled: enabled && !!id,
  });
};

export const useGetBIN = () => {
  return useQuery({
    queryKey: ["bins"],
    queryFn: getBIN,
  });
};

// Admin Dashboard Queries

export const useGetAdminStats = () => {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
  });
};

export const useGetMerchantStats = () => {
  return useQuery({
    queryKey: ["merchantStats"],
    queryFn: getMerchantsStats,
  });
};

export const useGetOverview = ({
  startDate,
  endDate,
  type,
}: {
  startDate?: string;
  endDate?: string;
  type?: string;
}) => {
  return useQuery({
    queryKey: ["overview", startDate, endDate, type],
    queryFn: () => getOverview({ startDate, endDate, type }),
  });
};

export const useGetUsers = (filters: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["users", { ...filters }],
    queryFn: () => getUsers(filters),
  });
};

export const useGetSettlements = (filters: {
  page?: number;
  limit?: number;
  search?: string;
  whiteLabelId?: string;
}) => {
  return useQuery({
    queryKey: ["settlements", { ...filters }],
    queryFn: () => getSettlements(filters),
  });
};

export const useGetWallets = (filters: {
  page?: number;
  limit?: number;
  search?: string;
  whiteLabelId?: string;
}) => {
  return useQuery({
    queryKey: ["wallets", { ...filters }],
    queryFn: () => getWallets(filters),
  });
};

export const useGetAllCards = (filters: { page: number; limit: number }) => {
  return useQuery({
    queryKey: ["allCards", { ...filters }],
    queryFn: () => getAllCards(filters),
  });
};

export const useGetCardPurchases = ({
  id,
  filters,
}: {
  id: string | undefined;
  filters: {
    page: number;
    limit: number;
    startDate?: string;
    endDate?: string;
  };
}) => {
  return useQuery({
    queryKey: ["cardPurchases", id, { ...filters }],
    queryFn: () => getCardPurchases(id!, filters),
    enabled: !!id,
  });
};

export const useGetCardBalance = (id: string) => {
  return useQuery({
    queryKey: ["cardBalance", id],
    queryFn: () => getCardBalance(id),
  });
};

export const useGetAllDeposits = (filters: {
  page: number;
  limit: number;
  type?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["allDeposits", { ...filters }],
    queryFn: () => getAllDeposits(filters),
  });
};

export const useGetReferrals = (filters: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["referrals", { ...filters }],
    queryFn: () => getReferrals(filters),
    placeholderData: keepPreviousData,
  });
};
export const useGetUserReferrals = (id: string) => {
  return useQuery({
    queryKey: ["referral", id],
    queryFn: () => getUserReferrals(id),
    placeholderData: keepPreviousData,
  });
};

export const useGetCardTransactionsAdmin = (filters: {
  page: number;
  limit: number;
  type?: string;
}) => {
  return useQuery({
    queryKey: ["cardTransactions", { ...filters }],
    queryFn: () => getCardTransactionsAdmin(filters),
    // placeholderData: keepPreviousData,
  });
};

export const useGetRate = (from: string, to: string = "USDT") => {
  return useQuery({
    queryKey: ["rate", from, to],
    queryFn: () => getRate(from, to),
    enabled: !!from,
  });
};

export const useGetAdminBins = (whiteLabelId: string) => {
  return useQuery({
    queryKey: ["adminBins", whiteLabelId],
    queryFn: () => getAdminBins(whiteLabelId),
    enabled: !!whiteLabelId,
  });
};

export const useGetUserBins = (userId: string) => {
  return useQuery({
    queryKey: ["userBins", userId],
    queryFn: () => getUserBins(userId),
    enabled: !!userId,
  });
};

export const useGetCardholders = (binId: string) =>
  useQuery({
    queryKey: ["cardholders", binId],
    queryFn: () => getCardholders(binId),
    enabled: !!binId,
  });

export const useGetCardholderCountries = () =>
  useQuery({
    queryKey: ["cardholderCountries"],
    queryFn: getCardholderCountries,
  });

export const useGetCardholderCities = (countryCode: string) =>
  useQuery({
    queryKey: ["cardholderCities", countryCode],
    queryFn: () => getCardholderCities(countryCode),
    enabled: !!countryCode,
  });

export const useGetUserAssets = () =>
  useQuery({
    queryKey: ["userAssets"],
    queryFn: getUserAssets,
  });

export const useGetUserReferralStats = (enabled = true) =>
  useQuery({
    queryKey: ["userReferralStats"],
    queryFn: getUserReferralStats,
    enabled,
  });

export const useGetUserReferralList = (
  page: number,
  limit = 10,
  enabled = true,
) =>
  useQuery({
    queryKey: ["userReferralList", page, limit],
    queryFn: () => getUserReferralList({ page, limit }),
    placeholderData: keepPreviousData,
    enabled,
  });

export const useGetInternalTransferHistory = () =>
  useQuery({
    queryKey: ["internalTransferHistory"],
    queryFn: getInternalTransferHistory,
  });
