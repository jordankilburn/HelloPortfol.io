import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { defaultPortfolio } from "./examplePortfolios";

const { persistAtom } = recoilPersist();

export const historicalAssetsState = atom({
  key: "historicalAssetsState", // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
  effects_UNSTABLE: [persistAtom],
});

export const normalizedAssetsState = atom({
  key: "normalizedAssetsState", // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
});

export const dateRangeState = atom({
  key: "dateRangeState", // unique ID (with respect to other atoms/selectors)
  default: [
    new Date(Date.now() - 30 * 86400000), //past 30 days
    Date.now(),
  ],
  effects_UNSTABLE: [persistAtom],
});

export const combineAllState = atom({
  key: "combineAllState", // unique ID (with respect to other atoms/selectors)
  default: true,
});

export const netWorthState = atom({
  key: "netWorthState", // unique ID (with respect to other atoms/selectors)
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const sortedByState = atom({
  key: "sortedByState", // unique ID (with respect to other atoms/selectors)
  default: "Value",
});

export const basePortfolioAssetsState = atom({
  key: "basePortfolioAssetsState", // unique ID (with respect to other atoms/selectors)
  default: defaultPortfolio,
  effects_UNSTABLE: [persistAtom],
});

export const retirementCalcInputState = atom({
  key: "retirementCalcInputState", // unique ID (with respect to other atoms/selectors)
  default: {
    income: 60000,
    spending: 3000,
    spendingR: 2000,
    portfolio: 0,
    withdrawalRate: 4,
    roi: 7,
  },
  effects_UNSTABLE: [persistAtom],
});

export const bbdCalcInputState = atom({
  key: "bbdCalcInputState", // unique ID (with respect to other atoms/selectors)
  default: {
    roi: 10,
    borrowRate: 2,
    spending: 60000,
    portfolio: 750000,
  },
  effects_UNSTABLE: [persistAtom],
});
