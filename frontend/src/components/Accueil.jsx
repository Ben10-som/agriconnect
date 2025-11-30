/**
 * Page d'accueil - Point d'entrée de l'application
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Header from './Header'
import Login from './Login'
import Register from './Register'
import AgriculteurForm from './AgriculteurForm'
import AcheteurList from './AcheteurList'

function Accueil() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AcheteurList />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/publish" element={<AgriculteurForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App


