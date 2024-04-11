"use client";
import React, { useEffect, useState } from "react";

import clsx from "clsx";
import { Icons } from "./Icons";
import Button from "./ui/Button";
import { useAccount } from "wagmi";

import { DocumentData } from "firebase/firestore";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";

interface ICountDown {
  title: string;
  onAction?: {
    setIsShowDrawer?: (value: boolean) => void;
  };
}

const CountDown: React.FC<ICountDown> = ({ title, onAction }) => {
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [nextBetData, setNextBetData] = useState<DocumentData[]>([]);

  const { isConnected } = useAccount();

  const LIST_BTN_FEATURE = [
    {
      id: "history",
      icon: <Icons.History />,
      disabled: !isConnected,
      className: "hidden lg:flex",
      onAction: () => {
        return onAction?.setIsShowDrawer?.(true);
      },
    },
  ];

  useEffect(() => {
    getDataFileredByOnSnapshot(
      "predictions",
      [
        ["locked", "==", false],
        ["cancel", "==", false],
      ],
      (docs: DocumentData) => {
        setNextBetData(docs as DocumentData[]);
      }
    );
  }, []);

  useEffect(() => {
    const target = +nextBetData?.[0]?.lockTimestamp * 1000;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const different = target - now;
      const m = Math.floor((different % (1000 * 60 * 60)) / (1000 * 60));

      const s = Math.floor((different % (1000 * 60)) / 1000);
      setMinute(m);
      setSecond(s);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextBetData]);

  const renderTime = () => {
    const _minute = minute < 10 ? `0${minute}` : minute;
    const _second = second < 10 ? `0${second}` : second;

    return (
      <>
        {+_minute >= 0 && +_second >= 0 ? (
          <p className="text-red-600">
            {_minute}:{_second}
          </p>
        ) : (
          "Closing"
        )}
      </>
    );
  };

  const renderListFeature = () => {
    return LIST_BTN_FEATURE.map((feature) => {
      return (
        <Button
          key={feature.id}
          className={clsx(
            `w-12 h-12 !rounded-2xl !p-2 ${feature?.className}`,
            feature.disabled &&
              "!active:border-none focus:!border-none hidden md:flex",
            !feature.disabled &&
              "bg-[--colors-textSubtle] hover:bg-[--colors-textSubtle] hover:opacity-80"
          )}
          onClick={() => {
            if (!feature.disabled) {
              feature.onAction();
            }
          }}
        >
          {feature.icon}
        </Button>
      );
    });
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="bg-[--colors-backgroundAlt] p-1 px-1 pr-8 mr-3 rounded-3xl text-[--colors-light-white] flex gap-0 items-center flex-col md:flex-row rounded-bl-[3rem] min-w-[98px] md:rounded-bl-3xl md:gap-2 md:min-w-fit md:p-2 md:px-3 md:pr-11 order-1 sm:order-none relative">
        <div className="text-[--colors-secondary] text-base font-semibold rounded-bl-[3rem] flex-col md:flex-row md:text-lg">
          {renderTime()}
        </div>
        <div className="text-xs text-[--colors-text] md:pr-8">{title}</div>
        <Icons.Clock
          width={64}
          height={64}
          className="absolute right-[-25px] top-[-10px] md:right-0"
        />
      </div>

      {renderListFeature()}
    </div>
  );
};

export default CountDown;
