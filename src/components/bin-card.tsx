import { FC, CSSProperties } from "react";

type BinCardShape = {
  id: number;
  name: string;
  price: number;
  defaultPrice?: number;
  bin: string;
  binValue: string;
  network?: string;
  cardType?: string;
  provider?: string;
  needDepositForActiveCard?: boolean;
  needCardHolder?: boolean;
  minDepositAmount?: number;
  maxDepositAmount?: number;
  linesImage?: string;
  noiseImage?: string;
  background?: string;
  cardBorder?: string;
  logoImage?: string;
  blBlurImage?: string;
  tlBlurImage?: string;
  trBlurImage?: string;
  payBadgeBackground?: string;
};

type BinCardProp = {
  card: BinCardShape;
  className?: string;
};

const BinCard: FC<BinCardProp> = ({ card, className }) => {
  const fillBackground =
    card.background ??
    "linear-gradient(11.41deg, #161A2E 5.95%, #15161C 102.98%)";

  return (
    <div
      className={`group font-dm-sans h-[160px] overflow-hidden rounded-xl ${
        card.cardBorder ? "card-gradient-border" : ""
      } ${className}`}
      style={{
        background: fillBackground,
        ...(card.cardBorder
          ? ({
              "--card-border-gradient": card.cardBorder,
            } as CSSProperties)
          : {}),
      }}
    >
      <div className="relative h-full shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]">
        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <img
            className="absolute inset-0 z-10 h-full w-full object-cover opacity-40 mix-blend-overlay"
            src={card.noiseImage ?? undefined}
            alt=""
          />{" "}
          {card.blBlurImage && (
            <img className="absolute bottom-0 left-0" src={card.blBlurImage} />
          )}
          {card.tlBlurImage && (
            <img className="absolute top-0 left-0" src={card.tlBlurImage} />
          )}
          {card.trBlurImage && (
            <img className="absolute top-0 right-0" src={card.trBlurImage} />
          )}
          <img
            className="absolute top-0 right-0 z-[1]"
            src={card.linesImage ?? "/images/card-lines.svg"}
            alt=""
          />
        </div>

        <div className="relative z-10 flex h-2/3 flex-col justify-between px-4 pt-4">
          <div className="flex justify-end">
            <img
              src={card.logoImage ?? "/images/logo-transparent-light.svg"}
              className="h-3.5 w-auto object-contain"
              alt="logo"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-white">
              {card.defaultPrice != null && card.defaultPrice !== card.price
                ? `${card.price} - ${card.defaultPrice} USD`
                : `${card.price} USD`}
            </span>
            <span className="text-sm font-medium tracking-wide text-white">
              {card.binValue.slice(0, 4)} ****
            </span>
          </div>
        </div>

        <div className="relative z-10 h-1/3 bg-transparent">
          <div className="flex h-full items-center justify-between px-4 pt-2">
            <div
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1"
              style={{
                background:
                  card.payBadgeBackground ??
                  "linear-gradient(90deg, rgba(240, 229, 255, 0.16) 0%, rgba(102, 22, 167, 0.16) 100%)",
                backdropFilter: "blur(4px)",
              }}
            >
              <img
                src="/icons/google.png"
                alt="Google"
                className="size-[11px] object-contain"
              />
              <img
                src="/icons/apple.png"
                alt="Apple"
                className="size-[11px] object-contain"
              />
              <span className="text-[10px] font-medium text-white">
                Pay enabled
              </span>
            </div>
            {card.network === "Visa" ? (
              <img
                src="/images/visa-white.png"
                alt="Visa"
                className="h-4 object-contain"
              />
            ) : card.network === "MasterCard" ? (
              <img
                src="/images/mastercard-logo.svg"
                alt="Mastercard"
                className="h-6 object-contain"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinCard;
