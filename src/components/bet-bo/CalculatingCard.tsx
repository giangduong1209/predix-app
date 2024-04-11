import React from "react";
import { Icons } from "../Icons";
import Image from "next/image";
import TooltipElement from "../ui/Tooltip";

interface ICalculatingCardProps {
  liveRound: number;
}

const CalculatingCard: React.FC<ICalculatingCardProps> = ({ liveRound }) => {
  let theme;
  if (typeof window !== "undefined") {
    theme = localStorage.getItem("theme") || "dark";
  }

  return (
    <div className={"card w-80 z-20 bg-[--colors-backgroundAlt] shadow-xl"}>
      <div className="flex justify-between items-center bg-[--colors-backgroundAlt] h-9 p-2 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Icons.Clock3 className="text-[--colors-text]" />
          <span className="text-[--colors-text]">Calculating</span>
        </div>
        <div className="text-[--colors-text]">#{liveRound}</div>
      </div>
      <div className="card-body p-4">
        <div className="relative -mb-[0.55rem]">
          <div className="h-16 mx-auto w-60">
            {theme === "dark" ? (
              <Image src="/images/up.png" width={288} height={64} alt="up" />
            ) : (
              <Image
                src="/images/prediction_light.png"
                width={288}
                height={64}
                alt="down light"
                className="rotate-180"
              />
            )}
            <div className="flex items-center flex-col justify-center absolute top-0 left-0 w-full h-full">
              <div
                className={`text-[--colors-textDisabled] font-semibold uppercase text-xl`}
              >
                UP
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-[2px]">
          <div className="bg-[--colors-backgroundAlt] rounded-xl p-4 flex flex-col gap-1 border-2 border-[--colors-cardBorder]">
            <div className="">
              <Image
                src="/gifs/calculating.gif"
                alt="calculating"
                width={96}
                height={115}
                className="text-center m-auto"
              />
              <div className="flex items-center justify-center text-[--colors-text] ">
                <span>Calculating</span>
                <TooltipElement title="This round's closing transaction has been submitted to the blockchain, and is waiting confirmation">
                  <Icons.HelpCircleIcon />
                </TooltipElement>
              </div>
            </div>
          </div>
        </div>
        <div className="relative -mt-[0.55rem]">
          <div className="h-16 mx-auto w-60">
            {theme === "dark" ? (
              <Image src="/images/down.png" width={288} height={64} alt="up" />
            ) : (
              <Image
                src="/images/prediction_light.png"
                width={288}
                height={64}
                alt="down light"
              />
            )}
            <div className="flex items-center flex-col justify-center absolute top-0 left-0 w-full h-full">
              <div className="text-[--colors-textDisabled] font-semibold uppercase text-xl">
                DOWN
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatingCard;
