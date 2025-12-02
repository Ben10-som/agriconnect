import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Save, Edit2, X } from 'lucide-react';
import firebaseAuth from '../services/firebaseAuthService';
import { getUserProfile, updateUserProfile as updateUserProfileFirestore } from '../services/firebaseService';
import { REGIONS_SENEGAL } from '../data/regions';

const PageCompte = ({ onNavigate }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    region: '',
    relayPoints: {}
  });

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const profile = await getUserProfile(u.uid);
        setUserProfile(profile);
        if (profile) {
          setFormData({
            displayName: profile.displayName || u.displayName || '',
            email: profile.email || u.email || '',
            phone: profile.phone || '',
            region: profile.region || '',
            relayPoints: profile.relayPoints || {}
          });
        } else {
          setFormData({
            displayName: u.displayName || '',
            email: u.email || '',
            phone: '',
            region: '',
            relayPoints: {}
          });
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user || !userProfile) return;

    try {
      setSaving(true);
      
      // Mettre à jour le profil Firebase Auth
      await firebaseAuth.updateUserProfile({
        displayName: formData.displayName
      });

      // Mettre à jour le profil dans Firestore
      await updateUserProfileFirestore(user.uid, {
        displayName: formData.displayName,
        phone: formData.phone,
        region: formData.region,
        relayPoints: formData.relayPoints,
        updatedAt: new Date().toISOString()
      });

      // Recharger le profil
      const updatedProfile = await getUserProfile(user.uid);
      setUserProfile(updatedProfile);
      
      setEditing(false);
      alert('✅ Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur mise à jour profil', error);
      alert('❌ Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const addRelayPoint = (regionId) => {
    const point = prompt('Entrez le nom du point de relais (ex: Marché Central, Gare Routière):');
    if (point && point.trim()) {
      setFormData({
        ...formData,
        relayPoints: {
          ...formData.relayPoints,
          [regionId]: [...(formData.relayPoints[regionId] || []), point.trim()]
        }
      });
    }
  };

  const removeRelayPoint = (regionId, index) => {
    const newPoints = [...(formData.relayPoints[regionId] || [])];
    newPoints.splice(index, 1);
    setFormData({
      ...formData,
      relayPoints: {
        ...formData.relayPoints,
        [regionId]: newPoints
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à votre compte.</p>
          <button
            onClick={() => onNavigate('accueil')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <button
            onClick={() => onNavigate('accueil')}
            className="text-green-700 hover:text-green-900 flex items-center gap-2 font-medium"
          >
            ← Retour
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <User size={32} className="text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Mon Compte</h1>
                  <p className="text-green-100 text-sm sm:text-base mt-1">
                    {userProfile?.role === 'agriculteur' ? '👨‍🌾 Agriculteur' : '🛒 Acheteur'}
                  </p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all flex items-center gap-2 shadow-md"
                >
                  <Edit2 size={18} />
                  Modifier
                </button>
              )}
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Informations personnelles */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-green-600" />
                  Informations personnelles
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-white rounded-lg border border-gray-200">{formData.displayName || 'Non renseigné'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <p className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-600">{formData.email}</p>
                    <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Phone size={16} />
                      Téléphone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                        maxLength="9"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                        placeholder="771234567"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-white rounded-lg border border-gray-200">{formData.phone || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Région */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-green-600" />
                  Localisation
                </h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Région</label>
                  {editing ? (
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    >
                      <option value="">Sélectionner une région</option>
                      {REGIONS_SENEGAL.map(r => (
                        <option key={r.id} value={r.id}>{r.nom}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-4 py-2 bg-white rounded-lg border border-gray-200">
                      {formData.region ? REGIONS_SENEGAL.find(r => r.id === formData.region)?.nom : 'Non renseigné'}
                    </p>
                  )}
                </div>
              </div>

              {/* Points de relais (si agriculteur) */}
              {userProfile?.role === 'agriculteur' && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Points de relais</h2>
                  
                  {editing ? (
                    <div className="space-y-4">
                      {formData.region && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-700">
                              {REGIONS_SENEGAL.find(r => r.id === formData.region)?.nom}
                            </span>
                            <button
                              onClick={() => addRelayPoint(formData.region)}
                              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                              + Ajouter
                            </button>
                          </div>
                          {formData.relayPoints[formData.region]?.map((point, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 mb-2">
                              <span>{point}</span>
                              <button
                                onClick={() => removeRelayPoint(formData.region, idx)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {!formData.region && (
                        <p className="text-sm text-gray-500">Sélectionnez d'abord une région</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Object.keys(formData.relayPoints || {}).length > 0 ? (
                        Object.entries(formData.relayPoints).map(([regionId, points]) => (
                          <div key={regionId} className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="font-medium text-gray-700 mb-2">
                              {REGIONS_SENEGAL.find(r => r.id === regionId)?.nom}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {points.map((point, idx) => (
                                <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                  📍 {point}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">Aucun point de relais configuré</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {editing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      // Recharger les données originales
                      if (userProfile) {
                        setFormData({
                          displayName: userProfile.displayName || user.displayName || '',
                          email: userProfile.email || user.email || '',
                          phone: userProfile.phone || '',
                          region: userProfile.region || '',
                          relayPoints: userProfile.relayPoints || {}
                        });
                      }
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageCompte;

