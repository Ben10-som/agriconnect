// Configuration pour l'IA
export const AI_CONFIG = {
  // OpenAI Configuration
  apiKey: "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",
  apiUrl: "https://api.openai.com/v1/chat/completions",
  model: "gpt-3.5-turbo",
  useLocalAI: false, // Utiliser OpenAI au lieu des règles locales
};

// Fonction pour obtenir une recommandation de prix basée sur les annonces existantes
export const getPriceRecommendation = (produit, quantite, unite, annoncesExistantes) => {
  // Filtrer les annonces pour le même produit
  const annoncesProduit = annoncesExistantes.filter(a => 
    a.produit.toLowerCase() === produit.toLowerCase()
  );
  
  if (annoncesProduit.length === 0) {
    return null; // Pas assez de données
  }
  
  // Calculer le prix moyen par unité
  const prixParUnite = annoncesProduit.map(a => {
    let prixUnitaire = a.prix;
    
    // Convertir en prix par unité de base (Kg)
    if (a.unite === 'Tonne') {
      prixUnitaire = a.prix / 1000; // 1 tonne = 1000 kg
    } else if (a.unite === 'Sac') {
      // Estimation : 1 sac ≈ 50 kg (peut être ajusté)
      prixUnitaire = a.prix / 50;
    }
    // Si déjà en Kg, garder tel quel
    
    return prixUnitaire;
  });
  
  const prixMoyen = prixParUnite.reduce((a, b) => a + b, 0) / prixParUnite.length;
  const prixMin = Math.min(...prixParUnite);
  const prixMax = Math.max(...prixParUnite);
  
  // Recommander un prix basé sur la quantité et l'unité
  let prixRecommande = prixMoyen;
  
  // Ajuster selon l'unité
  if (unite === 'Tonne') {
    prixRecommande = prixMoyen * 1000;
  } else if (unite === 'Sac') {
    prixRecommande = prixMoyen * 50; // Estimation
  }
  
  // Ajuster selon la quantité (gros volumes = prix réduit)
  if (quantite > 100) {
    prixRecommande = prixRecommande * 0.95; // 5% de réduction
  } else if (quantite > 50) {
    prixRecommande = prixRecommande * 0.98; // 2% de réduction
  }
  
  return {
    prixRecommande: Math.round(prixRecommande),
    prixMin: Math.round(prixMin * (unite === 'Tonne' ? 1000 : unite === 'Sac' ? 50 : 1)),
    prixMax: Math.round(prixMax * (unite === 'Tonne' ? 1000 : unite === 'Sac' ? 50 : 1)),
    prixMoyen: Math.round(prixMoyen * (unite === 'Tonne' ? 1000 : unite === 'Sac' ? 50 : 1)),
    nombreAnnonces: annoncesProduit.length
  };
};

// Fonction pour générer une description avec IA (simulation pour l'instant)
export const generateDescription = async (produit, quantite, unite, prix) => {
  // Pour l'instant, génération simple basée sur des templates
  // Vous pouvez remplacer par un appel API réel (OpenAI, etc.)
  
  const descriptions = {
    'Oignon': `Oignons frais de qualité supérieure, ${quantite} ${unite}. Prix compétitif à ${prix} FCFA. Produit local du Sénégal.`,
    'Tomate': `Tomates rouges et juteuses, ${quantite} ${unite}. Prix attractif à ${prix} FCFA. Fraîchement récoltées.`,
    'Mil': `Mil de qualité, ${quantite} ${unite}. Prix: ${prix} FCFA. Céréale locale nutritive.`,
    'Arachide': `Arachides décortiquées, ${quantite} ${unite}. Prix: ${prix} FCFA. Produit de qualité.`,
    'Manioc': `Manioc frais, ${quantite} ${unite}. Prix: ${prix} FCFA. Tubercule local.`,
    'Mangue': `Mangues sucrées et parfumées, ${quantite} ${unite}. Prix: ${prix} FCFA. Fruit de saison.`,
    'Bissap': `Fleurs de bissap séchées, ${quantite} ${unite}. Prix: ${prix} FCFA. Pour infusion.`,
    'Pastèque': `Pastèques juteuses, ${quantite} ${unite}. Prix: ${prix} FCFA. Fruit rafraîchissant.`
  };
  
  return descriptions[produit] || `Produit agricole de qualité: ${produit}, ${quantite} ${unite}. Prix: ${prix} FCFA.`;
};

// Fonction pour appeler une API IA externe (exemple avec OpenAI)
export const callAIAPI = async (prompt, systemPrompt = '') => {
  if (!AI_CONFIG.apiKey) {
    throw new Error('Clé API IA non configurée');
  }
  
  try {
    const response = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API IA:', error);
    throw error;
  }
};

