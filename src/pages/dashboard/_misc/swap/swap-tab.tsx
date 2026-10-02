import { useState } from "react";
import moment from "moment";
import { DataTable } from "@/components/data-table";
import { useGetSwaps } from "@/hooks/use-queries";
import SwapFilters from "./swap-filters";
import { defaultSwapFilters } from "./swap-helpers";
import SwapList from "./swap-list";
import { swapColumns } from "./swap-columns";

const PAGE_SIZE = 10;

const SwapTab = () => {
  const [filters, setFilters] = useState<SwapListFilters>(defaultSwapFilters);
  // "Pending" and "Completed" map 1:1 to a raw backend status, so those go to
  // the backend. "Processing" doesn't: resolveState (lib/swap.ts) collapses
  // several raw statuses (processing, queued, swapping, and refund_pending
  // under a different kind) onto the single displayed "processing" — sending
  // the literal string "processing" to the backend would miss the others, so
  // that one is matched client-side instead, against the already-resolved
  // display status.
  const serverStatus =
    filters.status === "all" || filters.status === "processing"
      ? undefined
      : filters.status;
  const { data: swaps, isLoading } = useGetSwaps(
    serverStatus,
    undefined,
    filters.kind === "all" ? undefined : filters.kind,
  );
  const [page, setPage] = useState(1);
  // Mobile reveals the already-fetched list PAGE_SIZE at a time as it scrolls.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const updateFilters = (next: SwapListFilters) => {
    setFilters(next);
    setPage(1);
    setVisibleCount(PAGE_SIZE);
  };

  // Pending/completed status and type are filtered by the backend; the dates
  // and the "processing" status (see serverStatus above) are done here.
  const matchesFilters = (s: Swap) => {
    if (filters.status === "processing" && s.status !== "processing")
      return false;
    if (
      filters.dateFrom &&
      moment(s.createdAt).isBefore(filters.dateFrom, "day")
    )
      return false;
    if (filters.dateTo && moment(s.createdAt).isAfter(filters.dateTo, "day"))
      return false;
    return true;
  };

  const filtered = (swaps ?? []).filter(matchesFilters);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const visibleItems = filtered.slice(0, visibleCount);

  const handlePageChange = (next: number) => {
    if (next > 0 && next <= totalPages) setPage(next);
  };

  return (
    <div className="space-y-4">
      <SwapFilters filters={filters} onChange={updateFilters} />

      <div className="hidden lg:block">
        <DataTable
          columns={swapColumns}
          data={pageItems}
          isLoading={isLoading}
          pagination={{ pageIndex: page - 1, pageSize: PAGE_SIZE }}
          setPagination={(updater) => {
            const prev = { pageIndex: page - 1, pageSize: PAGE_SIZE };
            const next =
              typeof updater === "function" ? updater(prev) : updater;
            handlePageChange(next.pageIndex + 1);
          }}
          pageCount={totalPages}
        />
      </div>
      <div className="lg:hidden">
        <SwapList
          swaps={visibleItems}
          isLoading={isLoading}
          hasMore={visibleCount < filtered.length}
          onLoadMore={() => setVisibleCount((count) => count + PAGE_SIZE)}
        />
      </div>
    </div>
  );
};

export default SwapTab;
