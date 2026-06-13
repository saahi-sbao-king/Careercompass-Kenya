'use client';

import { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot, collection, query, QueryConstraint, DocumentData } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Guest Identity Hook
 * Uses a persistent identifier in localStorage to track student progress without accounts.
 */
export function useGuestUser() {
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestData, setGuestData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let id = localStorage.getItem('cck_guest_id');
    if (!id) {
      id = `scholar_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cck_guest_id', id);
    }
    setGuestId(id);
  }, []);

  useEffect(() => {
    if (!guestId || !db) return;

    try {
      const unsubscribe = onSnapshot(doc(db, 'users', guestId), (snapshot) => {
        setGuestData(snapshot.data() || null);
        setLoading(false);
      }, (error) => {
        console.warn("[useGuestUser] Identity Sync Warning:", error.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, [guestId]);

  return { guestId, guestData, loading };
}

/**
 * Administrative Verification Hook
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
 * Real-time Document Hook
 */
export function useDoc(path: string | null) {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path || !db) {
      setData(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const unsubscribe = onSnapshot(doc(db, path), (snapshot) => {
        setData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
        setLoading(false);
      }, (error) => {
        if (error.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            operation: 'get',
            path: path
          }));
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, [path]);

  return { data, loading };
}

/**
 * Real-time Collection Hook
 */
export function useCollection(path: string | null, ...constraints: QueryConstraint[]) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const q = useMemo(() => (path && db) ? query(collection(db, path), ...constraints) : null, [path, constraints]);

  useEffect(() => {
    if (!q) {
      setData([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }, (error) => {
        if (error.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            operation: 'list',
            path: path || 'unknown'
          }));
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, [q, path]);

  return { data, loading };
}

/**
 * Basic Auth User Hook (Compatibility)
 */
export function useUser() {
  return { user: null, userData: null, loading: false };
}
