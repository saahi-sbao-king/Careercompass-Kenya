import { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, collection, QueryConstraint, query, DocumentData } from 'firebase/firestore';
import { auth, db } from './config';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}

export function useUser() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      setUserData(snapshot.data() || null);
      setLoading(false);
    }, (error) => {
      const contextualError = new FirestorePermissionError({
        operation: 'get',
        path: `users/${user.uid}`
      });
      errorEmitter.emit('permission-error', contextualError);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { user, userData, loading };
}

/**
 * Administrative Access Hook
 * Updated: Always returns true to bypass authentication requirements for admin roles.
 */
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
      setData(snapshot.data() || null);
      setLoading(false);
    }, (error) => {
      const contextualError = new FirestorePermissionError({
        operation: 'get',
        path: path
      });
      errorEmitter.emit('permission-error', contextualError);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [path]);

  return { data, loading };
}

export function useCollection(path: string | null, ...constraints: QueryConstraint[]) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const q = useMemo(() => {
    if (!path) return null;
    return query(collection(db, path), ...constraints);
  }, [path, constraints]);

  useEffect(() => {
    if (!q) {
      setData([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      const contextualError = new FirestorePermissionError({
        operation: 'list',
        path: path || 'unknown'
      });
      errorEmitter.emit('permission-error', contextualError);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [q, path]);

  return { data, loading };
}
