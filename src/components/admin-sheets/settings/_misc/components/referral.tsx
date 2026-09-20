import { DataTable } from "@/pages/admin-dashboard/_misc/data-table";
import { formatAmount } from "@/lib/utils";
import { referralColumns } from "../referralColumns";
import { useGetUserReferrals } from "@/hooks/use-queries";
import { useUpdateUserAdmin } from "@/hooks/use-mutations";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useSheetStore } from "@/zustand/adminSheetStore";

const Referral = ({ userData }: { userData: User }) => {
  const queryClient = useQueryClient();
  const { closeSheet } = useSheetStore();
  const form = useForm({
    defaultValues: {
      referralFee: userData.referralFeePercent || 0,
    },
  });
  const { data: referrals } = useGetUserReferrals(userData.id);
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUserAdmin({
    id: userData.id,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      closeSheet();
    },
  });

  const onSubmit = (data: { referralFee: number }) => {
    updateUser({
      referralFeePercent: Number(data.referralFee),
    });
  };

  return (
    <div className="mt-4 px-4">
      <Form {...form}>
        <div className="space-y-2.5">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-end gap-4"
          >
            <FormField
              control={form.control}
              name="referralFee"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className={"font-normal"}>Referral Fee</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        className={"rounded-md"}
                        placeholder="0"
                        {...field}
                      />
                      <div className="absolute top-1/2 right-2 -translate-y-1/2">
                        <span className="text-xs text-[#A5ACB6]">%</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              isLoading={isUpdatingUser}
              className={"rounded-md"}
              type="submit"
            >
              Update
            </Button>
          </form>
        </div>
      </Form>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <div
          className="flex items-center justify-between rounded-md border border-[#DAE1EA] p-2.5"
          style={{
            boxShadow: "0px 2px 4px 0px #0000000D",
          }}
        >
          <div className="flex flex-col">
            <span className="text-xs text-[#A5ACB6]">Referrals Commission</span>
            <span className="mt-1 text-lg leading-4 font-bold text-black">
              ${formatAmount(userData.totalCommisions)}
            </span>
          </div>
        </div>
        <div
          className="rounded-md border border-[#DAE1EA] p-2.5 text-xs"
          style={{
            boxShadow: "0px 2px 4px 0px #0000000D",
          }}
        >
          <div>
            <img src="/icons/users.svg" alt="" />
          </div>
          <div className="mt-2 flex gap-2.5 font-medium">
            <span>Total Referred</span>
            <span>{referrals?.data?.length || 0}</span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <DataTable
          columns={referralColumns}
          data={referrals?.data || []}
          noDataText="User has no referrals yet"
        />
      </div>
    </div>
  );
};

export default Referral;
