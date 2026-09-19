import { useCardsStore } from "@/zustand/store";
import { useDeleteCardAdmin } from "@/hooks/use-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Throbber from "@/components/throbber";
import { Trash2 } from "lucide-react";

const DeleteCard = ({
  cardData,
  closeModal,
}: {
  cardData: Card;
  closeModal: () => void;
}) => {
  const { id: cardId } = cardData;
  const queryClient = useQueryClient();

  const { mutate: deleteCard, isPending: isDeletingCard } = useDeleteCardAdmin({
    id: cardId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCards"] });
      useCardsStore.setState({
        deleteIsOpen: false,
        cardId: null,
      });
    },
  });

  return (
    <div className="mx-auto flex flex-col items-center text-center">
      <div className="border-primary-100 bg-dark-error-300 text-dark-text-400 flex size-16 items-center justify-center rounded-full border">
        <Trash2 className="size-6 text-white" strokeWidth={1.5} />
      </div>
      <p className="text-white mt-4 text-2xl font-medium">
        Delete Card
      </p>
      <p className="text-white text-sm">
        Are you sure you want to delete this card?
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
            deleteCard();
          }}
          className="bg-dark-error-300 hover:bg-dark-error-300/90 grow rounded-md"
        >
          {isDeletingCard ? <Throbber /> : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default DeleteCard;
