import compression from "compression";
import yahooFinance from "yahoo-finance";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

const whitelist = [
  "http://localhost:3000",
  "https://helloportfoldotio.netlify.app/",
  "https://helloportfol.io/",
]; //white list consumers
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "device-remember-token",
    "Access-Control-Allow-Origin",
    "Origin",
    "Accept",
  ],
};

app.use(compression());
app.use(express.json());
app.use(cors(corsOptions));

app.post("/stocks", async (req, res, next) => {
  try {
    console.log(req.body);
    const replyStocks = await getStocks(req.body);
    res.json(replyStocks);
  } catch (error) {
    return next(error);
  }
});

app.post("/nfts", async (req, res, next) => {
  try {
    console.log(req.body);
    const replyNFTs = await getNFTs(req.body);
    res.json(replyNFTs);
  } catch (error) {
    return next(error);
  }
});

app.get("/", (req, res) => {
  res.send("hello there :)");
});

app.listen(process.env.PORT || 5000, () => console.log("Server is running..."));

const getStocks = (data) => {
  return new Promise(async function (resolve, reject) {
    if (
      !data ||
      !data.tickers ||
      !data.startDate ||
      !data.endDate ||
      !data.period
    ) {
      return reject("Include all args");
    }

    if (data.tickers.length < 1) return resolve({});

    const date2 = new Date(data.endDate);
    return yahooFinance
      .historical({
        symbols: data.tickers,
        from: new Date(data.startDate),
        to: new Date(date2.setDate(date2.getDate() + 1)), // add 1 day to cover
        period: data.period, //d,w,m
      })
      .then(function (result) {
        return resolve(result);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

const getNFTs = (data) => {
  return new Promise(async function (resolve, reject) {
    if (!data || !data.nfts || !data.startDate || !data.endDate) {
      return reject("Include all args");
    }
    try {
      const date1ts = new Date(data.startDate).getTime();
      const date2ts = new Date(data.endDate).getTime();
      const baseNFT =
        "https://nft-balance-api.dappradar.com/transactions/ethereum";
      let reply = {};
      for (let i = 0; i < data.nfts.length; i++) {
        const nft = data.nfts[i];
        const res = await axios.get(`${baseNFT}/${nft}`, {
          params: {
            page: 1,
            resultsPerPage: 100,
            fiat: "USD",
          },
          headers: {
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
          },
        });
        if (res.data && res.data.data) {
          let pricesFormatted = [];
          let allSales = [];
          for (let j = 0; j < res.data.data.length; j++) {
            const saleInfo = res.data.data[j];
            if (saleInfo.type === "sale") {
              const saleDate = new Date(saleInfo.date);
              allSales.push({
                date: new Date(saleDate).toISOString().slice(0, 10),
                close: saleInfo.priceUsd,
              });
              if (
                saleDate.getTime() <= date2ts &&
                saleDate.getTime() >= date1ts
              ) {
                pricesFormatted.push({
                  date: new Date(saleDate).toISOString().slice(0, 10),
                  close: saleInfo.priceUsd,
                });
              }
            }
          }
          if (allSales.length > 0)
            pricesFormatted.unshift({
              date: new Date(data.endDate).toISOString().slice(0, 10),
              close: allSales[0].close,
            });
          reply[nft] = pricesFormatted;
        } else reply[nft] = [];
      }
      return resolve(reply);
    } catch (error) {
      return reject(error);
    }
  });
};
