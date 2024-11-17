"use client";
import { useEffect, useState } from "react";
import { Ticker } from "../utils/types";
import { useRouter } from "next/navigation";

const cryptoTickers: Ticker[] = [
  {
    firstPrice: "45000",
    high: "48000",
    lastPrice: "47000",
    low: "44000",
    priceChange: "2000",
    priceChangePercent: "4.5",
    quoteVolume: "1200",
    symbol: "BTC_USD",
    trades: "2300",
    volume: "1500",
  },
  {
    firstPrice: "3200",
    high: "3400",
    lastPrice: "3300",
    low: "3100",
    priceChange: "100",
    priceChangePercent: "3.1",
    quoteVolume: "800",
    symbol: "ETH_USD",
    trades: "1200",
    volume: "1000",
  },
  {
    firstPrice: "0.45",
    high: "0.5",
    lastPrice: "0.47",
    low: "0.44",
    priceChange: "0.02",
    priceChangePercent: "4.2",
    quoteVolume: "10000",
    symbol: "XRP_USD",
    trades: "1500",
    volume: "8000",
  },
];

export const Markets = () => {
  const [tickers, setTickers] = useState<Ticker[]>([]);

  useEffect(() => {
    // fetch tickers and set them
    setTickers(cryptoTickers);
  });
  return (
    <div className="flex flex-col flex-1 max-w-[1280px] w-full">
      <div className="flex flex-col min-w-[700px] flex-1 w-full">
        <div className="flex flex-col w-full rounded-lg bg-baseBackgroundL1 px-5 py-3">
          <table className="w-full table-auto">
            <MarketHeader />
            {tickers?.map((m, index) => (
              <MarketRow key={index} market={m} />
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

function MarketHeader() {
  return (
    <thead>
      <tr className="">
        <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">
          <div className="flex items-center gap-1 cursor-pointer select-none">
            Name<span className="w-[16px]"></span>
          </div>
        </th>
        <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">
          <div className="flex items-center gap-1 cursor-pointer select-none">
            Price<span className="w-[16px]"></span>
          </div>
        </th>
        <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">
          <div className="flex items-center gap-1 cursor-pointer select-none">
            Market Cap<span className="w-[16px]"></span>
          </div>
        </th>
        <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">
          <div className="flex items-center gap-1 cursor-pointer select-none">
            24h Volume
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-down h-4 w-4"
            >
              <path d="M12 5v14"></path>
              <path d="m19 12-7 7-7-7"></path>
            </svg>
          </div>
        </th>
        <th className="px-2 py-3 text-left text-sm font-normal text-baseTextMedEmphasis">
          <div className="flex items-center gap-1 cursor-pointer select-none">
            24h Change<span className="w-[16px]"></span>
          </div>
        </th>
      </tr>
    </thead>
  );
}

function MarketRow({ market }: { market: Ticker }) {
  const router = useRouter();
  const isPositiveChange = Number(market.priceChangePercent) > 0;

  return (
    <tr
      className="cursor-pointer border-t border-baseBorderLight hover:bg-white/7 w-full"
      onClick={() => router.push(`/trade/${market.symbol}`)}
    >
      <td className="px-1 py-3">
        <div className="flex shrink">
          <div className="flex items-center">
            <div
              className="relative flex-none overflow-hidden rounded-full border border-baseBorderMed"
              style={{ width: "40px", height: "40px" }}
            >
              <div className="relative">
                <img
                  alt={market.symbol}
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVvBqZC_Q1TSYObZaMvK0DRFeHZDUtVMh08Q&s"
                  }
                  loading="lazy"
                  width="40"
                  height="40"
                  decoding="async"
                  data-nimg="1"
                />
              </div>
            </div>
            <div className="ml-4 flex flex-col">
              <p className="whitespace-nowrap text-base font-medium text-baseTextHighEmphasis">
                {market.symbol}
              </p>
              <div className="flex items-center justify-start flex-row gap-2">
                <p className="flex-medium text-left text-xs leading-5 text-baseTextMedEmphasis">
                  {market.symbol}
                </p>
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="px-1 py-3">
        <p className="text-base font-bold tabular-nums">${market.lastPrice}</p>
      </td>
      <td className="px-1 py-3">
        <p className="text-base font-bold tabular-nums">${market.high}</p>
      </td>
      <td className="px-1 py-3">
        <p className="text-base font-bold tabular-nums">{market.volume}</p>
      </td>
      <td className="px-1 py-3">
        <p
          className={`text-base font-bold tabular-nums ${
            isPositiveChange ? "text-green-500" : "text-red-500"
          }`}
        >
          {Number(market.priceChangePercent)?.toFixed(2)} %
        </p>
      </td>
    </tr>
  );
}
