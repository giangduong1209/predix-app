import React from "react";
import { Icons } from "../Icons";
import { toFixedEtherNumber } from "@/utils/format-number";
import { ethers } from "ethers";
import Skeleton from "react-loading-skeleton";

interface ITopRankingProps {
  topLeaderboard: IUserList[];
}

const TopRanking: React.FC<ITopRankingProps> = ({ topLeaderboard }) => {
  return (
    <div className="flex flex-col w-full gap-2 mb-4 lg:flex-row">
      {topLeaderboard?.[0] ? (
        <div className="relative overflow-x-auto flex-1 rounded-[--radii-card] bg-[--colors-backgroundAlt]">
          <div className="bg-[--colors-gold] text-white py-1 lg:py-2 px-0 absolute right-auto top-0 text-center origin-top-left w-24 top-banner before:bg-[--colors-gold] before:w-full before:h-full before:absolute before:top-0 before:right-3/4 after:bg-[--colors-gold] after:w-full after:h-full after:absolute after:top-0 after:left-3/4">
            <div>#1</div>
          </div>
          <div className="flex flex-col p-8 lg:p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                <Icons.LaurelLeft className="text-[--colors-gold] fill-[--colors-gold] rotate-[30deg]" />
                <Icons.AvatarUser className="w-10 h-10 lg:w-16 lg:h-16" />
                <Icons.LaurelRight className="text-[--colors-gold] fill-[--colors-gold] rotate-[-30deg]" />
              </div>
              <div className="text-base text-[--colors-primary] font-bold">
                {topLeaderboard?.[0]?.nickname}
              </div>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[--colors-textSubtle] font-normal text-xs">
                Win Rate
              </span>
              <span className="text-[--colors-text] text-base font-bold">
                {topLeaderboard?.[0]?.leaderboard.win_rate.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[--colors-textSubtle] font-normal text-xs">
                Net Winnings (BNB)
              </span>
              <div className="flex flex-col justify-between items-end">
                <span
                  className={`text-[${
                    topLeaderboard?.[0]?.leaderboard.net_winnings < 0
                      ? "--colors-failure"
                      : "--colors-success"
                  }] font-bold text-base`}
                >
                  {topLeaderboard?.[0]?.leaderboard.net_winnings > 0 ? "+" : ""}
                  {topLeaderboard?.[0]?.leaderboard?.net_winnings
                    ? toFixedEtherNumber(
                        ethers.formatEther(
                          BigInt(topLeaderboard?.[0]?.leaderboard.net_winnings)
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
                {topLeaderboard?.[0]?.leaderboard.round_winning}/
                {topLeaderboard?.[0].leaderboard.round_played}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton
          width={395}
          height={228}
          className="!w-full lg:!w-[395px] !rounded-[--radii-card]"
        />
      )}
      {topLeaderboard?.[1] ? (
        <div className="relative overflow-x-auto flex-1 rounded-[--radii-card] bg-[--colors-backgroundAlt]">
          <div className="bg-[--colors-silver] text-white py-1 lg:py-2 px-0 absolute right-auto top-0 text-center origin-top-left w-24 top-banner before:bg-[--colors-silver] before:w-full before:h-full before:absolute before:top-0 before:right-3/4 after:bg-[--colors-silver] after:w-full after:h-full after:absolute after:top-0 after:left-3/4">
            <div>#2</div>
          </div>
          <div className="flex flex-col p-8 lg:p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                <Icons.LaurelLeft className="text-[--colors-silver] fill-[--colors-silver] rotate-[30deg]" />
                <Icons.AvatarUser className="w-10 h-10 lg:w-16 lg:h-16" />
                <Icons.LaurelRight className="text-[--colors-silver] fill-[--colors-silver] rotate-[-30deg]" />
              </div>
              <div className="text-base text-[--colors-primary] font-bold">
                {topLeaderboard?.[1]?.nickname}
              </div>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[--colors-textSubtle] font-normal text-xs">
                Win Rate
              </span>
              <span className="text-[--colors-text] text-base font-bold">
                {topLeaderboard?.[1]?.leaderboard.win_rate.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[--colors-textSubtle] font-normal text-xs">
                Net Winnings (BNB)
              </span>
              <div className="flex flex-col justify-between items-end">
                <span
                  className={`text-[${
                    topLeaderboard?.[1]?.leaderboard.net_winnings < 0
                      ? "--colors-failure"
                      : "--colors-success"
                  }] font-bold text-base`}
                >
                  {topLeaderboard?.[1]?.leaderboard.net_winnings > 0 ? "+" : ""}
                  {topLeaderboard?.[1]?.leaderboard?.net_winnings
                    ? toFixedEtherNumber(
                        ethers.formatEther(
                          BigInt(topLeaderboard?.[1]?.leaderboard.net_winnings)
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
                {topLeaderboard?.[1]?.leaderboard.round_winning}/
                {topLeaderboard?.[1].leaderboard.round_played}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton
          width={395}
          height={228}
          className="!w-full lg:!w-[395px] !rounded-[--radii-card]"
        />
      )}
      {topLeaderboard?.[2] ? (
        <div className="relative overflow-x-auto flex-1 rounded-[--radii-card] bg-[--colors-backgroundAlt]">
          <div className="bg-[--colors-bronze] text-white py-1 lg:py-2 px-0 absolute right-auto top-0 text-center origin-top-left w-24 top-banner before:bg-[--colors-bronze] before:w-full before:h-full before:absolute before:top-0 before:right-3/4 after:bg-[--colors-bronze] after:w-full after:h-full after:absolute after:top-0 after:left-3/4">
            <div>#3</div>
          </div>
          <div className="flex flex-col p-8 lg:p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                <Icons.LaurelLeft className="text-[--colors-bronze] fill-[--colors-bronze] rotate-[30deg]" />
                <Icons.AvatarUser className="w-10 h-10 lg:w-16 lg:h-16" />
                <Icons.LaurelRight className="text-[--colors-bronze] fill-[--colors-bronze] rotate-[-30deg]" />
              </div>
              <div className="text-base text-[--colors-primary] font-bold">
                {topLeaderboard?.[2]?.nickname}
              </div>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[--colors-textSubtle] font-normal text-xs">
                Win Rate
              </span>
              <span className="text-[--colors-text] text-base font-bold">
                {topLeaderboard?.[2]?.leaderboard.win_rate.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[--colors-textSubtle] font-normal text-xs">
                Net Winnings (BNB)
              </span>
              <div className="flex flex-col justify-between items-end">
                <span
                  className={`text-[${
                    topLeaderboard?.[2]?.leaderboard.net_winnings < 0
                      ? "--colors-failure"
                      : "--colors-success"
                  }] font-bold text-base`}
                >
                  {topLeaderboard?.[2]?.leaderboard.net_winnings > 0 ? "+" : ""}
                  {topLeaderboard?.[2]?.leaderboard?.net_winnings
                    ? toFixedEtherNumber(
                        ethers.formatEther(
                          BigInt(topLeaderboard?.[2]?.leaderboard.net_winnings)
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
                {topLeaderboard?.[2]?.leaderboard.round_winning}/
                {topLeaderboard?.[2].leaderboard.round_played}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton
          width={395}
          height={228}
          className="!w-full lg:!w-[395px] !rounded-[--radii-card]"
        />
      )}
    </div>
  );
};

export default TopRanking;
