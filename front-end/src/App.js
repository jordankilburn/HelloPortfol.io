import React, { useState } from "react";
import { RecoilRoot } from "recoil";

import "./styles/App.scss";


import Layout from "./components/Layout";



function App() {
  return (
    <RecoilRoot>
      <Layout />
    </RecoilRoot>
  );
}

export default App;
