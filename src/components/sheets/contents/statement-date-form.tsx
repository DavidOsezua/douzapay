import { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Card from "@/components/card";
import { Button } from "@/components/ui/button";
import { useGetUser, useGetUserAssets } from "@/hooks/use-queries";
import { useDownloadStatement } from "@/hooks/use-mutations";
import { useModalStore } from "@/zustand/modalStore";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";
import StatementCalendarField from "./statement-calendar-field";

// A statement can take a while to generate on the backend. Once the request
// has been pending this long, swap the button for a reassurance message so
// the user isn't left staring at a stuck spinner.
const SLOW_REQUEST_MS = 10000;

const StatementDateForm = ({
  mode,
  card,
  setStep,
  closeSheet,
}: {
  mode: "wallet" | "card";
  card?: Card;
  setStep?: (n: number) => void;
  closeSheet: () => void;
}) => {
  const { data: user } = useGetUser();
  const { data: userAssets } = useGetUserAssets();
  const formatAmount = useFormatAmountWithCurrency();
  const { openModal } = useModalStore();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openField, setOpenField] = useState<"start" | "end" | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [isSlow, setIsSlow] = useState(false);

  const walletBalance = (userAssets ?? []).reduce(
    (sum: number, a) => sum + Number(a.balance),
    0,
  );

  const today = moment().format("YYYY-MM-DD");
  const rawMin = mode === "wallet" ? user?.createdAt : card?.createTime;
  const minDate =
    rawMin && moment(rawMin).isValid()
      ? moment(rawMin).format("YYYY-MM-DD")
      : undefined;
  const minLabel =
    mode === "wallet"
      ? "your account creation date"
      : "the card's creation date";

  // `minDate` arrives late in wallet mode (useGetUser is async). Drop any
  // selection that the lower bound invalidates once it resolves.
  useEffect(() => {
    if (!minDate) return;
    setStartDate((s) => (s && s < minDate ? "" : s));
    setEndDate((e) => (e && e < minDate ? "" : e));
  }, [minDate]);

  const { mutate, isPending } = useDownloadStatement({
    onSuccess: () => {
      closeSheet();
      openModal("success", { type: "statement" });
    },
  });

  useEffect(() => {
    if (!isPending) {
      setIsSlow(false);
      return;
    }
    const timer = setTimeout(() => setIsSlow(true), SLOW_REQUEST_MS);
    return () => clearTimeout(timer);
  }, [isPending]);

  const handleStartChange = (value: string) => {
    setStartDate(value);
    if (endDate && endDate < value) setEndDate("");
  };

  const handleSubmit = () => {
    if (!startDate) return toast.error("Select a start date");
    if (!endDate) return toast.error("Select an end date");
    if (minDate && startDate < minDate)
      return toast.error(`Start date cannot be earlier than ${minLabel}`);
    if (endDate > today)
      return toast.error("End date cannot be later than today");
    if (endDate < startDate)
      return toast.error("End date cannot be earlier than start date");

    const scope = mode === "card" && card ? `Card ${card.last4}` : "Wallet";
    const filename = `Duozapay ${scope} Statement ${startDate} to ${endDate}.pdf`;

    mutate({
      ...(mode === "card" && card ? { cardId: card.id } : {}),
      startDate,
      endDate,
      filename,
    });
  };

  return (
    <div className="mt-4">
      {mode === "card" && card && (
        <div className="mb-6 flex flex-col items-center">
          <Card card={card} showCta={false} />
          {setStep && (
            <button
              onClick={() => setStep(1)}
              className="text-dark-primary-main mt-2 text-xs"
            >
              Change card
            </button>
          )}
        </div>
      )}

      {mode === "wallet" && (
        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm opacity-70">Wallet balance</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-white/40"
            >
              {showBalance ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <p className="mt-1 text-2xl font-medium">
            {showBalance ? formatAmount(walletBalance) : "••••••"}
          </p>
        </div>
      )}

      {minDate && (
        <p className="mb-4 text-xs font-light text-white/50">
          Your {mode === "card" ? "card" : "wallet"} statements are available
          from {moment(minDate).format("DD MMM YYYY")}.
        </p>
      )}

      <div className="flex flex-col gap-4">
        <StatementCalendarField
          label="Start Date"
          value={startDate}
          onChange={handleStartChange}
          min={minDate}
          max={endDate || today}
          disabled={mode === "wallet" && !user}
          open={openField === "start"}
          onOpenChange={(o) => setOpenField(o ? "start" : null)}
        />

        <StatementCalendarField
          label="End Date"
          value={endDate}
          onChange={setEndDate}
          min={startDate || minDate}
          max={today}
          disabled={mode === "wallet" && !user}
          open={openField === "end"}
          onOpenChange={(o) => setOpenField(o ? "end" : null)}
        />
      </div>

      <div className="sticky right-0 bottom-0 left-0 z-20 mt-8 bg-dark-background-secondary px-0 pt-3 pb-6">
        {isSlow ? (
          <p className="text-center text-sm font-light text-white/70">
            Your {mode === "card" ? "card" : "wallet"} statement is being
            prepared. You can continue using the app while we generate it.
            We&apos;ll notify you when your statement is ready.
          </p>
        ) : (
          <Button
            isLoading={isPending}
            onClick={handleSubmit}
            disabled={
              isPending ||
              !startDate ||
              !endDate ||
              (mode === "wallet" && !user)
            }
            className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 h-11 w-full rounded-md"
          >
            {mode === "card"
              ? "Download card statement"
              : "Download wallet statement"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StatementDateForm;
