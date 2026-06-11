import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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

// Singleton app initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize App Check immediately if on the client
if (typeof window !== 'undefined') {
  const siteKey = "6LcITm0sAAAAAHyJBIAJtqp4L6ixag3XrkaRMO_O";
  try {
    if (!(window as any)._firebase_app_check_initialized) {
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(siteKey),
        isTokenAutoRefreshEnabled: true
      });
      (window as any)._firebase_app_check_initialized = true;
    }
  } catch (e) {
    // Silent catch for already initialized error
  }
}

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
