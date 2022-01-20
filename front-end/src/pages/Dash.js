import React, { useState, useEffect } from "react";
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
import fetchAssets from "../utils/fetchAssets";

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
    if (range[0] == "" || range[1] == "" || range.length !== 2) return;
    setLoading(true);
    const id = toast.loading("Loading Portfolio...", {});

    try {
      const combined = await fetchAssets({
        basePortfolioAssets,
        startDate: range[0],
        endDate: range[1],
      });
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
    <div style={{ margin: "0.5rem 0", textAlign:"center" }}>
      <Flatpickr
        style={{ margin: 5 }}
        options={{
          mode: "range",
          dateFormat: "Y-m-d",
          maxDate:new Date()
        }}
        value={dateRange}
        
        onChange={(date) => {
          setDates(date);
        }}
      />
      <br />
      <button
        onClick={() => {
          setDates([new Date(Date.now() - 30 * 86400000), new Date()]);
        }}
      >
        Past 30 Days
      </button>
      <button
        onClick={() => {
          setDates([new Date(Date.now() - 90 * 86400000), new Date()]);
        }}
      >
        Past 90 Days
      </button>
      <button
        onClick={() => {
          setDates([new Date(Date.now() - 365 * 86400000), new Date()]);
        }}
      >
        Past 12 Months
      </button>
      <button
        onClick={() => {
          setDates([new Date(Date.now() - 365 * 5 * 86400000), new Date()]);
        }}
      >
        Past 5 Years
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
