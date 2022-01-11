import React, { useState, useEffect } from "react";
import { httpsCallable } from "firebase/functions";
import Graph from "./Graph";

const basePortfolioAssets = [
  { type: "stock", ticker: "AMD", shares: 295 },
  { type: "stock", ticker: "VBK", shares: 287 },
  { type: "stock", ticker: "VCLT", shares: 245.1899 },
  { type: "stock", ticker: "AMZN", shares: 1 },
  { type: "stock", ticker: "VOO", shares: 1072 },
  { type: "stock", ticker: "VNQ", shares: 210 },
  { type: "stock", ticker: "AAPL", shares: 90.23 },
  { type: "stock", ticker: "NVDA", shares: 80 },
  { type: "stock", ticker: "MSFT", shares: 53.21 },
];

export default ({ functions }) => {
  const stocks = httpsCallable(functions, "stocks");
  const [historicalAssets, setHistoricalAssets] = useState(null);

  useEffect(() => {
    let tickers = [];
    basePortfolioAssets.forEach((asset) => tickers.push(asset.ticker));
    stocks({
      tickers,
      startDate: "2-1-2021",
      endDate: new Date(Date.now() + 1 * 86400000).toLocaleDateString(),
    }).then((result) => {
      // Read result of the Cloud Function.
      const data = result.data;
      console.log(data);
      setHistoricalAssets(data);
    });
  }, []);
  return (
    <div style={{ margin: 20 }}>
      <Graph
        historicalAssets={historicalAssets}
        basePortfolioAssets={basePortfolioAssets}
      />
    </div>
  );
};
