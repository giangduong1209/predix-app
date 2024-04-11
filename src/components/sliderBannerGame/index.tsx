import React from "react";

import "swiper/css";
import "swiper/css/pagination";

import Image from "next/image";
import classes from "./SliderBannerGame.module.css";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { LIST_BANNERS_GAME } from "@/constants/navConstants";

const SliderBannerGame: React.FC = () => {
  return (
    <div className={classes["banner-game"]}>
      <Swiper
        loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={true}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {LIST_BANNERS_GAME.map((banner, idx) => {
          return (
            <SwiperSlide key={banner.id}>
              <Link href={"/prediction"}>
                <div className="mb-9 px-[0px] sm:px-[12px] lg:px-[96px]">
                  <div className=" bg-[--colors-background-slider] rounded-[40px] sm:rounded-[60px] overflow-hidden flex items-center justify-center m-3">
                    <Image
                      src={banner.banner}
                      width={1000}
                      height={500}
                      alt={banner.name}
                      className="!w-[100%]"
                    />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SliderBannerGame;
