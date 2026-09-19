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
import { Switch } from "@/components/ui/switch";
import { useUpdateUserAdmin } from "@/hooks/use-mutations";
import { useAdminModals } from "@/zustand/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registrationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(100, "Email must be 100 characters or less"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid phone number in international format (e.g., +15551234567)",
    )
    .optional(),

  canRefer: z.boolean().optional(),
});

const EditUserModal = () => {
  const { editUserData: user } = useAdminModals();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      ...user,
      phoneNumber: user?.contact?.toString(),
    },
  });
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUserAdmin({
    id: user!.id!,
    onSuccess: () => {
      form.reset();
      useAdminModals.setState({ editUserIsOpen: false });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit = (data: z.infer<typeof registrationSchema>) => {
    updateUser(data);
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
            useAdminModals.setState({ editUserIsOpen: false });
          }}
          className="hover:text-primary-500 text-primary-50 absolute top-4 right-4"
        >
          <X className="size-5" />
        </button>
        <h2 className="text-3xl font-bold">Edit User</h2>

        <form className="mt-8" onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <div className="space-y-2.5">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className={"font-normal"}>
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={"rounded-md"}
                          {...field}
                          placeholder="John"
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
                    <FormItem className="w-full">
                      <FormLabel className={"font-normal"}>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          className={"rounded-md"}
                          {...field}
                          placeholder="Doe"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-start gap-4 *:grow">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={"font-normal"}>Email</FormLabel>
                      <FormControl>
                        <Input
                          className={"rounded-md"}
                          type={"email"}
                          {...field}
                          placeholder="johndoe@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={"font-normal"}>
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          className={"rounded-md"}
                          type={"tel"}
                          {...field}
                          placeholder="+1 555 1234 5678"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="canRefer"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2.5">
                    <FormLabel className={"font-normal"}>Can Refer</FormLabel>
                    <FormControl>
                      <Switch
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button className={"mt-6 w-full grow rounded-md"} type="submit">
              {isUpdatingUser ? <Throbber /> : "Update"}
            </Button>
          </Form>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditUserModal;
