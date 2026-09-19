const Card2 = ({
  className,
  top,
  onClick,
  card,
}: {
  className?: string;
  top?: number;
  onClick?: () => void;
  card?: Card;
}) => {
  return (
    <>
      <div
        onClick={onClick}
        className={`relative aspect-[15/8] max-w-lg overflow-hidden rounded-xl shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px] ${className}`}
        style={{
          top: `${top}px`,
          background:
            "linear-gradient(70.79deg, #4547B1 0.39%, #82BAE3 98.42%)",
        }}
      >
        <div className="absolute top-0 right-0 z-[1] w-1/2">
          <img src="/images/mastercard-lines.svg" className="w-full" alt="" />
        </div>
        <div className="flex h-2/3 flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <img
              src="/images/logo-transparent.svg"
              className="size-6"
              alt="logo"
            />
          </div>
          <span className="font-inter text-xl font-bold text-white">
            **** **** **** {card?.last4}
          </span>
        </div>
        <div className="h-1/3 text-white">
          <div className="flex items-center justify-between px-4 pt-2">
            <div className="text-lg leading-6 font-medium text-white">
              <p className="text-full font-semibold uppercase">
                {card?.firstName} {card?.lastName}
              </p>
            </div>
            {card?.network === "VISA" || card?.network === "Visa" ? (
              <img src="/images/visa-white.png" className="w-8" alt="" />
            ) : (
              <img src="/images/mastercard-logo.svg" alt="" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card2;
