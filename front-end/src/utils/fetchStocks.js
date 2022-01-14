import axios from "axios";

import { initializeApp } from "firebase/app";
import {
  getFunctions,
  connectFunctionsEmulator,
  httpsCallable,
} from "firebase/functions";

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyCqlSD6wS8yyE4Ai56yNYd079LUWiCuOIc",
  authDomain: "track-portfolio.firebaseapp.com",
  projectId: "track-portfolio",
});
const functions = getFunctions(app);
//remove below on PROD
connectFunctionsEmulator(functions, "localhost", 5001);

const stocks = httpsCallable(functions, "stocks");

export default ({ tickers, startDate, endDate }) => {
  return new Promise(async function (resolve, reject) {
    const stocksBack = await stocks({
      tickers,
      startDate,
      endDate,
    }).catch((e) => reject(e));
    resolve(stocksBack.data);

    //   .catch(function (error) {
    //     console.log(error);
    //     reject(error);
    //   });
  });
};

export const fillAllDays = (stocks, startDate, endDate) => {
  const listOfDays = getDaysArray(startDate, endDate);
  console.log(listOfDays);
  let newStocks = {};
  Object.keys(stocks).forEach((ticker) => {
    let newDays = [];
    listOfDays.forEach((day, i) => {
      const foundDay = stocks;
    });
    newStocks[ticker] = newDays;
  });

  return stocks;
};

export const getDaysArray = (startDate, endDate) => {
  for (
    var arr = [], dt = new Date(startDate);
    dt <= new Date(endDate);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr.map((v) => {
    return { date: v.toISOString().slice(0, 10) };
  });
};
