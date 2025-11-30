import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Configuration Firebase - Utilise les variables d'environnement ou les valeurs par défaut
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDPJZfZjn-3yAsoehTvOPjBTPILm3aXosU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agriconnect-9ee31.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agriconnect-9ee31",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agriconnect-9ee31.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "805313911232",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:805313911232:web:ac0ccc445b421869935025"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;

