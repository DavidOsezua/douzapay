import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateUserAdmin, useUpdateAdminBin } from "@/hooks/use-mutations";
import { useGetUserBins } from "@/hooks/use-queries";
import { Input } from "@/components/ui/input";
import { formatAmount } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useSheetStore } from "@/zustand/adminSheetStore";
import { useState } from "react";

type Bin = {
  id: number;
  bin: string;
  provider: string;
  price: string;
  topUpFee: string;
  defaultPrice: string;
};

const PROVIDER_LABELS: Record<string, string> = {
  int: "Sapphire",
  wsb: "Platinum",
};

const Wallet = ({ user }: { user: any }) => {
  const queryClient = useQueryClient();
  const { closeSheet } = useSheetStore();
  const form = useForm({
    defaultValues: {
      depositFee: user?.depositFee || 0,
      withdrawalFee: user?.withdrawalFee || 0,
    },
  });
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUserAdmin({
    id: user.id,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      closeSheet();
    },
  });

  const onSubmit = (data: any) => {
    updateUser({
      depositFee: Number(data.depositFee),
      withdrawalFee: Number(data.withdrawalFee),
    });
  };
  return (
    <div className="mt-4 px-4">
      <WalletCard user={user} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-6 grid grid-cols-2 items-start gap-2 text-sm">
            <FormField
              control={form.control}
              name="depositFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Deposit Fee
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" {...field} />
                      <span className="absolute top-1/2 right-2 -translate-y-1/2">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="withdrawalFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Withdrawal Fee
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" {...field} />
                      <span className="absolute top-1/2 right-2 -translate-y-1/2">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button
              isLoading={isUpdatingUser}
              className="bg-primary-500 hover:bg-primary-500/90 mt-4 w-32 rounded-md"
            >
              Update
            </Button>
          </div>
        </form>
      </Form>

      <CardFeeConfiguration userId={user?.id} />
    </div>
  );
};

const CardFeeConfiguration = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const { data: bins = [], isLoading } = useGetUserBins(userId);
  const [selectedBinId, setSelectedBinId] = useState<number | null>(null);

  const activeBin: Bin | undefined =
    selectedBinId != null
      ? bins.find((b: Bin) => b.id === selectedBinId)
      : bins[0];

  const isPlatinum = activeBin?.provider === "wsb";

  const feeForm = useForm({
    values: {
      price: activeBin ? Number(activeBin.price) : 0,
      topUpFee: activeBin ? Number(activeBin.topUpFee) : 0,
      defaultPrice: activeBin ? Number(activeBin.defaultPrice) : 0,
    },
  });

  const { mutate: updateBin, isPending: isUpdatingBin } = useUpdateAdminBin({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBins", userId] });
    },
  });

  const onFeeSubmit = (data: any) => {
    if (!activeBin) return;
    const payload: any = {
      binId: activeBin.id,
      price: Number(data.price),
      topUpFee: Number(data.topUpFee),
    };
    if (isPlatinum) payload.defaultPrice = Number(data.defaultPrice);
    updateBin({ userId, data: payload });
  };

  if (isLoading || bins.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-base font-semibold text-black">
        Card Fee Configuration
      </h3>

      <div className="mt-3 flex w-fit gap-2 rounded-md border border-[#DAE1EA] p-1">
        {bins.map((bin: Bin) => {
          const label = `${PROVIDER_LABELS[bin.provider] ?? bin.provider} (${bin.bin})`;
          const isActive = (activeBin?.id ?? bins[0]?.id) === bin.id;
          return (
            <button
              key={bin.id}
              type="button"
              onClick={() => setSelectedBinId(bin.id)}
              className={`rounded px-3 py-1.5 text-[10px] transition-colors ${
                isActive
                  ? "bg-white font-medium text-black shadow-sm"
                  : "text-[#6B7280] hover:text-black"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <Form {...feeForm}>
        <form onSubmit={feeForm.handleSubmit(onFeeSubmit)}>
          <div className="mt-4 grid grid-cols-2 items-start gap-2 text-sm">
            <FormField
              control={feeForm.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    {isPlatinum ? "Card Price - Custom ($)" : "Card Price ($)"}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={feeForm.control}
              name="topUpFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Top-up Fee (%)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" step="0.01" {...field} />
                      <span className="absolute top-1/2 right-2 -translate-y-1/2 text-[#6B7280]">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isPlatinum && (
              <FormField
                control={feeForm.control}
                name="defaultPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      Card Price — Default ($)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-end">
            <Button
              isLoading={isUpdatingBin}
              className="bg-primary-500 hover:bg-primary-500/90 mt-4 w-32 rounded-md"
            >
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const WalletCard = ({ user }: { user: any }) => {
  return (
    <div
      className="flex items-center justify-between rounded-md border border-[#DAE1EA] p-4"
      style={{
        boxShadow: "0px 2px 4px 0px #0000000D",
      }}
    >
      <div className="flex flex-col">
        <span className="text-xs text-[#A5ACB6]">Available Balance</span>
        <span className="mt-1 text-lg leading-4 font-bold text-black">
          ${formatAmount(user?.balance)}
        </span>
      </div>
    </div>
  );
};

export default Wallet;
