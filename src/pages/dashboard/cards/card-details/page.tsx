import { Ellipsis, InfoIcon, Plus } from "lucide-react";
import { useGetCardInfo } from "@/hooks/use-queries";
import { useParams } from "react-router-dom";
import Card from "@/components/card";
import TopBar from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/zustand/modalStore";
import { DataTable } from "@/components/data-table";
import { useGetCardPurchases } from "@/hooks/use-queries";
import moment from "moment";
import { useEffect, useState } from "react";
import TransactionList from "../../_misc/TransactionList";
import Pagination from "@/components/pagination";
import { cardColumns } from "../../_misc/cardColumns";

const CardDetails = () => {
  const { id } = useParams();
  const { openModal } = useModalStore();
  const { data: cardData, isLoading: isCardDataLoading } = useGetCardInfo({
    id,
    enabled: true,
  });
  const [paginationParams, setPaginationParams] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(1);
  const { data: cards, isLoading: isCardLoading } = useGetCardPurchases({
    id: id,
    filters: {
      page: paginationParams.pageIndex,
      limit: paginationParams.pageSize,
      startDate: moment().subtract(30, "days").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
    },
  });

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pageCount) {
      setPaginationParams({
        pageIndex: page - 1,
        pageSize: paginationParams.pageSize,
      });
    }
  };

  useEffect(() => {
    setPageCount(
      Math.ceil((cards?.total || 0) / paginationParams.pageSize) || 1,
    );
  }, [cards, paginationParams.pageSize]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
      {/* header */}
      <TopBar backTo="/dashboard/cards" title={`Card`} />
      <div className="relative p-4">
        {/* <img
          src="/images/bg-logo.svg"
          alt=""
          className="fixed right-2/5 bottom-[calc(50%-100px)] z-0 translate-x-1/2 translate-y-1/2"
        /> */}
        <div
          className="flex justify-center rounded-lg py-6 backdrop-blur-md"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
          }}
        >
          <div>
            <Card showCta={false} card={cardData} />
            <div className="mt-4 flex items-center justify-between *:grow">
              <Button
                onClick={() =>
                  openModal("confirmPassword", { cardData: cardData })
                }
                disabled={isCardDataLoading}
                className="group text-white flex h-auto flex-col items-center justify-between gap-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
              >
                <div className="text-[#242424] bg-[#E1E1E1] flex size-11 items-center justify-center rounded-full border transition-all group-hover:scale-105">
                  <InfoIcon className="size-4" strokeWidth={1.5} />
                </div>
                <p className="text-xs font-medium">Details</p>
              </Button>
              <Button
                onClick={() => openModal("fundCard", { cardData: cardData })}
                disabled={isCardDataLoading}
                className="group text-white flex h-auto flex-col items-center justify-between gap-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
              >
                <div className="text-[#242424] flex size-11 items-center justify-center rounded-full border bg-[#E1E1E1] transition-all group-hover:scale-105">
                  <Plus className="size-4" strokeWidth={1.5} />
                </div>
                <p className="text-xs font-medium">Add Money</p>
              </Button>
              <Button
                onClick={() => openModal("freezeCard", { cardData: cardData })}
                disabled={isCardDataLoading}
                className="group text-white flex h-auto flex-col items-center justify-between gap-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
              >
                <div className="text-[#242424] flex size-11 items-center justify-center rounded-full border bg-[#E1E1E1] transition-all group-hover:scale-105">
                  <img
                    src="/icons/freeze.svg"
                    className="size-4"
                    alt="freeze icon"
                  />
                </div>
                <p className="text-xs font-medium">
                  {cardData?.status === "Frozen" ? "Unfreeze" : "Freeze"}
                </p>
              </Button>

              <Button
                onClick={() =>
                  openModal("moreCardOptions", { cardData: cardData })
                }
                disabled={isCardDataLoading}
                className="group text-white flex h-auto flex-col items-center justify-between gap-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 transition-all duration-300 hover:bg-transparent"
              >
                <div className="text-[#242424] flex size-11 items-center justify-center rounded-full border bg-[#E1E1E1] transition-all group-hover:scale-105">
                  <Ellipsis className="size-5" strokeWidth={2} />
                </div>
                <p className="text-xs font-medium">More</p>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark-card-3 text-white mx-4 mt-4 rounded-2xl backdrop-blur-sm lg:row-start-auto">
        <div>
          <div className="flex items-center justify-between p-4">
            <h2 className="text-sm font-medium">Card Transactions</h2>
          </div>
        </div>
        <div className="mt-2 p-4">
          <div className="hidden lg:block">
            <DataTable
              columns={cardColumns}
              data={cards?.data ?? []}
              isLoading={isCardLoading}
              pagination={paginationParams}
              setPagination={setPaginationParams}
              pageCount={pageCount}
            />
          </div>
          <div className="lg:hidden">
            <TransactionList
              isLoading={isCardLoading}
              transactions={cards?.data ?? []}
              type="cards"
            />
            {pageCount > 1 && (
              <Pagination
                currentPage={paginationParams.pageIndex + 1}
                totalPages={pageCount}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
