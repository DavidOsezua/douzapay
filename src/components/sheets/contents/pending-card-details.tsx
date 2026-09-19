import BinCard from "@/components/bin-card";
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
import { countryCodes, CountryCodeSelect } from "@/lib/country-code-select";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const binCards = [
  {
    id: 1,
    name: "Card 1",
    image: "https://example.com/card1.jpg",
    price: 25,
    bin: "5371 0000 0000 0000",
    binValue: "537100",
  },
];

const PendingCardDetails = ({
  closeSheet,
  cardData,
}: {
  closeSheet: () => void;
  setStep: (value: number) => void;
  step: number;
  cardData: PendingCard;
}) => {
  const [, setCountryCode] = useState(cardData.phoneCode);
  const form = useForm({
    defaultValues: {
      firstName: cardData.firstName,
      lastName: cardData.lastName,
      email: cardData.email,
      purpose: cardData.useType,
      phone: cardData.phone,
    },
  });
  const onSubmit = () => {};
  return (
    <div>
      <div>
        <div className="flex justify-center">
          <BinCard className="w-80" card={binCards[0]} />
        </div>
        <form className="mt-6" onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <div className="space-y-2.5">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full gap-1">
                      <FormLabel className="text-[10px] font-normal">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-dark-text-300 text-dark-text-300 bg-dark-input rounded text-xs placeholder:text-[10px]"
                          {...field}
                          readOnly
                          placeholder="Enter First Name"
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
                    <FormItem className="w-full gap-1">
                      <FormLabel className="text-[10px] font-normal">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-dark-text-300 text-dark-text-300 bg-dark-input rounded text-xs placeholder:text-[10px]"
                          {...field}
                          readOnly
                          placeholder="Enter Last Name"
                        />
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
                  <FormItem className="gap-0.5">
                    <FormLabel className="text-[10px] font-normal">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="placeholder:text-dark-text-300 text-dark-text-300 bg-dark-input rounded text-xs placeholder:text-[10px]"
                        type={"email"}
                        {...field}
                        readOnly
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-1/2 gap-1">
                      <FormLabel className="text-[10px] font-normal">
                        Phone
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0">
                            <CountryCodeSelect
                              className="rounded-none"
                              onSelect={setCountryCode}
                              defaultCountry={
                                countryCodes.find(
                                  (c) => c.dialCode === cardData.phoneCode,
                                )?.code
                              }
                            />
                          </div>
                          <Input
                            className="bg-dark-input text-dark-text-300 rounded pl-16 text-[10px] placeholder:text-[10px]"
                            type={"tel"}
                            {...field}
                            readOnly
                            placeholder="000 000 000"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem className="w-1/2 gap-0.5">
                      <FormLabel className="text-[10px] font-normal">
                        Purpose
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-dark-text-300 text-dark-text-300 bg-dark-input rounded text-xs placeholder:text-[10px]"
                          type={"text"}
                          {...field}
                          readOnly
                          placeholder="Online Transactions"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <FormField
                  control={form.control}
                  name="initialAmount"
                  render={({ field }) => (
                    <FormItem className="w-full gap-1">
                      <FormLabel className="text-[10px] font-normal">
                        Deposit Amount
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="rounded bg-dark-input text-xs placeholder:text-[10px] placeholder:text-dark-text-300 text-dark-text-300"
                          {...field} readOnly
                          placeholder="Enter the amount you want to credit to your card."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
            </div>

            <div className="text-center">
              <div className="text-white mx-auto my-4 rounded-full bg-white/10 px-4 py-2 text-center text-[10px] font-medium">
                Your card creation is in progress you will get notify once card
                is created. Thank You
              </div>
            </div>

            <div className="flex grow flex-col">
              <Button
                onClick={closeSheet}
                className={
                  "bg-dark-primary-main disabled:bg-primary-100/50 hover:bg-primary-100-hover text-[#080808] mb-6 rounded font-semibold disabled:cursor-not-allowed"
                }
                type="button"
              >
                Close
              </Button>
            </div>
          </Form>
        </form>
      </div>
    </div>
  );
};

export default PendingCardDetails;
