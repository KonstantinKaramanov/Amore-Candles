/* eslint-env node */
/* eslint-disable no-undef */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();
const db = admin.firestore();

// 🔐 Stripe will be initialized inside the function using process.env
// STRIPE_SECRET must be set using Firebase Secret Manager
// Run: firebase functions:secrets:set STRIPE_SECRET

exports.createPaymentIntent = functions
  .region("us-central1")
  .runWith({ secrets: ["STRIPE_SECRET"], timeoutSeconds: 60, memory: "256MB" })
  .onCall(async (data) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET, {
      apiVersion: "2022-11-15",
    });

    const { amount } = data;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "bgn",
      automatic_payment_methods: { enabled: true },
    });

    return { clientSecret: paymentIntent.client_secret };
  });

exports.sendOfficeOrder = functions
  .region("us-central1")
  .onCall(async (data) => {
    const { cart, courier, office, note } = data;
    await db.collection("officeOrders").add({
      cart,
      courier,
      office,
      note,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  });

exports.savePaidOrder = functions
  .region("us-central1")
  .onCall(async (data) => {
    const { cart, courier, office, note } = data;
    await db.collection("paidOrders").add({
      cart,
      courier,
      office,
      note,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  });


  