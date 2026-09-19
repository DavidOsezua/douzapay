import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatAmount } from "@/lib/utils";
import { useSheetStore } from "@/zustand/adminSheetStore";
import { useAdminModals } from "@/zustand/store";
import { useForm } from "react-hook-form";

const Earnings = ({ settlementData }: { settlementData: Merchant }) => {
  const { closeSheet } = useSheetStore();
  const form = useForm({
    defaultValues: {
      payoutDay: "monday",
    },
  });
  const onSubmit = () => {};
  return (
    <div className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-4 flex items-end gap-4 px-4 text-sm">
            <FormField
              control={form.control}
              name="payoutDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-normal">
                    Select the Payout Day
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2.5">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[150px] rounded shadow-none">
                          <SelectValue placeholder="Select Payout Day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                          <SelectItem value="sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>{" "}
                      <Button className="rounded" type="submit">
                        Save
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <div className="mt-4 space-y-4 px-4">
        <AccountCard
          label={`Deposit Fee Earnings- ${settlementData.userDepositFeePercent}%`}
          totalAmount={
            settlementData.paidDepositEarnings +
            settlementData.pendingDepositEarnings
          }
          paidAmount={settlementData.paidDepositEarnings}
          dueAmount={settlementData.pendingDepositEarnings}
        />
        <AccountCard
          label={`Withdrawal Fee Earnings- ${settlementData.userWithdrawalFeePercent}%`}
          totalAmount={
            settlementData.paidWithdrawalEarnings +
            settlementData.pendingWithdrawalEarnings
          }
          paidAmount={settlementData.paidWithdrawalEarnings}
          dueAmount={settlementData.pendingWithdrawalEarnings}
        />
        <AccountCard
          label={`Card Purchase Fee Earnings`}
          totalAmount={
            settlementData.paidCardCreationEarnings +
            settlementData.pendingCardCreationEarnings
          }
          paidAmount={settlementData.paidCardCreationEarnings}
          dueAmount={settlementData.pendingCardCreationEarnings}
        />
        <AccountCard
          deductible
          label={`User Referral Fees Deductions- ${settlementData.userRefferalFeePercent}%`}
          totalAmount={
            settlementData.paidReferralEarnings +
            settlementData.pendingReferralCommissions
          }
          paidAmount={settlementData.paidReferralEarnings}
          dueAmount={settlementData.pendingReferralCommissions}
        />
      </div>
      <div className="mt-4 border-t px-4 pt-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs">Total Earnings</span>
            <span className="mt-1 text-lg leading-4 font-bold text-[#2BC155C1]">
              <span className="text-sm font-normal text-[#A5ACB6]">$</span>
              {formatAmount(
                settlementData.pendingCardCreationEarnings +
                  settlementData.pendingDepositEarnings +
                  settlementData.pendingReferralCommissions +
                  settlementData.pendingWithdrawalEarnings,
              )}
            </span>
          </div>
          <Button
            onClick={() => {
              closeSheet();
              useAdminModals.setState({
                settlementIsOpen: true,
                settlementData: settlementData,
              });
            }}
            className="rounded bg-[#163569] px-6"
          >
            Settle
          </Button>
        </div>
      </div>
    </div>
  );
};

const AccountCard = ({
  label,
  totalAmount,
  paidAmount,
  dueAmount,
  deductible,
}: {
  label: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  deductible?: boolean;
}) => {
  return (
    <div className="rounded-lg border border-[#2659C321] p-2.5">
      <div className="">
        <span className="text-primary-500 text-xs font-medium">{label}</span>
        <div className="mt-2.5 grid grid-cols-3">
          <div>
            <p className="text-primary-500/30 text-xs">All time</p>
            <p className="font-semibold">${formatAmount(totalAmount)}</p>
          </div>
          <div>
            <p className="text-primary-500/30 text-xs">Paid</p>
            <p className="font-semibold">${formatAmount(paidAmount)}</p>
          </div>
          <div>
            <p className="text-primary-500/30 text-xs">Due</p>
            <p
              className={`font-semibold ${deductible ? "text-[#830103]" : "text-[#4C7FE7]"}`}
            >
              ${formatAmount(dueAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
