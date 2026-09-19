import { useAdminModals } from "@/zustand/store";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import moment from "moment";

const CardSpendingDetails = () => {
  const { cardSpendingDetailsData: details } = useAdminModals();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-20 flex h-dvh items-center justify-center bg-black/50 backdrop-blur-lg"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="relative h-auto rounded-xl bg-white px-6 py-6 lg:w-120"
      >
        <button
          onClick={() => {
            useAdminModals.setState({
              cardSpendingDetailsData: null,
              cardSpendingDetailsIsOpen: false,
            });
          }}
          className="hover:text-primary-500 text-primary-50 absolute top-4 right-4"
        >
          <X className="size-5" />
        </button>
        <h2 className="text-3xl font-bold">Card Spending Details</h2>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Date</span>
            <span className="text-lg">
              {moment(details?.transactionTime).format("MMM Do, YYYY")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Time</span>
            <span className="text-lg">
              {moment(details?.transactionTime).format("hh:mm A")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Spent Amount</span>
            <span className="text-lg">
              {parseFloat(details?.amount).toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Remark</span>
            <span className="text-lg">{details?.remark}</span>
          </div>

          <div className="flex flex-col">
            <span className={`text-sm font-semibold`}>Status</span>
            <span
              className={`text-lg ${details?.status === "Closed" ? "text-primary-brown" : details?.status === "Fail" ? "text-primary-red" : details?.status === "Completed" && "text-primary-green"}`}
            >
              {details?.status === "Closed"
                ? "Closed"
                : details?.status === "Fail"
                  ? "Failed"
                  : details?.status === "Completed" && "Completed"}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CardSpendingDetails;
