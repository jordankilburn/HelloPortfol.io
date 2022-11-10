// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Type } from "ajv/dist/compile/util";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type NFTs = {
  nfts: string | any[];
  startDate: string | number | Date;
  endDate: string | number | Date;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST")
    return res.status(405).json({ error: "Only can post here..." });

  console.log(req.body);

  const replyNFTs = await getNFTs(req.body);

  return res.status(200).json(replyNFTs);
}

const getNFTs = (data: NFTs) => {
  return new Promise(async function (resolve, reject) {
    if (!data || !data.nfts || !data.startDate || !data.endDate) {
      return reject("Include all args");
    }
    try {
      const date1ts = new Date(data.startDate).getTime();
      const date2ts = new Date(data.endDate).getTime();
      const baseNFT =
        "https://nft-balance-api.dappradar.com/transactions/ethereum";
      let reply: any = {};
      for (let i = 0; i < data.nfts.length; i++) {
        const nft: string = data.nfts[i];
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

export const config = {
  api: {
    responseLimit: false,
  },
}