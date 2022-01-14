import axios from "axios";
const baseAPI = "https://api.coingecko.com/api/v3/coins";

export default ({ cryptos, startDate, endDate }) => {
  return new Promise(async function (resolve, reject) {
    const date1ts =
      parseInt((new Date(startDate).getTime() / 1000).toFixed(0)) * 1000;
    const date2ts =
      parseInt((new Date(endDate).getTime() / 1000).toFixed(0)) * 1000;
    let reply = {};
    for (let i = 0; i < cryptos.length; i++) {
      const coin = cryptos[i];
      const thisCoinRaw = await axios.get(
        `${baseAPI}/${coin}/market_chart?vs_currency=usd&days=max`
      );
      if (thisCoinRaw.data && thisCoinRaw.data.prices) {
        const prices = thisCoinRaw.data.prices;
        let pricesFormatted = [];
        prices.map((p) => {
          if (p[0] < date2ts && p[0] > date1ts)
            pricesFormatted.push({
              date: new Date(p[0]).toISOString().slice(0, 10),
              close: p[1],
            });
        });
        pricesFormatted.pop()
        reply[coin] = pricesFormatted;
      } else reject("Coin data not found for " + coin);
    }
    resolve(reply);

    //   .catch(function (error) {
    //     console.log(error);
    //     reject(error);
    //   });
  });
};
