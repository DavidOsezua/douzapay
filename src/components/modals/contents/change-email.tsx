import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Throbber from "@/components/throbber";
import { useGetAuthorizedOTP, useUpdateEmail } from "@/hooks/use-mutations";

const inputClass =
  "h-11 rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white placeholder:text-white/50";

const primaryBtn =
  "flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E1E1E1] py-3.5 text-sm font-semibold text-[#242424] disabled:cursor-not-allowed disabled:opacity-50";

const RESEND_COOLDOWN_SECONDS = 60;

const changeEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Enter your new email address")
    .email("Enter a valid email address"),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

const ChangeEmail = ({ closeModal }: { closeModal: () => void }) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [codeSent, setCodeSent] = useState(false);
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const form = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: "", otp: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (cooldownEndsAt === null) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((cooldownEndsAt - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) setCooldownEndsAt(null);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [cooldownEndsAt]);

  const isCoolingDown = cooldownEndsAt !== null && secondsLeft > 0;

  const { mutateAsync: getOtp, isPending: isGettingOtp } =
    useGetAuthorizedOTP();
  const { mutateAsync: submitUpdateEmail, isPending: isUpdatingEmail } =
    useUpdateEmail({
      onSuccess: () => setStep("success"),
    });

  const onRequestCode = async () => {
    const valid = await form.trigger("email");
    if (!valid) return;
    try {
      await getOtp({
        emailAddress: form.getValues("email"),
        purpose: "change-email",
      });
      setCodeSent(true);
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setCooldownEndsAt(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
    } catch {
      // error toast already shown by useGetAuthorizedOTP's onError
    }
  };

  const onSubmit = form.handleSubmit(async ({ email, otp }) => {
    try {
      await submitUpdateEmail({ email, otp });
    } catch {
      // error toast already shown by useUpdateEmail's onError
    }
  });

  return (
    <div className="text-left">
      {step === "form" && (
        <>
          <h2 className="text-lg font-semibold text-white">Change Email</h2>
          <p className="mt-1 text-xs text-white/55">
            Update your email address. A verification code will be sent to
            your new email to confirm the change
          </p>

          <Form {...form}>
            <form className="mt-6" onSubmit={onSubmit}>
              <div className="space-y-4">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-normal text-white">
                        New Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          autoComplete="email"
                          placeholder="Enter your new email"
                          className={inputClass}
                          onChange={(e) => {
                            field.onChange(e);
                            if (codeSent) {
                              setCodeSent(false);
                              setCooldownEndsAt(null);
                              form.setValue("otp", "", {
                                shouldValidate: true,
                              });
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="otp"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-normal text-white">
                        Enter Verification Code
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            placeholder="Enter code"
                            className={`${inputClass} pr-20 ${isCoolingDown ? "border-[#E1E1E1]" : ""}`}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value.replace(/\D/g, "").slice(0, 6),
                              )
                            }
                          />
                          <div className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium">
                            {isCoolingDown ? (
                              <span className="text-white/50 tabular-nums">
                                {secondsLeft}s
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={onRequestCode}
                                disabled={isGettingOtp}
                                className="text-[#E1E1E1] disabled:opacity-50"
                              >
                                {isGettingOtp
                                  ? "Sending…"
                                  : codeSent
                                    ? "Resend"
                                    : "Get code"}
                              </button>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      {codeSent && (
                        <p className="text-xs text-white/55">Code sent</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={
                    !form.formState.isValid || !codeSent || isUpdatingEmail
                  }
                  className={primaryBtn}
                >
                  {isUpdatingEmail ? <Throbber /> : "Continue"}
                </button>
              </div>
            </form>
          </Form>
        </>
      )}

      {step === "success" && (
        <div className="my-4 flex w-full flex-col items-center gap-4">
          <div className="bg-[#E1E1E1] text-[#242424] flex size-16 items-center justify-center rounded-full">
            <Check />
          </div>
          <p className="mt-2 text-center text-2xl font-medium text-white">
            Email successfully updated
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

export default ChangeEmail;
