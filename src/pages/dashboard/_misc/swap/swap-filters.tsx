import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DateFilter from "../date-filter";
import StatusPills from "../status-pills";
import {
  filterContentClass as contentClass,
  filterItemClass as itemClass,
  filterTriggerClass as triggerClass,
} from "../filter-helpers";

const statusTabs: { value: SwapListFilters["status"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
];

const SwapFilters = ({
  filters,
  onChange,
}: {
  filters: SwapListFilters;
  onChange: (next: SwapListFilters) => void;
}) => {
  const set = <K extends keyof SwapListFilters>(
    key: K,
    value: SwapListFilters[K],
  ) => onChange({ ...filters, [key]: value });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
        <div className="min-w-0 flex-1 lg:max-w-52">
          <Select
            value={filters.kind}
            onValueChange={(v) => set("kind", v as SwapListFilters["kind"])}
          >
            <SelectTrigger className={triggerClass}>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className={contentClass}>
              <SelectItem value="all" className={itemClass}>
                All Types
              </SelectItem>
              <SelectItem value="swap" className={itemClass}>
                Swap
              </SelectItem>
              <SelectItem value="withdrawal" className={itemClass}>
                Withdrawal
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DateFilter
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          onChange={(dates) => onChange({ ...filters, ...dates })}
        />
      </div>

      <p className="text-sm text-white/80">
        View and track all your token swap
      </p>

      <StatusPills
        tabs={statusTabs}
        value={filters.status}
        onChange={(status) => set("status", status)}
      />
    </div>
  );
};

export default SwapFilters;
