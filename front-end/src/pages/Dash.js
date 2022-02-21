import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  let navigate = useNavigate();

  useEffect(() => {
    if (
      basePortfolioAssets.length > 0 &&
      Object.keys(historicalAssets).length <= 0
    ) {
      setDates([new Date(Date.now() - 365 * 5 * 86400000), new Date()]);
    }
  }, []);

  const setDates = async (range) => {
    if (range[0] == dateRange[0] && range[1] == dateRange[1]) return;
    setDateRange(range);
    if (range[0] == "" || range[1] == "" || range.length !== 2) return;
    setLoading(true);
    const id = toast.loading(
      "Loading Portfolio. This might take a while BTW...",
      {}
    );

    try {
      const combined = await fetchAssets({
        basePortfolioAssets,
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
        render: error,
        type: "error",
        isLoading: false,
        autoClose: null,
        closeButton: null,
      });
      setError(error);
    }
  };

  const flatpickr = (
    <div style={{ margin: "0.5rem 0", textAlign: "center" }}>
      <Flatpickr
        disabled={loading}
        style={{ margin: "5px 0" }}
        options={{
          mode: "range",
          dateFormat: "Y-m-d",
          maxDate: new Date(),
        }}
        value={dateRange}
        onChange={(date) => {
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
  if (basePortfolioAssets.length <= 0) navigate("/manage");
  // return
  // <div className="row">
  //   <div className="item inputs">
  //     <h3>
  //       Add Assets in <Link to="/manage">Manage</Link>
  //     </h3>
  //   </div>
  // </div>

  return (
    <Graph
      historicalAssets={historicalAssets}
      basePortfolioAssets={basePortfolioAssets}
      flatpickr={flatpickr}
      loading={loading}
    />
  );
};
