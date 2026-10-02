import { useEffect, useState } from "react";

// Ticks once a second and returns the time left until `endTime` (epoch ms),
// clamped at zero. Distinct from the existing use-countdown.ts (a fixed 2h
// card-topup timer that doesn't take an end time).
export const useSwapCountdown = (endTime: number) => {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, endTime - Date.now()),
  );

  useEffect(() => {
    setRemaining(Math.max(0, endTime - Date.now()));
    const id = setInterval(
      () => setRemaining(Math.max(0, endTime - Date.now())),
      1000,
    );
    return () => clearInterval(id);
  }, [endTime]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return {
    remaining,
    label: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
  };
};
