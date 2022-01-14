import { atom } from "recoil";

export const showWhatState = atom({
  key: "showWhatState", // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
});

export const historicalAssetsState = atom({
  key: "historicalAssetsState", // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
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
    { account: "Robinhood", type: "Stock", ticker: "AMD", shares: 100 },
    // { account: "Robinhood", type: "Stock", ticker: "VBK", shares: 287 },
    // { account: "Robinhood", type: "Stock", ticker: "VCLT", shares: 50 },
    { account: "WeBull", type: "Stock", ticker: "VCLT", shares: 25 },
    { account: "WeBull", type: "Stock", ticker: "VOO", shares: 107 },
    // { account: "WeBull", type: "Stock", ticker: "VNQ", shares: 210 },
    // { account: "WeBull", type: "Stock", ticker: "AAPL", shares: 90.23 },
    // { account: "WeBull", type: "Stock", ticker: "NVDA", shares: 80 },
    // { account: "WeBull", type: "Stock", ticker: "MSFT", shares: 53.21 },
    {
      account: "Coinbase",
      type: "Crypto",
      ticker: "bitcoin",
      shares: 1,
    },
  ],
});
