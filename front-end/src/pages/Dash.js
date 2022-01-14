import React, { useState, useEffect } from "react";
import { httpsCallable } from "firebase/functions";
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";
import Graph from "../components/Graph";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import {
  basePortfolioAssetsState,
  historicalAssetsState,
  dateRangeState,
} from "../recoil_states";
import fetchCrypto from "../utils/fetchCrypto";
import fetchStocks from "../utils/fetchStocks";

export default () => {
  const [basePortfolioAssets, setBasePortfolioAssets] = useRecoilState(
    basePortfolioAssetsState
  );
  const [historicalAssets, setHistoricalAssets] = useRecoilState(
    historicalAssetsState
  );
  const [dateRange, setDateRange] = useRecoilState(dateRangeState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setDates = async (range) => {
    if (range[0] == dateRange[0] && range[1] == dateRange[1]) return;
    setDateRange(range);
    if (range[0] == "" || range[1] == "") return;
    setLoading(true);
    const id = toast.loading("Loading Portfolio...", {});
    let tickers = [];
    let cryptos = [];

    basePortfolioAssets.forEach((asset) => {
      if (asset.type == "Stock") tickers.push(asset.ticker);
      if (asset.type == "Crypto") cryptos.push(asset.ticker);
    });
    try {
      const stocksBack = await fetchStocks({
        tickers,
        startDate: range[0],
        endDate: new Date(range[1] + 1 * 86400000),
      });

      const cryptosBack = await fetchCrypto({
        cryptos,
        startDate: range[0],
        endDate: range[1],
      });
      const combined = { ...stocksBack, ...cryptosBack };
      console.log(combined)
      setHistoricalAssets(combined);
      setLoading(false);
      toast.update(id, {
        render: "Enjoy!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: null,
      });
    } catch (error) {
      toast.update(id, {
        render: "Unable to load :(",
        type: "error",
        isLoading: false,
        autoClose: null,
        closeButton: null,
      });
      setError("Unable to load :(");
    }
  };

  const flatpickr = (
    <div style={{ margin: "0.5rem 0" }}>
      {/* <Flatpickr
        options={{
          mode: "range",
          dateFormat: "Y-m-d",
        }}
        value={dateRange}
        onChange={(date) => {
          setDates(date);
        }}
      /> */}
      <button
        onClick={() => {
          setDates([new Date(Date.now() - 30 * 86400000), Date.now()]);
        }}
      >
        Past 30 Days
      </button>
      <button
        onClick={() => {
          setDates([new Date(Date.now() - 90 * 86400000), Date.now()]);
        }}
      >
        Past 90 Days
      </button>
      <button
        onClick={() => {
          setDates([new Date(Date.now() - 365 * 86400000), Date.now()]);
        }}
      >
        Past 12 Months
      </button>
      <button
        onClick={() => {
          setDates([new Date(Date.now() - 365 * 10 * 86400000), Date.now()]);
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
