import { Download, PlusCircle, Search } from "lucide-react";
import { DataTable } from "../_misc/data-table";
import { columns } from "./_misc/column";
import { Button } from "@/components/ui/button";
import { useAdminModals } from "@/zustand/store";
import { useGetAdminStats, useGetUsers } from "@/hooks/use-queries";
import { useEffect, useState } from "react";
import LineLoader from "@/components/line-loader";
import { downloadCSV } from "@/lib/helper";
import { formatAmount } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const deboucedSearchTerm = useDebounce(searchTerm, 500);
  const [paginationParams, setPaginationParams] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(1);
  const { data: users, isLoading } = useGetUsers({
    page: paginationParams.pageIndex,
    limit: paginationParams.pageSize,
    search: deboucedSearchTerm,
  });
  const { data: adminStat } = useGetAdminStats();

  useEffect(() => {
    setPageCount(users?.totalPages || 1);
  }, [users]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        {/* Create User */}
        <button
          onClick={() => useAdminModals.setState({ createUserIsOpen: true })}
          className="border-primary-500 hover:bg-primary-100/70 bg-primary-100/40 flex min-w-[220px] grow flex-col items-center gap-2.5 rounded-lg border border-dashed p-4 transition-all duration-200 lg:grow-0"
        >
          <img className="size-10" src="/icons/create-user.svg" alt="" />
          <div className="flex items-center gap-2">
            <PlusCircle size={15} />
            <span className="text-primary-500 mb-1">Create User</span>
          </div>
        </button>

        {/* Total Users */}
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
                {adminStat?.users.totalUsers}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div>
              <p className="text-primary-green font-semibold">Active Users</p>
              <p className="font-bold">{adminStat?.users.activeUsers}</p>
            </div>
            <div>
              <p className="text-primary-red font-semibold">Inactive Users</p>
              <p className="font-bold">
                {isNaN(
                  adminStat?.users.totalUsers - adminStat?.users.activeUsers,
                )
                  ? 0
                  : adminStat?.users.totalUsers - adminStat?.users.activeUsers}
              </p>
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
            <div className="flex flex-col items-end justify-between">
              <span className="text-lg font-medium">Total Balance</span>
              <span className="text-2xl leading-4 font-medium">
                ${formatAmount(adminStat?.users.totalBalance)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div>
              <p className="text-primary-green font-semibold">
                Available Balance
              </p>
              <p className="font-bold">
                ${formatAmount(adminStat?.users.totalBalance)}
              </p>
            </div>
            <div>
              <p className="text-primary-brown font-semibold">
                Pending Deposit
              </p>
              <p className="font-bold">
                {formatAmount(adminStat?.deposits[0].pendingDeposits)}
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
          onClick={() => downloadCSV(users.data, "users")}
          className={"flex shrink-0 items-center gap-2 rounded-lg"}
        >
          <Download size={15} />
          <span>Download (CSV)</span>
        </Button>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="h-1">
            <LineLoader />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users?.data || []}
            pagination={paginationParams}
            setPagination={setPaginationParams}
            pageCount={pageCount}
          />
        )}
      </div>
    </div>
  );
};

export default Users;
