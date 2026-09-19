import { useEffect, useState } from "react";

export const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 * 1000); // Start with 2 hours

  const addZero = (number: number) => {
    return number < 10 && number >= 0 ? `0${number}` : number;
  };

  const handleCountdown = (ms: number) => {
    let days = addZero(Math.floor(ms / (1000 * 60 * 60 * 24)));
    let hours = addZero(
      Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    );
    let minutes = addZero(Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)));
    let seconds = addZero(Math.floor((ms % (1000 * 60)) / 1000));

    return { days, hours, minutes, seconds };
  };

  const [countdown, setCountdown] = useState(handleCountdown(timeLeft));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1000; // Decrease by 1 second
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCountdown(handleCountdown(timeLeft));
  }, [timeLeft]);

  return countdown;
};

export default useCountdown;
