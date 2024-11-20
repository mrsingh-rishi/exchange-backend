import { useEffect, useState } from "react";
import { AskTable } from "./AskTable";
import { BidTable } from "./BidTable";

export const Depth = ({ market }: { market: string }) => {
  const [bids, setBids] = useState<[string, string][]>();
  const [asks, setAsks] = useState<[string, string][]>();
  const [price, setPrice] = useState<string>();

  const generateFakeData = () => {
    const fakeBids: [string, string][] = Array.from({ length: 10 }, () => [
      (Math.random() * 100).toFixed(2), // Random price
      (Math.random() * 10).toFixed(2), // Random quantity
    ]);

    const fakeAsks: [string, string][] = Array.from({ length: 10 }, () => [
      (Math.random() * 100 + 100).toFixed(2), // Random price above 100
      (Math.random() * 10).toFixed(2), // Random quantity
    ]);

    const fakePrice = (100 + Math.random() * 50).toFixed(2); // Random price between 100 and 150

    setBids(fakeBids);
    setAsks(fakeAsks);
    setPrice(fakePrice);
  };

  useEffect(() => {
    // remove the fake data with the actual data
    generateFakeData();
    // get the depth and update the depth with the websocket service for real time update
  }, []);

  return (
    <div>
      <TableHeader />
      {asks && <AskTable asks={asks} />}
      {price && <div>{price}</div>}
      {bids && <BidTable bids={bids} />}
    </div>
  );
};

function TableHeader() {
  return (
    <div className="flex justify-between text-xs">
      <div className="text-white">Price</div>
      <div className="text-slate-500">Size</div>
      <div className="text-slate-500">Total</div>
    </div>
  );
}
