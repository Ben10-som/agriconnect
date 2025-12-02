import { getProductImage } from './produits';

// Données de démonstration
export const ANNONCES_DEMO = [
  { id: 1, produit: "Oignon", image: getProductImage("Oignon"), quantite: 50, unite: "Sac", prix: 15000, telephone: "771234567", date: "2024-11-28" },
  { id: 2, produit: "Tomate", image: getProductImage("Tomate"), quantite: 100, unite: "Kg", prix: 500, telephone: "775555555", date: "2024-11-27" },
  { id: 3, produit: "Mil", image: getProductImage("Mil"), quantite: 2, unite: "Tonne", prix: 350000, telephone: "779876543", date: "2024-11-26" },
  { id: 4, produit: "Arachide", image: getProductImage("Arachide"), quantite: 30, unite: "Sac", prix: 25000, telephone: "773334444", date: "2024-11-28" },
  { id: 5, produit: "Mangue", image: getProductImage("Mangue"), quantite: 200, unite: "Kg", prix: 800, telephone: "776667777", date: "2024-11-29" }
];

