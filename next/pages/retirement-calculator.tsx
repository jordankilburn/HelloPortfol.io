import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { basePortfolioAssetsState } from "../utils/recoil_states";
import { BasePortfolioAsset } from "../types";
import toLocaleFixed from "../utils/toLocaleFixed";
import styles from "../styles/retirement-calculator.module.scss";
import CustomBG from "../components/CustomChartBackground";
import { ParentSize } from "@visx/responsive";
import { AnimatedAreaSeries, AnimatedAxis, buildChartTheme, Tooltip, XYChart } from "@visx/xychart";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { Line } from "@visx/shape";
import numbFormat from "../utils/numbFormat";

type Outputs = {
  numbYears: number;
  retireNumb: number;
  savingsRate: number;
  years: number[];
};

export default function Dashboard() {
  const [basePortfolioAssets] = useRecoilState(basePortfolioAssetsState);

  const [outputs, setOutputs] = useState<Outputs>({
    numbYears: 0,
    retireNumb: 0,
    savingsRate: 0,
    years: [],
  });

  const [inputs, setInputs] = useState({
    income: 60000,
    spending: 3000,
    spendingR: 2000,
    portfolio: 100000,
    withdrawalRate: 4,
    roi: 7,
  });

  useEffect(() => {
    const { spendingR, withdrawalRate, portfolio, income, spending, roi } =
      inputs;
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
    let nw = portfolio;
    while (nw < retireNumb) {
      years.push(nw);
      nw = nw * (1 + i) + A;
      year++;
    }
    while (years.length < 51) {
      years.push(nw);
      nw = nw * (1 + i-(withdrawalRate / 100));
      year++;
    }
    setOutputs({ numbYears, retireNumb, savingsRate, years });
  }, [inputs]);

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return (
    <div className="center">
      <h3>
        Total Net Worth | $
        {toLocaleFixed(
          basePortfolioAssets.reduce(
            (a: number, b: BasePortfolioAsset) => a + (b.value || 0),
            0
          )
        )}
      </h3>
      <div className={styles.flexForms}>
        <div className={styles.inputForm}>
          <h4>Current Finances</h4>
          <div className={styles.row}>
            <label>Yearly Income:</label>
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
            <label>Portfolio Value:</label>
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
      retireNumb: {toLocaleFixed(outputs.retireNumb)}
      <br />
      numbYears: {outputs.numbYears.toFixed(1)}
      <br />
      {/* {outputs.years.map((nw, i) => (
        <>
          {i} : {toLocaleFixed(nw)}
          <br />
        </>
      ))} */}
              <ParentSize style={{ paddingLeft: 0, paddingRight: 0 }}>
          {(parent) => {
            return (
              <XYChart
                width={350}
                height={350}
                xScale={{
                  type:"linear"
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
                </AnimatedAxis>
                <AnimatedAxis
                  labelOffset={2}
                  orientation="left"
                  tickFormat={(val) =>
                    `$${numbFormat(val)}`
                  }
                />
                  <AnimatedAreaSeries
                    fill="url('#gradient')"
                    dataKey={"Net Worth"}
                    // curve={curveCardinal}
                    data={outputs.years.map((nw,i)=>({nw,year:i}))}
                    xAccessor={(d) => d.year}
                    yAccessor={(d) => d.nw}
                    fillOpacity={0.4}
                  />
                  
              </XYChart>
            );
          }}
        </ParentSize>
    </div>
  );
}
