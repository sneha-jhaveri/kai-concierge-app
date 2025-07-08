import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAlWu5-bcN5B6RvCxVrRv4q-IVZorZWGd0',
  authDomain: 'kai-db-b661d.firebaseapp.com',
  projectId: 'kai-db-b661d',
  storageBucket: 'kai-db-b661d.appspot.com',
  messagingSenderId: '1050715964408',
  appId: '1:1050715964408:web:fff5d338659b4b41804c0d',
  measurementId: 'G-T1ZFHWS82Y',
};

// ✅ Initialize app (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Firebase Auth instance
export const auth = getAuth(app);

// ✅ Export Firestore instance
export const db = getFirestore(app);
