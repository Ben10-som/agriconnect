import React, { useState, useEffect } from 'react';
import { User, Package, ShoppingBag, LogOut, Menu, X, Bell } from 'lucide-react';
import firebaseAuth from '../services/firebaseAuthService';
import { getUserProfile } from '../services/firebaseService';
import Notifications from './Notifications';

const Navigation = ({ user, onNavigate, onSignOut, annonces = [] }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [myAnnoncesCount, setMyAnnoncesCount] = useState(0);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(profile => setUserProfile(profile));
    }
  }, [user]);

  // Compter les annonces de l'utilisateur
  useEffect(() => {
    if (user && annonces.length > 0) {
      const count = annonces.filter(a => {
        if (!a || !a.createdBy) return false;
        return a.createdBy.uid === user.uid || a.createdBy.email === user.email;
      }).length;
      setMyAnnoncesCount(count);
    } else {
      setMyAnnoncesCount(0);
    }
  }, [user, annonces]);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et nom */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('accueil')}
          >
            <img 
              src="/images/logo.jpg" 
              alt="IZZI Logo" 
              className="w-10 h-10 object-contain rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                IZZI
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Plateforme agricole</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('agriculteur')}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  📢 Publier
                </button>

                <button
                  onClick={() => onNavigate('mesannonces')}
                  className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all flex items-center gap-2 relative"
                >
                  <Package size={18} />
                  Mes annonces
                  {myAnnoncesCount > 0 && (
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                      {myAnnoncesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onNavigate('commandes')}
                  className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Mes commandes
                </button>

                <Notifications onNavigate={onNavigate} />

                {/* Menu Compte */}
                <div className="relative">
                  <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all"
                  >
                    <User size={18} />
                    <span className="hidden lg:inline">{user.displayName || user.email?.split('@')[0]}</span>
                    <span className="lg:hidden">Compte</span>
                  </button>

                  {showAccountMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowAccountMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">{user.displayName || 'Utilisateur'}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          {userProfile && (
                            <p className="text-xs text-green-600 mt-1">
                              {userProfile.role === 'agriculteur' ? '👨‍🌾 Agriculteur' : '🛒 Acheteur'}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setShowAccountMenu(false);
                            onNavigate('compte');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all flex items-center gap-2"
                        >
                          <User size={16} />
                          Mon compte
                        </button>
                        <button
                          onClick={() => {
                            setShowAccountMenu(false);
                            onSignOut();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Se déconnecter
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  // Ouvrir modal auth - sera géré par le parent
                  onNavigate('login');
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                Se connecter
              </button>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-700 hover:text-green-600"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile déroulant */}
        {showMobileMenu && user && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onNavigate('agriculteur');
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg"
            >
              📢 Publier une annonce
            </button>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onNavigate('mesannonces');
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg flex items-center gap-2 relative"
            >
              <Package size={18} />
              Mes annonces
              {myAnnoncesCount > 0 && (
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                  {myAnnoncesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onNavigate('commandes');
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              Mes commandes
            </button>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onNavigate('compte');
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg flex items-center gap-2"
            >
              <User size={18} />
              Mon compte
            </button>
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onSignOut();
              }}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
            >
              <LogOut size={18} />
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

