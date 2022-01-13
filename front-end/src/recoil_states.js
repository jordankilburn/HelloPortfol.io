import { atom } from "recoil";

export const showWhatState = atom({
  key: "showWhatState", // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
});

export const historicalAssetsState = atom({
  key: "historicalAssetsState", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const dateRangeState = atom({
  key: "dateRangeState", // unique ID (with respect to other atoms/selectors)
  default: [
    new Date(Date.now() - 30 * 86400000), //past 30 days
    "", //Date.now(),
  ],
});

export const basePortfolioAssetsState = atom({
  key: "basePortfolioAssetsState", // unique ID (with respect to other atoms/selectors)
  default: [
    { type: "stock", ticker: "AMD", shares: 100 },
    { type: "stock", ticker: "VBK", shares: 287 },
    { type: "stock", ticker: "VCLT", shares: 245.1899 },
    { type: "stock", ticker: "AMZN", shares: 1 },
    { type: "stock", ticker: "VOO", shares: 107 },
    { type: "stock", ticker: "VNQ", shares: 210 },
    { type: "stock", ticker: "AAPL", shares: 90.23 },
    { type: "stock", ticker: "NVDA", shares: 80 },
    { type: "stock", ticker: "MSFT", shares: 53.21 },
  ], // default value (aka initial value)
});
