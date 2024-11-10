import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoAiPWZN8T7XXEKwKm6u0XLKVy_t7tq3A",
  authDomain: "sumdash-cb200.firebaseapp.com",
  projectId: "sumdash-cb200",
  storageBucket: "sumdash-cb200.appspot.com",
  messagingSenderId: "423109043324",
  appId: "1:423109043324:web:ef1fdf9da4391c25a295f9",
  measurementId: "G-3BG72TEYH0"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Conditionally initialize Firebase Analytics
isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
  } else {
    console.log("Analytics is not supported in this environment.");
  }
});

// Export the app and storage to be used elsewhere
export const storage = getStorage(app);
export default app;
