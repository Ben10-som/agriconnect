# 🌾 AgriConnect - Version Simplifiée

Plateforme simple pour connecter agriculteurs et acheteurs au Sénégal.

## 🎯 Fonctionnalités

### Pour les Agriculteurs
- ✍️ Publication de produits via formulaire web
- 📸 Upload d'images
- 👤 Authentification (nom, téléphone, mot de passe)

### Pour les Acheteurs
- 🔍 Recherche et filtres de produits
- 📞 Contact direct avec les vendeurs
- 📱 Interface responsive

## 🏗️ Architecture

- **Frontend** : React + Vite + Tailwind CSS
- **Backend** : FastAPI (Python)
- **Base de données** : Firebase (Firestore + Storage)
- **Authentification** : Firebase Auth

## 🚀 Démarrage rapide

### Backend

```bash
cd backend

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Créer .env
cp .env.example .env
# Éditer .env avec vos configurations

# Obtenir firebase-credentials.json depuis Firebase Console
# Placer dans backend/

# Démarrer
uvicorn app.main:app --reload
```

API disponible sur : http://localhost:8000
Documentation : http://localhost:8000/docs

### Frontend

```bash
cd frontend

# Installer dépendances
npm install

# Créer .env
cp .env.example .env
# Éditer .env avec vos configurations Firebase

# Démarrer
npm run dev
```

Application disponible sur : http://localhost:3000

## 📁 Structure

```
agriconnect/
├── backend/              # API FastAPI
│   ├── app/
│   │   ├── main.py      # Point d'entrée
│   │   ├── config.py    # Configuration
│   │   ├── models/      # Modèles de données
│   │   ├── services/    # Services (Firebase)
│   │   └── api/         # Routes API
│   └── requirements.txt
│
└── frontend/            # Application React
    ├── src/
    │   ├── components/  # Composants
    │   ├── services/    # Client API
    │   └── App.jsx
    └── package.json
```

## 🔧 Configuration Firebase

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activer :
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
3. Télécharger les credentials (Service Account)
4. Placer `firebase-credentials.json` dans `backend/`

## 📝 Variables d'environnement

### Backend (.env)
```env
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
FIREBASE_PROJECT_ID=your-project-id
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## ✅ Fonctionnalités de base

- ✅ Authentification (inscription/connexion)
- ✅ Publication de produits
- ✅ Liste des produits
- ✅ Recherche et filtres
- ✅ Upload d'images
- ✅ Contact vendeur

## 📚 Documentation

- [Structure du projet](STRUCTURE_PROJET.md)
- [Guide d'installation](Documentation/SETUP.md)

## 🔄 Prochaines étapes (futures)

- [ ] Fonctionnalités IA (Vision, Pricing)
- [ ] IVR pour feature phones
- [ ] Notifications
- [ ] Géolocalisation
