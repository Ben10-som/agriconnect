import React, { useState } from 'react';
import { addOrder, updateOrder } from '../services/firebaseService';
import firebaseAuth from '../services/firebaseAuthService';
import { sendOrderNotification } from '../services/smsService';
import { processPayment } from '../services/paymentService';
import { REGIONS_SENEGAL } from '../data/regions';

const OrderModal = ({ visible, annonce, onClose, onOrderCreated }) => {
  const [quantite, setQuantite] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPickupPoint, setSelectedPickupPoint] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('order'); // 'order' | 'payment' | 'success'
  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('orange_money');
  const user = firebaseAuth.getCurrentUser();

  if (!visible || !annonce) return null;

  const total = (annonce.prix || 0) * quantite;
  
  // Récupérer les régions disponibles pour cette annonce
  const availableRegions = annonce.regions || [];
  const relayPointsByRegion = annonce.relayPoints || {};
  
  // Points de relais disponibles pour la région sélectionnée
  const availablePickupPoints = selectedRegion ? (relayPointsByRegion[selectedRegion] || []) : [];

  const handleCreateOrder = async () => {
    if (!user) {
      alert('Vous devez être connecté pour passer une commande.');
      return;
    }

    // Les régions et points de relais sont maintenant optionnels
    // Si non sélectionnés, on utilisera des valeurs par défaut

    if (quantite > annonce.quantite) {
      alert(`⚠️ La quantité demandée (${quantite}) dépasse la quantité disponible (${annonce.quantite})`);
      return;
    }

    try {
      setLoading(true);
      
      // Récupérer le numéro de téléphone de l'acheteur depuis son profil
      let buyerPhone = null;
      try {
        const { getUserProfile } = await import('../services/firebaseService');
        const buyerProfile = await getUserProfile(user.uid);
        buyerPhone = buyerProfile?.phone || buyerProfile?.telephone || null;
      } catch (error) {
        console.warn('Impossible de récupérer le numéro de téléphone de l\'acheteur:', error);
      }
      
      const order = {
        annonceId: annonce.id,
        produit: annonce.produit,
        sellerPhone: annonce.telephone,
        sellerUid: annonce.createdBy?.uid || null,
        buyerUid: user.uid,
        buyerName: user.displayName || user.email,
        buyerEmail: user.email || null,
        buyerPhone: buyerPhone, // Ajouter le numéro de téléphone de l'acheteur
        quantite,
        unite: annonce.unite,
        pickupRegion: selectedRegion || 'dakar', // Par défaut Dakar si non sélectionné
        pickupLocation: selectedPickupPoint || 'À définir avec l\'agriculteur',
        total,
        paid: false,
        status: 'pending',
        farmerValidated: false
      };

      const created = await addOrder(order);
      setOrderId(created.id);

      // Envoyer SMS à l'agriculteur
      try {
        await sendOrderNotification(annonce.telephone, {
          produit: annonce.produit,
          quantite,
          unite: annonce.unite,
          total,
          buyerName: user.displayName || user.email,
          pickupLocation: selectedPickupPoint
        });
      } catch (smsError) {
        console.warn('Erreur envoi SMS (non bloquant):', smsError);
      }

      // La commande est créée, proposer le paiement optionnel
      alert('✅ Commande créée avec succès ! L\'agriculteur a été notifié par SMS. Vous pouvez maintenant procéder au paiement si vous le souhaitez.');
      setPaymentStep('payment');
      onOrderCreated && onOrderCreated(created);
    } catch (error) {
      console.error('Erreur création commande', error);
      alert('Erreur lors de la création de la commande');
    } finally { setLoading(false); }
  };

  const handlePayment = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      
      // Traiter le paiement
      const paymentResult = await processPayment(
        orderId,
        total,
        user.phoneNumber || '',
        paymentMethod
      );

      if (paymentResult.success) {
        // Mettre à jour la commande
        await updateOrder(orderId, {
          paid: true,
          status: 'paid',
          paymentTransactionId: paymentResult.transactionId,
          paymentMethod: paymentMethod,
          paidAt: new Date().toISOString()
        });

        setPaymentStep('success');
      } else {
        alert('❌ Le paiement a échoué. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur paiement', error);
      alert('Erreur lors du paiement: ' + (error.message || 'Erreur inconnue'));
    } finally { setLoading(false); }
  };

  if (paymentStep === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-bold text-lg mb-2">Paiement réussi !</h3>
            <p className="text-gray-600 mb-4">
              Votre commande a été créée et le paiement a été effectué avec succès.
              L'agriculteur a été notifié par SMS et validera votre commande.
            </p>
            <button 
              onClick={onClose} 
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'payment') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Paiement (Optionnel)</h3>
            <button onClick={onClose} className="text-gray-500">Fermer</button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>ℹ️ Note :</strong> Le paiement est optionnel. Vous pouvez payer maintenant ou plus tard. La commande a déjà été envoyée à l'agriculteur.
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Montant à payer</div>
              <div className="text-2xl font-bold text-green-600">{total} FCFA</div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Méthode de paiement</label>
              <select 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="orange_money">Orange Money</option>
                <option value="free_money">Free Money</option>
                <option value="tigo_cash">Tigo Cash</option>
                <option value="wave">Wave</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={onClose} 
                className="flex-1 border rounded px-4 py-2 hover:bg-gray-50"
              >
                Payer plus tard
              </button>
              <button 
                onClick={handlePayment} 
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
              >
                {loading ? 'Traitement...' : 'Payer maintenant'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Commander: {annonce.produit}</h3>
          <button onClick={onClose} className="text-gray-500">Fermer</button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <img src={annonce.image} alt="" className="w-24 h-24 object-cover rounded" />
            <div>
              <div className="font-semibold">{annonce.produit}</div>
              <div className="text-sm text-gray-600">Prix unitaire: {annonce.prix} FCFA</div>
              <div className="text-sm text-gray-600">Disponible: {annonce.quantite} {annonce.unite}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Quantité *</label>
            <input 
              type="number" 
              value={quantite} 
              min={1} 
              max={annonce.quantite || 9999} 
              onChange={(e)=>setQuantite(parseInt(e.target.value)||1)} 
              className="w-32 border rounded p-2" 
            />
            <span className="text-xs text-gray-500 ml-2">{annonce.unite}</span>
          </div>

          {availableRegions.length > 0 ? (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1">Région (optionnel)</label>
                <select 
                  value={selectedRegion} 
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setSelectedPickupPoint(''); // Réinitialiser le point de relais
                  }}
                  className="w-full border rounded p-2"
                >
                  <option value="">Sélectionner une région (optionnel)</option>
                  {availableRegions.map(regionId => {
                    const region = REGIONS_SENEGAL.find(r => r.id === regionId);
                    if (!region) return null;
                    return (
                      <option key={regionId} value={regionId}>{region.nom}</option>
                    );
                  })}
                </select>
              </div>

              {selectedRegion && availablePickupPoints.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Point de relais (optionnel)</label>
                  <select 
                    value={selectedPickupPoint} 
                    onChange={(e) => setSelectedPickupPoint(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Sélectionner un point de relais (optionnel)</option>
                    {availablePickupPoints.map((point, idx) => (
                      <option key={idx} value={point}>📍 {point}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
              ℹ️ Aucun point de relais configuré pour cette annonce. Vous pouvez passer la commande et contacter l'agriculteur directement par téléphone.
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-2xl font-bold text-green-600">{total} FCFA</div>
              </div>
            </div>
            <button 
              onClick={handleCreateOrder} 
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création de la commande...' : 'Créer la commande'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
