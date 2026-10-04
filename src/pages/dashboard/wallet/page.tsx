import Copy from "@/components/copy";
import { DataTable } from "@/components/data-table";
import TopBar from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { useGetRecentTransactions, useGetUserAssets } from "@/hooks/use-queries";
import { useUser } from "@/zustand/store";
import {
  ArrowDownLeft,
  ArrowUpCircle,
  ArrowUpDown,
  ArrowUpRight,
  Eye,
  EyeOff,
  PlusCircle,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { columns } from "../_misc/columns";
import { useModalStore } from "@/zustand/modalStore";
import { useSheetStore } from "@/zustand/sheetStore";
import TransactionList from "../_misc/TransactionList";
import { handleShare } from "@/lib/helper";
import { useState } from "react";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";

const Wallet = () => {
  const { user } = useUser((state) => state);
  const [showBalance, setShowBalance] = useState(true);
  const { openModal } = useModalStore();
  const { openSheet } = useSheetStore();
  const formatAmount = useFormatAmountWithCurrency();
  const { data: userAssets } = useGetUserAssets();
  const totalBalance = (userAssets ?? []).reduce(
    (sum: number, a: any) => sum + Number(a.balance),
    0,
  );

  const { data: transactions, isLoading: transactionsIsLoading } =
    useGetRecentTransactions();

  return (
    <>
      <div>
        {/* header */}
        <TopBar title="My Wallet" />

        <div className="relative p-4">
          <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-10">
            {/* MY WALLET */}
            <div className="font-dm-sans dashboard-card text-white relative box-border flex w-full flex-col justify-between gap-y-4 rounded-2xl border border-dark-stroke-5 p-4 lg:col-span-4 lg:h-full">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium lg:text-sm">
                    Wallet Balance
                  </span>
                  <Button
                    variant={"ghost"}
                    onClick={() => setShowBalance(!showBalance)}
                    className="size-auto cursor-pointer !p-1 hover:bg-white/10"
                  >
                    {showBalance ? (
                      <EyeOff className="text-white/40 size-4" />
                    ) : (
                      <Eye className="text-white/40 size-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xl font-semibold lg:text-2xl">
                  {showBalance ? `${formatAmount(totalBalance)}` : `****`}
                </p>
              </div>

              {/* Desktop asset cards */}
              <div className="hidden w-full gap-2 lg:flex">
                {(userAssets ?? []).map((asset: any) => {
                  const iconMap: Record<string, string> = {
                    USDT: "/icons/usdt.svg",
                    USDC: "/icons/usdc.svg",
                  };
                  const networkIconMap: Record<string, string> = {
                    TRC20: "/icons/trc20.png",
                    ERC20: "/icons/erc20.svg",
                  };
                  const label = `${asset.token.type}-${asset.token.symbol}`;
                  const icon = iconMap[asset.token.symbol] ?? "/icons/usdt.svg";
                  const networkIcon = networkIconMap[asset.token.type];
                  return (
                    <div
                      key={asset.id}
                      className="dashboard-card border-dark-stroke-5 flex flex-1 flex-col gap-1 rounded-xl border p-2.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <p className="text-[#A5ACB6] text-[10px]">
                          {label}
                        </p>
                        <div className="relative size-5 shrink-0">
                          <img src={icon} alt={label} className="size-full" />
                          {networkIcon && (
                            <img
                              src={networkIcon}
                              alt={asset.token.type}
                              className="absolute -right-1 -bottom-1 size-2.5 rounded-full"
                            />
                          )}
                        </div>
                      </div>
                      <p className="text-white text-sm font-medium">
                        {Number(asset.balance).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="hidden space-y-4 lg:block">
                <div className="text-bg-primary flex justify-between space-x-1.5 rounded-2xl *:grow">
                  <button
                    onClick={() => openModal("walletAutoDeposit")}
                    className="lg:bg-dark-primary-main lg:hover:bg-dark-primary-main/70 flex h-12 items-center justify-center gap-1 rounded-md px-2 py-2.5 transition-all duration-300 active:scale-95"
                  >
                    <PlusCircle
                      className="size-6 text-[#242424]"
                      strokeWidth={1.5}
                    />
                    <p className="text-sm font-medium text-[#242424]">Deposit</p>
                  </button>
                  <button
                    onClick={() => openSheet("withdraw", 2)}
                    className="lg:bg-dark-primary-main lg:hover:bg-dark-primary-main/70 flex h-12 items-center justify-center gap-1 rounded-md px-2 py-2.5 transition-all duration-300 active:scale-95"
                  >
                    <ArrowUpCircle
                      className="size-6 rotate-45 text-[#242424]"
                      strokeWidth={1.5}
                    />
                    <p className="text-sm font-medium text-[#242424]">Withdraw</p>
                  </button>
                  <button
                    onClick={() => openModal("transfer")}
                    className="lg:bg-dark-primary-main lg:hover:bg-dark-primary-main/70 flex h-12 cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-2.5 transition-all duration-300 active:scale-95"
                  >
                    <div className="flex size-6 items-center justify-center rounded-full border-[1.5px] border-[#242424]">
                      <ArrowUpDown
                        className="size-3.5 rotate-45 text-[#242424]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-sm font-medium text-[#242424]">Transfer</p>
                  </button>
                </div>
              </div>
            </div>
            {/* END MY WALLET */}

            {/* MOBILE ASSET CARDS - below wallet balance */}
            <div className="col-span-full flex gap-2 lg:hidden">
              {(userAssets ?? []).map((asset: any) => {
                const iconMap: Record<string, string> = {
                  USDT: "/icons/usdt.svg",
                  USDC: "/icons/usdc.svg",
                };
                const networkIconMap: Record<string, string> = {
                  TRC20: "/icons/trc20.png",
                  ERC20: "/icons/erc20.svg",
                };
                const label = `${asset.token.type}-${asset.token.symbol}`;
                const icon = iconMap[asset.token.symbol] ?? "/icons/usdt.svg";
                const networkIcon = networkIconMap[asset.token.type];
                return (
                  <div
                    key={asset.id}
                    className="dashboard-card border-dark-stroke-5 flex flex-1 flex-col gap-1 rounded-xl border p-2.5"
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="text-[#A5ACB6] text-[10px]">{label}</p>
                      <div className="relative size-5 shrink-0">
                        <img src={icon} alt={label} className="size-full" />
                        {networkIcon && (
                          <img
                            src={networkIcon}
                            alt={asset.token.type}
                            className="absolute -right-1 -bottom-1 size-2.5 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium">
                      {Number(asset.balance).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-2.5 *:grow lg:col-span-3">
              <div className="dashboard-card font-dm-sans relative hidden h-29 min-w-1/2 flex-col justify-center space-x-1.5 rounded-2xl border border-dark-stroke-5 p-4 lg:flex">
                <p className="text-white text-sm">Pending balance</p>
                <p className="text-white mt-2 text-2xl font-medium">
                  {formatAmount(user?.pendingBalance)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openModal("statementType")}
                className="dashboard-card font-dm-sans relative min-w-1/2 space-x-1.5 overflow-hidden rounded-2xl border border-dark-stroke-5 p-4 *:grow lg:h-29"
              >
                <div>
                  <img src="/icons/report.svg" alt="Report icon" />
                  <p className="text-white mt-2 text-sm font-medium">
                    Account Statement
                  </p>
                  <p className="text-white mt-1 text-[10px] font-light lg:text-xs">
                    View and track transactions from your wallet
                  </p>
                </div>
              </button>
            </div>

            <div className="font-dm-sans dashboard-card relative flex w-full justify-between space-x-1.5 rounded-2xl border border-[#E3F7FF40] px-3 py-2 *:grow lg:col-span-2 lg:hidden">
              <Button
                onClick={() => openModal("walletAutoDeposit")}
                className="border border-transparent hover:border-dark-primary-main text-white flex h-auto flex-col items-center justify-between rounded-md bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
              >
                <div className="text-[#242424] bg-dark-primary-main flex size-7 items-center justify-center rounded-full">
                  <ArrowDownLeft className="size-4" strokeWidth={1.5} />
                </div>
                <p className="text-white text-xs font-medium">Deposit</p>
              </Button>
              <Button
                onClick={() => openSheet("withdraw", 2)}
                className="border border-transparent hover:border-dark-primary-main text-white flex h-auto flex-col items-center justify-between rounded-md bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
              >
                <div className="text-[#242424] bg-dark-primary-main flex size-7 items-center justify-center rounded-full">
                  <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </div>
                <p className="text-white text-xs font-medium">Withdraw</p>
              </Button>
              <Button
                onClick={() => openModal("transfer")}
                className="border border-transparent hover:border-dark-primary-main text-white flex h-auto flex-col items-center justify-between rounded-md bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
              >
                <div className="text-[#242424] bg-dark-primary-main flex size-7 items-center justify-center rounded-full">
                  <ArrowUpDown className="size-4 rotate-45" strokeWidth={1.5} />
                </div>
                <p className="text-white text-xs font-medium">Transfer</p>
              </Button>
            </div>

            {user?.canRefer && (
              <div className="text-[#0F1326] gradient-pink-card col-span-3 hidden w-full grid-cols-2 flex-col justify-between gap-4 rounded-2xl px-2.5 py-4 lg:flex">
                {/* total commission */}
                <div className="flex items-center justify-between">
                  <img
                    className="size-8 shrink-0"
                    src="/icons/gradient-users.svg"
                    alt="Total Commission"
                  />
                  <div className="text-right font-medium">
                    <p className="text-xs">Total Commission</p>
                    <p className="mt-2 text-xl leading-2">
                      {formatAmount(user?.totalCommisions)}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm leading-4">
                    Refer friends to earn commission rewards.
                  </p>
                  <div className="mt-2 font-medium">
                    <p className="text-xs">Commission Rate</p>
                    <p className="mt-2 flex items-center gap-4 leading-2">
                      <span>
                        {user?.referralFeePercent}{" "}
                        <span className="text-[10px]">%(Deposit)</span>
                      </span>
                    </p>
                  </div>
                  <div className="text-white mt-4 flex items-center gap-2.5 *:w-1/2">
                    <div
                      className={
                        "bg-[#000000] flex h-10 items-center justify-between rounded-md px-2.5"
                      }
                    >
                      <span className="w-5/6 overflow-hidden text-ellipsis whitespace-nowrap">
                        {user?.id}
                      </span>
                      <Copy
                        text={user?.id}
                        icon="/icons/copy2.svg"
                        side="left"
                      />
                    </div>
                    <Button
                      onClick={() => handleShare(`signup?ref=${user?.id}`)}
                      className={
                        "share-link-btn text-black flex h-10 items-center justify-center gap-1 rounded-md hover:cursor-pointer"
                      }
                    >
                      <Share2 className="text-black size-4" />
                      <span>Share Your Link</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="recent-transactions-card text-white mt-4 rounded-2xl lg:row-start-auto">
            <div className="rounded-tl-2xl rounded-tr-2xl p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-sm font-medium">
                  Recent Transactions
                </h2>
                <Link
                  to="/dashboard/transactions"
                  className="text-white text-xs hover:underline"
                >
                  See All
                </Link>
              </div>
            </div>
            <div className="mt-4 p-4">
              <div className="hidden lg:block">
                <DataTable columns={columns} data={transactions ?? []} />
              </div>
              <div className="lg:hidden">
                <TransactionList
                  isLoading={transactionsIsLoading}
                  transactions={transactions ?? []}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
