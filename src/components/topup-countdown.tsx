import { formatAmount } from "@/lib/utils";
import moment from "moment";
import { useEffect, useState } from "react";

const TOPUP_WINDOW_MS = 10 * 60 * 1000;
const REPORT_DELAY_MS = 2 * 60 * 1000;

function formatCountdown(ms: number): string {
  const totalSecs = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

const TopupCountdown = ({
  createdAt,
  transactionId,
  amount,
}: {
  createdAt: string;
  transactionId: number | string;
  amount: string | number;
}) => {
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsed = Date.now() - new Date(createdAt).getTime();
  const phase1Remaining = TOPUP_WINDOW_MS - elapsed;
  const phase2Remaining = TOPUP_WINDOW_MS + REPORT_DELAY_MS - elapsed;

  const reportText = encodeURIComponent(
    `Hi, I have a pending card top-up that hasn't been credited.\n\nTransaction ID: ${transactionId}\nAmount: $${formatAmount(amount)}\nDate: ${moment(createdAt).format("DD MMM YYYY, hh:mm A")}\n\nPlease check the status.`,
  );
  const telegramUrl = `https://t.me/kryptkardsupport?text=${reportText}`;

  if (phase1Remaining > 0) {
    return (
      <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
        <p className="text-xs font-semibold text-blue-600">
          Estimated credit time
        </p>
        <p className="mt-1 text-4xl font-bold text-blue-700 tabular-nums">
          {formatCountdown(phase1Remaining)}
        </p>
        <p className="mt-1 text-sm text-blue-800">
          Your card will be credited within this window.
        </p>
      </div>
    );
  }

  if (phase2Remaining > 0) {
    return (
      <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-4">
        <p className="text-xs font-semibold text-red-600">Processing delay</p>
        <p className="mt-1 text-4xl font-bold text-red-600 tabular-nums">
          {formatCountdown(phase2Remaining)}
        </p>
        <p className="mt-1 text-sm text-red-700">
          Processing is taking longer than expected. Please wait before
          reporting.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-primary-500 mt-3 rounded-2xl px-4 py-4">
      <p className="mb-4 text-sm leading-5 text-white/80">
        Processing is taking longer than expected. If you&apos;ve already made a
        payment, tap below to notify our support team.
      </p>
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded-full bg-[#FF6B82] py-3.5 text-sm font-bold text-white transition-transform active:scale-95"
      >
        Report Transaction
      </a>
    </div>
  );
};

export default TopupCountdown;
