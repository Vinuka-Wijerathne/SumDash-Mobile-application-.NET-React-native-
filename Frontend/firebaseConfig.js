import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import Config from 'react-native-config';

// Your Firebase configuration using environment variables from `react-native-config`
const firebaseConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
  appId: Config.FIREBASE_APP_ID,
  measurementId: Config.FIREBASE_MEASUREMENT_ID
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
