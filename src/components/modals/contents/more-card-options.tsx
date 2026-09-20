import WithdrawIcon from "@/components/icons/withdraw-icon";
import { useModalStore } from "@/zustand/modalStore";
import { Trash2 } from "lucide-react";

const MoreCardOptions = ({ cardData }: { cardData: Card }) => {
  const { openModal } = useModalStore();
  return (
    <div>
      <h2 className="text-lg font-semibold">More</h2>

      <div className="mt-6">
        <div
          tabIndex={0}
          onClick={() => {
            if (!cardData?.id) return;
            openModal("fundWallet", {
              cardData: cardData,
            });
          }}
          role="navigation"
          className={`flex items-center space-x-4 p-2 hover:bg-white/10 ${cardData?.id ? "hover:cursor-pointer" : "cursor-not-allowed opacity-40"}`}
        >
          <div
            className="border-primary-100 text-primary-100 flex size-8 items-center justify-center rounded-full border opacity-50"
            style={{
              background:
                " linear-gradient(100.47deg, #E1E1E1 9.36%, #999999 100%)",
            }}
          >
            <WithdrawIcon className="size-3" />
          </div>

          <div>
            <p className="font-medium">Withdraw funds</p>
            <p className="text-xs font-light">
              Withdraw from your card into your WALLET
            </p>
          </div>
        </div>

        <div
          tabIndex={0}
          role="navigation"
          className="flex items-center space-x-4 p-2 opacity-40 hover:cursor-not-allowed hover:bg-white/10"
        >
          <div
            className="border-primary-100 text-primary-100 flex size-8 items-center justify-center rounded-full border"
            style={{
              background:
                " linear-gradient(100.47deg, #E1E1E1 9.36%, #999999 100%)",
            }}
          >
            <img src="/icons/report.svg" className="size-3" alt="Report icon" />
          </div>

          <div>
            <p className="font-medium">Get your card statement</p>
            <p className="text-xs font-light">
              Get a statement for all or some part of your card transactions
            </p>
          </div>
        </div>

        <div
          tabIndex={0}
          onClick={() =>
            openModal("deleteCard", {
              cardData: cardData,
            })
          }
          role="navigation"
          className="flex items-center space-x-4 p-2 hover:cursor-pointer hover:bg-white/10"
        >
          <div className="border-primary-100 text-primary-100 flex size-8 items-center justify-center rounded-full border bg-[#FF6E7A]">
            <Trash2 className="size-4" strokeWidth={1.5} />
          </div>

          <div>
            <p className="font-medium">Delete your card</p>
            <p className="text-xs font-light">Instantly terminate your card</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreCardOptions;
