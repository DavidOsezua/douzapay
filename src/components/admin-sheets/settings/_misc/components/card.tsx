import { DataTable } from "@/pages/admin-dashboard/_misc/data-table";
import { useGetUserCards } from "@/hooks/use-queries";
import { cardColumns } from "../cardColums";
import LineLoader from "@/components/line-loader";

const Card = ({ userData }: { userData: any }) => {
  const { data: cards, isLoading } = useGetUserCards(userData.id);

  return (
    <div className="mt-4 px-4">
      <div className="grid grid-cols-2 gap-2.5">
        <div
          className="flex items-end justify-between rounded-md border border-[#DAE1EA] p-2.5"
          style={{
            boxShadow: "0px 2px 4px 0px #0000000D",
          }}
        >
          <div className="flex flex-col">
            <img className="size-6" src="/icons/card-neutral.svg" alt="" />
            <div className="flex items-center gap-2 text-xs">
              <span>Total Cards</span>
              <span>{cards?.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] leading-3">
            <div>
              <p className="text-[#ABBBE3]">Frozen</p>
              <p>
                {cards?.filter((card: Card) => card.status === "Frozen").length}
              </p>
            </div>
            <div>
              <p className="text-[#FF6366]">Expired</p>
              {/* TODO: verify API status value for expired cards — "expired" may be wrong casing or not a real status; count is always 0 */}
              <p>
                {
                  cards?.filter((card: Card) => (card.status as string) === "expired")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div
          className="rounded-md border border-[#DAE1EA] p-2.5 text-xs"
          style={{
            boxShadow: "0px 2px 4px 0px #0000000D",
          }}
        >
          <div className="flex items-center gap-2">
            <img className="size-6" src="/icons/pending-card2.svg" alt="" />
            <span className="text-[#FFBD4C]">Pending Cards</span>
            <span>
              {
                cards?.filter((card: Card) => (card.status as string) === "pending")
                  .length
              }
            </span>
          </div>
          <p className="text-primary-500">Card creation in progress</p>
        </div>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <LineLoader />
        ) : (
          <DataTable
            columns={cardColumns}
            data={cards || []}
            noDataText="User has no cards"
          />
        )}
      </div>
    </div>
  );
};

export default Card;
