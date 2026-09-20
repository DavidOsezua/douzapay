import { Button } from "@/components/ui/button";
import { useGetCards } from "@/hooks/use-queries";
import { useModalStore } from "@/zustand/modalStore";
import { resolveCardStyle } from "@/pages/dashboard/shop/page";
import { useState } from "react";

const Transfer2Card = ({ closeSheet }) => {
  const { data: cards, isLoading: cardIsLoading } = useGetCards();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const { openModal } = useModalStore();

  return (
    <div className="text-white mt-4 px-2">
      <h2 className="font-semibold">Top Up to Card</h2>

      <div className="mt-4">
        <h4 className="text-sm">Select card you want to Top Up</h4>
        {cardIsLoading ? (
          <div className="relative mt-6 flex flex-col gap-4">
            {[1, 2, 3].map((index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : cards?.data.length > 0 ? (
          <div>
            <div className="mt-6 flex flex-col gap-4">
              {cards?.data.map((card: Card) => (
                <Card
                  selectedCard={selectedCard}
                  setSelectedCard={setSelectedCard}
                  cardData={card}
                  key={card.id}
                />
              ))}
            </div>
            <div className="mt-6">
              <Button
                disabled={!selectedCard}
                onClick={() => {
                  closeSheet();
                  openModal("fundCard", { cardData: selectedCard });
                }}
                className="text-primary-500 bg-dark-primary-main h-10 w-full hover:bg-dark-primary-100"
              >
                Proceed
              </Button>
            </div>
          </div>
        ) : (
          <div className="w- flex h-100 items-center justify-center">
            <div className="flex flex-col text-center">
              <h2 className="text-2xl font-bold">No Cards</h2>
              <p className="text-white/40">
                Instantly create a card to start making transactions
              </p>

              {/* <div className="mt-4">
                <Button
                  className="w-full"
                  type="submit"
                  onClick={() => {
                    navigate("/dashboard/shop/virtual-cards");
                  }}
                >
                  Create Card
                </Button>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfer2Card;

const CardSkeleton = () => {
  return (
    <div className="h-18 w-full max-w-lg animate-pulse overflow-hidden rounded-xl bg-gray-700 shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]"></div>
  );
};

const Card = ({
  cardData,
  selectedCard,
  setSelectedCard,
}: {
  cardData: Card;
  selectedCard: Card | null;
  setSelectedCard: (card: Card) => void;
}) => {
  const isActive = selectedCard?.id === cardData.id;
  const style = resolveCardStyle(cardData.bin, cardData.network);
  return (
    <div
      role="button"
      onClick={() => setSelectedCard(cardData)}
      tabIndex={0}
      className={`relative overflow-hidden rounded-xl border border-[#CECECE2E] p-4 transition-all hover:cursor-pointer active:scale-x-98 ${
        isActive ? "" : "opacity-50"
      }`}
      style={{ background: style.background }}
    >
      {isActive && (
        <div className="bg-primary-100 absolute top-2 right-2 z-20 size-3 rounded-full" />
      )}
      <div className="relative z-10 flex h-full w-full items-center justify-between">
        <div>
          <img
            src={style.logoImage ?? "/images/logo-transparent-light.svg"}
            className="mb-2 h-3 w-auto object-contain"
            alt="logo"
          />
          <p className="text-sm text-white">**** **** **** {cardData.last4}</p>
          <p className="text-[10px] text-white/70">
            {cardData.firstName} {cardData.lastName}
          </p>
        </div>
        {cardData.network === "VISA" || cardData.network === "Visa" ? (
          <img className="w-10" src="/images/visa-white.png" alt="" />
        ) : (
          <img className="w-10" src="/images/mastercard-logo.svg" alt="" />
        )}
      </div>
    </div>
  );
};
