import React, { useEffect, useState } from "react";
import * as echarts from "echarts/core";
import {
  GridComponent,
  GridComponentOption,
  ToolboxComponent,
  LegendComponent,
  TooltipComponent,
  TitleComponent,
  MarkLineComponent,
} from "echarts/components";
import { LineChart, LineSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import { DocumentData } from "firebase/firestore";

import dayjs from "dayjs";
import HeaderChart from "./HeaderChart";
import Link from "next/link";
import { Icons } from "../Icons";
import clsx from "clsx";

echarts.use([
  GridComponent,
  ToolboxComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  LegendComponent,
  TooltipComponent,
  TitleComponent,
  MarkLineComponent,
]);

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | LineSeriesOption
>;

const Chart: React.FC = () => {
  const [isShowChart, setIsShowChart] = useState<boolean>(true);
  const [chartData, setChartData] = useState<DocumentData[]>([]);

  const [dataHeader, setDataHeader] = useState<{
    time: string;
    price: number | null;
  }>({
    time: "",
    price: null,
  });

  useEffect(() => {
    const firstRenderChart = setTimeout(() => {
      if (1024 <= screen.width) setIsShowChart(false);
    }, 200);

    return () => {
      clearTimeout(firstRenderChart);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const sevenMinutesAgo = new Date(now.getTime() - 7 * 60 * 1000);
      getDataFileredByOnSnapshot(
        "charts",
        [["created_at", ">=", sevenMinutesAgo.getTime() / 1000]],
        (docs) => {
          setChartData(docs);
        }
      );
      return () => clearInterval(interval);
    }, 2000);
  }, []);

  useEffect(() => {
    var chartDom = document.getElementById("main")!;
    var myChart = echarts.init(chartDom);

    let time: any = [];
    let price: any = [];
    let min = 100000;
    let max = 0;

    chartData?.map((chart) => {
      const _price = chart.price / 10 ** 8;
      min = _price < min ? _price : min;
      max = _price > max ? _price : max;

      time = [...time, dayjs(chart.created_at * 1000).format("h:mm A")];
      price = [...price, _price];
    });

    const markLine =
      price.length > 0
        ? {
            symbol: "none",
            label: {
              color: "#fff",
            },
            lineStyle: {
              color: "#fff",
            },
            data: [
              {
                name: "target",
                yAxis: price?.[price.length - 1],
                label: {
                  show: true,
                },
              },
            ],
          }
        : {};

    const option: EChartsOption = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
        formatter: (params: any) => {
          setDataHeader({
            price: params?.[0]?.data?.toFixed(4) ?? params?.[0]?.data,
            time: params?.[0]?.axisValue,
          });

          return `${params?.[0]?.axisValue}<br><b>${params?.[0]?.data?.toFixed(
            4
          )} BNB/USD</b>`;
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: time,
        axisLabel: {
          color: "#74ddca",
          fontWeight: 500,
        },
      },
      yAxis: {
        show: true,
        type: "value",
        position: "right",
        min: (min - 0.1).toFixed(2),
        max: (max + 0.05).toFixed(2),
        // splitNumber: 2,
        interval: 0.2,
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: (value: any) => {
            return `${value.toFixed(4)}`;
          },
          color: "#74ddca",
          fontWeight: 500,
        },
      },
      series: [
        {
          data: price,
          type: "line",
          showSymbol: false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#53dee9" },
              { offset: 1, color: "rgba(83, 222, 233, 0)" },
            ]),
          },
          itemStyle: { borderColor: "#ffc700" },
          lineStyle: { color: "#19c0cc" },
          smooth: false,
          markLine,
        },
      ],
      grid: {
        left: 0,
        right: 15,
        bottom: 10,
        containLabel: true,
      },
    };

    option && myChart.setOption(option);
  }, [chartData]);

  const handleToggleShowChart = () => {
    setIsShowChart(!isShowChart);
  };

  return (
    <div>
      <div className="hidden lg:block">
        <div className="flex pl-3">
          <div
            className="flex items-center gap-1 p-4 pb-3 text-[--colors-text] bg-[--colors-backgroundAlt] rounded-t-3xl text-base font-semibold cursor-pointer"
            onClick={() => handleToggleShowChart()}
          >
            <Icons.BarChart3 />
            ChainLink Chart
          </div>
        </div>
        <div className="flex items-center gap-1 justify-end h-[24px] pr-6 text-[--colors-text] bg-[--colors-backgroundAlt] text-sm">
          BNB/USD Chart by
          <Link
            href={"/prediction"}
            className="font-bold text-[--colors-primary]"
          >
            Chainlink Oracle
          </Link>
        </div>
      </div>

      {isShowChart ? (
        <HeaderChart time={dataHeader.time} price={dataHeader.price ?? 0} />
      ) : null}

      <div
        id="main"
        className={clsx(
          "w-full h-[60vh] lg:h-[350px] md:h-[400px] bg-[--colors-backgroundAlt] lg:bg-inherit",
          !isShowChart && "hidden"
        )}
      ></div>
    </div>
  );
};

export default Chart;
