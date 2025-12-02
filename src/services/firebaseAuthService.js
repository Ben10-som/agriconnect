import { getApps, initializeApp, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { FIREBASE_CONFIG } from '../config/firebase';

// Initialiser l'app Firebase si nécessaire
let app;
if (!getApps().length) {
  app = initializeApp(FIREBASE_CONFIG);
} else {
  app = getApp();
}

const auth = getAuth(app);

export const signUp = async (email, password, profile = {}) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Mettre à jour le profil utilisateur (displayName, phoneNumber stocké dans photoURL ou custom claims si besoin)
  try {
    await updateProfile(user, {
      displayName: profile.displayName || '',
      photoURL: profile.photoURL || ''
    });
  } catch (e) {
    console.warn('Impossible de mettre à jour le profile:', e);
  }

  // Vous pouvez également enregistrer des données supplémentaires dans Firestore (ex: role, telephone, locations)
  return user;
};

export const signIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOut = async () => {
  return await firebaseSignOut(auth);
};

export const onAuthChange = (cb) => {
  return onAuthStateChanged(auth, cb);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const updateUserProfile = async (updates) => {
  if (!auth.currentUser) {
    throw new Error('Aucun utilisateur connecté');
  }
  await updateProfile(auth.currentUser, updates);
  return auth.currentUser;
};

export default {
  signUp,
  signIn,
  signOut,
  onAuthChange,
  getCurrentUser,
  updateUserProfile
};
