// Service pour la reconnaissance vocale et transcription

/**
 * Démarrer l'enregistrement vocal et obtenir la transcription
 * @param {string} language - Langue de reconnaissance ('fr-FR' ou 'wo-SN' pour wolof)
 * @returns {Promise<string>} Le texte transcrit
 */
export const startVoiceRecording = (language = 'fr-FR') => {
  return new Promise((resolve, reject) => {
    // Vérifier si l'API Speech Recognition est disponible
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      reject(new Error('La reconnaissance vocale n\'est pas supportée par votre navigateur. Utilisez Chrome ou Edge.'));
      return;
    }

    const recognition = new SpeechRecognition();
    // Support du wolof (wo-SN) ou français (fr-FR)
    // Note: Le wolof n'est pas toujours supporté nativement, on utilisera 'fr-FR' comme fallback
    recognition.lang = language === 'wo-SN' ? 'fr-FR' : language; // Fallback sur français si wolof non supporté
    recognition.continuous = false; // Arrêter après une pause
    recognition.interimResults = false; // Résultats finaux uniquement
    recognition.maxAlternatives = 1;

    let transcript = '';

    recognition.onresult = (event) => {
      transcript = event.results[0][0].transcript;
      console.log('📝 Transcription:', transcript);
    };

    recognition.onerror = (event) => {
      console.error('❌ Erreur de reconnaissance vocale:', event.error);
      reject(new Error(`Erreur: ${event.error}`));
    };

    recognition.onend = () => {
      if (transcript) {
        resolve(transcript);
      } else {
        reject(new Error('Aucun texte n\'a été transcrit. Veuillez réessayer.'));
      }
    };

    // Démarrer la reconnaissance
    console.log('🎤 Démarrage de l\'enregistrement vocal...');
    recognition.start();
  });
};

/**
 * Vérifier si la reconnaissance vocale est disponible
 */
export const isSpeechRecognitionAvailable = () => {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

/**
 * Traduire du wolof vers le français avec OpenAI
 * @param {string} wolofText - Texte en wolof
 * @returns {Promise<string>} Texte traduit en français
 */
export const translateWolofToFrench = async (wolofText) => {
  try {
    const { AI_CONFIG, callAIAPI } = await import('../config/ai');
    
    if (!AI_CONFIG.apiKey || AI_CONFIG.useLocalAI) {
      // Si pas d'OpenAI, retourner le texte tel quel
      console.warn('⚠️ OpenAI non configuré, traduction non disponible');
      return wolofText;
    }

    const systemPrompt = `Tu es un traducteur expert du wolof vers le français.
Traduis le texte wolof en français de manière précise et naturelle.
Réponds UNIQUEMENT avec la traduction en français, sans explications.`;

    const translation = await callAIAPI(
      `Traduis ce texte wolof en français : "${wolofText}"`,
      systemPrompt
    );

    return translation.trim();
  } catch (error) {
    console.error('Erreur lors de la traduction:', error);
    // En cas d'erreur, retourner le texte original
    return wolofText;
  }
};

