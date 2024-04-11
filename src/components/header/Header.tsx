"use client";
import React from "react";
import Image from "next/image";
import HeaderItem from "./HeaderItem";
import HeaderModal from "./HeaderModal";
import ConnectWallet from "../ConnectWallet";
import NAV_HEADER from "@/constants/navConstants";
import SliderListGame from "../sliderListGame";

const Header = () => {
  const renderNavItems = () => {
    return NAV_HEADER.map((nav) => {
      return <HeaderItem key={nav.id} data={nav} />;
    });
  };

  return (
    <header className="w-full z-20 bg-[--colors-backgroundAlt]">
      <nav className="flex justify-between items-center w-full h-full px-4">
        <div className="navbar p-0 justify-between">
          <div className="navbar-start lg:flex w-auto gap-1 lg:gap-16">
            <HeaderModal />
            <a
              className="normal-case text-xl text-[--colors-textSubtle]"
              href="/"
            >
              <Image src="/svgs/logo.svg" width={110} height={40} alt="" />
            </a>
            <ul className="menu menu-horizontal p-0 flex-nowrap gap-1 xl:gap-2 hidden lg:flex items-center">
              {renderNavItems()}
            </ul>
          </div>
          <div className="navbar-end gap-2 p-2 w-auto">
            <ConnectWallet />
          </div>
        </div>
      </nav>

      <SliderListGame />
    </header>
  );
};

export default Header;
