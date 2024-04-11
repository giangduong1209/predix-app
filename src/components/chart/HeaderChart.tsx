import React from "react";

import dayjs from "dayjs";

interface IHeaderChart {
  time: string;
  price: number;
}

const HeaderChart: React.FC<IHeaderChart> = ({ time, price }) => {
  if (price === 0)
    return (
      <div className="h-[80px] bg-[--colors-backgroundAlt] lg:bg-[--colors-gradientBubblegum]" />
    );

  const data = new Date();
  return (
    <div className="flex items-center gap-3 pt-5 px-3 bg-[--colors-backgroundAlt] lg:bg-[--colors-gradientBubblegum]">
      <div className="flex items-center gap-2">
        <div className="text-[--colors-white] font-bold text-[32px] md:text-[40px]">
          {price}
        </div>
        <div className="font-bold text-[--colors-textSubtle] text-xl">
          BNB/USD
        </div>
      </div>

      {time ? (
        <div className="text-[--colors-textSubtle] hidden md:block">
          {dayjs(data).format("MMMM D, YYYY")} {time}
        </div>
      ) : null}
    </div>
  );
};

export default HeaderChart;
