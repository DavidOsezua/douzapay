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
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  useLogin,
  useGetOTP,
  useVerifyCredentials,
} from "@/hooks/use-mutations";
import Throbber from "@/components/throbber";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import LoginBg from "@/components/login-bg";
import { handleError } from "@/lib/helper";

const schema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  otp: z.string().min(6, "Authenticator code must be 6 digits"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const [searchParams] = useSearchParams();
  const param = searchParams.get("o");

  const [onboardingIsOpen, setOnboardingIsOpen] = useState(param !== "0");

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      otp: "",
    },
  });

  const { mutateAsync: getOtp, isPending: isGettingOtp } = useGetOTP();
  const { mutateAsync: verify, isPending: isVerifying } =
    useVerifyCredentials();

  const { mutate: login, isPending: isLoggingIn } = useLogin({
    onSuccess: () => {
      navigate("/dashboard");
    },
  });
  const onSubmit = (data: FormData) => {
    login(data);
  };
  return (
    <div className="text-primary-500 relative h-full w-full overflow-hidden">
      {onboardingIsOpen && (
        <div className="absolute inset-0 z-10 lg:hidden">
          <LoginBg />
          <div className="absolute right-6 bottom-10">
            <div className="absolute right-1/2 bottom-1/2 size-18 translate-x-1/2 translate-y-1/2 animate-ping rounded-full bg-[#3FD8E840]" />
            <Button
              onClick={() => setOnboardingIsOpen(false)}
              variant="default"
              className="text-primary-500 bg-dark-primary-50 hover:bg-dark-primary-50-hover relative z-10 size-14 rounded-full"
            >
              <ArrowRight size={25} />
            </Button>
          </div>
        </div>
      )}
      <div className="relative flex min-h-dvh">
        <div className="fixed inset-y-0 left-0 hidden h-screen lg:block">
          <img
            src="/images/auth-img.png"
            className="h-full w-auto"
            alt="Save money in fractional digital gold."
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

            <div className="bg-dark-background-light mt-4 inline-flex gap-2 rounded p-0.5">
              <NavLink
                to="/login"
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
              <div className="mt-2.5 flex w-full flex-col gap-2.5 lg:min-w-sm">
                {/* Step 1 */}
                {step === 1 && (
                  <>
                    <h1 className="mt-4 text-2xl font-semibold">
                      Welcome back!
                    </h1>
                    <p>Log in with your Email and password</p>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm">
                            Email address
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="rounded"
                              type={"email"}
                              {...field}
                              onChange={(e) => {
                                const cleaned = e.target.value
                                  .replace(/\s+/g, "")
                                  .toLowerCase();
                                form.clearErrors("email");
                                field.onChange(cleaned);
                              }}
                              placeholder="Email you email address"
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
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                className="rounded"
                                type={showPassword ? "text" : "password"}
                                {...field}
                                onChange={(e) => {
                                  form.clearErrors("password");
                                  field.onChange(e.target.value);
                                }}
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
                    <Link
                      className="hover:text-primary-500/80 -mt-1 text-end text-sm font-medium text-[#173A91]"
                      to="/reset-password"
                    >
                      Forgot Password?
                    </Link>

                    <Button
                      className="bg-[#2F2F2F] text-white hover:bg-[#2F2F2F]/90 mt-6 w-full"
                      type="button"
                      isLoading={isGettingOtp || isVerifying}
                      disabled={isGettingOtp || isVerifying}
                      onClick={async () => {
                        try {
                          const isValid = await form.trigger([
                            "email",
                            "password",
                          ]);
                          if (!isValid) return;
                          const verifyResponse = await verify({
                            email: form.getValues("email"),
                            password: form.getValues("password"),
                          });
                          if (!verifyResponse.data.valid) return;
                          await getOtp({
                            emailAddress: form.getValues("email"),
                            purpose: "login",
                          });

                          setStep(2);
                        } catch (error) {
                          if (
                            error.response.data.error === "Incorrect password"
                          ) {
                            form.setError("password", {
                              type: "required",
                              message: "Incorrect Password",
                            });
                          }
                          if (
                            error.response.data.error ===
                            "No account with the provided email found"
                          ) {
                            form.setError("email", {
                              type: "required",
                              message: "Email not found",
                            });
                          }
                          handleError(error);
                        }
                      }}
                    >
                      Continue
                    </Button>

                    <p className="mt-4 text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <Link
                        className="hover:text-primary-500/80 mx-auto text-[#00247E]"
                        to="/signup"
                      >
                        Sign up
                      </Link>
                    </p>
                  </>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <>
                    <Button
                      type="button"
                      className="absolute -top-32 -left-2 size-8"
                      variant={"ghost"}
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft />
                    </Button>
                    <h1 className="mt-6 text-2xl font-semibold">
                      Let’s verify your Email
                    </h1>
                    <p className="text-sm leading-3.5 text-[#8C8C8C]">
                      We’ve sent a 6-digit code to your email, enter the code
                      below to verify
                    </p>

                    <div className="mt-6 flex w-full flex-col gap-2.5">
                      <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Enter verification code</FormLabel>
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
                        disabled={isLoggingIn}
                        className="bg-[#2F2F2F] text-white hover:bg-[#2F2F2F]/90 mt-6 w-full"
                        type="submit"
                      >
                        {isLoggingIn ? <Throbber /> : "Login"}
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

export default Login;
