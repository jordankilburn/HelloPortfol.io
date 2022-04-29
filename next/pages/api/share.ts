// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { BasePortfolioAsset } from "../../types";

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
  timestamp: Date;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const firebase = admin.firestore();
    const { pid, portfolio } = req.body as ShareType;
    let temp = { pid, portfolio } as ShareType;
    temp.timestamp = new Date();

    return new Promise<void>((resolve, reject) => {
      firebase
        .collection("anon-portfolios")
        .add(temp)
        .then(() => {
          res.status(200);
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
