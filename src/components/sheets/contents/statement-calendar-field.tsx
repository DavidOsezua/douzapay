import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type Props = {
  label: string;
  value: string; // "YYYY-MM-DD" | ""
  onChange: (value: string) => void;
  min?: string; // "YYYY-MM-DD"
  max?: string; // "YYYY-MM-DD"
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
};

// Month shown when the popover opens: selected day's month, else the max
// bound's month, else the current month.
const anchorMonth = (value: string, max?: string) =>
  moment(value || max || undefined).startOf("month");

const StatementCalendarField = ({
  label,
  value,
  onChange,
  min,
  max,
  open,
  onOpenChange,
  disabled = false,
  placeholder = "DD / MM / YYYY",
}: Props) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const [viewMonth, setViewMonth] = useState(() => anchorMonth(value, max));
  const [pane, setPane] = useState<"days" | "months">("days");
  const [focusedIso, setFocusedIso] = useState("");

  const todayIso = moment().format("YYYY-MM-DD");
  const outOfRange = (iso: string) =>
    (!!min && iso < min) || (!!max && iso > max);
  const clampIso = (iso: string) => {
    if (min && iso < min) return min;
    if (max && iso > max) return max;
    return iso;
  };

  const minMonth = min ? moment(min).startOf("month") : null;
  const maxMonth = max ? moment(max).startOf("month") : null;

  // Every navigation goes through here so `viewMonth` never leaves the months
  // that contain at least one selectable day.
  const setView = (m: moment.Moment) => {
    let next = m.clone().startOf("month");
    if (minMonth && next.isBefore(minMonth)) next = minMonth.clone();
    if (maxMonth && next.isAfter(maxMonth)) next = maxMonth.clone();
    setViewMonth(next);
  };

  // Re-anchor the view and reset the pane each time the popover opens.
  useEffect(() => {
    if (!open) return;
    setView(anchorMonth(value, max));
    setPane("days");
    setFocusedIso(clampIso(value || max || todayIso));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Roving focus follows arrow-key navigation (not mouse month-paging).
  useEffect(() => {
    if (!open || pane !== "days" || !focusedIso) return;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-iso="${focusedIso}"]`)
      ?.focus({ preventScroll: true });
  }, [open, pane, focusedIso]);

  const days = useMemo(() => {
    const first = viewMonth.clone().startOf("month");
    const gridStart = first.clone().subtract(first.day(), "days");
    return Array.from({ length: 42 }, (_, i) =>
      gridStart.clone().add(i, "days"),
    );
  }, [viewMonth]);

  const moveFocus = (deltaDays: number) => {
    const raw = moment(focusedIso || todayIso)
      .add(deltaDays, "days")
      .format("YYYY-MM-DD");
    if (outOfRange(raw)) return; // don't let focus wander past the bounds
    setFocusedIso(raw);
    if (!moment(raw).isSame(viewMonth, "month")) {
      setView(moment(raw));
    }
  };

  const jumpMonths = (deltaMonths: number) => {
    setView(viewMonth.clone().add(deltaMonths, "month"));
    setFocusedIso(
      clampIso(
        moment(focusedIso || todayIso)
          .add(deltaMonths, "month")
          .format("YYYY-MM-DD"),
      ),
    );
  };

  const onGridKeyDown = (e: { key: string; preventDefault: () => void }) => {
    const handlers: Record<string, () => void> = {
      ArrowLeft: () => moveFocus(-1),
      ArrowRight: () => moveFocus(1),
      ArrowUp: () => moveFocus(-7),
      ArrowDown: () => moveFocus(7),
      PageUp: () => jumpMonths(-1),
      PageDown: () => jumpMonths(1),
      Home: () => moveFocus(-moment(focusedIso || todayIso).day()),
      End: () => moveFocus(6 - moment(focusedIso || todayIso).day()),
    };
    if (handlers[e.key]) {
      e.preventDefault();
      handlers[e.key]();
    }
  };

  const select = (iso: string) => {
    onChange(iso);
    onOpenChange(false);
  };

  const togglePane = () => setPane((p) => (p === "months" ? "days" : "months"));

  const display = value ? moment(value).format("DD MMM YYYY") : "";
  const stepUnit = pane === "days" ? "month" : "year";

  const step = (delta: number) =>
    setView(viewMonth.clone().add(delta, stepUnit));

  // Navigation stops at the bounding month (day pane) / year (month pane) so it
  // can never reach a period with no selectable date.
  const canStepPrev =
    pane === "days"
      ? !minMonth || viewMonth.isAfter(minMonth, "month")
      : !min || viewMonth.year() > moment(min).year();
  const canStepNext =
    pane === "days"
      ? !maxMonth || viewMonth.isBefore(maxMonth, "month")
      : !max || viewMonth.year() < moment(max).year();

  return (
    <div>
      <label className="text-xs font-normal text-white">{label}</label>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "mt-1 flex h-11 w-full items-center justify-between rounded-xl border bg-white/5 px-3 text-sm transition-colors disabled:opacity-50",
              open ? "border-dark-primary-main" : "border-white/10",
            )}
          >
            <span className={display ? "text-white" : "text-white/40"}>
              {display || placeholder}
            </span>
            <Calendar className="size-4 shrink-0 text-white/50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="z-[100] w-[300px] rounded-2xl border border-white/10 bg-[#242424] p-3 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label={`Previous ${stepUnit}`}
              disabled={!canStepPrev}
              onClick={() => step(-1)}
              className="flex size-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={togglePane}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {pane === "days"
                ? viewMonth.format("MMMM YYYY")
                : viewMonth.format("YYYY")}
              <ChevronDown className="size-3.5 text-white/60" />
            </button>
            <button
              type="button"
              aria-label={`Next ${stepUnit}`}
              disabled={!canStepNext}
              onClick={() => step(1)}
              className="flex size-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {pane === "days" ? (
            <>
              <div className="mt-2 grid grid-cols-7 justify-items-center">
                {WEEKDAYS.map((w) => (
                  <div
                    key={w}
                    className="pb-1 text-[10px] font-medium tracking-wide text-white/40 uppercase"
                  >
                    {w}
                  </div>
                ))}
              </div>
              <div
                ref={gridRef}
                role="grid"
                onKeyDown={onGridKeyDown}
                className="grid grid-cols-7 justify-items-center gap-y-0.5"
              >
                {days.map((d) => {
                  const iso = d.format("YYYY-MM-DD");
                  // Out-of-range days aren't rendered at all — the cell stays
                  // blank so the grid keeps its shape.
                  if (outOfRange(iso)) {
                    return <div key={iso} className="size-9" aria-hidden />;
                  }
                  const outside = !d.isSame(viewMonth, "month");
                  const selected = iso === value;
                  const isToday = iso === todayIso;
                  return (
                    <button
                      key={iso}
                      type="button"
                      data-iso={iso}
                      tabIndex={iso === focusedIso ? 0 : -1}
                      aria-selected={selected}
                      aria-label={d.format("dddd, D MMMM YYYY")}
                      onClick={() => select(iso)}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-dark-primary-main/70 focus-visible:outline-none",
                        selected
                          ? "text-[#242424] bg-dark-primary-main font-semibold"
                          : outside
                            ? "text-white/40 hover:bg-white/5"
                            : "text-white hover:bg-white/10",
                        !selected &&
                          isToday &&
                          "text-dark-primary-main ring-1 ring-dark-primary-main/40",
                      )}
                    >
                      {d.date()}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {MONTHS.map((m, idx) => {
                const monthStart = viewMonth
                  .clone()
                  .month(idx)
                  .startOf("month");
                const wholeOut =
                  (!!min &&
                    monthStart.clone().endOf("month").format("YYYY-MM-DD") <
                      min) ||
                  (!!max && monthStart.format("YYYY-MM-DD") > max);
                // Months with no selectable day aren't shown at all.
                if (wholeOut) {
                  return <div key={m} className="h-9" aria-hidden />;
                }
                const current = idx === viewMonth.month();
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setView(monthStart);
                      setPane("days");
                    }}
                    className={cn(
                      "h-9 rounded-lg text-xs font-medium transition-colors",
                      current
                        ? "text-[#242424] bg-dark-primary-main font-semibold"
                        : "text-white hover:bg-white/10",
                    )}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default StatementCalendarField;
