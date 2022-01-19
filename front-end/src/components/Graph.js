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
import {
  showWhatState,
  normalizedAssetsState,
  netWorthState,
  combineAllState,
} from "../recoil_states";

const accessors = {
  xAccessor: (d) => new Date(d.date),
  yAccessor: (d) => d.close,
};

const fundColors = [
  "#4F86C6",
  // "#65524D",
  // "#7F6A93",
  // "#23A455",
  // "#5b64c6",
  // "#F87575",
  // "#4fc67f",
  // "#378b59",
  "#1CE6FF",
  "#FF34FF",
  "#FF4A46",
  "#008941",
  "#006FA6",
  "#A30059",
  "#FFDBE5",
  "#7A4900",
  "#0000A6",
  "#63FFAC",
  "#B79762",
  "#004D43",
  "#8FB0FF",
  "#997D87",
  "#5A0007",
  "#809693",
  "#FEFFE6",
  "#1B4400",
  "#4FC601",
  "#3B5DFF",
  "#4A3B53",
  "#FF2F80",
  "#61615A",
  "#BA0900",
  "#6B7900",
  "#00C2A0",
  "#FFAA92",
  "#FF90C9",
  "#B903AA",
  "#D16100",
  "#DDEFFF",
  "#000035",
  "#7B4F4B",
  "#A1C299",
  "#300018",
  "#0AA6D8",
  "#013349",
  "#00846F",
  "#372101",
  "#FFB500",
  "#C2FFED",
  "#A079BF",
  "#CC0744",
  "#C0B9B2",
  "#C2FF99",
  "#001E09",
  "#00489C",
  "#6F0062",
  "#0CBD66",
  "#EEC3FF",
  "#456D75",
  "#B77B68",
  "#7A87A1",
  "#788D66",
  "#885578",
  "#FAD09F",
  "#FF8A9A",
  "#D157A0",
  "#BEC459",
  "#456648",
  "#0086ED",
  "#886F4C",
  "#34362D",
  "#B4A8BD",
  "#00A6AA",
  "#452C2C",
  "#636375",
  "#A3C8C9",
  "#FF913F",
  "#938A81",
  "#575329",
  "#00FECF",
  "#B05B6F",
  "#8CD0FF",
  "#3B9700",
  "#04F757",
  "#C8A1A1",
  "#1E6E00",
  "#7900D7",
  "#A77500",
  "#6367A9",
  "#A05837",
  "#6B002C",
  "#772600",
  "#D790FF",
  "#9B9700",
  "#549E79",
  "#FFF69F",
  "#201625",
  "#72418F",
  "#BC23FF",
  "#99ADC0",
  "#3A2465",
  "#922329",
  "#5B4534",
  "#FDE8DC",
  "#404E55",
  "#0089A3",
  "#CB7E98",
  "#A4E804",
  "#324E72",
  "#6A3A4C",
];

export default ({ historicalAssets, basePortfolioAssets, flatpickr }) => {
  const [showWhat, setShowWhat] = useRecoilState(showWhatState);
  const [normalizedAssets, setNormalizedAssets] = useRecoilState(
    normalizedAssetsState
  );
  const [combineAll, setCombineAll] = useRecoilState(combineAllState);
  const [netWorth, setNetWorth] = useRecoilState(netWorthState);
  const [sortedBy, setSortedBy] = useState("Value");
  useEffect(() => {
    if (historicalAssets != null) {
      let newNetworth = [];
      let newNormalizedAssets = {};
      for (let i = 0; i < showWhat.length; i++) {
        const p = showWhat[i];
        if (!p.show) continue;
        const tickerData = historicalAssets[p.ticker];
        if (tickerData == null || tickerData.length < 1) continue;
        let normalizationFactor = 1;
        let normalizedTicker = [];
        for (let j = 0; j < tickerData.length; j++) {
          const { date, close } = tickerData[j];
          if (j === 0) normalizationFactor = close;
          if (newNetworth[j]) {
            newNetworth[j].close += close * p.shares;
          } else {
            newNetworth[j] = { date, close: close * p.shares };
          }
          normalizedTicker.push({
            date,
            close: ((close - normalizationFactor) / normalizationFactor) * 100,
          });
        }

        newNormalizedAssets[p.ticker] = normalizedTicker;
      }
      setNormalizedAssets(newNormalizedAssets);
      setNetWorth(newNetworth);
    }
  }, [showWhat]);

  useEffect(() => {
    //set what to show
    let newShowWhat = [];

    for (let i = 0; i < basePortfolioAssets.length; i++) {
      const p = basePortfolioAssets[i];

      if (newShowWhat[i]) newShowWhat[i].shares += p.shares;
      else {
        newShowWhat[i] = Object.assign({}, p);
        newShowWhat[i].show = showWhat[i] ? showWhat[i].show : true;
      }

      if (historicalAssets != null) {
        const tickerData = historicalAssets[p.ticker];
        if (tickerData == null || tickerData.length < 1) continue;
        if (!newShowWhat[i].value) newShowWhat[i].value = 0;
        newShowWhat[i].value +=
          tickerData[tickerData.length - 1].close * p.shares;
        newShowWhat[i].last = tickerData[tickerData.length - 1].close;
        newShowWhat[i].roi =
          ((tickerData[tickerData.length - 1].close - tickerData[0].close) /
            tickerData[0].close) *
          100;
      }
    }

    setShowWhat(newShowWhat.sort((a, b) => b.value - a.value));
  }, [historicalAssets]);

  const sortBy = (sortType) => {
    const newSort = JSON.parse(JSON.stringify(showWhat));
    switch (sortType) {
      case "Value":
        sortedBy === "asc"
          ? newSort.sort((a, b) => b.value - a.value)
          : newSort.sort((a, b) => a.value - b.value);
        break;
      case "Ticker":
        sortedBy === "asc"
          ? newSort.sort((a, b) => a.ticker.localeCompare(b.ticker))
          : newSort.sort((a, b) => b.ticker.localeCompare(a.ticker));
        break;
      case "Shares":
        sortedBy === "asc"
          ? newSort.sort((a, b) => b.shares - a.shares)
          : newSort.sort((a, b) => a.shares - b.shares);
        break;
      case "ROI":
        sortedBy === "asc"
          ? newSort.sort((a, b) => b.roi - a.roi)
          : newSort.sort((a, b) => a.roi - b.roi);
        break;

      default:
        return
    }
    setSortedBy(sortedBy === "asc" ? "desc" : "asc");
    setShowWhat(newSort);
  };

  const findNormalizedData = (ticker) => {
    console.log(ticker, normalizedAssets[ticker]);

    return normalizedAssets[ticker];
  };

  const findRawData = (ticker) => {
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

                <>
                  <h3>
                    Total Net Worth | $
                    {toLocaleFixed(
                      netWorth[netWorth.length - 1] &&
                        netWorth[netWorth.length - 1].close
                    )}
                  </h3>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <label className="check-container">
                            Show Net Worth
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
                            Show Comparison
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

                <h3>Portfolio</h3>

                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>
                        <label className="check-container">
                        Asset
                          <input
                            name={"combine-all"}
                            type="checkbox"
                            checked={
                              showWhat.findIndex((x) => x.show === false) === -1
                            }
                            onChange={(e) => {
                              let newShow = [];
                              showWhat.forEach((fund, i) => {
                                newShow[i] = {
                                  ...fund,
                                  show: e.target.checked,
                                };
                              });
                              setShowWhat(newShow);
                            }}
                          />
                          <span
                            className="checkmark"
                            style={{ backgroundColor: "#000" }}
                          ></span>
                          
                        </label>
                        
                      </th>
                      <th onClick={() => sortBy("Shares")}>Shares</th>
                      <th onClick={() => sortBy("Value")}>Value</th>
                      <th onClick={() => sortBy("ROI")}>ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showWhat.map((fund, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <label className="check-container">
                              {fund.ticker}
                              <input
                                name={fund}
                                type="checkbox"
                                checked={fund.show}
                                onChange={() => {
                                  let newShow = [];
                                  showWhat.forEach((x, j) => {
                                    newShow[j] =
                                      i === j
                                        ? {
                                            ...x,
                                            show: !fund.show,
                                          }
                                        : x;
                                  });
                                  setShowWhat(newShow);
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
                          <td>{toLocaleFixed(fund.shares, 3)}</td>
                          <td> ${toLocaleFixed(fund.value)}</td>
                          <td> {toLocaleFixed(fund.roi)}%</td>
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
                    tickFormat={(val) =>
                      combineAll ? `$${numbFormat(val)}` : `${numbFormat(val)}%`
                    }
                  />

                  {combineAll ? (
                    <AnimatedAreaSeries
                      fill="url('#gradient')"
                      dataKey={"Net Worth"}
                      data={netWorth || []}
                      xAccessor={(d) => new Date(d.date)}
                      yAccessor={(d) => d.close}
                      fillOpacity={0.4}
                      lineProps={{
                        stroke: fundColors[0],
                      }}
                    />
                  ) : (
                    showWhat.map((fund, i) => {
                      if (fund && fund.show)
                        return (
                          <AnimatedAreaSeries
                            key={i}
                            fill="url('#gradient')"
                            dataKey={fund.ticker}
                            data={findNormalizedData(fund.ticker) || []}
                            xAccessor={(d) => new Date(d.date)}
                            yAccessor={(d) => d.close}
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
                          {combineAll && (
                            <div
                              style={{
                                color: fundColors[0],
                                textDecoration: "underline",
                                fontWeight: 700,
                              }}
                            >
                              Net Worth: $
                              {toLocaleFixed(
                                accessors.yAccessor(
                                  tooltipData?.nearestDatum?.datum
                                )
                              )}
                            </div>
                          )}
                          {showWhat.map((fund, i) => {
                            if (
                              tooltipData?.nearestDatum?.key !== fund.ticker ||
                              !fund.show
                            )
                              return;

                            const value = accessors.yAccessor(
                              tooltipData.datumByKey[fund.ticker].datum
                            );
                            return (
                              <div key={i}>
                                <span
                                  style={{
                                    color:
                                      i > fundColors.length - 1
                                        ? fundColors[fundColors.length - 1]
                                        : fundColors[i],
                                    textDecoration:
                                      tooltipData?.nearestDatum?.key ===
                                      fund.ticker
                                        ? "underline"
                                        : undefined,
                                    fontWeight:
                                      tooltipData?.nearestDatum?.key ===
                                      fund.ticker
                                        ? 700
                                        : undefined,
                                  }}
                                >
                                  {fund.ticker}: {toLocaleFixed(value)}% ROI
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
