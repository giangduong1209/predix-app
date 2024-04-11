"use client";
import Image from "next/image";
import React from "react";

const CoinCurrency: React.FC = () => {
  return (
    <div className="bg-[--colors-backgroundAlt] p-2 px-3 rounded-3xl text-[--colors-text] flexcursor-pointer   justify-center flex items-center rounded-br-3xl gap-2">
      <Image src="/svgs/bnb-logo.svg" alt="" width={40} height={40} />
      <div className="text-base font-semibold md:text-lg">
        <span>BNB/USD</span>
      </div>
    </div>
  );
};

export default CoinCurrency;
