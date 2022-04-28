import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  basePortfolioAssetsState,
  retirementCalcInputState,
} from "../utils/recoil_states";
import { BasePortfolioAsset } from "../types";
import toLocaleFixed from "../utils/toLocaleFixed";
import styles from "../styles/retirement-calculator.module.scss";
import CustomBG from "../components/CustomChartBackground";
import { ParentSize } from "@visx/responsive";
import {
  AnimatedAreaSeries,
  AnimatedAxis,
  Axis,
  buildChartTheme,
  XYChart,
  Tooltip,
} from "@visx/xychart";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { Line } from "@visx/shape";
import numbFormat from "../utils/numbFormat";

type Outputs = {
  numbYears: number;
  retireNumb: number;
  savingsRate: number;
  years: number[];
  oom: number;
};

const accessors = {
  xAccessor: (d: { year: number }) => d.year,
  yAccessor: (d: { nw: number }) => d.nw,
};

export default function Dashboard() {
  const [basePortfolioAssets] = useRecoilState(basePortfolioAssetsState);

  const [outputs, setOutputs] = useState<Outputs>({
    numbYears: 0,
    retireNumb: 0,
    savingsRate: 0,
    years: [],
    oom: 100,
  });

  const [inputs, setInputs] = useRecoilState(retirementCalcInputState);

  useEffect(() => {
    if (inputs.portfolio != 0) return;

    const portfolio = basePortfolioAssets
      .reduce((a: number, b: BasePortfolioAsset) => a + (b.value || 0), 0)
      .toFixed(0);

    setInputs({ ...inputs, portfolio });
  }, []);

  useEffect(() => {
    const { spendingR, withdrawalRate, portfolio, income, spending, roi } =
      inputs;
    if (income <= 0) return;
    let numbYears = 0;
    const retireNumb = (spendingR * 12) / (withdrawalRate / 100);
    const m = retireNumb; //# to save until
    const i = roi / 100;
    const A = income - spending * 12; //annual contributions
    const P = portfolio; //starting principal
    const savingsRate = A / income;
    // https://math.stackexchange.com/questions/1698578
    //on Wolfram: solve(m=(P+A/i)Power[(1+i),n]-A/i,n)
    numbYears = Math.log((A + i * m) / (A + i * P)) / Math.log(1 + i);

    let years = [];
    let year = 0;
    let nw = Number(portfolio);
    let retired = false;

    let oom = Infinity; //out of money year?

    while (years.length < 301) {
      //only check for 300 years
      years.push(nw);
      if (nw <= 0 && years.length > numbYears) {
        if (oom == Infinity) oom = year - 1;
      }

      if (nw >= retireNumb) {
        retired = true;
        if (isNaN(numbYears)) numbYears = year;
      }

      if (!retired) {
        if (nw >= 0) nw = nw * (1 + i) + A;
        else nw = nw + A;
      } else
        nw = Math.min(
          nw * (1 + i) - spendingR * 12
          // nw * (1 + i - withdrawalRate / 100)
        );

      year++;
    }
    if (isNaN(numbYears)) numbYears = Infinity;
    setOutputs({
      numbYears,
      retireNumb,
      savingsRate,
      years: years.slice(0, 51),
      oom,
    });
  }, [inputs]);

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return (
    <div className="center" style={{ marginBottom: "3rem" }}>
      <h2>Early Retirement Calculator</h2>
      <div className={styles.flexForms}>
        <div className={styles.inputForm}>
          <h4>Current Finances</h4>
          <div className={styles.row}>
            <label className="tooltip">
              Yearly Income:<span className="tooltiptext">After tax.</span>
            </label>
            <input
              type="number"
              value={inputs.income}
              name="income"
              onChange={handleInputs}
            />
          </div>
          <div className={styles.row}>
            <label>Monthly Spending:</label>
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
              <span className="tooltiptext">
                You can use negative numbers if you're in debt.
              </span>
            </label>
            <input
              type="number"
              value={inputs.portfolio}
              name="portfolio"
              onChange={handleInputs}
            />
          </div>
        </div>
        <div className={styles.inputForm}>
          <h4>Retirement Finances</h4>
          <div className={styles.row}>
            <label className="tooltip">
              Expected Return:
              <span className="tooltiptext">
                How much ROI are you expecting/yr?
                <br /> The S&P500 returns ~7%.
              </span>
            </label>
            <span className={styles.postInput}>%</span>
            <input
              className={styles.withPost}
              type="number"
              value={inputs.roi}
              name="roi"
              onChange={handleInputs}
            />
          </div>
          <div className={styles.row}>
            <label className="tooltip">
              Retired Monthly Spending:
              <span className="tooltiptext">
                How much do you want to spend when retired?
              </span>
            </label>
            <input
              type="number"
              value={inputs.spendingR}
              name="spendingR"
              onChange={handleInputs}
            />
          </div>
          <div className={styles.row}>
            <label className="tooltip">
              Withdrawal Rate:
              <span className="tooltiptext">
                How much you remove from your assets each year. Standard is 4%.
              </span>
            </label>
            <span className={styles.postInput}>%</span>
            <input
              className={styles.withPost}
              type="number"
              value={inputs.withdrawalRate}
              name="withdrawalRate"
              onChange={handleInputs}
            />
          </div>
        </div>
      </div>
      <div className={`row ${styles.outputs}`}>
        <div className="item">
          You need <b className="green">{toLocaleFixed(outputs.retireNumb)}</b>{" "}
          to retire.
          <br />
          {outputs.numbYears <= 0 ? (
            `You have that today!`
          ) : (
            <span>
              You'll have that in{" "}
              <b className="green">{toLocaleFixed(outputs.numbYears, 1)}</b>{" "}
              years.
            </span>
          )}
          <br />
          {outputs.oom == Infinity ? (
            <span>
              And then, you'll <i>never run out of money!</i>
            </span>
          ) : (
            <span>
              However, you'll run out of money in{" "}
              <b className="red">{toLocaleFixed(outputs.oom, 0)}</b> years.
            </span>
          )}
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

                  <AnimatedAxis
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
                  </AnimatedAxis>
                  <Axis
                    labelOffset={2}
                    orientation="left"
                    tickFormat={(val) => `${numbFormat(val)}`}
                  />
                  <AnimatedAreaSeries
                    fill="url('#gradient')"
                    dataKey={"Net Worth"}
                    // curve={curveCardinal}
                    data={outputs.years.map((nw, i) => ({ nw, year: i }))}
                    xAccessor={(d) => d.year}
                    yAccessor={(d) => d.nw}
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
                          <span>Year {date}</span>:{" "}
                          <span
                            className={
                              accessors.yAccessor(
                                tooltipData?.nearestDatum?.datum as {
                                  nw: number;
                                }
                              ) <= 0
                                ? "red"
                                : "green"
                            }
                          >
                            {toLocaleFixed(
                              accessors.yAccessor(
                                tooltipData?.nearestDatum?.datum as {
                                  nw: number;
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
        <div className="item">
          <div className={`table-wrapper ${styles.retireTable}`}>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>I/O</th>
                  <th>Return ({inputs.roi}%)</th>
                  <th>Net Worth</th>
                </tr>
              </thead>
              <tbody>
                {outputs.years.map((year, i) => {
                  // if (i < outputs.numbYears + 1 || i == 0)
                  return (
                    <tr
                      key={i}
                      className={
                        year >= outputs.retireNumb
                          ? "green"
                          : year <= 0
                          ? "red"
                          : ""
                      }
                    >
                      <td>{i}</td>
                      <td>
                        {i < outputs.numbYears
                          ? toLocaleFixed(
                              outputs.savingsRate * inputs.income,
                              0
                            )
                          : toLocaleFixed(-inputs.spendingR * 12, 0)}
                      </td>
                      <td>
                        {i == 0
                          ? 0
                          : toLocaleFixed(
                              (inputs.roi / 100) * outputs.years[i - 1],
                              0
                            )}
                      </td>
                      <td>{toLocaleFixed(year, 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
