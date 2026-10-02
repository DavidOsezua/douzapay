import { cn } from "@/lib/utils";

const statusConfig: Record<SwapStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-[#3A3A44] text-[#FFB84D]",
  },
  processing: {
    label: "Processing",
    className: "bg-[#2A2F4A] text-[#7DA2FF]",
  },
  completed: {
    label: "Completed",
    className: "bg-[#1F3A2F] text-[#4ED79D]",
  },
  refunded: {
    label: "Refunded",
    className: "bg-[#1F3A2F] text-[#4ED79D]",
  },
  failed: {
    label: "Failed",
    className: "bg-[#FF6E7A1A] text-[#FF6E7A]",
  },
};

const SwapStatusBadge = ({
  status,
  className,
}: {
  status: SwapStatus;
  className?: string;
}) => {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
};

export default SwapStatusBadge;
