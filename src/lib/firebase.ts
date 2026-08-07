import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Initialize Cloud Firestore database instance using configured Database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();
// Request Gmail scopes for sending emails
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleProvider.addScope('https://mail.google.com/');

let cachedAccessToken: string | null = null;
let isSigningIn = false;
let signInPromise: Promise<{ user: User; accessToken: string } | null> | null = null;

// Persistent Firestore Logger for Audit Trail
export const logAuditToFirestore = async (auditData: {
  username: string;
  role: string;
  action: string;
  details?: string;
  ip?: string;
  riskTag?: string;
}) => {
  try {
    const logsRef = collection(db, 'audit_logs');
    await addDoc(logsRef, {
      ...auditData,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore Audit Log write notice:', err);
  }
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};


export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (signInPromise) {
    return signInPromise;
  }

  signInPromise = (async () => {
    try {
      isSigningIn = true;
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('Failed to retrieve Google OAuth Access Token from Firebase Auth credentials.');
      }

      cachedAccessToken = credential.accessToken;
      return { user: result.user, accessToken: cachedAccessToken };
    } catch (error: any) {
      if (
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/popup-closed-by-user'
      ) {
        console.info('Google Sign-In popup closed or cancelled by user.');
        return null;
      }
      console.error('Google Sign-In Error:', error);
      throw error;
    } finally {
      isSigningIn = false;
      signInPromise = null;
    }
  })();

  return signInPromise;
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
