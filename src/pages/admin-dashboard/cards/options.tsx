import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFlagCardAdmin, useUnflagCardAdmin } from "@/hooks/use-mutations";
import { useAdminModals } from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { Settings, Snowflake, Trash2 } from "lucide-react";

const CardOptions = ({
  status,
  id,
  card,
}: {
  status: Card["status"];
  id: string;
  card: Card;
}) => {
  const queryClient = useQueryClient();
  const { mutate: freezeCard, isPending: isFreezingCard } = useFlagCardAdmin({
    id: id,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allCards"] }),
  });
  const { mutate: unfreezeCard, isPending: isUnFreezingCard } =
    useUnflagCardAdmin({
      id: id,
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["allCards"] }),
    });

  const handleFlag = () => {
    if (status === "Active") {
      freezeCard();
    } else {
      unfreezeCard();
    }
  };
  return (
    <div className="flex items-center gap-4 *:min-w-20">
      <Button
        variant="ghost"
        onClick={() => {
          useAdminModals.setState({
            assignCardIsOpen: true,
            assignCardData: card,
          });
        }}
        className="bg-primary-purple/10 hover:bg-primary-purple/20 text-primary-purple flex h-auto shrink-0 items-center gap-1 rounded-full px-2 py-1"
      >
        <span className="mb-0.5">Assign card</span>
      </Button>
      <Button
        onClick={() =>
          useAdminModals.setState({
            cardDetailsIsOpen: true,
            cardDetailsData: card,
          })
        }
        className={"p-0"}
        variant={"link"}
      >
        See details
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            className={
              "flex size-8 !min-w-0 items-center justify-center rounded-full bg-[#E3E8FF] text-[#001788]"
            }
          >
            <Settings className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="space-y-2 rounded-[10px] p-2"
          align="end"
        >
          <DropdownMenuItem
            disabled={status === "Inactive"}
            onClick={() => {
              useAdminModals.setState({
                deleteCardIsOpen: true,
                deleteCardData: card,
              });
            }}
            className="bg-opacity-5 group hover:bg- flex items-center gap-2 rounded-md bg-[#FF3E3E12] p-2 text-[#FF3E3E]"
          >
            <Trash2 className="group-hover: size-3 text-[#FF3E3E]" />
            <span className="">Delete Card</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={
              isFreezingCard || isUnFreezingCard || status === "Inactive"
            }
            onClick={() => handleFlag()}
            className="bg-opacity-5 bg-primary-purple/10 text-primary-purple flex items-center gap-2 rounded-md p-2 hover:opacity-80"
          >
            <Snowflake className="size-3" />
            <span className="mb-0.5">
              {isFreezingCard
                ? "Freezing..."
                : isUnFreezingCard
                  ? "Unfreezing..."
                  : status !== "Active"
                    ? "Unfreeze"
                    : "Freeze"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CardOptions;
