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
import { useUser } from "@/zustand/store";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useGetAuthorizedOTP, useUpdateUser } from "@/hooks/use-mutations";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useQueryClient } from "@tanstack/react-query";

const EditProfile = ({
  step,
  setStep,
  closeSheet,
}: {
  step: number;
  setStep: (step: number) => void;
  closeSheet: () => void;
}) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const form = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      contact: user.contact,
      otp: "",
    },
  });
  const { mutateAsync: getOtp, isPending: isGettingOtp } =
    useGetAuthorizedOTP();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateUser();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await updateProfile(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      closeSheet();
    } catch {
      // ignore
    }
  };
  return (
    <div className="text-white">
      <h1>Edit Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              <div className="mt-4 space-y-4">
                <div className="flex flex-col gap-2.5 *:grow lg:flex-row">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-11 rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white placeholder:text-white/50"
                            {...field}
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
                      <FormItem>
                        <FormLabel className="text-sm font-normal">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-11 rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white placeholder:text-white/50"
                            {...field}
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
                    <FormItem>
                      <FormLabel className="text-sm font-normal">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white placeholder:text-white/50"
                          {...field}
                          onChange={(e) => {
                            const cleaned = e.target.value
                              .replace(/\s+/g, "")
                              .toLowerCase();
                            field.onChange(cleaned);
                          }}
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
                    <FormItem>
                      <FormLabel className="text-sm font-normal">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="h-11 rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white placeholder:text-white/50 pr-4"
                            placeholder="••••••••"
                            {...field}
                          />
                          <Button
                            variant={"ghost"}
                            type="button"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2 rounded text-white/50 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Eye size={16} strokeWidth={1.5} />
                            ) : (
                              <EyeOff size={16} strokeWidth={1.5} />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                disabled={!form.formState.isDirty}
                type="button"
                onClick={async () => {
                  await getOtp({
                    emailAddress: form.getValues("email"),
                    purpose: "update",
                  });
                  setStep(2);
                }}
                className="bg-dark-primary-main hover:bg-dark-primary-main/80 mt-8 w-full font-medium text-[#242424]"
                isLoading={isGettingOtp}
              >
                Continue
              </Button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <h1 className="mt-6 text-2xl font-semibold">Verification Code</h1>
              <p className="text-sm leading-3.5 text-[#8C8C8C]">
                We’ve sent a 6-digit code to your email, enter the code below to
                verify
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
                          <InputOTPGroup className="gap-3 *:!rounded *:border *:border-[#6EF7FF2E] *:shadow-none">
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
                  disabled={isUpdating}
                  className="bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 w-full text-[#242424]"
                  type="submit"
                  isLoading={isUpdating}
                >
                  Save
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
