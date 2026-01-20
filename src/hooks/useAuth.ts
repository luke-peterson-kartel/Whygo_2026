import { useState, useEffect, useContext } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/config/firebase';
import { DevModeContext } from '@/contexts/DevModeContext';
import type { Employee } from '@/types/employee.types';
import type { AuthUser } from '@/types/auth.types';

export function useAuth() {
  const { devLevelOverride, isDevMode } = useContext(DevModeContext);
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

            // Apply dev mode level override if active
            let finalUser: AuthUser = {
              ...employeeData,
              firebaseUid: firebaseUser.uid,
            };

            if (isDevMode && devLevelOverride) {
              finalUser = {
                ...finalUser,
                level: devLevelOverride,
              };
              console.log(`[Dev Mode] Level override active: ${devLevelOverride} (original: ${employeeData.level})`);
            }

            setUser(finalUser);
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
  }, [devLevelOverride, isDevMode]);

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

  const devSignIn = async (email: string) => {
    // Only allow dev sign-in in development mode
    if (!isDevMode) {
      throw new Error('Dev sign-in is only available in development mode');
    }

    try {
      setError(null);
      setLoading(true);

      // Fetch employee document directly from Firestore
      const employeeDoc = await getDoc(doc(db, 'employees', email));

      if (employeeDoc.exists()) {
        const employeeData = {
          id: employeeDoc.id,
          ...employeeDoc.data()
        } as Employee;

        // Create auth user with fake Firebase UID for dev mode
        let finalUser: AuthUser = {
          ...employeeData,
          firebaseUid: `dev-${email}`,
        };

        // Apply dev mode level override if active
        if (devLevelOverride) {
          finalUser = {
            ...finalUser,
            level: devLevelOverride,
          };
          console.log(`[Dev Mode] Level override active: ${devLevelOverride} (original: ${employeeData.level})`);
        }

        setUser(finalUser);
        console.log(`[Dev Mode] Signed in as: ${email}`);
      } else {
        throw new Error(`Employee not found: ${email}`);
      }
    } catch (err) {
      console.error('Dev sign-in error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, signIn, signOut, devSignIn };
}
