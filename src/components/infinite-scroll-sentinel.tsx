import { useEffect, useRef } from "react";

interface InfiniteScrollSentinelProps {
  onLoadMore: () => void;
  itemCount: number;
}

// Invisible marker rendered after a list; calls `onLoadMore` as it nears the
// viewport. `itemCount` re-arms the observer, so a marker that is still in
// view after a batch renders keeps loading. Render it only while more remain.
export default function InfiniteScrollSentinel({
  onLoadMore,
  itemCount,
}: InfiniteScrollSentinelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMoreRef.current();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [itemCount]);

  return <div ref={ref} aria-hidden className="h-px" />;
}
