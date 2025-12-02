import React, { useState } from 'react';
import { Sparkles, TrendingUp, Lightbulb, X } from 'lucide-react';
import { getPriceRecommendation } from '../config/ai';

const AIAssistant = ({ produit, quantite, unite, prix, annonces, onApplyPrice, onClose }) => {
  const [activeTab, setActiveTab] = useState('price'); // 'price' ou 'tips'
  const [priceRecommendation, setPriceRecommendation] = useState(null);

  React.useEffect(() => {
    if (produit && quantite && unite && annonces.length > 0) {
      const recommendation = getPriceRecommendation(produit, parseInt(quantite) || 0, unite, annonces);
      setPriceRecommendation(recommendation);
    } else {
      setPriceRecommendation(null);
    }
  }, [produit, quantite, unite, annonces]);

  if (!produit) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600" size={24} />
          <h3 className="text-xl font-bold text-purple-800">Assistant IA</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-4 border-b border-purple-200">
        <button
          onClick={() => setActiveTab('price')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'price'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          <TrendingUp className="inline mr-2" size={16} />
          Prix recommandé
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'tips'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          <Lightbulb className="inline mr-2" size={16} />
          Conseils
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'price' && (
        <div>
          {priceRecommendation ? (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Prix recommandé :</span>
                  <span className="text-2xl font-bold text-green-600">
                    {priceRecommendation.prixRecommande.toLocaleString()} FCFA
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Basé sur {priceRecommendation.nombreAnnonces} annonce(s) similaire(s)
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-gray-500 text-xs">Minimum</div>
                  <div className="font-semibold text-red-600">
                    {priceRecommendation.prixMin.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-gray-500 text-xs">Moyen</div>
                  <div className="font-semibold text-blue-600">
                    {priceRecommendation.prixMoyen.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-gray-500 text-xs">Maximum</div>
                  <div className="font-semibold text-green-600">
                    {priceRecommendation.prixMax.toLocaleString()}
                  </div>
                </div>
              </div>

              {onApplyPrice && (
                <button
                  onClick={() => onApplyPrice(priceRecommendation.prixRecommande)}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  ✨ Appliquer le prix recommandé
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Pas assez de données pour recommander un prix.</p>
              <p className="text-sm mt-2">Publiez votre annonce pour enrichir les données !</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-400">
            <h4 className="font-semibold text-gray-800 mb-2">💡 Conseil de prix</h4>
            <p className="text-sm text-gray-600">
              Pour vendre plus rapidement, proposez un prix légèrement en dessous de la moyenne du marché.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-400">
            <h4 className="font-semibold text-gray-800 mb-2">📊 Quantité</h4>
            <p className="text-sm text-gray-600">
              Les grandes quantités peuvent être vendues avec une légère réduction (5-10%) pour attirer les acheteurs en gros.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
            <h4 className="font-semibold text-gray-800 mb-2">⏰ Timing</h4>
            <p className="text-sm text-gray-600">
              Les produits frais se vendent mieux le matin. Publiez vos annonces tôt dans la journée.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;





