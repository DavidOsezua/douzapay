import { useEffect, useState } from "react";

const RESEND_COOLDOWN_SECONDS = 60;

// For real buttons that sit alongside Resend, e.g. "Use authenticator app instead".
export const otpAltActionBtn =
  "flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#A7A7A7] bg-[#CECECE1A] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50";

// Same treatment, dark text for the auth pages' white/light form panel.
export const otpAltActionBtnOnLight =
  "flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#A7A7A7] bg-[#CECECE1A] text-sm font-semibold text-[#2F2F2F] disabled:cursor-not-allowed disabled:opacity-50";

// Plain-text "resend code" affordance for email-delivered OTPs, meant to sit
// just below the OTP input. Disabled behind a 60s cooldown after each send
// so users can't hammer the endpoint. `mode` picks legible colors for the
// surface it's rendered on: dark modal/sheet backgrounds vs. the auth pages'
// white form panel.
const ResendOtpButton = ({
  onResend,
  mode = "dark",
}: {
  onResend: () => Promise<unknown> | void;
  mode?: "dark" | "light";
}) => {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
    // Re-runs only when the countdown crosses the 0 boundary (starts or
    // stops), not on every tick — avoids both recreating the interval every
    // second and leaving it running forever once the cooldown ends.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft <= 0]);

  const handleClick = async () => {
    setIsResending(true);
    try {
      await onResend();
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch {
      // The mutation's own onError already toasts.
    } finally {
      setIsResending(false);
    }
  };

  const mutedClass = mode === "light" ? "text-[#2F2F2F]/60" : "text-white/50";
  const accentClass = mode === "light" ? "text-[#3B4A90]" : "text-[#E1E1E1]";

  return (
    <p className={`mx-auto mt-3 text-center text-xs ${mutedClass}`}>
      {isResending ? (
        "Sending…"
      ) : secondsLeft > 0 ? (
        `Didn't receive the code? Try again in ${secondsLeft}s`
      ) : (
        <>
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleClick}
            className={`font-semibold underline underline-offset-2 ${accentClass}`}
          >
            Resend OTP
          </button>
        </>
      )}
    </p>
  );
};

export default ResendOtpButton;
