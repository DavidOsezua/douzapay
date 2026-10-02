export const filterTriggerClass =
  "h-11 w-full rounded-xl data-[size=default]:h-11 border-white/10 bg-white/5 px-3 text-white hover:bg-white/10 data-[placeholder]:text-white [&_svg:not([class*='text-'])]:text-white/70";
export const filterContentClass = "border-white/10 bg-[#242424] text-white";
export const filterItemClass = "focus:bg-white/10 focus:text-white";

export const defaultTransactionFilters: TransactionFilterValues = {
  type: "all",
  status: "all",
  dateFrom: "",
  dateTo: "",
};

export const transactionStatusTabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];
