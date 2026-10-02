import { useNavigate } from "react-router-dom";
import { useGetCards } from "@/hooks/use-queries";
import Card from "@/components/card";
import CardSkeleton from "@/components/skeletons/card-skeleton";
import { Button } from "@/components/ui/button";

const StatementCardSelect = ({
  onSelect,
  closeSheet,
}: {
  onSelect: (card: Card) => void;
  closeSheet: () => void;
}) => {
  const { data: cards, isLoading } = useGetCards();
  const navigate = useNavigate();

  const selectable: Card[] = cards?.data ?? [];

  const goToBuyCard = () => {
    closeSheet();
    navigate("/dashboard/cards/shop");
  };

  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : selectable.length > 0 ? (
        <div className="flex flex-col gap-4">
          {selectable.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelect(card)}
              className="text-left"
            >
              <Card card={card} showCta={false} />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex h-100 items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white">No Cards</h2>
            <p className="text-white/40">
              Instantly create a card to start making transactions
            </p>
            <Button
              onClick={goToBuyCard}
              className="text-[#242424] bg-dark-primary-main hover:bg-dark-primary-main/80 mt-4 h-10 rounded-full px-6 text-xs font-medium"
            >
              Buy Card
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatementCardSelect;
