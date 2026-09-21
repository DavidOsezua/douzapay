import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ClipboardPaste, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Throbber from "@/components/throbber";
import { useChangePassword, useGetAuthorizedOTP } from "@/hooks/use-mutations";
import { useUser } from "@/zustand/store";
import ChangePasswordIcon from "@/components/icons/change-password-icon";
import ShieldAsteriskIcon from "@/components/icons/shield-asterisk-icon";
import ResendOtpButton, {
  otpAltActionBtn,
} from "@/components/resend-otp-button";

const maskEmailForVerification = (email: string) => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 5) return `${local[0] ?? ""}****@${domain}`;
  return `${local.slice(0, 2)}****${local.slice(-3)}@${domain}`;
};

const schema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmNewPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

const ChangePassword = ({ closeModal }: { closeModal: () => void }) => {
  const { user } = useUser();
  const canUseAuthenticator = user?.twoFactorAuthMethod === "authenticator";
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpMethod, setOtpMethod] = useState<"email" | "authenticator">(
    canUseAuthenticator ? "authenticator" : "email",
  );
  const [isSwitchingMethod, setIsSwitchingMethod] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "", newPassword: "", confirmNewPassword: "" },
    mode: "onTouched",
  });

  const { mutateAsync: getOtp, isPending: isGettingOtp } =
    useGetAuthorizedOTP();
  const { mutateAsync: changePassword, isPending: isChanging } =
    useChangePassword({
      onSuccess: () => {
        closeModal();
      },
    });

  const handleRequestOtp = async (_data: {
    password: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    if (canUseAuthenticator) {
      // Authenticator codes aren't "sent" — skip the OTP request and let the
      // user enter a code they've already got from their app.
      setOtpMethod("authenticator");
      setStep(2);
      return;
    }
    try {
      await getOtp({
        emailAddress: user?.email,
        purpose: "update",
      });
      setOtpMethod("email");
      setStep(2);
    } catch {
      // The mutation's own onError already toasts.
    }
  };

  const handleConfirm = async () => {
    const { password, newPassword } = form.getValues();
    try {
      await changePassword({ password, newPassword, otp, otpMethod });
    } catch {
      // The mutation's own onError already toasts.
    }
  };

  const handleSwitchOtpMethod = async () => {
    setOtp("");
    if (otpMethod === "authenticator") {
      setIsSwitchingMethod(true);
      try {
        await getOtp({ emailAddress: user?.email, purpose: "update" });
        setOtpMethod("email");
      } catch {
        // The mutation's own onError already toasts.
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
    <div className="text-white">
      <div className="mx-auto flex flex-col items-center text-center">
        <div className="bg-[#E1E1E1] text-[#242424] flex size-16 items-center justify-center rounded-full">
          {step === 2 && otpMethod === "authenticator" ? (
            <ShieldAsteriskIcon className="size-6" />
          ) : (
            <ChangePasswordIcon className="h-[18px] w-[15px]" />
          )}
        </div>
        <p className="mt-4 text-2xl font-medium">
          {step === 2 && otpMethod === "authenticator"
            ? "2 Factor Authentication"
            : "Change Password"}
        </p>
        <p className="text-sm text-white/60">
          {step === 1 ? (
            "Enter your current and new password"
          ) : otpMethod === "authenticator" ? (
            "Enter the 6-digit code from your authenticator app to continue."
          ) : (
            <>
              Enter the code sent to{" "}
              <span className="font-medium">
                {maskEmailForVerification(user?.email ?? "")}
              </span>
            </>
          )}
        </p>
      </div>

      {step === 1 ? (
        <Form {...form}>
          <form
            className="mt-6"
            onSubmit={form.handleSubmit(handleRequestOtp)}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="text-xs font-normal text-white">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E] pr-10 text-white placeholder:text-white/50"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-white/40"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="text-xs font-normal text-white">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E] pr-10 text-white placeholder:text-white/50"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-white/40"
                      >
                        {showNewPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="text-xs font-normal text-white">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Re-enter new password"
                      className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E] text-white placeholder:text-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              isLoading={isGettingOtp}
              type="submit"
              className="bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 h-11 w-full font-semibold text-[#242424]"
            >
              {isGettingOtp ? <Throbber /> : "Continue"}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="mt-6">
          <div className="flex justify-center">
            <InputOTP
              autoFocus
              autoComplete="off"
              pattern={REGEXP_ONLY_DIGITS}
              maxLength={6}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup className="gap-3 *:!rounded *:border *:border-[#CECECE2E] *:shadow-none">
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
                getOtp({ emailAddress: user?.email, purpose: "update" })
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

          <Button
            isLoading={isChanging}
            disabled={otp.length < 6}
            onClick={handleConfirm}
            className="bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 h-11 w-full font-semibold text-[#242424] disabled:opacity-40"
          >
            {isChanging ? <Throbber /> : "Confirm"}
          </Button>

          {canUseAuthenticator && (
            <button
              type="button"
              onClick={handleSwitchOtpMethod}
              disabled={isSwitchingMethod}
              className={`mt-3 ${otpAltActionBtn}`}
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
      )}
    </div>
  );
};

export default ChangePassword;
