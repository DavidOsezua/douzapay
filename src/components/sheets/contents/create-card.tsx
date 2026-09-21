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
import { useBuyCards } from "@/hooks/use-mutations";
import { CountryCodeSelect } from "@/lib/country-code-select";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import countryList from "react-select-country-list";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import Throbber from "@/components/throbber";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/zustand/store";

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

const CreateCard = ({
  closeSheet,
  setStep,
  step,
}: {
  closeSheet: () => void;
  setStep: (value: number) => void;
  step: number;
}) => {
  const queryClient = useQueryClient();
  const { user } = useUser((state) => state);
  const [countryCode, setCountryCode] = useState("UK");
  const [addressMode, setAddressMode] = useState<"default" | "custom">(
    "default",
  );
  const countries = countryList()
    .getData()
    .map((country) => ({
      name: country.label,
      flag: `https://flagcdn.com/w80/${country.value.toLowerCase()}.png`,
      code: country.value,
    }));

  const createCardSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    purpose: z.string().min(1, "Purpose is required"),
    phone: z.string().min(1, "Phone is required"),
    nationality: z.string().min(1, "Nationality is required"),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine(
        (value) => {
          if (!value) return false;
          const dob = new Date(value);
          const today = new Date();
          const minDate = new Date(
            today.getFullYear() - 16,
            today.getMonth(),
            today.getDate(),
          );
          return dob <= minDate;
        },
        {
          message: "You must be at least 16 years old",
        },
      ),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    esign: z.boolean(),
    cardTerms: z.boolean(),
    certify: z.boolean(),
    spendCard: z.boolean(),
  });

  const form = useForm({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      purpose: "",
      phone: "",
      nationality: "",
      dateOfBirth: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      esign: false,
      cardTerms: false,
      certify: false,
      spendCard: false,
    },
  });

  const { mutateAsync: createCard, isPending: isCreating } = useBuyCards({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      closeSheet();
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const countryObj = countries.find((c) => c.code === data.country);
      const address =
        addressMode === "default"
          ? undefined
          : {
              addressLine1: data.addressLine1,
              addressLine2: data.addressLine2,
              city: data.city,
              state: data.state,
              country: countryObj ? countryObj.code : "",
              postalCode: data.postalCode,
            };
      const formData = {
        bin: binCards[0].binValue,
        address,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneCode: countryCode,
        phone: data.phone,
        useType: data.purpose,
        nationality: data.nationality,
        dateOfBirth: data.dateOfBirth,
        cost: 10,
      };
      await createCard(formData);
    } catch {
      // The mutation's own onError already toasts.
    }
  };

  return (
    <div>
      {step === 1 && (
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
                        <FormLabel className="text-white text-[10px] font-normal">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white border border-[#CECECE2E] rounded lg:text-xs lg:placeholder:text-[10px]"
                            {...field}
                            placeholder="e.g. John"
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
                        <FormLabel className="text-white text-[10px] font-normal">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E] rounded lg:text-xs lg:placeholder:text-[10px]"
                            {...field}
                            placeholder="e.g. Doe"
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
                      <FormLabel className="text-white text-[10px] font-normal">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E] rounded lg:text-xs lg:placeholder:text-[10px]"
                          type={"email"}
                          {...field}
                          placeholder="e.g. johndoe@example.com"
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
                    <FormItem className="gap-1">
                      <FormLabel className="text-white text-[10px] font-normal">
                        Phone
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2 *:grow">
                          <CountryCodeSelect
                            className="text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] rounded border-[#CECECE2E]"
                            onSelect={setCountryCode}
                          />
                          <Input
                            className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white border border-[#CECECE2E] rounded pl-16 lg:text-[10px] lg:placeholder:text-[10px]"
                            type={"tel"}
                            {...field}
                            placeholder="e.g. 000 000 000"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="w-1/2 gap-1">
                        <FormLabel className="text-white text-[10px] font-normal">
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          {(() => {
                            const today = new Date();
                            const maxDate = new Date(
                              today.getFullYear() - 16,
                              today.getMonth(),
                              today.getDate(),
                            );
                            const maxDateStr = maxDate
                              .toISOString()
                              .split("T")[0];
                            return (
                              <input
                                type="date"
                                className="text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] h-9 w-full max-w-xs rounded border border-[#CECECE2E] focus:outline-none [&>svg]:fill-white"
                                value={field.value || ""}
                                onChange={field.onChange}
                                max={maxDateStr}
                                aria-label="Date of Birth"
                              />
                            );
                          })()}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem className="w-1/2 gap-1">
                        <FormLabel className="text-white text-[10px] font-normal">
                          Nationality
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white border border-[#CECECE2E] w-full rounded lg:text-[10px]">
                              <SelectValue placeholder="Select Nationality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {countries.map((country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.code}
                                  >
                                    <span className="flex items-center gap-2">
                                      <img
                                        src={country.flag}
                                        alt={country.name}
                                        className="inline-block size-4"
                                      />
                                      {country.name}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Address Section with Default/Custom toggle */}
                <div className="mt-6">
                  <h4 className="text-white mb-1 text-[10px] font-normal">
                    Address
                  </h4>
                  <div
                    className="mb-4 flex w-full rounded-lg p-0.5"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
                    }}
                  >
                    <button
                      type="button"
                      className={`w-1/2 rounded-l py-2 text-sm font-medium ${
                        addressMode === "default"
                          ? "text-dark-text-400"
                          : "text-white"
                      }`}
                      style={
                        addressMode === "default"
                          ? {
                              background:
                                "#E1E1E1",
                            }
                          : { background: "transparent" }
                      }
                      onClick={() => setAddressMode("default")}
                    >
                      Default
                    </button>
                    <button
                      type="button"
                      className={`w-1/2 rounded-r py-2 text-sm font-medium ${
                        addressMode === "custom"
                          ? "text-dark-text-400"
                          : "text-white"
                      }`}
                      style={
                        addressMode === "custom"
                          ? {
                              background:
                                "#E1E1E1",
                            }
                          : { background: "transparent" }
                      }
                      onClick={() => setAddressMode("custom")}
                    >
                      Custom
                    </button>
                  </div>
                  {addressMode === "custom" && (
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel className="text-white text-[10px] font-normal">
                              Address Line 1
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] placeholder:text-white/50 h-10 rounded border-[#CECECE2E]"
                                {...field}
                                placeholder="Enter address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel className="text-white text-[10px] font-normal">
                              Address Line 2 (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] placeholder:text-white/50 h-10 rounded border-[#CECECE2E]"
                                {...field}
                                placeholder="Enter address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-[10px] font-normal">
                              City
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] placeholder:text-white/50 h-10 rounded border-[#CECECE2E]"
                                {...field}
                                placeholder="Enter city"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-[10px] font-normal">
                              State
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] placeholder:text-white/50 h-10 rounded border-[#CECECE2E]"
                                {...field}
                                placeholder="Enter state"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-[10px] font-normal">
                              Country
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] placeholder:text-white/50 !h-10 w-full rounded border-[#CECECE2E]">
                                  <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {countries.map((country) => (
                                      <SelectItem
                                        key={country.code}
                                        value={country.code}
                                      >
                                        <span className="flex items-center gap-2">
                                          <img
                                            src={country.flag}
                                            alt={country.name}
                                            className="inline-block size-4"
                                          />
                                          {country.name}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal">
                              Postal Code
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] placeholder:text-white/50 h-10 rounded border-[#CECECE2E]"
                                {...field}
                                placeholder="Enter postal code"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem className="gap-0.5">
                      <FormLabel className="text-white text-[10px] font-normal">
                        Purpose
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="placeholder:text-white/50 text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] h-10 rounded border-[#CECECE2E]"
                          type={"text"}
                          {...field}
                          placeholder="e.g. Online Transactions"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white mt-4 rounded-lg px-3 py-4 text-[10px]">
                <FormField
                  control={form.control}
                  name="esign"
                  render={({ field }) => (
                    <FormItem className="flex grow items-center gap-1">
                      <FormControl>
                        <Checkbox
                          className="size-3 rounded-xs"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="gap-1 text-[10px] font-light">
                        <span>I accept the</span> {""}
                        <Link
                          to={"/pdfs/E-sign template.pdf"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold"
                        >
                          E-Sign Consent
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardTerms"
                  render={({ field }) => (
                    <FormItem className="mt-3 flex grow items-center gap-1">
                      <FormControl>
                        <Checkbox
                          className="size-3 rounded-xs"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-white inline-block text-[10px] font-light">
                        I accept the {""}
                        <Link
                          to={"/pdfs/My-pay_Card_Terms.pdf"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold"
                        >
                          Card Terms
                        </Link>{" "}
                        and {""}
                        <Link
                          to={"/pdfs/My-pay card Privacy Policy.pdf"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold"
                        >
                          Policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certify"
                  render={({ field }) => (
                    <FormItem className="mt-3 flex items-start">
                      <FormControl>
                        <Checkbox
                          className="mt-px size-3 rounded-xs"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-white text-[10px] font-light">
                        I certify that the information I have provided is
                        accurate and that i will abide by all the rules and
                        requirements related to KrypKard Spend Card.
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spendCard"
                  render={({ field }) => (
                    <FormItem className="text-white mt-3 flex items-start">
                      <FormControl>
                        <Checkbox
                          className="mt-px size-3 rounded-xs"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-[10px] font-light">
                        I acknowledge that using the KrypKard Spend Card does not
                        constitute unauthorized solicitation.
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-center">
                <button
                  onClick={() => setStep(2)}
                  className="text-[#242424] bg-[#E1E1E1] mx-auto my-4 rounded-full px-4 py-2 text-center text-[10px] font-medium hover:bg-[#E1E1E1]/80"
                >
                  Please kindly read the fees and terms before purchasing card
                </button>
              </div>

              <div className="flex grow flex-col">
                <Button
                  disabled={
                    isCreating ||
                    !form.watch("certify") ||
                    !form.watch("cardTerms") ||
                    !form.watch("esign") ||
                    !form.watch("spendCard")
                  }
                  className={
                    "bg-dark-primary-main disabled:bg-dark-primary-main/50 hover:bg-dark-primary-main-hover text-[#242424] mb-6 rounded font-semibold disabled:cursor-not-allowed"
                  }
                  type="submit"
                >
                  {isCreating ? <Throbber /> : "Confirm"}
                </Button>
              </div>
            </Form>
          </form>
        </div>
      )}
      {step === 2 && (
        <div className="text-white">
          <h3 className="font-semibold">Terms & Conditions</h3>
          <h4 className="mt-6 text-xs font-semibold lg:mt-4">
            All Supported Usage Scenarios
          </h4>

          <p className="mt-2 text-xs leading-5 font-light">
            The card does not currently support Uber, Shell, and Iberia
            transactions.
          </p>
          <h4 className="mt-4 text-xs font-semibold">Card information </h4>
          <ol className="list-decimal pl-8 text-xs leading-4 *:font-light">
            <li>Card Issuer: Visa</li>
            <li>Card Type: Credit</li>
            <li>Card Form: Virtual</li>
            <li>Currency: USD</li>
            <li>Apple Pay supported: Yes</li>
            <li>Google Wallet supported: Yes</li>
          </ol>
          <h4 className="mt-4 text-xs font-semibold">Fees</h4>
          <p className="text-xs leading-5 font-light">
            Deposit Fee: {user?.depositFee} USD
          </p>
          <p className="text-xs leading-5 font-light">
            Card Purchase Fee: {user?.cardCreationFee} USD
          </p>
          <p className="text-xs leading-5 font-light">
            FX Fee: This can vary and only applies if a crossborder transaction
            or the billing currency is different from the settlement currency.
          </p>

          <h4 className="mt-4 text-xs font-semibold">Credit Limits</h4>
          <ol className="list-decimal pl-8 text-xs leading-4 font-light">
            <li>Maximum Deposit: $100,000 USD</li>
            <li>Maximum Card Purchase Quantity: 10</li>
            <li>Initial Deposit Required: Yes</li>
          </ol>
          <h4 className="mt-4 text-xs font-semibold">Card Usage Notice</h4>
          <ol className="list-decimal pl-8 text-xs leading-4 font-light">
            <li>
              If the card issuer detects malicious activities, such as bulk
              refunds, cancellations, failures or chargebacks during card usage,
              the card will be automatically frozen, and a fee of $50 USD per
              occurrence will be deducted.
            </li>
            <li>
              If the overall transaction failure rate exceeds 20%, the card will
              be automatically frozen.
            </li>
            <li>
              If the card has insufficient balance and accumulates up to 3
              consecutive authorization failures, the card will be automatically
              cancelled.
            </li>
            <li>
              If the card is frozen, please contact customer service to apply
              for unfreezing.
            </li>
            <li>The card is valid for 1 years.</li>
          </ol>
          <p className="mt-4 text-xs leading-5 font-light">
            <span className="font-medium">Card Currency:</span> Card currency
            refers to the currency type or unit associated with infinity cards.
            it plays a crucial role in determining the currency used for payment
            and settlement when utilising KrypKard cards. It is highly recommended
            to utilise cards that align with the currency of the purchase order
            to mitigate the potential incurring of FX fees.
          </p>
          <p className="mt-2 text-xs leading-5 font-light">
            For customers with monthly transaction volumes exceeding 500,000
            USD, please contact the support team for fee adjustments.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateCard;
