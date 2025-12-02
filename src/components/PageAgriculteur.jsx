import React, { useState, useEffect } from 'react';
import { PRODUITS_SENEGAL, getProductImage } from '../data/produits';
import AIAssistant from './AIAssistant';
import VoicePublisher from './VoicePublisher';
import { Mic } from 'lucide-react';
import { isSpeechRecognitionAvailable } from '../services/speechService';
import { REGIONS_SENEGAL } from '../data/regions';
import firebaseAuth from '../services/firebaseAuthService';
import { getUserProfile } from '../services/firebaseService';
import PublicationPaymentModal from './PublicationPaymentModal';

const PageAgriculteur = ({ formData, setFormData, onSubmit, onNavigate, uploading, annonces }) => {
  const selectedProduct = PRODUITS_SENEGAL.find(p => p.nom === formData.produit);
  const [showAI, setShowAI] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState([]); // Régions où le produit est disponible
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const canUseVoice = isSpeechRecognitionAvailable();

  useEffect(() => {
    const loadUserProfile = async () => {
      const user = firebaseAuth.getCurrentUser();
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        if (profile && profile.relayPoints) {
          // Initialiser avec les régions qui ont des points de relais
          setSelectedRegions(Object.keys(profile.relayPoints || {}));
        }
      }
    };
    loadUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <button 
            onClick={() => onNavigate('accueil')}
            className="text-green-700 hover:text-green-900 flex items-center gap-2 font-medium"
          >
            ← Retour
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">👨‍🌾</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Publier votre produit
            </h2>
            <p className="text-gray-600 mt-2">Remplissez le formulaire ci-dessous</p>
            
            {/* Option publication vocale */}
            {canUseVoice && (
              <div className="mt-4">
                <button
                  onClick={() => setShowVoice(!showVoice)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  <Mic size={18} />
                  {showVoice ? 'Masquer' : 'Publier par vocal'}
                </button>
              </div>
            )}
          </div>

          {/* Publication vocale */}
          {showVoice && (
            <div className="mb-6">
              <VoicePublisher
                onExtractInfo={(info) => {
                  // Remplir le formulaire avec les informations extraites
                  // Les régions et points de relais ne sont pas nécessaires pour la publication vocale
                  setFormData({
                    produit: info.produit || formData.produit,
                    quantite: info.quantite || formData.quantite,
                    unite: info.unite || formData.unite,
                    prix: info.prix ? info.prix.toString() : formData.prix,
                    telephone: info.telephone || formData.telephone,
                    // Conserver les régions existantes ou laisser vide (sera rempli par défaut)
                    regions: formData.regions || [],
                    relayPoints: formData.relayPoints || {}
                  });
                  setShowVoice(false);
                }}
                onClose={() => setShowVoice(false)}
              />
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Produit *
              </label>
              <select
                value={formData.produit}
                onChange={(e) => setFormData({...formData, produit: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
              >
                <option value="">Choisir un produit</option>
                {PRODUITS_SENEGAL.map(p => (
                  <option key={p.id} value={p.nom}>{p.nom}</option>
                ))}
              </select>
              
              {/* Aperçu de l'image du produit sélectionné */}
              {selectedProduct && (
                <div className="mt-4 flex justify-center">
                  <img 
                    src={getProductImage(selectedProduct.nom)} 
                    alt={selectedProduct.nom}
                    className="w-32 h-32 object-cover rounded-lg border-2 border-green-200"
                    onError={(e) => {
                      const fallbackImage = selectedProduct.image;
                      if (e.target.src !== fallbackImage) {
                        e.target.src = fallbackImage;
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Quantité *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantite}
                  onChange={(e) => setFormData({...formData, quantite: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                  placeholder="Ex: 50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Unité *
                </label>
                <select
                  value={formData.unite}
                  onChange={(e) => setFormData({...formData, unite: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                >
                  <option value="Sac">Sac</option>
                  <option value="Kg">Kg</option>
                  <option value="Tonne">Tonne</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700 font-semibold">
                  Prix (FCFA) *
                </label>
                {formData.produit && (
                  <button
                    type="button"
                    onClick={() => setShowAI(!showAI)}
                    className="text-sm text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
                  >
                    ✨ Assistant IA
                  </button>
                )}
              </div>
              <input
                type="number"
                min="1"
                value={formData.prix}
                onChange={(e) => setFormData({...formData, prix: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                placeholder="Ex: 15000"
              />
              
              {/* Assistant IA */}
              {showAI && formData.produit && (
                <div className="mt-4">
                  <AIAssistant
                    produit={formData.produit}
                    quantite={formData.quantite}
                    unite={formData.unite}
                    prix={formData.prix}
                    annonces={annonces || []}
                    onApplyPrice={(prix) => {
                      setFormData({...formData, prix: prix.toString()});
                      setShowAI(false);
                    }}
                    onClose={() => setShowAI(false)}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Numéro de téléphone *
              </label>
              <input
                type="tel"
                maxLength="9"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value.replace(/\D/g, '')})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                placeholder="Ex: 771234567"
              />
              <p className="text-sm text-gray-500 mt-1">9 chiffres sans espace</p>
            </div>

            {/* Points de relais par région */}
            {userProfile && userProfile.relayPoints && Object.keys(userProfile.relayPoints).length > 0 && (
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <label className="block text-gray-700 font-semibold mb-3">
                  Régions et points de relais pour ce produit (optionnel)
                </label>
                <p className="text-xs text-gray-600 mb-3">Sélectionnez les régions où ce produit sera disponible et les points de relais correspondants. Si vous ne sélectionnez rien, des régions par défaut seront utilisées.</p>
                
                {REGIONS_SENEGAL.map(region => {
                  const hasRelayPoints = userProfile.relayPoints[region.id] && userProfile.relayPoints[region.id].length > 0;
                  if (!hasRelayPoints) return null;
                  
                  const isSelected = formData.regions.includes(region.id);
                  
                  return (
                    <div key={region.id} className="mb-3 p-3 bg-white rounded border">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const newRegions = e.target.checked
                              ? [...formData.regions, region.id]
                              : formData.regions.filter(r => r !== region.id);
                            
                            const newRelayPoints = { ...formData.relayPoints };
                            if (e.target.checked) {
                              newRelayPoints[region.id] = userProfile.relayPoints[region.id];
                            } else {
                              delete newRelayPoints[region.id];
                            }
                            
                            setFormData({
                              ...formData,
                              regions: newRegions,
                              relayPoints: newRelayPoints
                            });
                          }}
                          className="w-4 h-4"
                        />
                        <span className="font-medium">{region.nom}</span>
                      </div>
                      
                      {isSelected && (
                        <div className="ml-6 mt-2">
                          <p className="text-xs text-gray-600 mb-1">Points de relais disponibles:</p>
                          <div className="flex flex-wrap gap-2">
                            {userProfile.relayPoints[region.id].map((point, idx) => (
                              <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                📍 {point}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {formData.regions.length === 0 && (
                  <p className="text-xs text-blue-600 mt-2">ℹ️ Aucune région sélectionnée. Des régions par défaut (Dakar, Thiès) seront utilisées lors de la publication.</p>
                )}
              </div>
            )}

            <button
              onClick={() => {
                // Vérifier que tous les champs obligatoires sont remplis avant d'ouvrir le modal de paiement
                if (!formData.produit || !formData.quantite || !formData.prix || !formData.telephone) {
                  alert('⚠️ Veuillez remplir tous les champs obligatoires (produit, quantité, prix, téléphone)');
                  return;
                }
                if (formData.telephone.length !== 9) {
                  alert('⚠️ Le numéro doit contenir 9 chiffres');
                  return;
                }
                // Les régions et points de relais sont optionnels - on peut publier sans
                setShowPaymentModal(true);
              }}
              disabled={uploading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {uploading ? '⏳ Publication en cours...' : '💳 Payer et publier mon annonce'}
            </button>

            <PublicationPaymentModal
              visible={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              onPaymentSuccess={(paymentData) => {
                // Une fois le paiement réussi, appeler onSubmit avec les données de paiement
                setShowPaymentModal(false);
                onSubmit(paymentData);
              }}
              publicationData={formData}
            />
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">💡 Autres options disponibles :</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div>📞 <strong>Appel vocal</strong> : Composez le [Numéro à venir]</div>
              <div>🎤 <strong>Message audio</strong> : Fonctionnalité bientôt disponible</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageAgriculteur;

