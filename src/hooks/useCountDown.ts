import { useEffect, useState } from "react";

const useCountdown = <T>(targetDate: T) => {
  const countDownDate = new Date(targetDate as Date).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getFormatReturnValues = (value: number) => {
  if (value.toString().length === 1) return "0" + value;
  return value;
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [
    getFormatReturnValues(days),
    getFormatReturnValues(hours),
    getFormatReturnValues(minutes),
    getFormatReturnValues(seconds),
  ];
};

export { useCountdown };
