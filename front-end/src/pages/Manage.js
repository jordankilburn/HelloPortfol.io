import * as React from "react";
import { useRecoilState } from "recoil";

import {
  showWhatState,
  basePortfolioAssetsState,
  historicalAssetsState,
} from "../recoil_states";
import toLocaleFixed from "../utils/toLocaleFixed";

export default () => {
  const [basePortfolioAssets, setBasePortfolioAssets] = useRecoilState(
    basePortfolioAssetsState
  );
  const [showWhat, setShowWhat] = useRecoilState(showWhatState);

  return (
    <>
      <div className="row">
        <div className="item">
          {" "}
          <h2>Manage Page</h2>
          <p>Add/Remove assets from portfolio</p>
          <div>
            <table style={{ width: "100%" }}>
              <thead style={{textAlign:"left"}}>
                <tr>
                  <th>Account</th>
                  <th>Name</th>
                  <th>Asset Type</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Track?</th>
                </tr>
              </thead>
              <tbody>
                {basePortfolioAssets.map((asset, i) => {
                  const item = showWhat.find(x=>x.ticker === asset.ticker)
                  return (
                    <tr key={i}>
                      <td>{asset.account}</td>
                      <td>{asset.ticker}</td>
                      <td>{asset.type}</td>
                      <td>{toLocaleFixed(asset.shares, 3)}</td>
                      <td>${item?toLocaleFixed(item.value):"N/A"}</td>
                      <td> Check box </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
