import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Singleton app initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize App Check safely on the client
if (typeof window !== 'undefined') {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (siteKey) {
    try {
      if (!(window as any)._firebase_app_check_initialized) {
        initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(siteKey),
          isTokenAutoRefreshEnabled: true
        });
        (window as any)._firebase_app_check_initialized = true;
      }
    } catch (e) {
      // Silent catch for initialization errors
    }
  }
}

// Services (Firebase Auth is NOT used; using Auth.js instead)
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };
