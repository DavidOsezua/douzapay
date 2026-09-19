import { useAdminModals } from "@/zustand/store";
import { useGetCardInfoAdmin } from "@/hooks/use-queries";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";

const CardDetails = () => {
  const { cardDetailsData: details } = useAdminModals();
  const { data: cardDetails, isLoading: isLoadingDetails } =
    useGetCardInfoAdmin(details!.id!);

  // The card-info endpoint returns one of two shapes depending on the card
  // provider: a flat `cardBalance` + `cardCurrency` pair, or an `amount` +
  // `currency` pair. Both carry the current balance directly.
  const info = cardDetails?.data;
  const cardBalance =
    info?.cardBalance ??
    (info?.amount != null ? Number(info.amount) : undefined);
  const cardCurrency = info?.cardCurrency ?? info?.currency;

  // Address comes back as flat `billing*` fields (and a `billingAddress` that is
  // the street line, not an object). Some providers omit it entirely — drop the
  // empty parts rather than render "undefined, undefined, …".
  const cardAddress =
    [
      info?.billingAddress?.addressLine1 ?? info?.billingAddress,
      info?.billingAddress?.city ?? info?.billingCity,
      info?.billingAddress?.state ?? info?.billingState,
      info?.billingAddress?.postalCode ?? info?.billingPostalCode,
      info?.billingAddress?.country ?? info?.billingCountry,
    ]
      .filter(
        (p: unknown): p is string => typeof p === "string" && p.trim() !== "",
      )
      .join(", ") || "-";

  // Creation timestamp: the flat response calls it `createdAt`, the table row
  // calls it `createTime` (and some rows `createdAt`). `transactionTime` is the
  // last resort — it's the tx that surfaced the card, not its creation.
  const createdAt =
    info?.createdAt ??
    details?.createTime ??
    (details as { createdAt?: string } | null)?.createdAt ??
    details?.transactionTime;

  // Prefer the provider's pre-masked PAN; else mask whatever card number we
  // have; else the table row's last 4.
  const rawCardNo = String(info?.cardNo ?? "");
  const cardNumber =
    info?.maskCardNo ??
    (rawCardNo.length >= 4
      ? `**** **** **** ${rawCardNo.slice(-4)}`
      : details?.last4
        ? `**** **** **** ${details.last4}`
        : "-");

  const userName =
    [
      details?.firstName ?? info?.firstName,
      details?.lastName ?? info?.lastName,
    ]
      .filter(Boolean)
      .join(" ") || "-";

  const userEmail = details?.userEmail || info?.email || "-";

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
        className="relative h-auto rounded-lg bg-white px-6 py-6 lg:w-120"
      >
        <button
          onClick={() => {
            useAdminModals.setState({
              cardDetailsData: null,
              cardDetailsIsOpen: false,
            });
          }}
          className="hover:text-primary-500 text-primary-500 absolute top-4 right-4"
        >
          <X className="size-5" />
        </button>
        <h2 className="text-xl font-semibold">Card Details</h2>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="flex flex-col">
            <span className="text-xs font-medium">Date & Time</span>
            {isLoadingDetails ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <span className="text-sm">
                {createdAt
                  ? moment(createdAt).format("MMM Do, YYYY hh:mm A")
                  : "-"}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">Card Number</span>
            {isLoadingDetails ? (
              <Skeleton className="h-4 w-36" />
            ) : (
              <span className="text-sm">{cardNumber}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">User Name</span>
            <span className="text-sm">{userName}</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-xs font-medium`}>Card Balance</span>
            {isLoadingDetails ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className="text-sm">
                {cardBalance ?? "-"} {cardCurrency}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className={`text-xs font-medium`}>User Email</span>
            <span className="text-sm">{userEmail}</span>
          </div>

          <div className="flex flex-col">
            <span className={`text-xs font-medium`}>Card Address</span>
            {isLoadingDetails ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              <span className="text-sm">{cardAddress}</span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CardDetails;
