/* eslint-env node */
/* eslint-disable no-undef */


const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();
const db = admin.firestore();

// ⛔ No runWith, no region, no secrets — keep it simple for now
const stripe = new Stripe("sk_test_YOUR_SECRET_KEY", {
  apiVersion: "2022-11-15",
});

exports.createPaymentIntent = functions.https.onCall(async (data) => {
  const { amount } = data;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "bgn",
    automatic_payment_methods: { enabled: true },
  });

  return { clientSecret: paymentIntent.client_secret };
});

exports.sendOfficeOrder = functions.https.onCall(async (data) => {
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

exports.savePaidOrder = functions.https.onCall(async (data) => {
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

