'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  storage?: FirebaseStorage;
}

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  storage: FirebaseStorage | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  storage,
}) => {
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      storage: storage || null,
    };
  }, [firebaseApp, firestore, storage]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  if (!firestore) throw new Error('Firestore not initialized');
  return firestore;
};

export const useStorage = (): FirebaseStorage => {
  const { storage } = useFirebase();
  if (!storage) throw new Error('Storage not initialized');
  return storage;
};

export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T & {__memo?: boolean} {
  const memoized = React.useMemo(factory, deps) as any;
  if (memoized && typeof memoized === 'object') memoized.__memo = true;
  return memoized;
}
