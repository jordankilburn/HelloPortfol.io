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

export default ({ historicalAssets, basePortfolioAssets }) => {
  const [showWhat, setShowWhat] = useState({});
  const [combineAll, setCombineAll] = useState(true);
  const [netWorth, setNetWorth] = useState([]);

  useEffect(() => {
    //set what to show
    if (historicalAssets == null) return;
    let obj = {};
    let assetsToCombine = [];
    basePortfolioAssets.map((p) => {
      obj[p.ticker] = p;
      obj[p.ticker].show = true;
      const tickerData = findData(p);
      //now have historical with shares multiplied
      const newTickerData = tickerData.map((x) => ({
        close: x.close * p.shares,
        date: new Date(x.date).toISOString().slice(0, 10),
      }));
      assetsToCombine.push(...newTickerData);
    });
    const output = assetsToCombine.reduce((accumulator, cur) => {
      let date = cur.date;
      let found = accumulator.find((elem) => elem.date === date);
      if (found) found.close += cur.close;
      else accumulator.push(cur);
      return accumulator;
    }, []);
    setShowWhat(obj);
    //set net worth data
    setNetWorth(
      output.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      })
    );
  }, [historicalAssets]);

  const findData = (postition) => {
    return historicalAssets[postition.ticker];
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
                  const data = findData({ ticker: fund });
                  const val =
                    data[data.length - 1]?.close * showWhat[fund].shares;
                  return (
                    <span key={fund}>
                      <label className="check-container">
                        {fund}: {showWhat[fund].shares} shares | $
                        {val.toFixed(2)}
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
                    </span>
                  );
                })}
                <br />
                <b>Combine</b>
                <br />
                <span>
                  <label className="check-container">
                    Total Net Worth | $
                    {netWorth[netWorth.length - 1]?.close?.toFixed(2)}
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
                      style={{ backgroundColor: fundColors[0] }}
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
                xScale={{
                  type: "time",
                }}
                yScale={{ type: "linear" }}
                theme={buildChartTheme({
                  // backgroundColor: "#f09ae9",
                  // colors: ["red"],
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
                  orientation="left"
                  tickFormat={(val) => `$${val.toFixed(0)}`}
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
                            ) * (basePortfolioAssets[p] ? basePortfolioAssets[p].shares : 1);
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
                                {fund} - $
                                {Number(value.toFixed(2)).toLocaleString()}
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
