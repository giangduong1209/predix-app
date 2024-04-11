"use client";
import React, { useState } from "react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { LIST_GAME } from "@/constants/navConstants";

import classes from "./SliderListGame.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

const SliderListGame: React.FC = () => {
  const [games, setGames] =
    useState<{ id: string; img: string; link: string }[]>(LIST_GAME);

  const renderCardGamesDesktop = () => {
    return games.map((games, index) => {
      return (
        <Link
          key={`${games.id}${index}`}
          href={games.link}
          className="block w-[24%] rounded-[60px]"
        >
          <div className="w-full rounded-[60px] overflow-hidden flex items-center justify-center text-[--colors-textSubtle] font-bold select-none cursor-pointer">
            <Image
              src={games.img}
              sizes="1000"
              width={100}
              height={50}
              alt={games.id}
              className={clsx("max-w-fit w-full h-auto rounded-[60px]")}
            />
          </div>
        </Link>
      );
    });
  };

  const renderCardGames = () => {
    return games.map((games, index) => {
      return (
        <SwiperSlide key={`${games.id}${index}`}>
          <Link href={games.link} className="mx-2 block">
            <div className="w-[130px] sm:w-[520px] h-[60px] sm:h-[140px] rounded-[60px] overflow-hidden flex items-center justify-center text-[--colors-textSubtle] font-bold select-none cursor-pointer">
              <Image
                src={games.img}
                sizes="1000"
                width={100}
                height={50}
                alt={games.id}
                className={clsx(
                  "max-w-fit w-[250px] sm:!w-[560px]",
                  index === 3 && "h-[60px] sm:h-auto"
                )}
              />
            </div>
          </Link>
        </SwiperSlide>
      );
    });
  };

  return (
    <div className={clsx(classes["list-game"], "bg-[--colors-backgroundAlt]")}>
      <div className="hidden sm:flex justify-center gap-3 py-3 px-7">
        {renderCardGamesDesktop()}
      </div>

      <div className="block sm:hidden">
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={24}
          freeMode={false}
          modules={[FreeMode, Pagination]}
          // centeredSlides={true}
          slideToClickedSlide={true}
        >
          {renderCardGames()}
        </Swiper>
      </div>
    </div>
  );
};

export default SliderListGame;
