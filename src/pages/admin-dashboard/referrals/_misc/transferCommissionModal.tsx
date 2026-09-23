import Throbber from "@/components/throbber";
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
import { useTransferCommission } from "@/hooks/use-mutations";
import { useAdminModals } from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

const TransferCommissionModal = () => {
  const { transferCommissionData: user } = useAdminModals();
  const queryClient = useQueryClient();
  const form = useForm({
    // resolver: zodResolver(registrationSchema),
  });
  const { mutate: transferCommission, isPending: isTransferringCommission } =
    useTransferCommission({
      id: user!.id!,
      onSuccess: () => {
        form.reset();
        useAdminModals.setState({ transferCommissionIsOpen: false });
        queryClient.invalidateQueries({ queryKey: ["referrals"] });
      },
    });

  const onSubmit = (data: any) => {
    transferCommission(data);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-20 flex h-dvh items-center justify-center bg-black/50 backdrop-blur-lg"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="relative h-auto rounded-xl bg-white px-4 py-6 lg:w-120"
      >
        <button
          onClick={() => {
            useAdminModals.setState({ transferCommissionIsOpen: false });
          }}
          className="hover:text-primary-500 text-primary-50 absolute top-4 right-4"
        >
          <X className="size-5" />
        </button>
        <h2 className="text-3xl font-bold">Transfer Commission</h2>

        <form className="mt-8" onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className={"font-normal"}>
                      Referral Balance (USD{user?.balance})
                    </FormLabel>
                    <span className="text-primary-500 font-bold">Max</span>
                  </div>
                  <FormControl>
                    <Input
                      className={"rounded-md"}
                      type={"text"}
                      {...field}
                      placeholder="Enter Amount"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className={"mt-6 w-full grow rounded-md"} type="submit">
              {isTransferringCommission ? <Throbber /> : "Transfer"}
            </Button>
          </Form>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TransferCommissionModal;
