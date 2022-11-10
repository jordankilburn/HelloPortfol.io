// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Type } from "ajv/dist/compile/util";
import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "../../utils/slugify";
// @ts-ignore
import yahooFinance from "yahoo-finance";

type Stocks = { tickers: string | any[]; startDate: string | number | Date; endDate: string | number | Date; period: any; }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST")
    return res.status(405).json({ error: "Only can post here..." });

  console.log(req.body);

  const replyStocks = await getStocks(req.body);

  return res.status(200).json(replyStocks);
}

const getStocks = (data: Stocks) => {
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
      .then(function (result: unknown) {
        return resolve(result);
      })
      .catch((e: any) => {
        return reject(e);
      });
  });
};
