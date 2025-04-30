/* eslint-env node */
/* eslint-disable no-undef */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();
const db = admin.firestore();

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2022-11-15",
});

// ✅ Cloud Functions v1 (no Cloud Run, no port issues)
exports.createPaymentIntent = functions
  .region("us-central1")
  .runWith({ timeoutSeconds: 60, memory: "256MB" }) // Optional
  .https
  .onCall(async (data) => {
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
  .https
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
  .https
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

  