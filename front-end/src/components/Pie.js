import React from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";
import { GradientPinkBlue } from "@visx/gradient";
import { useState } from "react";
import toLocaleFixed from "../utils/toLocaleFixed";

const frequency = (d) => d.frequency;

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export default function Example({
  parent,
  showWhat,
  fundColors,
  netWorth,
  margin = defaultMargin,
}) {
  const [active, setActive] = useState(null);
  const { width, height } = parent;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const top = centerY + margin.top;
  const left = centerX + margin.left;
  if (Object.keys(showWhat).length < 1) return null;

  return (
    <svg width={width} height={300}>
      <GradientPinkBlue id="visx-pie-gradient" />
      <Group top={top} left={left}>
        <Pie
          height={300}
          data={Object.keys(showWhat).map((key) => showWhat[key].show && showWhat[key])}
          pieValue={(d) => d.value}
          outerRadius={radius}
          outerRadius={140}
          innerRadius={({ data }) => {
            const size = active && active.ticker == data.ticker ? 90 : 80;
            return 150 - size;
          }}
          padAngle={0.01}
        >
          {(pie) => {
            return pie.arcs.map((arc, i) => {
              const { ticker, value } = arc.data;
              const [centroidX, centroidY] = pie.path.centroid(arc);
              const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.4;
              const arcPath = pie.path(arc);
              const arcFill =
                i > fundColors.length - 1
                  ? fundColors[fundColors.length - 1]
                  : fundColors[i];
              return (
                <g
                  key={ticker}
                  onMouseEnter={() => setActive(arc.data)}
                  onMouseLeave={() => setActive(null)}
                >
                  <path d={arcPath} fill={arcFill} />
                  {hasSpaceForLabel && (
                    <text
                      x={centroidX}
                      y={centroidY}
                      dy=".33em"
                      fill="#ffffff"
                      fontSize={"0.75rem"}
                      textAnchor="middle"
                    >
                      {ticker}
                    </text>
                  )}
                  {active && active.ticker == ticker && (
                    <><text
                      x={0}
                      y={0}
                      dy="-1.3em"
                      // fill="#ffffff"
                      fontSize={"0.75em"}
                      textAnchor="middle"
                    >
                      {ticker}
                    </text>
                    <text
                      x={0}
                      y={0}
                      dy="0"
                      fill={arcFill}
                      fontSize={"1rem"}
                      textAnchor="middle"
                    >
                      ${toLocaleFixed(value)}
                    </text>
                    <text
                      x={0}
                      y={0}
                      dy="1.3em"
                      // fill="#ffffff"
                      fontSize={"0.75rem"}
                      textAnchor="middle"
                    >
                      ({`${(value/netWorth*100).toFixed(1)}%`})
                    </text>
                    </>
                  )}
                </g>
              );
            });
          }}
        </Pie>
      </Group>
    </svg>
  );
}
