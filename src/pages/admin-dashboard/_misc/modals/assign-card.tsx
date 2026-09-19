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
import { useAssignCardAdmin } from "@/hooks/use-mutations";
import { useAdminModals } from "@/zustand/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

const AssignCardModal = () => {
  const queryClient = useQueryClient();
  const { assignCardData } = useAdminModals();
  const form = useForm({
    resolver: zodResolver(schema),
  });
  const { mutate: assignCard, isPending: isAssigningCard } = useAssignCardAdmin(
    {
      id: assignCardData!.id!,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allCards"] });
        useAdminModals.setState({
          assignCardIsOpen: false,
          assignCardData: null,
        });
      },
    },
  );

  const onSubmit = (data: { email: string }) => {
    assignCard(data);
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
            useAdminModals.setState({ assignCardIsOpen: false });
          }}
          className="hover:text-primary-500 text-primary-50 absolute top-4 right-4"
        >
          <X className="size-5" />
        </button>
        <h2 className="text-3xl font-bold">Assign Card</h2>

        <form className="mt-8" onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className={"font-normal"}>
                    Enter recipient email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={"rounded-md"}
                      {...field}
                      placeholder="Enter email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className={"mt-6 w-full grow rounded-md"} type="submit">
              {isAssigningCard ? <Throbber /> : "Assign"}
            </Button>
          </Form>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AssignCardModal;
