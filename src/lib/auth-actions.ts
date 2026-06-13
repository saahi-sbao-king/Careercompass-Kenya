'use server';

import { db } from '@/firebase/config';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

/**
 * Registers a new user in the Firestore database.
 * Designed for use with Auth.js Credentials provider.
 */
export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string || 'student';

  if (!name || !email || !password) {
    return { error: 'Please fill in all fields.' };
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { error: 'An account with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await addDoc(usersRef, {
      name,
      email,
      hashedPassword,
      role,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    });

    return { success: true };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }
}
