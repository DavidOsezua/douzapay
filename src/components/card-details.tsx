import { motion } from "framer-motion";
import { useCardsStore } from "@/zustand/store";
import { useGetCardDetails, useGetCardInfo } from "@/hooks/use-queries";
import Throbber from "./throbber";
import { Button } from "./ui/button";
import Copy from "./copy";
import { useEffect } from "react";

export const CardDetail = () => {
  const { cardId } = useCardsStore((state) => state);

  const { data: cardDetails, isLoading: isLoadingDetails } = useGetCardDetails({
    id: cardId,
    enabled: cardId !== null,
  });

  const { data: cardInfo, isLoading: isLoadingInfo } = useGetCardInfo({
    id: cardId,
    enabled: cardId !== null,
  });

  useEffect(() => {
    if (cardId !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [cardId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-20 flex h-dvh items-center justify-center bg-black/50 backdrop-blur-lg"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="h-auto max-w-100 px-4 py-6 lg:w-150"
      >
        <div className="preserve-3d relative mx-auto h-[200px] w-[320px]">
          <div className="absolute h-full w-full rounded-xl">
            <div className="absolute flex h-full w-full flex-col justify-between rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 px-6 py-4 text-white">
              <div className="my-4 flex h-10 w-full items-center justify-center gap-2 bg-gray-700 text-xl font-semibold tracking-wide">
                <span>{cardDetails?.cardNo}</span>
                <Copy variant="white" text={cardDetails?.cardNo} />
              </div>
              <div className="mb-2 space-y-4">
                {isLoadingDetails || isLoadingInfo ? (
                  <div className="flex h-20 items-center justify-center">
                    <Throbber />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-xs opacity-70">
                          Billing Address
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-sm">
                            {cardInfo?.billingAddress
                              ? `${cardInfo?.billingAddress?.addressLine1}, ${cardInfo?.billingAddress?.city}, ${cardInfo?.billingAddress?.state} ${cardInfo?.billingAddress?.postalCode}, ${cardInfo?.billingAddress?.country}`
                              : ""}
                          </span>
                          <Copy
                            variant="white"
                            text={`${cardInfo?.billingAddress?.addressLine1}, ${cardInfo?.billingAddress?.city}, ${cardInfo?.billingAddress?.state} ${cardInfo?.billingAddress?.postalCode}, ${cardInfo?.billingAddress?.country}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-xs opacity-70">CVV</div>
                        <div className="flex items-center gap-2 font-mono">
                          <span> {cardDetails?.cvv || "***"}</span>
                          <Copy variant="white" text={cardDetails?.cvv} />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Zip code</div>
                        <div className="flex items-center gap-2 font-mono">
                          <span>
                            {cardInfo?.billingAddress?.postalCode || ""}
                          </span>
                          <Copy variant="white" text={cardInfo?.zipCode} />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Expires</div>
                        <div className="flex items-center gap-2 font-mono">
                          <span>
                            {cardDetails?.expMonth}/{cardDetails?.expYear}
                          </span>

                          <Copy
                            variant="white"
                            text={`${cardDetails?.expMonth}/${cardDetails?.expYear}`}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>{" "}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() =>
              useCardsStore.setState({ cardId: null, isCardDetailsOpen: false })
            }
            className={"text-lg"}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
