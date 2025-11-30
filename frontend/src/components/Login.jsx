import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Phone, Lock, AlertCircle } from 'lucide-react'

function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      setError('')
      setLoading(true)
      
      if (!phone.trim()) {
        setError('Veuillez entrer votre numéro de téléphone')
        setLoading(false)
        return
      }
      
      if (!password) {
        setError('Veuillez entrer votre mot de passe')
        setLoading(false)
        return
      }
      
      await login(phone.trim(), password)
      navigate('/')
    } catch (err) {
      console.error('Erreur complète:', err)
      
      if (err.code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec ce numéro de téléphone')
      } else if (err.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect')
      } else if (err.code === 'auth/invalid-email') {
        setError('Numéro de téléphone invalide')
      } else if (err.code === 'auth/network-request-failed') {
        setError('Erreur de connexion. Vérifiez votre connexion internet.')
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Numéro de téléphone ou mot de passe incorrect')
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
            Connexion à AgriConnect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous pour publier ou acheter des produits
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
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="phone" className="sr-only">
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
                  className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Numéro de téléphone (ex: +221771234567)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
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
                  className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Créer un compte
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

