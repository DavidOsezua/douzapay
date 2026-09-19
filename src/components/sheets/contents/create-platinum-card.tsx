import BinCard from "@/components/bin-card";
import { useState } from "react";
import { resolveCardStyle } from "@/pages/dashboard/shop/page";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useModalStore } from "@/zustand/modalStore";
import { CirclePlus, Users } from "lucide-react";
import { useSheetStore } from "@/zustand/sheetStore";
import { useGetCardholders } from "@/hooks/use-queries";
import { useUser } from "@/zustand/store";
import moment from "moment";

const MAX_QUANTITY = 20;
const tabs = ["default", "custom"] as const;
const depositOptions = [
  { label: "$1", value: 1 },
  { label: "$5", value: 5 },
  { label: "$10", value: 10 },
  { label: "$20", value: 20 },
  { label: "$50", value: 50 },
  { label: "$100", value: 100 },
];

const platinumSchema = z.object({
  cost: z.coerce
    .number({
      required_error: "Cost is required",
      invalid_type_error: "Cost must be a number",
    })
    .min(0),
  quantity: z.coerce.number().min(1).max(20).default(1),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  esign: z.boolean().optional(),
  cardTerms: z.boolean().optional(),
  certify: z.boolean().optional(),
  spendCard: z.boolean().optional(),
  customCost: z.coerce.number().min(0).optional(),
  customQuantity: z.coerce.number().min(1).max(20).optional(),
  c_esign: z.boolean().optional(),
  c_cardTerms: z.boolean().optional(),
  c_certify: z.boolean().optional(),
  c_spendCard: z.boolean().optional(),
});

const inputClass =
  "h-11 rounded-xl border border-[#2C7B7F] bg-[linear-gradient(129.49deg,rgba(67,72,97,0.1)_3.6%,rgba(95,104,149,0.1)_100%)] text-white placeholder:text-white/50";

const CreatePlatinumCard = ({
  closeSheet,
  setStep,
  step,
  bin,
}: {
  closeSheet: () => void;
  setStep: (value: number) => void;
  step: number;
  bin: {
    id: number;
    bin: string;
    network: string;
    price: number;
    defaultPrice: number;
    topUpFee: number;
  };
}) => {
  const { openSheet } = useSheetStore();
  const { openModal } = useModalStore();
  const { user } = useUser((state) => state);
  const [activeTab, setActiveTab] = useState<"default" | "custom">("default");
  const [quantity, setQuantity] = useState(1);
  const [customStep, setCustomStep] = useState<1 | 2>(1);
  const [selectedCardholder, setSelectedCardholder] = useState<any>(null);

  const style = resolveCardStyle(bin.bin, bin.network);

  const cardPrice = bin.price;
  const cardDefaultPrice = bin.defaultPrice || cardPrice;

  const { data: cardholdersData, isLoading: isLoadingCardholders } =
    useGetCardholders(String(bin.id));

  const form = useForm({
    resolver: zodResolver(platinumSchema),
    defaultValues: {
      cost: 0,
      quantity: 1,
      firstName: "",
      lastName: "",
      email: user?.email ?? "",
    },
  });

  const costPerCard = Number(form.watch("cost")) || 0;
  const total = (cardDefaultPrice + costPerCard) * quantity;

  const onSubmit = (data: any) => {
    openModal("selectAssetForCard", {
      cardPayload: {
        bin: String(bin.id),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        cost: data.cost,
        quantity: data.quantity,
        useType: "platinum online transactions",
      },
      total,
      onSuccess: closeSheet,
    });
  };

  // T&C page (step 2)
  if (step === 2) {
    return (
      <div className="text-white">
        <h3 className="font-semibold">Terms & Conditions</h3>
        <h4 className="mt-6 text-xs font-semibold lg:mt-4">
          Supported Usage Scenarios
        </h4>
        <p className="mt-2 text-xs leading-5 font-light">
          The card SUPPORTS Uber, petrol stations, YouTube, AliExpress, Amazon,
          Iberia, Talabat.
        </p>
        <h4 className="mt-4 text-xs font-semibold">Card information</h4>
        <ol className="list-decimal pl-8 text-xs leading-4 *:font-light">
          <li>Card Issuer: {bin.network}</li>
          <li>Card Type: Prepaid</li>
          <li>Card Form: Virtual</li>
          <li>Currency: USD</li>
          <li>Apple Pay supported: Yes</li>
          <li>Google Wallet supported: Yes</li>
        </ol>
        <h4 className="mt-4 text-xs font-semibold">Fees</h4>

        <p className="text-xs leading-5 font-light">
          Card Purchase Fee (Default): {cardDefaultPrice} USD
        </p>
        <p className="text-xs leading-5 font-light">
          Card Purchase Fee (Custom): {cardPrice} USD
        </p>
        <p className="text-xs leading-5 font-light">
          Card Funding Fee: {bin.topUpFee === 0 ? "Free" : `${bin.topUpFee}%`}
        </p>
        <p className="text-xs leading-5 font-light">
          FX Fee: This can vary and only applies if a crossborder transaction or
          the billing currency is different from the settlement currency.
        </p>
        <h4 className="mt-4 text-xs font-semibold">Credit Limits</h4>
        <ol className="list-decimal pl-8 text-xs leading-4 font-light">
          <li>Maximum Deposit: $1,000,000 USD</li>
          <li>Maximum Card Purchase Quantity: 10</li>
          <li>Initial Deposit Required: Yes (minimum $1)</li>
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
            If the card is frozen, please contact customer service to apply for
            unfreezing.
          </li>
          <li>The card is valid for 1 year.</li>
        </ol>
        <p className="mt-4 text-xs leading-5 font-light">
          <span className="font-medium">Card Currency:</span> It is highly
          recommended to utilise cards that align with the currency of the
          purchase order to mitigate the potential incurring of FX fees.
        </p>
        <p className="mt-2 text-xs leading-5 font-light">
          For customers with monthly transaction volumes exceeding 500,000 USD,
          please contact the support team for fee adjustments.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full grow flex-col">
      <div className="grow">
        {/* Tab + BinCard header */}
        <div className="mx-auto max-w-[300px]">
          <div
            className="flex h-[35px] w-[155px] items-center gap-2 rounded-full border border-[#D9D9D9] p-0.5"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                className={`h-full w-full rounded-full text-xs capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-[linear-gradient(100.47deg,#6EF7FF_9.36%,#3FD8E8_100%)] text-dark-text-400"
                    : "text-dark-text-300"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <BinCard
              className="!h-[200px] w-full"
              card={{
                ...style,
                id: bin.id,
                name: "Virtual Card",
                bin: bin.bin,
                binValue: bin.bin,
                network: bin.network,
                price: activeTab === "default" ? cardDefaultPrice : cardPrice,
              }}
            />
          </div>
        </div>

        <div className="mt-6">
          {/* ── DEFAULT TAB ── */}
          {activeTab === "default" && (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Form {...form}>
                {/* Card Deposit */}
                <FormField
                  name="cost"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-white text-xs">
                          Card Deposit
                        </FormLabel>
                        <span className="text-[#B9BCCC] text-xs">
                          Min $1 · Balance loaded on card
                        </span>
                      </div>
                      <FormControl>
                        <div>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            className={inputClass}
                          />
                          <div className="mt-2 flex items-center gap-1">
                            {depositOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                className="text-white h-8 grow rounded-full border border-[#2C7B7F] bg-[linear-gradient(129.49deg,rgba(67,72,97,0.1)_3.6%,rgba(95,104,149,0.1)_100%)] px-1 text-xs hover:opacity-80"
                                onClick={() =>
                                  form.setValue("cost", option.value)
                                }
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Quantity */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">
                      Quantity
                    </p>
                    <p className="text-[#B9BCCC] text-xs">
                      Max {MAX_QUANTITY} cards per order
                    </p>
                  </div>
                  <div className="flex h-9 items-center gap-3 rounded-full border border-[#E1E5EB] bg-[#FBFBFB] px-4">
                    <button
                      type="button"
                      className="text-dark-text-300 hover:text-dark-text-400 text-base font-medium disabled:opacity-30"
                      disabled={quantity <= 1}
                      onClick={() => {
                        const next = quantity - 1;
                        setQuantity(next);
                        form.setValue("quantity", next);
                      }}
                    >
                      −
                    </button>
                    <span className="text-dark-text-400 min-w-[16px] text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="text-dark-text-300 hover:text-dark-text-400 text-base font-medium disabled:opacity-30"
                      disabled={quantity >= MAX_QUANTITY}
                      onClick={() => {
                        const next = quantity + 1;
                        setQuantity(next);
                        form.setValue("quantity", next);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Pricing summary */}
                <div className="mt-4 space-y-3 rounded-2xl border border-[#2C7B7F] bg-[linear-gradient(129.49deg,rgba(67,72,97,0.1)_3.6%,rgba(95,104,149,0.1)_100%)] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">
                        Card price
                      </p>
                      <p className="text-[#B9BCCC] text-xs">
                        ${cardDefaultPrice.toFixed(2)} x {quantity}
                      </p>
                    </div>
                    <p className="text-white text-sm font-semibold">
                      ${(cardDefaultPrice * quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">
                        Card deposit
                      </p>
                      <p className="text-[#B9BCCC] text-xs">
                        ${costPerCard.toFixed(2)} x {quantity}
                      </p>
                    </div>
                    <p className="text-white text-sm font-semibold">
                      ${(costPerCard * quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="border-t border-[#2C7B7F]" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-semibold">
                        Total to pay
                      </p>
                      <p className="text-[#B9BCCC] text-xs">
                        {quantity} card{quantity !== 1 ? "s" : ""}, incl.
                        deposit
                      </p>
                    </div>
                    <p className="text-white text-sm font-bold">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* First name & Last name */}
                <div className="mt-4 flex gap-3">
                  <FormField
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-white text-sm">
                          First Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="First name"
                            className={inputClass}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="lastName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-white text-sm">
                          Last Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Last name"
                            className={inputClass}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="text-white text-sm">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Email"
                          className={inputClass}
                        />
                      </FormControl>
                      <FormDescription className="text-[#B9BCCC] text-xs">
                        Card details will be delivered to this email instantly
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Checkboxes */}
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
                          requirements related to my ArcPay Spend Card.
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
                          I acknowledge that using the ArcPay Spend Card does
                          not constitute unauthorized solicitation.
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6 space-y-3 pb-6">
                  <p
                    className="text-center text-xs"
                    style={{ color: "#FFAFAF" }}
                  >
                    ⏳ Card creation may take up to 24 hours to complete.
                  </p>
                  <button
                    type="submit"
                    disabled={
                      !form.watch("esign") ||
                      !form.watch("cardTerms") ||
                      !form.watch("certify") ||
                      !form.watch("spendCard")
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "#4A93DB",
                      opacity:
                        !form.watch("esign") ||
                        !form.watch("cardTerms") ||
                        !form.watch("certify") ||
                        !form.watch("spendCard")
                          ? 0.5
                          : 1,
                    }}
                  >
                    BUY NOW · ${total.toFixed(2)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-dark-text-300 w-full rounded-2xl border border-[#E1E5EB] bg-[#FBFBFB] py-3 text-xs"
                  >
                    Please kindly read the fees and terms before purchasing card
                  </button>
                </div>
              </Form>
            </form>
          )}

          {/* ── CUSTOM TAB ── */}
          {activeTab === "custom" && (
            <div className="pb-6">
              {customStep === 1 && (
                <>
                  {/* New cardholder button */}
                  <button
                    type="button"
                    onClick={() =>
                      openSheet("createCardholder", null, { binId: bin.id })
                    }
                    className="mt-2 flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5"
                    style={{
                      borderColor: "#62D1F3",
                      borderStyle: "dashed",
                      background:
                        "linear-gradient(129.49deg, rgba(67, 72, 97, 0.1) 3.6%, rgba(95, 104, 149, 0.1) 100%)",
                    }}
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F0FBFF]">
                      <CirclePlus size={20} color="#62D1F3" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white text-sm font-medium">
                        New cardholder
                      </p>
                      <p className="text-[#B9BCCC] text-xs">
                        Enter details for someone else
                      </p>
                    </div>
                    <span className="text-white text-sm">›</span>
                  </button>

                  {/* OR divider */}
                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#E1E5EB]" />
                    <span className="text-dark-text-300 text-xs">OR</span>
                    <div className="h-px flex-1 bg-[#E1E5EB]" />
                  </div>

                  {/* Saved profiles */}
                  <div>
                    <p className="text-white text-base font-medium">
                      Cardholder profile
                    </p>
                    <p className="text-[#B9BCCC] mb-4 text-xs">
                      Reuse saved details or start fresh
                    </p>

                    <div className="mb-3 flex items-center gap-2">
                      <Users size={14} className="text-dark-text-300" />
                      <span className="text-dark-text-300 text-xs font-semibold tracking-widest">
                        SAVED PROFILES
                      </span>
                    </div>

                    {isLoadingCardholders ? (
                      <div className="text-white py-6 text-center text-xs">
                        Loading profiles…
                      </div>
                    ) : (cardholdersData ?? []).length === 0 ? (
                      <div className="text-white py-6 text-center text-xs">
                        No saved profiles yet
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(cardholdersData ?? []).map((holder: any) => {
                          const initials =
                            `${holder.firstName?.[0] ?? ""}${holder.lastName?.[0] ?? ""}`.toUpperCase();
                          const isVerified =
                            holder.status === "verified" ||
                            holder.status === "approved";
                          const isRejected = holder.status === "rejected";

                          return (
                            <button
                              key={holder.id}
                              type="button"
                              disabled={!isVerified}
                              onClick={() => {
                                setSelectedCardholder(holder);
                                // The shared form's zod schema requires
                                // firstName/lastName/email, but this flow never
                                // renders those inputs — seed them from the
                                // chosen cardholder so handleSubmit validates.
                                form.setValue(
                                  "firstName",
                                  holder.firstName ?? "",
                                );
                                form.setValue("lastName", holder.lastName ?? "");
                                form.setValue(
                                  "email",
                                  holder.email ?? user?.email ?? "",
                                );
                                setCustomStep(2);
                              }}
                              className="flex w-full items-center gap-3 rounded-2xl border border-[#E1E5EB] bg-[#FBFBFB] px-4 py-3 text-left disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#6C95F6]/20 text-sm font-bold text-[#6C95F6]">
                                {initials}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-dark-text-400 text-sm font-semibold">
                                    {holder.firstName} {holder.lastName}
                                  </span>
                                  <span className="rounded-full bg-[#6C95F6]/10 px-2 py-0.5 text-[10px] text-[#6C95F6]">
                                    {holder.accountPurpose ?? "Personal"}
                                  </span>
                                </div>
                                <p className="text-dark-text-300 truncate text-xs">
                                  {holder.email}
                                </p>
                                <p className="text-dark-text-300 mt-0.5 text-xs">
                                  Last used{" "}
                                  {holder.updatedAt
                                    ? moment(holder.updatedAt).fromNow()
                                    : "—"}
                                </p>
                              </div>
                              <div className="flex shrink-0 flex-col items-end gap-2">
                                {isVerified && (
                                  <span
                                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-green-600"
                                    style={{ background: "#9BFFB71A" }}
                                  >
                                    <span className="size-1.5 rounded-full bg-green-500" />
                                    Verified
                                  </span>
                                )}
                                {isRejected && (
                                  <span
                                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-red-500"
                                    style={{ background: "#FF63661A" }}
                                  >
                                    <span className="size-1.5 rounded-full bg-red-500" />
                                    Rejected
                                  </span>
                                )}
                                {!isVerified && !isRejected && (
                                  <span
                                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs text-yellow-500"
                                    style={{ background: "#FFBD4C1A" }}
                                  >
                                    <span className="size-1.5 rounded-full bg-yellow-400" />
                                    Pending
                                  </span>
                                )}
                                {isVerified && (
                                  <span className="text-dark-text-300 text-sm">
                                    ›
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}

              {customStep === 2 && selectedCardholder && (
                <>
                  {/* Selected cardholder summary */}
                  <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#2C7B7F] bg-[linear-gradient(129.49deg,rgba(67,72,97,0.1)_3.6%,rgba(95,104,149,0.1)_100%)] px-4 py-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#6C95F6]/20 text-sm font-bold text-[#6C95F6]">
                      {`${selectedCardholder.firstName?.[0] ?? ""}${selectedCardholder.lastName?.[0] ?? ""}`.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-semibold">
                          {selectedCardholder.firstName}{" "}
                          {selectedCardholder.lastName}
                        </span>
                        <span className="rounded-full bg-[#6C95F6]/10 px-2 py-0.5 text-[10px] text-[#6C95F6]">
                          {selectedCardholder.accountPurpose ?? "Personal"}
                        </span>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-green-600">
                        <span>✓</span>
                        <span>
                          {selectedCardholder.status === "verified" ||
                          selectedCardholder.status === "approved"
                            ? "Verified"
                            : selectedCardholder.status}{" "}
                          · KYC on file
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomStep(1);
                        setSelectedCardholder(null);
                      }}
                      className="text-white shrink-0 rounded-full border border-[#2C7B7F] px-3 py-1 text-xs"
                    >
                      Change
                    </button>
                  </div>

                  {/* Custom purchase form */}
                  <form
                    onSubmit={form.handleSubmit((data) => {
                      const customCost = Number(data.customCost) || 0;
                      const customTotal = (cardPrice + customCost) * quantity;
                      openModal("selectAssetForCard", {
                        cardPayload: {
                          bin: String(bin.id),
                          cost: data.customCost,
                          quantity: data.customQuantity ?? quantity,
                          holderId: selectedCardholder.id,
                          useType: "platinum online transactions",
                        },
                        total: customTotal,
                        onSuccess: closeSheet,
                      });
                    })}
                  >
                    <Form {...form}>
                      {/* Custom deposit */}
                      <FormField
                        name="customCost"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-white text-xs">
                                Card Deposit{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <span className="text-[#B9BCCC] text-xs">
                                Min $1 · Balance loaded on card
                              </span>
                            </div>
                            <FormControl>
                              <div>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type="number"
                                    min={1}
                                    placeholder="0"
                                    className={`${inputClass} pr-12`}
                                  />
                                  <span className="text-dark-text-300 absolute top-1/2 right-3 -translate-y-1/2 text-xs">
                                    USD
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center gap-1">
                                  {[5, 25, 50, 100, 200, 300].map((v) => (
                                    <button
                                      key={v}
                                      type="button"
                                      className="text-white h-8 grow rounded-full border border-[#2C7B7F] bg-[linear-gradient(129.49deg,rgba(67,72,97,0.1)_3.6%,rgba(95,104,149,0.1)_100%)] text-xs hover:opacity-80"
                                      onClick={() =>
                                        form.setValue("customCost", v)
                                      }
                                    >
                                      ${v}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Custom quantity */}
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">
                            Quantity
                          </p>
                          <p className="text-[#B9BCCC] text-xs">
                            Max {MAX_QUANTITY} cards per order
                          </p>
                        </div>
                        <div className="flex h-9 items-center gap-3 rounded-full border border-[#E1E5EB] bg-[#FBFBFB] px-4">
                          <button
                            type="button"
                            className="text-dark-text-300 hover:text-dark-text-400 text-base font-medium disabled:opacity-30"
                            disabled={quantity <= 1}
                            onClick={() => {
                              const next = quantity - 1;
                              setQuantity(next);
                              form.setValue("customQuantity", next);
                            }}
                          >
                            −
                          </button>
                          <span className="text-dark-text-400 min-w-[16px] text-center text-sm font-semibold">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            className="text-dark-text-300 hover:text-dark-text-400 text-base font-medium disabled:opacity-30"
                            disabled={quantity >= MAX_QUANTITY}
                            onClick={() => {
                              const next = quantity + 1;
                              setQuantity(next);
                              form.setValue("customQuantity", next);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Custom pricing summary */}
                      {(() => {
                        const customCost =
                          Number(form.watch("customCost")) || 0;
                        const customTotal = (cardPrice + customCost) * quantity;
                        return (
                          <div className="mt-4 space-y-3 rounded-2xl border border-[#2C7B7F] bg-[linear-gradient(129.49deg,rgba(67,72,97,0.1)_3.6%,rgba(95,104,149,0.1)_100%)] p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white text-sm font-medium">
                                  Card price
                                </p>
                                <p className="text-[#B9BCCC] text-xs">
                                  ${cardPrice.toFixed(2)} x {quantity}
                                </p>
                              </div>
                              <p className="text-white text-sm font-semibold">
                                ${(cardPrice * quantity).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white text-sm font-medium">
                                  Card deposit
                                </p>
                                <p className="text-[#B9BCCC] text-xs">
                                  ${customCost.toFixed(2)} x {quantity}
                                </p>
                              </div>
                              <p className="text-white text-sm font-semibold">
                                ${(customCost * quantity).toFixed(2)}
                              </p>
                            </div>
                            <div className="border-t border-[#2C7B7F]" />
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white text-sm font-semibold">
                                  Total to pay
                                </p>
                                <p className="text-[#B9BCCC] text-xs">
                                  {quantity} card{quantity !== 1 ? "s" : ""},
                                  incl. deposit
                                </p>
                              </div>
                              <p className="text-white text-sm font-bold">
                                ${customTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Custom checkboxes */}
                      <div className="mt-4 space-y-3">
                        <FormField
                          name="c_esign"
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
                          name="c_cardTerms"
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
                          name="c_certify"
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
                                I certify that the information I have provided
                                is accurate and that I will abide by all the
                                rules and requirements related to my ArcPay
                                Spend Card.
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="c_spendCard"
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
                                I acknowledge that using the ArcPay Spend Card
                                does not constitute unauthorized solicitation.
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mt-6 space-y-3 pb-6">
                        <button
                          type="submit"
                          disabled={
                            !form.watch("c_esign") ||
                            !form.watch("c_cardTerms") ||
                            !form.watch("c_certify") ||
                            !form.watch("c_spendCard")
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: "#4A93DB",
                            opacity:
                              !form.watch("c_esign") ||
                              !form.watch("c_cardTerms") ||
                              !form.watch("c_certify") ||
                              !form.watch("c_spendCard")
                                ? 0.5
                                : 1,
                          }}
                        >
                          BUY NOW · $
                          {(
                            (cardPrice +
                              (Number(form.watch("customCost")) || 0)) *
                            quantity
                          ).toFixed(2)}
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-dark-text-300 w-full rounded-2xl border border-[#E1E5EB] bg-[#FBFBFB] py-3 text-xs"
                        >
                          Please kindly read the fees and terms before
                          purchasing card
                        </button>
                      </div>
                    </Form>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePlatinumCard;
