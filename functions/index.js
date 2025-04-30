/* eslint-env node */
/* eslint-disable no-undef */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

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

exports.getCourierOffices = functions
  .runWith({ secrets: ["EKONT_API_KEY", "SPEEDY_API_KEY"] })
  .https.onCall(async (data) => {
    const { courier } = data;

    if (courier === "Ekont") {
      const apiKey = process.env.EKONT_API_KEY;
      const response = await axios.post(
        "https://ee.econt.com/services/Nomenclatures/NomenclaturesService.getOffices.json",
        {
          client: { username: apiKey },
        }
      );
      const offices = response.data?.offices || [];
      return offices.map((office) => ({
        id: office.id,
        name: office.name,
        address: `${office.city.name}, ${office.address.street} ${office.address.num}`,
      }));
    }

    if (courier === "Speedy") {
      const apiKey = process.env.SPEEDY_API_KEY;
      const response = await axios.post(
        "https://api.speedy.bg/v1/location/offices",
        {},
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const offices = response.data || [];
      return offices.map((office) => ({
        id: office.officeId,
        name: office.name,
        address: `${office.siteName}, ${office.address?.streetName || ""}`,
      }));
    }

    throw new functions.https.HttpsError("invalid-argument", "Unknown courier.");
  });


