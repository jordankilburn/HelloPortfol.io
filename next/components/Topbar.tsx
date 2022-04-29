import React from "react";
import { FaBars } from "react-icons/fa";
import { basePortfolioAssetsState } from "../utils/recoil_states";
import { useRecoilState } from "recoil";
import Share from "./Share";

type Props = {
  handleToggleSidebar: (value: boolean) => void;
};

export default function TopBar({ handleToggleSidebar }: Props) {
  const [basePortfolioAssets] = useRecoilState(
    basePortfolioAssetsState
  );
  return (
    <header>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>
      <div className="topbar">
        <span>
          <Share
            basePortfolioAssets={basePortfolioAssets}
            buttonText={"Share Portfolio"}
          />
        </span>
      </div>
    </header>
  );
}
