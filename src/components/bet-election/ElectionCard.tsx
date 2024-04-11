"use client";
import React, { useEffect, useState } from "react";
import { EMarketTypes } from "@/constants/marketsType";
import { DocumentData } from "firebase/firestore";
import { toFixedEtherNumber } from "@/utils/format-number";
import { ethers } from "ethers";
import { CURRENCY_UNIT } from "@/constants";
import { useAccount } from "wagmi";
import { isEmpty } from "lodash";
import SetElectionBetPostion from "./SetElectionBetPostion";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import TooltipElement from "../ui/Tooltip";

export enum EEntitites {
  "DemocraticParty" = "Democratic Party",
  "RepublicanParty" = "Republican Party",
}

const ElectionCard = () => {
  const { isConnected, address } = useAccount();
  const [showSetBetCard, setShowSetBetCard] = useState<boolean>(false);
  const [yesOrNoStatus, setYesOrNoStatus] = useState<string>("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [electionData, setElectionData] = useState<IElectionData[]>([]);
  const [userBettedElection, setUserBettedElection] = useState<
    IElectionBetted[]
  >([]);

  useEffect(() => {
    getDataFileredByOnSnapshot(
      "markets",
      [["epoch", "==", EMarketTypes.ELECTION]],
      (docs: DocumentData) => {
        setElectionData(docs as IElectionData[]);
      }
    );
    if (isConnected && address) {
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

  // console.log(userBettedElection?.[0]);

  const enterYesOrNoHandler = (status: string) => {
    setShowSetBetCard(true);
    if (status === EEntitites.DemocraticParty)
      setYesOrNoStatus(EEntitites.DemocraticParty);
    if (status === EEntitites.RepublicanParty)
      setYesOrNoStatus(EEntitites.RepublicanParty);
  };

  const changeYesOrNoHandler = (status: string) => {
    setYesOrNoStatus(status);
    inputRef.current?.focus();
  };

  const placedBetHandler = (status: boolean) => {
    setShowSetBetCard(status);
  };

  const backwardHandler = (status: boolean) => {
    setShowSetBetCard(status);
  };

  return (
    <div
      className={`flex h-[485px] justify-center items-center relative transition-transform duration-700 preverve-3d ${
        showSetBetCard === true && "rotateY-180"
      }`}
    >
      <div
        className={`card z-20 w-96 md:w-[505px] shadow-xl backface-hidden ${
          showSetBetCard && "z-10"
        }`}
      >
        <div className="card-body rounded-2xl p-4 bg-[--colors-backgroundAlt]">
          <div className="flex items-center justify-between">
            <div className="w-1/3 flex items-center px-4 py-2 text-slate-400 text-xl font-light leading-7 bg-[--colors-backgroundAlt] rounded-[20px] border-2 border-slate-400 justify-center">
              Elections
            </div>
            <div className="text-[--colors-market] font-semibold">
              Coming soon
            </div>
          </div>
          <div className="mb-5 md:mb-10 text-[--colors-contrast] text-xl font-bold leading-7">
            2024 United States elections
            <p className="h-7"></p>
            <p className="h-7"></p>
          </div>

          <div className="flex flex-col justify-between gap-2">
            <div className="flex gap-2 items-center">
              <div className="text-[--colors-contrast] text-base font-light leading-snug">
                Total Volume
              </div>
              <div className="text-[--colors-market] text-[26px] font-bold leading-9">
                {electionData?.[0]?.totalAmount
                  ? toFixedEtherNumber(
                      ethers.formatEther(
                        BigInt(electionData?.[0]?.totalAmount)
                      ),
                      2
                    )
                  : 0}{" "}
                {CURRENCY_UNIT}
              </div>
            </div>

            <div className="w-full flex flex-col gap-y-3 justify-end">
              {!isEmpty(userBettedElection) ? (
                <>
                  <div
                    className={`w-full h-[54px] flex items-center justify-between p-[6px] pr-4 rounded-[20px] cursor-pointer ${
                      userBettedElection?.[0]?.position !== "UP"
                        ? "bg-gradient-to-br from-slate-500 to-slate-600 cursor-not-allowed opacity-60"
                        : "bg-[--colors-market-bold]"
                    }`}
                  >
                    <div className="w-40 py-[7px] px-4 text-[--colors-contrast] text-base font-light leading-7 bg-[--colors-backgroundAlt] rounded-[14px]">
                      {electionData?.[0]?.bullAmount
                        ? toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(electionData?.[0]?.bullAmount)
                            ),
                            2
                          )
                        : 0}{" "}
                      {CURRENCY_UNIT}
                    </div>
                    <div className="flex flex-1 items-center justify-between pl-2 text-white text-xs leading-7 uppercase">
                      <div className="font-bold">Democratic Party</div>
                      <div>
                        {userBettedElection?.[0]?.position === "UP" && (
                          <TooltipElement
                            title={`${toFixedEtherNumber(
                              ethers.formatEther(
                                BigInt(userBettedElection?.[0]?.amount)
                              ),
                              2
                            )} ${CURRENCY_UNIT}`}
                            classNameText="text-right font-light"
                          >
                            SELECTED
                          </TooltipElement>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-full h-[54px] flex items-center justify-between p-[6px]  from-slate-400 to-indigo-800 rounded-[20px] cursor-pointer ${
                      userBettedElection?.[0]?.position !== "DOWN"
                        ? "bg-gradient-to-br !from-slate-500 !to-slate-600 cursor-not-allowed opacity-60"
                        : "bg-[--colors-market-bold]"
                    }`}
                  >
                    <div className="w-40 py-[7px] px-4 text-[--colors-contrast] text-base font-light leading-7 bg-[--colors-backgroundAlt] rounded-[14px]">
                      {electionData?.[0]?.bearAmount
                        ? toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(electionData?.[0]?.bearAmount)
                            ),
                            2
                          )
                        : 0}{" "}
                      {CURRENCY_UNIT}
                    </div>
                    <div className="flex flex-1 items-center justify-between text-white text-xs pl-2 font-bold leading-7 uppercase">
                      <div>Republican Party</div>
                      {userBettedElection?.[0]?.position === "DOWN" && (
                        <TooltipElement
                          title={`${toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(userBettedElection?.[0]?.amount)
                            ),
                            2
                          )} ${CURRENCY_UNIT}`}
                          classNameText="text-right"
                        >
                          SELECTED
                        </TooltipElement>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full flex-1 h-[54px] flex items-center justify-between pl-2 bg-[#A1A0CA] rounded-[20px] cursor-pointer">
                    <div className="w-44 py-[7px] px-4 text-[--colors-contrast] text-base font-light leading-7 bg-[--colors-backgroundAlt] rounded-[14px]">
                      {electionData?.[0]?.bullAmount
                        ? toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(electionData?.[0]?.bullAmount)
                            ),
                            2
                          )
                        : 0}{" "}
                      {CURRENCY_UNIT}
                    </div>
                    <div className="flex flex-1 justify-between pl-2">
                      <div className="flex items-center justify-center text-white text-xs font-bold leading-7 uppercase">
                        Democratic Party
                      </div>
                      <button
                        className="text-white py-4 px-2 md:px-8 rounded-r-2xl"
                        style={{ background: "var(--colors-gradient-market)" }}
                        onClick={() =>
                          enterYesOrNoHandler(EEntitites.DemocraticParty)
                        }
                      >
                        Select
                      </button>
                    </div>
                  </div>

                  <div className="w-full flex-1 h-[54px] flex items-center justify-between pl-2 bg-[#A1A0CA] rounded-[20px] cursor-pointer">
                    <div className="w-44 py-[7px] px-4 text-[--colors-contrast] text-base font-light leading-7 bg-[--colors-backgroundAlt] rounded-[14px]">
                      {electionData?.[0]?.bearAmount
                        ? toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(electionData?.[0]?.bearAmount)
                            ),
                            2
                          )
                        : 0}{" "}
                      {CURRENCY_UNIT}
                    </div>
                    <div className="flex flex-1 justify-between pl-2">
                      <div className="flex items-center justify-center text-white text-xs font-bold leading-7 uppercase">
                        Republican Party
                      </div>
                      <button
                        className="text-white py-4 px-2 md:px-8 rounded-r-2xl"
                        style={{ background: "var(--colors-gradient-market)" }}
                        onClick={() =>
                          enterYesOrNoHandler(EEntitites.RepublicanParty)
                        }
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <SetElectionBetPostion
        showSetBetCard={showSetBetCard}
        yesOrNoStatus={yesOrNoStatus}
        onEnterYesOrNo={changeYesOrNoHandler}
        onBackward={backwardHandler}
        currentRound={EMarketTypes.ELECTION.toString()}
        onPlacedBet={placedBetHandler}
        inputRef={inputRef}
      />
    </div>
  );
};

export default ElectionCard;
