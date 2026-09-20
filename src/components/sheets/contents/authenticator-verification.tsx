import QrCode from "react-qr-code";
import Copy from "@/components/copy";
import ShieldAsteriskIcon from "@/components/icons/shield-asterisk-icon";
import { useModalStore } from "@/zustand/modalStore";
import { useUser } from "@/zustand/store";

const APP_ISSUER = "Krypt Kard";

// Groups a base32 secret into space-separated 4-char chunks for display,
// e.g. "K7QD 4XM2 9PLB TR8V 9PLB K7QD".
const formatSecretForDisplay = (secret: string) =>
  secret
    .replace(/\s+/g, "")
    .toUpperCase()
    .match(/.{1,4}/g)
    ?.join(" ") ?? secret;

const buildOtpauthUrl = (secret: string, account: string) =>
  `otpauth://totp/${encodeURIComponent(APP_ISSUER)}:${encodeURIComponent(
    account,
  )}?secret=${secret}&issuer=${encodeURIComponent(APP_ISSUER)}`;

const primaryBtn =
  "flex-1 rounded-2xl bg-[#E1E1E1] py-3.5 text-sm font-semibold text-[#242424]";
const dangerBtn =
  "flex-1 rounded-2xl border border-[#FF6E7A] bg-transparent py-3.5 text-sm font-semibold text-[#FF6E7A]";

const AuthenticatorVerification = () => {
  const { openModal } = useModalStore();
  const { user } = useUser();
  const secret = user?.authenticatorSecret;

  return (
    <div className="text-white">
      <h2 className="text-lg font-semibold text-white">Authenticator App</h2>

      {secret ? (
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="text-[#242424] flex size-10 items-center justify-center rounded-full bg-[#E1E1E1]">
            <ShieldAsteriskIcon className="size-5" />
          </div>

          <div className="mx-auto mt-4 w-fit rounded-xl bg-white p-3">
            <div className="size-36">
              <QrCode
                className="size-full"
                value={buildOtpauthUrl(secret, user?.email ?? "")}
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-white/55">
            Scan this QR code with your authenticator app, or enter the code
            below manually.
          </p>

          <div className="mt-4 flex h-11 w-full items-center justify-between rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] px-4">
            <span className="font-mono text-sm tracking-widest text-white">
              {formatSecretForDisplay(secret)}
            </span>
            <Copy icon="/icons/copy-light.svg" text={secret} />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-center text-xs text-white/45">
          Couldn&apos;t load your authenticator details.
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() =>
            openModal("authenticatorSetup", { mode: "regenerate" })
          }
          className={primaryBtn}
        >
          Change Authenticator
        </button>
        <button
          type="button"
          onClick={() => openModal("disableAuthenticator")}
          className={dangerBtn}
        >
          Disable
        </button>
      </div>
    </div>
  );
};

export default AuthenticatorVerification;
