import { Download, Search } from "lucide-react";
import { DataTable } from "../_misc/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./column";
import { useGetAdminStats, useGetAllCards } from "@/hooks/use-queries";
import { useEffect, useState } from "react";
import LineLoader from "@/components/line-loader";
import { downloadCSV } from "@/lib/helper";

const AdminCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const { data: adminStats } = useGetAdminStats();
  const [paginationParams, setPaginationParams] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(1);
  const { data: cards, isLoading: isCardLoading } = useGetAllCards({
    page: paginationParams.pageIndex,
    limit: paginationParams.pageSize,
  });

  useEffect(() => {
    setPageCount(cards?.pageTotal || 1);
  }, [cards]);

  useEffect(() => {
    if (searchTerm === "") {
      setPaginationParams(() => ({
        pageSize: 10,
        pageIndex: 0,
      }));
      setFilteredCards(cards?.data);
    } else
      setPaginationParams(() => ({
        pageSize: 200,
        pageIndex: 0,
      }));

    setFilteredCards(
      cards?.data?.filter((card: Card) =>
        [card.firstName, card.lastName]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        {/* Total Cards */}
        <div className="text-primary-500 flex min-w-[220px] grow flex-col justify-between gap-4 rounded-lg bg-white px-4 py-2.5 lg:grow-0">
          <div className="flex items-center justify-between">
            <img
              className="size-12"
              src="/icons/master-wallet.svg"
              alt="master wallet icon"
            />
            <div className="flex flex-col items-end justify-between gap-2">
              <span className="leading-4 font-semibold">Total Cards</span>
              <span className="text-2xl leading-4 font-medium">
                {adminStats?.totalCards}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div>
              <p className="text-primary-green font-semibold">Active Cards</p>
              <p className="font-bold">
                {adminStats?.totalCards - adminStats?.frozenCards}
              </p>
            </div>
            <div>
              <p className="text-primary-red font-semibold">
                Freezed Card Users
              </p>
              <p className="font-bold">{adminStats?.frozenCards}</p>
            </div>
          </div>
        </div>

        {/* Total Balance */}
        <div className="text-primary-500 flex min-w-[220px] grow flex-col justify-between gap-4 rounded-lg bg-white px-4 py-2.5 lg:grow-0">
          <div className="flex items-center justify-between">
            <img
              className="size-12"
              src="/icons/users-shaded.svg"
              alt="shaded user icon"
            />
            <div className="flex flex-col items-end justify-between gap-2">
              <span className="leading-4 font-semibold">Total Users</span>
              <span className="text-2xl leading-4 font-medium">
                {adminStats?.users.totalUsers}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div>
              <p className="text-primary-green font-semibold">
                Available Balance
              </p>
              <p className="font-bold">
                ${Number(adminStats?.users.totalBalance).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-primary-green font-semibold">Active</p>
              <p className="font-bold">{adminStats?.users.activeUsers}</p>
            </div>
            <div>
              <p className="text-primary-red font-semibold">Inactive</p>
              <p className="font-bold">
                {adminStats?.users.totalUsers - adminStats?.users.activeUsers}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <div className="flex grow md:grow-0">
          <div className="relative grow rounded-md bg-white md:grow-0">
            <Search className="text-primary-50 absolute top-1/2 left-3 size-3 -translate-y-1/2" />
            <input
              type="search"
              className="h-8 w-full rounded-md bg-white pl-8 placeholder:leading-3 md:w-auto"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={() => downloadCSV(cards.data, "Cards")}
          className={"flex shrink-0 items-center gap-2 rounded-lg"}
        >
          <Download size={15} />
          <span>Download (CSV)</span>
        </Button>
      </div>

      <div className="mt-4">
        {isCardLoading ? (
          <div className="h-1">
            <LineLoader />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredCards ?? cards?.data}
            pagination={paginationParams}
            setPagination={setPaginationParams}
            pageCount={pageCount}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCards;
