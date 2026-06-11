'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

/**
 * Robust Firebase Initialization
 * Ensures shared singleton instances and handles SSR/Hydration edge cases.
 */
export function initializeFirebase() {
  let app: FirebaseApp;

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // Initialize App Check only on the client
  if (typeof window !== 'undefined') {
    // Official Site Key for career-navigator-00
    const siteKey = "6LcITm0sAAAAAHyJBIAJtqp4L6ixag3XrkaRMO_O";
    try {
      // Ensure we only initialize App Check once
      if (!(window as any)._firebase_app_check_initialized) {
        initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(siteKey),
          isTokenAutoRefreshEnabled: true
        });
        (window as any)._firebase_app_check_initialized = true;
        console.log("[Firebase] App Check initialized with Enterprise provider.");
      }
    } catch (err) {
      console.warn("[Firebase] App Check already active or initialization deferred.");
    }
  }

  return getSdks(app);
}

export function getSdks(firebaseApp: FirebaseApp) {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  
  // Analytics initialization with environment check
  if (typeof window !== 'undefined') {
    isAnalyticsSupported().then(supported => {
      if (supported) {
        getAnalytics(firebaseApp);
      }
    }).catch(() => {});
  }

  return {
    firebaseApp,
    auth,
    firestore,
    storage
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
