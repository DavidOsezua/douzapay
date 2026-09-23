import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetContactOTP } from "@/hooks/use-mutations";
import { useState } from "react";
import Throbber from "@/components/throbber";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/zustand/modalStore";

const AddContact = ({
  step,
  setStep,
  closeSheet,
}: {
  step: number;
  setStep: (step: number) => void;
  closeSheet: () => void;
}) => {
  const [platform, setPlatform] = useState("whatsapp");
  const [contact, setContact] = useState("");
  const { openModal } = useModalStore();
  const { isPending } = useGetContactOTP();
  return (
    <div>
      {step === 1 && (
        <div>
          <h3>Add Contact (Optional)</h3>
          <div className="mt-4 flex gap-2.5">
            <div className="flex w-full max-w-auto items-center gap-4 *:grow">
              <div
                onClick={() => setPlatform("whatsapp")}
                className={`flex w-full items-center justify-between gap-x-4 rounded p-2.5 text-sm ${platform === "whatsapp" ? "text-dark-text-400 bg-dark-input border-dark-primary-main border" : "border-[#6EF7FF2E] text-dark-text-300 border"}`}
              >
                <Label className="flex items-center gap-2.5">
                  <img className="size-4" src="/icons/whatsapp.svg" alt="" />
                  <span>Whatsapp</span>
                </Label>
                <div
                  className={`border-dark-primary-main size-2.5 rounded-full ${platform === "whatsapp" ? "bg-dark-primary-main" : "border-dark-primary-main border"}`}
                />
              </div>

              <div
                onClick={() => setPlatform("telegram")}
                className={`flex w-full items-center justify-between gap-x-4 rounded p-2.5 text-sm ${platform === "telegram" ? "text-dark-text-400 bg-dark-input border-dark-primary-main border" : "border-[#6EF7FF2E] text-dark-text-300 border"}`}
              >
                <Label className="flex items-center gap-2.5">
                  <img className="size-4" src="/icons/telegram.svg" alt="" />
                  <span>Telegram</span>
                </Label>
                <div
                  className={`border-dark-primary-main size-2.5 rounded-full ${platform === "telegram" ? "bg-dark-primary-main" : "border-dark-primary-main border"}`}
                />
              </div>
            </div>
          </div>
          <div className="relative mt-4">
            <Input
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E] text-white rounded pr-20 pl-4 text-xs placeholder:text-xs placeholder:text-white/50"
              type="text"
              placeholder={
                platform === "whatsapp"
                  ? "Enter WhatsApp number"
                  : "Enter Username"
              }
            />
            <button
              // onClick={async () => {
              //   try {
              //     await getContactOtp({ platform, contact });
              //   } catch (e) {
              //     handleError(e);
              //   }
              // }}
              onClick={() => {
                setStep(2);
              }}
              disabled={!contact}
              className="text-dark-text-400 bg-dark-primary-main absolute inset-y-1 right-2 flex w-20 items-center justify-center rounded px-2.5 text-center text-xs active:scale-95 disabled:opacity-50"
            >
              {isPending ? <Throbber className="size-4" /> : "Verify"}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="text-center lg:text-left">
          <h1 className="text-white mt-6 text-2xl font-semibold">
            Let us verify your account
          </h1>
          <p className="text-white mt-4 text-sm">
            We’ve sent a 6-digit code to your telegram. It will auto verify once
            entered.
          </p>

          <div className="mt-6 flex w-full flex-col gap-2.5">
            {/* <Label>Enter verification code</Label> */}

            <InputOTP
              autoFocus
              autoComplete="off"
              pattern={REGEXP_ONLY_DIGITS}
              maxLength={6}
            >
              <InputOTPGroup className="*:text-white gap-3 *:!rounded *:border *:border-[#6EF7FF2E] *:shadow-none">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              // disabled={isLoggingIn}
              onClick={() => {
                closeSheet();
                openModal("success", { type: "add-contact" });
              }}
              className="text-dark-text-400 bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 h-11 w-full"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddContact;
