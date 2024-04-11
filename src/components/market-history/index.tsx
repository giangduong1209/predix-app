"use client";
import React, { useEffect, useState } from "react";

import clsx from "clsx";
import { Icons } from "../Icons";
import { isEmpty } from "lodash";
import { useAccount } from "wagmi";

import ItemHistory from "./ItemHistory";
import { DocumentData } from "firebase/firestore";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";

import {
  LIST_MODE,
  LIST_RADIO,
  MODE,
  RADIO,
  RESULT_STATUS,
} from "@/constants/history";

interface IMarketHistory {
  onClose: () => void;
}

const MarkerHistory: React.FC<IMarketHistory> = ({ onClose }) => {
  const { isConnected, address } = useAccount();

  const [mode, setMode] = useState<any>(LIST_MODE[0]);
  const [radioChecked, setRadioChecked] = useState<string>(RADIO.ALL);

  const [dataHistory, setDataHistory] = useState<DocumentData[]>([]);
  const [originalHistoryData, setOriginalHistoryData] = useState<
    DocumentData[]
  >([]);

  useEffect(() => {
    if (isConnected && address) {
      getDataFileredByOnSnapshot(
        "bets_market",
        [["user_address", "==", address as `0x${string}`]],
        (docs: DocumentData) => {
          setDataHistory(docs as DocumentData[]);
          setOriginalHistoryData(docs as DocumentData[]);
        }
      );
    }
  }, [isConnected, address]);

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
                btn.id !== mode.id && "text-[--colors-market]",
                btn.id === mode.id &&
                  "bg-[--colors-market] text-[--colors-backgroundAlt] rounded-2xl",
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
                  "border-[--colors-market-bold] bg-[--colors-market-bold]",
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
        <div className="text-[--colors-market-bold] text-xs font-medium">
          Filter
        </div>
        <div className="flex gap-4 text-[--colors-market-text] text-base font-medium">
          {renderListRadio()}
        </div>
      </div>
    );
  };

  const renderHistoryContent = () => {
    if (mode.id === MODE.ROUNDS && !isEmpty(dataHistory))
      return dataHistory
        .sort((a, b) => b.epoch - a.epoch)
        .map((data) => <ItemHistory key={data.id} data={data as IHistory} />);

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

  return (
    <div>
      <div
        className="p-4"
        style={{ background: "var(--colors-gradientBubblegum)" }}
      >
        <div className="flex justify-between mb-8">
          <div className="text-[--colors-market-text] text-xl font-bold">
            History
          </div>
          <button
            className="text-[--colors-market-bold] flex items-center gap-2 text-base font-bold"
            onClick={() => onClose()}
          >
            Close <Icons.ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {renderMode()}
        {renderFilter()}
      </div>

      <div className="bg-[--colors-backgroundAlt] text-[--colors-market-text]">
        <div className="overflow-y-auto lg:max-h-[75vh]">
          {renderHistoryContent()}
        </div>
      </div>
    </div>
  );
};

export default MarkerHistory;
