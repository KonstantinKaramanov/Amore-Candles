/* eslint-env node */
/* eslint-disable no-undef */

const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();
const db = admin.firestore();

// 🔐 Stripe Payment Intent
exports.createPaymentIntent = functions.https.onCall({
  secrets: ["STRIPE_SECRET"]
}, async (request) => {
  try {
    const data = request.data;
    console.log("🧾 PaymentIntent received:", data);

    const stripe = new Stripe(process.env.STRIPE_SECRET, {
      apiVersion: "2022-11-15",
    });

    const { amount } = data;

    if (!amount || isNaN(amount)) {
      throw new Error("Invalid amount passed");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "bgn",
      automatic_payment_methods: { enabled: true },
    });

    console.log("✅ PaymentIntent created:", paymentIntent.id);

    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error("❌ createPaymentIntent error:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// 🧼 Helper to sanitize cart array
function sanitizeCart(cart) {
  if (!Array.isArray(cart)) {
    console.warn("Cart is not an array:", cart);
    return [];
  }

  return cart.map(item => ({
    id: item?.id ?? "",
    name: item?.name ?? "",
    price: item?.price ?? 0,
    quantity: item?.quantity ?? 1,
  }));
}

// 🧼 Helper to sanitize full order data
function sanitizeOrder(data) {
  const order = {
    cart: sanitizeCart(data?.cart),
    courier: data?.courier ?? "",
    office: data?.office ?? "",
    note: data?.note ?? "",
    name: data?.name ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  console.log("📦 Sanitized order:", order);
  return order;
}

// 🚚 COD order
exports.sendOfficeOrder = functions.https.onCall(async (request) => {
  try {
    const data = request.data;
    console.log("🚚 sendOfficeOrder received:", data);

    const order = sanitizeOrder(data);
    await db.collection("officeOrders").add(order);

    return { success: true };
  } catch (error) {
    console.error("❌ sendOfficeOrder failed:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// 💳 Paid order
exports.savePaidOrder = functions.https.onCall(async (request) => {
  try {
    const data = request.data;
    console.log("💳 savePaidOrder received:", data);

    const order = sanitizeOrder(data);
    await db.collection("paidOrders").add(order);

    return { success: true };
  } catch (error) {
    console.error("❌ savePaidOrder failed:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});




// ❌ Temporarily disabled courier office lookup
/*
exports.getCourierOffices = functions.https.onCall({
  secrets: ["EKONT_API_KEY", "SPEEDY_API_KEY"]
}, async (data) => {
  const { courier } = data;

  try {
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
        address: `${office.city?.name || ""}, ${office.address?.street || ""} ${office.address?.num || ""}`,
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
  } catch (err) {
    console.error(err);
    throw new functions.https.HttpsError("internal", "Failed to fetch courier offices.");
  }
});
*/


