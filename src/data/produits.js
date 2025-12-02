// Produits agricoles du Sénégal
// Les images utilisent des URLs d'images libres de droits
// Vous pouvez remplacer ces URLs par vos propres images dans le dossier public/images/
export const PRODUITS_SENEGAL = [
  { 
    id: 1, 
    nom: "Oignon", 
    image: "https://images.unsplash.com/photo-1618512496249-c5fada5c6bb9?w=400&h=400&fit=crop",
    imageLocal: "/images/oignon.jpeg",
    unite: ["Sac", "Kg", "Tonne"] 
  },
  { 
    id: 2, 
    nom: "Tomate", 
    image: "https://images.unsplash.com/photo-1546470427-e26264be0b6a?w=400&h=400&fit=crop",
    imageLocal: "/images/tomate.jpg",
    unite: ["Sac", "Kg", "Tonne"] 
  },
  { 
    id: 3, 
    nom: "Mil", 
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=400&fit=crop",
    imageLocal: "/images/mil.jpg",
    unite: ["Sac", "Kg", "Tonne"] 
  },
  { 
    id: 4, 
    nom: "Arachide", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bc8b9e2?w=400&h=400&fit=crop",
    imageLocal: "/images/arachide.jpeg",
    unite: ["Sac", "Kg", "Tonne"] 
  },
  { 
    id: 5, 
    nom: "Manioc", 
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop",
    imageLocal: "/images/manioc.jpeg",
    unite: ["Sac", "Kg", "Tonne"] 
  },
  { 
    id: 6, 
    nom: "Mangue", 
    image: "https://images.unsplash.com/photo-1605027990121-c73661ea8ca1?w=400&h=400&fit=crop",
    imageLocal: "/images/mangue.jpeg",
    unite: ["Sac", "Kg", "Tonne"] 
  },
  { 
    id: 7, 
    nom: "Bissap", 
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
    imageLocal: "/images/bissap.jpeg",
    unite: ["Sac", "Kg", "Tonne"] 
  },
  { 
    id: 8, 
    nom: "Pastèque", 
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    imageLocal: "/images/pasthèque.jpeg",
    unite: ["Sac", "Kg", "Tonne"] 
  }
];

// Fonction utilitaire pour obtenir l'URL de l'image
// Essaie d'utiliser l'image locale en premier, sinon utilise l'image externe
export const getProductImage = (produit) => {
  const produitData = PRODUITS_SENEGAL.find(p => p.nom === produit);
  if (!produitData) {
    // Image par défaut si produit non trouvé
    return "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=400&fit=crop";
  }
  
  // Utiliser l'image locale si disponible, sinon l'image externe
  // Note: Les images locales doivent être dans public/images/
  return produitData.imageLocal || produitData.image;
};

