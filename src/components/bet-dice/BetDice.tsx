import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import Dice from "../Dice";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import { DocumentData } from "firebase/firestore";
import { toFixedEtherNumber } from "@/utils/format-number";
import { ethers } from "ethers";
import SetDicePosition from "./SetDicePosition";
import { EDiceStatus } from "@/constants/dice-types";
import { useAccount } from "wagmi";
import { isEmpty } from "lodash";
import TooltipElement from "../ui/Tooltip";
import { CURRENCY_UNIT } from "@/constants";
import { Icons } from "../Icons";
import toast from "react-hot-toast";

enum EMode {
  OVER = 1,
  UNDER,
}

interface IDiceDataProps {
  diceData: IDiceData;
}

const BetDice: React.FC<IDiceDataProps> = ({ diceData }) => {
  const [prevDiceData, setPrevDiceData] = useState<IDiceData>(diceData);
  const [showSetBetCard, setShowSetBetCard] = useState<boolean>(false);
  const [underOrOverStatus, setUnderOrOverStatus] = useState<string>("");
  const [currentRound, setCurrentRound] = useState<number>(diceData?.epoch | 0);
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [diceBetted, setDiceBetted] = useState<IDiceBet[]>([]);

  const { isConnected, address } = useAccount();

  useEffect(() => {
    getDataFileredByOnSnapshot(
      "dices",
      [
        // ["closed", "==", true],
        // ["cancel", "==", false],
        ["epoch", "==", diceData ? diceData.epoch - 1 : 1],
      ],
      (docs: DocumentData) => {
        setPrevDiceData(docs?.[0] as IDiceData);
      }
    );
  }, [diceData?.epoch]);

  useEffect(() => {
    const target = +diceData?.closeTimestamp * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const different = target - now;
      const m = Math.floor((different % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((different % (1000 * 60)) / 1000);
      setMinute(m);
      setSecond(s);
    }, 1000);

    return () => clearInterval(interval);
  }, [diceData]);

  if (currentRound !== diceData?.epoch) {
    setCurrentRound(diceData?.epoch);
  }

  useEffect(() => {
    if (isConnected && address && currentRound) {
      getDataFileredByOnSnapshot(
        "bets_dice",
        [
          ["user_address", "==", address],
          ["epoch", "==", currentRound],
        ],
        (docs) => {
          setDiceBetted(docs as IDiceBet[]);
        }
      );
    }
  }, [isConnected, address, diceData?.epoch, currentRound]);

  // Filter diceBetted Arr that get previous round, not know why get prev data while current round was updated in latest round
  const diceBettedFiltered = diceBetted.filter(
    (dice) => dice.epoch === currentRound
  );

  const renderTime = () => {
    const _minute = minute < 10 ? `0${minute}` : minute;
    const _second = second < 10 ? `0${second}` : second;
    return (
      <>
        {+_minute >= 0 && +_second >= 0 ? `${_minute}:${_second}` : "Closing"}
      </>
    );
  };

  const enterUnderOrOverHandler = (status: string) => {
    setShowSetBetCard(true);
    if (status === EDiceStatus.OVER) setUnderOrOverStatus(EDiceStatus.OVER);
    if (status === EDiceStatus.UNDER) setUnderOrOverStatus(EDiceStatus.UNDER);
  };

  const changeUnderOrOverHanlder = (status: string) => {
    setUnderOrOverStatus(status);
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
    <>
      <div className="overflow-hidden flex justify-center py-5">
        <div className="relative">
          <div
            style={{
              borderColor: !isEmpty(diceBettedFiltered)
                ? diceBettedFiltered?.[0]?.position === "UP"
                  ? "#000"
                  : "#fff"
                : "#922922",
            }}
            className={`w-[272px] md:w-[496px] md:h-[584px] relative z-10 h-[272px] flex justify-center m-auto flex-col rounded-[40px] bg-[#922922] border-[3px] md:border-[7px] items-center p-[40px] transition-transform duration-700 preverve-3d ${
              showSetBetCard === true && "rotateY-180 h-[420px]"
            }`}
          >
            <div>
              <div className="mx-auto flex flex-col justify-center items-center w-[142px] h-[142px] gap-2 mb-6 rounded-full md:hidden bg-[#B53D2D]">
                <Dice
                  cheatValue={prevDiceData?.dice1 && prevDiceData.dice1}
                  size={40}
                  epoch={currentRound}
                />
                <div className="flex gap-5">
                  <Dice
                    cheatValue={prevDiceData?.dice2 && prevDiceData?.dice2}
                    size={40}
                    epoch={currentRound}
                  />
                  <Dice
                    cheatValue={prevDiceData?.dice3 && prevDiceData?.dice3}
                    size={40}
                    epoch={currentRound}
                  />
                </div>
              </div>
              <div className="mx-auto w-[310px] rounded-full h-[310px] mb-6 hidden md:flex md:flex-col justify-center items-center gap-5 bg-[#B53D2D]">
                <Dice
                  cheatValue={prevDiceData?.dice1 && prevDiceData.dice1}
                  size={70}
                  epoch={currentRound}
                />
                <div className="flex gap-5">
                  <Dice
                    cheatValue={prevDiceData?.dice2 && prevDiceData?.dice2}
                    size={70}
                    epoch={currentRound}
                  />
                  <Dice
                    cheatValue={prevDiceData?.dice3 && prevDiceData?.dice3}
                    size={70}
                    epoch={currentRound}
                  />
                </div>
              </div>
              <div
                style={{
                  backgroundColor: !isEmpty(diceBettedFiltered)
                    ? diceBettedFiltered?.[0]?.position === "UP"
                      ? "#000"
                      : "#fff"
                    : "#FFD3AA",
                }}
                className={`w-[218px] h-[58px] md:w-[384px] md:h-[125px] rounded-[20px] flex justify-center items-center`}
              >
                <div className="text-5xl text-[#922922] font-bold">
                  {/* <CountdownTimer initialTime={60} /> */}
                  {renderTime()}
                </div>
              </div>
            </div>
            <SetDicePosition
              showSetBetCard={showSetBetCard}
              underOrOverStatus={underOrOverStatus}
              onEnterOverOrUnder={changeUnderOrOverHanlder}
              onBackward={backwardHandler}
              currentRound={diceData?.epoch.toString()}
              onPlacedBet={placedBetHandler}
              inputRef={inputRef}
            />
          </div>
          <div className="flex gap-[10px] my-[20px] md:absolute md:top-[15px] md:gap-[260px] md:-left-[500px]">
            <div
              className="hidden md:block ml-[150px] relative cursor-pointer"
              // onClick={() => handleChangeMode(EMode.OVER)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="700"
                height="468"
                viewBox="0 0 787 468"
                fill="none"
              >
                <path
                  d="M296.681 467.827L727 467.827C760.137 467.827 787 440.964 787 407.827L787 60.1732C787 27.0361 760.137 0.173094 727 0.173095L296.681 0.173092C283.893 0.173092 271.44 4.25886 261.137 11.8345L24.7388 185.661C-7.86915 209.638 -7.86915 258.362 24.7388 282.339L261.137 456.165C271.44 463.741 283.893 467.827 296.681 467.827Z"
                  fill={
                    !isEmpty(diceBettedFiltered)
                      ? diceBettedFiltered?.[0]?.position === "DOWN"
                        ? "#fff"
                        : "#FFD3AA"
                      : "#FFD3AA"
                  }
                />
              </svg>
              <div className="flex flex-col absolute top-[130px] left-[20px] w-[300px] right-[15px]">
                <span className="text-3xl text-[#EE6033] font-bold text-right uppercase">
                  Roll under
                </span>
                <div className="my-5 ml-auto relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="219"
                    height="72"
                    viewBox="0 0 219 72"
                    fill="none"
                  >
                    <path
                      d="M8.43217 36.3489C-7.16124 24.8827 1.00216 0.161789 20.3574 0.236344L198.687 0.923258C209.703 0.965689 218.61 9.90749 218.61 20.9231V52C218.61 63.0457 209.656 72 198.61 72H63.477C59.2143 72 55.0631 70.638 51.6288 68.1127L8.43217 36.3489Z"
                      fill="#EE6033"
                    />
                  </svg>
                  <span className="text-xl left-1/2 transform -translate-x-[40%] top-[30%] absolute text-white">
                    {diceData?.bearAmount
                      ? toFixedEtherNumber(
                          ethers.formatEther(BigInt(diceData?.bearAmount)),
                          2
                        )
                      : 0}
                  </span>
                </div>
                {!isEmpty(diceBettedFiltered) &&
                  diceBettedFiltered?.[0]?.position === "DOWN" && (
                    // <TooltipElement
                    //   title={`${toFixedEtherNumber(
                    //     ethers.formatEther(BigInt(diceBetted?.[0]?.amount)),
                    //     2
                    //   )} ${CURRENCY_UNIT}`}
                    //   classNameText="ml-auto"
                    // >
                    // </TooltipElement>
                    <Button
                      className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[107px] h-[40px] ml-auto"
                      disabled={true}
                    >
                      Selected
                    </Button>
                  )}

                {!isEmpty(diceBettedFiltered) &&
                  diceBettedFiltered?.[0]?.position !== "DOWN" && (
                    <Button
                      className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[107px] h-[40px] ml-auto"
                      disabled={true}
                    >
                      Bet
                    </Button>
                  )}

                {isEmpty(diceBettedFiltered) && (
                  <Button
                    className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[107px] h-[40px] ml-auto"
                    onClick={() => enterUnderOrOverHandler(EDiceStatus.UNDER)}
                    disabled={minute < 1 && second < 10 ? true : false}
                  >
                    Bet
                  </Button>
                )}
              </div>
            </div>
            <div
              className="hidden md:block absolute -right-[480px] top-[5px] cursor-pointer"
              // onClick={() => handleChangeMode(EMode.UNDER)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="700"
                height="468"
                viewBox="0 0 787 468"
                fill="none"
              >
                <path
                  d="M490.319 0.173167L60 0.173158C26.8629 0.173157 5.25638e-06 27.0361 4.86122e-06 60.1732L7.15494e-07 407.827C3.20338e-07 440.964 26.8629 467.827 60 467.827L490.319 467.827C503.107 467.827 515.56 463.741 525.863 456.166L762.261 282.339C794.869 258.362 794.869 209.638 762.261 185.661L525.863 11.8345C515.56 4.25892 503.107 0.173167 490.319 0.173167Z"
                  fill={
                    !isEmpty(diceBettedFiltered)
                      ? diceBettedFiltered?.[0]?.position === "UP"
                        ? "#000"
                        : "#FFD3AA"
                      : "#FFD3AA"
                  }
                />
              </svg>
              <div className="flex flex-col absolute top-[130px]  w-[300px] right-[5px]">
                <span className="text-3xl text-[#EE6033] font-bold text-left uppercase">
                  Roll Over
                </span>
                <div className="my-5 mr-auto relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="219"
                    height="72"
                    viewBox="0 0 219 72"
                    fill="none"
                  >
                    <path
                      d="M210.669 36.3489C226.263 24.8827 218.099 0.161789 198.744 0.236344L20.4144 0.923258C9.39882 0.965689 0.491394 9.90749 0.491394 20.9231V52C0.491394 63.0457 9.44571 72 20.4914 72H155.625C159.887 72 164.039 70.638 167.473 68.1127L210.669 36.3489Z"
                      fill="#B53D2D"
                    />
                  </svg>
                  <span className="text-xl left-1/2 transform -translate-x-[55%] top-[30%] absolute text-white">
                    {diceData?.bullAmount
                      ? toFixedEtherNumber(
                          ethers.formatEther(BigInt(diceData?.bullAmount)),
                          2
                        )
                      : 0}
                  </span>
                </div>
                {!isEmpty(diceBettedFiltered) &&
                  diceBettedFiltered?.[0]?.position === "UP" && (
                    // <TooltipElement
                    //   title={`${toFixedEtherNumber(
                    //     ethers.formatEther(BigInt(diceBetted?.[0]?.amount)),
                    //     2
                    //   )} ${CURRENCY_UNIT}`}
                    // >
                    // </TooltipElement>
                    <Button
                      className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[107px] h-[40px] mr-auto"
                      disabled={true}
                    >
                      Selected
                    </Button>
                  )}

                {!isEmpty(diceBettedFiltered) &&
                  diceBettedFiltered?.[0]?.position !== "UP" && (
                    <Button
                      className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[107px] h-[40px] mr-auto"
                      disabled={true}
                    >
                      Bet
                    </Button>
                  )}

                {isEmpty(diceBettedFiltered) && (
                  <Button
                    className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[107px] h-[40px] mr-auto"
                    onClick={() => enterUnderOrOverHandler(EDiceStatus.OVER)}
                    disabled={minute < 1 && second < 10 ? true : false}
                  >
                    Bet
                  </Button>
                )}
              </div>
            </div>
            <div
              className="relative md:hidden cursor-pointer"
              // onClick={() => handleChangeMode(EMode.OVER)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="158"
                height="138"
                viewBox="0 0 158 138"
                fill="none"
              >
                <path
                  d="M82.017 138L138 138C149.046 138 158 129.046 158 118L158 20C158 8.9543 149.046 -4.35715e-07 138 -9.73197e-07L82.017 -6.94595e-07C77.5065 -7.35827e-07 73.1284 1.52466 69.5937 4.32643L7.77412 53.3264C-2.3281 61.3338 -2.3281 76.6662 7.77412 84.6736L69.5937 133.674C73.1284 136.475 77.5065 138 82.017 138Z"
                  fill={
                    !isEmpty(diceBettedFiltered)
                      ? diceBettedFiltered?.[0]?.position === "DOWN"
                        ? "#fff"
                        : "#FFD3AA"
                      : "#FFD3AA"
                  }
                />
              </svg>
              <div className="flex flex-col absolute top-[25px] right-[15px]">
                <span className=" text-sm text-[#EE6033] font-bold text-right uppercase">
                  Roll under
                </span>
                <div className="my-2 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="114"
                    height="38"
                    viewBox="0 0 114 38"
                    fill="none"
                  >
                    <path
                      d="M4.33922 17.9402C-3.0461 12.0177 1.16815 0.10151 10.6348 0.138863L103.794 0.506441C109.302 0.528172 113.755 4.99892 113.755 10.5064V27.456C113.755 32.9789 109.278 37.456 103.755 37.456H32.19C29.9153 37.456 27.7086 36.6805 25.934 35.2574L4.33922 17.9402Z"
                      fill="#EE6033"
                    />
                  </svg>
                  <span className="text-base left-[60%] transform -translate-x-[40%] top-[18%] absolute text-white">
                    {diceData?.bearAmount
                      ? toFixedEtherNumber(
                          ethers.formatEther(BigInt(diceData?.bearAmount)),
                          2
                        )
                      : 0}
                  </span>
                </div>
                {!isEmpty(diceBettedFiltered) &&
                  diceBettedFiltered?.[0]?.position === "DOWN" && (
                    // <TooltipElement
                    //   title={`${toFixedEtherNumber(
                    //     ethers.formatEther(BigInt(diceBetted?.[0]?.amount)),
                    //     2
                    //   )} ${CURRENCY_UNIT}`}
                    // >
                    // </TooltipElement>
                    <Button
                      className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[85px] h-[20px] ml-auto"
                      disabled={true}
                    >
                      Selected
                    </Button>
                  )}
                {!isEmpty(diceBettedFiltered) &&
                  diceBettedFiltered?.[0]?.position !== "DOWN" && (
                    <Button
                      className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[85px] h-[20px] ml-auto"
                      disabled={true}
                    >
                      Bet
                    </Button>
                  )}
                {isEmpty(diceBettedFiltered) && (
                  <Button
                    className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[85px] h-[20px] ml-auto"
                    onClick={() => {
                      enterUnderOrOverHandler(EDiceStatus.UNDER);
                    }}
                    disabled={minute < 1 && second < 10 ? true : false}
                  >
                    Bet
                  </Button>
                )}
              </div>
            </div>
            <div
              className="relative md:hidden cursor-pointer"
              // onClick={() => handleChangeMode(EMode.UNDER)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="158"
                height="138"
                viewBox="0 0 158 138"
              >
                <path
                  d="M75.983 1.61985e-06L20 4.26371e-07C8.9543 1.90893e-07 -3.49494e-06 8.9543 -3.62666e-06 20L-4.7953e-06 118C-4.92701e-06 129.046 8.9543 138 20 138L75.983 138C80.4935 138 84.8716 136.475 88.4063 133.674L150.226 84.6736C160.328 76.6663 160.328 61.3338 150.226 53.3264L88.4063 4.32643C84.8716 1.52466 80.4935 1.71601e-06 75.983 1.61985e-06Z"
                  fill={
                    !isEmpty(diceBettedFiltered)
                      ? diceBettedFiltered?.[0]?.position === "UP"
                        ? "#000"
                        : "#FFD3AA"
                      : "#FFD3AA"
                  }
                />
              </svg>
              <div className="flex flex-col absolute top-[25px] right-[30px]">
                <span className="text-sm text-[#EE6033] font-bold text-left uppercase">
                  Roll Over
                </span>
                <div className="my-2 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="112"
                    height="38"
                    viewBox="0 0 112 38"
                    fill="none"
                  >
                    <path
                      d="M107.288 18.1509C115.042 12.397 110.946 0.0820907 101.289 0.120192L9.96054 0.480561C4.45314 0.502292 0 4.97304 0 10.4805V27.4302C0 32.953 4.47715 37.4302 10 37.4302H77.9997C80.1458 37.4302 82.235 36.7397 83.9585 35.4609L107.288 18.1509Z"
                      fill="#B53D2D"
                    />
                  </svg>
                  <span className="text-base left-[40%] transform -translate-x-[55%] top-[18%] absolute text-white">
                    {diceData?.bullAmount
                      ? toFixedEtherNumber(
                          ethers.formatEther(BigInt(diceData?.bullAmount)),
                          2
                        )
                      : 0}
                  </span>
                </div>
                {!isEmpty(diceBettedFiltered) &&
                  diceBettedFiltered?.[0]?.position === "UP" && (
                    // <TooltipElement
                    //   title={`${toFixedEtherNumber(
                    //     ethers.formatEther(BigInt(diceBetted?.[0]?.amount)),
                    //     2
                    //   )} ${CURRENCY_UNIT}`}
                    // >
                    // </TooltipElement>
                    <Button
                      className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[85px] h-[20px] mr-auto"
                      disabled={true}
                    >
                      Selected
                    </Button>
                  )}
                {!isEmpty(diceBettedFiltered) &&
                  diceBettedFiltered?.[0]?.position !== "UP" && (
                    <Button
                      className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[85px] h-[20px] mr-auto"
                      disabled={true}
                    >
                      Bet
                    </Button>
                  )}
                {isEmpty(diceBettedFiltered) && (
                  <Button
                    className="bg-gradient-to-br from-[#FFBA88] to-[#EE6033] rounded-[20px] p-2 w-[85px] h-[20px] mr-auto"
                    onClick={() => enterUnderOrOverHandler(EDiceStatus.OVER)}
                    disabled={minute < 1 && second < 10 ? true : false}
                  >
                    Bet
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isEmpty(diceBettedFiltered) &&
        diceBettedFiltered?.[0]?.refund !== 0 &&
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-[--colors-backgroundAlt] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex bg-[--colors-success] p-4 rounded-l-lg">
                <Icons.CheckCircle className="text-[--colors-white]" />
              </div>
              <div className="flex-1 w-0 p-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5"></div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-[--colors-text]">
                      Refund!
                    </p>
                    <p className="mt-1 text-sm text-[--colors-text]">
                      You has been refunded{" "}
                      {toFixedEtherNumber(
                        ethers.formatEther(
                          BigInt(diceBettedFiltered?.[0]?.refund)
                        ),
                        2
                      )}{" "}
                      {CURRENCY_UNIT}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-non2e rounded-r-lg p-4 flex items-start justify-end text-sm font-medium focus:outline-none"
                >
                  <Icons.X className="text-[--colors-primary]" />
                </button>
              </div>
            </div>
          ),
          {
            duration: 5000,
          }
        )}
    </>
  );
};

export default BetDice;
