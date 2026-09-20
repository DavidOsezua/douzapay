import {
  addWalletAdmin,
  adminLogin,
  applyForReferral,
  assignCardAdmin,
  buyCard,
  changePassword,
  updateEmail,
  verifyEmailChangeOtp,
  setupAuthenticator,
  verifyAuthenticator,
  updateTwoFactorMethod,
  disableAuthenticator,
  confirmDeposit,
  confirmPassword,
  confirmWithdraw,
  createCardAdmin,
  createCardholder,
  createUserAdmin,
  deleteCard,
  deleteCardAdmin,
  deleteUserAdmin,
  deleteWallet,
  deposit,
  flagCardAdmin,
  freezeCard,
  getAuthSecret,
  getAuthorizedOtp,
  getContactOtp,
  getOtp,
  internalTransfer,
  login,
  lookupPayee,
  register,
  requestInternalTransferOtp,
  rejectDeposit,
  rejectWithdraw,
  resetPassword,
  settleClient,
  submitTransactionHash,
  toggleUserStatus,
  transfer2Card,
  transfer2Wallet,
  transferCommision,
  unflagCardAdmin,
  unfreezeCard,
  updateAdminBin,
  updatePreferredCurrency,
  updateUser,
  updateUserAdmin,
  verifyCredentials,
  verifyEmail,
  withdraw,
} from "@/lib/api";
import { handleError } from "@/lib/helper";
import { useUser } from "@/zustand/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type OnSuccess = () => void;
type Cb = { onSuccess?: OnSuccess };
type CbR = { onSuccess: OnSuccess };
type Id = { id: string };

export const useGetOTP = () =>
  useMutation({
    mutationFn: (data: GetOtpPayload) => getOtp(data),
    onSuccess: () => {
      toast.success("An OTP has been sent to your email address");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useGetAuthorizedOTP = () =>
  useMutation({
    mutationFn: (data: GetOtpPayload) => getAuthorizedOtp(data),
    onSuccess: () => {
      toast.success("An OTP has been sent to your email address");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useVerifyCredentials = () =>
  useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      verifyCredentials(data),
    onSuccess: () => {},
  });

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: (data: { email: string; refBy?: string }) => verifyEmail(data),
    onSuccess: () => {},
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useGetContactOTP = () =>
  useMutation({
    mutationFn: (data: { platform: string; contact: string }) =>
      getContactOtp(data),
    onSuccess: () => {
      toast.success("An OTP has been sent to your contact");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useGetAuthSecret = () =>
  useMutation({
    mutationFn: (data: any) => getAuthSecret(data),
    onSuccess: () => {
      toast.success("Please follow the instructions above");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterPayload) => register(data),
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useResetPassword = ({ onSuccess }: Cb) =>
  useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
    onSuccess: () => {
      toast.success("Password reset successful");
      onSuccess?.();
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useLogin = ({ onSuccess }: { onSuccess: (data: any) => void }) =>
  useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: (data: any) => {
      onSuccess(data);
      useUser.setState({ user: data.userData });
      localStorage.setItem("token", data.accessToken);
      toast.success("Login successful");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useAdminLogin = ({
  onSuccess,
}: {
  onSuccess: (data: any) => void;
}) =>
  useMutation({
    mutationFn: (data: LoginPayload) => adminLogin(data),
    onSuccess: (data: any) => {
      onSuccess(data);
      useUser.setState({ user: data.userData });
      localStorage.setItem("token", data.accessToken);
      toast.success("Login successful");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useUpdateUser = () =>
  useMutation({
    mutationFn: (data: UpdateUserPayload) => updateUser(data),
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useUpdatePreferredCurrency = () =>
  useMutation({
    mutationFn: (currency: string) => updatePreferredCurrency(currency),
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useDeposit = () =>
  useMutation({
    mutationFn: (data: DepositPayload) => deposit(data),
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useWithdraw = ({ onSuccess }: CbR) =>
  useMutation({
    mutationFn: (data: WithdrawPayload) => withdraw(data),
    onSuccess: () => {
      onSuccess();
      toast.success("Withdrawal request sent, please wait for approval");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useSubmitTransactionHash = ({ id }: { id: string | number }) =>
  useMutation({
    mutationFn: (data: { transactionHash: string }) =>
      submitTransactionHash(id, data),
    onSuccess: () => {
      toast.success("Deposit pending, please wait");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useBuyCards = ({ onSuccess }: CbR) =>
  useMutation({
    mutationFn: (data: BuyCardPayload) => buyCard(data),
    onSuccess: () => {
      onSuccess();
      toast.success("Card purchase successful");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useCreateCardholder = ({ onSuccess }: CbR) =>
  useMutation({
    mutationFn: (data: any) => createCardholder(data),
    onSuccess: () => {
      onSuccess();
      toast.success("Cardholder created successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useFreezeCards = ({ id, onSuccess }: Id & CbR) =>
  useMutation({
    mutationFn: () => freezeCard(id),
    onSuccess: () => {
      onSuccess();
      toast.success("Card frozen successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useUnfreezeCards = ({ id, onSuccess }: Id & CbR) =>
  useMutation({
    mutationFn: () => unfreezeCard(id),
    onSuccess: () => {
      onSuccess();
      toast.success("Card unfreezed successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useDeleteCard = ({ id, onSuccess }: Id & CbR) =>
  useMutation({
    mutationFn: () => deleteCard(id),
    onSuccess: () => {
      onSuccess();
      toast.success("Card Deleted successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useTransfer2Card = ({
  id,
  onSuccess,
}: Id & {
  onSuccess: (data: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Transfer2CardPayload) => transfer2Card(id, data),
    onSuccess: (data: any) => {
      onSuccess(data);
      toast.success("Transfer successful");
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      queryClient.invalidateQueries({ queryKey: ["recentTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      handleError(error);
    },
  });
};

export const useTransfer2Wallet = ({ id, onSuccess }: Id & CbR) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => transfer2Wallet(id, data),
    onSuccess: () => {
      onSuccess();
      toast.success("Transfer successful");
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      queryClient.invalidateQueries({ queryKey: ["recentTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      handleError(error);
    },
  });
};

export const useChangePassword = ({ onSuccess }: CbR) =>
  useMutation({
    mutationFn: (data: ChangePasswordPayload) => changePassword(data),
    onSuccess: () => {
      onSuccess();
      toast.success("Password Changed Successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useUpdateEmail = ({ onSuccess }: Cb = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateEmailPayload) => updateEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      handleError(error);
    },
  });
};

export const useVerifyEmailChangeOtp = ({ onSuccess }: Cb = {}) =>
  useMutation({
    mutationFn: (data: VerifyEmailChangeOtpPayload) =>
      verifyEmailChangeOtp(data),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

// 2FA / Authenticator
export const useSetupAuthenticator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AuthenticatorSetupPayload = {}) =>
      setupAuthenticator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      handleError(error);
    },
  });
};

export const useVerifyAuthenticator = ({ onSuccess }: Cb = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AuthenticatorVerifyPayload) => verifyAuthenticator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      handleError(error);
    },
  });
};

// Not wired to any UI yet — plumbing for a future switch-method setting.
export const useUpdateTwoFactorMethod = ({ onSuccess }: Cb = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTwoFactorMethodPayload) =>
      updateTwoFactorMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess?.();
      toast.success("2FA method updated");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });
};

export const useDisableAuthenticator = ({ onSuccess }: Cb = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AuthenticatorVerifyPayload) => disableAuthenticator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess?.();
      toast.success("Authenticator app disabled");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });
};

export const useConfirmPassword = ({ onSuccess }: CbR) =>
  useMutation({
    mutationFn: (data: { password: string }) => confirmPassword(data),
    onSuccess: () => {
      onSuccess();
      toast.success("Account Confirmed");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

// Admin mutations

export const useAdminSettleClient = ({ id, onSuccess }: Id & Cb) =>
  useMutation({
    mutationFn: (data: SettleClientPayload) => settleClient(id, data),
    onSuccess: () => {
      onSuccess?.();
      toast.success("Settlement Successful");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useFlagCardAdmin = ({ id, onSuccess }: Id & CbR) =>
  useMutation({
    mutationFn: () => flagCardAdmin(id),
    onSuccess: () => {
      onSuccess();
      toast.success("Card Freeze successful");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useAssignCardAdmin = ({ id, onSuccess }: Id & CbR) =>
  useMutation({
    mutationFn: (data: AssignCardAdminPayload) => assignCardAdmin(id, data),
    onSuccess: () => {
      onSuccess();
      toast.success("Card Assigned successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useUnflagCardAdmin = ({ id, onSuccess }: Id & CbR) =>
  useMutation({
    mutationFn: () => unflagCardAdmin(id),
    onSuccess: () => {
      onSuccess();
      toast.success("Card unfreeze successful");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useCreateCardAdmin = ({ onSuccess }: CbR) =>
  useMutation({
    mutationFn: (data: CreateCardAdminPayload) => createCardAdmin(data),
    onSuccess: () => {
      onSuccess();
      toast.success("Card created successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useDeleteCardAdmin = ({ id, onSuccess }: Id & CbR) =>
  useMutation({
    mutationFn: () => deleteCardAdmin(id),
    onSuccess: () => {
      onSuccess();
      toast.success("Card delete successful");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useCreateUserAdmin = ({ onSuccess }: Cb) =>
  useMutation({
    mutationFn: (data: CreateUserAdminPayload) => createUserAdmin(data),
    onSuccess: () => {
      onSuccess?.();
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useUpdateUserAdmin = ({ id, onSuccess }: Id & Cb) =>
  useMutation({
    mutationFn: (data: UpdateUserAdminPayload) => updateUserAdmin(id, data),
    onSuccess: () => {
      onSuccess?.();
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useToggleUserStatus = ({ onSuccess }: Cb) =>
  useMutation({
    mutationFn: (id: string) => toggleUserStatus(id),
    onSuccess: () => {
      onSuccess?.();
      toast.success("User status changed successful");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useDeleteUserAdmin = ({ onSuccess }: CbR) =>
  useMutation({
    mutationFn: (id: string) => deleteUserAdmin(id),
    onSuccess: () => {
      onSuccess();
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useConfirmDeposit = ({ onSuccess }: Cb) =>
  useMutation({
    mutationFn: (data: { depositId: string | number }) =>
      confirmDeposit(data.depositId),
    onSuccess: () => {
      onSuccess?.();
      toast.success("Deposit Confirmed");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useConfirmWithdraw = ({ onSuccess }: Cb) =>
  useMutation({
    mutationFn: (data: { withdrawId: string | number }) =>
      confirmWithdraw(data.withdrawId),
    onSuccess: () => {
      onSuccess?.();
      toast.success("Withdrawal Confirmed");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useRejectDeposit = ({ onSuccess }: Cb) =>
  useMutation({
    mutationFn: (data: { depositId: string | number }) =>
      rejectDeposit(data.depositId),
    onSuccess: () => {
      onSuccess?.();
      toast.success("Deposit Rejected");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useRejectWithdraw = ({ onSuccess }: Cb) =>
  useMutation({
    mutationFn: (data: { withdrawId: string | number }) =>
      rejectWithdraw(data.withdrawId),
    onSuccess: () => {
      onSuccess?.();
      toast.success("Withdrawal Rejected");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useTransferCommision = ({ id, onSuccess }: Id & Cb) =>
  useMutation({
    mutationFn: (data: TransferCommisionPayload) => transferCommision(id, data),
    onSuccess: () => {
      onSuccess?.();
      toast.success("Commission transferred successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useAddWalletAdmin = ({ onSuccess }: Cb) =>
  useMutation({
    mutationFn: (data: any) => addWalletAdmin(data),
    onSuccess: () => {
      onSuccess?.();
      toast.success("Wallet added successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useDeleteWalletAdmin = ({ onSuccess }: Cb) =>
  useMutation({
    mutationFn: (data: DeleteWalletPayload) => deleteWallet(data),
    onSuccess: () => {
      onSuccess?.();
      toast.success("Wallet deleted successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useUpdateAdminBin = ({ onSuccess }: Cb) =>
  useMutation({
    mutationFn: ({ userId, data }: { userId: any; data: any }) =>
      updateAdminBin(userId, data),
    onSuccess: () => {
      onSuccess?.();
      toast.success("Card fee updated successfully");
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useApplyForReferral = ({ onSuccess }: Cb) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyForReferral,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      handleError(error);
    },
  });
};

export const useLookupPayee = () =>
  useMutation({
    mutationFn: (email: string) => lookupPayee(email),
    onError: (error: any) => {
      if (error?.response?.status === 404) return;
      handleError(error);
    },
  });

export const useRequestInternalTransferOtp = ({ onSuccess }: Cb = {}) =>
  useMutation({
    mutationFn: (data: {
      purpose: string;
      emailAddress: string;
      amount: number;
      toUserId: string;
      assetId: number;
    }) => requestInternalTransferOtp(data),
    onSuccess: () => {
      toast.success("An OTP has been sent to your email address");
      onSuccess?.();
    },
    onError: (error: any) => {
      handleError(error);
    },
  });

export const useInternalTransfer = ({ onSuccess }: Cb = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      amount: number;
      toUserId: string;
      assetId: number;
      otp: string;
    }) => internalTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internalTransferHistory"] });
      queryClient.invalidateQueries({ queryKey: ["userAssets"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["recentTransactions"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      handleError(error);
    },
  });
};
