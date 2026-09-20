import { useSheetStore } from "@/zustand/sheetStore";
import { useModalStore } from "@/zustand/modalStore";
import { useUser } from "@/zustand/store";
import { ChevronRight } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import TopBar from "@/components/topbar";
import ShieldAsteriskIcon from "@/components/icons/shield-asterisk-icon";
import MailIcon from "@/components/icons/mail-icon";
import ChangePasswordIcon from "@/components/icons/change-password-icon";
import PasskeysIcon from "@/components/icons/passkeys-icon";
import AntiPhishingIcon from "@/components/icons/anti-phishing-icon";
import EmergencyContactIcon from "@/components/icons/emergency-contact-icon";
import WithdrawalProtectionIcon from "@/components/icons/withdrawal-protection-icon";
import DevicesIcon from "@/components/icons/devices-icon";
import AutoLogoutIcon from "@/components/icons/auto-logout-icon";
import AccountSettingsIcon from "@/components/icons/account-settings-icon";

const SecuritySection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="mt-6">
    <p className="mb-2 text-[14px] font-semibold tracking-wide text-white uppercase">
      {title}
    </p>
    <div className="rounded-lg border border-[#CECECE2E] px-6">
      {children}
    </div>
  </div>
);

const SecurityRow = ({
  iconElement,
  label,
  status,
  onClick,
}: {
  iconElement: ReactNode;
  label: string;
  status?: { text: string; className: string };
  onClick?: () => void;
}) => {
  const clickable = !!onClick;
  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={onClick}
      className={`flex w-full items-center justify-between py-4 text-left text-[14px] text-white ${
        clickable ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-[#E1E1E1] flex size-7 items-center justify-center">
          {iconElement}
        </div>
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {status && (
          <span className={`text-xs ${status.className}`}>{status.text}</span>
        )}
        <ChevronRight
          size={20}
          className={clickable ? "text-white" : "text-white/30"}
        />
      </div>
    </button>
  );
};

const comingSoon = {
  text: "Coming soon",
  className: "text-white/50 rounded-full px-2 py-1 bg-white/5",
};

const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local.slice(0, 2)}***@${domain}`;
};

const Security = () => {
  const { openSheet } = useSheetStore();
  const { openModal } = useModalStore();
  const { user } = useUser();
  const isAuthenticatorEnabled = user?.twoFactorAuthMethod === "authenticator";

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-dvh bg-[#242424] text-white">
      <TopBar
        title="Security"
        backTo="/dashboard/account"
        className="!bg-[#242424]"
      />

      <div className="p-4">
        <h3 className="font-bold">Two-Factor Authentication (2FA)</h3>
        <p className="mt-1 text-xs text-white/55">
          To protect your account, it is recommended to enable at least two
          form of 2FA
        </p>

        <SecuritySection title="Login & Authentication">
          <SecurityRow
            iconElement={<ChangePasswordIcon className="h-[18px] w-[15px]" />}
            label="Change Password"
            onClick={() => openModal("changePassword")}
          />
          <SecurityRow
            iconElement={<MailIcon className="h-[13px] w-[18px]" />}
            label="Email Address"
            status={
              user?.email
                ? { text: maskEmail(user.email), className: "text-white/60" }
                : undefined
            }
            onClick={() => openModal("verifyEmailOtp")}
          />
          <SecurityRow
            iconElement={<ShieldAsteriskIcon className="size-[18px]" />}
            label="Authenticator App"
            status={
              isAuthenticatorEnabled
                ? { text: "Enabled", className: "text-dark-success-200" }
                : { text: "Setup", className: "text-white/40" }
            }
            onClick={() =>
              isAuthenticatorEnabled
                ? openSheet("twoFactor")
                : openModal("authenticatorSetup")
            }
          />
          <SecurityRow
            iconElement={<PasskeysIcon className="size-[18px]" />}
            label="Passkeys"
            status={comingSoon}
          />
        </SecuritySection>

        <SecuritySection title="Advanced Security">
          <SecurityRow
            iconElement={<AntiPhishingIcon className="h-[15px] w-[18px]" />}
            label="Anti-phishing Code"
            status={comingSoon}
          />
          <SecurityRow
            iconElement={<EmergencyContactIcon className="h-[18px] w-[15px]" />}
            label="Emergency Contact"
            status={comingSoon}
          />
          <SecurityRow
            iconElement={
              <WithdrawalProtectionIcon className="h-[17px] w-[18px]" />
            }
            label="Withdrawal Protection"
            status={comingSoon}
          />
        </SecuritySection>

        <SecuritySection title="Devices & Sessions">
          <SecurityRow
            iconElement={<DevicesIcon className="h-[15px] w-[18px]" />}
            label="Devices"
            status={comingSoon}
          />
          <SecurityRow
            iconElement={<AutoLogoutIcon className="size-[18px]" />}
            label="Auto Logout"
            status={comingSoon}
          />
        </SecuritySection>

        <SecuritySection title="Account Setting">
          <SecurityRow
            iconElement={<AccountSettingsIcon className="size-[18px]" />}
            label="Account Setting"
            status={comingSoon}
          />
        </SecuritySection>
      </div>
    </div>
  );
};

export default Security;
