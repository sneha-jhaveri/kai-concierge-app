import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDISEiTs4Zcgvq46mpevHrmM_6QICxvwaU",
  authDomain: "kai-db-38499.firebaseapp.com",
  projectId: "kai-db-38499",
  storageBucket: "kai-db-38499.firebasestorage.app",
  messagingSenderId: "684487509788",
  appId: "1:684487509788:web:540f566bbba48b4e7adcd9",
  measurementId: "G-R6FQ17306K"
};

// ✅ Initialize app (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Firebase Auth instance
export const auth = getAuth(app);

// ✅ Export Firestore instance
export const db = getFirestore(app);

// ✅ Export Firebase Storage instance
export const storage = getStorage(app, 'gs://kai-db-38499.firebasestorage.app');
