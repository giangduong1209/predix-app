"use client";
import { Icons } from "@/components/Icons";
import FilterLeaderboard from "@/components/leaderboard/FilterLeaderboard";
import MyRanking from "@/components/leaderboard/MyRanking";
import Ranking from "@/components/leaderboard/Ranking";
import TopRanking from "@/components/leaderboard/TopRanking";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import { DocumentData } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState<DocumentData[]>([]);

  useEffect(() => {
    getDataFileredByOnSnapshot(
      "leaderboard",
      [["type", "==", "Rounds Played"]],
      (docs: DocumentData) => {
        setLeaderboardData(docs as DocumentData[]);
      }
    );
  }, []);

  const queryHandler = (option: string) => {
    getDataFileredByOnSnapshot(
      "leaderboard",
      [["type", "==", option]],
      (docs: DocumentData) => {
        setLeaderboardData(docs as DocumentData[]);
      }
    );
  };

  const topLeaderboard = leaderboardData?.[0]?.user_lists.slice(0, 3);

  const ranking = leaderboardData?.[0]?.user_lists.slice(3);

  return (
    <main className="w-full min-h-[90vh]">
      <div className="bg-gradient-to-r from-[--colors-bubblegum1] to-[--colors-bubblegum2] p-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-6">
            <ul className="flex items-center flex-wrap">
              <li>
                <a href="/" className="text-[--colors-primary] font-semibold">
                  Home
                </a>
              </li>
              <li className="p-2 md:p-4">
                <Icons.ChevronRightIcon className="text-[--colors-textDisabled]" />
              </li>
              <li>
                <a
                  href="/prediction"
                  className="text-[--colors-primary] font-semibold"
                >
                  Prediction
                </a>
              </li>
              <li className="p-2 md:p-4">
                <Icons.ChevronRightIcon className="text-[--colors-textDisabled]" />
              </li>
              <li>
                <p className="text-[--colors-text] font-semibold text-base">
                  Leaderboard
                </p>
              </li>
            </ul>
          </div>
          <h1 className="text-5xl font-semibold text-[--colors-secondary] md:text-6xl">
            Leaderboard
          </h1>
        </div>
      </div>
      <div className="bg-[--colors-background] p-6">
        <div className="max-w-[1200px] mx-auto">
          <FilterLeaderboard onQueries={queryHandler} />
          <MyRanking />
          <TopRanking topLeaderboard={topLeaderboard} />
        </div>
      </div>
      <Ranking ranking={ranking} />
    </main>
  );
};

export default LeaderBoard;
