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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  useGetOTP,
  useResetPassword,
  useVerifyEmail,
} from "@/hooks/use-mutations";
import { useState } from "react";
import Throbber from "@/components/throbber";
import { handleError } from "@/lib/helper";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const schema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(8),
    otp: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
      email: "",
    },
    mode: "onTouched",
  });
  const { mutateAsync: getOtp, isPending: isGettingOtp } = useGetOTP();
  const { mutateAsync: verify, isPending: isVerifying } = useVerifyEmail();
  const { mutateAsync: resetPassword, isPending: isResetting } =
    useResetPassword({
      onSuccess: () => {
        navigate("/login");
      },
    });

  const handleGetOtp = async (data: { email: string }) => {
    const { email: emailAddress } = data;
    try {
      await getOtp({ emailAddress, purpose: "forget-password" });
      setStep(3);
    } catch (error) {
      handleError(error);
    }
  };

  const onSubmit = (data: {
    email: string;
    password: string;
    confirmPassword: string;
    otp?: string;
  }) => {
    const { confirmPassword, ...rest } = data;
    resetPassword({
      ...rest,
      newPassword: data.password,
      otp: parseInt(data.otp || "0"),
    });
  };

  return (
    <div className="text-primary-500 relative h-full w-full overflow-hidden">
      <div className="relative flex min-h-dvh">
        <div className="fixed inset-y-0 left-0 hidden h-screen lg:block">
          <img
            src="/images/auth-img.png"
            className="h-full w-auto"
            alt="Save money in fractional digital gold."
          />
          <img
            src="/images/auth-icons.svg"
            className="absolute bottom-10 left-8 z-10 w-40"
            alt=""
          />
        </div>
        <div
          className="fixed inset-y-0 left-0 hidden h-screen lg:block"
          style={{
            background: "linear-gradient(180deg, #0B1828 0%, #05070E 100%)",
          }}
        >
          <img
            src="/images/auth-image2.svg"
            className="h-full w-auto"
            alt="Save money in fractional digital gold."
          />
        </div>
        <div className="invisible hidden h-screen lg:block">
          <img
            src="/images/auth-img.png"
            className="h-full w-auto"
            alt="Save money in fractional digital gold."
          />
        </div>
        <div className="relative flex grow flex-col items-center justify-center bg-[#FBFFFF] py-10">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative flex w-[320px] flex-col items-start md:w-[400px] lg:w-full lg:max-w-sm"
          >
            <img
              src="/images/full-logo-dark.svg"
              className="w-20"
              alt="for all you card needs"
            />

            <Form {...form}>
              <div className="mt-6 flex w-full flex-col gap-2.5 lg:min-w-sm">
                {step === 1 && (
                  <>
                    <Button
                      className="absolute -top-32 -left-2 size-8"
                      variant={"ghost"}
                      type="button"
                      onClick={() => navigate("/login")}
                    >
                      <ArrowLeft />
                    </Button>
                    <div>
                      <h1 className="text-2xl font-semibold">
                        Forgot Password
                      </h1>
                      <p>Enter email below to reset password.</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="mt-4 flex flex-col gap-1">
                          <FormLabel className="text-xs">
                            Email address
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded placeholder:text-[10px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E]"
                              {...field}
                              type="email"
                              onChange={(e) => {
                                field.onChange(e);
                                form.clearErrors("email");
                              }}
                              onBlur={(e) => {
                                const cleaned = e.target.value
                                  .replace(/\s+/g, "")
                                  .toLowerCase();
                                form.setValue("email", cleaned, {
                                  shouldValidate: true,
                                });
                                field.onBlur();
                              }}
                              placeholder="Enter you email address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      onClick={async () => {
                        const isValid = await form.trigger(["email"]);
                        if (!isValid) return;
                        const verifyResponse = await verify({
                          email: form.getValues("email") ?? "",
                        });
                        if (!verifyResponse.data.emailExists) {
                          form.setError("email", {
                            type: "required",
                            message: "Email does not exist",
                          });
                          return;
                        }
                        setStep(2);
                      }}
                      className="bg-[#2F2F2F] text-white hover:bg-[#2F2F2F]/90 mt-6 h-11 w-full"
                      type="button"
                    >
                      {isVerifying ? <Throbber /> : "Reset"}
                    </Button>
                  </>
                )}
                {step === 2 && (
                  <>
                    <Button
                      className="absolute -top-32 -left-2 size-8"
                      variant={"ghost"}
                      type="button"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft />
                    </Button>
                    <div>
                      <h1 className="text-2xl font-semibold">
                        Set new password
                      </h1>
                      <p>KIndly enter your new password</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel className="text-xs">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                className="rounded placeholder:text-[10px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E]"
                                type={showPassword ? "text" : "password"}
                                {...field}
                                placeholder="Enter your password"
                              />
                              <Button
                                type="button"
                                variant={"ghost"}
                                className="text-primary-500/50 absolute right-0"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <Eye /> : <EyeOff />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel className="text-xs">
                            Confirm password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                className="rounded placeholder:text-[10px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E]"
                                type={showConfirmPassword ? "text" : "password"}
                                {...field}
                                placeholder="Confirm you password"
                              />
                              <Button
                                type="button"
                                variant={"ghost"}
                                className="text-primary-500/50 absolute right-0"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? <Eye /> : <EyeOff />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      disabled={isGettingOtp}
                      className="bg-[#2F2F2F] text-white hover:bg-[#2F2F2F]/90 mt-6 h-11 w-full"
                      type="button"
                      onClick={() => handleGetOtp(form.getValues())}
                    >
                      {isGettingOtp ? <Throbber /> : "Continue"}
                    </Button>
                  </>
                )}

                {/* Step 2 */}
                {step === 3 && (
                  <>
                    <Button
                      className="absolute -top-32 -left-2 size-8"
                      variant={"ghost"}
                      type="button"
                      onClick={() => setStep(2)}
                    >
                      <ArrowLeft />
                    </Button>
                    <div>
                      <h1 className="m text-2xl font-semibold">Verification</h1>
                      <p className="text-sm leading-3.5 text-[#8C8C8C]">
                        We’ve sent a 6-digit code to your email, enter the code
                        below to verify
                      </p>
                    </div>

                    <div className="mt-2 flex w-full flex-col gap-2.5">
                      <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel className="mb-1 text-xs font-normal">
                              Enter verification code
                            </FormLabel>
                            <FormControl>
                              <InputOTP
                                autoFocus
                                autoComplete="off"
                                pattern={REGEXP_ONLY_DIGITS}
                                maxLength={6}
                                {...field}
                              >
                                <InputOTPGroup className="gap-3 *:!rounded *:border *:border-[#97A1AF] *:shadow-none">
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        disabled={isResetting}
                        className="bg-[#2F2F2F] text-white hover:bg-[#2F2F2F]/90 mt-4 w-full"
                        type="submit"
                      >
                        {isResetting ? <Throbber /> : "Reset"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Form>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
