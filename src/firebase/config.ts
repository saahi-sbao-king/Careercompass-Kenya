import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

export const firebaseConfig = {
  apiKey: "AIzaSyBtualDtkc_r3ZF0MWqgiuWphG3S-Fs-GY",
  authDomain: "career-navigator-00.firebaseapp.com",
  projectId: "career-navigator-00",
  storageBucket: "career-navigator-00.firebasestorage.app",
  messagingSenderId: "351859269523",
  appId: "1:351859269523:web:5087aefd35fdea25e05266",
  measurementId: "G-MDKRJHV58P"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Safe App Check Initialization
if (typeof window !== 'undefined') {
  const siteKey = "6LcITm0sAAAAAHyJBIAJtqp4L6ixag3XrkaRMO_O";
  try {
    // Only initialize once and catch failures to prevent "Failed to fetch" crashes
    if (!(window as any)._firebase_app_check_initialized) {
      // In development or unstable network environments, App Check can fail to fetch its config.
      // We wrap it to ensure it doesn't crash the main application thread.
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(siteKey),
        isTokenAutoRefreshEnabled: true
      });
      (window as any)._firebase_app_check_initialized = true;
    }
  } catch (e) {
    console.warn("Firebase App Check failed to initialize gracefully:", e);
  }
}

export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };
