// firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAlWu5-bcN5B6RvCxVrRv4q-IVZorZWGd0',
    authDomain: 'kai-db-b661d.firebaseapp.com',
    projectId: 'kai-db-b661d',
    storageBucket: 'kai-db-b661d.firebasestorage.app',
    messagingSenderId: '1050715964408',
    appId: '1:1050715964408:web:fff5d338659b4b41804c0d',
    measurementId: 'G-T1ZFHWS82Y',
};

// 🛡️ Prevent reinitialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
