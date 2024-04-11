"use client";
import React, { useEffect, useState } from "react";
import SetBoxingBetPosition from "./SetBoxingBetPosition";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import TooltipElement from "../ui/Tooltip";
import { DocumentData } from "firebase/firestore";
import { EMarketTypes } from "@/constants/marketsType";
import { toFixedEtherNumber } from "@/utils/format-number";
import { ethers } from "ethers";
import { CURRENCY_UNIT } from "@/constants";
import { useAccount } from "wagmi";
import { isEmpty } from "lodash";
import { useCountdown } from "@/hooks/useCountDown";

interface IBoxingCard {
  targetDate: Date;
}

const BoxingCard: React.FC<IBoxingCard> = ({ targetDate }) => {
  const [showSetBetCard, setShowSetBetCard] = useState<boolean>(false);
  const [elonOrMarkStatus, setElonOrMarkStatus] = useState<string>("");
  const [boxingData, setBoxingData] = useState<IBoxingData[]>([]);
  const [userBettedBoxing, setUserBettedBoxing] = useState<IBoxingBetted[]>([]);
  const { isConnected, address } = useAccount();
  const [days, hours, minutes, seconds] = useCountdown<Date>(targetDate);

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getDataFileredByOnSnapshot(
      "markets",
      [["epoch", "==", EMarketTypes.BOXING]],
      (docs: DocumentData) => {
        setBoxingData(docs as IBoxingData[]);
      }
    );
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
    }
  }, [isConnected, address]);

  const enterElonOrMarkHandler = (status: string) => {
    setShowSetBetCard(true);
    if (status === "ELON") setElonOrMarkStatus("ELON");
    if (status === "MARK") setElonOrMarkStatus("MARK");
  };

  const changeElonOrMarkHandler = (status: string) => {
    setElonOrMarkStatus(status);
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
              Highlights
            </div>
            <div className="text-[--colors-market] font-semibold">
              {+days + +hours + +minutes + +seconds <= 0
                ? "Expried"
                : `${days}d:${hours}h:${minutes}m:${seconds}s`}
            </div>
          </div>

          <div className="mb-5 md:mb-10 text-[--colors-contrast] text-base font-bold leading-7">
            <p>An epic showdown is here!</p>
            <p>Elon Musk vs Mark Zuckerberg</p>
            Who&apos;s gonna win?
          </div>

          <div className="flex flex-col justify-between gap-2">
            <div className="flex gap-2 items-center">
              <div className="text-[--colors-contrast] text-base font-light leading-snug">
                Total Volume
              </div>
              <div className="text-[--colors-market] text-[26px] font-bold leading-9">
                {boxingData?.[0]?.totalAmount
                  ? toFixedEtherNumber(
                      ethers.formatEther(BigInt(boxingData?.[0]?.totalAmount)),
                      2
                    )
                  : 0}{" "}
                {CURRENCY_UNIT}
              </div>
            </div>

            <div className="w-full flex flex-col gap-y-3 justify-end">
              {!isEmpty(userBettedBoxing) ? (
                <>
                  <div
                    className={`w-full h-[54px] flex items-center justify-between p-[6px] pr-4 rounded-[20px] cursor-pointer ${
                      userBettedBoxing?.[0]?.position !== "UP"
                        ? "bg-gradient-to-br from-slate-500 to-slate-600 cursor-not-allowed opacity-60"
                        : "bg-[--colors-market-bold]"
                    }`}
                  >
                    <div className="w-40 py-[7px] px-4 text-[--colors-contrast] text-base font-light leading-7 bg-[--colors-backgroundAlt] rounded-[14px]">
                      {boxingData?.[0]?.bullAmount
                        ? toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(boxingData?.[0]?.bullAmount)
                            ),
                            2
                          )
                        : 0}{" "}
                      {CURRENCY_UNIT}
                    </div>
                    <div className="flex flex-1 items-center justify-between pl-2 text-white text-xs leading-7">
                      <div className="font-bold">ELON</div>
                      <div>
                        {userBettedBoxing?.[0]?.position === "UP" && (
                          <TooltipElement
                            title={`${toFixedEtherNumber(
                              ethers.formatEther(
                                BigInt(userBettedBoxing?.[0]?.amount)
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
                    className={`w-full h-[54px] flex items-center justify-between p-[6px] rounded-[20px] cursor-pointer ${
                      userBettedBoxing?.[0]?.position !== "DOWN"
                        ? "bg-gradient-to-br !from-slate-500 !to-slate-600 cursor-not-allowed opacity-60"
                        : "bg-[--colors-market-bold]"
                    }`}
                  >
                    <div className="w-40 py-[7px] px-4 text-[--colors-contrast] text-base font-light leading-7 bg-[--colors-backgroundAlt] rounded-[14px]">
                      {boxingData?.[0]?.bearAmount
                        ? toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(boxingData?.[0]?.bearAmount)
                            ),
                            2
                          )
                        : 0}{" "}
                      {CURRENCY_UNIT}
                    </div>
                    <div className="flex flex-1 items-center justify-between text-white text-xs pl-2 leading-7">
                      <div className="font-bold">MARK ZUCKERBERG</div>
                      {userBettedBoxing?.[0]?.position === "DOWN" && (
                        <TooltipElement
                          title={`${toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(userBettedBoxing?.[0]?.amount)
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
                  <div className="w-full flex-1 h-[54px] flex items-center justify-between pl-2 bg-[#A1A0CA] rounded-[20px]">
                    <div className="w-44 py-[7px] px-4 text-[--colors-contrast] text-base font-light leading-7 bg-[--colors-backgroundAlt] rounded-[14px]">
                      {boxingData?.[0]?.bullAmount
                        ? toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(boxingData?.[0]?.bullAmount)
                            ),
                            2
                          )
                        : 0}{" "}
                      {CURRENCY_UNIT}
                    </div>
                    <div className="flex flex-1 justify-between pl-2">
                      <div className="flex items-center justify-start text-white text-xs font-bold leading-7">
                        ELON MUSK
                      </div>
                      <button
                        className="text-white py-4 px-2 md:px-8 rounded-r-2xl"
                        style={{ background: "var(--colors-gradient-market)" }}
                        onClick={() => enterElonOrMarkHandler("ELON")}
                      >
                        Select
                      </button>
                    </div>
                  </div>

                  <div className="w-full flex-1 h-[54px] flex items-center justify-between pl-2 bg-[#A1A0CA] rounded-[20px]">
                    <div className="w-44 py-[7px] px-4 text-[--colors-contrast] text-base font-light leading-7 bg-[--colors-backgroundAlt] rounded-[14px]">
                      {boxingData?.[0]?.bearAmount
                        ? toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(boxingData?.[0]?.bearAmount)
                            ),
                            2
                          )
                        : 0}{" "}
                      {CURRENCY_UNIT}
                    </div>
                    <div className="flex flex-1 justify-between pl-2">
                      <div className="flex items-center justify-center text-white text-xs font-bold leading-7">
                        MARK ZUCKERBERG
                      </div>
                      <button
                        className="text-white py-4 px-2 md:px-8 rounded-r-2xl"
                        style={{ background: "var(--colors-gradient-market)" }}
                        onClick={() => enterElonOrMarkHandler("MARK")}
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

      <SetBoxingBetPosition
        showSetBetCard={showSetBetCard}
        elonOrMarkStatus={elonOrMarkStatus}
        onEnterElonOrMark={changeElonOrMarkHandler}
        onBackward={backwardHandler}
        currentRound={EMarketTypes.BOXING.toString()}
        onPlacedBet={placedBetHandler}
        inputRef={inputRef}
      />
    </div>
  );
};

export default BoxingCard;
