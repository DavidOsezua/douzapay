import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import InfiniteScrollSentinel from "@/components/infinite-scroll-sentinel";
import SwapStatusBadge from "./swap-status-badge";
import { SwapPairIcon } from "./swap-token-icon";
import {
  formatFromAmount,
  formatToAmount,
  getSwapSubtitle,
  useOpenSwap,
} from "./swap-helpers";

const cardClass =
  "flex items-center gap-2 rounded-2xl border border-dark-stroke-3 bg-dark-card-3 p-2.5 text-white";

const SwapCard = ({ swap }: { swap: Swap }) => {
  const openSwap = useOpenSwap();
  const isWithdrawal = swap.kind === "withdrawal";

  return (
    <button
      type="button"
      onClick={() => openSwap(swap)}
      className={`${cardClass} w-full cursor-pointer text-left`}
    >
      <SwapPairIcon
        from={swap.fromSymbol}
        fromSrc={swap.fromIcon}
        to={isWithdrawal ? undefined : swap.toSymbol}
        toSrc={swap.toIcon}
        size="size-6.5"
        compact
      />
      <div className="min-w-0 grow">
        <p className="truncate text-xs font-semibold">
          {isWithdrawal
            ? formatFromAmount(swap)
            : `${formatFromAmount(swap)} → ${formatToAmount(swap)}`}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-white/60">
          {getSwapSubtitle(swap)}
        </p>
      </div>
      <SwapStatusBadge status={swap.status} className="px-2 py-1 text-[11px]" />
      <ChevronRight className="-ml-1 size-4 shrink-0 text-white/60" />
    </button>
  );
};

const SwapCardSkeleton = () => (
  <div className="flex items-center gap-3 rounded-2xl border border-dark-stroke-3 p-3">
    <Skeleton className="size-8 rounded-full" />
    <div className="grow space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-7 w-20 rounded-full" />
  </div>
);

const SwapList = ({
  swaps,
  isLoading,
  hasMore,
  onLoadMore,
}: {
  swaps: Swap[];
  isLoading?: boolean;
  // Omit both for a fixed list (the dashboard's recent swaps).
  hasMore?: boolean;
  onLoadMore?: () => void;
}) => {
  if (isLoading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SwapCardSkeleton key={i} />
        ))}
      </div>
    );

  if (swaps.length === 0)
    return (
      <div className="py-16">
        <p className="text-center text-white">No swaps found</p>
      </div>
    );

  return (
    <div>
      <div className="space-y-3">
        {swaps.map((swap) => (
          <SwapCard key={swap.id} swap={swap} />
        ))}
      </div>
      {hasMore && onLoadMore && (
        <InfiniteScrollSentinel
          onLoadMore={onLoadMore}
          itemCount={swaps.length}
        />
      )}
    </div>
  );
};

export default SwapList;
