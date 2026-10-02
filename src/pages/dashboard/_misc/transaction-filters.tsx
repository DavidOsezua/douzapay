import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DateFilter from "./date-filter";
import StatusPills from "./status-pills";
import {
  filterContentClass,
  filterItemClass,
  filterTriggerClass,
  transactionStatusTabs,
} from "./filter-helpers";

// Type dropdown, date range and status pills for the wallet and cards tabs.
const TransactionFilters = ({
  filters,
  onChange,
  typeOptions,
}: {
  filters: TransactionFilterValues;
  onChange: (next: TransactionFilterValues) => void;
  typeOptions: { value: string; label: string }[];
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1 lg:max-w-52">
        <Select
          value={filters.type}
          onValueChange={(type) => onChange({ ...filters, type })}
        >
          <SelectTrigger className={filterTriggerClass}>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className={filterContentClass}>
            <SelectItem value="all" className={filterItemClass}>
              All Types
            </SelectItem>
            {typeOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className={filterItemClass}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DateFilter
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onChange={(dates) => onChange({ ...filters, ...dates })}
      />
    </div>

    <StatusPills
      tabs={transactionStatusTabs}
      value={filters.status}
      onChange={(status) => onChange({ ...filters, status })}
    />
  </div>
);

export default TransactionFilters;
