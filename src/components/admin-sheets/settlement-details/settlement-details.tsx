import Copy from "@/components/copy";
import { formatAmount } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";
import moment from "moment";

const SettlementDetails = ({
  settlementData,
}: {
  settlementData: Settlement;
}) => {
  return (
    <>
      <div className="text-primary-500 mt-4 bg-[#DFEEFF] px-4 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Settlement Details</h2>
        </div>
      </div>

      <div className="px-4">
        {/* Bank Details */}
        <div className="mt-4 flex items-center space-x-2">
          <div
            className={`bg[#F3F5F7] flex size-6 items-center justify-center gap-2 overflow-hidden rounded-full`}
          >
            <img src="/icons/deposit.svg" className="size-4" alt="credit" />
          </div>

          <div className="font-medium text-[#07111B] capitalize">
            Settlement
          </div>
        </div>

        <div className="mt-4 mb-10">
          <DetailRow label="Id" value={settlementData.id} />
          <DetailRow label={`Coin`} value={`USDT`} />
          <DetailRow
            label={`Deposit Fee`}
            value={`${formatAmount(settlementData.depositFee)}`}
          />
          <DetailRow
            label="Amount Settled"
            valueComponent={
              <span className="text-[#2BBC35]">
                +{" "}
                {formatAmount(
                  settlementData.depositFee +
                    settlementData.withdrawalFee +
                    settlementData.cardCreationFee +
                    (settlementData.referralFee || 0),
                )}
              </span>
            }
          />
          <div className="mt-4" />
          <DetailRow
            label={`Destination`}
            valueComponent={
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <BadgeCheck
                    strokeWidth={3}
                    className="size-4 text-[#559AB5]"
                  />
                  <span>{settlementData.wallet.name}</span>
                </div>
                <div>{settlementData.wallet.walletAddress}</div>
              </div>
            }
          />

          <DetailRow
            label={`TxId`}
            copy
            value={settlementData.transactionHash}
          />

          <DetailRow
            label="Date"
            value={moment(settlementData.createdAt).format(
              "DD MMM YYYY, hh:mm A",
            )}
          />
        </div>
      </div>
    </>
  );
};

interface DetailRowProps {
  label: string;
  value?: string | number | null | undefined;
  valueComponent?: React.ReactNode;
  copy?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  valueComponent,
  copy = false,
}) => {
  return (
    <div className="flex items-center justify-between border-[#0000001A] py-2">
      <div className="text-sm text-[#3A3A3A] capitalize">{label}</div>
      <div className="flex items-center gap-2">
        {copy && <Copy side="left" text={value as string} />}
        <span className="text-sm font-medium text-[#181818] capitalize">
          {valueComponent ? valueComponent : (value ?? "-")}
        </span>
      </div>
    </div>
  );
};

export default SettlementDetails;
