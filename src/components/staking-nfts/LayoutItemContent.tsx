"use client";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Button from "../ui/Button";
import { useCountdown } from "@/hooks/useCountDown";
import { metadata } from "./GameDashboardContent";

const LayoutItemContent: FC<any> = ({
  description,
  dna,
  edition,
  image,
  name,
  date,
}: metadata) => {
  const [isHitToDeadline, setIsHitToDeadline] = useState<boolean>(false);
  const [loadingUnStaking, setLoadingUnStaking] = useState<boolean>(false);
  const [days, hours, minutes, seconds] = useCountdown<Date>(
    new Date("2024-09-20")
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="rounded-xl h-52 px-3 py-5 flex text-white bg-yellow-400 w-full lg:w-[49.55%]">
      <Image src={image} width={160} height={160} alt="img" />

      <div className="flex justify-between flex-grow ml-3 flex-col">
        <div>
          <p className="text-sm mb-2 md:text-lg">{edition}</p>
          <p className="text-xs md:text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
            ipsa ipsum inventore odio officia adipisci repellat rerum.
          </p>
        </div>

        {isHitToDeadline ? (
          <Button
            className="mt-auto mb-1"
            // onClick={() => unstaking()}
            isLoading={loadingUnStaking}
            style={{ marginBottom: 5, marginTop: "auto" }}
          >
            UnStaking
          </Button>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <div className="text-sm">
              Available for un-staking after:{" "}
              {isClient &&
              +days > 0 &&
              +hours > 0 &&
              +minutes > 0 &&
              +seconds > 0 ? (
                <span className="text-[#2196f3]">
                  {days}d:{hours}h:{minutes}m:{seconds}s
                </span>
              ) : (
                ""
              )}
            </div>
            {/* <Countdown
              onChange={(time) => handleChangeTimeCountDown(time)}
              onFinish={() => setIsHitToDeadline(true)}
              value={deadline.valueOf()}
              format={format}
              valueStyle={{
                paddingLeft: "10px",
                color: "#36a920",
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutItemContent;
