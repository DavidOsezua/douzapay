import { useState } from "react";
import { Check, ClipboardPaste } from "lucide-react";
import QrCode from "react-qr-code";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Copy from "@/components/copy";
import Throbber from "@/components/throbber";
import IconBadge from "@/components/icon-badge";
import ShieldAsteriskIcon from "@/components/icons/shield-asterisk-icon";
import GoogleAuthenticatorIcon from "@/components/icons/google-authenticator-icon";
import {
  useSetupAuthenticator,
  useVerifyAuthenticator,
} from "@/hooks/use-mutations";
import { toast } from "sonner";

const GOOGLE_AUTHENTICATOR_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2";
const GOOGLE_AUTHENTICATOR_APP_STORE_URL =
  "https://apps.apple.com/app/google-authenticator/id388497605";

const getMobilePlatform = (): "android" | "ios" | null => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/i.test(ua)) return "ios";
  return null;
};

const handleOpenAuthenticatorApp = () => {
  const platform = getMobilePlatform();
  if (platform === "android") {
    window.open(GOOGLE_AUTHENTICATOR_PLAY_STORE_URL, "_blank", "noopener,noreferrer");
  } else if (platform === "ios") {
    window.open(GOOGLE_AUTHENTICATOR_APP_STORE_URL, "_blank", "noopener,noreferrer");
  } else {
    toast.info("Download Google Authenticator on your Android or iOS device");
  }
};

const primaryBtn =
  "flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E1E1E1] py-3.5 text-sm font-semibold text-[#242424] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryBtn =
  "flex w-full items-center justify-center gap-2 rounded-2xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50";

// Groups a base32 secret into space-separated 4-char chunks for display,
// e.g. "K7QD 4XM2 9PLB TR8V 9PLB K7QD" — the raw (un-spaced) secret is what
// actually gets copied, since authenticator apps expect it unformatted.
const formatSecretForDisplay = (secret: string) =>
  secret
    .replace(/\s+/g, "")
    .toUpperCase()
    .match(/.{1,4}/g)
    ?.join(" ") ?? secret;

const OtpStep = ({
  heading,
  subtitle,
  otp,
  setOtp,
  onSubmit,
  submitLabel,
  isSubmitting,
  onBack,
}: {
  heading: string;
  subtitle: string;
  otp: string;
  setOtp: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  isSubmitting: boolean;
  onBack?: () => void;
}) => {
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
    <div className="text-center">
      <IconBadge>
        <ShieldAsteriskIcon className="size-6" />
      </IconBadge>
      <h2 className="mt-5 text-2xl font-medium text-white">{heading}</h2>
      <p className="mt-2 text-sm text-white/60">{subtitle}</p>

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

      <button
        type="button"
        onClick={handlePasteFromClipboard}
        className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] px-4 py-2 text-xs text-white"
      >
        <ClipboardPaste size={14} />
        Paste from clipboard
      </button>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          disabled={otp.length < 6 || isSubmitting}
          onClick={onSubmit}
          className={primaryBtn}
        >
          {isSubmitting ? <Throbber /> : submitLabel}
        </button>
        {onBack && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onBack}
            className={secondaryBtn}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

type Step = "intro" | "confirm" | "qr" | "verify" | "success";

const AuthenticatorSetup = ({
  mode = "setup",
  closeModal,
}: {
  mode?: "setup" | "regenerate";
  closeModal: () => void;
}) => {
  const [step, setStep] = useState<Step>(
    mode === "regenerate" ? "confirm" : "intro",
  );
  const [setupData, setSetupData] = useState<AuthenticatorSetupResponse | null>(
    null,
  );
  const [confirmOtp, setConfirmOtp] = useState("");
  const [otp, setOtp] = useState("");

  const { mutateAsync: setup, isPending: isSettingUp } =
    useSetupAuthenticator();
  const { mutateAsync: verify, isPending: isVerifying } =
    useVerifyAuthenticator({
      onSuccess: () => setStep("success"),
    });

  const onContinueFromIntro = async () => {
    try {
      const res = await setup({});
      setSetupData(res);
      setStep("qr");
    } catch {
      // error toast already shown by useSetupAuthenticator's onError
    }
  };

  const onConfirmCurrentCode = async () => {
    try {
      const res = await setup({ update: true, otp: confirmOtp });
      setSetupData(res);
      setStep("qr");
    } catch {
      // error toast already shown by useSetupAuthenticator's onError
    }
  };

  const onVerify = async () => {
    try {
      await verify({ otp });
    } catch {
      // error toast already shown by useVerifyAuthenticator's onError
    }
  };

  return (
    <div className="text-left">
      {step === "intro" && (
        <div className="text-center">
          <IconBadge>
            <ShieldAsteriskIcon className="size-6" />
          </IconBadge>
          <h2 className="mt-5 text-2xl font-medium text-white">
            Get an Authenticator App
          </h2>
          <p className="mt-2 text-sm text-white/60">
            To enable 2FA, Install Google Authenticator, Microsoft
            Authenticator or any ToTP-compatible app on your mobile device.
            This app will generate a 6-digit verification codes.
          </p>

          <button
            type="button"
            onClick={handleOpenAuthenticatorApp}
            className="mt-6 flex w-full items-center justify-between rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <GoogleAuthenticatorIcon className="h-7 w-8" />
              <span className="text-sm text-white">Google Authenticator</span>
            </div>
            <span className="text-xs text-white/55">iOS &middot; Android</span>
          </button>

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={closeModal} className={secondaryBtn}>
              Cancel
            </button>
            <button
              type="button"
              disabled={isSettingUp}
              onClick={onContinueFromIntro}
              className={primaryBtn}
            >
              {isSettingUp ? <Throbber /> : "Continue"}
            </button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <OtpStep
          heading="Confirm it's you"
          subtitle="Enter the 6-digit code from your current authenticator app to continue"
          otp={confirmOtp}
          setOtp={setConfirmOtp}
          onSubmit={onConfirmCurrentCode}
          submitLabel="Confirm"
          isSubmitting={isSettingUp}
        />
      )}

      {step === "qr" && setupData && (
        <div>
          <h2 className="text-lg font-semibold text-white">Scan QR code</h2>
          <p className="mt-1 text-xs text-white/55">
            Open your authenticator app and scan this code to link your Krypt
            Kard account.
          </p>

          <div className="mx-auto mt-6 w-fit rounded-xl bg-white p-3">
            <div className="size-40">
              <QrCode className="size-full" value={setupData.otpauthUrl} />
            </div>
          </div>

          <p className="mt-5 text-sm font-medium text-white">
            Can&apos;t scan QR code?
          </p>
          <p className="mt-1 text-xs text-white/55">
            Enter this setup key manually:
          </p>
          <div className="mt-2 flex h-11 items-center justify-between rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] px-4">
            <span className="font-mono text-sm tracking-widest text-white">
              {formatSecretForDisplay(setupData.secret)}
            </span>
            <Copy icon="/icons/copy-light.svg" text={setupData.secret} />
          </div>

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={closeModal} className={secondaryBtn}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setStep("verify")}
              className={primaryBtn}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "verify" && (
        <OtpStep
          heading="Enter 2FA code to verify"
          subtitle="Enter the six digit from your authenticator app here"
          otp={otp}
          setOtp={setOtp}
          onSubmit={onVerify}
          submitLabel="Verify and enable"
          isSubmitting={isVerifying}
          onBack={() => {
            setOtp("");
            setStep("qr");
          }}
        />
      )}

      {step === "success" && (
        <div className="my-4 flex w-full flex-col items-center gap-4">
          <div className="bg-[#E1E1E1] text-[#242424] flex size-16 items-center justify-center rounded-full">
            <Check />
          </div>
          <p className="mt-2 text-center text-2xl font-medium text-white">
            {mode === "regenerate"
              ? "Authenticator app updated successfully"
              : "2FA Authentication successfully added"}
          </p>
          <button
            type="button"
            onClick={closeModal}
            className={`${primaryBtn} mt-2`}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthenticatorSetup;
