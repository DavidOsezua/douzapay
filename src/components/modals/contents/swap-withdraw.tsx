import { useState } from "react";
import { ArrowLeft, ArrowUpRight, ClipboardPaste, Info } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import ResendOtpButton, {
  otpAltActionBtn,
} from "@/components/resend-otp-button";
import Throbber from "@/components/throbber";
import { useUser } from "@/zustand/store";
import { useGetAuthorizedOTP, useWithdrawSwap } from "@/hooks/use-mutations";
import { handlePaste } from "@/lib/utils";
import SwapTokenIcon from "@/pages/dashboard/_misc/swap/swap-token-icon";
import {
  formatTokenAmount,
  isValidWalletAddress,
} from "@/pages/dashboard/_misc/swap/swap-helpers";

const fieldClass = "rounded-2xl border border-white/10 bg-white/5";

const SwapWithdraw = ({
  swap,
  closeModal,
}: {
  swap: Swap;
  closeModal: () => void;
}) => {
  const { user } = useUser((s) => s);
  const [step, setStep] = useState<1 | 2>(1);
  const [address, setAddress] = useState("");
  const [touched, setTouched] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpType, setOtpType] = useState<"email" | "authenticator">("email");
  const [isSwitchingMethod, setIsSwitchingMethod] = useState(false);
  const canUseAuthenticator = !!user?.authenticatorAddedAt;

  const { mutateAsync: requestOtp, isPending: isRequestingOtp } =
    useGetAuthorizedOTP();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawSwap({
    onSuccess: closeModal,
  });

  const trimmed = address.trim();
  const isValid = isValidWalletAddress(swap.chain, trimmed);
  const showError = touched && trimmed.length > 0 && !isValid;

  const otpPayload = {
    emailAddress: user?.email,
    purpose: "withdrawal",
    address: trimmed,
    amount: swap.withdrawableAmount,
  };

  const handleConfirm = async () => {
    if (user?.twoFactorAuthMethod === "authenticator") {
      // Authenticator codes aren't "sent" — go straight to entry.
      setOtpType("authenticator");
      setStep(2);
      return;
    }
    try {
      await requestOtp(otpPayload);
      setOtpType("email");
      setStep(2);
    } catch {
      // error toast already shown by useGetAuthorizedOTP's onError
    }
  };

  const handleSwitchOtpMethod = async () => {
    setOtp("");
    if (otpType === "authenticator") {
      setIsSwitchingMethod(true);
      try {
        await requestOtp(otpPayload);
        setOtpType("email");
      } catch {
        // error toast already shown
      } finally {
        setIsSwitchingMethod(false);
      }
    } else {
      setOtpType("authenticator");
    }
  };

  const submit = () =>
    withdraw({
      swapId: swap.id,
      toAddress: trimmed,
      otp,
      ...(otpType === "authenticator" ? { otpMethod: "authenticator" } : {}),
    });

  if (step === 2)
    return (
      <div className="pb-1">
        <button
          type="button"
          onClick={() => {
            setOtp("");
            setStep(1);
          }}
          className="flex items-center gap-1 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <h3 className="short:mt-3 short:text-xl mt-4 text-2xl font-semibold">
          {otpType === "authenticator"
            ? "2 Factor Authentication"
            : "Verify your Email"}
        </h3>
        <p className="short:text-xs short:leading-4 mt-1 text-sm leading-5 font-light text-white/70">
          {otpType === "authenticator"
            ? "Enter the 6-digit code from your authenticator app to withdraw"
            : "Enter the 6-digit code we sent to your email to withdraw"}{" "}
          <span className="font-semibold text-white">
            {formatTokenAmount(swap.withdrawableAmount)} {swap.fromSymbol}
          </span>
          .
        </p>

        <div className="short:mt-4 mt-5 flex justify-center">
          <InputOTP
            autoFocus
            value={otp}
            onChange={setOtp}
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup className="*:text-white mt-2 gap-3 *:!rounded *:border *:border-white *:shadow-none">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {otpType === "email" && (
          <ResendOtpButton onResend={() => requestOtp(otpPayload)} />
        )}

        <Button
          onClick={submit}
          isLoading={isWithdrawing}
          disabled={isWithdrawing || otp.length < 6}
          className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 short:mt-4 short:h-10 mt-6 h-11 w-full font-semibold"
        >
          Confirm Withdrawal
        </Button>

        {(otpType === "authenticator" || canUseAuthenticator) && (
          <button
            type="button"
            onClick={handleSwitchOtpMethod}
            disabled={isSwitchingMethod}
            className={`mt-3 mb-2 ${otpAltActionBtn}`}
          >
            {isSwitchingMethod ? (
              <Throbber />
            ) : otpType === "authenticator" ? (
              "Use email OTP instead"
            ) : (
              "Use authenticator app instead"
            )}
          </button>
        )}
      </div>
    );

  return (
    <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto pb-1">
      <h3 className="short:text-xl text-2xl font-semibold">
        Withdraw {swap.fromSymbol} to your Wallet
      </h3>
      <p className="short:text-xs short:leading-4 mt-1 text-sm leading-5 font-light text-white/70">
        Cancel this swap and send your {swap.fromSymbol} back to your external
        wallet address.
      </p>

      <div
        className={`${fieldClass} short:mt-3 short:p-3 mt-4 flex items-center gap-3 p-4`}
      >
        <SwapTokenIcon
          symbol={swap.fromSymbol}
          src={swap.fromIcon}
          className="short:size-10 size-14"
        />
        <div>
          <p className="text-xs text-white/60">You will receive</p>
          <p className="short:text-lg text-xl font-semibold">
            {formatTokenAmount(swap.withdrawableAmount)} {swap.fromSymbol}
          </p>
          <p className="text-xs text-white/60">{swap.fromName}</p>
        </div>
      </div>

      <label
        htmlFor="swap-withdraw-address"
        className="short:mt-3 short:text-xs mt-4 block text-sm"
      >
        Wallet Address
      </label>
      <div
        className={`${fieldClass} mt-2 flex items-center gap-2 pr-3 ${showError ? "border-[#FF6E7A]" : ""}`}
      >
        <Input
          id="swap-withdraw-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={`Enter ${swap.fromSymbol} wallet address`}
          autoComplete="off"
          spellCheck={false}
          className="short:h-11 h-14 border-0 bg-transparent px-4 text-white shadow-none placeholder:text-white/40 focus-visible:ring-0 lg:text-xs lg:placeholder:text-xs"
        />
        <button
          type="button"
          onClick={() => {
            handlePaste((v) => setAddress(v.trim()));
            setTouched(true);
          }}
          className="short:py-1.5 flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
        >
          <ClipboardPaste className="size-4" /> Paste
        </button>
      </div>
      {showError && (
        <p className="mt-1 text-xs text-[#FF6E7A]">
          Enter a valid {swap.fromSymbol} ({swap.chain}) wallet address
        </p>
      )}

      <p className="short:mt-3 short:text-xs mt-4 text-sm">Network</p>
      <div
        className={`${fieldClass} short:p-2 mt-2 flex items-center gap-3 p-3`}
      >
        <SwapTokenIcon
          symbol={swap.fromSymbol}
          src={swap.fromIcon}
          className="short:size-7 size-9"
        />
        <span className="short:text-xs text-sm font-semibold">
          {swap.networkLabel}
        </span>
      </div>

      <div className="short:mt-3 short:p-2 mt-4 flex gap-2 rounded-2xl border border-[#FFB84D]/25 bg-[#FFB84D]/10 p-3">
        <Info className="short:size-3.5 mt-0.5 size-4 shrink-0 text-[#FFB84D]" />
        <p className="short:text-[11px] short:leading-[14px] text-xs leading-4 text-[#FFB84D]">
          This will cancel the swap and send your {swap.fromSymbol} back to
          your wallet. Make sure the wallet address and network are correct.
          This transaction can not be reversed.
        </p>
      </div>

      <Button
        onClick={handleConfirm}
        isLoading={isRequestingOtp}
        disabled={!isValid || isRequestingOtp}
        className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 short:mt-4 short:h-10 mt-5 h-12 w-full gap-2 rounded-xl font-semibold"
      >
        <ArrowUpRight className="size-4" /> Confirm Withdrawal
      </Button>
    </div>
  );
};

export default SwapWithdraw;
