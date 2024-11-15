import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQNk1QJlApjcaSUBDPpODQWb-ei5teAkM",
  authDomain: "headquarters-e1285.firebaseapp.com",
  projectId: "headquarters-e1285",
  storageBucket: "headquarters-e1285.appspot.com", // Ensure this is correct
  messagingSenderId: "647570623295",
  appId: "1:647570623295:web:6032f81450bbc853f9218a",
  measurementId: "G-LR8GC6NE10"
};

// Log the configuration for debugging
console.log("Firebase Config:", firebaseConfig);

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
console.log("Firebase App Initialized:", app);

// Initialize Firebase Storage
const storage = getStorage(app);
export { storage };
export default app;
