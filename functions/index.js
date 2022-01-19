// to test:
// firebase emulators:start

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const yahooFinance = require("yahoo-finance");
const { error } = require("firebase-functions/logger");

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// http://localhost:5001/track-portfolio/us-central1/stocks
exports.stocks = functions.https.onCall((data, context) => {
  // Message text passed from the client.
  // Authentication / user information is automatically added to the request.
  // const uid = context.auth.uid;
  // const name = context.auth.token.name || null;
  // const picture = context.auth.token.picture || null;
  // const email = context.auth.token.email || null;
  //   functions.logger.info("Hello logs!", {structuredData: true});

  if (!data || !data.tickers || !data.startDate || !data.endDate || !data.period) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Include all args"
    );
  }

  const date1 = new Date(data.startDate);
  const date2 = new Date(data.endDate);
  const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  let {period} = data; //d,w,m 
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
      return reply;
    });
});
