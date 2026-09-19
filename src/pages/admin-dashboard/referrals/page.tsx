import { Download, Search } from "lucide-react";
import { DataTable } from "../_misc/data-table";
import { Button } from "@/components/ui/button";
import { useGetAdminStats, useGetReferrals } from "@/hooks/use-queries";
import { referralColumn } from "./_misc/columns";
import LineLoader from "@/components/line-loader";
import { useState, useEffect } from "react";
import { downloadCSV } from "@/lib/helper";
import { formatAmount } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

const Referrals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const deboucedSearchTerm = useDebounce(searchTerm, 500);
  const [paginationParams, setPaginationParams] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(1);
  const { data: referrals, isLoading } = useGetReferrals({
    page: paginationParams.pageIndex,
    limit: paginationParams.pageSize,
    search: deboucedSearchTerm,
  });

  const { data: adminStats } = useGetAdminStats();

  useEffect(() => {
    setPageCount(referrals?.totalPages || 1);
  }, [referrals]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        {/* Deposit Stats */}
        <div className="text-primary-500 flex min-w-[220px] grow flex-col justify-between gap-4 rounded-lg bg-white px-4 py-2.5 lg:grow-0">
          <div className="flex items-center justify-between">
            <img
              className="size-12"
              src="/icons/deposit-admin.svg"
              alt="master wallet icon"
            />
            <div className="flex flex-col items-end justify-between gap-2">
              <span className="leading-4 font-semibold">Deposit</span>
              <span className="text-2xl leading-4 font-medium">
                $
                {formatAmount(
                  adminStats?.stats.deposit?.completed?.totalAmount,
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div>
              <p className="text-primary-green font-semibold">Available</p>
              <p className="font-bold">
                {adminStats?.stats.deposit?.completed?.count}
              </p>
            </div>
            <div>
              <p className="text-primary-brown font-semibold">Pending</p>
              <p className="font-bold">
                {adminStats?.stats.deposit?.pending?.count}
              </p>
            </div>
            <div>
              <p className="text-primary-red font-semibold">Pending</p>
              <p className="font-bold">
                {adminStats?.stats.deposit?.failed?.count ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Withdrawals Stats */}
        <div className="text-primary-500 flex min-w-[220px] grow flex-col justify-between gap-4 rounded-lg bg-white px-4 py-2.5 lg:grow-0">
          <div className="flex items-center justify-between">
            <img
              className="size-12"
              src="/icons/withdrawal-admin.svg"
              alt="shaded user icon"
            />
            <div className="flex flex-col items-end justify-between gap-2">
              <span className="leading-4 font-semibold">Withdrawals</span>
              <span className="text-2xl leading-4 font-medium">
                $
                {formatAmount(
                  adminStats?.stats.withdrawal?.completed?.totalAmount,
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-6 text-xs">
            <div>
              <p className="text-primary-green font-semibold">Successful</p>
              <p className="font-bold">
                {adminStats?.stats.withdrawal?.completed?.count ?? 0}
              </p>
            </div>
            <div>
              <p className="text-primary-brown font-semibold">Pending</p>
              <p className="font-bold">
                {adminStats?.stats.withdrawal?.pending?.count ?? 0}
              </p>
            </div>
            <div>
              <p className="text-primary-red font-semibold">Failed</p>
              <p className="font-bold">
                {adminStats?.stats.withdrawal?.failed?.count ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Total Fees */}
        <div className="text-primary-500 flex min-w-[220px] grow flex-col justify-between gap-4 rounded-lg bg-white px-4 py-2.5 lg:grow-0">
          <div className="flex items-center justify-between">
            <img
              className="size-12 -scale-100"
              src="/icons/withdrawal-admin.svg"
              alt="shaded user icon"
            />
            <div className="flex flex-col items-end justify-between gap-2">
              <span className="leading-4 font-semibold">Total Fees</span>
              <span className="text-2xl leading-4 font-medium">
                $
                {formatAmount(
                  adminStats?.stats["referral-reward"]?.totalAmount,
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-6 text-xs">
            <div>
              <p className="text-primary-green font-semibold">Available Fee</p>
              <p className="font-bold">
                {adminStats?.stats.withdrawal?.completed?.count || 0}
              </p>
            </div>

            <div>
              <p className="text-primary-red font-semibold">Withdrawn</p>
              <p className="font-bold">
                {adminStats?.stats.withdrawal?.failed?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex w-full justify-end gap-4">
        <div className="flex grow gap-4 md:grow-0">
          <div className="flex grow md:grow-0">
            <div className="relative grow rounded-md bg-white md:grow-0">
              <Search className="text-primary-50 absolute top-1/2 left-3 size-3 -translate-y-1/2" />
              <input
                type="search"
                className="h-full w-full rounded-md bg-white pl-8 placeholder:leading-3 md:w-auto"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={() => downloadCSV(referrals.data, "Transactions")}
            className={"flex h-auto shrink-0 items-center gap-2 rounded-lg py-2.5"}
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
            columns={referralColumn}
            data={referrals?.data ?? []}
            pagination={paginationParams}
            setPagination={setPaginationParams}
            pageCount={pageCount}
          />
        )}
      </div>
    </div>
  );
};

export default Referrals;
