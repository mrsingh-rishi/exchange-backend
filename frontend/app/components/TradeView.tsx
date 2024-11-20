import { useEffect, useRef } from "react";
import { KLine } from "../utils/types";
import { getKlines } from "../utils/httpClient";
import { ChartManager } from "../utils/ChartManager";

export const TradeView = ({ market }: { market: string }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager>(null);

  function generateKLineData(count: number): KLine[] {
    const klineArray: KLine[] = [];

    for (let i = 0; i < count; i++) {
      const open = (Math.random() * 100).toFixed(2);
      const close = (Math.random() * 100).toFixed(2);
      const high = Math.max(
        parseFloat(open),
        parseFloat(close),
        Math.random() * 100
      ).toFixed(2);
      const low = Math.min(
        parseFloat(open),
        parseFloat(close),
        Math.random() * 100
      ).toFixed(2);

      klineArray.push({
        open,
        close,
        high,
        low,
        volume: (Math.random() * 1000).toFixed(2),
        quoteVolume: (Math.random() * 1000).toFixed(2),
        start: new Date(Date.now() - i * 60000).toISOString(), // Generate timestamps in the past
        end: new Date(Date.now() - (i - 1) * 60000).toISOString(),
        trades: Math.floor(Math.random() * 100).toString(),
      });
    }

    return klineArray;
  }

  useEffect(() => {
    const init = async () => {
      let klineData: KLine[] = [];

      try {
        // klineData = await getKlines(
        //   market,
        //   "1m",
        //   Math.floor(
        //     (new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000
        //   ).toString(),
        //   Math.floor(new Date().getTime() / 1000).toString()
        // );
        klineData = generateKLineData(1000);
        console.log(klineData);
      } catch (error) {
        console.log(error);
      }

      if (chartRef) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy();
        }

        console.log(klineData);

        const chartManager = new ChartManager(
          chartRef.current,
          [
            ...klineData?.map((x) => ({
              close: parseFloat(x.close),
              high: parseFloat(x.high),
              low: parseFloat(x.low),
              open: parseFloat(x.open),
              timestamp: new Date(x.end),
            })),
          ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
          {
            background: "#0e0f14",
            color: "white",
          }
        );
        // @ts-ignore
        chartManagerRef.current = chartManager;
      }
    };
    init();
  }, [market, chartRef]);

  return (
    <>
      <div
        ref={chartRef}
        style={{ height: "520px", width: "100%", marginTop: 4 }}
      ></div>
    </>
  );
};
