import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  appId: "xxx"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export const createPaymentIntent = httpsCallable(functions, "createPaymentIntent");
export const sendOfficeOrder = httpsCallable(functions, "sendOfficeOrder");
export const savePaidOrder = httpsCallable(functions, "savePaidOrder");
