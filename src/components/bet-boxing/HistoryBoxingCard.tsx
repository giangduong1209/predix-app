"use client";
import React, { useEffect, useState } from "react";
import { CONSTANTS, CURRENCY_UNIT } from "@/constants";
import { toFixedEtherNumber } from "@/utils/format-number";
import { ethers } from "ethers";
import { isEmpty } from "lodash";
import { EMarketTypes } from "@/constants/marketsType";
import { DocumentData } from "firebase/firestore";
import { publicClient } from "@/lib/contract-config";
import { Icons } from "../Icons";
import { useAccount, useWalletClient } from "wagmi";
import { getEllipsisTxt } from "@/utils/formmater-address";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";

interface IHistoryBoxingCard {
  userBettedData: IBoxingBetted;
}

const HistoryBoxingCard: React.FC<IHistoryBoxingCard> = ({
  userBettedData,
}) => {
  const [boxingData, setBoxingData] = useState<IBoxingData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    getDataFileredByOnSnapshot(
      "markets",
      [["epoch", "==", EMarketTypes.BOXING]],
      (docs: DocumentData) => {
        setBoxingData(docs as IBoxingData[]);
      }
    );
  }, []);

  const claimHandler = async (epoch: number) => {
    setIsLoading(true);
    try {
      const { request } = await publicClient.simulateContract({
        account: address,
        address: CONSTANTS.ADDRESS.MARKET,
        abi: CONSTANTS.ABI.MARKET,
        functionName: "claim",
        args: [[epoch]],
      });
      if (request) {
        const hash = await walletClient?.writeContract(request);
        if (hash) {
          const transaction = await publicClient.waitForTransactionReceipt({
            hash,
          });
          if (transaction?.status === "success") {
            setIsLoading(false);
            // dispatch(changeBettedStatusHandler(titleClaim));
            toast.custom((t) => (
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
                        Claimed Successfully!
                      </p>
                      <p className="mt-1 text-sm text-[--colors-text]">
                        Your prizes have been sent to your wallet
                      </p>
                      <a
                        href={`https://testnet.bscscan.com/tx/${transaction.transactionHash}`}
                        className="mt-1 text-sm text-[--colors-primary]"
                        target="_blank"
                      >
                        View on BscScan:{" "}
                        {getEllipsisTxt(transaction.transactionHash)}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-start justify-end text-sm font-medium focus:outline-none"
                  >
                    <Icons.X className="text-[--colors-primary]" />
                  </button>
                </div>
              </div>
            ));
          }
          if (transaction?.status === "reverted") {
            setIsLoading(false);
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div
      className={`w-full lg:w-[500px] flex h-[485px] justify-center items-center relative`}
    >
      <div className="card z-20 w-96 md:w-[505px] shadow-xl">
        <div className="card-body rounded-2xl p-4 bg-[--colors-backgroundAlt]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex w-1/3 items-center px-4 py-2 text-slate-400 text-xl font-light leading-7 bg-[--colors-backgroundAlt] rounded-[20px] border-2 border-slate-400 justify-center">
              Highlights
            </div>
            <div className="text-[--colors-textSubtle] font-semibold">
              Expried
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
              <div className="text-slate-400 text-[26px] font-bold leading-9">
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
              {!isEmpty(userBettedData) ? (
                <>
                  <div
                    className={`w-full flex items-center justify-between pl-2 bg-gradient-to-br from-slate-400 to-indigo-800 rounded-[20px] cursor-pointer ${
                      userBettedData?.position !== "UP"
                        ? "from-slate-500 to-slate-600 cursor-not-allowed"
                        : ""
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
                    <div className="flex flex-1 items-center justify-between pl-2 text-white text-xs font-bold leading-7">
                      <div>ELON</div>
                      {boxingData?.[0]?.result === "Up" &&
                        boxingData?.[0]?.result.toLowerCase() !==
                          userBettedData?.position.toLowerCase() && (
                          <button className="w-20 text-white p-3 bg-gradient-to-br from-[--colors-win] to-[--colors-win] rounded-r-2xl uppercase">
                            Win
                          </button>
                        )}

                      {boxingData?.[0]?.result === "Up" &&
                        boxingData?.[0]?.result.toLowerCase() ===
                          userBettedData?.position.toLowerCase() &&
                        userBettedData?.claimed === true && (
                          <button className="flex gap-2 w-20 text-white p-3 bg-gradient-to-br from-[--colors-win] to-[--colors-win] rounded-r-2xl uppercase">
                            Win <Icons.CheckCircle />
                          </button>
                        )}

                      {boxingData?.[0]?.result === "Up" &&
                        boxingData?.[0]?.result.toLowerCase() ===
                          userBettedData?.position.toLowerCase() &&
                        userBettedData?.claimed === false && (
                          <button
                            className={`w-20 text-center flex justify-center items-center gap-1 text-[--colors-win] p-3 bg-gradient-to-br from-[white] to-[white] border-2 border-[--colors-win] rounded-r-2xl uppercase ${
                              isLoading && "opacity-8 from-gray-200 to-gray-200"
                            }`}
                            onClick={() => {
                              claimHandler(EMarketTypes.BOXING);
                            }}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-7 w-4 animate-spin" />
                            ) : (
                              <span>Claim</span>
                            )}
                          </button>
                        )}

                      {boxingData?.[0]?.result === "Down" && (
                        <button className="w-20 text-white py-3 bg-gradient-to-br from-[--colors-lose] to-[--colors-lose] rounded-r-2xl uppercase">
                          Lose
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-full flex items-center justify-between pl-2 bg-gradient-to-br from-slate-400 to-indigo-800 rounded-[20px] cursor-pointer ${
                      userBettedData?.position !== "DOWN"
                        ? "from-slate-500 to-slate-600 cursor-not-allowed"
                        : ""
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
                    <div className="flex flex-1 items-center justify-between text-white text-xs pl-2 font-bold leading-7">
                      <div>MARK ZUCKERBERG</div>
                      {boxingData?.[0]?.result === "Down" &&
                        boxingData?.[0]?.result.toLowerCase() !==
                          userBettedData?.position.toLowerCase() && (
                          <button className="w-20 text-white p-3 bg-gradient-to-br from-[--colors-win] to-[--colors-win] rounded-r-2xl uppercase">
                            Win
                          </button>
                        )}

                      {boxingData?.[0]?.result === "Down" &&
                        boxingData?.[0]?.result.toLowerCase() ===
                          userBettedData?.position.toLowerCase() &&
                        userBettedData?.claimed === true && (
                          <button className="flex gap-2 w-20 text-white p-3 bg-gradient-to-br from-[--colors-win] to-[--colors-win] rounded-r-2xl uppercase">
                            Win <Icons.CheckCircle />
                          </button>
                        )}

                      {boxingData?.[0]?.result === "Down" &&
                        boxingData?.[0]?.result.toLowerCase() ===
                          userBettedData?.position.toLowerCase() &&
                        userBettedData?.claimed === false && (
                          <button
                            className={`w-20 text-center flex justify-center items-center gap-1 text-[--colors-win] p-3 bg-gradient-to-br from-[white] to-[white] border-2 border-[--colors-win] rounded-r-2xl uppercase ${
                              isLoading && "opacity-8 from-gray-200 to-gray-200"
                            }`}
                            onClick={() => {
                              claimHandler(EMarketTypes.BOXING);
                            }}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-7 w-4 animate-spin" />
                            ) : (
                              <span>Claim</span>
                            )}
                          </button>
                        )}

                      {boxingData?.[0].result === "Up" && (
                        <button className="w-20 text-white p-3 bg-gradient-to-br from-[--colors-lose] to-[--colors-lose] rounded-r-2xl uppercase">
                          Lose
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full flex-1 h-[54px] flex items-center justify-between pl-2 bg-[#A1A0CA] rounded-[20px]">
                    <div className="w-40 md:w-44 py-[7px] px-4 text-[--colors-contrast] text-base font-light leading-7 bg-[--colors-backgroundAlt] rounded-[14px]">
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
                      {boxingData?.[0]?.result === "Up" ? (
                        <button className="w-16 text-white py-4 bg-gradient-to-br from-[--colors-win] to-[--colors-win] rounded-r-2xl uppercase cursor-not-allowed">
                          Win
                        </button>
                      ) : (
                        <button className="w-16 text-white py-4 bg-gradient-to-br from-[--colors-lose] to-[--colors-lose] rounded-r-2xl uppercase cursor-not-allowed">
                          Lose
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="w-full flex-1 h-[54px] flex items-center justify-between pl-2 bg-[#A1A0CA] rounded-[20px]">
                    <div className="w-40 md:w-44 py-[7px] px-4 text-[--colors-contrast] text-base font-light leading-7 bg-[--colors-backgroundAlt] rounded-[14px]">
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
                      {boxingData?.[0]?.result === "Down" ? (
                        <button className="w-16 text-white py-4 bg-gradient-to-br from-[--colors-win] to-[--colors-win] rounded-r-2xl uppercase cursor-not-allowed">
                          Win
                        </button>
                      ) : (
                        <button className="w-16 text-white py-4 bg-gradient-to-br from-[--colors-lose] to-[--colors-lose] rounded-r-2xl uppercase cursor-not-allowed">
                          Lose
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryBoxingCard;
