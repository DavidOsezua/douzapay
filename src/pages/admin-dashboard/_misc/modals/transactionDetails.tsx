import Copy from "@/components/copy";
import { useAdminModals } from "@/zustand/store";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import moment from "moment";

const TransactionDetails = () => {
  const { transactionDetailsData } = useAdminModals();
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
              transactionDetailsIsOpen: false,
              transactionDetailsData: null,
            });
          }}
          className="hover:text-primary-500 text-primary-50 absolute top-4 right-4"
        >
          <X className="size-5" />
        </button>
        <h2 className="text-3xl font-bold">Transaction Details</h2>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Name</span>
            <span className="text-lg">
              {transactionDetailsData?.firstName}{" "}
              {transactionDetailsData?.lastName}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Email</span>
            <span className="text-lg">{transactionDetailsData?.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">ID</span>
            <span className="text-lg">{transactionDetailsData?.id}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Date</span>
            <span className="text-lg">
              {moment(transactionDetailsData?.createdAt).format("MMM Do, YYYY")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Amount</span>
            <span className="text-lg">
              USD{transactionDetailsData?.amount}{" "}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Type</span>
            <span className="text-lg">
              {transactionDetailsData?.type.charAt(0).toUpperCase() +
                transactionDetailsData?.type.slice(1)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-semibold`}>Status</span>
            <span
              className={`text-lg ${transactionDetailsData?.status === "pending" ? "text-primary-brown" : "text-primary-green"}`}
            >
              {transactionDetailsData?.status === "pending"
                ? "Pending"
                : transactionDetailsData?.status === "failed"
                  ? "Failed"
                  : transactionDetailsData?.status === "completed" &&
                    "Successful"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Transaction Id</span>
            <div className="flex items-center gap-4">
              <span className="text-lg">
                {transactionDetailsData?.transactionHash
                  ? `${transactionDetailsData.transactionHash.slice(0, 6)}...${transactionDetailsData.transactionHash.slice(-6)}`
                  : "-"}
              </span>
              <Copy text={transactionDetailsData?.transactionHash} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TransactionDetails;
