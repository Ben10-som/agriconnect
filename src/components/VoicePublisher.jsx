import React, { useState } from 'react';
import { Mic, MicOff, Check, X, AlertCircle } from 'lucide-react';

const VoicePublisher = ({ onExtractInfo, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [language, setLanguage] = useState('fr-FR'); // 'fr-FR' ou 'wo-SN'

  const handleStartRecording = async () => {
    try {
      setError('');
      setTranscript('');
      setExtractedInfo(null);
      setIsRecording(true);

      // Importer dynamiquement les services
      const { startVoiceRecording, translateWolofToFrench } = await import('../services/speechService');
      const { smartExtractInfo } = await import('../services/aiExtractionService');

      // Démarrer l'enregistrement
      const transcribedText = await startVoiceRecording(language);
      setTranscript(transcribedText);
      setTranslatedText('');

      // Si c'est en wolof, traduire d'abord
      let textToExtract = transcribedText;
      if (language === 'wo-SN') {
        setIsTranslating(true);
        try {
          const translated = await translateWolofToFrench(transcribedText);
          setTranslatedText(translated);
          textToExtract = translated;
          console.log('✅ Texte traduit du wolof:', translated);
        } catch (translateError) {
          console.error('Erreur lors de la traduction:', translateError);
          // Continuer avec le texte original si la traduction échoue
        } finally {
          setIsTranslating(false);
        }
      }

      // Extraire les informations avec IA (peut être async si OpenAI est utilisé)
      setIsExtracting(true);
      try {
        const info = await smartExtractInfo(textToExtract);
        setExtractedInfo(info);
      } catch (extractError) {
        console.error('Erreur lors de l\'extraction:', extractError);
        setError('Erreur lors de l\'extraction des informations. Réessayez.');
      } finally {
        setIsExtracting(false);
      }

      // Si toutes les infos sont présentes, proposer de les utiliser
      if (info.produit && info.quantite && info.prix && info.telephone) {
        // Auto-confirmer si tout est bon
      }
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement vocal');
    } finally {
      setIsRecording(false);
    }
  };

  const handleUseExtractedInfo = () => {
    if (extractedInfo && onExtractInfo) {
      onExtractInfo(extractedInfo);
      if (onClose) onClose();
    }
  };

  const handleRetry = () => {
    setTranscript('');
    setExtractedInfo(null);
    setError('');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
          <Mic className="text-blue-600" size={24} />
          Publication vocale
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Sélection de langue */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Langue de l'enregistrement :
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="language"
                value="fr-FR"
                checked={language === 'fr-FR'}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-4 h-4"
              />
              <span>Français</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="language"
                value="wo-SN"
                checked={language === 'wo-SN'}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-4 h-4"
              />
              <span>Wolof</span>
            </label>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Instructions :</strong>
          </p>
          {language === 'fr-FR' ? (
            <>
              <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Dites le nom du produit (ex: "Oignon", "Tomate")</li>
                <li>Mentionnez la quantité et l'unité (ex: "50 sacs", "100 kilos")</li>
                <li>Indiquez le prix (ex: "15000 FCFA", "15 mille francs")</li>
                <li>Donnez votre numéro de téléphone (ex: "771234567")</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2 italic">
                Exemple : "Je vends 50 sacs d'oignons à 15000 FCFA. Mon numéro est 771234567"
              </p>
            </>
          ) : (
            <>
              <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Wax ci Wolof : turu mbokk (ex: "Sob", "Tamaat")</li>
                <li>Wax jëmm ak yoon (ex: "50 sako", "100 kilo")</li>
                <li>Wax jëf (ex: "15000 FCFA", "15 junni")</li>
                <li>Wax nataalub tëlifon (ex: "771234567")</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2 italic">
                Exemple : "Damaa jënd 50 sako soob ci 15000 FCFA. Nataalub tëlifon bi mooy 771234567"
              </p>
              <p className="text-xs text-blue-500 mt-2">
                💡 Le texte sera automatiquement traduit en français avant l'extraction
              </p>
            </>
          )}
        </div>

        {/* Bouton d'enregistrement */}
        {!transcript && (
          <div className="text-center">
            <button
              onClick={handleStartRecording}
              disabled={isRecording}
              className={`w-full py-4 rounded-lg font-bold text-lg transition shadow-md ${
                isRecording
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="inline mr-2 animate-pulse" size={20} />
                  Enregistrement en cours... Parlez maintenant
                </>
              ) : (
                <>
                  <Mic className="inline mr-2" size={20} />
                  🎤 Cliquez pour parler
                </>
              )}
            </button>
          </div>
        )}

        {/* Transcription */}
        {transcript && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Texte transcrit ({language === 'wo-SN' ? 'Wolof' : 'Français'}) :
              </p>
              <p className="text-gray-800 italic">"{transcript}"</p>
            </div>

            {/* Traduction (si wolof) */}
            {language === 'wo-SN' && (
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                {isTranslating ? (
                  <div className="text-sm text-green-600 flex items-center gap-2">
                    <div className="animate-spin">⏳</div>
                    <span>Traduction en cours...</span>
                  </div>
                ) : translatedText ? (
                  <>
                    <p className="text-sm font-semibold text-green-800 mb-2">Texte traduit (Français) :</p>
                    <p className="text-green-900 italic">"{translatedText}"</p>
                  </>
                ) : null}
              </div>
            )}

            {isExtracting && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 flex items-center gap-2">
                  <div className="animate-spin">⏳</div>
                  <span>Extraction des informations avec IA...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informations extraites */}
        {extractedInfo && (
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <p className="text-sm font-semibold text-green-800 mb-3">Informations détectées :</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Produit :</span>
                <span className={extractedInfo.produit ? 'text-green-600 font-bold' : 'text-red-600'}>
                  {extractedInfo.produit || '❌ Non détecté'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Quantité :</span>
                <span className={extractedInfo.quantite ? 'text-green-600 font-bold' : 'text-red-600'}>
                  {extractedInfo.quantite ? `${extractedInfo.quantite} ${extractedInfo.unite}` : '❌ Non détecté'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Prix :</span>
                <span className={extractedInfo.prix ? 'text-green-600 font-bold' : 'text-red-600'}>
                  {extractedInfo.prix ? `${extractedInfo.prix.toLocaleString()} FCFA` : '❌ Non détecté'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Téléphone :</span>
                <span className={extractedInfo.telephone ? 'text-green-600 font-bold' : 'text-red-600'}>
                  {extractedInfo.telephone || '❌ Non détecté'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              {extractedInfo.produit && extractedInfo.quantite && extractedInfo.prix && extractedInfo.telephone ? (
                <button
                  onClick={handleUseExtractedInfo}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Utiliser ces informations
                </button>
              ) : (
                <div className="flex-1 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-yellow-600 mt-0.5" size={18} />
                    <p className="text-sm text-yellow-800">
                      Certaines informations manquent. Vous pouvez les compléter manuellement après.
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-red-600 mt-0.5" size={18} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">Erreur</p>
                <p className="text-sm text-red-700">{error}</p>
                {error.includes('n\'est pas supportée') && (
                  <p className="text-xs text-red-600 mt-2">
                    💡 Utilisez Chrome ou Edge pour la reconnaissance vocale
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoicePublisher;

