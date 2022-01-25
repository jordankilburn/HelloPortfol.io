import compression from "compression";
import yahooFinance from "yahoo-finance";
import express from "express";
import cors from "cors";

const app = express();

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
app.use(cors(corsOptions));

app.post("/historical", async (req, res, next) => {
  try {
    console.log(req.body);
    const replyStocks = await historical(req.body);
    res.json(replyStocks);
  } catch (error) {
    return next(error);
  }
});

app.get("/", (req, res) => {
  res.send("hello there :)");
});

app.listen(process.env.PORT || 5000, () => console.log("Server is running..."));

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
