import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";


// ✅ Correct Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB-Nps3106JWU6I4jR3ZpLE_BDZoQnsdRY",
  authDomain: "amore-candles-boutique.firebaseapp.com",
  projectId: "amore-candles-boutique",
  storageBucket: "amore-candles-boutique.firebasestorage.app",
  messagingSenderId: "1037443017067",
  appId: "1:1037443017067:web:0e3a19ee3b8b21c184842e",
  measurementId: "G-0Y14LHY640"
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
export const getCourierOffices = httpsCallable(functions, "getCourierOffices");