import React, { useState, useEffect } from 'react';
import { getUserOrders, updateOrder, getUserProfile, subscribeToOrders } from '../services/firebaseService';
import { sendOrderValidation } from '../services/smsService';
import firebaseAuth from '../services/firebaseAuthService';
import { REGIONS_SENEGAL } from '../data/regions';
import MessagingModal from './MessagingModal';
import { Phone, ShoppingBag, Package, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';

const PageCommandes = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [messagingVisible, setMessagingVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [buyerProfiles, setBuyerProfiles] = useState({}); // Cache pour les profils des acheteurs

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const profile = await getUserProfile(u.uid);
        setUserProfile(profile);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const role = userProfile?.role || 'acheteur';
    
    // S'abonner aux commandes en temps réel
    const unsubscribe = subscribeToOrders(user.uid, role, async (ordersData) => {
      setOrders(ordersData);
      
      // Si c'est un agriculteur, récupérer les profils des acheteurs pour avoir leurs numéros de téléphone
      if (role === 'agriculteur') {
        const profiles = {};
        for (const order of ordersData) {
          if (order.buyerUid && !profiles[order.buyerUid]) {
            try {
              const profile = await getUserProfile(order.buyerUid);
              if (profile) {
                profiles[order.buyerUid] = profile;
              }
            } catch (error) {
              console.error('Erreur récupération profil acheteur:', error);
            }
          }
        }
        setBuyerProfiles(profiles);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userProfile]);

  const handleValidateOrder = async (order) => {
    if (!confirm('Valider cette commande ? L\'acheteur pourra alors procéder au paiement.')) {
      return;
    }

    try {
      await updateOrder(order.id, {
        farmerValidated: true,
        status: 'validated'
      });

      // Envoyer SMS à l'acheteur
      try {
        const buyerPhone = order.buyerPhone || prompt('Numéro de téléphone de l\'acheteur:');
        if (buyerPhone) {
          await sendOrderValidation(buyerPhone, {
            produit: order.produit,
            quantite: order.quantite,
            unite: order.unite,
            total: order.total,
            pickupLocation: order.pickupLocation
          });
        }
      } catch (smsError) {
        console.warn('Erreur envoi SMS (non bloquant):', smsError);
      }

      alert('✅ Commande validée ! L\'acheteur a été notifié.');
    } catch (error) {
      console.error('Erreur validation commande', error);
      alert('Erreur lors de la validation de la commande');
    }
  };

  const handleRejectOrder = async (order) => {
    const reason = prompt('Raison du refus (optionnel):');
    try {
      await updateOrder(order.id, {
        status: 'rejected',
        rejectionReason: reason || ''
      });
      alert('Commande refusée');
    } catch (error) {
      console.error('Erreur refus commande', error);
      alert('Erreur lors du refus de la commande');
    }
  };

  const getStatusBadge = (order) => {
    if (order.status === 'pending' && !order.farmerValidated) {
      return (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
          <Clock size={14} />
          En attente validation
        </span>
      );
    }
    if (order.status === 'validated' && !order.paid) {
      return (
        <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
          <CheckCircle size={14} />
          Validée - En attente paiement
        </span>
      );
    }
    if (order.status === 'paid') {
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
          <CreditCard size={14} />
          Payée
        </span>
      );
    }
    if (order.status === 'rejected') {
      return (
        <span className="bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
          <XCircle size={14} />
          Refusée
        </span>
      );
    }
    return <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">{order.status}</span>;
  };

  const getBuyerPhone = (order) => {
    // D'abord vérifier si le numéro est directement dans la commande
    if (order.buyerPhone) return order.buyerPhone;
    
    // Sinon, chercher dans le profil utilisateur
    if (order.buyerUid) {
      const buyerProfile = buyerProfiles[order.buyerUid];
      return buyerProfile?.phone || buyerProfile?.telephone || null;
    }
    
    return null;
  };

  const handleCallBuyer = (order) => {
    const phone = getBuyerPhone(order);
    if (!phone) {
      alert('⚠️ Numéro de téléphone de l\'acheteur non disponible');
      return;
    }
    
    const phoneNumber = phone.startsWith('+221') ? phone : `+221${phone}`;
    if (confirm(`Appeler ${phone} ?`)) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const isFarmer = userProfile?.role === 'agriculteur';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <button
            onClick={() => onNavigate('accueil')}
            className="text-green-700 hover:text-green-900 flex items-center gap-2 font-medium"
          >
            ← Retour
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isFarmer ? 'bg-green-100' : 'bg-purple-100'}`}>
              {isFarmer ? (
                <Package className={`${isFarmer ? 'text-green-600' : 'text-purple-600'}`} size={24} />
              ) : (
                <ShoppingBag className="text-purple-600" size={24} />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                {isFarmer ? (
                  <>
                    <Package className="text-green-600" size={28} />
                    Commandes reçues
                  </>
                ) : (
                  <>
                    <ShoppingBag className="text-purple-600" size={28} />
                    Mes commandes
                  </>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                {isFarmer ? 'Commandes que vous avez reçues' : 'Commandes que vous avez passées'}
              </p>
            </div>
          </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des commandes...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-12 text-center shadow-md border border-gray-200">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune commande</h3>
            <p className="text-gray-500">Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className={`bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border-2 ${
                isFarmer ? 'border-green-200' : 'border-purple-200'
              }`}>
                {/* En-tête avec icône de type de commande */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isFarmer ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {isFarmer ? (
                      <Package className="text-green-600" size={20} />
                    ) : (
                      <ShoppingBag className="text-purple-600" size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-800">{order.produit}</h3>
                      {getStatusBadge(order)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Quantité: {order.quantite} {order.unite}</div>
                      <div>Montant: <strong className="text-green-600">{order.total} FCFA</strong></div>
                      {order.pickupRegion && (
                        <div>
                          Région: {REGIONS_SENEGAL.find(r => r.id === order.pickupRegion)?.nom || order.pickupRegion}
                        </div>
                      )}
                      {order.pickupLocation && (
                        <div>Point de relais: <strong>{order.pickupLocation}</strong></div>
                      )}
                      {isFarmer && order.buyerName && (
                        <div className="flex items-center gap-2">
                          <span>👤 Acheteur:</span>
                          <strong>{order.buyerName}</strong>
                          {getBuyerPhone(order) && (
                            <span className="text-xs text-gray-500">({getBuyerPhone(order)})</span>
                          )}
                        </div>
                      )}
                      {!isFarmer && order.sellerPhone && (
                        <div className="flex items-center gap-2">
                          <span>👨‍🌾 Agriculteur:</span>
                          <strong>{order.sellerPhone}</strong>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        {order.createdAt?.toDate ? 
                          new Date(order.createdAt.toDate()).toLocaleString('fr-FR') :
                          new Date(order.createdAt).toLocaleString('fr-FR')
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {isFarmer && order.status === 'pending' && !order.farmerValidated && (
                  <div className="space-y-3 mt-6 pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleValidateOrder(order)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Valider la commande
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} />
                        Refuser
                      </button>
                    </div>
                    {getBuyerPhone(order) && (
                      <button
                        onClick={() => handleCallBuyer(order)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Phone size={18} />
                        Appeler l'acheteur ({getBuyerPhone(order)})
                      </button>
                    )}
                  </div>
                )}

                {order.status === 'validated' && !order.paid && !isFarmer && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800">
                      ✅ Commande validée par l'agriculteur. Vous pouvez maintenant procéder au paiement.
                    </p>
                  </div>
                )}

                {order.status === 'paid' && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
                    <p className="text-sm font-semibold text-green-800">
                      ✅ Commande payée. Récupérez votre produit au point de relais indiqué.
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setMessagingVisible(true);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    💬 Contacter {isFarmer ? "l'acheteur" : "l'agriculteur"}
                  </button>
                  
                  {/* Bouton d'appel pour l'agriculteur */}
                  {isFarmer && getBuyerPhone(order) && (
                    <button
                      onClick={() => handleCallBuyer(order)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Phone size={18} />
                      Appeler l'acheteur ({getBuyerPhone(order)})
                    </button>
                  )}
                  
                  {/* Bouton d'appel pour l'acheteur */}
                  {!isFarmer && order.sellerPhone && (
                    <a
                      href={`tel:+221${order.sellerPhone}`}
                      onClick={(e) => {
                        if (!confirm(`Appeler l'agriculteur ${order.sellerPhone} ?`)) {
                          e.preventDefault();
                        }
                      }}
                      className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-center"
                    >
                      <Phone size={18} />
                      Appeler l'agriculteur ({order.sellerPhone})
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>

        <MessagingModal
          visible={messagingVisible}
          order={selectedOrder}
          onClose={() => {
            setMessagingVisible(false);
            setSelectedOrder(null);
          }}
        />
      </div>
    </div>
  );
};

export default PageCommandes;

