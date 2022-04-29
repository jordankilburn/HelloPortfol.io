import currency from "currency.js";
import React from "react";
import { useRecoilState } from "recoil";

import { BasePortfolioAsset } from "../types";
import { sortedByState } from "../utils/recoil_states";
import toLocaleFixed from "../utils/toLocaleFixed";

type Props = {
  assets: BasePortfolioAsset[];
  setAssets: Function;
};

export default function Table({ assets, setAssets }: Props) {
  const [sortedBy, setSortedBy] = useRecoilState(sortedByState);

  const sortBy = (sortType: string) => {
    const newSort = JSON.parse(JSON.stringify(assets));
    switch (sortType) {
      case "Value":
        sortedBy === "asc"
          ? newSort.sort(
              (a: BasePortfolioAsset, b: BasePortfolioAsset) =>
                b.value - a.value
            )
          : newSort.sort(
              (a: BasePortfolioAsset, b: BasePortfolioAsset) =>
                a.value - b.value
            );
        break;
      case "Ticker":
        sortedBy === "asc"
          ? newSort.sort((a: BasePortfolioAsset, b: BasePortfolioAsset) =>
              a.ticker.localeCompare(b.ticker)
            )
          : newSort.sort((a: BasePortfolioAsset, b: BasePortfolioAsset) =>
              b.ticker.localeCompare(a.ticker)
            );
        break;
      case "Shares":
        sortedBy === "asc"
          ? newSort.sort(
              (a: BasePortfolioAsset, b: BasePortfolioAsset) =>
                b.shares - a.shares
            )
          : newSort.sort(
              (a: BasePortfolioAsset, b: BasePortfolioAsset) =>
                a.shares - b.shares
            );
        break;
      // case "ROI":
      //   sortedBy === "asc"
      //     ? newSort.sort((a:BasePortfolioAsset, b:BasePortfolioAsset) => b.roi - a.roi)
      //     : newSort.sort((a:BasePortfolioAsset, b:BasePortfolioAsset) => a.roi - b.roi);
      //   break;

      default:
        return;
    }
    setSortedBy(sortedBy === "asc" ? "desc" : "asc");
    setAssets(newSort);
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>
              <label className="check-container">
                Asset
                <input
                  name={"combine-all"}
                  type="checkbox"
                  checked={
                    assets.findIndex(
                      (x: BasePortfolioAsset) => x.show === false
                    ) === -1
                  }
                  onChange={(e) => {
                    let newShow: BasePortfolioAsset[] = [];
                    assets.forEach((fund: BasePortfolioAsset, i: number) => {
                      newShow[i] = {
                        ...fund,
                        show: e.target.checked,
                      };
                    });
                    setAssets(newShow);
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
            {/* <th onClick={() => sortBy("ROI")}>ROI</th> */}
          </tr>
        </thead>
        <tbody>
          {assets.map((fund: BasePortfolioAsset, i: number) => {
            return (
              <tr key={i}>
                <td>
                  <label className="check-container">
                    {fund.nickname ? fund.nickname : fund.ticker}
                    <input
                      name={fund.nickname ? fund.nickname : fund.ticker}
                      type="checkbox"
                      checked={fund.show}
                      onChange={() => {
                        let newShow: BasePortfolioAsset[] = [];
                        assets.forEach((x: BasePortfolioAsset, j: number) => {
                          newShow[j] =
                            i === j
                              ? {
                                  ...x,
                                  show: !fund.show,
                                }
                              : x;
                        });
                        setAssets(newShow);
                      }}
                    />
                    <span
                      className="checkmark"
                      style={{
                        backgroundColor: fund.color,
                      }}
                    ></span>
                  </label>
                </td>
                <td>{currency(fund.shares).value}</td>
                <td> ${toLocaleFixed(fund.value)}</td>
                {/* <td> {toLocaleFixed(fund.roi)}%</td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
