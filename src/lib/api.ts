import axios from "axios";
import { useUser } from "@/zustand/store";
import * as Sentry from "@sentry/react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_WHITELABEL_ID,
  },
});

const authorizedInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "x-api-key": import.meta.env.VITE_WHITELABEL_ID,
  },
});

authorizedInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = async (data: RegisterPayload) => {
  const response = await apiInstance.post("/auth/register", data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordPayload) => {
  const response = await apiInstance.post("/auth/reset-password", data);
  return response.data;
};

export const login = async (data: LoginPayload) => {
  const response = await apiInstance.post("/auth/login", data);
  return response.data;
};

export const adminLogin = async (data: LoginPayload) => {
  const response = await apiInstance.post("/auth/admin/login", data);
  return response.data;
};

export const getOtp = async (
  data: GetOtpPayload,
): Promise<GetOtpResponse> => {
  const response = await apiInstance.post("/auth/otp", data);
  return response.data;
};

export const getAuthorizedOtp = async (
  data: GetOtpPayload,
): Promise<GetOtpResponse> => {
  const response = await authorizedInstance.post("/auth/otp", data);
  return response.data;
};

export const verifyEmail = async (data: { email: string; refBy?: string }) =>
  apiInstance.get("/users/check", {
    params: {
      email: data.email,
      refBy: data.refBy,
    },
  });

export const verifyCredentials = async (data: {
  email: string;
  password: string;
}) => apiInstance.post("/auth/check-credentials", data);

export const getContactOtp = async (data: {
  platform: string;
  contact: string;
}) =>
  authorizedInstance.get("/users/contact/otp", {
    params: {
      platform: data.platform,
      contact: data.platform === "telegram" ? `${data.contact}` : data.contact,
    },
  });

export const getAuthSecret = async (data: any) => {
  const response = await apiInstance.post("/auth/auth-code", data);
  return response.data;
};

export const confirmPassword = async (data: { password: string }) => {
  const response = await authorizedInstance.post(
    "/auth/confirm-password",
    data,
  );
  return response.data;
};

export const getUser = async () => {
  const response = await authorizedInstance.get("/users");
  useUser.setState({ user: response.data });
  Sentry.setUser({
    id: response.data.id,
    username: `${response.data.firstName} ${response.data.lastName}`,
    email: response.data.email,
  });
  return response.data as UserProfile;
};

export const getRecentTransactions = async () => {
  const response = await authorizedInstance.get("/users/deposits", {
    params: {
      page: 1,
      limit: 10,
    },
  });
  return response.data.data;
};

export const getSupportedTokens = async () => {
  const response = await authorizedInstance.get("/users/supported-tokens");
  return response.data as Array<SupportedToken>;
};

export const getUserWallet = async (id: number) => {
  const response = await authorizedInstance.get("/users/wallet/" + id);
  return response.data as DepositWallet;
};

export const getRate = async (from: string, to: string = "USDT") => {
  const response = await authorizedInstance.get("/users/rate", {
    params: {
      from,
      to,
    },
  });
  return response.data;
};

export const getDeposits = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const response = await authorizedInstance.get("/users/deposits", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const getCardTransactions = async ({
  page,
  limit,
  type,
}: {
  page: number;
  limit: number;
  type?: string;
}) => {
  const response = await authorizedInstance.get("/cards/transactions", {
    params: {
      page,
      limit,
      type,
    },
  });
  return response.data;
};

export const deposit = async (data: DepositPayload) => {
  const response = await authorizedInstance.post("/users/deposit", data);
  return response.data;
};

export const updateUser = async (data: UpdateUserPayload) => {
  const response = await authorizedInstance.put("/users", data);
  return response.data;
};

export const updatePreferredCurrency = async (currency: string) => {
  const response = await authorizedInstance.put("/users/preferred-currency", {
    preferredCurrency: currency,
  });
  return response.data;
};

export const withdraw = async (data: WithdrawPayload) => {
  const response = await authorizedInstance.post("/users/transfer", data);
  return response.data;
};

export const submitTransactionHash = async (
  id: string | number,
  data: { transactionHash: string },
) => {
  const response = await authorizedInstance.post(`/users/deposit/${id}`, data);
  return response.data;
};

export const getDeposit = async (id: number) => {
  const response = await authorizedInstance.get(`/users/deposit/${id}`);
  return response.data;
};

export const buyCard = async (data: BuyCardPayload) => {
  const response = await authorizedInstance.post("/cards", data);
  return response.data;
};

export const getCards = async () => {
  const response = await authorizedInstance.get("/cards");
  return response.data;
};

export const getUserCards = async (id: string) => {
  const response = await authorizedInstance.get("/admin/cards/user/" + id);
  return response.data.data;
};

export const getPendingCards = async () => {
  const response = await authorizedInstance.get("/cards/pending");
  return response.data;
};

export const getPendingHolders = async () => {
  const response = await authorizedInstance.get("/cards/pending-holders");
  return response.data;
};

export const getCardholders = async (binId: string) => {
  const response = await authorizedInstance.get(
    `/users/card-holder?binId=${binId}`,
  );
  return response.data;
};

export const getCardDetails = async (id: string) => {
  const response = await authorizedInstance.get(`/cards/info/${id}`);
  return response.data.data;
};

export const getCardInfo = async (id: string) => {
  const response = await authorizedInstance.get(`/cards/${id}`);
  return response.data;
};

export const getCardInfoAdmin = async (id: string) => {
  const response = await authorizedInstance.get(`/admin/cards/info`, {
    params: {
      cardId: id,
    },
  });
  return response.data;
};

export const getBIN = async () => {
  const response = await authorizedInstance.get("/cards/bins", {
    params: { page: 0 },
  });
  return response.data;
};

export const freezeCard = async (id: string) => {
  const response = await authorizedInstance.post(`/cards/status/${id}`, {
    action: "suspend",
  });
  return response.data;
};

export const unfreezeCard = async (id: string) => {
  const response = await authorizedInstance.post(`/cards/status/${id}`, {
    action: "enable",
  });
  return response.data;
};

export const deleteCard = async (id: string) => {
  const response = await authorizedInstance.delete(`/cards/${id}`);
  return response.data;
};

export const transfer2Card = async (id: string, data: Transfer2CardPayload) => {
  const response = await authorizedInstance.post(`/cards/funding/${id}`, data);
  return response.data;
};

export const transfer2Wallet = async (id: string, data: any) => {
  const response = await authorizedInstance.post(`/cards/funding/${id}`, data);
  return response.data;
};

export const changePassword = async (data: ChangePasswordPayload) => {
  const response = await authorizedInstance.put("/users/password", data);
  return response.data;
};

export const updateEmail = async (data: UpdateEmailPayload) => {
  const response = await authorizedInstance.put("/users/email", data);
  return response.data;
};

export const verifyEmailChangeOtp = async (
  data: VerifyEmailChangeOtpPayload,
) => {
  const response = await authorizedInstance.post("/users/email/verify", data);
  return response.data;
};

export const setupAuthenticator = async (
  data: AuthenticatorSetupPayload = {},
): Promise<AuthenticatorSetupResponse> => {
  // Regenerating (update + otp) verifies an authenticator code — first-time
  // setup sends a blank body and has no otp to attach a method to.
  const payload = data.otp
    ? { ...data, otpMethod: "authenticator" as const }
    : data;
  const response = await authorizedInstance.post(
    "/users/2fa/authenticator/setup",
    payload,
  );
  return response.data;
};

export const verifyAuthenticator = async (data: AuthenticatorVerifyPayload) => {
  const response = await authorizedInstance.post(
    "/users/2fa/authenticator/verify",
    { ...data, otpMethod: "authenticator" },
  );
  return response.data;
};

export const updateTwoFactorMethod = async (
  data: UpdateTwoFactorMethodPayload,
) => {
  const response = await authorizedInstance.put("/users/2fa/method", data);
  return response.data;
};

export const disableAuthenticator = async (data: AuthenticatorVerifyPayload) => {
  const response = await authorizedInstance.delete(
    "/users/2fa/disabled2fa/authenticator",
    { data: { ...data, otpMethod: "authenticator" } },
  );
  return response.data;
};

// admin apis
export const getAdminStats = async () => {
  const response = await authorizedInstance.get("/admin/stats");
  return response.data;
};

export const getMerchantsStats = async () => {
  const response = await authorizedInstance.get(
    "/admin/whitelabel/settlements/stats",
  );
  return response.data as MerchantStats;
};

export const getOverview = async ({
  startDate,
  endDate,
  type,
}: {
  startDate?: string;
  endDate?: string;
  type?: string;
}): Promise<Array<{ date: string; totalAmount: number }>> => {
  const response = await authorizedInstance.get("/admin/transactions", {
    params: {
      startDate,
      endDate,
      type,
    },
  });
  return response.data;
};

export const getMerchant = async (id: string) => {
  const response = await authorizedInstance.get("/admin/whitelabel/" + id);
  return response.data as Merchant;
};

export const getUsers = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const response = await authorizedInstance.get("/admin/users", {
    params: {
      page,
      limit,
      search,
    },
  });
  return response.data;
};

export const getSettlements = async ({
  page,
  limit,
  search,
  whiteLabelId,
}: {
  page?: number;
  limit?: number;
  search?: string;
  whiteLabelId?: string;
}) => {
  const response = await authorizedInstance.get(
    "/admin/whitelabel/settlements",
    {
      params: {
        page,
        limit,
        search,
        whiteLabelId,
      },
    },
  );
  return response.data as {
    data: Settlement[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const getWallets = async ({
  page,
  limit,
  search,
  whiteLabelId,
}: {
  page?: number;
  limit?: number;
  search?: string;
  whiteLabelId?: string;
}) => {
  const response = await authorizedInstance.get("/admin/whitelabel/address", {
    params: {
      page,
      limit,
      search,
      whiteLabelId,
    },
  });
  return response.data as { data: Wallet[] };
};

export const settleClient = async (id: string, data: SettleClientPayload) => {
  const response = await authorizedInstance.put(
    "/admin/whitelabel/settle-earnings/" + id,
    data,
  );
  return response.data;
};

export const getAllCards = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const response = await authorizedInstance.get("/admin/cards", {
    params: {
      page,
      limit,
    },
  });
  return response.data.data;
};

export const getCardPurchases = async (
  id: string,
  filters: {
    page: number;
    limit: number;
    startDate?: string;
    endDate?: string;
  },
) => {
  const response = await authorizedInstance.get("/cards/transactions/" + id, {
    params: {
      ...filters,
    },
  });
  return response.data.data;
};

// Interlace ("int" / Sapphire) cards ship without an inline `balance`.
// Response shape: { success, data: { available, frozen, pending, currency } }.
export const getCardBalance = async (
  cardId: string,
): Promise<CardBalance | undefined> => {
  const response = await authorizedInstance.get(`/cards/balance/${cardId}`);
  const body = response.data;
  return (body?.data ?? body) as CardBalance | undefined;
};

export const assignCardAdmin = async (
  id: string,
  data: AssignCardAdminPayload,
) => {
  const response = await authorizedInstance.put(
    `/admin/cards/assign/${id}`,
    data,
  );
  return response.data;
};

export const flagCardAdmin = async (id: string) => {
  const response = await authorizedInstance.put(`/admin/cards/flag/${id}`);
  return response.data;
};

export const unflagCardAdmin = async (id: string) => {
  const response = await authorizedInstance.put(`/admin/cards/unflag/${id}`);
  return response.data;
};

export const createCardAdmin = async (data: CreateCardAdminPayload) => {
  const response = await authorizedInstance.post(`/admin/cards`, data);
  return response.data;
};

export const deleteCardAdmin = async (id: string) => {
  const response = await authorizedInstance.delete(`/admin/cards/${id}`);
  return response.data;
};

export const getAllDeposits = async ({
  page,
  limit,
  type,
  search,
}: {
  page: number;
  limit: number;
  type?: string;
  search?: string;
}) => {
  const response = await authorizedInstance.get("/admin/deposit", {
    params: {
      page,
      limit,
      type,
      search,
    },
  });
  return response.data;
};

export const getReferrals = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const response = await authorizedInstance.get("/admin/referrals", {
    params: {
      page,
      limit,
      search,
    },
  });
  return response.data;
};

export const getUserReferrals = async (id: string) => {
  const response = await authorizedInstance.get("/admin/referrals/" + id);
  return response.data as Referrals;
};

export const getCardTransactionsAdmin = async ({
  page,
  limit,
  type,
}: {
  page: number;
  limit: number;
  type?: string;
}) => {
  const response = await authorizedInstance.get("/admin/cards/transactions", {
    params: {
      page,
      limit,
      type,
    },
  });
  return response.data;
};

export const confirmDeposit = async (id: string | number) => {
  const response = await authorizedInstance.post("/admin/deposit/" + id, {
    approved: true,
  });
  return response.data;
};

export const confirmWithdraw = async (id: string | number) => {
  const response = await authorizedInstance.put("/admin/withdrawal/" + id, {
    approved: true,
  });
  return response.data;
};

export const rejectDeposit = async (id: string | number) => {
  const response = await authorizedInstance.post("/admin/deposit/" + id, {
    approved: false,
  });
  return response.data;
};

export const rejectWithdraw = async (id: string | number) => {
  const response = await authorizedInstance.put("/admin/withdrawal/" + id, {
    approved: false,
  });
  return response.data;
};

export const createUserAdmin = async (data: CreateUserAdminPayload) => {
  const response = await authorizedInstance.post("/admin/users", data);
  return response.data;
};

export const updateUserAdmin = async (
  id: string,
  data: UpdateUserAdminPayload,
) => {
  const response = await authorizedInstance.put(
    "/admin/users/update/" + id,
    data,
  );
  return response.data;
};

export const toggleUserStatus = async (id: string) => {
  const response = await authorizedInstance.put(`/admin/users/${id}`);
  return response.data;
};

export const deleteUserAdmin = async (id: string) => {
  const response = await authorizedInstance.delete(`/admin/users/${id}`);
  return response.data;
};

export const transferCommission = async (
  id: string,
  data: TransferCommissionPayload,
) => {
  const response = await authorizedInstance.put(
    "/admin/users/ref-commission/" + id,
    data,
  );
  return response.data;
};

export const addWalletAdmin = async (data: any) => {
  const response = await authorizedInstance.post(
    "/admin/whitelabel/address",
    data,
  );
  return response.data;
};

export const deleteWallet = async (data: DeleteWalletPayload) => {
  const response = await authorizedInstance.delete(
    "/admin/whitelabel/address",
    { data },
  );
  return response.data;
};

export const getAdminBins = async (whiteLabelId: string) => {
  const response = await authorizedInstance.get(
    `/admin/whitelabel/${whiteLabelId}/bins`,
  );
  return response.data;
};

export const getUserBins = async (userId: string) => {
  const response = await authorizedInstance.get(`/admin/users/${userId}/bins`);
  return response.data;
};

export const updateAdminBin = async (
  userId: string,
  data: {
    binId: number;
    price: number;
    topUpFee: number;
    defaultPrice?: number;
  },
) => {
  const response = await authorizedInstance.put(
    `/admin/users/${userId}/update-bin`,
    data,
  );
  return response.data;
};

export const uploadFile = async (
  file: File,
  binId?: string | number,
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  if (binId !== undefined && binId !== null && `${binId}` !== "") {
    formData.append("binId", `${binId}`);
  }
  const response = await authorizedInstance.post(
    "/users/upload-file",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data?.fileId ?? response.data?.id ?? response.data;
};

export const createCardholder = async (data: any) => {
  const response = await authorizedInstance.post("/users/card-holder", data);
  return response.data;
};

export const getCardholderCountries = async () => {
  const response = await authorizedInstance.get("/users/countries");
  return response.data;
};

export const getCardholderCities = async (countryCode: string) => {
  const response = await authorizedInstance.get(
    `/users/cities?regionCode=${countryCode}`,
  );
  return response.data;
};

export const getUserAssets = async (): Promise<UserAsset[]> => {
  const response = await authorizedInstance.get("/users/assets");
  return response.data;
};

export const getUserReferralStats = async () => {
  const response = await authorizedInstance.get("/users/referrals");
  return response.data as {
    referralCode: string;
    canRefer: boolean;
    totalReferrals: number;
    thisMonthReferrals: number;
    totalEarnings: number;
    thisMonthEarnings: number;
    available: number;
    totalWithdrawn: number;
    minWithdrawal: number;
    canWithdraw: boolean;
  };
};

export const getUserReferralList = async ({
  page = 0,
  limit = 10,
}: { page?: number; limit?: number } = {}) => {
  const response = await authorizedInstance.get("/users/referrals/list", {
    params: { page, limit },
  });
  return response.data as {
    referrals: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      createdAt: string;
      hasBoughtCard: boolean;
      earnedAmount: number;
    }[];
    total: number;
    page: number;
    limit: number;
  };
};

export const applyForReferral = async () => {
  const response = await authorizedInstance.post("/users/referrals/apply", {
    agreedToTerms: true,
  });
  return response.data;
};

export const lookupPayee = async (email: string) => {
  const response = await authorizedInstance.get("/users/lookup", {
    params: { email },
  });
  return response.data as {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export const requestInternalTransferOtp = async (data: {
  purpose: string;
  emailAddress: string;
  amount: number;
  toUserId: string;
  assetId: number;
}): Promise<GetOtpResponse> => {
  const response = await authorizedInstance.post("/auth/otp", data);
  return response.data;
};

export const internalTransfer = async (data: {
  amount: number;
  toUserId: string;
  assetId: number;
  otp?: string;
}) => {
  const response = await authorizedInstance.post(
    "/users/internal-transfer",
    data,
  );
  return response.data;
};

export const getInternalTransferHistory = async () => {
  const response = await authorizedInstance.get("/users/beneficiaries");
  return response.data as {
    data: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      lastTransferAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

