import Card from "@/components/card";
import CardSkeleton from "@/components/skeletons/card-skeleton";
import { DottedBorderBox } from "@/components/dotted-border";
import TopBar from "@/components/topbar";
import { Button } from "@/components/ui/button";
import {
  useGetCards,
  useGetCardTransactions,
  useGetPendingCards,
  useGetPendingHolders,
} from "@/hooks/use-queries";
import { useSheetStore } from "@/zustand/sheetStore";
import { PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataTable } from "@/components/data-table";
import { cardColumns } from "../_misc/cardColumns";
import TransactionList from "../_misc/TransactionList";

const Cards = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCards();
  const { data: pendingCards } = useGetPendingCards();
  const { data: pendingHolders } = useGetPendingHolders();
  const cards = data as { data: Card[] };
  // Pending = regular cards in progress + platinum cards awaiting a cardholder.
  // Both lists are rendered in the "pendingCards" sheet.
  const pendingCount =
    (pendingCards?.data?.length ?? 0) + (pendingHolders?.data?.length ?? 0);
  const { openSheet } = useSheetStore();
  const { data: cardTransactions, isLoading: isCardLoading } =
    useGetCardTransactions({
      page: 0,
      limit: 150,
    });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
      {/* header */}
      <TopBar title={`My Cards`} />
      <div className="relative px-4">
        <div
          className={`relative mt-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-9`}
        >
          <div
            className="dashboard-card relative col-span-1 row-start-2 h-full min-h-60 overflow-hidden rounded-2xl border border-[#6EF7FF24] p-4 pb-0 lg:col-span-4 lg:row-start-auto"
            style={{
              backdropFilter: "blur(50px)",
              boxShadow: "0px 4px 17px -1px #BDE9FB33",
            }}
          >
            {isLoading ? (
              <div className="mt-6 flex w-full items-center justify-center">
                <CardSkeleton />
              </div>
            ) : cards?.data.length === 0 ? (
              <div className="text-white flex h-full items-center justify-center">
                <div className="flex flex-col text-center">
                  <h2 className="text-2xl font-bold">No Cards</h2>
                  <p className="max-w-50 text-sm leading-4 font-normal">
                    Instantly create a card to start making transactions
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="text-white mb-4 flex items-center justify-between">
                  <span>Select Card</span>
                </div>
                <div
                  className={`thin-scrollbar relative flex w-full gap-4 overflow-x-auto pb-4 ${cards?.data.length === 1 ? "justify-center" : ""}`}
                >
                  {cards?.data.map((card, index) => (
                    <Card key={index} card={card} />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="text-white flex flex-row gap-2.5 *:grow lg:col-span-3 lg:flex-col">
            <div className="dashboard-card rounded-xl border border-[#6EF7FF24] p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-[10px]">
                <img className="size-6" src="/icons/gradient-card.svg" alt="" />
                <div className="flex gap-2">
                  <div>
                    <div className="text-[10px] text-[#C9D6FF] lg:text-[10px]">
                      Frozen
                    </div>
                    <div className="text-xs">
                      {cards?.data.filter((v) => v.status === "Frozen")?.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#FF6E7A]">Expired</div>
                    <div className="text-xs">0</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 mb-2">
                <div className="text-xs lg:text-sm">Total card</div>
                <div className="text-xl font-semibold lg:text-2xl">
                  {cards?.data.length} Cards
                </div>
              </div>
            </div>
            <div className="flex w-1/2 flex-col space-y-2.5 lg:w-full">
              <div className="dashboard-card font-dm-sans relative min-w-1/2 space-x-1.5 overflow-hidden rounded-2xl p-2 px-4 *:grow lg:hidden lg:w-auto lg:p-4">
                <DottedBorderBox strokeColor={"#CECECE2E"} strokeWidth={0.5} />
                <div className="bg-[linear-gradient(123.04deg,#DFF4FF_1.64%,#A3D9D9_98.52%)] text-[#242424] absolute top-0 -right-2 px-2.5 py-2 text-[10px] font-light uppercase">
                  Coming soon
                </div>
                <div className="opacity-30">
                  <img
                    className="size-4 lg:size-auto"
                    src="/icons/report.svg"
                    alt="Report icon"
                  />
                  <p className="text-white mt-1 text-xs font-medium lg:mt-2 lg:text-sm">
                    Card Statement
                  </p>
                  <p className="text-white text-[8px] font-light lg:mt-1 lg:text-xs">
                    View and track transactions from your card
                  </p>
                </div>
              </div>
              <div className="font-dm-sans text-white relative box-border flex justify-between gap-y-4 rounded-2xl p-1.5 lg:h-full lg:w-full lg:p-3">
                <DottedBorderBox strokeColor={"#CECECE2E"} strokeWidth={0.5} />
                <Button
                  onClick={() => navigate("/dashboard/shop")}
                  className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 h-10 w-full py-2 font-semibold lg:h-12"
                >
                  <PlusCircle strokeWidth={2} className="size-5" />
                  <span>Buy Card</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="text-white hidden flex-col gap-2.5 lg:col-span-2 lg:flex">
            <div className="dashboard-card font-dm-sans relative h-29 min-w-1/2 space-x-1.5 overflow-hidden rounded-2xl p-4 *:grow">
              <DottedBorderBox strokeColor={"#CECECE2E"} strokeWidth={0.5} />
              <div className="bg-[linear-gradient(123.04deg,#DFF4FF_1.64%,#A3D9D9_98.52%)] text-[#242424] absolute top-0 -right-2 px-2.5 py-2 text-[10px] font-light uppercase">
                Coming soon
              </div>
              <div className="opacity-30">
                <img src="/icons/report.svg" alt="Report icon" />
                <p className="text-white mt-2 text-sm font-medium">
                  Card Statement
                </p>
                <p className="text-white mt-1 text-xs font-light">
                  View and track transactions from your card
                </p>
              </div>
            </div>
            <div className="dashboard-card font-dm-sans relative h-29 min-w-1/2 space-x-1.5 overflow-hidden rounded-2xl p-4 *:grow">
              <DottedBorderBox strokeColor={"#CECECE2E"} strokeWidth={0.5} />

              <div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <img src="/icons/pending-card.svg" alt="Report icon" />
                    <p className="text-white text-sm font-medium">
                      Pending card
                    </p>
                  </div>
                  <span className="text-sm font-extrabold">
                    {" "}
                    {pendingCount}
                  </span>
                </div>
                <p className="text-white mt-2.5 text-xs font-light">
                  Card creation in progress
                </p>
                <Button
                  onClick={() => openSheet("pendingCards", 2, {}, false)}
                  className="text-[#242424] hover:bg-dark-primary-main/80 bg-dark-primary-main mt-2 w-full py-2 lg:h-9"
                >
                  See Details
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="dashboard-card min-w-1/2 rounded-2xl border border-[#6EF7FF24] p-4">
              <div className="text-white flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img
                    className="size-5"
                    src="/icons/pending-card.svg"
                    alt="Report icon"
                  />
                  <p className="text-white text-xs font-medium">
                    Pending card
                  </p>
                </div>
                <span className="text-xs font-extrabold">
                  {pendingCount}
                </span>
              </div>
              <p className="text-white mt-2.5 text-[8px] font-light">
                Card creation in progress
              </p>
            </div>
            <div className="dashboard-card font-dm-sans relative flex h-full min-w-1/2 items-center justify-center space-x-1.5 overflow-hidden rounded-2xl p-4 *:grow">
              <DottedBorderBox strokeColor={"#CECECE2E"} strokeWidth={0.5} />
              <Button
                onClick={() => openSheet("pendingCards", 2, {}, false)}
                className="text-[#242424] hover:bg-dark-primary-main/80 bg-dark-primary-main w-full py-2 lg:h-9"
              >
                See Details
              </Button>
            </div>
          </div>
        </div>
        <div className="text-white recent-transactions-card mt-6 rounded-xl">
          <div>
            <div className="flex h-12 items-center justify-between px-4">
              <h1>Recent Transactions</h1>
              <Link
                className="text-white text-xs hover:underline"
                to="/dashboard/transactions"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="px-4 backdrop-blur-xl lg:block">
            <div className="hidden lg:block">
              <DataTable
                columns={cardColumns}
                data={cardTransactions?.data.slice(0, 10) ?? []}
                isLoading={isCardLoading}
              />
            </div>
            <div className="lg:hidden">
              <TransactionList
                isLoading={isCardLoading}
                transactions={cardTransactions?.data.slice(0, 10) ?? []}
                type="cards"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
