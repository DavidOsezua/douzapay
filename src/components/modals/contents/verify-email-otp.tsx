import { useEffect, useState } from "react";
import { ClipboardPaste } from "lucide-react";
import { toast } from "sonner";
import IconBadge from "@/components/icon-badge";
import MailIcon from "@/components/icons/mail-icon";
import ShieldAsteriskIcon from "@/components/icons/shield-asterisk-icon";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Throbber from "@/components/throbber";
import { useUser } from "@/zustand/store";
import { useModalStore } from "@/zustand/modalStore";
import { useVerifyEmailChangeOtp } from "@/hooks/use-mutations";
import { getAuthorizedOtp } from "@/lib/api";
import ResendOtpButton, {
  otpAltActionBtn,
} from "@/components/resend-otp-button";

const primaryBtn =
  "flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#E1E1E1] text-sm font-semibold text-[#242424] disabled:cursor-not-allowed disabled:opacity-50";

const maskEmailForVerification = (email: string) => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 5) return `${local[0] ?? ""}****@${domain}`;
  return `${local.slice(0, 2)}****${local.slice(-3)}@${domain}`;
};

const VerifyEmailOtp = ({ closeModal }: { closeModal: () => void }) => {
  const { user } = useUser();
  const { openModal } = useModalStore();
  const canUseAuthenticator = user?.twoFactorAuthMethod === "authenticator";

  const [otp, setOtp] = useState("");
  const [otpMethod, setOtpMethod] = useState<"email" | "authenticator">(
    canUseAuthenticator ? "authenticator" : "email",
  );
  const [isRequestingOtp, setIsRequestingOtp] = useState(!canUseAuthenticator);
  const [isSwitchingMethod, setIsSwitchingMethod] = useState(false);

  useEffect(() => {
    if (canUseAuthenticator) return;
    (async () => {
      try {
        await getAuthorizedOtp({
          emailAddress: user?.email,
          purpose: "verify-email",
        });
      } catch {
        toast.error("Couldn't send a verification code, please try again");
      } finally {
        setIsRequestingOtp(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutateAsync: verifyOtp, isPending: isVerifying } =
    useVerifyEmailChangeOtp({
      onSuccess: () => {
        closeModal();
        openModal("changeEmail");
      },
    });

  const onSubmit = async () => {
    try {
      await verifyOtp({ otp, otpMethod });
    } catch {
      // error toast already shown by useVerifyEmailChangeOtp's onError
    }
  };

  const handleSwitchOtpMethod = async () => {
    setOtp("");
    if (otpMethod === "authenticator") {
      setIsSwitchingMethod(true);
      try {
        await getAuthorizedOtp({
          emailAddress: user?.email,
          purpose: "verify-email",
        });
        setOtpMethod("email");
        toast.success("A code has been sent to your email address");
      } catch {
        toast.error("Couldn't send an email code, please try again");
      } finally {
        setIsSwitchingMethod(false);
      }
    } else {
      setOtpMethod("authenticator");
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const digits = text.replace(/\D/g, "").slice(0, 6);
      if (digits.length < 6) {
        toast.error("Clipboard doesn't contain a valid 6-digit code");
        return;
      }
      setOtp(digits);
    } catch {
      toast.error("Couldn't read from clipboard");
    }
  };

  return (
    <div className="mx-auto flex flex-col items-center text-center">
      <IconBadge>
        {otpMethod === "authenticator" ? (
          <ShieldAsteriskIcon className="size-6" />
        ) : (
          <MailIcon className="h-[18px] w-6" />
        )}
      </IconBadge>

      <h2 className="mt-5 text-2xl font-medium text-white">
        {otpMethod === "authenticator"
          ? "2 Factor Authentication"
          : "Email Verification"}
      </h2>
      <p className="mt-2 text-sm text-white/60">
        {otpMethod === "authenticator" ? (
          "Enter the 6-digit code from your authenticator app to continue."
        ) : (
          <>
            Enter the 6-digit code sent to{" "}
            <span className="font-medium">
              {maskEmailForVerification(user?.email ?? "")}
            </span>
          </>
        )}
      </p>

      {isRequestingOtp ? (
        <div className="mt-6 flex justify-center py-4">
          <Throbber />
        </div>
      ) : (
        <>
          <div className="mt-6 flex justify-center">
            <InputOTP
              value={otp}
              onChange={setOtp}
              autoFocus
              autoComplete="off"
              pattern={REGEXP_ONLY_DIGITS}
              maxLength={6}
            >
              <InputOTPGroup className="gap-2.5 *:size-12 *:!rounded-xl *:border *:border-[#CECECE2E] *:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] *:text-base *:text-white *:shadow-none">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {otpMethod === "email" && (
            <ResendOtpButton
              onResend={() =>
                getAuthorizedOtp({
                  emailAddress: user?.email,
                  purpose: "verify-email",
                })
              }
            />
          )}

          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] px-4 py-2 text-xs text-white"
          >
            <ClipboardPaste size={14} />
            Paste from clipboard
          </button>
        </>
      )}

      <div className="mt-6 flex w-full flex-col gap-3">
        <button
          type="button"
          disabled={otp.length < 6 || isVerifying || isRequestingOtp}
          onClick={onSubmit}
          className={primaryBtn}
        >
          {isVerifying ? <Throbber /> : "Continue"}
        </button>

        {canUseAuthenticator && (
          <button
            type="button"
            onClick={handleSwitchOtpMethod}
            disabled={isSwitchingMethod || isRequestingOtp}
            className={otpAltActionBtn}
          >
            {isSwitchingMethod ? (
              <Throbber />
            ) : otpMethod === "authenticator" ? (
              "Use email OTP instead"
            ) : (
              "Use authenticator app instead"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailOtp;
