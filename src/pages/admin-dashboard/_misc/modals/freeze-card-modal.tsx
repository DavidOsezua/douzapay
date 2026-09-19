import { motion } from "framer-motion";
import { useAdminModals } from "@/zustand/store";
import { useFlagCardAdmin, useUnflagCardAdmin } from "@/hooks/use-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Snowflake } from "lucide-react";

const FreezeCardModal = () => {
  const { freezeCardData } = useAdminModals((state) => state);
  const queryClient = useQueryClient();

  const { mutate: freezeCard, isPending: isFreezingCard } = useFlagCardAdmin({
    id: freezeCardData!.id!,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCards"] });
      queryClient.invalidateQueries({
        queryKey: ["user", freezeCardData?.id],
      });
      useAdminModals.setState({
        freezeCardIsOpen: false,
        freezeCardData: null,
      });
    },
  });
  const { mutate: unfreezeCard, isPending: isUnFreezingCard } =
    useUnflagCardAdmin({
      id: freezeCardData!.id!,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allCards"] });
        queryClient.invalidateQueries({
          queryKey: ["user", freezeCardData?.id],
        });
        useAdminModals.setState({
          freezeCardIsOpen: false,
          freezeCardData: null,
        });
      },
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-100 flex h-dvh items-center justify-center bg-black/50 backdrop-blur-lg"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="z-1000 h-auto max-w-100 rounded-2xl bg-white px-4 py-4 lg:w-150"
      >
        <div className="mx-auto my-2 flex size-10 items-center justify-center rounded-full bg-slate-900">
          <Snowflake className="size-6 text-white" />
        </div>
        <div className="mx-auto text-center text-lg">
          <p className="text-xl font-medium text-black">
            {freezeCardData?.status === "Frozen" ? "Unfreeze" : "Freeze"} Card
          </p>
          <p className="text-primary-50 text-sm">
            Are you sure you want to{" "}
            {freezeCardData?.status === "Frozen" ? "unfreeze" : "freeze"} this
            card?
          </p>

          <div className="mt-6 flex gap-4 *:grow">
            <Button
              variant={"outline"}
              onClick={() => {
                useAdminModals.setState({
                  freezeCardIsOpen: false,
                  freezeCardData: null,
                });
              }}
              className="rounded-md"
            >
              Close
            </Button>
            <Button
              isLoading={isFreezingCard || isUnFreezingCard}
              onClick={() => {
                freezeCardData?.status === "Frozen"
                  ? unfreezeCard()
                  : freezeCard();
              }}
              className="rounded-md bg-slate-900 hover:bg-slate-900/90"
            >
              {freezeCardData?.status === "Frozen" ? "Unfreeze" : "Freeze"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FreezeCardModal;
