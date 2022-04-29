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
} from "../utils/recoil_states";
import fetchAssets from "../utils/fetchAssets";
import { BasePortfolioAsset } from "../types";

type Props = {
  assets: BasePortfolioAsset[];
  setAssets: Function;
};

export default function Dashboard({ assets, setAssets }: Props) {
  const [historicalAssets, setHistoricalAssets] = useRecoilState(
    historicalAssetsState
  );
  const [dateRange, setDateRange] = useRecoilState(dateRangeState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (assets.length > 0 && Object.keys(historicalAssets).length <= 0) {
      setDates([new Date(Date.now() - 365 * 86400000), new Date()]);
    }
  }, []);

  const setDates = async (range: Date[]) => {
    if (range[0] == dateRange[0] && range[1] == dateRange[1]) return;
    setDateRange(range);
    if (range.length !== 2) return;
    setLoading(true);
    const id = toast.loading(
      "Loading Portfolio. This might take a while BTW...",
      {}
    );

    try {
      const combined = await fetchAssets({
        basePortfolioAssets: assets,
        startDate: range[0],
        endDate: range[1],
      });
      setHistoricalAssets(combined);
      setLoading(false);
      toast.clearWaitingQueue();
      toast.dismiss();
      toast.update(id, {
        render: "Enjoy!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: null,
      });
    } catch (error) {
      toast.update(id, {
        render: JSON.stringify(error),
        type: "error",
        isLoading: false,
        autoClose: null,
        closeButton: null,
      });
      setError({ error });
    }
  };

  const flatpickr = (
    <div style={{ margin: "0.5rem 0", textAlign: "center" }}>
      <Flatpickr
        disabled={loading}
        options={{
          mode: "range",
          dateFormat: "Y-m-d",
          maxDate: new Date(),
        }}
        value={dateRange}
        onChange={(date: Date[]) => {
          setDates(date);
        }}
      />
      <br />
      {/* <button
        disabled={loading}
        onClick={() => {
          setDates([new Date(Date.now() - 30 * 86400000), new Date()]);
        }}
      >
        Past 30 Days
      </button> */}
      {/* <button
        disabled={loading}
        onClick={() => {
          setDates([new Date(Date.now() - 90 * 86400000), new Date()]);
        }}
      >
        Past 90 Days
      </button> */}
      <button
        disabled={loading}
        onClick={() => {
          setDates([new Date(Date.now() - 365 * 86400000), new Date()]);
        }}
      >
        Past 12 Months
      </button>
      <button
        disabled={loading}
        onClick={() => {
          setDates([new Date(Date.now() - 365 * 5 * 86400000), new Date()]);
        }}
      >
        Past 5 Years
      </button>
    </div>
  );
  if (assets.length <= 0) return null;

  return (
    <Graph
      historicalAssets={historicalAssets}
      flatpickr={flatpickr}
      loading={loading}
      assets={assets}
      setAssets={setAssets}
    />
  );
}
