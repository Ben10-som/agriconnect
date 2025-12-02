// Utilitaire pour gérer les images avec fallback
export const getImageUrl = (imagePath) => {
  // Si c'est déjà une URL complète (http/https), la retourner telle quelle
  if (imagePath?.startsWith('http://') || imagePath?.startsWith('https://')) {
    return imagePath;
  }
  
  // Sinon, c'est un chemin local, le retourner tel quel
  // Vite servira automatiquement les fichiers depuis public/
  return imagePath;
};

// Fonction pour tester si une image existe
export const testImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};





