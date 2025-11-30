# 📁 Structure du Projet AgriConnect

## 🌳 Vue d'ensemble

```
agriconnect/
├── frontend/              # Application React (Interface web)
├── backend/               # API FastAPI (Backend)
├── venv/                  # Environnement virtuel Python
├── images/                # Images de test
├── audio1.mp4             # Fichiers audio de test
├── audio2.mp4
└── test.py                # Scripts de test
```

---

## 🎨 Frontend (React + Vite)

### Structure principale

```
frontend/
├── src/                           # Code source principal
│   ├── main.jsx                   # Point d'entrée de l'application
│   ├── App.jsx                    # Composant principal avec routing
│   ├── index.css                  # Styles globaux (Tailwind)
│   │
│   ├── components/                # Composants React
│   │   ├── Header.jsx            # En-tête avec navigation
│   │   ├── Login.jsx             # Page de connexion
│   │   ├── Register.jsx          # Page d'inscription
│   │   ├── ProductCard.jsx       # Carte d'affichage d'un produit
│   │   ├── PublishProduct.jsx    # Formulaire de publication
│   │   └── LoadingSpinner.jsx    # Indicateur de chargement
│   │
│   ├── context/                   # Contextes React
│   │   └── AuthContext.jsx        # Gestion de l'authentification
│   │
│   └── firebase/                  # Configuration Firebase
│       └── config.js             # Configuration Firebase (Auth, Firestore, Storage)
│
├── scripts/                       # Scripts utilitaires
│   ├── seed-data.js              # Script pour créer des données fictives
│   └── README.md                  # Documentation des scripts
│
├── node_modules/                  # Dépendances npm
│
├── index.html                     # Fichier HTML principal
├── package.json                   # Dépendances et scripts npm
├── package-lock.json              # Verrouillage des versions
├── vite.config.js                 # Configuration Vite
├── tailwind.config.js             # Configuration Tailwind CSS
├── postcss.config.js              # Configuration PostCSS
│
└── Documentation/                 # Guides et documentation
    ├── README.md                  # Documentation principale
    ├── QUICK_START.md             # Guide de démarrage rapide
    ├── FIREBASE_SETUP.md          # Configuration Firebase
    ├── ACTIVER_FIREBASE_AUTH.md   # Activer l'authentification
    ├── GUIDE_SEED.md              # Guide pour créer des données fictives
    ├── TROUBLESHOOTING.md         # Guide de dépannage
    ├── VERIFIER_FIRESTORE.md      # Vérifier Firestore
    └── VERIFIER_REGLES_FIREBASE.md # Vérifier les règles Firebase
```

### 📝 Description des fichiers principaux

#### `src/main.jsx`
- Point d'entrée de l'application React
- Initialise React et monte l'application

#### `src/App.jsx`
- Composant racine avec React Router
- Gère les routes : `/`, `/login`, `/register`, `/publish`
- Affiche la liste des produits avec recherche et filtres

#### `src/components/Header.jsx`
- En-tête de l'application
- Affiche le logo et le nom
- Boutons de navigation (Connexion, Publication, Déconnexion)
- Adapté selon l'état de connexion

#### `src/components/Login.jsx`
- Formulaire de connexion
- Utilise le numéro de téléphone et mot de passe
- Gestion des erreurs d'authentification

#### `src/components/Register.jsx`
- Formulaire d'inscription
- Collecte : nom, téléphone, mot de passe
- Validation des données

#### `src/components/ProductCard.jsx`
- Affiche un produit dans une carte
- Image, nom, quantité, prix, vendeur
- Bouton d'appel direct au vendeur

#### `src/components/PublishProduct.jsx`
- Formulaire de publication de produit
- Champs : nom, quantité, unité, prix, image
- Upload d'image vers Firebase Storage
- Sauvegarde dans Firestore

#### `src/components/LoadingSpinner.jsx`
- Indicateur de chargement animé

#### `src/context/AuthContext.jsx`
- Context React pour l'authentification
- Fonctions : `signup`, `login`, `logout`
- Gestion de l'état utilisateur
- Conversion téléphone → email pour Firebase Auth

#### `src/firebase/config.js`
- Configuration Firebase
- Initialise : Auth, Firestore, Storage
- Utilise les variables d'environnement ou valeurs par défaut

#### `scripts/seed-data.js`
- Script Node.js pour créer des données fictives
- Crée des utilisateurs et leurs produits
- Utilisation : `npm run seed`

---

## ⚙️ Backend (FastAPI)

### Structure principale

```
backend/
├── app/
│   ├── main.py                    # Point d'entrée FastAPI
│   │
│   ├── api/                       # Endpoints API
│   │   ├── products.py           # API des produits
│   │   └── publish.py            # API de publication
│   │
│   └── services/                  # Services métier
│       ├── ia_service.py         # Service IA (Whisper + GPT)
│       └── ivr_service.py        # Service IVR (appels vocaux)
│
└── requirements.txt                # Dépendances Python
```

### 📝 Description des fichiers

#### `app/main.py`
- Point d'entrée de l'API FastAPI
- Configuration de l'application
- Montage des routes

#### `app/api/products.py`
- Endpoints pour les produits
- GET : Liste des produits
- GET : Détails d'un produit

#### `app/api/publish.py`
- Endpoints pour publier des produits
- POST : Publier un produit
- Gestion des données audio/texte

#### `app/services/ia_service.py`
- Service de traitement IA
- Transcription audio (Whisper)
- Extraction d'informations (GPT)
- Association d'images aux produits

#### `app/services/ivr_service.py`
- Service IVR (Interactive Voice Response)
- Gestion des appels vocaux
- Menu vocal pour les feature phones
- Intégration avec Twilio/Vonage

#### `requirements.txt`
- Liste des dépendances Python
- FastAPI, Firebase, OpenAI, etc.

---

## 🗄️ Base de données (Firebase)

### Collections Firestore

#### Collection `users`
```javascript
{
  name: string,              // Nom complet
  phone: string,             // Numéro de téléphone
  email: string,             // Email (format: phone@agriconnect.local)
  createdAt: Timestamp      // Date de création
}
```

#### Collection `products`
```javascript
{
  productName: string,       // Nom du produit
  quantity: number,          // Quantité
  unit: string,              // Unité (Sac, Kg, Tonnes)
  price: number,             // Prix en FCFA
  imageUrl: string,          // URL de l'image
  sellerId: string,          // ID du vendeur (uid)
  sellerName: string,        // Nom du vendeur
  sellerPhone: string,       // Téléphone du vendeur
  createdAt: Timestamp,      // Date de publication
  category: string           // Catégorie du produit
}
```

### Firebase Storage

```
storage/
└── products/
    └── {userId}/
        └── {timestamp}_{filename}
```

---

## 🔐 Authentification

### Méthode
- Firebase Authentication (Email/Password)
- Conversion : Téléphone → Email (format: `{phone}@agriconnect.local`)

### Flux
1. Inscription : Nom + Téléphone + Mot de passe
2. Connexion : Téléphone + Mot de passe
3. Session : Gérée par Firebase Auth

---

## 🛣️ Routes de l'application

### Frontend (React Router)

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `Home` | Page d'accueil - Liste des produits |
| `/login` | `Login` | Page de connexion |
| `/register` | `Register` | Page d'inscription |
| `/publish` | `PublishProduct` | Formulaire de publication |

### Backend (FastAPI)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/products` | GET | Liste des produits |
| `/api/products/{id}` | GET | Détails d'un produit |
| `/api/publish` | POST | Publier un produit |
| `/api/publish/audio` | POST | Publier via audio |
| `/api/publish/ivr` | POST | Publier via IVR |

---

## 📦 Technologies utilisées

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Framework CSS
- **Firebase SDK** - Auth, Firestore, Storage
- **Lucide React** - Icônes

### Backend
- **FastAPI** - Framework API
- **Python** - Langage
- **Firebase Admin SDK** - Backend Firebase
- **OpenAI Whisper** - Transcription audio
- **OpenAI GPT** - Traitement IA
- **Twilio/Vonage** - IVR

### Infrastructure
- **Firebase** - Backend as a Service
  - Authentication
  - Firestore (Base de données)
  - Storage (Images)
- **Render/Railway** - Hébergement (optionnel)

---

## 🚀 Commandes utiles

### Frontend
```bash
cd frontend
npm install          # Installer les dépendances
npm run dev          # Démarrer le serveur de développement
npm run build        # Build pour production
npm run seed         # Créer des données fictives
```

### Backend
```bash
cd backend
pip install -r requirements.txt  # Installer les dépendances
uvicorn app.main:app --reload     # Démarrer le serveur
```

---

## 📋 Workflow de publication

### 1. Feature Phone (IVR)
```
Appel → IVR → Menu vocal → Saisie → IA → Produit publié
```

### 2. Smartphone Analphabète
```
Audio → Transcription (Whisper) → Extraction (GPT) → Produit publié
```

### 3. Smartphone Alphabète
```
Formulaire web → Validation → Upload image → Produit publié
```

---

## 🔄 Flux de données

```
Frontend (React)
    ↓
Firebase Auth (Authentification)
    ↓
Firebase Firestore (Base de données)
    ↓
Firebase Storage (Images)
    ↓
Backend API (FastAPI) - Optionnel pour IVR/IA
```

---

## 📝 Notes importantes

1. **Configuration Firebase** : Voir `FIREBASE_SETUP.md`
2. **Authentification** : Voir `ACTIVER_FIREBASE_AUTH.md`
3. **Règles de sécurité** : Voir `VERIFIER_REGLES_FIREBASE.md`
4. **Données fictives** : Voir `GUIDE_SEED.md`
5. **Dépannage** : Voir `TROUBLESHOOTING.md`

---

## 🎯 Prochaines étapes

- [ ] Implémenter le backend IVR complet
- [ ] Intégrer Whisper pour la transcription
- [ ] Ajouter la géolocalisation
- [ ] Implémenter les notifications
- [ ] Ajouter les statistiques
- [ ] Optimiser les performances
- [ ] Tests unitaires et d'intégration

---

**Dernière mise à jour** : 2024


