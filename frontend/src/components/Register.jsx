import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { User, Phone, Lock, AlertCircle } from 'lucide-react'

function Register() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas')
    }

    if (password.length < 6) {
      return setError('Le mot de passe doit contenir au moins 6 caractères')
    }

    try {
      setError('')
      setLoading(true)
      
      // Validation supplémentaire
      if (!name.trim()) {
        setError('Veuillez entrer votre nom')
        setLoading(false)
        return
      }
      
      if (!phone.trim()) {
        setError('Veuillez entrer votre numéro de téléphone')
        setLoading(false)
        return
      }

      await signup(name.trim(), phone.trim(), password)
      navigate('/')
    } catch (err) {
      console.error('Erreur complète:', err)
      
      // Gestion des erreurs Firebase Auth
      if (err.code === 'auth/configuration-not-found') {
        setError('Firebase Authentication n\'est pas activé. Veuillez activer Email/Password dans Firebase Console. Voir TROUBLESHOOTING.md pour les instructions.')
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Ce numéro de téléphone est déjà enregistré')
      } else if (err.code === 'auth/invalid-email') {
        setError('Numéro de téléphone invalide')
      } else if (err.code === 'auth/weak-password') {
        setError('Le mot de passe est trop faible')
      } else if (err.code === 'auth/network-request-failed') {
        setError('Erreur de connexion. Vérifiez votre connexion internet.')
      } else if (err.message) {
        // Utiliser le message d'erreur personnalisé
        setError(err.message)
      } else {
        setError(`Erreur lors de la création du compte: ${err.code || err.message || 'Erreur inconnue'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte AgriConnect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Rejoignez la communauté d'agriculteurs et d'acheteurs
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Erreur</span>
              </div>
              <p className="text-sm ml-7">{error}</p>
              {error.includes('configuration-not-found') && (
                <div className="mt-3 ml-7 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <p className="font-semibold text-yellow-800 mb-1">Solution rapide :</p>
                  <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                    <li>Allez sur <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                    <li>Projet: agriconnect-9ee31 → Authentication</li>
                    <li>Onglet "Sign-in method" → Email/Password</li>
                    <li>Activez le toggle "Email/Password" → Save</li>
                    <li>Rafraîchissez cette page et réessayez</li>
                  </ol>
                  <p className="mt-2 text-yellow-600">Voir le fichier ACTIVER_FIREBASE_AUTH.md pour plus de détails</p>
                </div>
              )}
              <p className="text-xs text-red-600 mt-2 ml-7">
                Vérifiez la console du navigateur (F12) pour plus de détails
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Votre nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="+221771234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Au moins 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Répétez le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Se connecter
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register

