import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { DataTable } from "../../_misc/data-table";
import { userColumns } from "../_misc/user-columns";
import { useGetUsers } from "@/hooks/use-queries";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LineLoader from "@/components/line-loader";
import { useDebounce } from "@/hooks/use-debounce";

const NewUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const deboucedSearchTerm = useDebounce(searchTerm, 500);
  const [paginationParams, setPaginationParams] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(1);
  const { data: allUsers, isLoading: isUsersLoading } = useGetUsers({
    page: paginationParams.pageIndex,
    limit: paginationParams.pageSize,
    search: deboucedSearchTerm,
  });
  useEffect(() => {
    setPageCount(allUsers?.totalPages || 1);
  }, [allUsers]);

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => navigate(-1)}
          className={"flex shrink-0 items-center gap-2"}
          variant={"ghost"}
        >
          <ArrowLeft className="size-4" /> <span>Back</span>
        </Button>

        <div className="relative w-full grow overflow-hidden rounded-md bg-white sm:mx-auto sm:w-fit sm:min-w-150">
          <Search className="text-primary-50 absolute top-1/2 left-3 size-3 -translate-y-1/2" />
          <input
            type="search"
            className="h-8 w-full rounded-md bg-white pl-8 placeholder:leading-3"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="mt-8 w-full sm:mx-auto sm:w-fit sm:min-w-150">
        <h2 className="text-primary-500 font-medium">
          Latest Created Accounts, without Cards
        </h2>
        {isUsersLoading ? (
          <div className="h-1">
            <LineLoader />
          </div>
        ) : (
          <DataTable
            columns={userColumns}
            data={allUsers?.data}
            pagination={{
              ...paginationParams,
              pageIndex: paginationParams.pageIndex + 1,
            }}
            setPagination={setPaginationParams}
            pageCount={pageCount}
          />
        )}
      </div>
    </div>
  );
};

export default NewUsers;
