import React, { createRef } from "react";

import Link from "next/link";
import Image from "next/image";
import { Icons } from "@/components/Icons";
import classes from "./HeaderModal.module.css";

import { LIST_GAME } from "@/constants/navConstants";
import Popup, { PopupRef } from "@/components/ui/Modal";
import ChangeMode from "@/components/ui/ChangeMode";

const HeaderModal = () => {
  const menuModal = createRef<PopupRef>();

  const socialConfig = {
    size: 25,
    cursor: "pointer",
    fill: "var(--colors-white)",
    color: "var(--colors-white)",
  };

  const renderContent = () => {
    return (
      <div>
        <div className="relative">
          <Icons.X
            className="text-[--colors-contrast] absolute top-[-40px] right-[-40px] w-5 h-5"
            onClick={() => menuModal.current?.close()}
          />
        </div>
        <div className="flex flex-wrap justify-around gap-y-[10px]">
          {LIST_GAME.map((game) => {
            return (
              <Link
                key={game.id}
                href={game.link}
                className="w-[48%] h-[48px] rounded-3xl overflow-hidden flex justify-center items-center"
                onClick={() => menuModal.current?.close()}
              >
                <Image
                  src={game.img}
                  width={250}
                  height={80}
                  alt=""
                  className="!w-[200%] !h-auto !max-w-none !max-h-none object-cover"
                />
              </Link>
            );
          })}
        </div>
        <div>
          <div className="social-network flex justify-center my-4 py-4 gap-2 border-[--colors-white] border-solid border-t">
            <Link href={"/"} target="_blank">
              <Icons.Twitter {...socialConfig} />
            </Link>
            <Link href={"/"} target="_blank">
              <Icons.Telegram {...socialConfig} />
            </Link>
            <Link href={"/"} target="_blank">
              <Icons.GithubIcon {...socialConfig} />
            </Link>
            <Link href={"/"} target="_blank">
              <Icons.Reddit {...socialConfig} />
            </Link>
            <Link href={"/"} target="_blank">
              <Icons.Instagram color="var(--colors-white)" />
            </Link>
            <Link href={"/"} target="_blank">
              <Icons.YoutubeIcon {...socialConfig} />
            </Link>
          </div>
        </div>

        {/* <div>
          <ChangeMode />
        </div> */}
      </div>
    );
  };

  return (
    <Popup
      ref={menuModal}
      width={300}
      footer={false}
      header={false}
      className={classes["header-modal"]}
      selector={
        <Icons.Menu
          className="block lg:hidden mr-[5px]"
          fill="var(--colors-textSub)"
          onClick={() => menuModal.current?.open()}
        />
      }
      closable
      styleContent={{
        background: "var(--colors-backgroundAlt)",
        color: "var(--colors-text)",
      }}
      content={renderContent()}
    />
  );
};

export default HeaderModal;
