"use client";
import BoxingCard from "@/components/bet-boxing/BoxingCard";
import HistoryBoxingCard from "@/components/bet-boxing/HistoryBoxingCard";
import ElectionCard from "@/components/bet-election/ElectionCard";
import HistoryElectionCard from "@/components/bet-election/HistoryElectionCard";
import SetElectionBetPostion from "@/components/bet-election/SetElectionBetPostion";
import { BOXING_START_DATE } from "@/constants";
import { EMarketTypes } from "@/constants/marketsType";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import { DocumentData } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import clsx from "clsx";
import { Icons } from "@/components/Icons";
import MarkerHistory from "@/components/market-history";

const MarketPage = () => {
  const { isConnected, address } = useAccount();
  const [userBettedBoxing, setUserBettedBoxing] = useState<IBoxingBetted[]>([]);
  const [userBettedElection, setUserBettedElection] = useState<
    IElectionBetted[]
  >([]);

  const [boxingData, setBoxingData] = useState<IBoxingData[]>([]);
  const [electionData, setElectionData] = useState<IElectionData[]>([]);

  const [isShowHistory, setIsShowHistory] = useState<boolean>(false);

  const dateTimeAfterBoxingDate = BOXING_START_DATE;

  useEffect(() => {
    getDataFileredByOnSnapshot(
      "markets",
      [["epoch", "==", EMarketTypes.BOXING]],
      (docs: DocumentData) => {
        setBoxingData(docs as IBoxingData[]);
      }
    );
    getDataFileredByOnSnapshot(
      "markets",
      [["epoch", "==", EMarketTypes.ELECTION]],
      (docs: DocumentData) => {
        setElectionData(docs as IElectionData[]);
      }
    );
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      getDataFileredByOnSnapshot(
        "bets_market",
        [
          ["user_address", "==", address as `0x${string}`],
          ["epoch", "==", EMarketTypes.BOXING],
        ],
        (docs) => {
          setUserBettedBoxing(docs as IBoxingBetted[]);
        }
      );
      getDataFileredByOnSnapshot(
        "bets_market",
        [
          ["user_address", "==", address as `0x${string}`],
          ["epoch", "==", EMarketTypes.ELECTION],
        ],
        (docs) => {
          setUserBettedElection(docs as IElectionBetted[]);
        }
      );
    }
  }, [isConnected, address]);

  return (
    <main className="bg-gradient-to-br from-slate-400 to-indigo-800">
      <div className="flex overflow-hidden min-h-[85vh]">
        <div
          className={clsx(
            "overflow-hidden py-7 md:py-9 px-3 md:px-6",
            isShowHistory
              ? "w-[0px] lg:w-[calc(100%-385px)] !px-0 lg:!px-6"
              : "w-[100%]"
          )}
        >
          <div className="flex justify-between">
            <h1 className="pb-5 text-zinc-100 text-7xl font-bold leading-normal">
              Market
            </h1>

            <button
              className="bg-[--colors-backgroundAlt] h-fit p-3 rounded-xl"
              onClick={() => setIsShowHistory(!isShowHistory)}
            >
              <Icons.History className="text-[--colors-market-text]" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-2">
            {boxingData?.[0]?.result !== "Waiting" ? (
              <HistoryBoxingCard userBettedData={userBettedBoxing?.[0]} />
            ) : (
              <BoxingCard targetDate={dateTimeAfterBoxingDate} />
            )}

            {electionData?.[0]?.result !== "Waiting" ? (
              <HistoryElectionCard
                userBettedElection={userBettedElection?.[0]}
              />
            ) : (
              <ElectionCard />
            )}
            {/* <ElectionCard />
            <BoxingCard />
            <ElectionCard />
            <ElectionCard />
            <ElectionCard />
            <ElectionCard /> */}
          </div>
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
            <MarkerHistory onClose={() => setIsShowHistory(false)} />
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default MarketPage;
