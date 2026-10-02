import { cn } from "@/lib/utils";

// The rounded status tab bar used by the swap, wallet and cards filters.
const StatusPills = <T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <div className="flex gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1">
    {tabs.map((tab) => {
      const active = value === tab.value;
      return (
        <button
          key={tab.value}
          type="button"
          aria-pressed={active}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex-1 rounded-full px-3 py-2 text-sm whitespace-nowrap",
            active
              ? "bg-dark-primary-main text-[#242424] font-medium"
              : "text-white/60 hover:text-white",
          )}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default StatusPills;
