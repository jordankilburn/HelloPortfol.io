import React, { useEffect } from "react";
import {
  Axis, 
  AnimatedAreaSeries,
  XYChart,
  Tooltip,
  buildChartTheme,
} from "@visx/xychart";
import { Line } from "@visx/shape";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { LinearGradient } from "@visx/gradient";
import CustomBG from "./CustomChartBackground";
import numbFormat from "../utils/numbFormat";
import Pie from "./Pie";
import toLocaleFixed from "../utils/toLocaleFixed";
import { useRecoilState } from "recoil";
import {
  normalizedAssetsState,
  netWorthState,
  combineAllState,
} from "../utils/recoil_states";
import { HistoricalAsset, AssetInfo, BasePortfolioAsset } from "../types";
import Table from "./Table";

const accessors = {
  xAccessor: (d: AssetInfo) => new Date(d.date),
  yAccessor: (d: AssetInfo) => d.close,
};

const fundColors = [
  "#4F86C6",
  "#1CE6FF",
  "#FF34FF",
  "#FF4A46",
  "#008941",
  "#006FA6",
  "#A30059",
  // "#FFDBE5",
  "#7A4900",
  "#0000A6",
  "#63FFAC",
  "#B79762",
  "#004D43",
  "#8FB0FF",
  "#997D87",
  "#5A0007",
  "#809693",
  // "#FEFFE6",
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
  "#000035",
  "#7B4F4B",
  "#A1C299",
  "#300018",
  "#0AA6D8",
  "#013349",
  "#00846F",
  "#372101",
  "#FFB500",
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

type Props = {
  flatpickr: JSX.Element;
  loading: boolean;
  historicalAssets: HistoricalAsset;
  assets: BasePortfolioAsset[];
  setAssets: Function;
};

export default function Graph({
  historicalAssets,
  flatpickr,
  loading,
  assets,
  setAssets,
}: Props) {
  const [normalizedAssets, setNormalizedAssets] =
    useRecoilState<HistoricalAsset>(normalizedAssetsState);
  const [combineAll, setCombineAll] = useRecoilState(combineAllState);
  const [netWorth, setNetWorth] = useRecoilState<AssetInfo[]>(netWorthState);

  useEffect(() => {
    if (historicalAssets != null) {
      let newNetworth: AssetInfo[] = [];
      let newNormalizedAssets: HistoricalAsset = {};
      for (let i = 0; i < assets.length; i++) {
        const p = assets[i];
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
  }, [assets]);

  useEffect(() => {
    //set what to show
    let newBFA = [];

    for (let i = 0; i < assets.length; i++) {
      const p = assets[i];

      if (newBFA[i]) newBFA[i].shares += p.shares;
      else {
        newBFA[i] = Object.assign({}, p);
        newBFA[i].show = assets[i] ? assets[i].show : true;
        newBFA[i].color =
          i > fundColors.length - 1
            ? fundColors[fundColors.length - 1]
            : fundColors[i];
      }

      if (historicalAssets != null) {
        const tickerData = historicalAssets[p.ticker];
        if (tickerData == null || tickerData.length < 1) continue;
        // if (!newBFA[i].value) newBFA[i].value = 0;
        newBFA[i].value = tickerData[tickerData.length - 1].close * p.shares;
        // newBFA[i].last = tickerData[tickerData.length - 1].close;
        newBFA[i].roi =
          ((tickerData[tickerData.length - 1].close - tickerData[0].close) /
            tickerData[0].close) *
          100;
      }
    }

    setAssets(newBFA);
  }, [historicalAssets]);

  const findNormalizedData = (ticker: string) => {
    return normalizedAssets[ticker];
  };

  const findRawData = (ticker: string) => {
    return historicalAssets[ticker];
  };

  return (
    <div className="row">
      <div className="item inputs">
        <h3>Choose Date Range</h3>
        {flatpickr}

        <>
          <h3>
            Total Net Worth | $
            {toLocaleFixed(
              assets.reduce(
                (a: number, b: BasePortfolioAsset) => a + (b.value || 0),
                0
              )
            )}
          </h3>
        </>

        <h3>Portfolio</h3>
        <Table assets={assets} setAssets={setAssets} />
      </div>
      <div className="item">
        <h3>{combineAll ? "Net Worth" : "Compare Assets"} Graph</h3>
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
        <ParentSize style={{ paddingLeft: 0, paddingRight: 0 }}>
          {(parent) => {
            return (
              <XYChart
                // parentWidth={parent.width}
                // parentHeight={parent.height}
                // parentTop={parent.top}
                // parentLeft={parent.left}
                height={350}
                xScale={{
                  type: "time",
                }}
                yScale={{ type: "linear" }}
                theme={buildChartTheme({
                  backgroundColor: "#F1F5F9",
                  gridColor: "#336d88",
                  svgLabelBig: { fill: "#1d1b38" },
                  tickLength: 8,
                  colors: [],
                  gridColorDark: "",
                })}
              >
                <CustomBG />
                {combineAll && (
                  <LinearGradient from="#4F86C6" to="#4FB0C6" id="gradient" />
                )}
                <Axis
                  orientation="bottom"
                  numTicks={7}
                  tickFormat={(val) => new Date(val).toISOString().slice(0, 10)}
                >
                  {(props) => {
                    const tickLabelSize = 11;
                    const tickRotate = 20;
                    const tickColor = "#336d88";
                    const fontColor = "#495057";
                    const axisCenter =
                      (props.axisToPoint.x - props.axisFromPoint.x) / 2;
                    return (
                      <g className="my-custom-bottom-axis">
                        {props.ticks.map((tick, i) => {
                          const tickX = tick.to.x;
                          const tickY =
                            tick.to.y + tickLabelSize + (props.tickLength || 0);
                          return (
                            <Group
                              key={`vx-tick-${tick.value}-${i}`}
                              className={"vx-axis-tick"}
                            >
                              <Line
                                from={tick.from}
                                to={tick.to}
                                stroke={tickColor}
                              />
                              <text
                                transform={`translate(${tickX}, ${tickY}) rotate(${tickRotate})`}
                                fontSize={tickLabelSize}
                                textAnchor="middle"
                                fill={fontColor}
                              >
                                {tick.formattedValue}
                              </text>
                            </Group>
                          );
                        })}
                        <text
                          textAnchor="middle"
                          transform={`translate(${axisCenter}, 50)`}
                          fontSize="8"
                        >
                          {props.label}
                        </text>
                      </g>
                    );
                  }}
                </Axis>
                <Axis
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
                    // curve={curveCardinal}
                    data={netWorth || []}
                    xAccessor={(d: AssetInfo) => new Date(d?.date)}
                    yAccessor={(d: AssetInfo) => d.close}
                    fillOpacity={0.4}
                    lineProps={{
                      stroke: fundColors[0],
                    }}
                  />
                ) : (
                  assets.map((fund: BasePortfolioAsset, i: number) => {
                    if (fund && fund.show)
                      return (
                        <AnimatedAreaSeries
                          key={i}
                          // curve={curveCardinal}
                          fill="url('#gradient')"
                          dataKey={fund.ticker}
                          data={findNormalizedData(fund.ticker) || []}
                          xAccessor={(d) => d && new Date(d.date)}
                          yAccessor={(d) => d.close}
                          fillOpacity={0.4}
                          lineProps={{
                            stroke: fund.color,
                          }}
                        />
                      );
                  })
                )}

                <Tooltip
                  // showDatumGlyph
                  // snapTooltipToDatumX
                  // snapTooltipToDatumY
                  showVerticalCrosshair
                  showHorizontalCrosshair
                  // showSeriesGlyphs
                  renderTooltip={({ tooltipData, colorScale }) => {
                    const date = new Date(
                      accessors.xAccessor(
                        tooltipData?.nearestDatum?.datum as AssetInfo
                      )
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
                                tooltipData?.nearestDatum?.datum as AssetInfo
                              )
                            )}
                          </div>
                        )}
                        {assets.map((fund: BasePortfolioAsset, i: number) => {
                          if (
                            tooltipData?.nearestDatum?.key !== fund.ticker ||
                            !fund.show
                          )
                            return;

                          const value = accessors.yAccessor(
                            tooltipData?.datumByKey[fund.ticker]
                              .datum as AssetInfo
                          );
                          return (
                            <div key={i}>
                              <span
                                style={{
                                  color: fund.color,
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
                                {fund.nickname || fund.ticker}:{" "}
                                {toLocaleFixed(value)}% ROI
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
            <Pie parent={parent} assets={assets} netWorth={netWorth} />
          )}
        </ParentSize>
      </div>
    </div>
  );
}
