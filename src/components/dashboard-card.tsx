/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";
import { FC, useState } from "react";
import { useFormatAmountWithCurrency } from "@/hooks/use-format-with-currency";
import { resolveCardStyle } from "@/pages/dashboard/shop/page";
import { useCardBalance } from "@/hooks/use-queries";

interface CardProps {
  className?: string;
  card: Card;
}

const Card: FC<CardProps> = ({ className, card }) => {
  const navigate = useNavigate();
  const [showAmount, setShowAmount] = useState(true);
  const formatAmount = useFormatAmountWithCurrency();
  const { balance } = useCardBalance(card);
  const cardStyle = resolveCardStyle(card?.bin, card?.network);

  return (
    <div
      className={`group font-dm-sans aspect-[1.586/1] max-w-70 min-w-68 overflow-hidden rounded-xl ${className}`}
      style={{ background: cardStyle.background }}
      onClick={() => navigate(`/dashboard/cards/${card?.id}`)}
    >
      <div className="group shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]} relative h-full">
        <div className="relative z-10 flex h-full flex-col justify-end p-4">
          <div className="text-white">
            <div className="flex items-center gap-2 font-semibold">
              <span>{`${showAmount ? "****" : formatAmount(balance?.available)} `}</span>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAmount(!showAmount);
                }}
                variant={"ghost"}
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
                <img src="/images/mastercard-logo.svg" className="w-8" alt="" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
