import axios from "axios";

const baseAPI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://portfolio-tracker-express.herokuapp.com";
const baseCrypyoAPI = "https://api.coingecko.com/api/v3/coins";

export default async ({ basePortfolioAssets, startDate, endDate }) => {
  return new Promise(async function (resolve, reject) {
    let tickers = [];
    let cryptos = [];
    let nfts = [];
    let untracked = [];

    basePortfolioAssets.forEach((asset) => {
      if (asset.type == "Stock") tickers.push(asset.ticker);
      else if (asset.type == "Crypto") cryptos.push(asset.ticker);
      else if (asset.type == "NFT") nfts.push(asset.ticker);
      else untracked.push(asset);
    });

    const date1 = new Date(startDate);
    const date2 = new Date(endDate);

    const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    //determine spacing on days
    let period = "d";
    if (diffDays > 300) period = "w";
    if (diffDays > 365 * 3) period = "m";

    const fetchStocks = () => {
      return new Promise(async function (resolve, reject) {
        if (tickers.length < 1) return resolve({});
        const res = await axios
          .post(baseAPI + "/stocks/", {
            tickers,
            startDate,
            endDate,
            period: "d",
          })
          .catch((e) => {
            return reject(e);
          });
        if (res) {
          resolve(fillAllDays({ stocks: res.data, startDate, endDate }));
        }
      });
    };

    const fetchCrypto = () => {
      return new Promise(async function (resolve, reject) {
        const date1ts = startDate.getTime();
        const date2ts = endDate.getTime();

        let reply = {};
        for (let i = 0; i < cryptos.length; i++) {
          const coin = cryptos[i];
          const thisCoinRaw = await axios.get(
            `${baseCrypyoAPI}/${coin}/market_chart?vs_currency=usd&days=max`
          );
          if (thisCoinRaw.data && thisCoinRaw.data.prices) {
            const prices = thisCoinRaw.data.prices;
            let pricesFormatted = [];
            for (let j = 0; j < prices.length; j++) {
              const p = prices[j];

              if (p[0] <= date2ts && p[0] >= date1ts) {
                pricesFormatted.push({
                  date: new Date(p[0]).toISOString().slice(0, 10),
                  close: p[1],
                });
              }
            }
            reply[coin] = pricesFormatted.reverse();
          } else reject("Coin data not found for " + coin);
        }

        resolve(fillAllDays({ stocks: reply, startDate, endDate }));
      });
    };

    const fetchNFTs = () => {
      return new Promise(async function (resolve, reject) {
        const res = await axios
          .post(`${baseAPI}/nfts`, {
            nfts,
            startDate,
            endDate,
          })
          .catch((e) => {
            return reject(e);
          });

        resolve(fillAllDays({ stocks: res.data, startDate, endDate }));
      });
    };

    const fetchUntracked = () => {
      return new Promise(async function (resolve, reject) {
        let reply = {};
        for (let i = 0; i < untracked.length; i++) {
          const asset = untracked[i];
          reply[asset.ticker] = [
            {
              date: new Date(startDate).toISOString().slice(0, 10),
              close: asset.value,
            },
          ];
        }
        return resolve(fillAllDays({ stocks: reply, startDate, endDate }));
      });
    };

    try {
      const combined = {
        ...(await fetchStocks()),
        ...(await fetchCrypto()),
        ...(await fetchNFTs()),
        ...(await fetchUntracked()),
      };
      let reply = {};
      if (period !== "d") {
        Object.keys(combined).map((ticker, i) => {
          let days = combined[ticker];
          if (period === "w")
            reply[ticker] = days.filter(
              (d) => new Date(d.date).getUTCDay() == 1
            ); //mondays
          if (period === "m")
            reply[ticker] = days.filter(
              (d) => new Date(d.date).getUTCDate() == 1
            ); //first of month
          reply[ticker][reply[ticker].length - 1] =
            combined[ticker][combined[ticker].length - 1];
        });
      } else reply = combined;

      return resolve(reply);
    } catch (error) {
      return reject(error);
    }
  });
};

export const fillAllDays = ({ stocks, startDate, endDate }) => {
  const getDaysArray = () => {
    if (!startDate || !endDate) return [];
    const sd = new Date(startDate);
    const ed = new Date(endDate);
    let dates = [];
    //to avoid modifying the original date
    const theDate = sd;
    while (theDate < ed) {
      dates = [...dates, new Date(theDate).toISOString().slice(0, 10)];
      theDate.setDate(theDate.getDate() + 1);
    }

    dates = [...dates, new Date(ed).toISOString().slice(0, 10)];
    return dates;
  };
  const listOfDays = getDaysArray(startDate, endDate);
  let newStocks = {};
  Object.keys(stocks).forEach((ticker) => {
    const a = stocks[ticker].reverse();
    let res = [];

    for (let i = 0, j = 0; i < listOfDays.length; i++) {
      let close;
      if (a[j]) {
        let thisDate = new Date(a[j].date).toISOString().slice(0, 10);
        close = listOfDays[i] === thisDate ? a[j++].close : null;

        if (close == null) {
          close = a[j]
            ? a[j].close
            : a[j - 1]
            ? a[j - 1].close
            : a[j + 1]
            ? a[j + 1].close
            : null;
        }
      } else {
        close = res[i - 1] ? res[i - 1].close : null;
      }
      res[i] = {
        date: listOfDays[i],
        close,
      };
    }

    newStocks[ticker] = res;
  });
  return newStocks;
};
