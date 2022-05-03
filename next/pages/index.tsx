import React from "react";
import { useRecoilState } from "recoil";

import Dash from "../components/Dash";
import Meta from "../components/Meta";
import { basePortfolioAssetsState } from "../utils/recoil_states";

export default function Home() {

  const [assets,setAssets] = useRecoilState(basePortfolioAssetsState);

  return <><Meta /><Dash assets={assets} setAssets={setAssets} /></>;
}
