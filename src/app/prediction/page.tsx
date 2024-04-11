"use client";
import CoinCurrency from "@/components/CoinCurrency";
import CountDown from "@/components/CountDown";
import SubNav, { MODE } from "@/components/SubNav";
import Card from "@/components/bet-bo/Card";
import ClaimModal from "@/components/bet-bo/ClaimModal";
import Chart from "@/components/chart/Chart";
import DrawerHistory from "@/components/drawer-history/DrawerHistory";
import Popup, { PopupRef } from "@/components/ui/Modal";
import clsx from "clsx";
import React, { createRef, useEffect, useState } from "react";

const Prediction = () => {
  const [modeSubNavMobile, setModeSubNavMobile] = useState<string>(MODE.CHART);
  const collectWinningsRef = createRef<PopupRef>();
  const [statusClaim, setStatusClaim] = useState<string>("");
  const [collectWinning, setCollectWinning] = useState<{
    round: number;
    title: string;
  }>({
    round: 0,
    title: "Collect Winnnings",
  });

  const [isScreenMobile, setIsScreenMobile] = useState(false);

  const isShowDrawer = modeSubNavMobile === MODE.HISTORY;

  useEffect(() => {
    setIsScreenMobile(1024 > screen.width);
  }, []);

  useEffect(() => {
    let timeSet = setTimeout(() => {
      if (!isScreenMobile) return;

      return setModeSubNavMobile(MODE.CARD);
    }, 500);

    return () => {
      clearTimeout(timeSet);
    };
  }, [isScreenMobile]);

  const handlerToggleCollectWinning = (
    status: boolean,
    statusClaim: string,
    round: number,
    title: string
  ) => {
    setCollectWinning({
      round: round,
      title: title,
    });

    if (status === true) {
      setStatusClaim(statusClaim);
      return collectWinningsRef.current?.open();
    }
    return collectWinningsRef.current?.close();
  };

  return (
    <main className="bg-gradient-to-br from-gray-500 to-teal-800 overflow-hidden">
      <div className="flex overflow-hidden md:min-h-[90vh]">
        <div
          className={clsx(
            "overflow-hidden flex flex-col justify-between",
            isShowDrawer ? "w-[0px] lg:w-[calc(100%-385px)]" : "w-[100%]"
          )}
        >
          <div>
            <div className="text-[--colors-failure] p-4">
              <div className="flex flex-nowrap justify-between">
                <CoinCurrency />
                <CountDown
                  title="5m"
                  onAction={{
                    setIsShowDrawer: () => {
                      setModeSubNavMobile(MODE.HISTORY);
                    },
                  }}
                />
              </div>
            </div>

            <div
              className={clsx(
                modeSubNavMobile !== MODE.CARD && isScreenMobile && "hidden"
              )}
            >
              <Card />
            </div>
          </div>

          <div
            className={clsx(
              modeSubNavMobile !== MODE.CHART && isScreenMobile && "hidden"
            )}
          >
            <Chart />
          </div>
        </div>

        <DrawerHistory
          open={isShowDrawer}
          onClose={() => setModeSubNavMobile(MODE.CARD)}
          onCollect={handlerToggleCollectWinning}
        />
      </div>

      <SubNav modeMobile={modeSubNavMobile} onAction={setModeSubNavMobile} />

      <Popup
        ref={collectWinningsRef}
        width={300}
        footer={false}
        closable
        title={collectWinning.title}
        styleContent={{
          background: "var(--colors-backgroundAlt)",
          color: "var(--colors-text)",
        }}
        content={
          <ClaimModal
            winningRound={collectWinning.round}
            titleClaim={collectWinning.title}
            statusClaim={statusClaim}
            onCancel={() => {
              handlerToggleCollectWinning(false, "", 0, "");
            }}
          />
        }
      />
    </main>
  );
};

export default Prediction;
