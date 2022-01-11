import React, { useState, useEffect } from "react";
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  Grid,
  AnimatedAreaSeries,
  XYChart,
  Tooltip,
  buildChartTheme,
} from "@visx/xychart";
import { ParentSize } from "@visx/responsive";
import { LinearGradient } from "@visx/gradient";
import { curveCardinal } from "@visx/curve";
import CustomBG from "./CustomChartBackground";

import AAPL from "../data/AAPL";
import GOOG from "../data/GOOG";
import TSLA from "../data/TSLA";
import AMZN from "../data/AMZN"

const basePortfolioAssets = [
  { type: "stock", ticker: "AAPL", shares: 10 },
  { type: "stock", ticker: "GOOG", shares: 1 },
  { type: "stock", ticker: "TSLA", shares: 3 },
  { type: "stock", ticker: "AMZN", shares: 1 },
];

const accessors = {
  xAccessor: (d) => d.date,
  yAccessor: (d) => d.close,
};

export default () => {
  const [portfolioAssets, setPortfolioAssets] = useState(basePortfolioAssets);
  const [showWhat, setShowWhat] = useState({});
  const [combineAll, setCombineAll] = useState(false);
  const [netWorth, setNetWorth] = useState([]);

  useEffect(() => {
    //set what to show
    let obj = {};
    let assetsToCombine = [];
    basePortfolioAssets.map((p) => {
      obj[p.ticker] = p;
      obj[p.ticker].show = true;
      const tickerData = findData(p);

      //now have historical with shares multiplied
      const newTickerData = tickerData.map((x) => ({
        close: x.close * p.shares,
        date: new Date(x.date).toLocaleDateString(),
      }));
      assetsToCombine.push(...newTickerData);
    });
    const output = assetsToCombine.reduce((accumulator, cur) => {
      let date = cur.date;
      let found = accumulator.find(elem => elem.date === date)
      if (found) found.close += cur.close;
      else accumulator.push(cur);
      return accumulator;
    }, []);
    setShowWhat(obj);
    //set net worth data
    setNetWorth(output);
  }, []);

  const findNameFromTicker = (name) => {
    const names = {
      AAPL: "Apple, Inc.",
      GOOG: "Alphabet",
    };
    return names[name];
  };

  const findData = (postition) => {
    const names = {
      AAPL,
      GOOG,
      AMZN,
      TSLA
    };
    return names[postition.ticker];
  };

  return (
    <div className="container">
      <div className="row">
        <div className="item inputs">
          <div className="container">
            <div className="row">
              {/* <div className="item">
                <b>Initial Investment</b>
                <br />
                <span className="input-dollar left">
                  <input
                    className="field"
                    type="number"
                    name="initialInvestment"
                    id="initialInvestment"
                    onChange={(e) => setInitial(e.target.value)}
                    value={initialInvestment}
                  />
                </span>
                <br />
                <b>Year of Investment</b>
                <br />
                <input
                  className="field"
                  type="number"
                  name="startYear"
                  id="startYear"
                  onChange={(e) => setStartYearInput(e.target.value)}
                  value={startYearInput}
                  onBlur={(e) => setStartYear(e.target.value)}
                />
              </div> */}
              <div className="item">
                <b>Compare</b>
                <br />
                {Object.keys(showWhat).map((fund, i) => {
                  const data = findData({ticker:fund})
                  console.log(data)
                  const val = data[data.length - 1].close * showWhat[fund].shares
                  return (
                    <span key={fund}>
                      <label className="check-container">
                        {fund}: {showWhat[fund].shares} shares | ${val.toFixed(2)}
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
                          style={{ backgroundColor: "red" }}
                        ></span>
                      </label>
                    </span>
                  );
                })}
                <br />
                <b>Combine</b>
                <br />
                <span>
                  <label className="check-container">
                    Total Net Worth | ${netWorth[netWorth.length - 1]?.close?.toFixed(2)}
                    <input
                      name={"combine-all"}
                      type="checkbox"
                      checked={combineAll}
                      onChange={() => {
                        setCombineAll(!combineAll);
                      }}
                    />
                    <span
                      className="checkmark"
                      style={{ backgroundColor: "red" }}
                    ></span>
                  </label>
                </span>
              </div>
              {/* <div className="item">
                <b>Final Value</b>
                <br />
                {Object.keys(returns).map((fund) => {
                  return (
                    <div key={fund}>
                      {findNameFromTicker(fund)}:{" "}
                      <b>${Number(returns[fund].toFixed()).toLocaleString()}</b>
                    </div>
                  );
                })}
              </div> */}
              {/* <div className="item">
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
                            {Number(totReturn.toFixed()).toLocaleString()}%
                          </td>
                          <td className="center">
                            {Number(annReturn.toFixed(2)).toLocaleString()}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div> */}
              {/* <div className="item">
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
                      <b>{Number(annReturn.toFixed(2)).toLocaleString()}%</b>
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
                xScale={{ type: "band" }}
                yScale={{ type: "linear" }}
                theme={buildChartTheme({
                  // backgroundColor: "#f09ae9",
                  colors: ["red"],
                  gridColor: "#336d88",
                  svgLabelBig: { fill: "#1d1b38" },
                  tickLength: 8,
                })}
              >
                <CustomBG />
                <LinearGradient from="#4F86C6" to="#4FB0C6" id="gradient" />
                <AnimatedAxis
                  orientation="bottom"
                  numTicks={5}
                  tickFormat={(val) => new Date(val).toLocaleDateString()}
                />
                <AnimatedAxis
                  orientation="left"
                  tickFormat={(val) => `$${val.toFixed(0)}`}
                />

                {combineAll ? (
                  <AnimatedAreaSeries
                    fill="url('#gradient')"
                    curve={curveCardinal}
                    dataKey={"Net Worth"}
                    data={netWorth}
                    // {...accessors}
                    xAccessor={(d) => d.date}
                    yAccessor={(d) => d.close}
                    fillOpacity={0.4}
                    // lineProps={{ stroke: fundColors[fund] }}
                  />
                ) : (
                  portfolioAssets.map((fund) => {
                    if (showWhat[fund.ticker] && showWhat[fund.ticker].show)
                      return (
                        <AnimatedAreaSeries
                          key={fund.ticker}
                          fill="url('#gradient')"
                          curve={curveCardinal}
                          dataKey={fund.ticker}
                          data={findData(fund)}
                          // {...accessors}
                          xAccessor={(d) => d.date}
                          yAccessor={(d) => d.close * fund.shares}
                          fillOpacity={0.4}
                          // lineProps={{ stroke: fundColors[fund] }}
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
                    ).toLocaleDateString();
                    return (
                      <div style={{ fontFamily: "Roboto" }}>
                        <span>{date}</span>
                        {Object.keys(tooltipData?.datumByKey).map((fund) => {
                          const thisPosition = basePortfolioAssets.find(
                            (e) => e.ticker === fund
                          );
                          const value =
                            accessors.yAccessor(
                              tooltipData.datumByKey[fund].datum
                            ) * (thisPosition? thisPosition.shares:1);

                          return (
                            <div key={fund}>
                              <span
                                style={{
                                  // color: fundColors[fund],
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
                                {fund} - $
                                {Number(value.toFixed()).toLocaleString()}
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
    </div>
  );
};
