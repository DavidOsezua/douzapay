import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useAddWalletAdmin } from "@/hooks/use-mutations";
import { useAdminModals } from "@/zustand/store";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { ScanLine, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrencyIconPath, handlePaste } from "@/lib/utils";

const AddWalletModal = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      crypto: "",
      network: "",
      walletAddress: "",
    },
  });
  const queryClient = useQueryClient();
  const { mutate: addWallet, isPending: isAddingWallet } = useAddWalletAdmin({
    onSuccess: () => {
      form.reset();
      useAdminModals.setState({ addWalletIsOpen: false });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
  const cryptoAddresses: { [coin: string]: string[] } = {
    USDT: ["TRC20", "ERC20"],
    USDC: ["ERC20"],
    BTC: ["BTC"],
    ETH: ["ETH"],
  };
  const onSubmit = (data: any) => {
    addWallet(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-60 flex h-dvh items-center justify-center bg-black/50 backdrop-blur-lg"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="relative h-auto rounded-lg bg-white px-4 py-4 lg:w-120"
      >
        <button
          onClick={() => {
            useAdminModals.setState({
              addWalletIsOpen: false,
            });
          }}
          className="hover:text-primary-500 text-primary-50 absolute top-4 right-4"
        >
          <X className="size-5" />
        </button>
        <h3 className="font-semibold">Add Wallet</h3>

        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Wallet Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter wallet name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="crypto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Crypto</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full shadow-none">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="z-70">
                        {Object.keys(cryptoAddresses).map((coin) => (
                          <SelectItem
                            key={coin}
                            className="flex items-center gap-0.5"
                            value={coin}
                          >
                            <img
                              src={getCurrencyIconPath(coin)}
                              className="size-4 rounded-full"
                              alt={coin}
                            />
                            <span>{coin}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    Select Network
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full shadow-none">
                        <SelectValue placeholder="Select Network" />
                      </SelectTrigger>
                      <SelectContent className="z-70">
                        {cryptoAddresses[form.watch("crypto")]?.map(
                          (network: string) => (
                            <SelectItem
                              key={network}
                              className="flex items-center gap-0.5"
                              value={network}
                            >
                              <img
                                src={getCurrencyIconPath(network)}
                                className="size-4 rounded-full"
                                alt={network}
                              />
                              <span>{network}</span>
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>{" "}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="walletAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">
                      Wallet Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter wallet address"
                          className="pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute top-1/2 right-1 -translate-y-1/2"
                          onClick={() =>
                            handlePaste((value) =>
                              form.setValue("walletAddress", value),
                            )
                          }
                        >
                          <span className="text-[#4C7FE7]">Paste</span>
                          <ScanLine className="size-5" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="bg-primary-500 mt-2 mb-4 h-auto w-full rounded-md py-3"
              type="submit"
              isLoading={isAddingWallet}
            >
              Continue
            </Button>
          </form>
        </Form>
      </motion.div>
    </motion.div>
  );
};

export default AddWalletModal;
