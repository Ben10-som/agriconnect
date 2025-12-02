import React, { useEffect, useState } from 'react';
import { Upload, Phone } from 'lucide-react';
import OrderModal from './OrderModal';
import firebaseAuth from '../services/firebaseAuthService';
import { getUserProfile } from '../services/firebaseService';
import { REGIONS_SENEGAL } from '../data/regions';
import { PRODUITS_SENEGAL } from '../data/produits';

const PageAccueil = ({ onNavigate, annonces = [], loading = false, user: userProp }) => {
  const [orderVisible, setOrderVisible] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [user, setUser] = useState(userProp);
  const [userProfile, setUserProfile] = useState(null);
  const [filteredAnnonces, setFilteredAnnonces] = useState([]);

  useEffect(() => {
    setUser(userProp);
  }, [userProp]);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid)
        .then(profile => {
          setUserProfile(profile);
        })
        .catch(error => {
          console.error('❌ Erreur lors de la récupération du profil:', error);
          setUserProfile(null);
        });
    } else {
      setUserProfile(null);
    }
  }, [user]);

  // Filtrer les annonces par région de l'utilisateur
  useEffect(() => {
    if (annonces.length === 0) {
      setFilteredAnnonces([]);
      return;
    }

    if (!userProfile || !userProfile.region) {
      // Si pas de région, afficher toutes les annonces
      setFilteredAnnonces(annonces);
      return;
    }

    // Séparer les annonces de la région de l'utilisateur et les autres
    const userRegionAnnonces = [];
    const otherAnnonces = [];

    annonces.forEach(annonce => {
      if (!annonce || !annonce.id) return; // Ignorer les annonces invalides
      const hasUserRegion = annonce.regions && annonce.regions.includes(userProfile.region);
      if (hasUserRegion) {
        userRegionAnnonces.push(annonce);
      } else {
        otherAnnonces.push(annonce);
      }
    });

    // Afficher d'abord les annonces de la région de l'utilisateur
    setFilteredAnnonces([...userRegionAnnonces, ...otherAnnonces]);
  }, [annonces, userProfile]);

  const openOrder = (annonce) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    setSelectedAnnonce(annonce);
    setOrderVisible(true);
  };

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Chargement des annonces...</p>
          <p className="text-sm text-gray-500 mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Hero Section */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
            Bienvenue sur IZZI
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            La plateforme qui connecte les agriculteurs et les acheteurs au Sénégal
          </p>
        </div>

        {userProfile && userProfile.region && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-semibold text-blue-900">Produits de votre région</p>
                <p className="text-sm text-blue-700">
                  Affichage prioritaire des produits de la région: <strong>{REGIONS_SENEGAL.find(r => r.id === userProfile.region)?.nom || userProfile.region}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Produits disponibles</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Liste des annonces */}
          {filteredAnnonces.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune annonce disponible</h3>
                <p className="text-gray-600">Il n'y a pas encore d'annonces publiées sur la plateforme.</p>
              </div>
            </div>
          ) : (
            filteredAnnonces.map((a) => {
              if (!a || !a.id) return null; // Protection contre les annonces invalides
              const isUserRegion = userProfile && userProfile.region && a.regions && a.regions.includes(userProfile.region);
              return (
                <div 
                  key={a.id} 
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1 ${isUserRegion ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
                >
                  {isUserRegion && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                      📍 Votre région
                    </div>
                  )}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={a.image} 
                      alt={a.produit} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        const produitData = PRODUITS_SENEGAL.find(p => p.nom === a.produit);
                        if (produitData && produitData.image && e.target.src !== produitData.image) {
                          e.target.src = produitData.image;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-800 mb-2">{a.produit}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="bg-gray-100 px-2 py-1 rounded">{a.quantite || 0} {a.unite || ''}</span>
                        <span>•</span>
                        <span>
                          {a.date ? (a.date instanceof Date ? a.date.toLocaleDateString('fr-FR') : new Date(a.date).toLocaleDateString('fr-FR')) : 'Date inconnue'}
                        </span>
                      </div>
                      {a.regions && a.regions.length > 0 && (
                        <div className="text-xs text-gray-500 mb-3 flex flex-wrap gap-1">
                          {a.regions.slice(0, 2).map(r => {
                            const region = REGIONS_SENEGAL.find(reg => reg.id === r);
                            return region ? (
                              <span key={r} className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {region.nom}
                              </span>
                            ) : null;
                          })}
                          {a.regions.length > 2 && (
                            <span className="text-gray-400">+{a.regions.length - 2}</span>
                          )}
                        </div>
                      )}
                      <div className="mt-3 mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          {typeof a.prix === 'number' ? a.prix.toLocaleString() : a.prix || '0'}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">FCFA</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button 
                        onClick={() => openOrder(a)} 
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                      >
                        Commander
                      </button>
                      <a 
                        href={`tel:+221${a.telephone}`}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                        onClick={(e) => {
                          if (!confirm(`Appeler ${a.telephone} ?`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        📞
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Section fonctionnalités */}
        <div className="mt-16 mb-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Comment publier vos produits ?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-blue-600" size={28} />
              </div>
              <h4 className="font-bold text-lg mb-2">Téléphone simple</h4>
              <p className="text-gray-600 text-sm">Appel vocal automatisé</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎤</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Message audio</h4>
              <p className="text-gray-600 text-sm">Pour non-alphabétisés</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-green-600" size={28} />
              </div>
              <h4 className="font-bold text-lg mb-2">Formulaire web</h4>
              <p className="text-gray-600 text-sm">Saisie directe</p>
            </div>
          </div>
        </div>
      </div>

      <OrderModal visible={orderVisible} annonce={selectedAnnonce} onClose={() => setOrderVisible(false)} onOrderCreated={(o)=>{ console.log('order', o); }} />
    </div>
  );
};

export default PageAccueil;





