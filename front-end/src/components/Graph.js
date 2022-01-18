import React, { useState, useEffect } from "react";
import {
  AnimatedAxis, // any of these can be non-animated equivalents
  AnimatedAreaSeries,
  XYChart,
  Tooltip,
  buildChartTheme,
  AreaStack,
} from "@visx/xychart";
import { ParentSize } from "@visx/responsive";
import { LinearGradient } from "@visx/gradient";
import { curveCardinal, curveLinear } from "@visx/curve";
import CustomBG from "./CustomChartBackground";
import numbFormat from "../utils/numbFormat";
import Pie from "./Pie";
import toLocaleFixed from "../utils/toLocaleFixed";
import { useRecoilState } from "recoil";
import { showWhatState, dateRangeState } from "../recoil_states";

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
  const [showWhat, setShowWhat] = useRecoilState(showWhatState);
  const [combineAll, setCombineAll] = useState(true);
  const [netWorth, setNetWorth] = useState(null);

  useEffect(() => {
    //set what to show
    let totNetWorth = 0;
    let obj = {};
    const sortedAssets = [...basePortfolioAssets].sort((a, b) =>
      a.ticker.localeCompare(b.ticker)
    );
    sortedAssets.map((p) => {
      if (obj[p.ticker]) obj[p.ticker].shares += p.shares;
      else {
        obj[p.ticker] = Object.assign({}, p);
        obj[p.ticker].show = showWhat[p.ticker]
          ? showWhat[p.ticker].show
          : true;
      }
      if (historicalAssets != null) {
        const tickerData = findData(p.ticker);
        if (tickerData == null) return;
        if (!obj[p.ticker].value) obj[p.ticker].value = 0;
        obj[p.ticker].value +=
          tickerData[tickerData.length - 1].close * p.shares;
        totNetWorth += tickerData[tickerData.length - 1].close * p.shares;
      }
    });

    setShowWhat(obj);
    setNetWorth(totNetWorth);
  }, [historicalAssets]);

  const findData = (ticker) => {
    if (historicalAssets == null) return null;
    return historicalAssets[ticker];
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
                {netWorth && (
                  <>
                    <h3>Total Net Worth | ${toLocaleFixed(netWorth)}</h3>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <label className="check-container">
                              Stacked
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
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label className="check-container">
                              Compared
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
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
                      const data = findData(fund);
                      const val = showWhat[fund].value;
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
                          <td>{toLocaleFixed(showWhat[fund].shares, 3)}</td>
                          {data && <td> ${toLocaleFixed(val)}</td>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="item">
          <ParentSize style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                    tickFormat={(val) =>
                      new Date(val).toISOString().slice(0, 10)
                    }
                  />
                  <AnimatedAxis
                    labelOffset={2}
                    orientation="left"
                    tickFormat={(val) => `$${numbFormat(val)}`}
                  />

                  {combineAll && (
                    <AreaStack
                      curve={curveLinear}
                      offset={"auto"}
                      renderLine={true}
                      order={"reverse"}
                    >
                      {Object.keys(showWhat).map((fund, i) => {
                        if (showWhat[fund] && showWhat[fund].show)
                          return (
                            <AnimatedAreaSeries
                              key={fund}
                              fill="url('#gradient')"
                              dataKey={fund}
                              data={findData(fund) || []}
                              xAccessor={(d) => new Date(d.date)}
                              yAccessor={(d) => d.close * showWhat[fund].shares}
                              fillOpacity={0.4}
                              lineProps={{
                                stroke:
                                  i > fundColors.length - 1
                                    ? fundColors[fundColors.length - 1]
                                    : fundColors[i],
                              }}
                            />
                          );
                      })}
                    </AreaStack>
                  )}

                  {!combineAll &&
                    Object.keys(showWhat).map((fund, i) => {
                      if (showWhat[fund] && showWhat[fund].show)
                        return (
                          <AnimatedAreaSeries
                            key={fund}
                            fill="url('#gradient')"
                            dataKey={fund}
                            data={findData(fund) || []}
                            xAccessor={(d) => new Date(d.date)}
                            yAccessor={(d) => d.close * showWhat[fund].shares}
                            fillOpacity={0.4}
                            lineProps={{
                              stroke:
                                i > fundColors.length - 1
                                  ? fundColors[fundColors.length - 1]
                                  : fundColors[i],
                            }}
                          />
                        );
                    })}

                  <Tooltip
                  showDatumGlyph
                    // snapTooltipToDatumX
                    // snapTooltipToDatumY
                    showVerticalCrosshair
                    showHorizontalCrosshair
                    // showSeriesGlyphs
                    renderTooltip={({ tooltipData, colorScale }) => {
                      const date = new Date(
                        accessors.xAccessor(tooltipData.nearestDatum.datum)
                      )
                        .toISOString()
                        .slice(0, 10);
                      return (
                        <div style={{ fontFamily: "Roboto" }}>
                          <span>{date}</span>
                          {Object.keys(showWhat).map(
                            (fund, i) => {
                              if (tooltipData?.nearestDatum?.key !== fund || !showWhat[fund].show)
                                return;
                              const p = basePortfolioAssets.findIndex(
                                (e) => e.ticker === fund
                              );

                              const value =
                                accessors.yAccessor(
                                  tooltipData.datumByKey[fund].datum
                                ) *
                                (showWhat[fund] ? showWhat[fund].shares : 1);
                              return (
                                <div key={fund}>
                                  <span
                                    style={{
                                      color:
                                        i > fundColors.length - 1
                                          ? fundColors[fundColors.length - 1]
                                          : fundColors[i],
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
                            }
                          )}
                        </div>
                      );
                    }}
                  />
                </XYChart>
              );
            }}
          </ParentSize>
          <ParentSize style={{ paddingLeft: 0, paddingRight: 0 }}>
            {(parent) => (
              <Pie
                parent={parent}
                showWhat={showWhat}
                fundColors={fundColors}
                netWorth={netWorth}
              />
            )}
          </ParentSize>
        </div>
      </div>
    </div>
  );
};
