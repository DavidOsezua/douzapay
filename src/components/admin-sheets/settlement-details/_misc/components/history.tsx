import { DataTable } from "@/pages/admin-dashboard/_misc/data-table";
import LineLoader from "@/components/line-loader";
import { Button } from "@/components/ui/button";
import { useGetSettlements } from "@/hooks/use-queries";
import { downloadCSV } from "@/lib/helper";
import { Download } from "lucide-react";
import { transactionColumns } from "../settlementHistoryColumns";

const History = ({ settlementData }: { settlementData: Merchant }) => {
  const { data: settlements, isLoading: isCardLoading } = useGetSettlements({
    whiteLabelId: settlementData.id,
  });

  return (
    <div className="mt-4 px-4">
      <div className="flex items-center justify-between text-sm text-[#0A2259E5]">
        <p>The history of all {settlementData.name} settlements</p>
        <Button
          onClick={() => downloadCSV(settlements?.data, "Cards")}
          className={"flex items-center gap-2 rounded-lg"}
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
            columns={transactionColumns}
            data={settlements?.data || []}
          />
        )}
      </div>
    </div>
  );
};

export default History;
