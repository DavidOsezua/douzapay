import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  useInternalTransfer,
  useRequestInternalTransferOtp,
} from "@/hooks/use-mutations";
import { useModalStore } from "@/zustand/modalStore";
import { useSheetStore } from "@/zustand/sheetStore";
import { useUser } from "@/zustand/store";
import ResendOtpButton, {
  otpAltActionBtn,
} from "@/components/resend-otp-button";
import Throbber from "@/components/throbber";

const OtpInternalTransfer = ({
  toUserId,
  payeeName,
  payeeEmail,
  assetId,
  amount,
  tokenSymbol,
  closeModal,
}: {
  toUserId: string;
  payeeName: string;
  payeeEmail: string;
  assetId: number;
  amount: number;
  tokenSymbol: string;
  closeModal: () => void;
}) => {
  const [otp, setOtp] = useState("");
  const { openModal } = useModalStore();
  const { closeSheet } = useSheetStore();
  const user = useUser((s) => s.user);
  const isAuthenticatorMethod = user?.twoFactorAuthMethod === "authenticator";
  const [verificationMethod, setVerificationMethod] = useState<
    "email" | "authenticator"
  >(isAuthenticatorMethod ? "authenticator" : "email");
  const { mutateAsync: requestOtp } = useRequestInternalTransferOtp();
  const [isSwitchingMethod, setIsSwitchingMethod] = useState(false);

  const handleSwitchOtpMethod = async () => {
    setOtp("");
    if (verificationMethod === "authenticator") {
      setIsSwitchingMethod(true);
      try {
        await requestOtp({
          purpose: "internal-transfer",
          emailAddress: user?.email ?? "",
          amount,
          toUserId,
          assetId,
        });
        setVerificationMethod("email");
      } catch {
        // The mutation's own onError already toasts.
      } finally {
        setIsSwitchingMethod(false);
      }
    } else {
      setVerificationMethod("authenticator");
    }
  };

  const initials = payeeName
    .split(" ")
    .slice(0, 2)
    .map((n) => n?.[0] ?? "")
    .join("")
    .toUpperCase();

  const { mutate: sendTransfer, isPending } = useInternalTransfer({
    onSuccess: () => {
      closeModal();
      closeSheet();
      openModal("success", { type: "internal-transfer" });
    },
  });

  return (
    <div className="text-white">
      <h2 className="text-center text-base font-semibold">Enter OTP</h2>

      <div className="mt-4 flex items-center gap-3">
        <div
          className="text-white flex size-10 shrink-0 items-center justify-center rounded-full border border-[#CECECE] text-sm font-semibold"
          style={{
            background:
              "linear-gradient(129.49deg, rgba(42, 42, 42, 0.5) 3.6%, rgba(28, 28, 28, 0.5) 100%)",
          }}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium">{payeeName}</p>
          <p className="text-xs text-white/50">{payeeEmail}</p>
        </div>
      </div>

      <p className="mt-5 text-sm text-white/60">
        {verificationMethod === "authenticator"
          ? "Enter the 6-digit code from your authenticator app to complete the transfer of"
          : "Enter the OTP sent to your email to complete the transfer of"}{" "}
        <span className="font-semibold text-white">
          {amount} {tokenSymbol}
        </span>
        .
      </p>

      <div className="mt-5 flex justify-center">
        <InputOTP
          autoFocus
          value={otp}
          onChange={setOtp}
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
        >
          <InputOTPGroup className="gap-3 *:!rounded *:border *:border-[#6EF7FF2E] *:shadow-none">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {verificationMethod === "email" && (
        <ResendOtpButton
          onResend={() =>
            requestOtp({
              purpose: "internal-transfer",
              emailAddress: user?.email ?? "",
              amount,
              toUserId,
              assetId,
            })
          }
        />
      )}

      <Button
        onClick={() =>
          sendTransfer({
            amount,
            toUserId,
            assetId,
            otp,
            otpMethod: verificationMethod,
          })
        }
        isLoading={isPending}
        disabled={isPending || otp.length < 6}
        className="bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 mb-2 h-11 w-full font-semibold text-[#242424]"
      >
        Complete Transfer
      </Button>

      {isAuthenticatorMethod && (
        <button
          type="button"
          onClick={handleSwitchOtpMethod}
          disabled={isSwitchingMethod}
          className={`mt-3 ${otpAltActionBtn}`}
        >
          {isSwitchingMethod ? (
            <Throbber />
          ) : verificationMethod === "authenticator" ? (
            "Use email OTP instead"
          ) : (
            "Use authenticator app instead"
          )}
        </button>
      )}
    </div>
  );
};

export default OtpInternalTransfer;
