import { Download, Search } from "lucide-react";
import { DataTable } from "../_misc/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAdminStats,
  useGetAllDeposits,
  useGetCardTransactionsAdmin,
} from "@/hooks/use-queries";
import { allTransactionsColumn } from "./_misc/allTransactionColumn";
import LineLoader from "@/components/line-loader";
import { useState, useEffect } from "react";
import { downloadCSV } from "@/lib/helper";
import { cardWithdrawalColumn } from "./_misc/cardColumn";
import { formatAmount } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

const tabToTypeMap: Record<string, string> = {
  "all-transactions": "all",
  "wallet-deposit": "deposit",
  "wallet-withdraw": "withdrawal",
  "card-top-up": "card-topup",
  "card-withdrawal": "card-withdrawal",
  "card-withdraw": "Consumption",
};
const TransactionsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all-transactions");
  const deboucedSearchTerm = useDebounce(searchTerm, 500);
  const [filteredCardTransactions, setFilteredCardTransactions] = useState([]);
  const [paginationParams, setPaginationParams] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(1);
  const {
    data: allTransactions,
    isFetching: isLoading,
    refetch,
  } = useGetAllDeposits({
    page: paginationParams.pageIndex,
    limit: paginationParams.pageSize,
    search: deboucedSearchTerm,
    ...(currentTab !== "all-transactions" &&
      currentTab !== "card-withdraw" && {
        type: tabToTypeMap[currentTab],
      }),
  });

  const {
    data: cardTransactions,
    isLoading: isLoadingCards,
    refetch: refetchCardTransactions,
  } = useGetCardTransactionsAdmin({
    page: paginationParams.pageIndex,
    limit: paginationParams.pageSize,
    ...(currentTab === "card-withdraw" && {
      type: tabToTypeMap[currentTab],
    }),
  });
  const { data: adminStats } = useGetAdminStats();

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setPaginationParams({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  useEffect(() => {
    if (currentTab !== "card-withdraw") {
      setPageCount(allTransactions?.totalPages || 1);
    }
  }, [allTransactions, currentTab]);

  useEffect(() => {
    if (currentTab === "card-withdraw") {
      refetchCardTransactions();
    } else {
      refetch();
    }
  }, [currentTab]);

  useEffect(() => {
    setFilteredCardTransactions(cardTransactions?.data?.data);
    if (currentTab === "card-withdraw") {
      const total = cardTransactions?.data?.total || 0;
      setPageCount(Math.ceil(total / paginationParams.pageSize) || 1);
    }
  }, [cardTransactions, currentTab, paginationParams.pageSize]);

  useEffect(() => {
    if (currentTab === "card-withdraw") {
      if (searchTerm.trim() === "") {
        setFilteredCardTransactions(cardTransactions?.data?.data);
        setPaginationParams(() => ({
          pageSize: 10,
          pageIndex: 0,
        }));
        return;
      } else {
        setPaginationParams(() => ({
          pageSize: 100,
          pageIndex: 0,
        }));

        setFilteredCardTransactions(
          cardTransactions?.data?.data?.filter((transaction: CardTransaction) =>
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        );
      }
    }
  }, [searchTerm]);

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

        {/* Withdrawal Stats */}
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

      <Tabs
        className="mt-8"
        defaultValue="all-transactions"
        onValueChange={handleTabChange}
      >
        <div className="mt-4 flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <TabsList className="no-scrollbar max-w-full justify-start overflow-x-auto">
            <TabsTrigger value="all-transactions">All Transactions</TabsTrigger>
            <TabsTrigger value="wallet-deposit">Wallet Deposit</TabsTrigger>
            <TabsTrigger value="wallet-withdraw">Wallet Withdrawal</TabsTrigger>
            <TabsTrigger value="card-top-up">Card TopUp</TabsTrigger>
            <TabsTrigger value="card-withdrawal">Card Withdrawal</TabsTrigger>
            <TabsTrigger value="card-withdraw">Card Purchases</TabsTrigger>
          </TabsList>
          <div className="flex gap-4">
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
              onClick={() => downloadCSV(allTransactions.data, "Transactions")}
              className={"flex h-auto shrink-0 items-center gap-2 rounded-lg py-2.5"}
            >
              <Download size={15} />
              <span>Download (CSV)</span>
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <TabsContent value="all-transactions">
            {isLoading ? (
              <div className="h-1">
                <LineLoader />
              </div>
            ) : (
              <DataTable
                columns={allTransactionsColumn}
                data={allTransactions?.data ?? []}
                pagination={paginationParams}
                setPagination={setPaginationParams}
                pageCount={pageCount}
              />
            )}
          </TabsContent>
          <TabsContent value="wallet-deposit">
            {isLoading ? (
              <div className="h-1">
                <LineLoader />
              </div>
            ) : (
              <DataTable
                columns={allTransactionsColumn}
                data={allTransactions?.data ?? []}
                pagination={paginationParams}
                setPagination={setPaginationParams}
                pageCount={pageCount}
              />
            )}
          </TabsContent>
          <TabsContent value="wallet-withdraw">
            {isLoading ? (
              <div className="h-1">
                <LineLoader />
              </div>
            ) : (
              <DataTable
                columns={allTransactionsColumn}
                data={allTransactions?.data ?? []}
                pagination={paginationParams}
                setPagination={setPaginationParams}
                pageCount={pageCount}
              />
            )}
          </TabsContent>
          <TabsContent value="card-top-up">
            {isLoading ? (
              <div className="h-1">
                <LineLoader />
              </div>
            ) : (
              <DataTable
                columns={allTransactionsColumn}
                data={allTransactions?.data ?? []}
                pagination={paginationParams}
                setPagination={setPaginationParams}
                pageCount={pageCount}
              />
            )}
          </TabsContent>
          <TabsContent value="card-withdrawal">
            {isLoading ? (
              <div className="h-1">
                <LineLoader />
              </div>
            ) : (
              <DataTable
                columns={allTransactionsColumn}
                data={allTransactions?.data ?? []}
                pagination={paginationParams}
                setPagination={setPaginationParams}
                pageCount={pageCount}
              />
            )}
          </TabsContent>
          <TabsContent value="card-withdraw">
            {isLoadingCards ? (
              <div className="h-1">
                <LineLoader />
              </div>
            ) : (
              <DataTable
                columns={cardWithdrawalColumn}
                data={filteredCardTransactions ?? []}
                pagination={paginationParams}
                setPagination={setPaginationParams}
                pageCount={pageCount}
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TransactionsAdmin;
