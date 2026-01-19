import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, disableNetwork, enableNetwork, clearIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// TEMPORARY: Clear cache to force fresh data
if (import.meta.env.DEV) {
  console.log('[Firebase] Clearing IndexedDB cache...');
  clearIndexedDbPersistence(db)
    .then(() => console.log('[Firebase] Cache cleared successfully'))
    .catch((err) => console.warn('[Firebase] Could not clear cache:', err));
}

// Configure Google Auth Provider for Workspace SSO
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  hd: 'kartel.ai', // Restrict to kartel.ai domain only
  prompt: 'select_account'
});
