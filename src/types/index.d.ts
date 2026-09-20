type Token = "ERC20-USDT" | "TRC20-USDT" | "ERC20-USDC";

type User = {
  id: string;
  walletId: string | null;
  contact: string | null;
  platform: string | null;
  balance: number;
  requireOtpToLogin: boolean;
  email: string;
  firstName: string;
  lastName: string;
  totalCommisions: number;
  authenticatorSecret: string;
  refBy: string | null;
  referralFeePercent: number | null;
  isAdmin: boolean;
  active: boolean;
  hasBoughtCard: boolean;
  canRefer: boolean;
  hasPendingReferralRequest: boolean;
  pendingReferralRequest: {
    id: string;
    userId: string;
    status: string;
    agreedToTerms: boolean;
    reviewNote: string | null;
    reviewedAt: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  depositFee: number;
  withdrawalFee: number;
  cardCreationFee: number;
  whiteLabelId: string;
  totalCardsPurchased: number;
  totalWithdrawals?: number;
};

type Transaction = {
  id: number;
  type: "deposit" | "withdrawal" | "transfer" | "internal-transfer";
  userId: string;
  amount: string;
  amountReceived: string;
  transactionHash: string | null;
  completed: boolean;
  status: "pending" | "completed" | "failed";
  address: string | null;
  createdAt: string;
  updatedAt: string;
  currency: string | null;
  network: string | null;
  feePercent: string;
  feeAmount: string;
  toUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

type CardTransaction = {
  id: string;
  transactionId?: string;
  accountId: string;
  cardId: string;
  currency: string;
  amount: number;
  fee: number;
  feeCurrency?: string;
  feeDetails: [];
  // Card processors use different vocabularies — pass through the helpers in
  // lib/utils (CARD_TRANSACTION_LABELS / getCardTransactionDirection) rather
  // than switching on this directly.
  type:
    | "TransferIn"
    | "TransferOut"
    | "Fee_Consumption"
    | "Consumption"
    | "auth"
    | "Void"
    | "void"
    | "Topup"
    | "recharge"
    | "recharge_return"
    | "verification"
    | "refund"
    | "maintain_fee";
  clientTransactionId: string;
  cardTransactionId: string;
  relatedCardTransactionId: string | null;
  remark: string;
  detail: string;
  // Mixed casing / synonyms across the card APIs — normalise with
  // getTransactionStatusMeta before rendering.
  status:
    | "Closed"
    | "closed"
    | "Pending"
    | "pending"
    | "processing"
    | "Completed"
    | "completed"
    | "succeed"
    | "Failed"
    | "failed"
    | "fail"
    | "authorized"
    | "void";
  transactionTime: string;
  transactionCurrency: string;
  transactionAmount: number;
  merchantName: string;
  mcc: string;
  mccCategory: string;
  merchantCity: string;
  merchantCountry: string;
  merchantState: string;
  merchantZipcode: string;
  merchantMid: string;
  createTime: string;
};

type DepositOrder = {
  type: "deposit";
  completed: boolean;
  status: "pending" | "completed" | "failed";
  id: number;
  userId: string;
  amount: string;
  updatedAt: string;
  createdAt: string;
};

type Referrals = {
  data: Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    balance: number;
    refBy: string;
    totalCommisions: number;
    canRefer: boolean;
    hasBoughtCard: boolean;
    createdAt: string;
    whiteLabelId: string;
    earnedRefCommission: number;
  }>;
  total: number;
  referralCommissions: number;
  page: number;
  limit: number;
  totalPages: number;
};

type Card = {
  id: string;
  provider?: string;
  accountId: string;
  type: "PrepaidCard";
  bin: string;
  last4: string;
  // Absent on Interlace ("int") cards; casing from the API is "Visa", not "VISA".
  network?: "MasterCard" | "VISA" | "Visa";
  firstName: string;
  lastName: string;
  label?: string;
  ipr: boolean;
  status: "Active" | "Inactive" | "Frozen";
  createTime: string;
  cardholderId: null | string;
  // Interlace cards reference their balance record instead of inlining it.
  balanceId?: string;
  billingAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    country: string;
    postalCode: string;
    state: string;
  } | null;
  // Optional since Interlace v3 — cards without it are resolved via
  // GET /cards/balance/:cardId (see useCardBalance).
  balance?: CardBalance;
};

type CardBalance = {
  // string on inline `card.balance` (wsb/ptp), number from /cards/balance/:id (int).
  available: string | number;
  currency: string;
  pending?: string | number;
  frozen?: string | number;
};

// Card enriched with fields the admin endpoints join in (user email, the
// transaction that surfaced this card in a list, etc.) that aren't part of
// the base Card shape returned by the card-specific endpoints.
type AdminCard = Card & {
  userEmail?: string;
  transactionTime?: string;
};

type PendingCard = {
  id: number;
  userId: string;
  cardId: string | null;
  bin: string;
  completed: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  useType: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    balance: number;
  };
};

type CardInfo = {
  cvv: string;
  expYear: string;
  expMonth: string;
  cardNo: string;
};

type Settlement = {
  id: string;
  whiteLabelId: string;
  walletId: number;
  transactionHash: string;
  referralFee: number | null;
  type: "settlement";
  depositFee: number;
  withdrawalFee: number;
  cardCreationFee: number;
  createdAt: string;
  updatedAt: string;
  status: "Pending" | "Completed";
  whiteLabel: {
    id: string;
    name: string;
    domain: string;
  };
  wallet: {
    id: number;
    name: string;
    walletAddress: string;
    network: string;
    crypto: string;
  };
  settledReferrals: [
    {
      id: number;
      userId: string;
      amount: string;
      createdAt: string;
      type: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      };
    },
  ];
};

type UserProfile = {
  id: string;
  email: string;
  depositFee: number;
  withdrawalFee: number;
  referralFeePercent: number;
  cardCreationFee: number;
  whiteLabelId: string;
  twoFactorAuthMethod: string;
  contact: string | null;
  platform: string | null;
  balance: number;
  pendingBalance: number;
  requireOtpToLogin: boolean;
  firstName: string;
  lastName: string;
  totalCommisions: number;
  authenticatorSecret: string;
  refBy: string | null;
  isAdmin: boolean;
  active: boolean;
  hasBoughtCard: boolean;
  canRefer: boolean;
  hasPendingReferralRequest: boolean;
  pendingReferralRequest: {
    id: string;
    userId: string;
    status: string;
    agreedToTerms: boolean;
    reviewNote: string | null;
    reviewedAt: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  totalCardsPurchased: number;
  createdAt: string;
  updatedAt: string;
  preferredCurrency: string | null;
  autoDepositEnabled: boolean;
};

type Wallet = {
  id: number;
  whiteLabelId: string;
  name: string;
  crypto: string;
  network: string;
  walletAddress: string;
  status: "pending" | "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

type Referral = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  refBy: string;
  totalCommisions: number;
  canRefer: boolean;
  hasBoughtCard: boolean;
  earnedRefCommission: number;
  createdAt: string;
  whiteLabelId: string;
};

type AdminStats = {
  users: {
    totalUsers: number;
    usersWithCards: number;
    activeUsers: number;
    totalBalance: number;
  };
  deposits: Array<{
    pendingDeposits: number;
    totalWithdrawals: number;
  }>;
  frozenCards: number;
  totalCards: number;
  stats: {
    "card-creation": {
      completed: {
        count: number;
        totalAmount: number;
      };
    };
    "card-topup": {
      completed: {
        count: number;
        totalAmount: number;
      };
      pending: {
        count: number;
        totalAmount: number;
      };
    };
    "card-withdrawal": {
      completed: {
        count: number;
        totalAmount: number;
      };
      pending: {
        count: number;
        totalAmount: number;
      };
    };
    deposit: {
      completed: {
        count: number;
        totalAmount: number;
      };
      pending: {
        count: number;
        totalAmount: number;
      };
    };
    "referral-reward": {
      completed: {
        count: number;
        totalAmount: number;
      };
    };
    withdrawal: {
      completed: {
        count: number;
        totalAmount: number;
      };
      pending: {
        count: number;
        totalAmount: number;
      };
    };
  };
  adminBalance: {
    id: string;
    accountId: string;
    createTime: string;
    available: string;
    pending: string;
    frozen: string;
    currency: string;
    walletType: string;
  };
};

type MerchantStats = {
  deposit: {
    paid: number;
    pending: number;
    total: number;
  };
  withdrawal: {
    paid: number;
    pending: number;
    total: number;
  };
  cardCreation: {
    paid: number;
    pending: number;
    total: number;
  };
  referral: {
    paid: number;
    pending: number;
    total: number;
  };
};

type Merchant = {
  totalDepositFee: number;
  totalWithdrawalFee: number;
  totalCardCreationFee: number;
  totalReferralEarnings: number;
  id: string;
  payoutDay: string;
  name: string;
  walletAddress: string | null;
  domain: string;
  userDepositFeePercent: number;
  platformDepositFeePercent: number;
  platformDepositFeeTakePercent: number;
  userWithdrawalFeePercent: number;
  platformWithdrawalFeePercent: number;
  platformWithdrawalFeeTakePercent: number;
  cardCreationFee: number;
  platformCardCreationFee: number;
  userRefferalFeePercent: number;
  pendingDepositEarnings: number;
  pendingWithdrawalEarnings: number;
  pendingCardCreationEarnings: number;
  pendingReferralCommissions: number;
  paidDepositEarnings: number;
  paidWithdrawalEarnings: number;
  paidCardCreationEarnings: number;
  paidReferralEarnings: number;
  createdAt: string;
  updatedAt: string;
  admins: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    whiteLabelId: string;
  }[];
};

type UserAsset = {
  id: string;
  tokenId: number;
  balance: string | number;
  token: SupportedToken;
};

type SupportedToken = {
  id: number;
  symbol: string;
  name: string;
  type: string;
  contractAddress: string;
  decimals: number;
  networkId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  network: {
    id: number;
    name: string;
    symbol: string;
    symbolNative?: string;
    rpcUrl: string;
    explorerUrl: string;
    isActive: boolean;
    isEvmCompatible?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
};

type DepositWallet = {
  id: string;
  userId: string;
  tokenId: number;
  type: string;
  address: string;
  is_active: boolean;
  is_high_risk: boolean;
  createdAt: string;
  updatedAt: string;
  token: SupportedToken;
};

// ── Mutation payload types ────────────────────────────────────────────────

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  refBy: string;
  otp: string;
  authenticatorOtp?: string;
};

type LoginPayload = {
  email: string;
  password: string;
  otp: string;
};

type ResetPasswordPayload = {
  email: string;
  password: string;
  newPassword: string;
  otp: number;
};

type GetOtpPayload = {
  emailAddress: string | undefined;
  purpose: string;
  address?: string;
  amount?: number;
};

type DepositPayload = {
  amount: string | number;
  currency?: string;
  network?: string;
};

type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  contact?: string;
  otp?: string;
  password?: string;
};

type WithdrawPayload = {
  token?: string;
  to?: string;
  amount: string | number;
  chain?: string;
  assetId?: string | number | null;
  otp?: string;
};

type BuyCardPayload = {
  bin: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneCode?: string;
  phone?: string;
  useType?: string;
  nationality?: string;
  dateOfBirth?: string;
  cost?: number;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  assetId?: string | number | null;
};

type Transfer2CardPayload = {
  side: "fund" | "withdraw";
  amount: string | number;
  assetId?: string | number | null;
};

type ChangePasswordPayload = {
  password: string;
  newPassword: string;
  otp: string;
};

// ── Admin mutation payload types ───────────────────────────────────────────

type AssignCardAdminPayload = {
  email: string;
};

type CreateCardAdminPayload = {
  userId: string;
  cardData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneCode: string;
    phone: string;
    useType: string;
    cost: number;
  };
};

type CreateUserAdminPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  referralCode?: string;
};

type UpdateUserAdminPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  canRefer?: boolean;
  referralFeePercent?: number;
  depositFee?: number;
  withdrawalFee?: number;
};

type TransferCommisionPayload = {
  amount: string | number;
};

type DeleteWalletPayload = {
  addressId: string | number;
};

type SettleClientPayload = {
  walletId: number;
  transactionHash: string;
  withdrawalFee: number;
  depositFee: number;
  cardCreationFee: number;
};
