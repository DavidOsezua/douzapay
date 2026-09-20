import { Clock, Download, Wallet } from "lucide-react";
import { DataTable } from "../_misc/data-table";
import { settlementColumns } from "./_misc/column";
import { Button } from "@/components/ui/button";
import {
  useGetMerchant,
  useGetMerchantStats,
  useGetSettlements,
  useGetUser,
} from "@/hooks/use-queries";
import { useEffect, useState } from "react";
import LineLoader from "@/components/line-loader";
import { downloadCSV } from "@/lib/helper";
import { useDebounce } from "@/hooks/use-debounce";
import { formatAmount, getDayDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSheetStore } from "@/zustand/settlementSheetStore";

const Settlements = () => {
  const { openSheet } = useSheetStore();
  const [cardFilter, setCardFilter] = useState<"total" | "pending" | "paid">(
    "total",
  );
  const [depositFilter, setDepositFilter] = useState<
    "total" | "pending" | "paid"
  >("total");
  const [withdrawalFilter, setWithdrawalFilter] = useState<
    "total" | "pending" | "paid"
  >("total");
  const [referralFilter, setReferralFilter] = useState<
    "total" | "pending" | "paid"
  >("total");
  const [searchTerm] = useState("");
  const deboucedSearchTerm = useDebounce(searchTerm, 500);
  const [paginationParams, setPaginationParams] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data: user } = useGetUser();
  const [pageCount, setPageCount] = useState(1);
  const [allSettlements, setAllSettlements] = useState<Settlement[]>([]);

  const { data: merchantStats } = useGetMerchantStats();
  const { data: settlements, isLoading } = useGetSettlements({
    page: paginationParams.pageIndex,
    limit: paginationParams.pageSize,
    search: deboucedSearchTerm,
  });
  const { data: merchant } = useGetMerchant({ id: user?.whiteLabelId || "" });

  useEffect(() => {
    setPageCount(settlements?.totalPages || 1);
    setAllSettlements(() => [
      {
        id: "p3nd1ng",
        depositFee: merchant?.pendingDepositEarnings || 0,
        withdrawalFee: merchant?.pendingWithdrawalEarnings || 0,
        cardCreationFee: merchant?.pendingCardCreationEarnings || 0,
        referralFee: merchant?.pendingReferralCommissions || 0,
        status: "Pending",
        transactionHash: "pending",
        createdAt: getDayDate(merchant?.payoutDay || "Sunday"),
      } as unknown as Settlement,
      ...(settlements?.data || []),
    ]);
  }, [settlements, merchant]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        {/* Deposit */}
        <div className="text-primary-500 flex min-w-[220px] grow flex-col justify-between rounded-lg bg-white px-4 py-2.5 lg:grow-0">
          <div className="flex items-center justify-between">
            <span className="text-primary-500 text-sm font-semibold">
              Deposit Fees
            </span>
            <Select
              value={depositFilter}
              onValueChange={(v) =>
                setDepositFilter(v as "total" | "pending" | "paid")
              }
            >
              <SelectTrigger className="size-fit !h-6 items-center border-0 p-0 shadow-none [&_svg]:mt-0.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="total">Total</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <div className="text-xl font-semibold">
              <span className="text-black/30">$</span>
              {formatAmount(merchantStats?.deposit[depositFilter])}
            </div>
            <div className="rounded-full bg-[#F0F2FF] px-1 py-px text-[10px] text-[#4C7FE7] capitalize">
              {depositFilter}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-6 text-xs">
            <div>
              <p className="text-primary-500/40 font-semibold">Total Fees</p>
              <p className="font-bold">
                ${formatAmount(merchantStats?.deposit.total)}
              </p>
            </div>
            <div>
              <p className="text-primary-500/40 font-semibold">Paid Fees</p>
              <p className="text-primary-green font-bold">
                ${formatAmount(merchantStats?.deposit.paid)}
              </p>
            </div>
            <div>
              <p className="text-primary-500/40 font-semibold">Unpaid Fees</p>
              <p className="text-primary-brown font-bold">
                ${formatAmount(merchantStats?.deposit.pending)}
              </p>
            </div>
          </div>
        </div>

        {/* Withdrawal */}
        <div className="text-primary-500 flex min-w-[220px] grow flex-col justify-between rounded-lg bg-white px-4 py-2.5 lg:grow-0">
          <div className="flex items-center justify-between">
            <span className="text-primary-500 text-sm font-semibold">
              Withdrawal Fees
            </span>
            <Select
              defaultValue={withdrawalFilter}
              onValueChange={(v) =>
                setWithdrawalFilter(v as "total" | "pending" | "paid")
              }
            >
              <SelectTrigger className="size-fit !h-6 items-center border-0 p-0 shadow-none [&_svg]:mt-0.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="total">Total</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <div className="text-xl font-semibold">
              <span className="text-black/30">$</span>
              {formatAmount(merchantStats?.withdrawal[withdrawalFilter])}
            </div>
            <div className="rounded-full bg-[#F0F2FF] px-1 py-px text-[10px] text-[#4C7FE7] capitalize">
              {withdrawalFilter}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-6 text-xs">
            <div>
              <p className="text-primary-500/40 font-semibold">Total Fees</p>
              <p className="font-bold">
                ${formatAmount(merchantStats?.withdrawal.total)}
              </p>
            </div>
            <div>
              <p className="text-primary-500/40 font-semibold">Paid Fees</p>
              <p className="text-primary-green font-bold">
                ${formatAmount(merchantStats?.withdrawal.paid)}
              </p>
            </div>
            <div>
              <p className="text-primary-500/40 font-semibold">Unpaid Fees</p>
              <p className="text-primary-brown font-bold">
                ${formatAmount(merchantStats?.withdrawal.pending)}
              </p>
            </div>
          </div>
        </div>

        {/* card purchase */}
        <div className="text-primary-500 flex min-w-[220px] grow flex-col justify-between rounded-lg bg-white px-4 py-2.5 lg:grow-0">
          <div className="flex items-center justify-between">
            <span className="text-primary-500 text-sm font-semibold">
              Card Purchase Fees
            </span>
            <Select
              defaultValue={cardFilter}
              onValueChange={(v) =>
                setCardFilter(v as "total" | "pending" | "paid")
              }
            >
              <SelectTrigger className="size-fit !h-6 items-center border-0 p-0 shadow-none [&_svg]:mt-0.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="total">Total</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <div className="text-xl font-semibold">
              <span className="text-black/30">$</span>
              {formatAmount(merchantStats?.cardCreation[cardFilter])}
            </div>
            <div className="rounded-full bg-[#F0F2FF] px-1 py-px text-[10px] text-[#4C7FE7] capitalize">
              {cardFilter}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-6 text-xs">
            <div>
              <p className="text-primary-500/40 font-semibold">Total Fees</p>
              <p className="font-bold">
                ${formatAmount(merchantStats?.cardCreation.total)}
              </p>
            </div>
            <div>
              <p className="text-primary-500/40 font-semibold">Paid Fees</p>
              <p className="text-primary-green font-bold">
                ${formatAmount(merchantStats?.cardCreation.paid)}
              </p>
            </div>
            <div>
              <p className="text-primary-500/40 font-semibold">Unpaid Fees</p>
              <p className="text-primary-brown font-bold">
                ${formatAmount(merchantStats?.cardCreation.pending)}
              </p>
            </div>
          </div>
        </div>

        {/* Referrals earnings */}
        <div className="text-primary-500 flex min-w-[220px] grow flex-col justify-between rounded-lg bg-white px-4 py-2.5 lg:grow-0">
          <div className="flex items-center justify-between">
            <span className="text-primary-500 text-sm font-semibold">
              Referrals Earnings
            </span>
            <Select
              defaultValue={referralFilter}
              onValueChange={(v) =>
                setReferralFilter(v as "total" | "pending" | "paid")
              }
            >
              <SelectTrigger className="size-fit !h-6 items-center border-0 p-0 shadow-none [&_svg]:mt-0.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="total">Total</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <div className="text-xl font-semibold">
              <span className="text-black/30">$</span>
              {formatAmount(merchantStats?.referral[referralFilter])}
            </div>
            <div className="rounded-full bg-[#F0F2FF] px-1 py-px text-[10px] text-[#4C7FE7] capitalize">
              {referralFilter}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-6 text-xs">
            <div>
              <p className="text-primary-500/40 font-semibold">Total Fees</p>
              <p className="font-bold">
                ${formatAmount(merchantStats?.referral.total)}
              </p>
            </div>
            <div>
              <p className="text-primary-500/40 font-semibold">Paid Fees</p>
              <p className="text-primary-green font-bold">
                ${formatAmount(merchantStats?.referral.paid)}
              </p>
            </div>
            <div>
              <p className="text-primary-500/40 font-semibold">Unpaid Fees</p>
              <p className="text-primary-brown font-bold">
                ${formatAmount(merchantStats?.referral.pending)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-primary-500 text-lg font-semibold">
            Payment History
          </p>
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-[#ECFAFF] px-4 py-2">
            <span>
              <Clock size={15} />
            </span>
            <span>Next Settlement:</span>
            <div className="font-semibold">
              {merchant?.payoutDay || "Sunday"}{" "}
              {getDayDate(merchant?.payoutDay || "Sunday")}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => openSheet("whitelist-wallet", null, {})}
            className={"flex shrink-0 items-center gap-2 rounded-lg"}
          >
            <Wallet size={15} />
            <span>Whitelist Wallet</span>
          </Button>
          <Button
            onClick={() => downloadCSV(settlements?.data, "merchants")}
            className={"flex shrink-0 items-center gap-2 rounded-lg"}
          >
            <Download size={15} />
            <span>Download (CSV)</span>
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="h-1">
            <LineLoader />
          </div>
        ) : (
          <DataTable
            columns={settlementColumns}
            data={allSettlements || []}
            pagination={paginationParams}
            setPagination={setPaginationParams}
            pageCount={pageCount}
          />
        )}
      </div>
    </div>
  );
};

export default Settlements;
