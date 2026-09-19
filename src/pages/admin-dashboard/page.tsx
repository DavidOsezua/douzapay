import {
  ArrowUpRight,
  ChevronUp,
  MoveDown,
  MoveUp,
  PlusCircle,
} from "lucide-react";
import Chart from "./_misc/bar-chart";
import { useAdminModals } from "@/zustand/store";
import {
  useGetAdminStats,
  useGetAllDeposits,
  useGetOverview,
} from "@/hooks/use-queries";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { formatAmount } from "@/lib/utils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PERIOD_OPTIONS = {
  last7: {
    label: "Last 7 Days",
    compareLabel: "Previous 7 Days",
    days: 7,
  },
  last30: {
    label: "Last 30 Days",
    compareLabel: "Previous 30 Days",
    days: 30,
  },
  week: { label: "This Week", compareLabel: "Last Week", unit: "week" },
  month: { label: "This Month", compareLabel: "Last Month", unit: "month" },
  year: { label: "This Year", compareLabel: "Last Year", unit: "year" },
} as const satisfies Record<
  string,
  {
    label: string;
    compareLabel: string;
    unit?: moment.unitOfTime.StartOf;
    days?: number;
  }
>;

type Period = keyof typeof PERIOD_OPTIONS;

// Rolling periods (last N days) use a fixed-length trailing window; calendar
// periods (this week/month/year) are anchored to the start of the unit.
// Either way the previous-period window matches the current one's elapsed
// length, so a partial period is never compared against a complete one.
function getPeriodRange(period: Period) {
  const config = PERIOD_OPTIONS[period];
  const currentRangeEnd = moment();

  if ("days" in config) {
    const currentRangeStart = moment()
      .subtract(config.days - 1, "days")
      .startOf("day");
    const previousRangeEnd = currentRangeStart.clone().subtract(1, "days");
    const previousRangeStart = previousRangeEnd
      .clone()
      .subtract(config.days - 1, "days");
    return {
      currentRangeStart,
      currentRangeEnd,
      previousRangeStart,
      previousRangeEnd,
    };
  }

  const currentRangeStart = moment().startOf(config.unit);
  const previousRangeStart = moment()
    .subtract(1, config.unit)
    .startOf(config.unit);
  const previousRangeEnd = previousRangeStart
    .clone()
    .add(currentRangeEnd.diff(currentRangeStart), "milliseconds");
  return {
    currentRangeStart,
    currentRangeEnd,
    previousRangeStart,
    previousRangeEnd,
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: adminStats } = useGetAdminStats();
  const [transactionType, setTransactionType] = useState("deposit");
  const [period, setPeriod] = useState<Period>("last30");

  const {
    currentRangeStart,
    currentRangeEnd,
    previousRangeStart,
    previousRangeEnd,
  } = getPeriodRange(period);

  const { data: recentTransactions } = useGetAllDeposits({
    page: 1,
    limit: 5,
  });
  const { data: chartData, isPending: isChartLoading } = useGetOverview({
    startDate: currentRangeStart.format("YYYY-MM-DD"),
    endDate: currentRangeEnd.format("YYYY-MM-DD"),
    type: transactionType,
  });

  const { data: previousPeriodTransactions } = useGetOverview({
    startDate: previousRangeStart.format("YYYY-MM-DD"),
    endDate: previousRangeEnd.format("YYYY-MM-DD"),
    type: transactionType,
  });

  const currentPeriodTotal =
    chartData?.reduce((total, data) => total + data.totalAmount, 0) ?? 0;
  const previousPeriodTotal =
    previousPeriodTransactions?.reduce(
      (total, data) => total + data.totalAmount,
      0,
    ) ?? 0;
  const percentChange =
    previousPeriodTotal === 0
      ? 0
      : ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
          {/* Create User */}
          <button
            onClick={() => useAdminModals.setState({ createUserIsOpen: true })}
            className="border-primary-500 hover:bg-primary-100/70 bg-primary-100/40 flex flex-col items-center gap-2.5 rounded-lg border border-dashed p-4 transition-all duration-200"
          >
            <img className="size-10" src="/icons/create-user.svg" alt="" />
            <div className="flex items-center gap-2">
              <PlusCircle size={15} />
              <span className="text-primary-500 mb-1">Create User</span>
            </div>
          </button>

          {/* Total Users */}
          <div className="text-primary-500 flex flex-col justify-between gap-4 rounded-lg bg-white px-4 py-2.5">
            <div className="flex items-center justify-between">
              <img
                className="size-12"
                src="/icons/users-shaded.svg"
                alt="shaded user icon"
              />
              <div className="flex min-w-0 flex-col items-end justify-between gap-2">
                <span className="leading-4 font-semibold">Total Users</span>
                <span className="-my-1.5 max-w-full truncate py-1.5 text-2xl leading-4 font-medium">
                  {adminStats?.users.totalUsers}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <div>
                <p className="text-primary-green font-semibold">Active</p>
                <p className="font-bold">{adminStats?.users.activeUsers}</p>
              </div>
              <div>
                <p className="text-primary-blue font-semibold">Verified Card</p>
                <p className="font-bold">{adminStats?.users.usersWithCards}</p>
              </div>
              <div>
                <p className="text-primary-red font-semibold">Inactive</p>
                <p className="font-bold">
                  {" "}
                  {isNaN(
                    (adminStats?.users.totalUsers ?? NaN) -
                      (adminStats?.users.activeUsers ?? NaN),
                  )
                    ? 0
                    : (adminStats?.users.totalUsers ?? 0) -
                      (adminStats?.users.activeUsers ?? 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Today's Activities */}
          <div className="text-primary-500 col-span-full flex flex-col justify-between gap-4 rounded-lg bg-white px-4 py-4">
            <h2 className="text-lg leading-4 font-bold">
              Today&#39;s Activities
            </h2>
            {/* pending deposits */}
            <div className="mt-2 flex flex-col gap-4 text-white md:flex-row">
              <div
                className="relative flex flex-1 justify-between rounded px-2 py-4"
                style={{
                  background:
                    "linear-gradient(258.35deg, #F86893 -0.65%, #DA1CC7 96.47%)",
                }}
              >
                <button
                  onClick={() => navigate("/admin-dashboard/transactions")}
                  className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full border border-white hover:border-white/50 hover:text-white/50"
                >
                  <ArrowUpRight size={15} />
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold">
                    {adminStats?.stats?.deposit?.pending?.count || 0}
                  </span>
                  <div className="flex flex-col gap-2">
                    <p className="leading-3">Pending</p>
                    <p className="leading-3 font-bold">Deposit Approval</p>
                  </div>
                </div>
              </div>
              {/* frozen cards */}
              <div
                className="relative flex flex-1 justify-between rounded px-2 py-4"
                style={{
                  background:
                    "linear-gradient(258.35deg, #8DD234 -0.65%, #2EAF4A 96.47%)",
                }}
              >
                <button
                  onClick={() => navigate("/admin-dashboard/cards")}
                  className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full border border-white hover:border-white/50 hover:text-white/50"
                >
                  <ArrowUpRight size={15} />
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold">
                    {adminStats?.frozenCards}
                  </span>
                  <div className="flex flex-col gap-2">
                    <p className="leading-3">Frozen</p>
                    <p className="leading-3 font-bold">Cards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-primary-500 flex flex-col gap-4 rounded-lg bg-white px-2.5 py-4">
          <h2 className="text-lg leading-3 font-bold">Transaction Balance</h2>
          <div className="flex grow flex-col justify-between gap-4">
            <div className="flex grow items-center gap-6">
              <div className="border-primary-50/30 text-primary-green flex size-10 shrink-0 items-center justify-center rounded-md border-[3px]">
                <MoveDown strokeWidth={3} size={15} />
              </div>
              <div className="flex min-w-0 flex-col justify-between gap-2">
                <span className="text-primary-green text-sm leading-2 font-medium">
                  Total User Balance
                </span>
                <span className="-my-1.5 max-w-full truncate py-1.5 text-2xl leading-4 font-medium">
                  ${formatAmount(adminStats?.users.totalBalance)}
                </span>
              </div>
            </div>
            <div className="bg-primary-50/30 h-[1px] w-full" />
            <div className="flex grow items-center gap-6">
              <div className="border-primary-50/30 text-primary-red flex size-10 shrink-0 items-center justify-center rounded-md border-[3px]">
                <MoveUp strokeWidth={3} size={15} />
              </div>
              <div className="flex min-w-0 flex-col justify-between gap-2">
                <span className="text-primary-red text-sm leading-2 font-medium">
                  Total Withdrawal
                </span>
                <span className="-my-1.5 max-w-full truncate py-1.5 text-2xl leading-4 font-medium">
                  ${formatAmount(adminStats?.deposits[0].totalWithdrawals, 2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* overview balance + transaction activity */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* overview balance */}
        <div className="text-primary-500 flex flex-col gap-4 overflow-hidden rounded-lg bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg leading-3 font-bold">Overview Balance</h2>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <p className="text-primary-50 text-sm">
                {currentRangeStart.format("MM/DD/YYYY")} -{" "}
                {currentRangeEnd.format("MM/DD/YYYY")}
              </p>
              <Select
                value={period}
                onValueChange={(value) => setPeriod(value as Period)}
              >
                <SelectTrigger className="h-8 w-28 rounded border-[#8F9DB066] text-sm">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(PERIOD_OPTIONS).map(([value, opt]) => (
                      <SelectItem key={value} value={value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="t h-8 w-28 rounded border-[#8F9DB066] text-sm">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex grow flex-col justify-between">
            <div className="flex grow flex-wrap items-center justify-between gap-2">
              <p>
                {PERIOD_OPTIONS[period].compareLabel}{" "}
                <span className="text-primary-green font-medium">
                  ${formatAmount(previousPeriodTotal, 2)}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <span className="text-3xl font-semibold">
                  ${formatAmount(currentPeriodTotal, 2)}
                </span>
                <span
                  className={
                    percentChange >= 0
                      ? "text-primary-green text-xl font-medium"
                      : "text-primary-red text-xl font-medium"
                  }
                >
                  {percentChange.toFixed(2)}%
                </span>
                <ChevronUp
                  className={
                    percentChange >= 0
                      ? "text-primary-green"
                      : "text-primary-red rotate-180"
                  }
                  size={15}
                />
              </div>
            </div>
            <Chart
              data={chartData?.slice().reverse()}
              isLoading={isChartLoading}
              period={period}
            />
          </div>
        </div>

        <div className="text-primary-500 flex flex-col gap-4 rounded-lg bg-white py-4">
          <div className="flex items-center justify-between px-2.5">
            <div className="space-y-2">
              <h2 className="text-lg leading-3 font-bold">
                Transaction Activity
              </h2>
              <p className="text-sm leading-3 font-medium">
                The latest transactions Activity
              </p>
            </div>
            <div className="bg-primary-500 rounded-full px-4 py-2.5 text-white">
              Today
            </div>
          </div>
          {recentTransactions?.data?.length > 0 ? (
            <div className="mt-4 flex flex-col gap-2">
              {recentTransactions?.data.map(
                (transaction: any, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-2 px-2.5 py-2.5 hover:cursor-pointer hover:shadow-[0px_2.9px_27.59px_0px_#6418C338] sm:grid-cols-6"
                  >
                    <div className="row-span-2 flex min-w-0 items-center gap-2 sm:col-span-2 sm:row-span-1">
                      <div className="border-primary-50/30 text-primary-green flex size-10 shrink-0 items-center justify-center rounded-md border-[3px]">
                        {transaction.type === "deposit" ? (
                          <MoveDown
                            strokeWidth={3}
                            className="text-primary-green"
                            size={15}
                          />
                        ) : (
                          <MoveUp
                            strokeWidth={3}
                            className="text-primary-red"
                            size={15}
                          />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col gap-2">
                        <p className="-my-1 truncate py-1 leading-3 font-semibold sm:hidden">
                          {transaction.firstName + " " + transaction.lastName}
                        </p>
                        <p className="hidden leading-3 font-semibold sm:block">
                          {transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)}
                        </p>
                        <p className="-my-1 truncate py-1 text-sm leading-2.5">
                          <span className="sm:hidden">
                            {transaction.type.charAt(0).toUpperCase() +
                              transaction.type.slice(1)}
                            {" · "}
                          </span>
                          {moment(transaction.createdAt).format("hh:mm A")}
                          <span className="sm:hidden">
                            {" "}
                            · #{transaction.id}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="hidden min-w-0 sm:col-span-2 sm:flex sm:flex-col sm:gap-2">
                      <p className="-my-1 truncate py-1 leading-3 font-semibold">
                        {transaction.firstName + " " + transaction.lastName}
                      </p>
                      <p className="-my-1 truncate py-1 text-sm leading-2.5">
                        #{transaction.id}
                      </p>
                    </div>
                    <p className="col-start-2 row-start-1 text-right text-sm leading-2.5 sm:col-start-auto sm:row-start-auto sm:text-left">
                      ${formatAmount(transaction.amount)}
                    </p>
                    <span
                      className={`${transaction.status === "failed" ? "text-primary-red" : transaction.status === "completed" ? "text-primary-green" : "text-primary-50"} col-start-2 row-start-2 text-right font-medium sm:col-start-auto sm:row-start-auto sm:text-left`}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              No Transactions Yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
