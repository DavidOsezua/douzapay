import { Eye, EyeOff, LucideArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { FC, useState } from "react";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";
import { resolveCardStyle } from "@/pages/dashboard/shop/page";
import { useCardBalance } from "@/hooks/use-queries";

type CardProps = {
  className?: string;
  card: Card;
  showCta?: boolean;
};

const Card: FC<CardProps> = ({ className, card, showCta = true }) => {
  const navigate = useNavigate();
  const formatAmount = useFormatAmountWithCurrency();
  const { balance } = useCardBalance(card);
  const [showAmount, setShowAmount] = useState(true);
  const isFrozen = card?.status === "Frozen";
  const style = resolveCardStyle(card?.bin, card?.network);

  return (
    <div
      className="group relative block max-w-lg min-w-68 overflow-hidden rounded-xl"
      onTouchStart={(e) => {
        e.currentTarget.focus();
      }}
      tabIndex={1}
    >
      {showCta && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onTouchStart={() => {}}
          className="absolute inset-0 z-30 hidden items-center justify-center bg-black/70 group-hover:flex group-focus:flex group-active:flex"
        >
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => navigate(`/dashboard/cards/${card.id}`)}
            className="curson-pointer text-primary-500 flex cursor-pointer items-center gap-2.5 rounded-full border border-[#3C4054] px-4 py-1 transition-all duration-300 hover:opacity-80"
            style={{
              background: " linear-gradient(90deg, #CCD6E6 0%, #B2D8EA 100%)",
            }}
          >
            <div className="bg-primary-500/40 flex size-4 items-center justify-center rounded-full">
              <LucideArrowUpRight className="size-3" />{" "}
            </div>
            <span>View</span>
          </motion.button>
        </motion.div>
      )}
      <div
        className={`group font-dm-sans aspect-[1.586/1] max-w-70 min-w-68 overflow-hidden rounded-xl ${className}`}
        style={{
          background: isFrozen
            ? "linear-gradient(11.41deg, #797979 5.95%, #15161C 102.98%)"
            : style.background,
        }}
      >
        <div className="group shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]} relative h-full">
          {isFrozen && (
            <div className="absolute inset-0 z-0">
              <img
                className="absolute inset-0 z-10 h-full w-full object-cover opacity-20 bg-blend-overlay"
                src="/images/card-noise.webp"
              />
            </div>
          )}
          <div
            className={`relative z-10 flex h-full flex-col justify-end p-4 ${isFrozen ? "pointer-events-none opacity-50" : ""}`}
          >
            <div className="text-white">
              <div className="flex items-center gap-2 font-semibold">
                <span>
                  {showAmount ? formatAmount(balance?.available) : "****"}
                </span>
                <Button
                  variant={"ghost"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAmount(!showAmount);
                  }}
                  className="size-auto cursor-pointer !p-1 hover:bg-white/10"
                >
                  {showAmount ? (
                    <EyeOff className="size-4 text-white/40" />
                  ) : (
                    <Eye className="size-4 text-white/40" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-medium text-white">
                    **** **** **** {card?.last4}
                  </span>{" "}
                  <div className="text-[10px] font-medium text-white capitalize">
                    {card?.firstName} {card?.lastName}
                  </div>
                </div>
                {card?.network === "VISA" || card?.network === "Visa" ? (
                  <img src="/images/visa-white.png" className="w-8" alt="" />
                ) : (
                  <img
                    src="/images/mastercard-logo.svg"
                    className="w-8"
                    alt=""
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
