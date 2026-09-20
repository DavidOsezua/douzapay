import { useState } from "react";
import { ClipboardPaste } from "lucide-react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import Throbber from "@/components/throbber";
import IconBadge from "@/components/icon-badge";
import ShieldAsteriskIcon from "@/components/icons/shield-asterisk-icon";
import { useDisableAuthenticator } from "@/hooks/use-mutations";
import { useSheetStore } from "@/zustand/sheetStore";

const primaryBtn =
  "flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#E1E1E1] py-3.5 text-sm font-semibold text-[#242424] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryBtn =
  "flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50";

const DisableAuthenticator = ({ closeModal }: { closeModal: () => void }) => {
  const [step, setStep] = useState<"confirm" | "otp">("confirm");
  const [acknowledged, setAcknowledged] = useState(false);
  const [otp, setOtp] = useState("");
  const { closeSheet } = useSheetStore();

  const { mutate: disableAuthenticator, isPending: isDisabling } =
    useDisableAuthenticator({
      onSuccess: () => {
        closeModal();
        closeSheet();
      },
    });

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

  if (step === "confirm") {
    return (
      <div className="mx-auto flex flex-col items-center text-center">
        <IconBadge>
          <ShieldAsteriskIcon className="size-6" />
        </IconBadge>
        <p className="mt-4 text-2xl font-medium text-white">
          Are You Sure You Want to Disable Authenticator App Verification?
        </p>

        <label className="mt-6 flex items-start gap-2.5 text-left">
          <Checkbox
            checked={acknowledged}
            onCheckedChange={(checked) => setAcknowledged(checked === true)}
            className="mt-0.5"
          />
          <span className="text-xs text-white/60">
            Two security verification methods are required for withdrawals
            and other sensitive actions. Using only one method may put your
            account at greater risk.
          </span>
        </label>

        <div className="mt-6 flex w-full gap-3">
          <button type="button" onClick={closeModal} className={secondaryBtn}>
            NO
          </button>
          <button
            type="button"
            disabled={!acknowledged}
            onClick={() => setStep("otp")}
            className={primaryBtn}
          >
            YES
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col items-center text-center">
      <IconBadge>
        <ShieldAsteriskIcon className="size-6" />
      </IconBadge>
      <p className="mt-4 text-2xl font-medium text-white">
        Disable Authenticator App
      </p>
      <p className="text-sm text-white/70">
        Enter the 6-digit code from your authenticator app to confirm.
      </p>

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

      <div className="mt-6 flex w-full gap-3">
        <button
          type="button"
          disabled={isDisabling}
          onClick={() => setStep("confirm")}
          className={secondaryBtn}
        >
          Back
        </button>
        <button
          type="button"
          disabled={otp.length < 6 || isDisabling}
          onClick={() => disableAuthenticator({ otp })}
          className={primaryBtn}
        >
          {isDisabling ? <Throbber /> : "Disable"}
        </button>
      </div>
    </div>
  );
};

export default DisableAuthenticator;
