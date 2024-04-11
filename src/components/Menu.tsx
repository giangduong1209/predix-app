"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { Icons } from "./Icons";
import { useAccount } from "wagmi";
import { useAccountModal } from "@rainbow-me/rainbowkit";

const Menu = () => {
  const { isConnected = false } = useAccount();
  const { openAccountModal } = useAccountModal();

  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    setIsLogged(isConnected);
  }, [isConnected]);

  const renderLogout = () => {
    return isLogged ? (
      <div
        className="flex justify-center flex-col-reverse items-center w-[62px]"
        onClick={openAccountModal}
      >
        <span className="text-[10px] font-light leading-normal">Logout</span>
        <Icons.LogOutPredix fill="#fff" className="w-6" />
      </div>
    ) : null;
  };

  return (
    <div className="fixed w-full bg-gradient-to-br from-blue-300 to-green-600 bottom-[-1px] z-50">
      <div className="md:hidden flex justify-between text-white px-5 py-3">
        <Link
          href="/prediction/leaderboard"
          className="flex justify-center flex-col-reverse items-center w-[62px]"
        >
          <span className="text-[10px] font-light leading-normal">
            Leaderboard
          </span>
          <Icons.Leaderboard />
        </Link>

        <Link
          href="/referrals"
          className="flex justify-center flex-col-reverse items-center w-[62px]"
        >
          <span className="text-[10px] font-light leading-normal">
            Referral
          </span>
          <Icons.Referral />
        </Link>

        <Link
          href="/mint"
          className="flex justify-center flex-col-reverse items-center w-[62px]"
        >
          <span className="text-[10px] font-light leading-normal">NFTs</span>
          <Icons.NftsPredix fill="#fff" className="w-6" />
        </Link>

        <div className="flex justify-center flex-col-reverse items-center w-[62px]">
          <span className="text-[10px] font-light leading-normal">Staking</span>
          <Icons.Staking />
        </div>

        {renderLogout()}
      </div>
    </div>
  );
};

export default Menu;
