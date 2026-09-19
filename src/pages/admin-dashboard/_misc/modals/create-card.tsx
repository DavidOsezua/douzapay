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
import { useCreateCardAdmin } from "@/hooks/use-mutations";
import { CountryCodeSelect } from "@/lib/country-code-select";
import { useAdminModals } from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CreateCardModal = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [countryCode, setCountryCode] = useState("NG");
  const { createCardData: user } = useAdminModals();
  const { mutate: createCard, isPending: isCreatingCard } = useCreateCardAdmin({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCards"] });
      useAdminModals.setState({ createCardIsOpen: false });
      navigate("/admin-dashboard/cards");
    },
  });

  const form = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      dob: "",
      phone: "",
      postalCode: "",
      initialAmount: "",
      // bin: "bin",
    },
  });
  const onSubmit = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    initialAmount: string;
  }) => {
    const formData = {
      userId: user!.id!,
      cardData: {
        // bin: data.bin,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneCode: countryCode,
        phone: data.phone,
        useType: "Online transactions",
        cost: parseInt(data.initialAmount),
      },
    };
    createCard(formData);
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
            useAdminModals.setState({ createCardIsOpen: false });
          }}
          className="hover:text-primary-500 text-primary-50 absolute top-4 right-4"
        >
          <X className="size-5" />
        </button>
        <h2 className="text-3xl font-bold">Create Card</h2>
        <p className="text-primary-50 text-sm">
          You are about to create a card for the user below with the following
          details. Please ask the user to register at least $30 on his account
          or do so.
        </p>

        <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <div className="space-y-2.5">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John" />
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type={"email"}
                        {...field}
                        placeholder="johndoe@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input
                          type={"date"}
                          {...field}
                          placeholder="DD/MM/YYYY"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0">
                            <CountryCodeSelect onSelect={setCountryCode} />
                          </div>
                          <Input
                            type={"tel"}
                            {...field}
                            className={"pl-16"}
                            placeholder="000 000 000"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-start gap-4">
                <FormField
                  control={form.control}
                  name="initialAmount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Initial Amount</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Initial Amount" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="bin"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Bin</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={"rounded-full"}>
                            <SelectValue placeholder="Select BIN" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bin?.map((bin) => (
                            <SelectItem key={bin.bin} value={bin.bin}>
                              {bin.bin}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                disabled={isCreatingCard}
                className={"grow"}
                type="submit"
              >
                {isCreatingCard ? <Throbber /> : "Create Card"}
              </Button>
            </div>
          </Form>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateCardModal;
