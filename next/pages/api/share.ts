// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { BasePortfolioAsset } from "../../types";
import Ajv from "ajv";
import slugify from "../../utils/slugify";

const ajv = new Ajv();

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
} catch (error: any) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

type ShareType = {
  pid: string;
  portfolio: BasePortfolioAsset[];
  timestamp: string;
};

const schema = {
  type: "object",
  properties: {
    portfolio: {
      type: "array",
      minItems: 1,
      maxItems: 100,
      items: {
        type: "object",
        properties: {
          account: {
            type: "string",
            maxLength: 100,
          },
          type: {
            type: "string",
            maxLength: 100,
          },
          ticker: {
            type: "string",
            maxLength: 500,
          },
          nickname: {
            type: "string",
            maxLength: 100,
          },
          shares: {
            type: "number",
          },
          show: {
            type: "boolean",
          },
          color: {
            type: "string",
          },
          value: {
            type: "number",
          },
          roi: {
            type: "number",
          },
        },
        required: [
          // "account",
          // "nickname",
          "type",
          "ticker",
          "shares",
          // "show",
          // "color",
          // "value",
          // "roi",
        ],
      },
    },
    pid: {
      type: "string",
      maxLength: 100,
    },
    timestamp: { type: "string", maxLength: 100 },
  },
  required: ["portfolio", "pid", "timestamp"],
};

const isValid = ajv.compile(schema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const firebase = admin.firestore();
    const { pid, portfolio } = req.body as ShareType;
    let temp = { pid } as ShareType;

    temp.portfolio = portfolio.map(
      ({ ticker, nickname, shares, type, account, value }) => ({
        ticker,
        ...(nickname && { nickname }),
        shares,
        type,
        ...(account && { account }),
        value: value ? value : 0,
      })
    );
    temp.timestamp = "" + new Date();

    if (!isValid(temp))
      return res.status(405).json({ error: "Invalid format." });
    if (temp.portfolio.length > 100)
      return res
        .status(405)
        .json({ error: "Max portfolio size is 100 assets for sharing." });

    return new Promise<void>(async (resolve, reject) => {
      const id = slugify(pid);
      const ref = await firebase.collection("anon-portfolios").doc(id).get();
      if (ref.exists) {
        return resolve(res.status(405).json({ error: "Name already taken" }));
      }
      firebase
        .collection("anon-portfolios")
        .doc(id)
        .set(temp)
        .then((doc) => {
          res.status(200).json({ id });
          res.end();
          resolve();
        })
        .catch((e) => {
          console.log(e);
          res.status(405).json(e);
          res.end();
          resolve();
        });
    });
  }
}
