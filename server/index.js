import compression from "compression";
import yahooFinance from "yahoo-finance";
import express from "express";
import cors from "cors";

const app = express();
const port = 5000;

const whitelist = ["http://localhost:3000"]; //white list consumers
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
app.use(cors());

app.post("/historical", async (req, res, next) => {
  try {
    console.log(req.body);
    const replyStocks = await historical(req.body);
    res.json(replyStocks);
  } catch (error) {
    return next(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const historical = (data) => {
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

    const date1 = new Date(data.startDate);
    const date2 = new Date(data.endDate);
    let { period } = data; //d,w,m
    const SYMBOLS = data.tickers;
    let reply = {};
    return yahooFinance
      .historical({
        symbols: SYMBOLS,
        from: date1,
        to: new Date(date2.setDate(date2.getDate() + 1)), // add 1 day to cover
        period,
      })
      .then(function (result) {
        Object.keys(result).forEach((ticker) => {
          let prices = [];
          result[ticker].forEach(
            ({ date, close /*volume, high, open, low */ }, i) => {
              prices.push({ date: date.toISOString().slice(0, 10), close });
            }
          );

          reply[ticker] = prices.reverse();
        });

        return resolve(reply);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};
