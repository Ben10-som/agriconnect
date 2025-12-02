import React, { useState } from 'react';
import firebaseAuth from '../services/firebaseAuthService';
import db from '../services/firebaseService';
import { collection, addDoc } from 'firebase/firestore';
import { REGIONS_SENEGAL } from '../data/regions';

const AuthModal = ({ visible, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // login | register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('acheteur');
  const [region, setRegion] = useState('');
  const [relayPoints, setRelayPoints] = useState({}); // { regionId: [points] }
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await firebaseAuth.signIn(email, password);
      onAuthSuccess && onAuthSuccess(user);
      onClose();
    } catch (error) {
      console.error('Login error', error);
      alert('Erreur de connexion: ' + (error.message || error));
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!region) {
      alert('⚠️ Veuillez sélectionner votre région');
      return;
    }

    if (role === 'agriculteur' && Object.keys(relayPoints).length === 0) {
      alert('⚠️ Veuillez ajouter au moins un point de relais');
      return;
    }

    try {
      setLoading(true);
      const user = await firebaseAuth.signUp(email, password, { displayName: name });

      // Enregistrer les informations supplémentaires dans Firestore
      try {
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          displayName: name,
          email,
          phone,
          role,
          region,
          relayPoints: role === 'agriculteur' ? relayPoints : {},
          createdAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Impossible de sauvegarder le profil en base:', e);
      }

      onAuthSuccess && onAuthSuccess(user);
      onClose();
    } catch (error) {
      console.error('Register error', error);
      alert('Erreur lors de la création de compte: ' + (error.message || error));
    } finally { setLoading(false); }
  };

  const addRelayPoint = (regionId) => {
    const point = prompt('Entrez le nom du point de relais (ex: Marché Central, Gare Routière):');
    if (point && point.trim()) {
      setRelayPoints({
        ...relayPoints,
        [regionId]: [...(relayPoints[regionId] || []), point.trim()]
      });
    }
  };

  const removeRelayPoint = (regionId, index) => {
    const newPoints = [...(relayPoints[regionId] || [])];
    newPoints.splice(index, 1);
    setRelayPoints({
      ...relayPoints,
      [regionId]: newPoints
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{mode === 'login' ? 'Se connecter' : 'Créer un compte'}</h3>
          <button onClick={onClose} className="text-gray-500">Fermer</button>
        </div>

        <div className="space-y-3">
          {mode === 'register' && (
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nom complet" className="w-full border rounded p-2" />
          )}
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded p-2" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Mot de passe" type="password" className="w-full border rounded p-2" />
          {mode === 'register' && (
            <>
              <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full border rounded p-2">
                <option value="acheteur">Acheteur</option>
                <option value="agriculteur">Agriculteur</option>
              </select>
              <input value={phone} onChange={(e)=>setPhone(e.target.value.replace(/\D/g, ''))} placeholder="Téléphone (ex: 771234567)" maxLength="9" className="w-full border rounded p-2" />
              <div>
                <label className="block text-sm font-semibold mb-1">Région *</label>
                <select value={region} onChange={(e)=>setRegion(e.target.value)} className="w-full border rounded p-2">
                  <option value="">Sélectionner votre région</option>
                  {REGIONS_SENEGAL.map(r => (
                    <option key={r.id} value={r.id}>{r.nom}</option>
                  ))}
                </select>
              </div>
              {role === 'agriculteur' && (
                <div className="border rounded p-3 bg-gray-50">
                  <label className="block text-sm font-semibold mb-2">Points de relais par région *</label>
                  <p className="text-xs text-gray-600 mb-3">Indiquez où vos camions font des points de relais pour la récupération des produits</p>
                  
                  {region && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{REGIONS_SENEGAL.find(r => r.id === region)?.nom}</span>
                        <button 
                          type="button"
                          onClick={() => addRelayPoint(region)} 
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                        >
                          + Ajouter point
                        </button>
                      </div>
                      {relayPoints[region] && relayPoints[region].length > 0 && (
                        <div className="space-y-1">
                          {relayPoints[region].map((point, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-2 rounded text-sm">
                              <span>{point}</span>
                              <button 
                                type="button"
                                onClick={() => removeRelayPoint(region, idx)}
                                className="text-red-600 hover:text-red-800"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!region && (
                    <p className="text-xs text-gray-500">Sélectionnez d'abord une région</p>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            {mode === 'login' ? (
              <button onClick={handleLogin} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Connexion</button>
            ) : (
              <button onClick={handleRegister} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">Créer</button>
            )}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="px-4 py-2 rounded border">{mode === 'login' ? 'Créer un compte' : 'J\'ai déjà un compte'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
