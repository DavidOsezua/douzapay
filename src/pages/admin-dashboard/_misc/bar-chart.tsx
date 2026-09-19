import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAmount } from "@/lib/utils";

type OverviewDataPoint = {
  date: string;
  totalAmount: number;
};

type Period = "last7" | "last30" | "week" | "month" | "year";

type ChartProps = {
  data: OverviewDataPoint[] | undefined;
  isLoading?: boolean;
  period?: Period;
};

const formatXAxis = (date: string, period: Period): string => {
  const d = new Date(date);
  if (period === "year") {
    return d.toLocaleDateString("en-US", { month: "short" });
  }
  if (period === "month") {
    return d.toLocaleDateString("en-US", { day: "numeric" });
  }
  if (period === "last30") {
    // Rolling 30 days can span two calendar months, so day-of-month alone
    // would be ambiguous (e.g. two bars both labeled "5").
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { weekday: "short" });
};

const formatYAxis = (value: number): string => {
  if (value === 0) return "0";
  return `${value / 1000}k`;
};

const formatTooltipDate = (date: string, period: Period): string => {
  const d = new Date(date);
  if (period === "year") {
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Rolls daily entries up into one total per calendar month so "This Year"
// always renders exactly 12 bars instead of one per day.
const aggregateByMonth = (
  data: OverviewDataPoint[],
  year: number,
): OverviewDataPoint[] => {
  const months = Array.from({ length: 12 }, (_, i) => ({
    date: `${year}-${String(i + 1).padStart(2, "0")}-01`,
    totalAmount: 0,
  }));

  data.forEach(({ date, totalAmount }) => {
    const monthIndex = Number(date.slice(5, 7)) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      months[monthIndex].totalAmount += totalAmount;
    }
  });

  return months;
};

function ChartTooltip({
  active,
  payload,
  period,
}: {
  active?: boolean;
  payload?: { payload: OverviewDataPoint }[];
  period: Period;
}) {
  if (!active || !payload?.length) return null;

  const { date, totalAmount } = payload[0].payload;

  return (
    <div className="border-primary-50/30 rounded-md border bg-white px-3 py-2 shadow-md">
      <p className="text-primary-50 text-xs">
        {formatTooltipDate(date, period)}
      </p>
      <p className="text-primary-500 text-sm font-semibold">
        ${formatAmount(totalAmount, 2)}
      </p>
    </div>
  );
}

export default function Chart({
  data,
  isLoading,
  period = "week",
}: ChartProps) {
  if (isLoading) {
    return (
      <div className="flex h-[220px] w-full items-end gap-2 md:h-[300px]">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-full"
            style={{ height: `${20 + ((i * 37) % 60)}%` }}
          />
        ))}
      </div>
    );
  }

  if (period !== "year" && !data?.length) {
    return (
      <div className="text-primary-50 flex h-[220px] w-full items-center justify-center text-sm md:h-[300px]">
        No transactions in this period
      </div>
    );
  }

  const chartData =
    period === "year"
      ? aggregateByMonth(data ?? [], new Date().getFullYear())
      : data;

  return (
    <div className="h-[220px] w-full md:h-[300px]">
      <ResponsiveContainer className={"mt-4"} width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
        >
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            fontSize={12}
            stroke="#888888"
            tickFormatter={(date) => formatXAxis(date, period)}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatYAxis}
            fontSize={12}
            stroke="#888888"
            tickMargin={5}
            width={35}
          />
          <Tooltip
            cursor={{ fill: "#312e81", opacity: 0.06 }}
            content={<ChartTooltip period={period} />}
          />
          <Bar
            dataKey="totalAmount"
            fill="#312e81"
            radius={[20, 20, 0, 0]}
            barSize={10}
            className="fill-indigo-950"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
