import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

// ✅ Correct Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCYuzbIxt1Xj3SmRUKO2rteHw5dSgZ2hE8",
  authDomain: "amore-candles.firebaseapp.com",
  projectId: "amore-candles",
  storageBucket: "amore-candles.appspot.com", // ✅ fixed typo here
  messagingSenderId: "392312168587",
  appId: "1:392312168587:web:d0b35c3f92de87a6c2f48e",
  measurementId: "G-EQWD50X814"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Enable optional analytics (no harm in keeping it)
getAnalytics(app);

// ✅ Set up callable Cloud Functions
const functions = getFunctions(app);

export const createPaymentIntent = httpsCallable(functions, "createPaymentIntent");
export const sendOfficeOrder = httpsCallable(functions, "sendOfficeOrder");
export const savePaidOrder = httpsCallable(functions, "savePaidOrder");
