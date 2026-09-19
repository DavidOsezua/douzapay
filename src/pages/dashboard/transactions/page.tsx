import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { columns } from "../_misc/columns";
import { useGetCardTransactions, useGetDeposits } from "@/hooks/use-queries";
import TopBar from "@/components/topbar";
import { cardColumns } from "../_misc/cardColumns";
import TransactionList from "../_misc/TransactionList";

const PAGE_SIZE = 10;

const Transactions = () => {
  const [tab, setTab] = useState<"wallet" | "cards">("wallet");

  // ── Wallet: server-paginated ────────────────────────────────────────────
  const [walletPage, setWalletPage] = useState(1);
  const { data: transactions, isLoading: isLoadingTransactions } =
    useGetDeposits({ page: walletPage, limit: PAGE_SIZE });
  const walletRows: Transaction[] = transactions?.data ?? [];
  const walletPageCount = Math.max(1, transactions?.totalPages || 1);

  // ── Cards: fetched in one batch, paginated on the client ────────────────
  const [cardPage, setCardPage] = useState(1);
  const { data: cardTransactions, isLoading: isLoadingCardTransactions } =
    useGetCardTransactions({ page: 0, limit: 150 });
  const cardRows: CardTransaction[] = cardTransactions?.data ?? [];
  const cardPageCount = Math.max(1, Math.ceil(cardRows.length / PAGE_SIZE));
  const cardPageRows = cardRows.slice(
    (cardPage - 1) * PAGE_SIZE,
    cardPage * PAGE_SIZE,
  );

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

  const pageChanger =
    (setPage: (p: number) => void, pageCount: number) => (p: number) => {
      if (p >= 1 && p <= pageCount) setPage(p);
    };

  return (
    <div className="">
      <TopBar title="Transactions" />
      <Tabs
        onValueChange={(value) => setTab(value as "wallet" | "cards")}
        value={tab}
        className="font-poppins px-4 py-4 lg:bg-transparent"
      >
        <TabsList className="border-dark-stroke-3 bg-[#EBE8F308] w-full border p-0 lg:w-fit">
          <TabsTrigger
            value="wallet"
            className="dark:!text-[#E1E1E1] !text-[#E1E1E1] dark:data-[state=active]:!text-[#242424] data-[state=active]:!text-[#242424] !bg-[#EBE8F308] dark:data-[state=active]:!bg-[#E1E1E1] data-[state=active]:!bg-[#E1E1E1] rounded-l-lg rounded-r-none px-6"
          >
            Wallet
          </TabsTrigger>
          <TabsTrigger
            value="cards"
            className="dark:!text-[#E1E1E1] !text-[#E1E1E1] dark:data-[state=active]:!text-[#242424] data-[state=active]:!text-[#242424] !bg-[#EBE8F308] dark:data-[state=active]:!bg-[#E1E1E1] data-[state=active]:!bg-[#E1E1E1] rounded-l-none rounded-r-lg px-6"
          >
            Cards
          </TabsTrigger>
        </TabsList>
        <div className="bg-dark-card-3 text-white mt-4 rounded-2xl p-4 backdrop-blur-sm lg:row-start-auto">
          <div className="flex items-center justify-between bg-white/5"></div>

          <TabsContent value="wallet" className="mt-2">
            <div className="hidden lg:block">
              <DataTable
                columns={columns}
                data={walletRows}
                isLoading={isLoadingTransactions}
                {...tableProps(walletPage, setWalletPage, walletPageCount)}
              />
            </div>
            <div className="lg:hidden">
              <TransactionList
                isLoading={isLoadingTransactions}
                transactions={walletRows}
                currentPage={walletPage}
                totalPages={walletPageCount}
                handlePageChange={pageChanger(setWalletPage, walletPageCount)}
              />
            </div>
          </TabsContent>

          <TabsContent value="cards" className="mt-2">
            <div className="hidden lg:block">
              <DataTable
                columns={cardColumns}
                data={cardPageRows}
                isLoading={isLoadingCardTransactions}
                {...tableProps(cardPage, setCardPage, cardPageCount)}
              />
            </div>
            <div className="lg:hidden">
              <TransactionList
                isLoading={isLoadingCardTransactions}
                transactions={cardPageRows}
                type="cards"
                currentPage={cardPage}
                totalPages={cardPageCount}
                handlePageChange={pageChanger(setCardPage, cardPageCount)}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Transactions;
