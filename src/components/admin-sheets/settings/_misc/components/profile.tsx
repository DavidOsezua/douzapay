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
import Throbber from "@/components/throbber";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateUserAdmin } from "@/hooks/use-mutations";
import { Switch } from "@/components/ui/switch";
import z from "zod";

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

export default function Profile({
  userData,
  closeSheet,
}: {
  userData: any;
  closeSheet: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      ...userData,
      phoneNumber: userData?.phoneNumber?.toString(),
    },
  });
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUserAdmin({
    id: userData.id,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      closeSheet();
    },
  });

  const onSubmit = (data: z.infer<typeof registrationSchema>) => {
    updateUser(data);
  };
  return (
    <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <div className="space-y-2.5">
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className={"font-normal"}>First Name</FormLabel>
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
                  <FormLabel className={"font-normal"}>Phone Number</FormLabel>
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
  );
}
