'use client';

import { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot, collection, query, QueryConstraint, DocumentData } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Guest Identity Hook
 * Uses a persistent identifier in localStorage to track student progress without accounts.
 * This is the primary identity system for CareerCompass Kenya.
 */
export function useGuestUser() {
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestData, setGuestData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let id = localStorage.getItem('cck_guest_id');
    if (!id) {
      id = `scholar_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cck_guest_id', id);
    }
    setGuestId(id);
  }, []);

  useEffect(() => {
    if (!guestId) return;

    const unsubscribe = onSnapshot(doc(db, 'users', guestId), (snapshot) => {
      setGuestData(snapshot.data() || null);
      setLoading(false);
    }, (error) => {
      console.error("[useGuestUser] Identity Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [guestId]);

  return { guestId, guestData, loading };
}

/**
 * Admin Access Hook
 * Stealth mode: check for a local verification flag.
 */
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verified = typeof window !== 'undefined' && localStorage.getItem('cck_admin_verified') === 'true';
    setIsAdmin(verified);
    setLoading(false);
  }, []);

  return { isAdmin, loading };
}

/**
 * Generic Document Listener
 * Handles permission errors gracefully using the specialized error handling architecture.
 */
export function useDoc(path: string | null) {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) {
      setData(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const unsubscribe = onSnapshot(doc(db, path), (snapshot) => {
      setData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
      setLoading(false);
    }, (error) => {
      console.error(`[useDoc] Error at ${path}:`, error);
      if (error.code === 'permission-denied') {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: path
        });
        errorEmitter.emit('permission-error', contextualError);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path]);

  return { data, loading };
}

/**
 * Generic Collection Listener
 * Standardized query and listener implementation.
 */
export function useCollection(path: string | null, ...constraints: QueryConstraint[]) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const q = useMemo(() => path ? query(collection(db, path), ...constraints) : null, [path, constraints]);

  useEffect(() => {
    if (!q) {
      setData([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      console.error(`[useCollection] Error at ${path}:`, error);
      if (error.code === 'permission-denied') {
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path: path || 'unknown'
        });
        errorEmitter.emit('permission-error', contextualError);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [q, path]);

  return { data, loading };
}
