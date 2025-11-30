# 🚀 Guide d'installation - AgriConnect

## Prérequis

- Node.js 18+ et npm
- Python 3.9+
- Compte Firebase
- Clé API OpenAI (pour les fonctionnalités IA)

## Installation Backend

```bash
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
cp .env.example .env
# Éditer .env avec vos configurations

# Obtenir les credentials Firebase
# Télécharger firebase-credentials.json depuis Firebase Console
# Placer le fichier dans le dossier backend/
```

## Installation Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
# Éditer .env avec vos configurations
```

## Configuration Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un projet ou utilisez un projet existant
3. Activez :
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
4. Téléchargez les credentials (Service Account)
5. Placez le fichier dans `backend/firebase-credentials.json`

## Démarrage

### Backend

```bash
cd backend
uvicorn app.main:app --reload
```

L'API sera accessible sur http://localhost:8000
Documentation API : http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Vérification

1. Backend : http://localhost:8000/health
2. Frontend : http://localhost:3000
3. API Docs : http://localhost:8000/docs


