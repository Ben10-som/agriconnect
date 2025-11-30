# 🚀 Démarrage Rapide - AgriConnect Frontend

## Installation (1 minute)

```bash
cd frontend
npm install
```

## Configuration Firebase (2 minutes)

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet ou utilisez un projet existant
3. Activez **Firestore Database** (mode test pour commencer)
4. Activez **Storage**
5. Dans les paramètres du projet, copiez la configuration
6. Créez un fichier `.env` dans le dossier `frontend/` :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_auth_domain
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

## Démarrer l'application

```bash
npm run dev
```

L'application s'ouvrira automatiquement sur http://localhost:3000

## Structure des données Firestore

Créez une collection `products` dans Firestore avec cette structure :

```javascript
{
  productName: "Riz",
  quantity: 50,
  unit: "Sac",
  price: 15000,
  sellerPhone: "+221771234567",
  imageUrl: "https://example.com/riz.jpg", // ou chemin Firebase Storage
  category: "Céréales", // optionnel
  createdAt: Timestamp.now()
}
```

## Fonctionnalités

✅ Affichage en temps réel des produits depuis Firestore
✅ Recherche par nom de produit
✅ Filtrage par catégorie
✅ Appel direct au vendeur (bouton téléphone)
✅ Design responsive (mobile, tablette, desktop)
✅ Interface moderne avec Tailwind CSS

## Prochaines étapes

- Connecter avec votre backend pour publier des produits
- Ajouter plus de filtres (prix, localisation)
- Implémenter la pagination si beaucoup de produits


