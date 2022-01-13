import React, { useState } from "react";
import { RecoilRoot } from "recoil";

import "./styles/App.scss";

import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

import Layout from "./components/Layout";

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyCqlSD6wS8yyE4Ai56yNYd079LUWiCuOIc",
  authDomain: "track-portfolio.firebaseapp.com",
  projectId: "track-portfolio",
});
const functions = getFunctions(app);
//remove below on PROD
connectFunctionsEmulator(functions, "localhost", 5001);

function App() {
  return (
    <RecoilRoot>
      <Layout functions={functions} />
    </RecoilRoot>
  );
}

export default App;
