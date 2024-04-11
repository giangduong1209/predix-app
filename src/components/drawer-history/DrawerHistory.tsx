"use client";

import React, { useEffect, useState } from "react";

import clsx from "clsx";
import HistoryItem from "./HistoryItem";
import { isEmpty } from "lodash";
import { Icons } from "../Icons";

import {
  LIST_MODE,
  LIST_RADIO,
  MODE,
  RADIO,
  RESULT_STATUS,
} from "@/constants/history";
import { useAccount } from "wagmi";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import { DocumentData } from "firebase/firestore";

interface IDrawerHistory {
  open: boolean;
  onClose: (value: boolean) => void;
  onCollect: (
    status: boolean,
    statusClaim: string,
    round: number,
    title: string
  ) => void;
}

const DrawerHistory: React.FC<IDrawerHistory> = ({
  open,
  onClose,
  onCollect,
}) => {
  const { isConnected, address } = useAccount();
  const [mode, setMode] = useState<any>(LIST_MODE[0]);
  const [dataHistory, setDataHistory] = useState<DocumentData[]>([]);
  const [originalHistoryData, setOriginalHistoryData] = useState<
    DocumentData[]
  >([]);
  const [radioChecked, setRadioChecked] = useState<string>(RADIO.ALL);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    if (isClient && isConnected && address) {
      getDataFileredByOnSnapshot(
        "bets",
        [["user_address", "==", address as `0x${string}`]],
        (docs: DocumentData) => {
          setDataHistory(docs as DocumentData[]);
          setOriginalHistoryData(docs as DocumentData[]);
        }
      );
    }
  }, [isClient, isConnected, address]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSelectRadio = (value: string) => {
    setRadioChecked(value);

    if (value === RADIO.UNREFUNDED) {
      const historyDataFilted = originalHistoryData.filter(
        (history) =>
          (history?.status === RESULT_STATUS.REFUND ||
            history?.status === RESULT_STATUS.LR) &&
          history?.claimed === false
      );
      return setDataHistory(historyDataFilted);
    }

    if (value === RADIO.UNCOLECTED) {
      const historyDataFilted = originalHistoryData.filter(
        (history) =>
          (history?.status === RESULT_STATUS.WIN ||
            history?.status === RESULT_STATUS.WR ||
            history?.status === RESULT_STATUS.LR ||
            history?.status === RESULT_STATUS.DRAW ||
            history?.status === RESULT_STATUS.REFUND) &&
          history?.claimed === false
      );
      return setDataHistory(historyDataFilted);
    }

    return setDataHistory(originalHistoryData);
  };

  const renderMode = () => {
    return (
      <div className="flex justify-between bg-[--colors-input] h-8 rounded-2xl border-[1px] border-solid border-[--colors-inputSecondary] mb-4">
        {LIST_MODE.map((btn) => {
          return (
            <button
              key={btn.id}
              className={clsx(
                "w-1/2 text-base font-bold",
                btn.id !== mode.id && "text-[--colors-textSubtle]",
                btn.id === mode.id &&
                  "bg-[--colors-textSubtle] text-[--colors-backgroundAlt] rounded-2xl",
                btn.id === MODE.PNL && "!cursor-not-allowed"
              )}
              onClick={() => {
                if (btn.id === MODE.PNL) return;

                setMode(btn);
              }}
            >
              {btn.title}
            </button>
          );
        })}
      </div>
    );
  };

  const renderFilter = () => {
    if (mode.id === MODE.PNL) return null;

    const renderListRadio = () => {
      return LIST_RADIO.map((radio) => {
        return (
          <div key={radio} className="flex gap-1">
            <div
              className={clsx(
                "relative w-6 h-6 cursor-pointer  rounded-full border-2 border-solid",
                radio === radioChecked &&
                  "border-[--colors-success] bg-[--colors-success]",
                radio !== radioChecked &&
                  "border-[--colors-disabled] bg-[--colors-cardBorder]"
              )}
              onClick={() => handleSelectRadio(radio)}
            >
              <div
                className={clsx(
                  radio === radioChecked &&
                    "absolute w-3 h-3 bg-[--colors-backgroundAlt]  rounded-full top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
                )}
              />
            </div>
            <div
              className="cursor-pointer select-none"
              onClick={() => handleSelectRadio(radio)}
            >
              {radio}
            </div>
          </div>
        );
      });
    };

    return (
      <div>
        <div className="text-[--colors-textSubtle] text-xs font-medium">
          Filter
        </div>
        <div className="flex gap-4 text-[--colors-text] text-base font-medium">
          {renderListRadio()}
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    if (mode.id === MODE.ROUNDS && !isEmpty(dataHistory)) {
      return dataHistory
        .sort((a, b) => b.epoch - a.epoch)
        .map((data) => (
          <HistoryItem
            onCollect={onCollect}
            key={data.id}
            data={data as IHistory}
          />
        ));
    }

    return (
      <div className="text-center p-6 h-[58vh] lg:h-auto">
        <p className="mb-2 text-xl font-bold">
          No prediction history available
        </p>
        <p className="text-base font-medium">
          If you are sure you should see history here, make sure you’re
          connected to the correct wallet and try again.
        </p>
      </div>
    );
  };

  const renderMainContent = () => {
    if (!open) return null;

    return (
      <>
        <div
          className="p-4"
          style={{ background: "var(--colors-gradientBubblegum)" }}
        >
          <div className="flex justify-between mb-8">
            <div className="text-[--colors-text] text-xl font-bold">
              History
            </div>
            <button
              className="text-[--colors-primary] flex items-center gap-2 text-base font-bold"
              onClick={() => onClose(false)}
            >
              Close <Icons.ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {renderMode()}
          {renderFilter()}
        </div>

        <div className="h-full bg-[--colors-backgroundAlt] text-[--colors-text]">
          <div className="overflow-y-auto max-h-[90vh] lg:max-h-[75vh]">
            {renderHistory()}
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className={clsx(
        open && "w-[100%] lg:w-[385px] transition-transform translate-x-0",
        !open && "w-0 transition-transform transform translate-x-full"
      )}
    >
      {renderMainContent()}
    </div>
  );
};

export default DrawerHistory;
