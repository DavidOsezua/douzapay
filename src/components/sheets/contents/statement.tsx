import { useEffect, useRef, useState } from "react";
import StatementCardSelect from "./statement-card-select";
import StatementDateForm from "./statement-date-form";

type Mode = "wallet" | "card";

// The Wallet/Card choice is made in the `statementType` modal before this
// sheet opens, so `mode` always arrives in the payload. Wallet is a single
// step (date form); card is two (pick a card, then the date form).
const Statement = ({
  step,
  setStep,
  closeSheet,
  mode = "wallet",
  card: initialCard,
}: {
  step: number;
  setStep: (s: number) => void;
  closeSheet: () => void;
  mode?: Mode;
  card?: Card;
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(
    initialCard ?? null,
  );

  // Deep link from the card More-options modal: skip the card list and go
  // straight to the date form for the card that was passed in.
  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current) return;
    deepLinked.current = true;
    if (mode === "card" && initialCard) setStep(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guard against a popstate landing on the card date step with no card picked.
  useEffect(() => {
    if (mode === "card" && step === 2 && !selectedCard) setStep(1);
  }, [mode, step, selectedCard, setStep]);

  if (mode === "wallet") {
    return (
      <div className="mt-4 px-2 text-white">
        <h2 className="font-semibold">Get your wallet statement</h2>
        <StatementDateForm mode="wallet" closeSheet={closeSheet} />
      </div>
    );
  }

  if (step === 2 && selectedCard) {
    return (
      <div className="mt-4 px-2 text-white">
        <h2 className="font-semibold">Get your card statement</h2>
        <StatementDateForm
          key={selectedCard.id}
          mode="card"
          card={selectedCard}
          setStep={setStep}
          closeSheet={closeSheet}
        />
      </div>
    );
  }

  return (
    <div className="mt-4 px-2 text-white">
      <h2 className="font-semibold">Select card</h2>
      <p className="mt-1 text-xs font-light text-white/70">
        Select the card you want a statement for
      </p>
      <StatementCardSelect
        closeSheet={closeSheet}
        onSelect={(c) => {
          setSelectedCard(c);
          setStep(2);
        }}
      />
    </div>
  );
};

export default Statement;
