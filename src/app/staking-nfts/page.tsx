"use client";
import React, { useState } from "react";

import DashboardLayout from "@/components/staking-nfts/DashboardLayout";
import GameDashboardContent from "@/components/staking-nfts/GameDashboardContent";

const StakingNFTs = () => {
  const [isShowListNFTsMobile, setIsShowListNFTsMobile] =
    useState<boolean>(false);

  const handleToggleNFTsMobile = () => {
    setIsShowListNFTsMobile(!isShowListNFTsMobile);
  };

  return (
    <div className="flex flex-col-reverse justify-end md:flex-row min-h-screen bg-[--colors-background]">
      <GameDashboardContent isShowListNFTsMobile={isShowListNFTsMobile} />
      <DashboardLayout onActionHeader={handleToggleNFTsMobile} />
    </div>
  );
};

export default StakingNFTs;
