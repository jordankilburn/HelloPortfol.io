import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  basePortfolioAssetsState,
  bbdCalcInputState,
} from "../utils/recoil_states";
import { BasePortfolioAsset } from "../types";
import toLocaleFixed from "../utils/toLocaleFixed";
import styles from "../styles/retirement-calculator.module.scss";
import CustomBG from "../components/CustomChartBackground";
import { ParentSize } from "@visx/responsive";
import {
  AnimatedAreaSeries,
  AnimatedLineSeries,
  Axis,
  buildChartTheme,
  XYChart,
  Tooltip,
} from "@visx/xychart";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { Line } from "@visx/shape";
import numbFormat from "../utils/numbFormat";
import Meta from "../components/Meta";

type Years = {
  year:number;
  assets: number;
  debts: number;
  ltv: number;
};

type Outputs = {
  years: Years[];
};

const accessors = {
  xAccessor: (d: { year: number }) => d.year,
  debts: (d: { debts: number }) => d.debts,
  assets: (d: { assets: number }) => d.assets,
  ltv: (d: { ltv: number }) => d.ltv,
};

export default function Dashboard() {
  const [basePortfolioAssets] = useRecoilState(basePortfolioAssetsState);

  const [outputs, setOutputs] = useState<Outputs>({
    years: [],
  });

  const [inputs, setInputs] = useRecoilState(bbdCalcInputState);

  useEffect(() => {
    if (inputs.portfolio != 0) return;

    const portfolio = basePortfolioAssets
      .reduce((a: number, b: BasePortfolioAsset) => a + (b.value || 0), 0)
      .toFixed(0);

    setInputs({ ...inputs, portfolio });
  }, []);

  useEffect(() => {
    const { borrowRate, spending, portfolio, roi } = inputs;
    let years = [] as Years[];
    let assets = portfolio;
    let debts = 0;
    for (let i = 0; i < 51; i++) {
      if (i !== 0) {
        assets = assets * (1 + roi / 100);
        debts = (years[i - 1].debts + Number(spending)) * (1 + borrowRate / 100);
      }
      
      years[i] = {
        year: i,
        assets,
        debts,
        ltv: (debts / assets) * 100,
      };
      
    }

    setOutputs({ years });
  }, [inputs]);

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Meta title="HelloPortfol.io | 'Buy, Borrow, Die' Calculator" />
      <div className="center" style={{ marginBottom: "3rem" }}>
        <h2>'Buy, Borrow, Die' Calculator</h2>
        <p>
          <b>Buy</b> growing assets, <b>Borrow</b> against them at low interest
          rate, and live out the rest of your life (until you <b>Die</b>)
          without worrying about money!
        </p>
        <div className={styles.flexForms}>
          <div className={styles.inputForm}>
            <div className={styles.row}>
              <label className="tooltip">
                Return Rate:
                <span className="tooltiptext">
                  The ROI you get on average each year.
                </span>
              </label>
              <span className={styles.postInput}>%</span>
              <input
                type="number"
                value={inputs.roi}
                name="roi"
                onChange={handleInputs}
              />
            </div>
            <div className={styles.row}>
              <label className="tooltip">
                Borrow Rate:
                <span className="tooltiptext">
                  The yearly interest rate on the money you borrow.
                </span>
              </label>
              <span className={styles.postInput}>%</span>
              <input
                type="number"
                value={inputs.borrowRate}
                name="borrowRate"
                onChange={handleInputs}
              />
            </div>
            <div className={styles.row}>
              <label className="tooltip">
                Yearly Spending:
                <span className="tooltiptext">
                  How much you want to spend in retirement.
                </span>
              </label>
              <input
                type="number"
                value={inputs.spending}
                name="spending"
                onChange={handleInputs}
              />
            </div>
            <div className={styles.row}>
              <label className="tooltip">
                Portfolio Value:
                <span className="tooltiptext">Total starting assets.</span>
              </label>
              <input
                type="number"
                value={inputs.portfolio}
                name="portfolio"
                onChange={handleInputs}
              />
            </div>
          </div>
        </div>
        <div className={`row ${styles.outputs}`}>
          <div className="item-33">
            <h4 style={{ margin: 0 }}>Assets & Debts</h4>
            <ParentSize style={{ paddingLeft: 0, paddingRight: 0 }}>
              {(parent) => {
                return (
                  <XYChart
                    width={350}
                    height={350}
                    xScale={{
                      type: "linear",
                    }}
                    yScale={{ type: "linear" }}
                    theme={buildChartTheme({
                      backgroundColor: "#F1F5F9",
                      gridColor: "#336d88",
                      svgLabelBig: { fill: "#1d1b38" },
                      tickLength: 8,
                      colors: ["#23a455", "#ff5964"],
                      gridColorDark: "",
                    })}
                  >
                    <CustomBG />

                    <LinearGradient from="#4F86C6" to="#4FB0C6" id="gradient" />

                    <Axis
                      orientation="bottom"
                      numTicks={7}
                      tickFormat={(val) => `Year ${val}`}
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
                                tick.to.y +
                                tickLabelSize +
                                (props.tickLength || 0);
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
                      tickFormat={(val) => `${numbFormat(val)}`}
                    />
                    <AnimatedLineSeries
                      fill="url('#gradient')"
                      dataKey={"Assets"}
                      // curve={curveCardinal}
                      data={outputs.years.map((year, i) => ({
                        assets: year.assets,
                        year: i,
                      }))}
                      xAccessor={(d) => d.year}
                      yAccessor={(d) => d.assets}
                      fillOpacity={0}
                    />
                    <AnimatedLineSeries
                      fill="url('#gradient')"
                      dataKey={"Debts"}
                      // curve={curveCardinal}
                      data={outputs.years.map((year, i) => ({
                        debts: year.debts,
                        year: i,
                      }))}
                      xAccessor={(d) => d.year}
                      yAccessor={(d) => d.debts}
                      fillOpacity={0}
                    />
                    <Tooltip
                      showDatumGlyph
                      snapTooltipToDatumX
                      snapTooltipToDatumY
                      showVerticalCrosshair
                      // showHorizontalCrosshair
                      showSeriesGlyphs
                      renderTooltip={({ tooltipData, colorScale }) => {
                        const date = accessors.xAccessor(
                          tooltipData?.nearestDatum?.datum as { year: number }
                        );

                        return (
                          <div style={{ fontFamily: "Roboto" }}>
                            <span>Year {date}</span>
                            <br />
                            <span className="green">
                              Assets:{" "}
                              {toLocaleFixed(
                                accessors.assets(
                                  tooltipData?.datumByKey["Assets"]?.datum as {
                                    assets: number;
                                  }
                                )
                              )}
                            </span>
                            <br />
                            <span className="red">
                              Debts:{" "}
                              {toLocaleFixed(
                                accessors.debts(
                                  tooltipData?.datumByKey["Debts"]?.datum as {
                                    debts: number;
                                  }
                                )
                              )}
                            </span>
                          </div>
                        );
                      }}
                    />
                  </XYChart>
                );
              }}
            </ParentSize>
          </div>
          <div className="item-33">
            <h4 style={{ margin: 0 }}>Loan to Value</h4>
            <ParentSize style={{ paddingLeft: 0, paddingRight: 0 }}>
              {(parent) => {
                return (
                  <XYChart
                    width={350}
                    height={350}
                    xScale={{
                      type: "linear",
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

                    <LinearGradient from="#4F86C6" to="#4FB0C6" id="gradient" />

                    <Axis
                      orientation="bottom"
                      numTicks={7}
                      tickFormat={(val) => `Year ${val}`}
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
                                tick.to.y +
                                tickLabelSize +
                                (props.tickLength || 0);
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
                      tickFormat={(val) => `${numbFormat(val)}%`}
                    />
                    <AnimatedAreaSeries
                      fill="url('#gradient')"
                      dataKey={"LTV"}
                      // curve={curveCardinal}
                      data={outputs.years.map((year, i) => ({
                        ltv: year.ltv,
                        year: i,
                      }))}
                      xAccessor={(d) => d?d.year:0}
                      yAccessor={(d) => d.ltv}
                      fillOpacity={0.4}
                    />
                    <Tooltip
                      showDatumGlyph
                      snapTooltipToDatumX
                      snapTooltipToDatumY
                      showVerticalCrosshair
                      // showHorizontalCrosshair
                      showSeriesGlyphs
                      renderTooltip={({ tooltipData, colorScale }) => {
                        const date = accessors.xAccessor(
                          tooltipData?.nearestDatum?.datum as { year: number }
                        );

                        return (
                          <div style={{ fontFamily: "Roboto" }}>
                            <span>Year {date}</span>
                            <br />
                            <span>
                              LTV:{" "}
                              {toLocaleFixed(
                                accessors.ltv(
                                  tooltipData?.nearestDatum?.datum as {
                                    ltv: number;
                                  }
                                )
                              )}
                              %
                            </span>
                          </div>
                        );
                      }}
                    />
                  </XYChart>
                );
              }}
            </ParentSize>
          </div>
          <div className="item-33">
            <div className={`table-wrapper ${styles.retireTable}`}>
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Assets</th>
                    <th>Debts</th>
                    <th>Net Worth</th>
                  </tr>
                </thead>
                <tbody>
                  {outputs.years.map((year, i) => {
                    // if (i < outputs.numbYears + 1 || i == 0)
                    return (
                      <tr key={i}>
                        <td>{i}</td>
                        <td>{toLocaleFixed(year.assets, 0)}</td>
                        <td>{toLocaleFixed(year.debts, 0)}</td>
                        <td>{toLocaleFixed(year.assets - year.debts, 0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
