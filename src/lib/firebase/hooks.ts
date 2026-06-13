
'use client';

import { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot, collection, query, QueryConstraint, DocumentData } from 'firebase/firestore';
import { db } from './config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Guest Identity Hook
 * Replaces useUser() by using a persistent identifier in localStorage.
 */
export function useGuestUser() {
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestData, setGuestData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let id = localStorage.getItem('cck_guest_id');
    if (!id) {
      id = `guest_${Math.random().toString(36).substr(2, 9)}`;
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
      console.error("[useGuestUser] Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [guestId]);

  return { guestId, guestData, loading };
}

export function useIsAdmin() {
  return { isAdmin: true, loading: false };
}

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
    }, (err) => {
      if (err.code === 'permission-denied' && !path.startsWith('feature_flags')) {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ operation: 'get', path }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path]);

  return { data, loading };
}

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
    }, (err) => {
      if (err.code === 'permission-denied') {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ operation: 'list', path: path || 'unknown' }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [q, path]);

  return { data, loading };
}
