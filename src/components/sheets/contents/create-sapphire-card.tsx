import BinCard from "@/components/bin-card";
import { binCards } from "@/pages/dashboard/shop/page";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CountryCodeSelect } from "@/lib/country-code-select";
import { useModalStore } from "@/zustand/modalStore";
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
import { Checkbox } from "@/components/ui/checkbox";

const SAPPHIRE_BIN = "537100";
const SAPPHIRE_PRICE = 25;

const inputClass =
  "h-11 rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white placeholder:text-white/50";

const selectClass =
  "!h-11 w-full overflow-hidden rounded-xl border border-[#CECECE2E] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white";

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
      { message: "You must be at least 16 years old" },
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

const CreateSapphireCard = ({
  closeSheet,
  setStep,
  step,
  price: apiPrice,
}: {
  closeSheet: () => void;
  setStep: (value: number) => void;
  step: number;
  price?: number;
}) => {
  const { openModal } = useModalStore();
  const cardPrice = apiPrice ?? SAPPHIRE_PRICE;
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
  const restrictedNationalities = [
    "US",
    "AS",
    "GU",
    "MP",
    "PR",
    "UM",
    "VI",
    "MH",
    "FM",
    "PW",
    "CU",
    "IR",
    "KP",
    "SY",
    "SD",
    "RU",
    "BY",
    "MM",
    "VE",
    "YE",
    "LY",
    "SO",
    "SS",
    "ZW",
  ];
  const nationalityCountries = countries.filter(
    (country) => !restrictedNationalities.includes(country.code),
  );

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

  const onSubmit = (data: any) => {
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
    openModal("selectAssetForCard", {
      cardPayload: {
        bin: SAPPHIRE_BIN,
        address,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneCode: countryCode,
        phone: data.phone,
        useType: data.purpose,
        nationality: data.nationality,
        dateOfBirth: data.dateOfBirth,
        cost: 0,
      },
      total: cardPrice,
      onSuccess: closeSheet,
    });
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <div className="mx-auto w-full max-w-[300px]">
            <BinCard card={{ ...binCards.sapphire, price: cardPrice }} />
          </div>

          <form className="mt-6" onSubmit={form.handleSubmit(onSubmit)}>
            <Form {...form}>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="min-w-0 flex-1">
                        <FormLabel className="text-white text-xs font-normal">
                          First Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter First Name"
                            className={inputClass}
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
                      <FormItem className="min-w-0 flex-1">
                        <FormLabel className="text-white text-xs font-normal">
                          Last Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter Last Name"
                            className={inputClass}
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
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter email"
                          className={inputClass}
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
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Phone <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <CountryCodeSelect
                            className="bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] text-white h-11 w-full rounded-xl border border-[#CECECE2E]"
                            onSelect={setCountryCode}
                          />
                          <Input
                            {...field}
                            type="tel"
                            placeholder="000 0000 0000"
                            className={inputClass}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Date of Birth <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="w-full overflow-hidden">
                          <input
                            type="date"
                            className="text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] h-11 w-full max-w-full min-w-0 rounded-xl border border-[#CECECE2E] px-3 text-sm focus:outline-none"
                            value={field.value || ""}
                            onChange={field.onChange}
                            max={(() => {
                              const today = new Date();
                              const max = new Date(
                                today.getFullYear() - 16,
                                today.getMonth(),
                                today.getDate(),
                              );
                              return max.toISOString().split("T")[0];
                            })()}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Nationality <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className={selectClass}>
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {nationalityCountries.map((country) => (
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
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-normal">
                        Purpose <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Online Transactions"
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <p className="text-white mb-2 text-xs font-normal">
                    Address
                  </p>
                  <div
                    className="mb-3 flex w-full overflow-hidden rounded-xl border border-dp-stroke p-0.5"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
                    }}
                  >
                    {(["default", "custom"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        className={`flex-1 rounded-lg py-2.5 text-xs font-medium capitalize transition-all ${
                          addressMode === mode
                            ? "text-dark-text-400"
                            : "text-white"
                        }`}
                        style={
                          addressMode === mode
                            ? {
                                background:
                                  "#E1E1E1",
                              }
                            : { background: "transparent" }
                        }
                        onClick={() => setAddressMode(mode)}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  {addressMode === "custom" && (
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-xs font-normal">
                              Address Line 1
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter address"
                                className={inputClass}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-xs font-normal">
                              Address Line 2 (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter address"
                                className={inputClass}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white text-xs font-normal">
                                City
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter city"
                                  className={inputClass}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white text-xs font-normal">
                                State
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter state"
                                  className={inputClass}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white text-xs font-normal">
                                Country
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className={selectClass}>
                                    <SelectValue placeholder="Select country" />
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
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white text-xs font-normal">
                                Postal Code
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter postal code"
                                  className={inputClass}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <FormField
                  name="esign"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          className="size-4 rounded-sm"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-white text-xs font-normal">
                        I accept the{" "}
                        <span className="text-dark-primary-main font-semibold">
                          E-Sign Consent
                        </span>
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  name="cardTerms"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          className="size-4 rounded-sm"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-white text-xs font-normal">
                        I accept the{" "}
                        <span className="text-dark-primary-main font-semibold">
                          Card Terms
                        </span>{" "}
                        and{" "}
                        <span className="text-dark-primary-main font-semibold">
                          Policy
                        </span>
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  name="certify"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2">
                      <FormControl>
                        <Checkbox
                          className="mt-0.5 size-4 rounded-sm"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-white text-xs leading-5 font-normal">
                        I certify that the information I have provided is
                        accurate and that I will abide by all the rules and
                        requirements related to Duozapay Spend Card.
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  name="spendCard"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2">
                      <FormControl>
                        <Checkbox
                          className="mt-0.5 size-4 rounded-sm"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-white text-xs leading-5 font-normal">
                        I acknowledge that using the Duozapay Spend Card does not
                        constitute unauthorized solicitation.
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6 space-y-3 pb-6">
                <button
                  type="submit"
                  disabled={
                    !form.watch("certify") ||
                    !form.watch("cardTerms") ||
                    !form.watch("esign") ||
                    !form.watch("spendCard")
                  }
                  className="bg-dark-primary-main hover:bg-dark-primary-main/80 text-[#242424] flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  BUY NOW · ${cardPrice.toFixed(2)}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-[#242424] bg-[#E1E1E1] w-full rounded-2xl py-3 text-xs"
                >
                  Please kindly read the fees and terms before purchasing card
                </button>
              </div>
            </Form>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="text-white">
          <h3 className="font-semibold">Terms & Conditions</h3>
          <h4 className="mt-6 text-xs font-semibold lg:mt-4">
            Supported Usage Scenarios
          </h4>
          <p className="mt-2 text-xs leading-5 font-light">
            The card DOES NOT currently support Uber, Petrol stations, Talabat,
            Hermes Amsterdam, Hermes Paris, and Iberia and a few other
            merchants.
          </p>
          <h4 className="mt-4 text-xs font-semibold">Card information</h4>
          <ol className="list-decimal pl-8 text-xs leading-4 *:font-light">
            <li>Card Issuer: MasterCard</li>
            <li>Card Type: Prepaid</li>
            <li>Card Form: Virtual</li>
            <li>Currency: USD</li>
            <li>Apple Pay supported: Yes</li>
            <li>Google Wallet supported: Yes</li>
          </ol>
          <h4 className="mt-4 text-xs font-semibold">Fees</h4>
          <p className="text-xs leading-5 font-light">
            Card Purchase Fee: {cardPrice} USD
          </p>
          <p className="text-xs leading-5 font-light">
            Card Funding Fee:{" "}
            {binCards.sapphire.topUpFee === 0
              ? "Free"
              : `${binCards.sapphire.topUpFee}%`}{" "}
          </p>
          <p className="text-xs leading-5 font-light">
            FX Fee: This can vary and only applies if a crossborder transaction
            or the billing currency is different from the settlement currency.
          </p>
          <h4 className="mt-4 text-xs font-semibold">Credit Limits</h4>
          <ol className="list-decimal pl-8 text-xs leading-4 font-light">
            <li>Maximum Deposit: $1,000,000 USD</li>
            <li>Maximum Card Purchase Quantity: 10</li>
            <li>Initial Deposit Required: No</li>
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
            <li>The card is valid for 1 year.</li>
          </ol>
          <p className="mt-4 text-xs leading-5 font-light">
            <span className="font-medium">Card Currency:</span> It is highly
            recommended to utilise cards that align with the currency of the
            purchase order to mitigate the potential incurring of FX fees.
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

export default CreateSapphireCard;
