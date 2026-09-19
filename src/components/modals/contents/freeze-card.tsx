import { useFreezeCards, useUnfreezeCards } from "@/hooks/use-mutations";

import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Throbber from "@/components/throbber";
import { Snowflake } from "lucide-react";

const FreezeCard = ({
  cardData,
  closeModal,
}: {
  cardData: Card;
  closeModal: () => void;
}) => {
  const { id: cardId, status: cardStatus } = cardData;
  const queryClient = useQueryClient();

  const { mutateAsync: freezeCard, isPending: isFreezing } = useFreezeCards({
    id: cardId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardInfo"] });
      closeModal();
    },
  });
  const { mutateAsync: unfreezeCard, isPending: isUnfreezing } =
    useUnfreezeCards({
      id: cardId,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cardInfo"] });
        closeModal();
      },
    });

  return (
    <div className="mx-auto flex flex-col items-center text-center">
      <div className="text-dark-text-400 border-primary-100 bg-dark-grey-200 flex size-16 items-center justify-center rounded-full border">
        <Snowflake className="size-6" strokeWidth={1.5} />
      </div>
      <p className="text-white mt-4 text-2xl font-medium">
        {cardStatus === "Frozen" ? "Unfreeze" : "Freeze"} Card
      </p>
      <p className="text-white text-sm">
        Are you sure you want to{" "}
        {cardStatus === "Frozen" ? "UNFREEZE" : "FREEZE"} this card?
      </p>

      <div className="mt-6 flex w-full gap-2">
        <Button
          variant={"outline"}
          onClick={() => closeModal()}
          className="border-dark-background-secondary text-white grow rounded-md border bg-transparent"
        >
          Close
        </Button>
        <Button
          onClick={() => {
            if (cardStatus === "Frozen") {
              unfreezeCard();
            } else {
              freezeCard();
            }
          }}
          className="text-[#080808] bg-dark-primary-main/80 hover:bg-dark-primary-main/60 grow rounded-md"
        >
          {isFreezing || isUnfreezing ? (
            <Throbber />
          ) : cardStatus === "Frozen" ? (
            " Unfreeze"
          ) : (
            "Freeze"
          )}
        </Button>
      </div>
    </div>
  );
};

export default FreezeCard;
