import { useUser } from "@/zustand/store";
import {
  ArrowDownLeft,
  ArrowUpDown,
  ArrowUpRight,
  Eye,
  EyeOff,
  PlusCircle,
  Share2,
} from "lucide-react";
import {
  useGetCards,
  useGetCardTransactions,
  useGetRecentTransactions,
  useGetUser,
  useGetUserAssets,
} from "@/hooks/use-queries";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Card from "@/components/dashboard-card";
import Copy from "@/components/copy";
import { DataTable } from "@/components/data-table";
import { columns } from "./_misc/columns";
import TopBar from "@/components/topbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useSheetStore } from "@/zustand/sheetStore";
import { useModalStore } from "@/zustand/modalStore";
import TransactionList from "./_misc/TransactionList";
import CardSkeleton from "@/components/skeletons/card-skeleton";
import { cardColumns } from "./_misc/cardColumns";
import { handleShare } from "@/lib/helper";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";

const Dashboard = () => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { openSheet } = useSheetStore();
  const formatAmount = useFormatAmountWithCurrency();

  const [tab, setTab] = useState<"wallet" | "cards">("wallet");
  useGetUser();
  const { user } = useUser((state) => state);
  const { data: cards, isLoading } = useGetCards();
  const { data: transactions, isLoading: isLoadingTransactions } =
    useGetRecentTransactions();
  const [showBalance, setShowBalance] = useState(true);
  const { data: userAssets } = useGetUserAssets();
  const totalBalance = (userAssets ?? []).reduce(
    (sum, a) => sum + Number(a.balance),
    0,
  );

  const { data: cardTransactions, isLoading: isCardLoading } =
    useGetCardTransactions({
      page: 0,
      limit: 150,
    });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      {/* header */}
      <TopBar title={`Hello ${user?.firstName}, 👋🏻`} />

      <div className="relative px-4">
        <div
          className={`relative mt-4 grid w-full grid-cols-1 gap-2 lg:gap-4 ${user?.canRefer ? "lg:grid-cols-3" : "lg:grid-cols-2"} `}
        >
          <div className="col-span-2 grid gap-2 lg:col-span-2 lg:grid-cols-4 lg:gap-4">
            {/* MOBILE ASSET CARDS - above My Cards */}
            <div className="col-span-full flex gap-2 lg:hidden">
              {(userAssets ?? []).map((asset) => {
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
                    className="border-[#CECECE2E] flex flex-1 flex-col gap-1 rounded-xl border p-2.5"
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
            {/* MY CARDS */}
            <div
              className={`thin-scrollbar dashboard-card relative h-full overflow-hidden overflow-x-auto rounded-2xl border border-[#6EF7FF24] p-4 lg:col-span-2`}
            >
              <div className="text-white mb-4 flex items-center justify-between">
                <span>My Cards</span>
                <button className="bg-[linear-gradient(128.62deg,rgba(227,247,255,0.4)_11.02%,rgba(211,187,241,0.4)_93.11%)] flex size-6 items-center justify-center rounded-full">
                  <ArrowUpRight className="text-[#E1E1E1] size-3" />
                </button>
              </div>

              <div
                className={`text-white relative mt-4 flex gap-4 ${cards?.data.length === 1 || cards?.data.length === 0 || cards?.data.length == undefined ? "justify-center" : ""}`}
              >
                {isLoading ? (
                  <CardSkeleton />
                ) : cards?.data.length === 0 ? (
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col text-center">
                      <h2 className="text-2xl font-semibold">No Cards</h2>
                      <p className="max-w-50 text-sm leading-4 font-normal">
                        Instantly create a card to start making transactions
                      </p>
                      <div className="mt-4">
                        <Button
                          className="gradient-button h-11 w-full py-1.5"
                          onClick={() => navigate("/dashboard/shop")}
                        >
                          <PlusCircle className="size-4" />
                          Buy Card
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`thin-scrollbar relative flex w-full gap-4 overflow-x-auto pb-2 ${cards?.data.length === 1 ? "justify-center" : ""}`}
                  >
                    {cards?.data.map((_: unknown, index: number) => (
                      <Card
                        className={
                          "inset-0 h-[160px] shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px] hover:cursor-pointer hover:backdrop-blur-sm"
                        }
                        key={index}
                        card={cards?.data[index]}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* END OF MY CARDS */}
            {/* WALLET */}
            <div className="col-start-1 row-end-2 flex flex-col lg:col-span-2 lg:col-start-3 lg:space-y-2">
              <div className="dashboard-card font-dm-sans text-white relative flex w-full flex-col gap-3 rounded-2xl border border-[#E3F7FF40] p-4 lg:h-full lg:justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Wallet Balance</span>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowBalance(!showBalance);
                        }}
                        variant={"ghost"}
                        className="size-auto cursor-pointer !p-1 hover:bg-white/10"
                      >
                        {showBalance ? (
                          <EyeOff className="text-white/40 size-4" />
                        ) : (
                          <Eye className="text-white/40 size-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xl font-medium">
                      {showBalance ? `${formatAmount(totalBalance)}` : "****"}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/dashboard/wallet")}
                    className="bg-[linear-gradient(128.62deg,rgba(227,247,255,0.4)_11.02%,rgba(211,187,241,0.4)_93.11%)] hidden size-6 items-center justify-center rounded-full lg:flex"
                  >
                    <span className="relative z-10">
                      <ArrowUpRight className="text-[#E1E1E1] size-3" />
                    </span>
                  </button>
                </div>

                {/* Desktop asset cards */}
                <div className="hidden w-full gap-2 lg:flex">
                  {(userAssets ?? []).map((asset) => {
                    const iconMap: Record<string, string> = {
                      USDT: "/icons/usdt.svg",
                      USDC: "/icons/usdc.svg",
                    };
                    const networkIconMap: Record<string, string> = {
                      TRC20: "/icons/trc20.png",
                      ERC20: "/icons/erc20.svg",
                    };
                    const label = `${asset.token.type}-${asset.token.symbol}`;
                    const icon =
                      iconMap[asset.token.symbol] ?? "/icons/usdt.svg";
                    const networkIcon = networkIconMap[asset.token.type];
                    return (
                      <div
                        key={asset.id}
                        className="border-[#CECECE2E] flex flex-1 flex-col gap-1 rounded-xl border p-2.5"
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
              </div>

              <div className="dashboard-card font-dm-sans hidden justify-between space-x-1.5 rounded-2xl border border-[#E3F7FF40] px-3 py-3 *:grow lg:flex">
                <Button
                  onClick={() => openModal("walletAutoDeposit")}
                  className="border border-transparent hover:border-[#E1E1E1] text-white flex h-auto flex-col items-center justify-between rounded-md bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
                >
                  <div className="text-[#242424] flex size-7 items-center justify-center rounded-full border bg-[#E1E1E1]">
                    <ArrowDownLeft className="size-4" strokeWidth={1.5} />
                  </div>
                  <p className="text-white text-xs font-medium">Deposit</p>
                </Button>
                <Button
                  onClick={() => openSheet("withdraw", 2)}
                  className="border border-transparent hover:border-[#E1E1E1] text-white flex h-auto flex-col items-center justify-between rounded-md bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
                >
                  <div className="text-[#242424] flex size-7 items-center justify-center rounded-full bg-[#E1E1E1]">
                    <ArrowUpRight className="size-4" strokeWidth={1.5} />
                  </div>
                  <p className="text-white text-xs font-medium">Withdraw</p>
                </Button>
                <Button
                  onClick={() => openModal("transfer")}
                  className="border border-transparent hover:border-[#E1E1E1] text-white flex h-auto flex-col items-center justify-between rounded-md bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
                >
                  <div className="text-[#242424] flex size-7 items-center justify-center rounded-full bg-[#E1E1E1]">
                    <ArrowUpDown
                      className="size-4 rotate-45"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-white text-xs font-medium">Transfer</p>
                </Button>
              </div>
            </div>
            {/* END OF WALLET */}
          </div>
          {/* COMMISSION */}
          {user?.canRefer && (
            <div className="text-[#0F1326] gradient-pink-card col-span-2 hidden w-full grid-cols-2 flex-col justify-between gap-4 rounded-2xl px-4 py-4 lg:col-span-1 lg:flex">
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
                      <span className="text-[10px]">%(Deposit Fee)</span>
                    </span>{" "}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2.5 *:w-1/2">
                  <div
                    className={
                      "bg-[#000000] text-white flex h-10 items-center justify-between rounded-md px-2.5"
                    }
                  >
                    <span className="w-5/6 overflow-hidden text-ellipsis whitespace-nowrap">
                      {user?.id}
                    </span>
                    <Copy text={user?.id} icon="/icons/copy2.svg" side="left" />
                  </div>
                  <Button
                    onClick={() => handleShare(`signup?ref=${user?.id}`)}
                    className={
                      "share-link-btn text-black flex h-10 cursor-pointer items-center justify-center gap-1 rounded-md"
                    }
                  >
                    <Share2 className="text-black size-4" />
                    <span>Share Your Link</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="dashboard-card font-dm-sans col-span-2 flex w-full justify-between space-x-1.5 rounded-2xl border border-[#E3F7FF40] px-3 py-2 *:grow lg:hidden">
            <Button
              onClick={() => openModal("walletAutoDeposit")}
              className="border border-transparent hover:border-[#E1E1E1] text-white flex h-auto flex-col items-center justify-between rounded-md bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
            >
              <div className="text-[#242424] flex size-7 items-center justify-center rounded-full bg-[#E1E1E1]">
                <ArrowDownLeft className="size-4" strokeWidth={1.5} />
              </div>
              <p className="text-white text-xs font-medium">Deposit</p>
            </Button>
            <Button
              onClick={() => openSheet("withdraw", 2)}
              className="border border-transparent hover:border-[#E1E1E1] text-white flex h-auto flex-col items-center justify-between rounded-md bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
            >
              <div className="text-[#242424] flex size-7 items-center justify-center rounded-full bg-[#E1E1E1]">
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </div>
              <p className="text-white text-xs font-medium">Withdraw</p>
            </Button>
            <Button
              onClick={() => openModal("transfer")}
              className="border border-transparent hover:border-[#E1E1E1] text-white flex h-auto flex-col items-center justify-between rounded-md bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
            >
              <div className="text-[#242424] flex size-7 items-center justify-center rounded-full bg-[#E1E1E1]">
                <ArrowUpDown className="size-4 rotate-45" strokeWidth={1.5} />
              </div>
              <p className="text-white text-xs font-medium">Transfer</p>
            </Button>
          </div>
        </div>

        <div className="recent-transactions-card text-white mt-4 rounded-2xl">
          <div className="rounded-tl-2xl rounded-tr-2xl p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Recent Transactions</h2>
              <Link
                to="/dashboard/transactions"
                className="text-white text-xs hover:underline"
              >
                See All
              </Link>
            </div>
          </div>

          <div className="p-4">
            <Tabs
              onValueChange={(value) => {
                setTab(value as "wallet" | "cards");
              }}
              value={tab}
              className="bg-transparent py-4"
            >
              <TabsList className="border-dark-stroke-3 bg-[#EBE8F308] w-full border p-0 lg:w-fit">
                <TabsTrigger
                  value="wallet"
                  className="dark:!text-[#E1E1E1] !text-[#E1E1E1] dark:data-[state=active]:!text-[#242424] data-[state=active]:!text-[#242424] !bg-[#EBE8F308] dark:data-[state=active]:!bg-[#E1E1E1] data-[state=active]:!bg-[#E1E1E1] rounded-l-lg rounded-r-none px-6"
                >
                  Wallet
                </TabsTrigger>
                <TabsTrigger
                  value="cards"
                  className="dark:!text-[#E1E1E1] !text-[#E1E1E1] dark:data-[state=active]:!text-[#242424] data-[state=active]:!text-[#242424] !bg-[#EBE8F308] dark:data-[state=active]:!bg-[#E1E1E1] data-[state=active]:!bg-[#E1E1E1] rounded-l-none rounded-r-lg px-6"
                >
                  Cards
                </TabsTrigger>
              </TabsList>
              <TabsContent value="wallet" className="mt-2">
                <div className="hidden lg:block">
                  <DataTable
                    columns={columns}
                    data={transactions ?? []}
                    isLoading={isLoadingTransactions}
                  />
                </div>
                <div className="lg:hidden">
                  <TransactionList
                    isLoading={isLoadingTransactions}
                    transactions={transactions ?? []}
                  />
                </div>
              </TabsContent>
              <TabsContent value="cards" className="mt-2">
                <div className="hidden lg:block">
                  <DataTable
                    columns={cardColumns}
                    data={cardTransactions?.data.slice(0, 10) ?? []}
                    isLoading={isCardLoading}
                  />
                </div>
                <div className="lg:hidden">
                  <TransactionList
                    type="cards"
                    isLoading={isCardLoading}
                    transactions={cardTransactions?.data.slice(0, 10) ?? []}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
