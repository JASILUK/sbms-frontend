import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

// =====================================================
// FIREBASE CONFIG
// =====================================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// =====================================================
// FIREBASE APP
// =====================================================
export const firebaseApp = initializeApp(firebaseConfig);

// =====================================================
// MESSAGING SINGLETON
// =====================================================
let messagingInstance = null;

// =====================================================
// GET FIREBASE MESSAGING & REGISTER SERVICE WORKER DYNAMICALLY
// =====================================================
export async function getFirebaseMessaging() {
  try {
    // Check browser support
    const supported = await isSupported();

    if (!supported) {
      console.warn("Firebase messaging not supported");
      return null;
    }

    // Register Service Worker with safe query params
    if ("serviceWorker" in navigator) {
      const configParams = new URLSearchParams(firebaseConfig).toString();
      
      navigator.serviceWorker
        .register(`/firebase-messaging-sw.js?${configParams}`)
        .then((registration) => {
          console.log("Firebase SW registered dynamically with secure config parameters");
        })
        .catch((err) => {
          console.error("Firebase Service Worker registration failed:", err);
        });
    }

    // Singleton Instance setup
    if (!messagingInstance) {
      messagingInstance = getMessaging(firebaseApp);
    }

    return messagingInstance;
  } catch (error) {
    console.error("Firebase messaging initialization failed", error);
    return null;
  }
}