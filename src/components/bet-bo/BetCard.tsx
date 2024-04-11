"use client";
import React, { useEffect, useState } from "react";
import { Icons } from "../Icons";
import { isEmpty } from "lodash";
import Button from "../ui/Button";
import SetBetPosition from "./SetBetPosition";
import TooltipElement from "../ui/Tooltip";
import { DocumentData } from "firebase/firestore";
import { ethers } from "ethers";
import { CURRENCY_UNIT } from "@/constants";
import { toFixedEtherNumber } from "@/utils/format-number";
import Image from "next/image";
interface IBetCard {
  currentRound: number;
  nextBetData: DocumentData;
  dataBettedInCurrentRound: DocumentData | undefined;
}

const BetCard: React.FC<IBetCard> = ({
  currentRound,
  nextBetData,
  dataBettedInCurrentRound,
}) => {
  const [showSetBetCard, setShowSetBetCard] = useState<boolean>(false);
  const [upOrDownStatus, setUpOrDownStatus] = useState<string>("");
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  let theme;
  if (typeof window !== "undefined") {
    theme = localStorage.getItem("theme") || "dark";
  }

  useEffect(() => {
    const target = +nextBetData?.lockTimestamp * 1000;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const different = target - now;
      const m = Math.floor((different % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((different % (1000 * 60)) / 1000);
      setMinutes(m);
      setSeconds(s);
    }, 1000);
    return () => clearInterval(interval);
  }, [nextBetData?.lockTimestamp]);

  useEffect(() => {
    if (currentRound) {
      setShowSetBetCard(false);
    }
  }, [currentRound]);

  const enterUpOrDownHandler = (status: string) => {
    setShowSetBetCard(true);
    if (status === "UP") setUpOrDownStatus("UP");
    if (status === "DOWN") setUpOrDownStatus("DOWN");
  };

  const changeUpOrDownHandler = (status: string) => {
    setUpOrDownStatus(status);
    inputRef.current?.focus();
  };

  const backwardHandler = (status: boolean) => {
    setShowSetBetCard(status);
  };

  const placedBetHandler = (status: boolean) => {
    setShowSetBetCard(status);
  };
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div
      className={`w-full flex h-[485px] justify-center items-center relative transition-transform duration-700 preverve-3d ${
        showSetBetCard === true && "rotateY-180"
      }`}
    >
      <div
        className={`card z-20 w-80 shadow-xl backface-hidden ${
          showSetBetCard && "z-10"
        }`}
      >
        <div className="flex justify-between items-center bg-[--colors-primary] h-9 p-2 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Icons.PlayCircle className="text-[--colors-white]" />
            <span className="text-[--colors-white]">Next</span>
          </div>
          <div className="text-[--colors-white]">#{currentRound}</div>
        </div>
        <div className="card-body p-4 bg-[--colors-backgroundAlt] rounded-b-2xl">
          {!isEmpty(dataBettedInCurrentRound) &&
            (dataBettedInCurrentRound?.position === "UP" ? (
              <div className="absolute flex gap-2 z-20 border-2 rounded-2xl border-[--colors-secondary] px-2 py-[2px] ">
                <Icons.CheckCircle className="text-[--colors-text]" />
                <span className="text-[--colors-secondary]">ENTERED</span>
              </div>
            ) : null)}
          <div className="relative -mb-[0.45rem]">
            <div className="h-16 mx-auto w-60">
              <Image src="/images/up.png" width={288} height={62} alt="up" />
              {/* ) : (
                <Image
                  src="/images/prediction_light.png"
                  width={288}
                  height={62}
                  alt="down light"
                  className="rotate-180"
                />
              )} */}
              <div className="flex items-center flex-col justify-center absolute top-0 left-0 w-full h-full">
                <div className="text-[--colors-success] font-semibold uppercase text-xl">
                  UP
                </div>
                <div className="text-[--colors-textSubtle] font-semibold text-sm">
                  {nextBetData?.bullAmount
                    ? toFixedEtherNumber(
                        ethers.formatEther(BigInt(nextBetData?.bullAmount)),
                        2
                      )
                    : 0}{" "}
                  {CURRENCY_UNIT}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-[#53dee9] to-[#7645d9] p-[2px]">
            <div className="bg-[--colors-backgroundAlt] rounded-xl p-4 flex flex-col gap-2">
              {!isEmpty(dataBettedInCurrentRound) &&
                (dataBettedInCurrentRound?.position === "UP" ? (
                  <TooltipElement
                    title={`${toFixedEtherNumber(
                      ethers.formatEther(
                        BigInt(dataBettedInCurrentRound.amount)
                      ),
                      2
                    )} ${CURRENCY_UNIT}`}
                  >
                    <Button
                      className="flex relative group w-[255px] gap-1 bg-[--colors-success] text-[--colors-white] hover:bg-[--colors-success] hover:opacity-[0.8] rounded-2xl"
                      type="button"
                      disabled={true}
                    >
                      <Icons.ArrowDown className="rotate-180" />
                      <span>UP Entered</span>
                    </Button>
                  </TooltipElement>
                ) : (
                  <TooltipElement
                    title={`${toFixedEtherNumber(
                      ethers.formatEther(
                        BigInt(dataBettedInCurrentRound.amount)
                      ),
                      2
                    )} ${CURRENCY_UNIT}`}
                  >
                    <Button
                      className="flex relative group w-[255px] gap-1 bg-[--colors-failure] text-[--colors-white] hover:bg-[--colors-failure] hover:opacity-[0.8] rounded-2xl"
                      type="button"
                      disabled={true}
                    >
                      <Icons.ArrowDown />
                      <span>DOWN Entered</span>
                    </Button>
                  </TooltipElement>
                ))}
              <div className="flex items-center justify-between text-[--colors-text] font-semibold text-base">
                <span>Prize Pool:</span>
                <span>
                  {nextBetData?.totalAmount
                    ? toFixedEtherNumber(
                        ethers.formatEther(BigInt(nextBetData?.totalAmount)),
                        2
                      )
                    : 0}{" "}
                  {CURRENCY_UNIT}
                </span>
              </div>
              {isEmpty(dataBettedInCurrentRound) ? (
                <>
                  <Button
                    className="bg-[--colors-success] text-[--colors-white] hover:bg-[--colors-success] hover:opacity-[0.8] rounded-2xl"
                    type="button"
                    onClick={() => enterUpOrDownHandler("UP")}
                    disabled={minutes < 1 && seconds < 10 ? true : false}
                  >
                    Enter UP
                  </Button>
                  <Button
                    className="bg-[--colors-failure] text-[--colors-white] hover:bg-[--colors-failure] hover:opacity-[0.8] rounded-2xl"
                    type="button"
                    onClick={() => enterUpOrDownHandler("DOWN")}
                    disabled={minutes < 1 && seconds < 10 ? true : false}
                  >
                    Enter DOWN
                  </Button>
                </>
              ) : null}
            </div>
          </div>
          <div className="relative -mt-[0.55rem]">
            <div className="h-16 mx-auto w-60">
              {/* {theme === "dark" ? ( */}
              <Image src="/images/down.png" width={288} height={64} alt="up" />
              {/* ) : (
                <Image
                  src="/images/prediction_light.png"
                  width={288}
                  height={64}
                  alt="down light"
                />
              )} */}
              <div className="flex items-center flex-col justify-center absolute top-0 left-0 w-full h-full">
                <div className="text-[--colors-textSubtle] font-semibold text-sm">
                  {nextBetData?.bearAmount
                    ? toFixedEtherNumber(
                        ethers.formatEther(BigInt(nextBetData?.bearAmount)),
                        2
                      )
                    : 0}{" "}
                  {CURRENCY_UNIT}
                </div>
                <div className="text-[--colors-failure] font-semibold uppercase text-xl">
                  DOWN
                </div>
              </div>
            </div>
          </div>
          {!isEmpty(dataBettedInCurrentRound) &&
            (dataBettedInCurrentRound?.position === "DOWN" ? (
              <div className="absolute right-0 bottom-2 flex gap-2 z-20 border-2 rounded-2xl border-[--colors-secondary] px-2 py-[2px] ">
                <Icons.CheckCircle className="text-[--colors-text]" />
                <span className="text-[--colors-secondary]">ENTERED</span>
              </div>
            ) : null)}
        </div>
      </div>

      <SetBetPosition
        showSetBetCard={showSetBetCard}
        upOrDownStatus={upOrDownStatus}
        onEnterUpOrDown={changeUpOrDownHandler}
        onBackward={backwardHandler}
        currentRound={nextBetData?.epoch}
        onPlacedBet={placedBetHandler}
        inputRef={inputRef}
      />
    </div>
  );
};

export default React.memo(BetCard);
