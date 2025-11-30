# AgriConnect - Frontend

Application web React pour les acheteurs de produits agricoles.

## Installation

```bash
npm install
```

## Configuration Firebase

1. Créez un projet Firebase sur [Firebase Console](https://console.firebase.google.com/)
2. Activez Firestore Database et Storage
3. Copiez vos clés de configuration dans `src/firebase/config.js`

## Démarrage

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Structure des données Firestore

La collection `products` doit contenir des documents avec la structure suivante :

```javascript
{
  productName: string,
  quantity: number,
  unit: string, // "Sac", "Kg", "Tonnes"
  price: number, // Prix en FCFA
  sellerPhone: string,
  imageUrl: string, // URL ou chemin Firebase Storage
  category: string, // Optionnel
  createdAt: Timestamp
}
```

## Build pour production

```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/`.


