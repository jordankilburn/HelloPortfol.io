import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

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
  default: [
    // {
    //   ticker: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/3370",
    //   shares: 1,
    //   nickname: "Bored Ape 3370",
    //   type: "NFT",
    //   account: "Merril",
    // },
    // {
    //   ticker: "AMD",
    //   shares: 295,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "17911 Shadow Oak Dr.",
    //   shares: 1,
    //   type: "Real Estate",
    //   account: "Homepoint",
    //   value: 420000,
    // },
    // {
    //   ticker: "ATVI",
    //   shares: 46.8499,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "BA",
    //   shares: 6.2443,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "BABA",
    //   shares: 25,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "BBY",
    //   shares: 37.6829,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "BEPC",
    //   shares: 85.0742,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "BRK-B",
    //   shares: 8,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "DVY",
    //   shares: 11.1799,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "EA",
    //   shares: 14.0528,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "FB",
    //   shares: 21,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "GE",
    //   shares: 1.0008,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "GOOG",
    //   shares: 3,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "INTC",
    //   shares: 44.399,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "KO",
    //   shares: 37.4723,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "LMT",
    //   shares: 3.2516,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "MSFT",
    //   shares: 53.2158,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "NTDOF",
    //   shares: 11,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "NVDA",
    //   shares: 80.1621,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "PG",
    //   shares: 17.4293,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "PYPL",
    //   shares: 58,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "SHOP",
    //   shares: 3,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "TSLA",
    //   shares: 5,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "U",
    //   shares: 10,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "VBK",
    //   shares: 287.1899,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "VCLT",
    //   shares: 245.8994,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "VEU",
    //   shares: 163.4584,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "VNQ",
    //   shares: 210.619,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "VNQI",
    //   shares: 28.7726,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "VOO",
    //   shares: 1072.15,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "VSS",
    //   shares: 76.4734,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "WMT",
    //   shares: 22.1789,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   ticker: "BEP",
    //   shares: 151.5775,
    //   type: "Stock",
    //   account: "Merril",
    // },
    // {
    //   account: "Coinbase",
    //   type: "Crypto",
    //   ticker: "bitcoin",
    //   shares: 1.234,
    // },
  ],
  effects_UNSTABLE: [persistAtom],
});
