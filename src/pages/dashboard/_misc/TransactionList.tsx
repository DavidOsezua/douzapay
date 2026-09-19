import moment from "moment";
import TransactionCardSkeleton from "@/components/skeletons/transaction-card-skeleton";
import { useSheetStore } from "@/zustand/sheetStore";
import Pagination from "@/components/pagination";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";
import {
  CARD_TRANSACTION_LABELS,
  formatAmount,
  getCardTransactionDisplayAmount,
  getCardTransactionSign,
  getTransactionStatusMeta,
  type TransactionStatusKey,
} from "@/lib/utils";

const tabToTypeMap: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
  "card-topup": "Card Topup",
  "card-withdrawal": "Card Withdrawal",
  "card-creation": "Card Creation",
  "referral-reward": "Referral Reward",
};

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const formatAmount = useFormatAmountWithCurrency();
  const sign = transaction.type === "deposit" ? "+" : "-";
  const { openSheet } = useSheetStore();
  return (
    <div
      onClick={() =>
        openSheet("transaction-details", null, {
          transactionData: transaction,
          type: "wallet",
        })
      }
      className="text-white border-dark-stroke-4 bg-dark-card-3 space-y-1 rounded-lg border p-3"
    >
      <div className="flex items-center justify-between text-sm">
        <span>{transaction.currency || "USD"}</span>
        <div>
          {sign}
          {formatAmount(transaction.amount)}
        </div>
      </div>
      <div className="text-white flex items-center justify-between text-[10px]">
        <span>{moment(transaction.createdAt).format("DD-MM-YY hh:mm A")}</span>
        <span>{tabToTypeMap[transaction?.type]}</span>
      </div>
      <div className="text-white flex items-center justify-between text-[10px]">
        <span>Id: {transaction?.id}</span>
        <StatusBadge status={transaction.status} />
      </div>
    </div>
  );
};

const CardTransactionCard = ({
  transaction,
}: {
  transaction: CardTransaction;
}) => {
  const { openSheet } = useSheetStore();
  const { amount: displayAmount, currency: displayCurrency } =
    getCardTransactionDisplayAmount(transaction);
  const sign = getCardTransactionSign(
    transaction.type,
    displayAmount,
    transaction.status,
  );

  return (
    <div
      onClick={() =>
        openSheet("transaction-details", null, {
          transactionData: transaction,
          type: "card",
        })
      }
      className="border-dark-stroke-4 bg-dark-card-3 text-white space-y-1 rounded-lg border p-3"
    >
      <div className="flex items-center justify-between text-sm">
        <span>
          {transaction.merchantName ||
            CARD_TRANSACTION_LABELS[transaction.type] ||
            transaction.type}
        </span>

        <div>
          {sign}
          {formatAmount(displayAmount)} {displayCurrency?.toUpperCase()}
        </div>
      </div>
      <div className="text-white flex items-center justify-between text-[10px]">
        <span>{moment(transaction.transactionTime).format("DD-MM-YY hh:mm A")}</span>
        <StatusBadge status={transaction.status} />
      </div>
    </div>
  );
};

const TransactionList = ({
  transactions,
  isLoading = false,
  type = "wallets",
  handlePageChange,
  totalPages,
  currentPage,
}: {
  transactions: Transaction[] | CardTransaction[];
  isLoading?: boolean;
  type?: "wallets" | "cards";
  handlePageChange?: (page: number) => void;
  totalPages?: number;
  currentPage?: number;
}) => {
  if (isLoading)
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <TransactionCardSkeleton key={index} />
        ))}
      </div>
    );

  if (transactions.length === 0)
    return (
      <div>
        <div className="py-20">
          <p className="text-white text-center">No transactions yet</p>
        </div>
      </div>
    );
  return (
    <div>
      <div className="space-y-4">
        {transactions.map((transaction) => {
          if (type === "wallets")
            return (
              <TransactionCard
                transaction={transaction as Transaction}
                key={transaction?.id}
              />
            );

          if (type === "cards")
            return (
              <CardTransactionCard
                transaction={transaction as CardTransaction}
                key={transaction?.id}
              />
            );
        })}
      </div>

      {(totalPages ?? 0) > 1 && (
        <Pagination
          currentPage={currentPage ?? 1}
          totalPages={totalPages ?? 1}
          onPageChange={handlePageChange as (page: number) => void}
        />
      )}
    </div>
  );
};

interface StatusBadgeProps {
  status?: string | null;
}

const statusStyles: Record<
  TransactionStatusKey,
  { bg: string; textColor: string }
> = {
  closed: { bg: "bg-[#9CA3AF]", textColor: "text-[#9CA3AF]" },
  pending: { bg: "bg-[#FFD25A]", textColor: "text-[#FFD25A]" },
  completed: { bg: "bg-[#9BFFB7]", textColor: "text-[#9BFFB7]" },
  failed: { bg: "bg-red-800", textColor: "text-red-800" },
  rejected: { bg: "bg-red-100", textColor: "text-red-800" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { key, label } = getTransactionStatusMeta(status);
  const { bg, textColor } = statusStyles[key];

  return (
    <span
      className={`inline-flex items-center rounded-full py-1 text-[10px] ${textColor}`}
    >
      <span className={`mr-1 size-1 rounded-full ${bg}`} />
      {label}
    </span>
  );
};

export default TransactionList;
