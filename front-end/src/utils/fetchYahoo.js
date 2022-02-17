import axios from "axios";

export default (data) => {
  return new Promise(async function (resolve, reject) {
    if (
      !data ||
      !data.tickers ||
      !data.startDate ||
      !data.endDate ||
      !data.period
    ) {
      // Throwing an HttpsError so that the client gets the error details.
      return reject("Include all args");
    }

    const date1 = new Date(data.startDate);
    const date2 = new Date(data.endDate);
    let { period } = data; //d,w,m
    const SYMBOLS = data.tickers;
    let reply = {};
    const proxy = "https://cors-anywhere-herokuapp.com/";
    const response = await axios
      .get(proxy + "https://query1.finance.yahoo.com/v8/finance/chart/AAPL", {
        headers: { "X-Requested-With": "XMLHttpRequest", Origin: null },
        params: {
          period1: 0,
          period2: 9999999999,
          interval: "1d",
          includePrePost: true,
          events: "div%7Csplit",
        },
      })
      .catch((e) => reject(e));
    return resolve(reply);
    // return yahooFinance
    //   .historical({
    //     symbols: SYMBOLS,
    //     from: date1,
    //     to: new Date(date2.setDate(date2.getDate() + 1)), // add 1 day to cover
    //     period,
    //   })
    //   .then(function (result) {
    //     Object.keys(result).forEach((ticker) => {
    //       let prices = [];
    //       result[ticker].forEach(
    //         ({ date, close /*volume, high, open, low */ }, i) => {
    //           prices.push({ date: date.toISOString().slice(0, 10), close });
    //         }
    //       );

    //       reply[ticker] = prices.reverse();
    //     });
    //     return resolve({data:reply});
    //   });
  });
};
