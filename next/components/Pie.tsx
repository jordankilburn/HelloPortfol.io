import React from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";
import { GradientPinkBlue } from "@visx/gradient";
import { useState } from "react";
import toLocaleFixed from "../utils/toLocaleFixed";
import { AssetInfo, BasePortfolioAsset } from "../types";

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

type Props = {
  parent: any;
  assets: BasePortfolioAsset[];
  netWorth: AssetInfo[];
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};
export default function PieGraph({
  parent,
  assets,
  netWorth = [],
  margin = defaultMargin,
}: Props) {
  const [active, setActive] = useState<BasePortfolioAsset | null>(null);
  const { width, height } = parent;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const top = centerY + margin.top;
  const left = centerX + margin.left;
  if (assets.length < 1) return null;
  const todayNetWorth = netWorth[netWorth.length - 1]
    ? netWorth[netWorth.length - 1].close
    : 0;

  return (
    <svg width={width} height={300}>
      <GradientPinkBlue id="visx-pie-gradient" />
      <Group top={top} left={left}>
        <Pie
          height={300}
          data={assets.filter((x) => x.show === true)}
          pieValue={(d) => d.value}
          outerRadius={radius}
          innerRadius={({ data }) => {
            const size = active && active.ticker == data.ticker ? 90 : 80;
            return 150 - size;
          }}
          padAngle={0.01}
        >
          {(pie) => {
            return pie.arcs.map((arc, i) => {
              const { ticker, value, nickname, color } = arc.data;
              const [centroidX, centroidY] = pie.path.centroid(arc);
              const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.4;
              const arcPath = pie.path(arc);
              const arcFill = color;
              let displayName = nickname || ticker;
              displayName =
                displayName.length > 8
                  ? displayName.slice(0, 8) + "..."
                  : displayName;
              return (
                <g
                  key={i}
                  onMouseEnter={() => setActive(arc.data)}
                  onMouseLeave={() => setActive(null)}
                >
                  <path d={arcPath ? arcPath : undefined} fill={arcFill} />
                  {hasSpaceForLabel && (
                    <text
                      x={centroidX}
                      y={centroidY}
                      dy=".33em"
                      fill="#000"
                      fontSize={"0.75rem"}
                      textAnchor="middle"
                    >
                      {displayName}
                    </text>
                  )}
                  {active && active.ticker == ticker && (
                    <>
                      <text
                        x={0}
                        y={0}
                        dy="-1.3em"
                        // fill="#ffffff"
                        fontSize={"0.75em"}
                        textAnchor="middle"
                      >
                        {nickname || ticker}
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
                        ({`${((value / todayNetWorth) * 100).toFixed(1)}%`})
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
