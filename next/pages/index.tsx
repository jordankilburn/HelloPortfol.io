import React from "react";
import { useRecoilState } from "recoil";

import Dash from "../components/Dash";
import { basePortfolioAssetsState } from "../utils/recoil_states";

export default function Home() {

  const [assets,setAssets] = useRecoilState(basePortfolioAssetsState);

  return <Dash assets={assets} setAssets={setAssets} />;
}
