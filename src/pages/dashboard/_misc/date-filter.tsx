import { Calendar } from "lucide-react";
import moment from "moment";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DateFilter = ({
  dateFrom,
  dateTo,
  onChange,
}: {
  dateFrom: string;
  dateTo: string;
  onChange: (dates: { dateFrom: string; dateTo: string }) => void;
}) => {
  const hasDate = !!(dateFrom || dateTo);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Filter by date"
          className={cn(
            "relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
            hasDate && "border-dark-primary-main text-dark-primary-main",
          )}
        >
          <Calendar className="size-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 space-y-3 border-white/10 bg-[#242424] text-white"
      >
        <label className="block text-xs text-white/70">
          From
          <input
            type="date"
            value={dateFrom}
            max={dateTo || moment().format("YYYY-MM-DD")}
            onChange={(e) => onChange({ dateFrom: e.target.value, dateTo })}
            className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-transparent px-2 text-sm text-white scheme-dark"
          />
        </label>
        <label className="block text-xs text-white/70">
          To
          <input
            type="date"
            value={dateTo}
            min={dateFrom}
            max={moment().format("YYYY-MM-DD")}
            onChange={(e) => onChange({ dateFrom, dateTo: e.target.value })}
            className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-transparent px-2 text-sm text-white scheme-dark"
          />
        </label>
        {hasDate && (
          <button
            type="button"
            onClick={() => onChange({ dateFrom: "", dateTo: "" })}
            className="text-dark-primary-main text-xs underline underline-offset-2"
          >
            Clear dates
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
