import React, { useState, useEffect } from "react";
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedAreaSeries,
  XYChart,
  Tooltip,
  buildChartTheme,
} from "@visx/xychart";
import { ParentSize } from "@visx/responsive";
import { LinearGradient } from "@visx/gradient";
import { curveCardinal } from "@visx/curve";
import CustomBG from "./CustomChartBackground";
import numbFormat from "../utils/numbFormat";
import Pie from "./Pie";
import toLocaleFixed from "../utils/toLocaleFixed";

const accessors = {
  xAccessor: (d) => new Date(d.date),
  yAccessor: (d) => d.close,
};

const fundColors = [
  "#4F86C6",
  "#65524D",
  "#7F6A93",
  "#23A455",
  "#5b64c6",
  "#F87575",
  "#4fc67f",
  "#378b59",
];

export default ({ historicalAssets, basePortfolioAssets, flatpickr }) => {
  const [showWhat, setShowWhat] = useState({});
  const [combineAll, setCombineAll] = useState(true);
  const [netWorth, setNetWorth] = useState([]);

  useEffect(() => {
    //set what to show

    let obj = {};
    let assetsToCombine = [];
    basePortfolioAssets.map((p) => {
      obj[p.ticker] = p;
      obj[p.ticker].show = true;
      if (historicalAssets != null) {
        const tickerData = findData(p);
        //now have historical with shares multiplied
        const newTickerData = tickerData.map((x) => ({
          close: x.close * p.shares,
          date: new Date(x.date).toISOString().slice(0, 10),
        }));
        obj[p.ticker].value = newTickerData[newTickerData.length - 1].close;
        assetsToCombine.push(...newTickerData);
      }
    });
    setShowWhat(obj);
    if (historicalAssets == null) return;
    const output = assetsToCombine.reduce((accumulator, cur) => {
      let date = cur.date;
      let found = accumulator.find((elem) => elem.date === date);
      if (found) found.close += cur.close;
      else accumulator.push(cur);
      return accumulator;
    }, []);

    //set net worth data
    setNetWorth(
      output.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      })
    );
  }, [historicalAssets]);

  const findData = (postition) => {
    if (historicalAssets == null) return null;
    return historicalAssets[postition.ticker];
  };

  return (
    <div className="dash">
      <div className="row">
        <div className="item inputs">
          <div className="container">
            <div className="row">
              <div className="item">
                <h3>Choose Date Range</h3>
                {flatpickr}
                {netWorth.length > 0 && (
                  <>
                    <h3>
                      Total Net Worth | $
                      {toLocaleFixed(netWorth[netWorth.length - 1]?.close)}
                    </h3>
                    <span>
                      <label className="check-container">
                        Show Breakdown
                        <input
                          name={"combine-all"}
                          type="checkbox"
                          checked={!combineAll}
                          onChange={() => {
                            setCombineAll(!combineAll);
                          }}
                        />
                        <span
                          className="checkmark"
                          style={{ backgroundColor: fundColors[0] }}
                        ></span>
                      </label>
                    </span>
                  </>
                )}
                <h3>Portfolio</h3>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Shares</th>
                      {Object.values(showWhat)[0]?.value && (
                        <th>Current Value</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(showWhat).map((fund, i) => {
                      const data = findData({ ticker: fund });
                      const val =
                        data == null
                          ? null
                          : data[data.length - 1]?.close *
                            showWhat[fund].shares;
                      return (
                        <tr key={i}>
                          <td>
                            <label className="check-container">
                              {fund}
                              <input
                                name={fund}
                                type="checkbox"
                                checked={showWhat[fund].show}
                                onChange={() => {
                                  setShowWhat({
                                    ...showWhat,
                                    [fund]: {
                                      ...showWhat[fund],
                                      show: !showWhat[fund].show,
                                    },
                                  });
                                }}
                              />
                              <span
                                className="checkmark"
                                style={{
                                  backgroundColor:
                                    i > fundColors.length - 1
                                      ? fundColors[fundColors.length - 1]
                                      : fundColors[i],
                                }}
                              ></span>
                            </label>
                          </td>
                          <td>{toLocaleFixed(showWhat[fund].shares, 0)}</td>
                          {data && <td> ${toLocaleFixed(val)}</td>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <br />
              </div>
              {/* <div className="item">
                <b>Final Value</b>
                <br />
                {Object.keys(returns).map((fund) => {
                  return (
                    <div key={fund}>
                      {findNameFromTicker(fund)}:{" "}
                      <b>${Number(returns[fund].toFixed()).toLocaleFixed(2)}</b>
                    </div>
                  );
                })}
              </div> 
               <div className="item">
                <br />
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Total Return</th>
                      <th>Annualized Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(returns).map((fund) => {
                      if (!showWhat[fund]) return;
                      const totReturn =
                        ((returns[fund] - initialInvestment) /
                          initialInvestment) *
                        100;
                      const annReturn =
                        (Math.pow(
                          returns[fund] / initialInvestment,
                          1 / (2020 - startYear)
                        ) -
                          1) *
                        100;
                      return (
                        <tr key={fund}>
                          <td
                            style={{
                              paddingRight: 20,
                              color: fundColors[fund],
                            }}
                          >
                            <b>{findNameFromTicker(fund)}</b>
                          </td>
                          <td className="center">
                            {Number(totReturn.toFixed()).toLocaleFixed(2)}%
                          </td>
                          <td className="center">
                            {Number(annReturn.toFixed(2)).toLocaleFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div> 
               <div className="item">
                <b>Annualized Return </b>
                <br />
                {Object.keys(returns).map((fund) => {
                  if (!showWhat[fund]) return
                  const annReturn =
                    (Math.pow(
                      returns[fund] / initialInvestment,
                      1 / (2020 - startYear)
                    ) -
                      1) *
                    100;
                  return (
                    <div key={fund}>
                      {findNameFromTicker(fund)}:{" "}
                      <b>{Number(annReturn.toFixed(2)).toLocaleFixed(2)}%</b>
                    </div>
                  );
                })}
              </div> */}
              <br />
            </div>
          </div>
        </div>

        <ParentSize
          className="item"
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          {(parent) => {
            return (
              <XYChart
                parentWidth={parent.width}
                parentHeight={parent.height}
                parentTop={parent.top}
                parentLeft={parent.left}
                height={400}
                xScale={{
                  type: "time",
                }}
                yScale={{ type: "linear" }}
                theme={buildChartTheme({
                  backgroundColor: "#F1F5F9",
                  gridColor: "#336d88",
                  svgLabelBig: { fill: "#1d1b38" },
                  tickLength: 8,
                })}
              >
                <CustomBG />
                {combineAll && (
                  <LinearGradient from="#4F86C6" to="#4FB0C6" id="gradient" />
                )}
                <AnimatedAxis
                  orientation="bottom"
                  numTicks={5}
                  tickFormat={(val) => new Date(val).toISOString().slice(0, 10)}
                />
                <AnimatedAxis
                  labelOffset={2}
                  orientation="left"
                  tickFormat={(val) => `$${numbFormat(val)}`}
                />

                {combineAll ? (
                  <AnimatedAreaSeries
                    fill="url('#gradient')"
                    curve={curveCardinal}
                    dataKey={"Net Worth"}
                    data={netWorth}
                    {...accessors}
                    fillOpacity={0.4}
                    lineProps={{ stroke: fundColors[0] }}
                  />
                ) : (
                  basePortfolioAssets.map((fund, i) => {
                    if (showWhat[fund.ticker] && showWhat[fund.ticker].show)
                      return (
                        <AnimatedAreaSeries
                          key={fund.ticker}
                          fill="url('#gradient')"
                          curve={curveCardinal}
                          dataKey={fund.ticker}
                          data={findData(fund)}
                          // {...accessors}
                          xAccessor={(d) => new Date(d.date)}
                          yAccessor={(d) => d.close * fund.shares}
                          fillOpacity={0.4}
                          lineProps={{
                            stroke:
                              i > fundColors.length - 1
                                ? fundColors[fundColors.length - 1]
                                : fundColors[i],
                          }}
                        />
                      );
                  })
                )}

                <Tooltip
                  // snapTooltipToDatumX
                  // snapTooltipToDatumY
                  showVerticalCrosshair
                  showHorizontalCrosshair
                  showSeriesGlyphs
                  renderTooltip={({ tooltipData, colorScale }) => {
                    const date = new Date(
                      accessors.xAccessor(tooltipData.nearestDatum.datum)
                    )
                      .toISOString()
                      .slice(0, 10);
                    return (
                      <div style={{ fontFamily: "Roboto" }}>
                        <span>{date}</span>
                        {Object.keys(tooltipData?.datumByKey).map((fund, i) => {
                          const p = basePortfolioAssets.findIndex(
                            (e) => e.ticker === fund
                          );

                          const value =
                            accessors.yAccessor(
                              tooltipData.datumByKey[fund].datum
                            ) *
                            (basePortfolioAssets[p]
                              ? basePortfolioAssets[p].shares
                              : 1);
                          return (
                            <div key={fund}>
                              <span
                                style={{
                                  color:
                                    p > fundColors.length - 1
                                      ? fundColors[fundColors.length - 1]
                                      : fundColors[p],
                                  textDecoration:
                                    tooltipData?.nearestDatum?.key === fund
                                      ? "underline"
                                      : undefined,
                                  fontWeight:
                                    tooltipData?.nearestDatum?.key === fund
                                      ? 700
                                      : undefined,
                                }}
                              >
                                {fund} - ${toLocaleFixed(value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }}
                />
              </XYChart>
            );
          }}
        </ParentSize>
      </div>
      <div className="row">
        <ParentSize
          className="item"
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          {(parent) => (
            <Pie
              parent={parent}
              showWhat={showWhat}
              fundColors={fundColors}
              netWorth={netWorth[netWorth.length - 1]?.close}
            />
          )}
        </ParentSize>
      </div>
    </div>
  );
};
