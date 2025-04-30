/* eslint-env node */
/* eslint-disable no-undef */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2022-11-15",
});

admin.initializeApp();
const _DB = admin.firestore();

exports.createPaymentIntent = functions.https.onCall(async (data) => {
  const { amount } = data;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "bgn",
    automatic_payment_methods: { enabled: true },
  });
  return { clientSecret: paymentIntent.client_secret };
});

// etc...

