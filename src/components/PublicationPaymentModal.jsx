import React, { useState } from 'react';
import { processPayment } from '../services/paymentService';
import firebaseAuth from '../services/firebaseAuthService';

const PublicationPaymentModal = ({ visible, onClose, onPaymentSuccess, publicationData }) => {
  const [paymentMethod, setPaymentMethod] = useState('orange_money');
  const [loading, setLoading] = useState(false);
  const user = firebaseAuth.getCurrentUser();

  // Prix fixe pour la publication d'une annonce
  const PUBLICATION_FEE = 250;

  if (!visible) return null;

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Traiter le paiement
      const paymentResult = await processPayment(
        `PUB_${Date.now()}`,
        PUBLICATION_FEE,
        user?.phoneNumber || '',
        paymentMethod
      );

      if (paymentResult.success) {
        // Appeler le callback avec les données de paiement
        onPaymentSuccess({
          ...paymentResult,
          publicationData
        });
        onClose();
      } else {
        alert('❌ Le paiement a échoué. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur paiement', error);
      alert('Erreur lors du paiement: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Paiement pour la publication</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Frais de publication</div>
            <div className="text-3xl font-bold text-green-600">{PUBLICATION_FEE} FCFA</div>
            <div className="text-xs text-gray-500 mt-2">
              Ce paiement permet de publier votre annonce sur la plateforme
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Méthode de paiement *</label>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="orange_money">Orange Money</option>
              <option value="free_money">Free Money</option>
              <option value="tigo_cash">Tigo Cash</option>
              <option value="wave">Wave</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <strong>ℹ️ Note :</strong> Après le paiement, votre annonce sera automatiquement publiée sur la plateforme.
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 font-semibold hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              onClick={handlePayment} 
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Traitement...' : `💳 Payer ${PUBLICATION_FEE} FCFA`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationPaymentModal;

