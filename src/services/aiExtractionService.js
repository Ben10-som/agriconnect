// Service pour extraire les informations structurées du texte transcrit avec IA

/**
 * Extraire les informations d'une annonce depuis un texte transcrit
 * @param {string} text - Le texte transcrit
 * @returns {Object} Les informations extraites
 */
export const extractAnnouncementInfo = (text) => {
  // Normaliser le texte
  const normalizedText = text.toLowerCase().trim();
  
  // Produits disponibles
  const produits = [
    'oignon', 'oignons',
    'tomate', 'tomates',
    'mil',
    'arachide', 'arachides',
    'manioc',
    'mangue', 'mangues',
    'bissap',
    'pastèque', 'pasteque', 'pastèques'
  ];

  // Extraire le produit
  let produit = null;
  for (const p of produits) {
    if (normalizedText.includes(p)) {
      // Mapper vers le nom correct
      const mapping = {
        'oignon': 'Oignon', 'oignons': 'Oignon',
        'tomate': 'Tomate', 'tomates': 'Tomate',
        'mil': 'Mil',
        'arachide': 'Arachide', 'arachides': 'Arachide',
        'manioc': 'Manioc',
        'mangue': 'Mangue', 'mangues': 'Mangue',
        'bissap': 'Bissap',
        'pastèque': 'Pastèque', 'pasteque': 'Pastèque', 'pastèques': 'Pastèque'
      };
      produit = mapping[p];
      break;
    }
  }

  // Extraire la quantité (chercher des nombres)
  const quantiteMatch = normalizedText.match(/(\d+)\s*(sac|kg|kilogramme|tonne|tonnes|kilo|kilos)/i);
  let quantite = null;
  let unite = 'Sac';
  
  if (quantiteMatch) {
    quantite = quantiteMatch[1];
    const uniteText = quantiteMatch[2].toLowerCase();
    if (uniteText.includes('tonne')) {
      unite = 'Tonne';
    } else if (uniteText.includes('kg') || uniteText.includes('kilo')) {
      unite = 'Kg';
    } else {
      unite = 'Sac';
    }
  } else {
    // Chercher juste un nombre
    const nombreMatch = normalizedText.match(/(\d+)/);
    if (nombreMatch) {
      quantite = nombreMatch[1];
    }
  }

  // Extraire le prix (chercher "fcfa", "franc", "mille", etc.)
  let prix = null;
  
  // Extraire tous les nombres du texte pour analyse
  const allNumbers = normalizedText.match(/\d+/g) || [];
  const numbers = allNumbers.map(n => parseInt(n));
  
  // MÉTHODE 1: Chercher tous les nombres suivis de "franc" en triant par taille (du plus grand au plus petit)
  // Cette méthode évite de capturer "15" dans "15000 francs"
  const prixCandidates = [];
  
  // Trier les nombres par taille décroissante pour traiter les grands nombres en premier
  const sortedNumbers = [...numbers].sort((a, b) => b - a);
  
  // Chercher tous les nombres suivis de "franc" ou "fcfa"
  for (const num of sortedNumbers) {
    const numStr = num.toString();
    // Utiliser une regex pour trouver toutes les occurrences et vérifier le contexte
    const regex = new RegExp(`\\b${numStr}\\b`, 'g');
    let match;
    
    while ((match = regex.exec(normalizedText)) !== null) {
      const numIndex = match.index;
      // Vérifier si "franc" ou "fcfa" est proche (dans les 20 caractères suivants)
      const textAfter = normalizedText.substring(numIndex + numStr.length, numIndex + numStr.length + 20);
      if (textAfter.match(/\s*(?:fcfa|franc|francs|f)(?:\s|$|,|\.)/i)) {
        // Exclure la quantité et le téléphone
        if (quantite && num === parseInt(quantite)) continue;
        if (num.toString().length === 9 && (num.toString().startsWith('7') || num.toString().startsWith('8'))) continue;
        
        if (num >= 100 && num <= 10000000) {
          prixCandidates.push(num);
          break; // Prendre seulement la première occurrence valide
        }
      }
    }
  }
  
  // Prendre le plus grand nombre trouvé (probablement le prix)
  if (prixCandidates.length > 0) {
    prix = Math.max(...prixCandidates);
  }
  
  // MÉTHODE 2: Chercher les patterns spécifiques (si pas trouvé avec méthode 1)
  if (!prix) {
    const prixPatterns = [
      // "15 mille francs" ou "15 mil francs" - PRIORITÉ 1
      /(\d+)\s*(?:mille|mil)\s*(?:fcfa|franc|francs|f)/i,
      // "à 15000" ou "prix 15000" - PRIORITÉ 2
      /(?:à|prix|cout|coût)[:\s]+(\d{4,})/i,
      // "15 mille" ou "15 mil" (sans unité) - PRIORITÉ 3
      /(\d+)\s*(?:mille|mil)(?:\s|$|,|\.)/i,
    ];

    for (const pattern of prixPatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        let prixValue = parseInt(match[1]);
        
        // Si le pattern contient "mille" ou "mil", multiplier par 1000
        const matchText = match[0].toLowerCase();
        if (matchText.includes('mille') || matchText.includes('mil')) {
          prixValue = prixValue * 1000;
        }
        
        // Vérifier que le prix est raisonnable (entre 100 et 10 000 000 FCFA)
        if (prixValue >= 100 && prixValue <= 10000000) {
          prix = prixValue;
          break;
        }
      }
    }
  }
  
  // MÉTHODE 3: Dernier recours - chercher le plus grand nombre (sauf quantité et téléphone)
  if (!prix && numbers.length > 0) {
    const possiblePrix = numbers.filter(n => {
      // Exclure la quantité (déjà détectée)
      if (quantite && n === parseInt(quantite)) return false;
      // Exclure le téléphone (9 chiffres commençant par 7 ou 8)
      if (n.toString().length === 9 && (n.toString().startsWith('7') || n.toString().startsWith('8'))) return false;
      // Garder seulement les nombres raisonnables pour un prix (4 chiffres ou plus)
      return n >= 1000 && n <= 10000000;
    });
    
    if (possiblePrix.length > 0) {
      // Prendre le plus grand nombre (probablement le prix)
      prix = Math.max(...possiblePrix);
    }
  }

  // Extraire le numéro de téléphone (9 chiffres)
  const telephoneMatch = normalizedText.match(/(?:7|77)(\d{8})|(\d{9})/);
  let telephone = null;
  if (telephoneMatch) {
    telephone = telephoneMatch[1] ? '7' + telephoneMatch[1] : telephoneMatch[2];
    // Nettoyer (garder seulement les chiffres)
    telephone = telephone.replace(/\D/g, '').slice(0, 9);
  }

  return {
    produit,
    quantite,
    unite,
    prix,
    telephone,
    texteOriginal: text
  };
};

/**
 * Améliorer l'extraction avec des règles plus intelligentes ou OpenAI
 */
export const smartExtractInfo = async (text) => {
  const { AI_CONFIG } = await import('../config/ai');
  
  // Si OpenAI est configuré, l'utiliser pour une extraction plus précise
  if (!AI_CONFIG.useLocalAI && AI_CONFIG.apiKey) {
    try {
      return await extractWithOpenAI(text);
    } catch (error) {
      console.warn('⚠️ Erreur avec OpenAI, utilisation de l\'extraction locale:', error);
      // Fallback sur l'extraction locale en cas d'erreur
    }
  }
  
  // Extraction locale (fallback ou par défaut)
  const basicInfo = extractAnnouncementInfo(text);
  
  // Améliorations supplémentaires
  const normalizedText = text.toLowerCase();
  
  // Si pas de produit trouvé, chercher des synonymes
  if (!basicInfo.produit) {
    const synonymes = {
      'Oignon': ['oignon', 'oignons', 'ognon'],
      'Tomate': ['tomate', 'tomates'],
      'Mil': ['mil', 'sorgho'],
      'Arachide': ['arachide', 'cacahuète', 'cacahuètes'],
      'Manioc': ['manioc', 'yucca'],
      'Mangue': ['mangue', 'mangues'],
      'Bissap': ['bissap', 'hibiscus'],
      'Pastèque': ['pastèque', 'pasteque', 'melon d\'eau']
    };
    
    for (const [produitNom, mots] of Object.entries(synonymes)) {
      for (const mot of mots) {
        if (normalizedText.includes(mot)) {
          basicInfo.produit = produitNom;
          break;
        }
      }
      if (basicInfo.produit) break;
    }
  }
  
  return basicInfo;
};

/**
 * Extraire les informations avec OpenAI pour une meilleure précision
 * Supporte le français et le wolof
 */
const extractWithOpenAI = async (text) => {
  const { AI_CONFIG, callAIAPI } = await import('../config/ai');
  
  const systemPrompt = `Tu es un assistant qui extrait des informations d'annonces agricoles.
Le texte peut être en français ou en wolof. Extrais les informations suivantes :

- produit : Le nom du produit (Oignon/Sob, Tomate/Tamaat, Mil/Mbey, Arachide/Gerte, Manioc/Mbaxal, Mangue/Mango, Bissap/Bissap, ou Pastèque/Meloon)
- quantite : La quantité (nombre uniquement)
- unite : L'unité (Sac/Sako, Kg/Kilo, ou Tonne/Ton)
- prix : Le prix en FCFA (nombre uniquement, sans "FCFA" ou "francs" ou "junni")
- telephone : Le numéro de téléphone (9 chiffres, commençant par 7 ou 8)

Mots wolof courants :
- Produits : Sob (Oignon), Tamaat (Tomate), Mbey (Mil), Gerte (Arachide), Mbaxal (Manioc), Mango (Mangue), Bissap (Bissap), Meloon (Pastèque)
- Unités : Sako (Sac), Kilo (Kg), Ton (Tonne)
- Prix : Junni (mille), FCFA (FCFA)
- Verbes : Damaa jënd (Je vends), Am naa (J'ai), Jox naa (Je donne)

Réponds UNIQUEMENT avec un JSON valide dans ce format exact :
{
  "produit": "Oignon",
  "quantite": "50",
  "unite": "Sac",
  "prix": "15000",
  "telephone": "771234567"
}

Si une information n'est pas trouvée, utilise null pour ce champ.`;

  const userPrompt = `Extrais les informations de cette annonce : "${text}"`;

  try {
    const response = await callAIAPI(userPrompt, systemPrompt);
    
    // Parser la réponse JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extracted = JSON.parse(jsonMatch[0]);
      
      return {
        produit: extracted.produit || null,
        quantite: extracted.quantite || null,
        unite: extracted.unite || 'Sac',
        prix: extracted.prix ? parseInt(extracted.prix) : null,
        telephone: extracted.telephone || null,
        texteOriginal: text
      };
    }
  } catch (error) {
    console.error('Erreur lors de l\'extraction avec OpenAI:', error);
    throw error;
  }
  
  // Si pas de JSON valide, utiliser l'extraction locale
  return extractAnnouncementInfo(text);
};

