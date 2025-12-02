import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../config/firebase';
import { getProductImage } from '../data/produits';

// Initialiser Firebase
let app;
let db;

try {
  app = initializeApp(FIREBASE_CONFIG);
  db = getFirestore(app);
  console.log('✅ Firebase initialisé avec succès');
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation de Firebase:', error);
}

// Collection Firestore pour les annonces
const ANNONCES_COLLECTION = 'annonces';

/**
 * Ajouter une nouvelle annonce dans Firestore
 */
export const addAnnonce = async (annonce) => {
  try {
    console.log('📤 Tentative d\'ajout d\'annonce:', annonce);
    
    if (!db) {
      throw new Error('Firebase n\'est pas initialisé');
    }

    const annonceData = {
      ...annonce,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    console.log('📤 Données à sauvegarder:', annonceData);
    
    const docRef = await addDoc(collection(db, ANNONCES_COLLECTION), annonceData);
    console.log('✅ Annonce ajoutée avec succès, ID:', docRef.id);
    
    return { id: docRef.id, ...annonce };
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de l\'annonce:', error);
    console.error('Détails de l\'erreur:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Récupérer toutes les annonces depuis Firestore
 */
export const getAnnonces = async () => {
  try {
    if (!db) {
      console.warn('⚠️ Firebase n\'est pas initialisé');
      return [];
    }

    console.log('📥 Récupération des annonces depuis Firestore...');
    
    // Essayer avec orderBy, sinon sans
    let q;
    try {
      q = query(collection(db, ANNONCES_COLLECTION), orderBy('createdAt', 'desc'));
    } catch (error) {
      // Si orderBy échoue (collection vide ou index manquant), utiliser sans orderBy
      console.warn('⚠️ Impossible d\'utiliser orderBy, récupération sans tri:', error);
      q = query(collection(db, ANNONCES_COLLECTION));
    }
    
    const querySnapshot = await getDocs(q);
    const annonces = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convertir les Timestamps en dates si nécessaire
      const annonce = {
        id: doc.id,
        ...data,
        date: data.date || (data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
      };
      annonces.push(annonce);
    });
    
    console.log(`✅ ${annonces.length} annonce(s) récupérée(s)`);
    return annonces;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des annonces:', error);
    console.error('Détails de l\'erreur:', {
      code: error.code,
      message: error.message
    });
    return [];
  }
};

/**
 * Écouter les changements en temps réel dans Firestore
 * @param {Function} callback - Fonction appelée à chaque changement
 * @returns {Function} Fonction pour se désabonner
 */
export const subscribeToAnnonces = (callback) => {
  try {
    if (!db) {
      console.warn('⚠️ Firebase n\'est pas initialisé, utilisation des données de démo');
      // Appeler le callback avec un tableau vide après un court délai pour permettre au composant de se rendre
      setTimeout(() => callback([]), 100);
      return () => {};
    }

    console.log('👂 Écoute des changements en temps réel...');
    
    // Essayer avec orderBy, sinon sans
    let q;
    try {
      q = query(collection(db, ANNONCES_COLLECTION), orderBy('createdAt', 'desc'));
    } catch (error) {
      // Si orderBy échoue, utiliser sans orderBy
      console.warn('⚠️ Impossible d\'utiliser orderBy, écoute sans tri:', error);
      q = query(collection(db, ANNONCES_COLLECTION));
    }
    
    let hasCalledCallback = false;
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const annonces = [];
        querySnapshot.forEach((doc) => {
          try {
            const data = doc.data();
            // Convertir les Timestamps en dates si nécessaire
            const annonce = {
              id: doc.id,
              ...data,
              date: data.date || (data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0])
            };
            annonces.push(annonce);
          } catch (docError) {
            console.error('❌ Erreur lors du traitement d\'un document:', docError);
          }
        });
        console.log(`📥 ${annonces.length} annonce(s) reçue(s) en temps réel`);
        hasCalledCallback = true;
        callback(annonces);
      } catch (error) {
        console.error('❌ Erreur lors du traitement des documents:', error);
        if (!hasCalledCallback) {
          hasCalledCallback = true;
          callback([]);
        }
      }
    }, (error) => {
      console.error('❌ Erreur lors de l\'écoute des annonces:', error);
      console.error('Détails de l\'erreur:', {
        code: error.code,
        message: error.message
      });
      
      // Si c'est une erreur de permission, afficher un message plus clair
      if (error.code === 'permission-denied') {
        console.error('🔒 Erreur de permission: Vérifiez les règles de sécurité Firestore');
      }
      
      // Toujours appeler le callback, même en cas d'erreur
      if (!hasCalledCallback) {
        hasCalledCallback = true;
        callback([]);
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('❌ Erreur lors de la souscription aux annonces:', error);
    // Appeler le callback avec un tableau vide après un court délai
    setTimeout(() => callback([]), 100);
    return () => {};
  }
};

/**
 * Mettre à jour les URLs d'images des annonces existantes
 * Utile pour corriger les anciennes annonces qui ont des emojis ou de mauvaises URLs
 */
export const updateAnnoncesImages = async () => {
  try {
    if (!db) {
      throw new Error('Firebase n\'est pas initialisé');
    }

    console.log('🔄 Mise à jour des URLs d\'images...');
    
    const querySnapshot = await getDocs(collection(db, ANNONCES_COLLECTION));
    const updates = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const nouvelleImage = getProductImage(data.produit);
      
      // Mettre à jour seulement si l'image a changé
      if (data.image !== nouvelleImage) {
        updates.push({
          id: docSnapshot.id,
          oldImage: data.image,
          newImage: nouvelleImage
        });
      }
    });

    // Appliquer les mises à jour
    for (const update of updates) {
      await updateDoc(doc(db, ANNONCES_COLLECTION, update.id), {
        image: update.newImage,
        updatedAt: Timestamp.now()
      });
      console.log(`✅ Image mise à jour pour l'annonce ${update.id}`);
    }

    console.log(`✅ ${updates.length} annonce(s) mise(s) à jour`);
    return updates.length;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des images:', error);
    throw error;
  }
};

/**
 * Ajouter des régions et points de relais fictifs aux annonces existantes qui n'en ont pas
 */
export const addRegionsAndRelayPointsToExistingAnnonces = async () => {
  try {
    if (!db) {
      throw new Error('Firebase n\'est pas initialisé');
    }

    console.log('🔄 Mise à jour des régions et points de relais pour les annonces existantes...');
    
    const querySnapshot = await getDocs(collection(db, ANNONCES_COLLECTION));
    const updates = [];
    
    // Points de relais fictifs par région
    const relayPointsByRegion = {
      'dakar': ['Marché Central de Dakar', 'Gare Routière de Dakar', 'Marché Sandaga'],
      'thies': ['Gare Routière de Thiès', 'Marché de Thiès', 'Terminal de M\'bour'],
      'diourbel': ['Marché de Diourbel', 'Gare Routière de Diourbel', 'Marché de Mbacké'],
      'fatick': ['Marché de Fatick', 'Gare Routière de Fatick', 'Marché de Foundiougne'],
      'kaolack': ['Marché de Kaolack', 'Gare Routière de Kaolack', 'Marché de Guinguinéo'],
      'kolda': ['Marché de Kolda', 'Gare Routière de Kolda', 'Marché de Vélingara'],
      'louga': ['Marché de Louga', 'Gare Routière de Louga', 'Marché de Kébémer'],
      'matam': ['Marché de Matam', 'Gare Routière de Matam', 'Marché de Kanel'],
      'saint-louis': ['Marché de Saint-Louis', 'Gare Routière de Saint-Louis', 'Marché de Podor'],
      'sedhiou': ['Marché de Sédhiou', 'Gare Routière de Sédhiou', 'Marché de Bounkiling'],
      'tambacounda': ['Marché de Tambacounda', 'Gare Routière de Tambacounda', 'Marché de Bakel'],
      'ziguinchor': ['Marché de Ziguinchor', 'Gare Routière de Ziguinchor', 'Marché de Bignona'],
      'kedougou': ['Marché de Kédougou', 'Gare Routière de Kédougou', 'Marché de Salémata'],
      'kaffrine': ['Marché de Kaffrine', 'Gare Routière de Kaffrine', 'Marché de Birkilane']
    };

    // Régions principales à utiliser (Dakar, Thiès, Kaolack, Saint-Louis)
    const mainRegions = ['dakar', 'thies', 'kaolack', 'saint-louis'];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const annonceId = docSnapshot.id;
      
      // Vérifier si l'annonce n'a pas de régions ou de points de relais
      const hasRegions = data.regions && Array.isArray(data.regions) && data.regions.length > 0;
      const hasRelayPoints = data.relayPoints && typeof data.relayPoints === 'object' && Object.keys(data.relayPoints).length > 0;
      
      if (!hasRegions || !hasRelayPoints) {
        // Sélectionner 2-3 régions aléatoirement parmi les principales
        const selectedRegions = [];
        const shuffled = [...mainRegions].sort(() => 0.5 - Math.random());
        const numRegions = Math.floor(Math.random() * 2) + 2; // 2 ou 3 régions
        for (let i = 0; i < numRegions && i < shuffled.length; i++) {
          selectedRegions.push(shuffled[i]);
        }
        
        // Créer les points de relais pour les régions sélectionnées
        const relayPoints = {};
        selectedRegions.forEach(regionId => {
          if (relayPointsByRegion[regionId]) {
            // Prendre 2-3 points de relais aléatoirement
            const availablePoints = relayPointsByRegion[regionId];
            const shuffledPoints = [...availablePoints].sort(() => 0.5 - Math.random());
            const numPoints = Math.floor(Math.random() * 2) + 2; // 2 ou 3 points
            relayPoints[regionId] = shuffledPoints.slice(0, numPoints);
          }
        });
        
        updates.push({
          id: annonceId,
          regions: selectedRegions,
          relayPoints: relayPoints
        });
      }
    });

    console.log(`📝 ${updates.length} annonce(s) à mettre à jour`);

    // Appliquer les mises à jour
    let successCount = 0;
    for (const update of updates) {
      try {
        await updateDoc(doc(db, ANNONCES_COLLECTION, update.id), {
          regions: update.regions,
          relayPoints: update.relayPoints,
          updatedAt: Timestamp.now()
        });
        console.log(`✅ Annonce ${update.id} mise à jour avec régions: ${update.regions.join(', ')}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour de l'annonce ${update.id}:`, error);
      }
    }

    console.log(`✅ ${successCount}/${updates.length} annonce(s) mise(s) à jour avec succès`);
    return { total: updates.length, success: successCount };
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des régions et points de relais:', error);
    throw error;
  }
};

export default db;

/**
 * Ajouter une commande dans Firestore
 */
export const addOrder = async (order) => {
  try {
    if (!db) throw new Error('Firebase n\'est pas initialisé');
    const data = {
      ...order,
      status: order.status || 'pending',
      paid: order.paid || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    const docRef = await addDoc(collection(db, 'orders'), data);
    console.log('✅ Commande ajoutée, ID:', docRef.id);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de la commande:', error);
    throw error;
  }
};

/**
 * Mettre à jour une commande
 */
export const updateOrder = async (orderId, updates) => {
  try {
    if (!db) throw new Error('Firebase n\'est pas initialisé');
    await updateDoc(doc(db, 'orders', orderId), {
      ...updates,
      updatedAt: Timestamp.now()
    });
    console.log('✅ Commande mise à jour:', orderId, updates);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la commande:', error);
    throw error;
  }
};

/**
 * Récupérer le profil utilisateur depuis Firestore
 */
export const getUserProfile = async (uid) => {
  try {
    if (!db) throw new Error('Firebase n\'est pas initialisé');
    const usersRef = collection(db, 'users');
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    
    let userProfile = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.uid === uid) {
        userProfile = { id: doc.id, ...data };
      }
    });
    
    return userProfile;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du profil:', error);
    return null;
  }
};

/**
 * Mettre à jour le profil utilisateur dans Firestore
 */
export const updateUserProfile = async (uid, updates) => {
  try {
    if (!db) throw new Error('Firebase n\'est pas initialisé');
    
    // Trouver le document de l'utilisateur
    const usersRef = collection(db, 'users');
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    
    let userDocId = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.uid === uid) {
        userDocId = doc.id;
      }
    });
    
    if (!userDocId) {
      throw new Error('Profil utilisateur non trouvé');
    }
    
    // Mettre à jour le document
    await updateDoc(doc(db, 'users', userDocId), {
      ...updates,
      updatedAt: Timestamp.now()
    });
    
    console.log('✅ Profil utilisateur mis à jour');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

/**
 * Récupérer les commandes d'un utilisateur
 */
export const getUserOrders = async (uid, role = 'acheteur') => {
  try {
    if (!db) throw new Error('Firebase n\'est pas initialisé');
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const order = { id: doc.id, ...data };
      
      if (role === 'acheteur' && order.buyerUid === uid) {
        orders.push(order);
      } else if (role === 'agriculteur' && order.sellerUid === uid) {
        orders.push(order);
      }
    });
    
    return orders;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des commandes:', error);
    return [];
  }
};

/**
 * Écouter les commandes en temps réel
 */
export const subscribeToOrders = (uid, role, callback) => {
  try {
    if (!db) {
      callback([]);
      return () => {};
    }

    const ordersRef = collection(db, 'orders');
    let q;
    try {
      q = query(ordersRef, orderBy('createdAt', 'desc'));
    } catch (error) {
      q = query(ordersRef);
    }
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const order = { id: doc.id, ...data };
        
        if (role === 'acheteur' && order.buyerUid === uid) {
          orders.push(order);
        } else if (role === 'agriculteur' && order.sellerUid === uid) {
          orders.push(order);
        }
      });
      callback(orders);
    }, (error) => {
      console.error('❌ Erreur lors de l\'écoute des commandes:', error);
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('❌ Erreur lors de la souscription aux commandes:', error);
    callback([]);
    return () => {};
  }
};

