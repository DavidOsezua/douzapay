import { Skeleton } from "@/components/ui/skeleton";

export const AssetCardSkeleton = () => (
  <div
    style={{
      flex: 1,
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "4px",
      borderRadius: "12px",
      padding: "10px",
      background:
        "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
      backdropFilter: "blur(20px)",
    }}
  >
    <div className="flex items-center gap-1.5">
      <Skeleton className="h-2.5 w-14 rounded" />
      <Skeleton className="size-5 shrink-0 rounded-full" />
    </div>
    <Skeleton className="mt-1 h-4 w-16 rounded" />
  </div>
);

export const AssetCardSelectSkeleton = () => (
  <div
    style={{
      flex: 1,
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "8px",
      borderRadius: "14px",
      padding: "12px",
      background: "#121212",
      border: "1.5px solid #E1E1E1",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Skeleton className="size-6 shrink-0 rounded-full" />
      <Skeleton className="h-2.5 w-16 rounded" />
    </div>
    <Skeleton className="h-7 w-20 rounded" />
  </div>
);
