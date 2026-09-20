import Copy from "@/components/copy";
import { Button } from "@/components/ui/button";
import { useApplyForReferral } from "@/hooks/use-mutations";
import {
  useGetUserReferralStats,
  useGetUserReferralList,
} from "@/hooks/use-queries";
import { handleShare } from "@/lib/helper";
import { formatAmount } from "@/lib/utils";
import { useUser } from "@/zustand/store";
import {
  ArrowDownToLine,
  Check,
  ChevronRight,
  Info,
  Link2,
  Lock,
  Mail,
  Search,
  Share2,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const timeAgo = (date: string) => {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
};

const ApplicationStatus = ({ submittedAt }: { submittedAt?: string }) => {
  const submittedLabel = (() => {
    if (!submittedAt) return "Today";
    const submitted = new Date(submittedAt);
    const now = new Date();
    const diffDays = Math.floor(
      (now.setHours(0, 0, 0, 0) - submitted.setHours(0, 0, 0, 0)) / 86400000,
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return new Date(submittedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  })();

  const steps = [
    {
      label: "Application submitted",
      sub: submittedLabel,
      state: "done" as const,
    },
    {
      label: "Review in progress",
      sub: "Our team is evaluating your application",
      state: "active" as const,
    },
    {
      label: "Access granted",
      sub: "Start earning 25% on every referral",
      state: "pending" as const,
    },
  ];

  const cardStyle = {
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
    borderColor: "#CECECE2E",
  } as const;

  return (
    <div className="relative pb-6">
      {/* Cyan radial glow — top left */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(63, 216, 232, 0.2) 0%, rgba(63, 216, 232, 0) 100%)",
          width: 440,
          height: 396,
          top: -143,
          left: -123,
        }}
      />

      <div className="relative z-10 overflow-x-hidden">
        {/* Pink radial glow — right edge */}
        <div
          className="pointer-events-none absolute inset-x-0 z-0 blur-md"
          style={{
            background:
              "radial-gradient(350px 350px at 100% 50%, rgba(255, 174, 230, 0.15) 0%, rgba(255, 174, 230, 0) 100%)",
            height: 400,
            top: 180,
          }}
        />

        {/* Header */}
        <div className="relative z-10">
          <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
            REFERRAL PROGRAM
          </p>
          <h2 className="mt-0.5 text-xl font-bold text-white">
            Application Status
          </h2>
        </div>

        {/* Hero card */}
        <div
          className="relative z-10 mt-4 rounded-2xl border p-5"
          style={{
            background: "rgba(251, 191, 36, 0.05)",
            borderColor: "rgba(63, 216, 232, 0.15)",
          }}
        >
          <div className="flex flex-col items-center text-center">
            {/* Timer icon */}
            <img
              src="/images/gradient-timer.svg"
              alt=""
              className="size-16 object-contain"
            />

            {/* UNDER REVIEW badge */}
            <div
              className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                background: "#FBBF241A",
                border: "1px solid #FBBF2440",
              }}
            >
              <Lock className="size-3" style={{ color: "#FFBD4C" }} />
              <span
                className="text-[10px] font-bold tracking-wide"
                style={{ color: "#FFBD4C" }}
              >
                UNDER REVIEW
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-4 text-[22px] leading-tight font-bold text-white">
              Application received
            </h2>

            {/* Description */}
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">
              Thanks for applying. Our team reviews applications within{" "}
              <span className="font-semibold text-white">
                2–3 business days
              </span>
              . We&apos;ll email you once your application has been approved.
            </p>
          </div>
        </div>

        {/* What happened next */}
        <div
          className="relative z-10 mt-4 rounded-2xl border p-4"
          style={cardStyle}
        >
          <h3 className="text-base font-semibold text-white">
            What happened next
          </h3>

          <div className="mt-4">
            {steps.map((step, i) => (
              <div key={step.label} className="flex gap-3">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className="flex size-6 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background:
                        step.state === "done"
                          ? "linear-gradient(180deg, #4ADE80 0%, #22C55E 100%)"
                          : step.state === "active"
                            ? "#FFBD4C"
                            : "rgba(255,255,255,0.1)",
                    }}
                  >
                    {step.state === "done" && (
                      <Check className="size-3 text-white" strokeWidth={2.5} />
                    )}
                    {step.state === "active" && (
                      <div className="size-2 rounded-full bg-white" />
                    )}
                    {step.state === "pending" && (
                      <div className="size-2 rounded-full bg-white/30" />
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="my-1 w-px flex-1 bg-white/10" />
                  )}
                </div>

                {/* Text */}
                <div className="pb-4">
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color:
                        step.state === "pending"
                          ? "rgba(255,255,255,0.35)"
                          : "white",
                    }}
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/50">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Need update */}
        <div
          className="relative z-10 mt-3 rounded-2xl border p-4"
          style={cardStyle}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "rgba(63, 216, 232, 0.12)",
                border: "1px solid rgba(63, 216, 232, 0.2)",
              }}
            >
              <Mail className="size-5" style={{ color: "#E1E1E1" }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">
                Need update on your application?
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/55">
                Email us at{" "}
                <a
                  href="mailto:support@arcpay.co.uk"
                  className="font-medium"
                  style={{ color: "#E1E1E1" }}
                >
                  support@arcpay.co.uk
                </a>{" "}
                within 24 hours and we&apos;ll work it in before review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotWhitelisted = () => {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { mutate: applyForReferral, isPending } = useApplyForReferral({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    },
  });

  if (submitted) return <ApplicationStatus />;

  const approvalCriteria = [
    "You have an active Krypt Kard account in good standing",
    "You have an audience or network you can refer (community, newsletter, social, business)",
    "You agree to our promotion guidelines and won't spam or misrepresent the product",
  ];

  return (
    <div className="relative pb-24">
      {/* Cyan radial glow — top left */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(63, 216, 232, 0.2) 0%, rgba(63, 216, 232, 0) 100%)",
          width: 440,
          height: 396,
          top: -143,
          left: -123,
        }}
      />

      <div className="relative z-10">
        {/* Pink radial glow — right edge */}
        <div
          className="pointer-events-none absolute inset-x-0 z-0"
          style={{
            background:
              "radial-gradient(350px 350px at 100% 50%, rgba(255, 174, 230, 0.15) 0%, rgba(255, 174, 230, 0) 100%)",
            height: 400,
            top: 180,
          }}
        />

        {/* Header */}
        <div className="relative z-10">
          <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
            REFERRAL PROGRAM
          </p>
          <h2 className="mt-0.5 text-xl font-bold text-white">
            Join the program
          </h2>
        </div>

        {/* Hero card */}
        <div
          className="relative z-10 mt-4 overflow-hidden rounded-2xl border p-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(24, 24, 24, 0.5) 0%, rgba(64, 64, 64, 0.5) 50%, rgba(24, 24, 24, 0.5) 100%)",
            borderColor: "#CECECE2E",
          }}
        >
          <div className="relative z-10">
            {/* Not whitelisted badge */}
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                background: "#FF81831A",
                border: "1px solid rgba(255, 129, 131, 0.3)",
              }}
            >
              <Lock className="size-3" style={{ color: "#FF8183" }} />
              <span
                className="text-[10px] font-bold tracking-wide"
                style={{ color: "#FF8183" }}
              >
                NOT YET WHITELISTED
              </span>
            </div>

            {/* Heading + illustration side by side */}
            <div className="mt-4 flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-[22px] leading-tight font-bold text-white">
                  Earn 25% on every,
                  <br />
                  referral <span style={{ color: "#E1E1E1" }}>forever</span>.
                </h2>
                <p className="mt-2 text-[11px] leading-relaxed text-white/60">
                  The Krypt Kard referral program is invitation-based. Apply
                  below and our team will review your fit within 2–3 business
                  days.
                </p>
              </div>

              {/* Illustration */}
              <img
                src="/images/referral-img.svg"
                alt="Referral illustration"
                className="w-[40%] shrink-0 self-center object-contain"
              />
            </div>

            {/* Stats row — full width below heading + illustration */}
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                <linearGradient
                  id="referralStatIconGradient"
                  x1="10%"
                  y1="0%"
                  x2="90%"
                  y2="100%"
                >
                  <stop offset="11.02%" stopColor="#E3F7FF" />
                  <stop offset="93.11%" stopColor="#D3BBF1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="mt-4 flex gap-2">
              {[
                {
                  icon: (
                    <TrendingUp
                      className="size-3.5"
                      style={{ stroke: "url(#referralStatIconGradient)" }}
                    />
                  ),
                  value: "25% earnings",
                  label: "On deposit fees",
                },
                {
                  icon: (
                    <Zap
                      className="size-3.5"
                      style={{ stroke: "url(#referralStatIconGradient)" }}
                    />
                  ),
                  value: "Lifetime",
                  label: "No expiry",
                },
                {
                  icon: (
                    <Users
                      className="size-3.5"
                      style={{ stroke: "url(#referralStatIconGradient)" }}
                    />
                  ),
                  value: "Unlimited",
                  label: "Referrals",
                },
              ].map((stat) => (
                <div
                  key={stat.value}
                  className="flex flex-1 flex-col gap-1 rounded-xl p-2.5"
                  style={{
                    background: "#EBE8F308",
                    border: "1px solid #FFFFFF0F",
                  }}
                >
                  {stat.icon}
                  <p className="text-[11px] leading-tight font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="text-[9px] text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Who we approve */}
        <div
          className="mt-4 rounded-2xl border p-4"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
            borderColor: "#CECECE2E",
          }}
        >
          <h3 className="text-base font-semibold text-white">Who we approve</h3>
          <div className="mt-3 flex flex-col gap-3">
            {approvalCriteria.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <div
                  className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(74, 222, 128, 0.15)",
                    border: "1px solid rgba(74, 222, 128, 0.3)",
                  }}
                >
                  <Check className="size-3" style={{ color: "#4ADE80" }} />
                </div>
                <p className="text-[12px] leading-relaxed text-white/70">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Terms checkbox */}
        <div
          className="mt-3 rounded-2xl border p-4"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
            borderColor: "#CECECE2E",
          }}
        >
          <label className="flex cursor-pointer items-start gap-3">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <div
                className="flex size-5 items-center justify-center rounded"
                style={{
                  background: agreed ? "#E1E1E1" : "rgba(255,255,255,0.08)",
                  border: agreed ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                }}
              >
                {agreed && (
                  <Check className="size-3 text-[#0f1326]" strokeWidth={3} />
                )}
              </div>
            </div>
            <p className="text-[12px] leading-relaxed text-white/70">
              I agree to the{" "}
              <span
                className="cursor-pointer font-medium"
                style={{ color: "#E1E1E1" }}
              >
                Partner Terms
              </span>{" "}
              and the{" "}
              <span
                className="cursor-pointer font-medium"
                style={{ color: "#E1E1E1" }}
              >
                Promotion Guidelines
              </span>
              . I won&apos;t misrepresent the product or spam users.
            </p>
          </label>
        </div>

        {/* Disclaimer */}
        <div
          className="mt-3 flex items-start gap-2.5 rounded-2xl border p-4"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
            borderColor: "#CECECE2E",
          }}
        >
          <Info className="mt-0.5 size-3.5 shrink-0 text-white/30" />
          <p className="text-[11px] leading-relaxed text-white/40">
            Approval is at Krypt Kard&apos;s discretion. We typically respond within
            2–3 business days. Approved partners get instant access to their
            referral dashboard and code.
          </p>
        </div>
      </div>
      {/* end overflow-x-hidden */}

      {/* Apply button — sticky bottom */}
      <div className="sticky right-0 bottom-0 left-0 z-20 bg-[#181818] px-0 pt-3 pb-6">
        <button
          disabled={!agreed || isPending}
          onClick={() => applyForReferral()}
          className="flex h-[44px] w-full items-center justify-center gap-2 text-sm font-semibold transition-opacity active:opacity-80"
          style={{
            background: "#E1E1E1",
            color: "#0f1326",
            opacity: agreed && !isPending ? 1 : 0.4,
            borderRadius: 12,
          }}
        >
          SUBMIT APPLICATION
          <ChevronRight className="size-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

const Referral = () => {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const limit = 10;

  const canRefer = !!user?.canRefer;
  const { data: statsData } = useGetUserReferralStats(canRefer);
  const { data: listData } = useGetUserReferralList(page, limit, canRefer);

  if (!user?.canRefer) {
    if (user?.hasPendingReferralRequest)
      return (
        <ApplicationStatus
          submittedAt={user.pendingReferralRequest?.createdAt}
        />
      );
    return <NotWhitelisted />;
  }
  const referrals = listData?.referrals ?? [];
  const totalPages = Math.ceil((listData?.total ?? 0) / limit);

  const filtered = referrals.filter((r) => {
    const name = `${r.firstName} ${r.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const feePercent = user?.referralFeePercent ?? 25;
  const totalEarnings = statsData?.totalEarnings ?? 0;
  const totalWithdrawn = statsData?.totalWithdrawn ?? 0;
  const totalReferrals = statsData?.totalReferrals ?? 0;
  const thisMonthReferrals = statsData?.thisMonthReferrals ?? 0;
  const thisMonthEarnings = statsData?.thisMonthEarnings ?? 0;
  const available = statsData?.available ?? 0;
  const minWithdrawal = statsData?.minWithdrawal ?? 100;
  const canTransfer = statsData?.canWithdraw ?? false;
  const referralCode = statsData?.referralCode ?? user?.id ?? "";
  const progress = Math.min((available / minWithdrawal) * 100, 100);

  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  return (
    <div className="relative pb-20">
      {/* Cyan radial glow — top left */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(63, 216, 232, 0.2) 0%, rgba(63, 216, 232, 0) 100%)",
          width: 440,
          height: 396,
          top: -143,
          left: -123,
        }}
      />
      <div className="relative z-10">
        {/* Pink radial glow — centre pinned to right edge, no horizontal overflow */}
        <div
          className="pointer-events-none absolute inset-x-0 z-0"
          style={{
            background:
              "radial-gradient(350px 350px at 100% 50%, rgba(255, 174, 230, 0.15) 0%, rgba(255, 174, 230, 0) 100%)",
            height: 400,
            top: 225,
          }}
        />
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Referrals</h2>
          <button
            onClick={() => handleShare(`signup?ref=${referralCode}`)}
            className="rounded-full p-1.5 transition-colors hover:bg-white/10"
          >
            <Share2 className="size-5 text-white" />
          </button>
        </div>

        {/* Hero Banner */}
        <div
          className="relative mt-4 overflow-hidden rounded-2xl border p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(24, 24, 24, 0.5) 0%, rgba(64, 64, 64, 0.5) 50%, rgba(24, 24, 24, 0.5) 100%)",
            borderColor: "#CECECE2E",
          }}
        >
          {/* Side-by-side layout */}
          <div className="relative z-10 flex items-center gap-3">
            {/* Left: text content */}
            <div className="min-w-0 flex-1">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
                }}
              >
                <Zap
                  className="size-3"
                  style={{ fill: "#E1E1E1", color: "#E1E1E1" }}
                />
                <span
                  className="text-[9px] font-bold tracking-wide"
                  style={{ color: "#E1E1E1" }}
                >
                  EARN {feePercent}% ON DEPOSIT FEE
                </span>
              </div>

              {/* Heading */}
              <h2 className="mt-2 text-[22px] leading-tight font-bold text-white">
                Invite friends,
                <br />
                earn <span style={{ color: "#E1E1E1" }}>forever.</span>
              </h2>

              {/* Description */}
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/70">
                Get {feePercent}% of every deposit fee from people you refer.
              </p>

              {/* Referral code + Copy link */}
              <div className="mt-3">
                <p className="text-[10px] text-white/60">Your referral code</p>
                <div className="mt-1.5 flex items-center gap-2">
                  {/* Code box — dashed border */}
                  <div
                    className="flex h-9 flex-1 items-center justify-between gap-2 rounded-lg px-3"
                    style={{
                      border: "1.5px dashed rgba(98, 209, 243, 0.4)",
                      background: "rgba(0,0,0,0.2)",
                    }}
                  >
                    <span className="overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap text-white">
                      {referralCode}
                    </span>
                    <Copy
                      text={referralCode}
                      icon="/icons/copy2.svg"
                      side="left"
                    />
                  </div>

                  {/* Copy link box */}
                  <button
                    onClick={handleCopyLink}
                    className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[11px] font-medium text-white/80 transition-colors hover:text-white"
                    style={{
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.06)",
                    }}
                  >
                    {linkCopied ? (
                      <Check className="size-3.5" style={{ color: "#4ADE80" }} />
                    ) : (
                      <Link2 className="size-3.5" />
                    )}
                    <span>{linkCopied ? "Copied" : "Copy link"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: illustration */}
            <img
              src="/images/referral-img.svg"
              alt="Referral illustration"
              className="w-[42%] shrink-0 self-center object-contain"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Total Referrals */}
          <div
            className="rounded-xl border p-3.5"
            style={{ background: "#FFFFFF08", borderColor: "#FFFFFF0F" }}
          >
            <div
              className="flex size-8 items-center justify-center rounded-[5px]"
              style={{ background: "#E1E1E11F" }}
            >
              <img src="/icons/gradient-users.svg" className="size-4" alt="" />
            </div>
            <p className="mt-3 text-[9px] font-semibold tracking-wider text-white/50 uppercase">
              Total Referrals
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {totalReferrals}
            </p>
            <p className="mt-0.5 text-[10px] text-white/40">
              +{thisMonthReferrals} this month
            </p>
          </div>

          {/* Total Earnings */}
          <div
            className="rounded-xl border p-3.5"
            style={{ background: "#FFFFFF08", borderColor: "#FFFFFF0F" }}
          >
            <div
              className="flex size-8 items-center justify-center rounded-[5px]"
              style={{ background: "#E1E1E11F" }}
            >
              <img src="/icons/gradient-wallet.svg" className="size-4" alt="" />
            </div>
            <p className="mt-3 text-[9px] font-semibold tracking-wider text-white/50 uppercase">
              Total Earnings
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              ${formatAmount(totalEarnings)}
            </p>
            <p className="mt-0.5 text-[10px] text-white/40">
              +${formatAmount(thisMonthEarnings)} this month
            </p>
          </div>

          {/* Available */}
          <div
            className="rounded-xl border p-3.5"
            style={{ background: "#4ADE8014", borderColor: "#4ADE8040" }}
          >
            <div
              className="flex size-8 items-center justify-center rounded-[5px]"
              style={{ background: "rgba(74, 222, 128, 0.12)" }}
            >
              <TrendingUp className="size-4" style={{ color: "#4ADE80" }} />
            </div>
            <p className="mt-3 text-[9px] font-semibold tracking-wider text-white/50 uppercase">
              Available
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              ${formatAmount(available)}
            </p>
            <p className="mt-0.5 text-[10px] text-white/40">
              Reach ${minWithdrawal} to withdraw
            </p>
          </div>

          {/* Total Withdrawn */}
          <div
            className="rounded-xl border p-3.5"
            style={{ background: "#B794F414", borderColor: "#B794F433" }}
          >
            <div
              className="flex size-8 items-center justify-center rounded-[5px]"
              style={{ background: "rgba(183, 148, 244, 0.12)" }}
            >
              <ArrowDownToLine
                className="size-4"
                style={{ color: "#B794F4" }}
              />
            </div>
            <p className="mt-3 text-[9px] font-semibold tracking-wider text-white/50 uppercase">
              Total Withdrawn
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              ${formatAmount(totalWithdrawn)}
            </p>
            <p className="mt-0.5 text-[10px] text-white/40">—</p>
          </div>
        </div>

        {/* Progress + Transfer Card */}
        <div
          className="mt-3 rounded-xl border p-4"
          style={{ background: "#4ADE8014", borderColor: "#4ADE807A" }}
        >
          {/* Wallet icon */}
          <div
            className="flex size-8 items-center justify-center rounded-[5px]"
            style={{ background: "#4ADE8033" }}
          >
            <img
              src="/icons/gradient-wallet-green.svg"
              className="size-5"
              alt=""
            />
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "#48DC7E" }}
            />
          </div>

          {/* Labels */}
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-white/70">
              Reach the{" "}
              <span className="font-semibold text-white">${minWithdrawal}</span>{" "}
              minimum
            </span>
            <span className="font-medium text-white/70">
              ${formatAmount(available)} / ${minWithdrawal}
            </span>
          </div>

          {/* Transfer Button */}
          <Button
            className="mt-4 w-full gap-2 py-5 text-sm font-semibold text-white transition-opacity"
            style={{
              background: "linear-gradient(180deg, #4ADE80 0%, #22C55E 100%)",
              opacity: canTransfer ? 1 : 0.5,
            }}
            disabled={!canTransfer}
          >
            <img
              src="/icons/gradient-wallet-green.svg"
              className="size-4"
              style={{ filter: "brightness(0.2) saturate(2)" }}
              alt=""
            />
            Transfer to wallet
          </Button>
        </div>

        {/* Referred Users */}
        <div className="mt-6">
          <h3 className="text-base font-medium text-white">Referred users</h3>

          {/* Search */}
          <div
            className="mt-3 flex h-10 w-full items-center gap-2 rounded-full px-3"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
              border: "1px solid #D9D9D966",
            }}
          >
            <Search className="size-4 shrink-0 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="min-w-0 flex-1 border-0 bg-transparent text-base text-white outline-none placeholder:text-white/40"
            />
          </div>

          {/* User list */}
          <div className="mt-3 flex flex-col gap-2">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-white/40">
                No referred users found
              </p>
            ) : (
              filtered.map((r, i) => {
                const initials =
                  `${r.firstName[0]}${r.lastName[0]}`.toUpperCase();
                const isTopEarner = i === 0 && page === 0;
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-xl p-3"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
                      border: "1px solid #3A436D",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
                        border: "1px solid #545A93",
                        color: "#E1E1E1",
                      }}
                    >
                      {initials}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium text-white">
                          {r.firstName} {r.lastName}
                        </span>
                        {isTopEarner && (
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[8px] font-medium tracking-wide"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
                              color: "#E1E1E1",
                            }}
                          >
                            TOP EARNER
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[11px] font-light text-[#8D94AC]">
                        {r.email}
                        <span className="mx-1.5 text-sm opacity-50">•</span>
                        Joined {timeAgo(r.createdAt)}
                      </p>
                    </div>

                    {/* Earnings */}
                    <span
                      className="shrink-0 text-xs font-semibold"
                      style={{ color: "#E1E1E1" }}
                    >
                      {r.earnedAmount > 0
                        ? `+$${formatAmount(r.earnedAmount)}`
                        : "$0.00"}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-full px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:text-white disabled:opacity-30"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                Prev
              </button>
              <span className="text-xs text-white/50">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-full px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:text-white disabled:opacity-30"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* How it works */}
        <div
          className="mt-6 rounded-2xl border p-4"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 153, 153, 0.1) 100%)",
            borderColor: "#CECECE2E",
          }}
        >
          <h3 className="text-base font-medium text-white">How it works</h3>

          <div className="mt-4 flex flex-col">
            {[
              {
                n: 1,
                title: "Share your code",
                desc: "Send your referral code or link to anyone",
              },
              {
                n: 2,
                title: "They sign up & deposit",
                desc: "Friends create an account and fund their cards",
              },
              {
                n: 3,
                title: `You earn ${feePercent}%`,
                desc: `Get a ${feePercent === 25 ? "quarter" : `${feePercent}%`} of every deposit fee they pay`,
              },
            ].map((step, i, arr) => (
              <div key={step.n} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      background:
                        "#E1E1E1",
                    }}
                  >
                    {step.n}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="my-1 w-px flex-1 bg-white/10" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="mt-0.5 text-xs font-light text-white/50">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share button — fixed to bottom of sheet */}
      <div className="sticky right-0 bottom-0 left-0 z-20 bg-[#181818] px-0 pt-3 pb-6">
        <button
          onClick={() => handleShare(`signup?ref=${referralCode}`)}
          className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-[#0f1326] transition-opacity active:opacity-80"
          style={{
            background: "#E1E1E1",
          }}
        >
          <Share2 className="size-4" />
          Share Your Link
        </button>
        <p className="mt-2 text-center text-[11px] text-white/40">
          Withdraw once you reach $100 &bull; Earnings credited within 24 hours
        </p>
      </div>
    </div>
  );
};

export default Referral;
