import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useModalStore } from "@/zustand/modalStore";
import { useQueryClient } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useMemo, useState } from "react";
import { useWithdraw, useGetAuthorizedOTP } from "@/hooks/use-mutations";
import { useUser } from "@/zustand/store";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";
import { formatAmount as formatAmountUtil } from "@/lib/utils";
import { useGetRate, useGetUserAssets } from "@/hooks/use-queries";

const iconMap: Record<string, string> = {
  USDT: "/icons/usdt.svg",
  USDC: "/icons/usdc.svg",
};

const networkIconMap: Record<string, string> = {
  TRC20: "/icons/trc20.png",
  ERC20: "/icons/erc20.svg",
};


const Withdraw = ({
  step,
  setStep,
  closeSheet,
}: {
  step: number;
  setStep: (step: number) => void;
  closeSheet: () => void;
}) => {
  const { user } = useUser((state) => state);
  const { data: userAssets } = useGetUserAssets();
  const totalBalance = (userAssets ?? []).reduce(
    (sum: number, a: any) => sum + Number(a.balance),
    0,
  );
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [withdrawalAddress, setWithdrawalAddress] = useState("");
  const selectedAsset = (userAssets ?? []).find(
    (a: any) => a.id === selectedAssetId,
  );
  const queryClient = useQueryClient();
  const { openModal } = useModalStore();
  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");
  const formatAmount = useFormatAmountWithCurrency();

  const preferredCurrency = user?.preferredCurrency || "USD";
  const { data: rateData } = useGetRate(preferredCurrency);
  const rate = rateData?.rate || 1;

  // Convert amount from preferred currency to USDT
  const usdtAmount = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;
    if (preferredCurrency.toUpperCase() === "USD") {
      return numAmount;
    }
    return numAmount * rate;
  }, [amount, rate, preferredCurrency]);

  const { mutateAsync: getOtp, isPending: isGettingOtp } =
    useGetAuthorizedOTP();

  const { mutateAsync: withdraw, isPending: isWithdrawing } = useWithdraw({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["deposits"],
      });
      queryClient.invalidateQueries({
        queryKey: ["recentTransactions"],
      });
      closeSheet();
      openModal("success", { type: "withdrawal" });
    },
  });

  const onSubmit = () => {
    withdraw({
      token: selectedAsset?.token?.symbol,
      to: withdrawalAddress,
      amount: usdtAmount,
      chain: selectedAsset?.token?.type,
      otp: otp,
      assetId: selectedAsset?.tokenId,
    });
  };

  return (
    <div className="text-white mt-4 px-2">
      {step === 1 && (
        <div className="mt-6">
          <h2 className="font-semibold">Withdraw</h2>

          <div className="mt-4 text-xs">Wallet balance</div>
          <div className="text-2xl font-medium">
            {formatAmount(totalBalance)}
          </div>

          <div className="mt-4 mb-2 text-xs">Select Payment Method</div>
          <div className="grid grid-cols-3 gap-2.5">
            {(userAssets ?? []).map((asset: any) => {
              const label = `${asset.token.type}-${asset.token.symbol}`;
              const icon = iconMap[asset.token.symbol] ?? "/icons/usdt.svg";
              const networkIcon = networkIconMap[asset.token.type];
              const isSelected = selectedAssetId === asset.id;
              return (
                <div
                  role="button"
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`rounded-md border py-4 hover:cursor-pointer ${
                    isSelected
                      ? "text-white border-dark-primary-main"
                      : "text-dark-text-300 border-[#6EF7FF2E]"
                  }`}
                >
                  <div className={`flex flex-col items-center ${isSelected ? "" : "opacity-50"}`}>
                    <div className="relative size-8">
                      <img src={icon} alt={label} className="size-full" />
                      {networkIcon && (
                        <img
                          src={networkIcon}
                          alt={asset.token.type}
                          className="absolute -right-1 -bottom-1 size-3 rounded-full"
                        />
                      )}
                    </div>
                    <p className="mt-4 text-sm">{label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <h4 className="mt-4 text-xs">Withdrawal Address</h4>
          <Input
            value={withdrawalAddress}
            onChange={(e) => setWithdrawalAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="text-white border border-[#6EF7FF2E] mt-2 h-11 lg:text-xs lg:placeholder:text-xs"
          />
          <p className="mt-1 text-[10px] leading-2.5 font-light">
            Please enter the address your funds withdrawn to, according to
            selected cryptocurrency and network selected
          </p>

          <h4 className="mt-4 text-xs">Amount ({preferredCurrency})</h4>
          <div className="relative">
            <Input
              value={amount}
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter Amount in ${preferredCurrency}`}
              className="text-white border border-[#6EF7FF2E] mt-2 h-11 lg:text-xs lg:placeholder:text-xs"
            />
            {amount && parseFloat(amount) > 0 && (
              <p className="text-muted-foreground mt-1 text-xs">
                ≈ {formatAmountUtil(usdtAmount)} USDT
              </p>
            )}
          </div>
          <p className="mt-1 text-[10px] leading-2.5 font-light">
            Withdrawal fee: 2%
          </p>

          <div
            className="text-white mt-4 rounded-lg px-4 py-2 text-[10px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
            }}
          >
            <h6>Note</h6>
            <p className="mt-2 font-light">
              For your security withdrawal from your ArcPay Wallet to your
              external wallet are processed manually and can take 24 hours.
              Please contact the support team with your account details and
              screenshot of your pending withdrawal to have it confirmed
            </p>
          </div>

          <Button
            onClick={async () => {
              await getOtp({
                emailAddress: user.email,
                purpose: "withdrawal",
                address: withdrawalAddress,
                amount: usdtAmount,
              });
              setStep(2);
            }}
            isLoading={isGettingOtp}
            disabled={
              isGettingOtp || !withdrawalAddress || !amount || !selectedAsset
            }
            className="text-[#080808] bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 mb-8 w-full font-semibold"
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6">
          <h2 className="font-semibold">Confirm Withdraw</h2>
          <div className="text-white border border-[#6EF7FF2E] mt-2 rounded p-4 backdrop-blur-sm">
            <h5 className="text-xs">Preview</h5>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-y-4 *:w-1/2">
              <div>
                <div className="text-[10px] text-[#B9BCCC]">Payment Method</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <img
                    src={iconMap[selectedAsset?.token?.symbol] ?? "/icons/usdt.svg"}
                    alt={selectedAsset?.token?.symbol}
                    className="size-4"
                  />
                  <span className="text-sm text-white">
                    {selectedAsset?.token?.type}-{selectedAsset?.token?.symbol}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#B9BCCC]">Network</div>
                <div className="mt-0.5 text-white">{selectedAsset?.token?.type}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#B9BCCC]">
                  Amount Tendered
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-white">
                  {formatAmountUtil(usdtAmount)} {selectedAsset?.token?.symbol}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#B9BCCC]">
                  Fee({user.withdrawalFee}%)
                </div>
                <div className="mt-0.5 text-white">
                  {formatAmountUtil(
                    usdtAmount * ((user.withdrawalFee || 0) / 100),
                  )}{" "}
                  {selectedAsset?.token?.symbol}
                </div>
              </div>
              <div className="">
                <div className="text-[10px] text-[#B9BCCC]">
                  Recipient Will Recieve
                </div>
                <div className="mt-0.5 text-white">
                  {formatAmountUtil(
                    usdtAmount - (usdtAmount * (user.withdrawalFee || 0)) / 100,
                  )}{" "}
                  {selectedAsset?.token?.symbol}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-semibold">Let’s verify your Email</h1>
            <p className="text-sm leading-3.5 text-[#8C8C8C]">
              We’ve sent a 6-digit code to your email, enter the code below to
              verify
            </p>
            <InputOTP
              value={otp}
              onChange={(e) => setOtp(e)}
              id="otp"
              autoFocus
              autoComplete="off"
              pattern={REGEXP_ONLY_DIGITS}
              maxLength={6}
            >
              <InputOTPGroup className="*:text-white mt-2 gap-3 *:!rounded *:border *:border-white *:shadow-none">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              disabled={!otp || isWithdrawing}
              isLoading={isWithdrawing}
              onClick={() => onSubmit()}
              className="text-[#080808] bg-dark-primary-main hover:bg-dark-primary-main/80 mt-6 mb-8 w-full font-semibold"
            >
              Authorize Payment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
