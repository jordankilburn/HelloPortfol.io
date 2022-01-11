// to test:
// firebase emulators:start

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const yahooFinance = require("yahoo-finance");

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// http://localhost:5001/track-portfolio/us-central1/helloWorld
exports.helloWorld = functions.https.onRequest((request, response) => {
  //   functions.logger.info("Hello logs!", {structuredData: true});
  var SYMBOLS = ["AAPL", "AMZN", "GOOGL","TSLA"];
  let reply = {};
  yahooFinance
    .historical({
      symbols: SYMBOLS,
      from: "2021-11-30",
      to: "2021-12-30",
      period: "d",
    })
    .then(function (result) {
      Object.keys(result).forEach((ticker) => {
        let prices = [];
        result[ticker].forEach(({ date, open, close }) => {
          prices.push({ date, open, close });
        });
        reply[ticker] = prices;
      });
      response.send(reply);
    });
});
