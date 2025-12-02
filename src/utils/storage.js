// Utilitaires pour gérer le localStorage
const STORAGE_KEY = 'agriconnect_annonces';

export const loadAnnoncesFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Erreur lors du chargement depuis localStorage:', error);
  }
  return null;
};

export const saveAnnoncesToStorage = (annonces) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(annonces));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans localStorage:', error);
  }
};

export const clearAnnoncesFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression du localStorage:', error);
  }
};





