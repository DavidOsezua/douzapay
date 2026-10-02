import { ArrowRight } from "lucide-react";
import { ICON_MAP } from "@/lib/token-icons";
import { cn } from "@/lib/utils";

// ETH is drawn inline on the light disc the designs use; TRX and the
// stablecoins come from ICON_MAP.
const EthGlyph = () => (
  <svg viewBox="0 0 24 24" className="size-[55%]" aria-hidden="true">
    <path d="M12 2v7.2l6.2 2.8L12 2Z" fill="#6B6B6B" fillOpacity=".6" />
    <path d="M12 2 5.8 12 12 9.2V2Z" fill="#6B6B6B" />
    <path d="M12 16.9V22l6.2-8.6L12 16.9Z" fill="#6B6B6B" fillOpacity=".6" />
    <path d="M12 22v-5.1L5.8 13.4 12 22Z" fill="#6B6B6B" />
    <path d="m12 15.6 6.2-3.6L12 9.2v6.4Z" fill="#3D3D3D" fillOpacity=".6" />
    <path d="M5.8 12 12 15.6V9.2L5.8 12Z" fill="#6B6B6B" />
  </svg>
);

const SwapTokenIcon = ({
  symbol,
  src,
  className,
}: {
  symbol: string;
  // A small network badge overlaid bottom-right on the coin — the token
  // itself always stays visible, this doesn't replace its icon.
  src?: string | null;
  className?: string;
}) => {
  const base = "flex shrink-0 items-center justify-center rounded-full";

  if (src)
    return (
      <div className={cn("relative shrink-0", className)}>
        {symbol === "ETH" ? (
          <span className={cn(base, "bg-[#E8E8F2]", "size-full")}>
            <EthGlyph />
          </span>
        ) : (
          <img
            src={ICON_MAP[symbol] ?? "/icons/usdt.svg"}
            alt={symbol}
            className="size-full shrink-0 rounded-full"
          />
        )}
        <img
          src={src}
          alt=""
          className="border-bg-primary absolute -right-1 -bottom-1 size-[55%] rounded-full border-2"
        />
      </div>
    );

  if (symbol === "ETH")
    return (
      <span className={cn(base, "bg-[#E8E8F2]", className)}>
        <EthGlyph />
      </span>
    );

  return (
    <img
      src={ICON_MAP[symbol] ?? "/icons/usdt.svg"}
      alt={symbol}
      className={cn("shrink-0 rounded-full", className)}
    />
  );
};

export const SwapPairIcon = ({
  from,
  fromSrc,
  to,
  toSrc,
  size = "size-9",
  compact = false,
}: {
  from: string;
  fromSrc?: string | null;
  to?: string;
  toSrc?: string | null;
  size?: string;
  // Tighter arrow spacing, for the phone cards.
  compact?: boolean;
}) => (
  <div
    className={cn("flex shrink-0 items-center", compact ? "gap-1" : "gap-1.5")}
  >
    <SwapTokenIcon symbol={from} src={fromSrc} className={size} />
    {to && (
      <>
        <ArrowRight
          className={cn("text-white/60", compact ? "size-3" : "size-4")}
        />
        <SwapTokenIcon symbol={to} src={toSrc} className={size} />
      </>
    )}
  </div>
);

export default SwapTokenIcon;
