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
import { Link, NavLink, useSearchParams } from "react-router-dom";
import { useRegister, useGetOTP, useVerifyEmail } from "@/hooks/use-mutations";
import Throbber from "@/components/throbber";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import { useModalStore } from "@/zustand/modalStore";
import Modal from "@/components/modals";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .trim()
      .min(1, { message: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    refBy: z.string().min(1, "Referral code is required"),
    otp: z.string().min(6, "Authenticator code must be 6 digits"),
    authenticatorOtp: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

const Signup = () => {
  const [searchParams] = useSearchParams();
  const refBy = searchParams?.get("ref") || "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const { openModal } = useModalStore();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      otp: "",
      refBy: refBy ?? "",
    },
  });
  const { mutateAsync: getOtp, isPending: isGettingOtp } = useGetOTP();
  const { mutateAsync: register, isPending: isRegistering } = useRegister();
  const { mutateAsync: verify, isPending: isVerifying } = useVerifyEmail();

  const handleGetOtp = async (
    partialData: Pick<FormData, "email" | "refBy">,
  ) => {
    try {
      const isValid = await form.trigger([
        "email",
        "firstName",
        "lastName",
        "password",
        "confirmPassword",
        "refBy",
      ]);

      if (!isValid) return;
      const checkResponse = await verify({
        email: partialData.email,
        refBy: partialData.refBy,
      });
      if (checkResponse.data.emailExists) {
        form.setError("email", {
          type: "required",
          message: "Email already exists",
        });
        return;
      }
      if (
        "refByExists" in checkResponse.data &&
        !checkResponse.data.refByExists
      ) {
        form.setError("refBy", {
          type: "required",
          message: "Invalid referral code",
        });
        return;
      }
      await getOtp({
        emailAddress: partialData.email,
        purpose: "register",
      });
      setStep(2);
    } catch {
      // The mutation's own onError already toasts.
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await register(data);
      toast.success("Registration successful, please login");
      openModal("success", { type: "register" });
    } catch {
      // The mutation's own onError already toasts.
    }
  };

  return (
    <div className="text-dark-text-400">
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
              className="w-28"
              alt="for all you card needs"
            />
            <div className="bg-dark-background-light mt-4 inline-flex gap-2 rounded p-0.5">
              <NavLink
                to="/login?o=0"
                className={({ isActive }) =>
                  `inline-flex w-24 items-center justify-center rounded px-4 py-2.5 text-sm font-semibold ${isActive ? "bg-[#2F2F2F] text-white" : "text-dark-text-300 hover:bg-black/5"}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `inline-flex w-24 items-center justify-center rounded px-4 py-2.5 text-sm font-semibold ${isActive ? "bg-[#2F2F2F] text-white" : "text-dark-text-300 hover:bg-black/5"}`
                }
              >
                Sign Up
              </NavLink>
            </div>
            <Form {...form}>
              <div className="mt-6 flex w-full flex-col gap-4 lg:min-w-sm">
                {/* Step 1 */}
                {step === 1 && (
                  <>
                    <div>
                      <h1 className="text-2xl font-semibold">
                        Create an account
                      </h1>
                      <p>Sign up to get started with your account</p>
                    </div>
                    <div className="mt-2 flex gap-2.5 *:grow">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-xs">
                              First name
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="rounded placeholder:text-[10px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E]"
                                {...field}
                                placeholder="Enter first name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-xs">
                              Enter last name
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="rounded placeholder:text-[10px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E]"
                                {...field}
                                placeholder="Enter you email last name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel className="text-xs">
                            Enter your email
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded placeholder:text-[10px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E]"
                              {...field}
                              onChange={(e) => {
                                const cleaned = e.target.value
                                  .replace(/\s+/g, "")
                                  .toLowerCase();
                                field.onChange(cleaned);
                                form.clearErrors("email");
                              }}
                              placeholder="Enter you email address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                    <FormField
                      control={form.control}
                      name="refBy"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel className="text-xs">
                            Referral code
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={refBy !== ""}
                              className="rounded placeholder:text-[10px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E]"
                              placeholder="Enter your referral code"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                form.clearErrors("refBy");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      disabled={isVerifying || isGettingOtp}
                      className="bg-[#2F2F2F] text-white hover:bg-[#2F2F2F]/90 mt-6 h-11 w-full"
                      type="button"
                      onClick={() => handleGetOtp(form.getValues())}
                    >
                      {isGettingOtp || isVerifying ? <Throbber /> : "Continue"}
                    </Button>
                    <p className="mt-4 text-center text-xs font-medium text-[#2B2A30]">
                      Already have an account?{" "}
                      <Link
                        className="hover:text-primary-500/80 text-dark-link-4"
                        to="/login"
                      >
                        Sign In
                      </Link>
                    </p>
                  </>
                )}

                {/* Step 2 */}
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
                      <h1 className="m text-2xl font-semibold">
                        Let&apos;s verify your Email
                      </h1>
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
                        disabled={isRegistering}
                        className="bg-[#2F2F2F] text-white hover:bg-[#2F2F2F]/90 mt-4 w-full"
                        type="submit"
                      >
                        {isRegistering ? <Throbber /> : "Verify"}
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 3 */}
                {/* {step === 3 && (
                  <>
                    <Button
                      className="absolute -top-32 -left-2 size-8"
                      variant={"ghost"}
                      onClick={() => setStep(2)}
                    >
                      <ArrowLeft />
                    </Button>
                    <div>
                      <h2 className="mt-4 text-xl font-semibold text-primary-500">
                        Set 2FA Authentication
                      </h2>
                      <p className="text-[10px] text-primary-500">
                        Copy the code below to your authenticator app to
                        complete your registration.
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-center gap-4 rounded bg-white px-4 py-2 text-xs">
                      <span>{authSecret?.authCode}</span>
                      <Copy text={authSecret?.authCode} />
                    </div>
                    <p className="text-[10px] text-[#8C8C8C]">
                      Copy the token above and add it to you authenticator app,
                      you’ll be required to use your authenticator code to
                      complete your registration.
                    </p>
                    <Button
                      style={{
                        background:
                          "linear-gradient(11.41deg, #161B33 5.95%, #4B577A 102.98%)",
                      }}
                      className="mt-2 h-auto w-full rounded py-3"
                      onClick={() => setStep(4)}
                    >
                      Continue
                    </Button>
                  </>
                )} */}

                {/* Step 4 */}
                {/* {step === 4 && (
                  <>
                    <>
                      <Button
                        className="absolute -top-32 -left-2 size-8"
                        variant={"ghost"}
                        onClick={() => setStep(3)}
                      >
                        <ArrowLeft />
                      </Button>
                      <div>
                        <h1 className="m text-2xl font-semibold">
                          2 Factor Authentication
                        </h1>
                        <p className="text-sm leading-3.5 text-[#8C8C8C]">
                          Your security is our first priority. To complete your
                          registration and establish secure connection please
                          enter the 6 digit code from the authenticator app
                          below.
                        </p>
                      </div>

                      <div className="mt-2 flex w-full flex-col gap-2.5">
                        <FormField
                          control={form.control}
                          name="authenticatorOtp"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                              <FormLabel className="mb-1 text-xs font-normal">
                                Authenticator code
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
                          disabled={isRegistering}
                          className="bg-[#2F2F2F] text-white hover:bg-[#2F2F2F]/90 mt-4 w-full"
                          type="submit"
                        >
                          {isRegistering ? <Throbber /> : "Verify"}
                        </Button>
                      </div>
                    </>
                  </>
                )} */}
              </div>
            </Form>
          </form>
        </div>
      </div>
      <Modal />
    </div>
  );
};

export default Signup;
