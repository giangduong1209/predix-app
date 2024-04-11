import React, { useState } from "react";
import { Icons } from "../Icons";
import Button from "../ui/Button";
import { ethers } from "ethers";
import { toFixedEtherNumber } from "@/utils/format-number";

interface IRanking {
  ranking: IUserList[];
}

const Ranking: React.FC<IRanking> = ({ ranking }) => {
  const [lastIdxData, setLastIdxData] = useState<number>(17);

  const loadMoreDataHandler = () => {
    setLastIdxData((prev) => prev + 20);
  };

  const rankingsLimited = ranking && ranking.slice(0, lastIdxData);

  return (
    <div className="bg-[--colors-background] pb-10">
      <div className="overflow-x-auto rounded-[--radii-card] max-w-[1200px] mx-auto">
        <table className="hidden bg-[--colors-backgroundAlt] mb-6 lg:table">
          <thead className="border-b-2 border-[--colors-cardBorder]">
            <tr>
              <th></th>
              <th className="text-[--colors-secondary] uppercase text-xs">
                USER
              </th>
              <th className="text-[--colors-secondary] uppercase text-xs text-right">
                NET WINNINGS (BNB)
              </th>
              <th className="text-[--colors-secondary] uppercase text-xs text-center">
                WIN RATE
              </th>
              <th className="text-[--colors-secondary] uppercase text-xs text-center">
                ROUNDS WON
              </th>
              <th className="text-[--colors-secondary] uppercase text-xs text-center">
                ROUNDS PLAYED
              </th>
            </tr>
          </thead>
          <tbody>
            {rankingsLimited ? (
              rankingsLimited.map((rankingLimited, idx) => (
                <tr
                  key={rankingLimited.user_id}
                  className="!border-b-[--colors-cardBorder] border-b-2"
                >
                  <td>
                    <div className="text-[--colors-secondary] text-base font-bold">
                      #{idx + 4}
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-start items-center gap-2">
                      <Icons.AvatarUser className="w-10 h-10" />
                      <span className="text-[--colors-primary] font-bold text-base">
                        {rankingLimited?.nickname}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div
                      className={`text-right text-[${
                        rankingLimited?.leaderboard.net_winnings < 0
                          ? "--colors-failure"
                          : "--colors-success"
                      }] text-base font-bold`}
                    >
                      {rankingLimited?.leaderboard.net_winnings > 0 ? "+" : ""}
                      {rankingLimited?.leaderboard?.net_winnings
                        ? toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(rankingLimited?.leaderboard.net_winnings)
                            ),
                            2
                          )
                        : 0}
                    </div>
                    {/* <div className="text-right text-[--colors-textSubtle] text-xs font-normal">
                      ~$0,03
                    </div> */}
                  </td>
                  <td className="text-[--colors-text] text-center font-medium">
                    {rankingLimited?.leaderboard?.win_rate.toFixed(2)}%
                  </td>
                  <td className="text-[--colors-text] text-center font-medium">
                    {rankingLimited?.leaderboard?.round_winning}
                  </td>
                  <td className="text-[--colors-text] text-center font-medium">
                    {rankingLimited?.leaderboard?.round_played}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-base text-center text-[--colors-text]">
                  No Data
                </td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="w-full text-center pb-6 hidden lg:block">
          <Button
            className="bg-transparent border-2 border-[--colors-primary] rounded-2xl p-6 text-[--colors-primary]"
            onClick={loadMoreDataHandler}
          >
            View More
          </Button>
        </div>
      </div>
      <div className="text-center w-full lg:hidden">
        <div className="bg-[--colors-backgroundAlt] mb-6 lg:hidden">
          {rankingsLimited &&
            rankingsLimited.map((rankingLimited, idx) => (
              <div
                key={rankingLimited.user_id}
                className="flex flex-col p-4 border-b-[--colors-cardBorder] border-b-2"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="text-[--colors-secondary] font-bold text-base">
                    #{idx + 4}
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <div className="text-base text-[--colors-primary] font-bold">
                      {rankingLimited?.nickname}
                    </div>
                    <Icons.AvatarUser className="w-10 h-10" />
                  </div>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[--colors-textSubtle] font-normal text-xs">
                    Win Rate
                  </span>
                  <span className="text-[--colors-text] text-base font-bold">
                    {rankingLimited?.leaderboard?.win_rate.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[--colors-textSubtle] font-normal text-xs">
                    Net Winnings (BNB)
                  </span>
                  <div className="flex flex-col justify-between items-end">
                    <span
                      className={`text-right text-[${
                        rankingLimited?.leaderboard.net_winnings < 0
                          ? "--colors-failure"
                          : "--colors-success"
                      }] font-bold text-base`}
                    >
                      {rankingLimited?.leaderboard.net_winnings > 0 ? "+" : ""}
                      {rankingLimited?.leaderboard?.net_winnings
                        ? toFixedEtherNumber(
                            ethers.formatEther(
                              BigInt(rankingLimited?.leaderboard.net_winnings)
                            ),
                            2
                          )
                        : 0}
                    </span>
                    {/* <span className="text-[--colors-textSubtle] font-normal text-xs">
                      ~$0,03
                    </span> */}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[--colors-textSubtle] font-normal text-xs">
                    Rounds Won
                  </span>
                  <span className="text-[--colors-text] text-base font-bold">
                    {rankingLimited?.leaderboard?.round_winning}/
                    {rankingLimited?.leaderboard?.round_played}
                  </span>
                </div>
              </div>
            ))}
        </div>
        {rankingsLimited && (
          <Button
            className="bg-transparent border-2 border-[--colors-primary] rounded-2xl p-6 text-[--colors-primary]"
            onClick={loadMoreDataHandler}
          >
            View More
          </Button>
        )}
      </div>
    </div>
  );
};

export default Ranking;
