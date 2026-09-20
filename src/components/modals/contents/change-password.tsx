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
import { Eye, EyeOff } from "lucide-react";
import Throbber from "@/components/throbber";
import { handleError } from "@/lib/helper";
import { useChangePassword, useGetAuthorizedOTP } from "@/hooks/use-mutations";
import { useUser } from "@/zustand/store";
import ChangePasswordIcon from "@/components/icons/change-password-icon";

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
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otp, setOtp] = useState("");

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
    try {
      await getOtp({
        emailAddress: user?.email,
        purpose: "update",
      });
      setStep(2);
    } catch (error) {
      handleError(error);
    }
  };

  const handleConfirm = async () => {
    const { password, newPassword } = form.getValues();
    await changePassword({ password, newPassword, otp });
  };

  return (
    <div className="text-white">
      <div className="mx-auto flex flex-col items-center text-center">
        <div className="bg-[#E1E1E1] text-[#242424] flex size-16 items-center justify-center rounded-full">
          <ChangePasswordIcon className="h-[18px] w-[15px]" />
        </div>
        <p className="mt-4 text-2xl font-medium">Change Password</p>
        <p className="text-sm text-white/60">
          {step === 1
            ? "Enter your current and new password"
            : `Enter the OTP sent to ${user?.email}`}
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

          <Button
            isLoading={isChanging}
            disabled={otp.length < 6}
            onClick={handleConfirm}
            className="bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 h-11 w-full font-semibold text-[#242424] disabled:opacity-40"
          >
            {isChanging ? <Throbber /> : "Confirm"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
