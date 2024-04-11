"use client";
import React, { useEffect, useState } from "react";

import clsx from "clsx";
import { ethers } from "ethers";
import { Icons } from "../Icons";
import { CURRENCY_UNIT } from "@/constants";

import { toFixedEtherNumber } from "@/utils/format-number";
import {
  RESULT_STATUS,
  USER_DIRECTION,
  NAME_ROUND_MARKET,
  OPTIONS_BET_MARKET,
} from "@/constants/history";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import { DocumentData } from "firebase/firestore";

interface IItemHistory {
  data: IHistory;
}

const ItemHistory: React.FC<IItemHistory> = ({ data }) => {
  const [round, setRound] = useState<IRound>();
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);

  const isLive = data?.status === RESULT_STATUS.LIVE;
  const isRefund = data?.status === RESULT_STATUS.REFUND;
  const isWaiting = data?.status === RESULT_STATUS.WAITING;
  const isWinningRefund = data?.status === RESULT_STATUS.WR;
  const isLosingRefund = data?.status === RESULT_STATUS.LR;
  const isWin =
    data?.status === RESULT_STATUS.WIN || data?.status === RESULT_STATUS.WR;
  const isLose =
    data?.status === RESULT_STATUS.LOSE || data?.status === RESULT_STATUS.LR;

  useEffect(() => {
    if (isLive || isWaiting) {
      getDataFileredByOnSnapshot(
        "markets",
        [["epoch", "==", data.epoch]],
        (docs: DocumentData) => {
          setRound(docs?.[0]);
        }
      );
    }

    if (!isLive || !isWaiting) setRound(data?.round);
  }, [data, isLive, isWaiting]);

  const handlerFormatEther = (value: number) => {
    return toFixedEtherNumber(ethers?.formatEther(BigInt(value)), 2);
  };

  const winningAmount = isLose
    ? data?.amount !== 0
      ? handlerFormatEther(data?.amount)
      : handlerFormatEther(data?.refund)
    : handlerFormatEther(data?.winning_amount);

  const renderWinningAmount = () => {
    if (isWaiting || isLive) return null;

    if (isRefund)
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
        <div className="text-xs text-[--colors-contrast]">Your Result</div>
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

  const renderYourHistory = () => {
    const renderRow = (
      title: string,
      value: string | number,
      css: string = ""
    ) => (
      <div className="flex justify-between">
        <div className={`text-sm ${css}`}>{title}</div>
        <div className="text-sm font-bold">
          {value} {CURRENCY_UNIT}
        </div>
      </div>
    );

    if (isLive || isWaiting)
      return (
        <div>
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
                  "bg-[--colors-success] uppercase"
                )}
              >
                {data?.position === USER_DIRECTION.UP
                  ? OPTIONS_BET_MARKET[(data?.epoch as number) - 1].option1
                  : OPTIONS_BET_MARKET[(data?.epoch as number) - 1].option2}
              </div>
            </div>

            {renderRow("Prize pool", handlerFormatEther(round!.totalAmount))}

            {renderRow(
              OPTIONS_BET_MARKET[(data.epoch as number) - 1].option1,
              handlerFormatEther(round?.bullAmount!)
            )}

            {renderRow(
              OPTIONS_BET_MARKET[(data.epoch as number) - 1].option2,
              handlerFormatEther(round?.bearAmount!)
            )}
          </div>
        </div>
      );

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
              {data?.position === USER_DIRECTION.UP
                ? OPTIONS_BET_MARKET[(data?.epoch as number) - 1].option1
                : OPTIONS_BET_MARKET[(data?.epoch as number) - 1].option2}
            </div>
          </div>

          {renderRow(
            "Your bet",
            toFixedEtherNumber(
              ethers.formatEther(BigInt(data?.amount + data?.refund)),
              2
            ) ?? 0
          )}

          {renderRow(
            "Your position",
            data?.amount
              ? toFixedEtherNumber(ethers.formatEther(BigInt(data?.amount)), 2)
              : 0
          )}

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
                {isWin || isRefund ? "+" : "-"}{" "}
                {isRefund ? handlerFormatEther(data?.refund) : winningAmount}{" "}
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
    if (isLive || isWaiting) return null;

    const _isUP = round?.result === USER_DIRECTION.UP;

    return (
      <>
        <div className="text-lg font-bold mb-2">Round History</div>
        <div
          className={clsx(
            "border-2 border-solid rounded-2xl p-3",
            _isUP ? "border-[--colors-success]" : "border-[--colors-failure]"
          )}
        >
          <div className="text-xs text-[--colors-textSubtle] font-bold mb-2">
            CLOSED PRICE
          </div>
          <div className="flex justify-between mb-3">
            <div
              className={clsx(
                "text-2xl font-bold",
                _isUP ? "text-[--colors-success]" : "text-[--colors-failure]"
              )}
            >
              Result:
            </div>
            <div
              className={clsx(
                "flex gap-1 items-center rounded-lg p-2 text-sm font-bold",
                _isUP ? "bg-[--colors-success]" : "bg-[--colors-failure]"
              )}
            >
              {_isUP
                ? OPTIONS_BET_MARKET[(data?.epoch as number) - 1].option1
                : OPTIONS_BET_MARKET[(data?.epoch as number) - 1].option2}
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
          <div className="flex justify-between mb-1">
            <div className="text-xs">
              {OPTIONS_BET_MARKET[(data?.epoch as number) - 1].option1}:
            </div>
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
            <div className="text-xs">
              {OPTIONS_BET_MARKET[(data?.epoch as number) - 1].option2}:
            </div>
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

  const renderContentDetail = () => {
    if (!isShowDetail) return null;

    return (
      <div className="p-4 border-b-2 border-solid border-[--colors-cardBorder] !bg-[--colors-backgroundAlt2]">
        {renderYourHistory()}

        {renderRoundHistory()}
      </div>
    );
  };

  return (
    <div>
      <div
        className="p-4 border-b-2 border-solid border-[--colors-cardBorder] cursor-pointer flex items-center justify-between"
        onClick={() => {
          setIsShowDetail(!isShowDetail);
        }}
      >
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs text-[--colors-contrast]">Round</div>
            <div className="text-[--colors-market-text] font-bold min-w-[68px]">
              {NAME_ROUND_MARKET.length >= Number(data?.epoch)
                ? NAME_ROUND_MARKET[(data?.epoch as number) - 1]
                : data?.epoch}
            </div>
          </div>
          {renderWinningAmount()}

          {renderLayoutStatus()}
        </div>
        <div className="flex items-center gap-2">
          {(isWin || isRefund || isLosingRefund) && data?.claimed === false ? (
            <button
              className="text-sm text-[--colors-white] px-4 py-1 rounded-2xl cursor-pointer hover:opacity-[0.8]"
              style={{ background: "var(--colors-gradient-market)" }}
              onClick={(e) => {
                // onCollect(
                //   true,
                //   data?.status,
                //   data?.epoch as number,
                //   isWin ? "Collect Winnnings" : "Collect Refund"
                // );
                // e.stopPropagation();
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
    </div>
  );
};

export default ItemHistory;
