import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import PillTabsTrigger from "@/components/pill-tabs-trigger";
import { useEffect, useState } from "react";
import moment from "moment";
import { useTabParam } from "@/hooks/use-tab-param";
import { columns, typeMap } from "../_misc/columns";
import {
  useGetCardTransactions,
  useGetDeposits,
  useGetDepositsInfinite,
  useHasSwaps,
} from "@/hooks/use-queries";
import { useMediaQuery } from "@/hooks/use-media-query";
import TopBar from "@/components/topbar";
import { cardColumns } from "../_misc/cardColumns";
import TransactionList from "../_misc/TransactionList";
import SwapTab from "../_misc/swap/swap-tab";
import TransactionFilters from "../_misc/transaction-filters";
import { defaultTransactionFilters } from "../_misc/filter-helpers";

const PAGE_SIZE = 10;

// The only types /users/deposits can filter by; the list itself returns more.
const walletFilterTypes = ["deposit", "withdrawal", "card-topup"] as const;

const walletTypeOptions = walletFilterTypes.map((value) => ({
  value,
  label: typeMap[value].title,
}));

// Card transactions are filtered in the browser, so these mirror the raw
// `type` values (labels as in the table) and status spellings the API returns.
const cardTypeOptions = [
  { value: "TransferIn", label: "Card Deposit" },
  { value: "TransferOut", label: "Card Withdrawal" },
  { value: "Consumption", label: "Purchase" },
  { value: "Fee_Consumption", label: "Fee" },
];

const cardStatusGroups: Record<string, string[]> = {
  pending: ["pending"],
  completed: ["completed"],
  failed: ["failed", "fail", "rejected"],
};

const matchesCardFilters = (
  tx: CardTransaction,
  filters: TransactionFilterValues,
) => {
  if (filters.type !== "all" && tx.type !== filters.type) return false;
  if (
    filters.status !== "all" &&
    !cardStatusGroups[filters.status]?.includes(tx.status?.toLowerCase())
  )
    return false;
  if (
    filters.dateFrom &&
    moment(tx.transactionTime).isBefore(filters.dateFrom, "day")
  )
    return false;
  if (
    filters.dateTo &&
    moment(tx.transactionTime).isAfter(filters.dateTo, "day")
  )
    return false;
  return true;
};

type TransactionTab = "wallet" | "cards" | "swap";

const Transactions = () => {
  const hasSwaps = useHasSwaps();
  const [tab, setTab] = useTabParam<TransactionTab>(
    "tab",
    "wallet",
    hasSwaps ? ["wallet", "cards", "swap"] : ["wallet", "cards"],
  );
  const [walletFilters, setWalletFilters] = useState(defaultTransactionFilters);
  const [cardFilters, setCardFilters] = useState(defaultTransactionFilters);
  const [walletPage, setWalletPage] = useState(1);
  const [cardPage, setCardPage] = useState(1);
  // The table (desktop) pages by number; the list (below lg) loads as it
  // scrolls. Only the visible one fetches.
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  // Mobile reveals the already-fetched card transactions PAGE_SIZE at a time.
  const [visibleCardCount, setVisibleCardCount] = useState(PAGE_SIZE);

  const walletQuery = {
    status: walletFilters.status === "all" ? undefined : walletFilters.status,
    type: walletFilters.type === "all" ? undefined : walletFilters.type,
    startDate: walletFilters.dateFrom || undefined,
    endDate: walletFilters.dateTo || undefined,
  };
  const { data: transactions, isLoading: isLoadingTransactions } =
    useGetDeposits(
      { page: walletPage, limit: PAGE_SIZE, ...walletQuery },
      isDesktop,
    );
  const {
    data: walletPages,
    isLoading: isLoadingWalletList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetDepositsInfinite({ limit: PAGE_SIZE, ...walletQuery }, !isDesktop);
  // New transactions shift offset pages, so a row can repeat across pages.
  const walletListItems: Transaction[] = [
    ...new Map(
      (walletPages?.pages ?? [])
        .flatMap((p: { data: Transaction[] }) => p.data)
        .map((tx: Transaction) => [tx.id, tx]),
    ).values(),
  ];
  const walletPageCount = Math.max(1, transactions?.totalPages || 1);

  const { data: cardTransactions, isLoading: isLoadingCardTransactions } =
    useGetCardTransactions({ page: 0, limit: 150 });
  const cardRows: CardTransaction[] = cardTransactions?.data ?? [];
  const filteredCardRows = cardRows.filter((tx) =>
    matchesCardFilters(tx, cardFilters),
  );
  const cardPageCount = Math.max(
    1,
    Math.ceil(filteredCardRows.length / PAGE_SIZE),
  );
  const cardPageItems = filteredCardRows.slice(
    (cardPage - 1) * PAGE_SIZE,
    cardPage * PAGE_SIZE,
  );
  const cardListItems = filteredCardRows.slice(0, visibleCardCount);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Keep the active page in range if the row count shrinks under it. Guard on a
  // loaded response — while react-query refetches an uncached page, `data` is
  // briefly undefined and `totalPages` would read as 1, bouncing us to page 1.
  useEffect(() => {
    if (transactions?.totalPages) {
      setWalletPage((p) => Math.min(p, walletPageCount));
    }
  }, [transactions?.totalPages, walletPageCount]);
  useEffect(() => {
    setCardPage((p) => Math.min(p, cardPageCount));
  }, [cardPageCount]);

  // A new filter always starts from the first page.
  const updateWalletFilters = (next: TransactionFilterValues) => {
    setWalletFilters(next);
    setWalletPage(1);
  };
  const updateCardFilters = (next: TransactionFilterValues) => {
    setCardFilters(next);
    setCardPage(1);
    setVisibleCardCount(PAGE_SIZE);
  };

  // <DataTable> wants a 0-indexed { pageIndex, pageSize } object and a tanstack
  // setter; bridge it to a plain 1-indexed page number, clamping whatever
  // tanstack's nav hands back into range.
  const tableProps = (
    page: number,
    setPage: (p: number) => void,
    pageCount: number,
  ) => ({
    pageCount,
    pagination: { pageIndex: page - 1, pageSize: PAGE_SIZE },
    setPagination: (updater: unknown) => {
      const prev = { pageIndex: page - 1, pageSize: PAGE_SIZE };
      const next =
        typeof updater === "function"
          ? (updater as (p: typeof prev) => typeof prev)(prev)
          : (updater as typeof prev);
      const target = (next?.pageIndex ?? page - 1) + 1;
      setPage(Math.min(Math.max(1, target), Math.max(1, pageCount)));
    },
  });

  return (
    <div className="">
      <TopBar title="Transactions" />
      <Tabs
        onValueChange={(value) => setTab(value as TransactionTab)}
        value={tab}
        className="font-poppins px-4 py-4 text-white lg:bg-transparent"
      >
        <TabsList className="border-dark-stroke-3 h-10 w-fit rounded-full border bg-white/5 p-1">
          <PillTabsTrigger value="wallet" active={tab === "wallet"}>
            Wallet
          </PillTabsTrigger>
          <PillTabsTrigger value="cards" active={tab === "cards"}>
            Cards
          </PillTabsTrigger>
          {hasSwaps && (
            <PillTabsTrigger value="swap" active={tab === "swap"}>
              Swap
            </PillTabsTrigger>
          )}
        </TabsList>

        <TabsContent value="wallet" className="mt-2">
          <div className="mb-4">
            <TransactionFilters
              filters={walletFilters}
              onChange={updateWalletFilters}
              typeOptions={walletTypeOptions}
            />
          </div>
          <div className="hidden lg:block">
            <DataTable
              columns={columns}
              data={transactions?.data ?? []}
              isLoading={isLoadingTransactions}
              {...tableProps(walletPage, setWalletPage, walletPageCount)}
            />
          </div>
          <div className="lg:hidden">
            <TransactionList
              isLoading={isLoadingWalletList}
              transactions={walletListItems}
              hasMore={hasNextPage}
              isFetchingMore={isFetchingNextPage}
              onLoadMore={() => {
                if (!isFetchingNextPage) fetchNextPage();
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="cards" className="mt-2">
          <div className="mb-4">
            <TransactionFilters
              filters={cardFilters}
              onChange={updateCardFilters}
              typeOptions={cardTypeOptions}
            />
          </div>
          <div className="hidden lg:block">
            <DataTable
              columns={cardColumns}
              data={cardPageItems}
              isLoading={isLoadingCardTransactions}
              {...tableProps(cardPage, setCardPage, cardPageCount)}
            />
          </div>
          <div className="lg:hidden">
            <TransactionList
              isLoading={isLoadingCardTransactions}
              transactions={cardListItems}
              type="cards"
              hasMore={visibleCardCount < filteredCardRows.length}
              onLoadMore={() =>
                setVisibleCardCount((count) => count + PAGE_SIZE)
              }
            />
          </div>
        </TabsContent>

        {hasSwaps && (
          <TabsContent value="swap" className="mt-2">
            <SwapTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Transactions;
