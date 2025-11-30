import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { db } from '../firebase/config'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Convertir numéro de téléphone en email (Firebase Auth nécessite un email)
  const phoneToEmail = (phone) => {
    // Nettoyer le numéro et le convertir en format email
    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 9) {
      throw new Error('Numéro de téléphone invalide')
    }
    return `${cleanPhone}@agriconnect.local`
  }

  // S'inscrire
  async function signup(name, phone, password) {
    try {
      // Valider les entrées
      if (!name || name.trim().length < 2) {
        throw new Error('Le nom doit contenir au moins 2 caractères')
      }
      
      if (!phone || phone.trim().length < 9) {
        throw new Error('Numéro de téléphone invalide')
      }

      if (!password || password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères')
      }

      const email = phoneToEmail(phone)
      
      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Sauvegarder les données utilisateur dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        phone: phone.trim(),
        email: email,
        createdAt: serverTimestamp()
      })

      return userCredential
    } catch (error) {
      // Re-lancer l'erreur avec plus de détails
      console.error('Erreur signup:', error)
      throw error
    }
  }

  // Se connecter
  function login(phone, password) {
    const email = phoneToEmail(phone)
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Se déconnecter
  function logout() {
    return signOut(auth)
  }

  // Charger les données utilisateur depuis Firestore
  useEffect(() => {
    if (currentUser) {
      const loadUserData = async () => {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
      }
      loadUserData()
    } else {
      setUserData(null)
    }
  }, [currentUser])

  // Écouter les changements d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

