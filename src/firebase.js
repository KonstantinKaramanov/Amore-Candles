import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = { /* YOUR WEB CONFIG */ };
const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
export const createPaymentIntent = httpsCallable(
  functions,
  "createPaymentIntent"
);
