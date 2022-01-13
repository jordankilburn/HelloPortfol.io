import React, { useState, useEffect } from "react";
import { httpsCallable } from "firebase/functions";
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";
import Graph from "./Graph";

import { toast } from "react-toastify";

const basePortfolioAssets = [
  { type: "stock", ticker: "AMD", shares: 100 },
  { type: "stock", ticker: "VBK", shares: 287 },
  { type: "stock", ticker: "VCLT", shares: 245.1899 },
  { type: "stock", ticker: "AMZN", shares: 1 },
  { type: "stock", ticker: "VOO", shares: 107 },
  { type: "stock", ticker: "VNQ", shares: 210 },
  { type: "stock", ticker: "AAPL", shares: 90.23 },
  { type: "stock", ticker: "NVDA", shares: 80 },
  { type: "stock", ticker: "MSFT", shares: 53.21 },
];

export default ({ functions }) => {
  const stocks = httpsCallable(functions, "stocks");
  const [historicalAssets, setHistoricalAssets] = useState(null);
  const [dateRange, setDateRange] = useState([
    new Date(Date.now() - 30 * 86400000), //past 30 days
    ""//Date.now(),
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dateRange[0] == "" || dateRange[1] == "") return;
    setLoading(true);
    const id = toast.loading("Loading Portfolio...", {});
    let tickers = [];

    basePortfolioAssets.forEach((asset) => tickers.push(asset.ticker));
    stocks({
      tickers,
      startDate: dateRange[0],
      endDate: new Date(dateRange[1] + 1 * 86400000),
    })
      .then((result) => {
        // Read result of the Cloud Function.
        const data = result.data;
        setHistoricalAssets(data);
        setLoading(false);
        toast.update(id, {
          render: "Enjoy!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: null,
        });
      })
      .catch((e) => {
        toast.update(id, {
          render: "Unable to load :(",
          type: "error",
          isLoading: false,
          autoClose: null,
          closeButton: null,
        });
        setError("Unable to load :(");
      });
  }, [dateRange]);

  const flatpickr = (
    <div style={{ margin: "0.5rem 0" }}>
      {/* <Flatpickr
        options={{
          mode: "range",
          dateFormat: "Y-m-d",
        }}
        value={dateRange}
        onChange={(date) => {
          setDateRange(date);
        }}
      /> */}
      <button
        onClick={() => {
          setDateRange([new Date(Date.now() - 30 * 86400000), Date.now()]);
        }}
      >
        Past 30 Days
      </button>
      <button
        onClick={() => {
          setDateRange([new Date(Date.now() - 90 * 86400000), Date.now()]);
        }}
      >
        Past 90 Days
      </button>
      <button
        onClick={() => {
          setDateRange([new Date(Date.now() - 365 * 86400000), Date.now()]);
        }}
      >
        Past 12 Months
      </button>
      <button
        onClick={() => {
          setDateRange([
            new Date(Date.now() - 365 * 10 * 86400000),
            Date.now(),
          ]);
        }}
      >
        Past 10 Years
      </button>
    </div>
  );
  return (
    
      <Graph
        historicalAssets={historicalAssets}
        basePortfolioAssets={basePortfolioAssets}
        flatpickr={flatpickr}
      />
  );
};
