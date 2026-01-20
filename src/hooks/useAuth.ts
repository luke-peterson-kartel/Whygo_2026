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

const DEV_USER_STORAGE_KEY = 'devUser';

/**
 * Shared helper to fetch employee data from Firestore and create AuthUser
 * Used by both Firebase authentication and dev mode sign-in
 */
async function fetchEmployeeAndCreateAuthUser(
  email: string,
  firebaseUid: string,
  devLevelOverride: string | null,
  isDevMode: boolean
): Promise<AuthUser> {
  const employeeDoc = await getDoc(doc(db, 'employees', email));

  if (!employeeDoc.exists()) {
    throw new Error(`Employee not found: ${email}`);
  }

  const employeeData = {
    id: employeeDoc.id,
    ...employeeDoc.data()
  } as Employee;

  // Create auth user
  let finalUser: AuthUser = {
    ...employeeData,
    firebaseUid,
  };

  // Apply dev mode level override if active
  if (isDevMode && devLevelOverride) {
    finalUser = {
      ...finalUser,
      level: devLevelOverride,
    };
  }

  return finalUser;
}

export function useAuth() {
  const { devLevelOverride, isDevMode } = useContext(DevModeContext);
  const [firebaseUser, setFirebaseUser] = useState<AuthUser | null>(null);

  // Initialize devUser from sessionStorage to persist across navigation
  const [devUser, setDevUser] = useState<AuthUser | null>(() => {
    if (!isDevMode) return null;
    const stored = sessionStorage.getItem(DEV_USER_STORAGE_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse stored dev user, clearing sessionStorage');
      sessionStorage.removeItem(DEV_USER_STORAGE_KEY);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Return dev user if active, otherwise Firebase user
  const user = devUser || firebaseUser;

  // Sync devUser to sessionStorage
  useEffect(() => {
    if (!isDevMode) return;

    if (devUser) {
      sessionStorage.setItem(DEV_USER_STORAGE_KEY, JSON.stringify(devUser));
    } else {
      sessionStorage.removeItem(DEV_USER_STORAGE_KEY);
    }
  }, [devUser, isDevMode]);

  useEffect(() => {
    // Skip Firebase listener if dev user is active
    if (devUser) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      try {
        if (fbUser) {
          const userEmail = fbUser.email;

          if (!userEmail) {
            console.error('No email found for authenticated user');
            setFirebaseUser(null);
            setError(new Error('Authentication error. No email found.'));
            setLoading(false);
            return;
          }

          // Use shared helper to fetch employee and create AuthUser
          const authUser = await fetchEmployeeAndCreateAuthUser(
            userEmail,
            fbUser.uid,
            devLevelOverride,
            isDevMode
          );
          setFirebaseUser(authUser);
        } else {
          setFirebaseUser(null);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (err instanceof Error && err.message.includes('Employee not found')) {
          setError(new Error('User not authorized. Only @kartel.ai employees can access this app.'));
        } else {
          setError(err as Error);
        }
        setFirebaseUser(null);
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
      setLoading(true); // Set loading to prevent race conditions

      // Store whether we have a dev user before clearing
      const isDevUser = !!devUser;

      // Clear dev user state and sessionStorage
      setDevUser(null);
      sessionStorage.removeItem(DEV_USER_STORAGE_KEY);

      // Clear Firebase user
      setFirebaseUser(null);

      // Only call Firebase signOut if there's an actual Firebase session
      // (devUser won't have a real Firebase session)
      if (!isDevUser) {
        await firebaseSignOut(auth);
      }

      // Set loading to false to trigger ProtectedRoute check
      setLoading(false);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err as Error);
      setLoading(false);
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

      // Use shared helper to fetch employee and create AuthUser
      // Use fake Firebase UID for dev mode
      const authUser = await fetchEmployeeAndCreateAuthUser(
        email,
        `dev-${email}`,
        devLevelOverride,
        isDevMode
      );
      setDevUser(authUser);
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
