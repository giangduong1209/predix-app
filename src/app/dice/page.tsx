"use client";
import React, { createRef, useEffect, useState } from "react";

import clsx from "clsx";
import { Icons } from "@/components/Icons";
import { DocumentData } from "firebase/firestore";
import DiceHistory from "@/components/dice-history";

import BetDice from "@/components/bet-dice/BetDice";
import Popup, { PopupRef } from "@/components/ui/Modal";
import DiceClaimModal from "@/components/bet-dice/DiceClaimModal";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";

const ChineseDice = () => {
  const [diceData, setDiceData] = useState<IDiceData[]>([]);
  const [statusClaim, setStatusClaim] = useState<string>("");
  const [collectWinning, setCollectWinning] = useState<{
    round: number;
    title: string;
  }>({
    round: 0,
    title: "Collect Winnnings",
  });

  const collectWinningsRef = createRef<PopupRef>();

  useEffect(() => {
    getDataFileredByOnSnapshot(
      "dices",
      [
        ["closed", "==", false],
        ["cancel", "==", false],
      ],
      (docs: DocumentData) => {
        setDiceData(docs as IDiceData[]);
      }
    );
  }, []);

  const [isShowHistory, setIsShowHistory] = useState<boolean>(false);

  const handlerToggleCollectWinning = (
    status: boolean,
    statusClaim: string,
    round: number,
    title: string
  ) => {
    setCollectWinning({
      round: round,
      title: title,
    });

    if (status === true) {
      setStatusClaim(statusClaim);
      return collectWinningsRef.current?.open();
    }
    return collectWinningsRef.current?.close();
  };

  return (
    <main className="bg-gradient-to-r from-[--colors-violetAlt1] to-[--colors-violetAlt2]">
      <div className="flex overflow-hidden min-h-[85vh]">
        <div
          className={clsx(
            "overflow-hidden py-7 md:py-9 px-3 md:px-6",
            isShowHistory
              ? "w-[0px] lg:w-[calc(100%-385px)] !px-0 lg:!px-6"
              : "w-[100%]"
          )}
        >
          <div className="flex justify-end">
            <button
              className="bg-[--colors-primary] h-fit p-3 rounded-xl"
              onClick={() => setIsShowHistory(!isShowHistory)}
            >
              <Icons.History className="text-[--colors-white]" />
            </button>
          </div>

          <BetDice diceData={diceData?.[0]} />
        </div>

        <div
          className={clsx(
            "bg-[--colors-backgroundAlt]",
            isShowHistory &&
              "w-[100%] lg:w-[385px] transition-transform translate-x-0",
            !isShowHistory &&
              "w-0 transition-transform transform translate-x-full"
          )}
        >
          {isShowHistory ? (
            <DiceHistory
              onClose={() => setIsShowHistory(false)}
              onCollect={handlerToggleCollectWinning}
            />
          ) : null}
        </div>
      </div>

      <Popup
        ref={collectWinningsRef}
        width={300}
        footer={false}
        closable
        title={collectWinning.title}
        styleContent={{
          background: "var(--colors-backgroundAlt)",
          color: "var(--colors-text)",
        }}
        content={
          <DiceClaimModal
            winningRound={collectWinning.round}
            titleClaim={collectWinning.title}
            statusClaim={statusClaim}
            onCancel={() => {
              handlerToggleCollectWinning(false, "", 0, "");
            }}
          />
        }
      />
    </main>
  );
};

export default ChineseDice;
