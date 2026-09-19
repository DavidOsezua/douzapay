import moment from "moment";
import Copy from "../../copy";
import { StatusBadge } from "@/pages/dashboard/_misc/columns";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/zustand/sheetStore";
import { useGetBIN, useGetRate } from "@/hooks/use-queries";
import TopupCountdown from "@/components/topup-countdown";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";
import { useUser } from "@/zustand/store";
import {
  CARD_TRANSACTION_LABELS,
  getCardTransactionDirection,
  getCardTransactionDisplayAmount,
  getCardTransactionSign,
} from "@/lib/utils";

// Heading tint only — the label comes from CARD_TRANSACTION_LABELS.
const cardTypeClassName: Record<string, string> = {
  auth: "text-[#FFE261]",
  Void: "text-[#FF6E7A]",
  void: "text-[#FF6E7A]",
};

const TransactionDetails = ({
  transactionData,
  type,
}: {
  transactionData: Transaction | CardTransaction;
  type: string;
}) => {
  const user = useUser((state) => state.user);
  const { openSheet } = useSheetStore();
  const walletTransaction = transactionData as Transaction & { binId?: string };
  const cardTransaction = transactionData as CardTransaction;
  const { data: binsData } = useGetBIN();
  const { data: rates } = useGetRate(user?.preferredCurrency || "USD");

  const formatAmount = useFormatAmountWithCurrency();

  const matchedBin = walletTransaction.binId
    ? (binsData as any[])?.find(
        (b: any) => String(b.id) === String(walletTransaction.binId),
      )
    : null;

  const txType = walletTransaction.type as WalletTxType;
  const isCardCreation = txType === "card-creation";
  const isOutgoing =
    txType === "withdrawal" ||
    txType === "card-creation" ||
    txType === "card-withdrawal";

  if (type == "wallet")
    return (
      <div>
        <div className="text-white mt-4 px-2">
          <div className="mt-4 space-y-2.5">
            <TransactionType type={txType} />
            <h5 className="text-2xl font-semibold">
              {formatAmount(walletTransaction.amount)}
            </h5>
          </div>

          <div className="mt-4 mb-10">
            <DetailRow label="Id" value={walletTransaction.id} />
            {txType === "card-topup" && (
              <DetailRow label="Type" value="Card Funding" />
            )}
            {!isCardCreation && txType !== "card-topup" && (
              <DetailRow
                label="Network"
                value={walletTransaction.network || "-"}
              />
            )}
            <DetailRow
              label="Amount"
              value={String(formatAmount(walletTransaction.amount || 0))}
            />
            {!isCardCreation && txType !== "card-topup" && (
              <DetailRow
                label={`Exchange rate`}
                value={`1 ${user?.preferredCurrency || "USD"} = ${parseFloat(rates?.rate).toFixed(2)} USDT`}
              />
            )}

            {txType === "card-topup" && matchedBin && (
              <>
                <DetailRow label="BIN" value={matchedBin.bin} />
                <DetailRow label="Card Type" value={matchedBin.network} />
              </>
            )}

            <DetailRow
              label={`Fee (${walletTransaction.feePercent || 0}%)`}
              value={formatAmount(walletTransaction.feeAmount || 0)}
            />
            {!isCardCreation &&
              txType !== "card-topup" &&
              (isOutgoing ? (
                <DetailRow
                  label="Amount Sent"
                  valueComponent={
                    <span className="text-[#FF6E7A]">
                      -{formatAmount(walletTransaction.amountReceived)}
                    </span>
                  }
                />
              ) : (
                <DetailRow
                  label="Amount Received"
                  valueComponent={
                    <span className="text-[#77FF9E]">
                      +{formatAmount(walletTransaction.amountReceived)}
                    </span>
                  }
                />
              ))}
            {!isCardCreation && txType !== "card-topup" && (
              <DetailRow
                label="Destination"
                copy
                value={walletTransaction.address || "-"}
              />
            )}
            {!isCardCreation && txType !== "card-topup" && (
              <DetailRow
                label="TxId"
                copy
                value={walletTransaction.transactionHash || "-"}
                valueComponent={
                  <div className="flex gap-4">
                    {walletTransaction.type !== "deposit" ||
                      (walletTransaction.type === "deposit" &&
                        walletTransaction.transactionHash !== null && (
                          <span className="">
                            {walletTransaction.transactionHash || "-"}
                          </span>
                        ))}
                    {walletTransaction.type === "deposit" &&
                      walletTransaction.status === "pending" &&
                      walletTransaction.transactionHash == null && (
                        <Button
                          onClick={() => {
                            openSheet("submitTxHash", null, {
                              depositOrderId: walletTransaction.id,
                            });
                          }}
                          className="text-white hover:text-primary-500 rounded-full text-xs hover:bg-[#ECFAFF]"
                          variant="outline"
                          size="sm"
                        >
                          Submit Transaction Hash
                        </Button>
                      )}
                  </div>
                }
              />
            )}
            <DetailRow label="Status" value={walletTransaction.status} />
            <DetailRow
              label="Date"
              value={moment(walletTransaction.createdAt).format(
                "DD MMM YYYY, hh:mm A",
              )}
            />
          </div>

          {txType === "card-topup" &&
            walletTransaction.status === "pending" && (
              <TopupCountdown
                createdAt={walletTransaction.createdAt}
                transactionId={walletTransaction.id}
                amount={walletTransaction.amount}
              />
            )}
        </div>
      </div>
    );

  const { amount: cardDisplayAmount, currency: cardDisplayCurrency } =
    getCardTransactionDisplayAmount(cardTransaction);
  const cardAmountText = `${cardDisplayAmount?.toFixed(2)} ${cardDisplayCurrency}`;
  const cardDirection = getCardTransactionDirection(cardTransaction.type);
  const cardSign = getCardTransactionSign(
    cardTransaction.type,
    cardDisplayAmount,
    cardTransaction.status,
  );

  return (
    <div>
      <div className="text-white mt-4 px-2">
        <div className="mt-4 space-y-2.5">
          <h3 className={cardTypeClassName[cardTransaction.type]}>
            {CARD_TRANSACTION_LABELS[cardTransaction.type] ||
              cardTransaction.type}
          </h3>
          <h5 className="text-2xl font-semibold">{cardAmountText}</h5>
        </div>

        <div className="mt-4 mb-10">
          <DetailRow label="Id" value={cardTransaction.transactionId || cardTransaction.id} />
          <DetailRow
            label="Type"
            value={
              CARD_TRANSACTION_LABELS[cardTransaction.type] ||
              cardTransaction.type
            }
          />
          <DetailRow label="Amount" value={cardAmountText} />
          {cardSign !== "" && (
            <DetailRow
              label={cardDirection === "in" ? "Amount Received" : "Amount Sent"}
              valueComponent={
                <span
                  className={
                    cardDirection === "in" ? "text-[#77FF9E]" : "text-[#FF6E7A]"
                  }
                >
                  {cardSign}
                  {cardAmountText}
                </span>
              }
            />
          )}

          <DetailRow
            label="Merchant"
            value={cardTransaction.merchantName || "-"}
          />
          <DetailRow label="Status" value={cardTransaction.status} />
          <DetailRow
            label="Date"
            value={moment(cardTransaction.transactionTime).format(
              "DD MMM YYYY, hh:mm A",
            )}
          />
        </div>
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value?: string | number;
  valueComponent?: React.ReactNode;
  copy?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  valueComponent,
  copy = false,
}) => {
  if (label === "Status")
    return (
      <div className="flex items-center justify-between border-black/10 pt-2 pb-2">
        <div className="text-xs capitalize">{label}</div>
        <StatusBadge
          status={value != null ? String(value) : undefined}
          className="bg-transparent !px-0"
        />
      </div>
    );
  return (
    <div className="flex items-center justify-between border-black/10 pt-2 pb-2">
      <div className="text-xs capitalize">{label}</div>
      <div className="flex items-center gap-2">
        {copy && value && value !== "-" && (
          <Copy
            icon="/icons/copy-light.svg"
            side="left"
            text={value as string}
          />
        )}
        <span className="max-w-70 text-right text-sm font-medium break-words capitalize">
          {valueComponent ? valueComponent : value}
        </span>
      </div>
    </div>
  );
};

type WalletTxType =
  | "deposit"
  | "withdrawal"
  | "transfer"
  | "card-topup"
  | "card-creation"
  | "card-withdrawal"
  | "referral-reward";

const typeMap: Record<WalletTxType, { title: string; icon: string }> = {
  deposit: {
    title: "Deposit",
    icon: "/icons/deposit.svg",
  },
  withdrawal: {
    title: "Withdrawal",
    icon: "/icons/withdrawal.svg",
  },
  transfer: {
    title: "Transfer",
    icon: "/icons/transfer.svg",
  },
  "card-topup": {
    title: "Card Topup",
    icon: "/icons/money-receive.svg",
  },
  "card-creation": {
    title: "Card Creation",
    icon: "/icons/card.svg",
  },
  "card-withdrawal": {
    title: "Card Withdrawal",
    icon: "/icons/money-send.svg",
  },
  "referral-reward": {
    title: "Referral Reward",
    icon: "/icons/referral.svg",
  },
};

const TransactionType = ({ type }: { type: WalletTxType }) => {
  const entry = typeMap[type];
  if (!entry) return null;
  return (
    <div className={`flex items-center gap-2`}>
      <div
        className="flex size-8 items-center justify-center rounded-full"
        style={{
          background:
            "linear-gradient(128.62deg, rgba(147,205,253,0.4) 11.02%, rgba(77,134,174,0.4) 93.11%)",
        }}
      >
        <img className="size-4" src={entry.icon} alt={entry.title} />
      </div>
      <span className="font-semibold uppercase">{entry.title}</span>
    </div>
  );
};

export default TransactionDetails;
