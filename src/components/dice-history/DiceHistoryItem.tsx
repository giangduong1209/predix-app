"use client";
import React, { useEffect, useState } from "react";

import clsx from "clsx";
import { ethers } from "ethers";
import { Icons } from "../Icons";
import { CURRENCY_UNIT } from "@/constants";

import { RESULT_STATUS, USER_DIRECTION } from "@/constants/history";
import { replaceDotToComma, toFixedEtherNumber } from "@/utils/format-number";

import { DocumentData } from "firebase/firestore";
import getAllData from "@/helpers/getAllDataByOnSnapshot";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";

interface IHistoryDataProps {
  data: IHistoryDice;
  onCollect: (
    status: boolean,
    statusClaim: string,
    round: number,
    title: string
  ) => void;
}

const HistoryItem: React.FC<IHistoryDataProps> = ({ data, onCollect }) => {
  const [round, setRound] = useState<IRoundDice>();
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
  const [chainlinkData, setChainlinkData] = useState<DocumentData[]>();

  const isUp = round?.sum! > 10;

  const isLive = data?.status === RESULT_STATUS.LIVE;
  const isRefund = data?.status === RESULT_STATUS.REFUND;
  const isDraw = data?.status === RESULT_STATUS.DRAW;
  const isWaiting = data?.status === RESULT_STATUS.WAITING;
  const isWinningRefund = data?.status === RESULT_STATUS.WR;
  const isLosingRefund = data?.status === RESULT_STATUS.LR;
  const isWin =
    data?.status === RESULT_STATUS.WIN || data?.status === RESULT_STATUS.WR;
  const isLose =
    data?.status === RESULT_STATUS.LOSE || data?.status === RESULT_STATUS.LR;

  const handlerFormatEther = (value: number) => {
    return toFixedEtherNumber(ethers?.formatEther(BigInt(value)), 2);
  };

  const winningAmount = isLose
    ? data?.amount !== 0
      ? handlerFormatEther(data?.amount)
      : handlerFormatEther(data?.refund)
    : handlerFormatEther(data?.winning_amount);

  useEffect(() => {
    if (isLive || isWaiting) {
      getDataFileredByOnSnapshot(
        "dices",
        [["epoch", "==", data.epoch]],
        (docs: DocumentData) => {
          setRound(docs?.[0]);
        }
      );
    }

    if (!isLive || !isWaiting) setRound(data?.round);
  }, [data, isLive, isWaiting]);

  useEffect(() => {
    getAllData("chainlink", (docs: DocumentData) => {
      setChainlinkData(docs as DocumentData[]);
    });
  }, []);

  const renderYourHistory = () => {
    return (
      <div className="mb-5">
        <div className="flex justify-between mb-2">
          <div className="text-lg font-bold">Your History</div>
          <div
            className={clsx(
              "flex text-lg font-bold gap-2 uppercase",
              isWin && "text-[--colors-warning]",
              isLose && "text-[--colors-light-failure]"
            )}
          >
            {data?.status}{" "}
            {isWin ? (
              <Icons.Trophy className="w-4" />
            ) : (
              <Icons.Ban className="w-4" />
            )}
          </div>
        </div>
        <div className="border-2 border-solid border-[--colors-textSubtle] rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="text-sm flex items-center">Your direction:</div>
            <div
              className={clsx(
                "text-sm font-bold flex gap-1 items-center p-1 rounded-md",
                data?.position === USER_DIRECTION.UP
                  ? "bg-[--colors-success]"
                  : "bg-[--colors-failure]"
              )}
            >
              {data?.position === USER_DIRECTION.UP ? (
                <Icons.ArrowUp className="w-[20px] h-[20px]" />
              ) : (
                <Icons.ArrowDown className="w-[20px] h-[20px]" />
              )}{" "}
              {data?.position === USER_DIRECTION.UP
                ? "OVER"
                : data?.position === USER_DIRECTION.DOWN
                ? "UNDER"
                : data?.position}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-sm">Your bet</div>
            <div className="text-sm font-bold">
              {toFixedEtherNumber(
                ethers.formatEther(BigInt(data?.amount + data?.refund)),
                2
              ) ?? 0}{" "}
              {CURRENCY_UNIT}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-sm">Your position</div>
            <div className="text-sm font-bold">
              {data?.amount
                ? toFixedEtherNumber(
                    ethers.formatEther(BigInt(data?.amount)),
                    2
                  )
                : 0}{" "}
              {CURRENCY_UNIT}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-sm font-bold">
              {isWin
                ? "Your winnings:"
                : isLose
                ? "Your results:"
                : "Your refund:"}
            </div>
            <div>
              <div
                className={clsx(
                  "text-sm font-bold",
                  isWin && "text-[--colors-success]",
                  isLose && "text-[--colors-light-failure]"
                )}
              >
                {isWin || isRefund || isDraw ? "+" : "-"}{" "}
                {isRefund || isDraw
                  ? handlerFormatEther(data?.refund)
                  : winningAmount}{" "}
                {CURRENCY_UNIT}
              </div>
            </div>
          </div>

          {isWinningRefund || isLosingRefund ? (
            <div className="flex justify-between">
              <div className="text-sm font-bold">Your refund:</div>
              <div>
                <div
                  className={clsx("text-sm font-bold text-[--colors-success]")}
                >
                  {"+ "}
                  {handlerFormatEther(data?.refund)} {CURRENCY_UNIT}
                </div>
              </div>
            </div>
          ) : null}

          {isWin ? (
            <>
              <hr className="border-b-[1px] border-solid border-[--colors-cardBorder]" />

              <div className="flex justify-between text-[--colors-textSubtle]">
                <div className="text-xs font-bold">Amount to collect:</div>
                <div className="flex gap-1 text-xs font-bold items-center">
                  {handlerFormatEther(
                    data.winning_amount + data?.amount + data?.refund
                  )}{" "}
                  {CURRENCY_UNIT}{" "}
                  <Icons.AlertCircle className="w-[17px] h-[17px]" />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  };

  const renderRoundHistory = () => {
    const renderArrow = () => {
      if (isDraw) return null;

      if (isUp) return <Icons.ArrowUp className="w-[20px] h-[20px]" />;

      return <Icons.ArrowDown className="w-[20px] h-[20px]" />;
    };

    return (
      <>
        <div className="text-lg font-bold mb-2">Round History</div>
        <div
          className={clsx(
            "border-2 border-solid rounded-2xl p-3",
            isUp ? "border-[--colors-success]" : "border-[--colors-failure]",
            isDraw && "!border-[#e7e3eb]"
          )}
        >
          <div className="flex justify-between mb-3">
            <div
              className={clsx(
                "text-2xl font-bold",
                isUp ? "text-[--colors-success]" : "text-[--colors-failure]"
              )}
            >
              {`Sum: ${round?.sum}`}
            </div>
            <div
              className={clsx(
                "flex gap-1 items-center rounded-lg p-2 text-sm font-bold",
                isUp ? "bg-[--colors-success]" : "bg-[--colors-failure]",
                isDraw && "!text-[#191326] !bg-[#e7e3eb]"
              )}
            >
              {renderArrow()} {isUp ? "OVER" : "UNDER"}
            </div>
          </div>
          <div className="flex justify-between mb-1">
            <div className="text-sm font-bold">Prize Pool:</div>
            <div className="text-sm font-bold">
              {round?.totalAmount
                ? toFixedEtherNumber(
                    ethers.formatEther(BigInt(round?.totalAmount)),
                    2
                  )
                : 0}{" "}
              {CURRENCY_UNIT}
            </div>
          </div>

          {isWaiting || isLive ? (
            <div className="flex justify-between mb-1">
              <div className="text-xs">Your bet:</div>
              <div className="text-xs">
                <span className="font-bold">
                  {round?.bullAmount
                    ? toFixedEtherNumber(
                        ethers.formatEther(BigInt(data?.amount)),
                        2
                      )
                    : 0}{" "}
                  {CURRENCY_UNIT}
                </span>
              </div>
            </div>
          ) : null}

          <div className="flex justify-between mb-1">
            <div className="text-xs">UP:</div>
            <div className="text-xs">
              <span className="font-bold">
                {round?.bullAmount
                  ? toFixedEtherNumber(
                      ethers.formatEther(BigInt(round?.bullAmount)),
                      2
                    )
                  : 0}{" "}
                {CURRENCY_UNIT}
              </span>
            </div>
          </div>

          <div className="flex justify-between mb-1">
            <div className="text-xs">DOWN:</div>
            <div className="text-xs">
              <span className="font-bold">
                {round?.bearAmount
                  ? toFixedEtherNumber(
                      ethers.formatEther(BigInt(round?.bearAmount)),
                      2
                    )
                  : 0}{" "}
                {CURRENCY_UNIT}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderWinningAmount = () => {
    if (isWaiting || isLive) return null;

    if (isRefund || isDraw)
      return (
        <div className="text-center">
          <div className="text-xs">Your Result</div>
          <div className={clsx("font-bold text-[--colors-success]")}>
            + {handlerFormatEther(data?.refund)}
          </div>
        </div>
      );

    return (
      <div className="text-center">
        <div className="text-xs">Your Result</div>
        <div
          className={clsx(
            "font-bold",
            isWin && "text-[--colors-success]",
            isLose && "text-[--colors-light-failure]"
          )}
        >
          {isWin
            ? `+ ${handlerFormatEther(
                data?.winning_amount + data?.refund + data?.amount
              )}`
            : `- ${winningAmount}`}
        </div>
      </div>
    );
  };

  const renderLayoutStatus = () => {
    if (isLive) {
      return (
        <div className="flex text-[--colors-secondary] font-semibold text-base gap-2">
          <Icons.PlayCircle />
          <span>Live</span>
        </div>
      );
    }

    if (isWaiting) {
      return (
        <div className="flex text-[--colors-primary] font-semibold text-base gap-2">
          <Icons.Clock3 />
          <span>Starting Soon</span>
        </div>
      );
    }

    return null;
  };

  const renderContentDetail = () => {
    if (!isShowDetail) return null;

    return (
      <div className="p-4 border-b-2 border-solid border-[--colors-cardBorder] !bg-[--colors-backgroundAlt2]">
        {!isWaiting && !isLive ? renderYourHistory() : null}

        {renderRoundHistory()}
      </div>
    );
  };

  return (
    <>
      <div
        className="p-4 border-b-2 border-solid border-[--colors-cardBorder] cursor-pointer flex items-center justify-between"
        onClick={() => {
          setIsShowDetail(!isShowDetail);
        }}
      >
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs">Round</div>
            <div className="text-[--colors-text] font-bold">{data?.epoch}</div>
          </div>
          {renderWinningAmount()}

          {renderLayoutStatus()}
        </div>
        <div className="flex items-center gap-2">
          {(isWin || isRefund || isLosingRefund || isDraw) &&
          data?.claimed === false ? (
            <button
              className="bg-[--colors-primary] text-sm text-[--colors-white] px-4 py-1 rounded-2xl cursor-pointer hover:opacity-[0.8]"
              onClick={(e) => {
                onCollect(
                  true,
                  data?.status,
                  data?.epoch as number,
                  isWin ? "Collect Winnnings" : "Collect Refund"
                );
                e.stopPropagation();
              }}
            >
              Collect
            </button>
          ) : null}
          <div>
            {isShowDetail ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
          </div>
        </div>
      </div>

      {renderContentDetail()}
    </>
  );
};

export default HistoryItem;
