# IZZI

Application React pour connecter agriculteurs et acheteurs au Sénégal.

## Installation

```bash
npm install
```

## Configuration Firebase

1. Créez un projet Firebase sur [Firebase Console](https://console.firebase.google.com/)
2. Activez Firestore Database dans votre projet
3. Configurez les règles de sécurité Firestore (mode test pour le développement) :
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
4. Copiez vos clés de configuration Firebase dans `src/config/firebase.js`

## Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Build

```bash
npm run build
```

## Structure du projet

```
agriconnect2/
├── src/
│   ├── components/       # Composants React
│   │   ├── PageAccueil.jsx
│   │   ├── PageAgriculteur.jsx
│   │   └── PageAcheteur.jsx
│   ├── config/           # Configuration
│   │   └── firebase.js
│   ├── data/             # Données
│   │   ├── produits.js
│   │   └── annonces.js
│   ├── services/          # Services (Firebase)
│   │   └── firebaseService.js
│   ├── utils/             # Utilitaires
│   │   └── storage.js
│   ├── App.jsx           # Composant principal
│   ├── main.jsx          # Point d'entrée
│   └── index.css        # Styles Tailwind
├── public/
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Fonctionnalités

- ✅ Publication d'annonces par les agriculteurs
- ✅ Recherche et filtrage des produits pour les acheteurs
- ✅ Synchronisation en temps réel via Firebase Firestore
- ✅ Les produits sont visibles par tous les acheteurs
- ✅ Persistance des données dans le cloud

## Technologies utilisées

- React 18
- Vite
- Tailwind CSS
- Lucide React (icônes)
- Firebase Firestore (base de données en temps réel)
