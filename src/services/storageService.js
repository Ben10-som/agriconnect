import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getApp } from 'firebase/app';

// Initialiser Firebase Storage en utilisant la même instance que Firestore
let storage;

try {
  const app = getApp();
  storage = getStorage(app);
  console.log('✅ Firebase Storage initialisé avec succès');
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation de Firebase Storage:', error);
}

/**
 * Uploader une image vers Firebase Storage
 * @param {File} file - Le fichier image à uploader
 * @param {string} produitNom - Le nom du produit (pour organiser les fichiers)
 * @returns {Promise<string>} L'URL de téléchargement de l'image
 */
export const uploadImage = async (file, produitNom = 'produits') => {
  try {
    if (!storage) {
      const error = new Error('Firebase Storage n\'est pas initialisé. Activez Storage dans Firebase Console.');
      error.code = 'storage/not-initialized';
      throw error;
    }

    if (!file) {
      throw new Error('Aucun fichier fourni');
    }

    // Vérifier que c'est bien une image
    if (!file.type.startsWith('image/')) {
      throw new Error('Le fichier doit être une image');
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('L\'image est trop grande (max 5MB)');
    }

    console.log('📤 Upload de l\'image en cours...', {
      nom: file.name,
      taille: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type
    });

    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const sanitizedProduitNom = produitNom.replace(/[^a-zA-Z0-9]/g, '_');
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${sanitizedProduitNom}_${timestamp}_${sanitizedFileName}`;
    const storageRef = ref(storage, `annonces/${fileName}`);

    // Uploader le fichier
    const snapshot = await uploadBytes(storageRef, file);
    console.log('✅ Image uploadée avec succès dans Storage');

    // Obtenir l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ URL de l\'image obtenue:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload de l\'image:', error);
    console.error('Détails:', {
      code: error.code,
      message: error.message
    });
    
    // Préserver le code d'erreur Firebase
    if (error.code) {
      throw error;
    }
    
    // Créer une erreur avec code si ce n'est pas déjà le cas
    const newError = new Error(error.message || 'Erreur lors de l\'upload de l\'image');
    newError.code = error.code || 'storage/unknown';
    throw newError;
  }
};

export default storage;

