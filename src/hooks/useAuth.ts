import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/config/firebase';
import type { Employee } from '@/types/employee.types';
import type { AuthUser } from '@/types/auth.types';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Fetch employee document from Firestore using email as document ID
          const userEmail = firebaseUser.email;

          if (!userEmail) {
            console.error('No email found for authenticated user');
            setUser(null);
            setError(new Error('Authentication error. No email found.'));
            setLoading(false);
            return;
          }

          const employeeDoc = await getDoc(doc(db, 'employees', userEmail));

          if (employeeDoc.exists()) {
            const employeeData = {
              id: employeeDoc.id,
              ...employeeDoc.data()
            } as Employee;

            setUser({
              ...employeeData,
              firebaseUid: firebaseUser.uid,
            });
          } else {
            // User authenticated but not in employees collection
            console.error('User not found in employees collection:', userEmail);
            setUser(null);
            setError(new Error('User not authorized. Only @kartel.ai employees can access this app.'));
          }
        } else {
          setUser(null);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err as Error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err as Error);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err as Error);
      throw err;
    }
  };

  return { user, loading, error, signIn, signOut };
}
