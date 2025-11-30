# ⚠️ Erreur NOT_FOUND - Vérifier Firestore

## 🔴 Problème

L'erreur `Code: 5 NOT_FOUND` signifie que **Firestore Database n'est pas créé** dans votre projet Firebase.

## ✅ Solution rapide

### Étape 1 : Accéder à Firebase Console

1. Allez sur [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Connectez-vous avec votre compte Google
3. Sélectionnez le projet : **agriconnect-9ee31**

### Étape 2 : Créer Firestore Database

1. Dans le menu de gauche, cherchez **"Firestore Database"** ou **"Base de données Firestore"**
2. Cliquez dessus
3. Si vous voyez un écran "Create database" ou "Créer une base de données" :
   - Cliquez sur **"Create database"** ou **"Créer une base de données"**
4. Choisissez le mode :
   - **"Start in test mode"** (pour le développement) ✅
   - Cliquez sur **"Next"**
5. Sélectionnez une localisation :
   - Choisissez la région la plus proche (ex: `europe-west` ou `us-central`)
   - Cliquez sur **"Enable"** ou **"Activer"**

### Étape 3 : Attendre la création

- La création peut prendre 1-2 minutes
- Vous verrez un message "Cloud Firestore is being set up"

### Étape 4 : Vérifier

Une fois créé, vous devriez voir :
- L'interface Firestore avec les collections
- Un message "Cloud Firestore is ready"

### Étape 5 : Réessayer le script

```bash
cd frontend
npm run seed
```

## 📋 Vérification complète

Assurez-vous que ces services sont activés dans Firebase Console :

- ✅ **Authentication** → Email/Password activé
- ✅ **Firestore Database** → Créé et actif
- ✅ **Storage** → Créé et actif (optionnel pour le script)

## 🎯 Résumé visuel

```
Firebase Console
  └─ agriconnect-9ee31
      └─ Firestore Database (menu gauche)
          └─ Create database
              └─ Start in test mode
                  └─ Choisir localisation
                      └─ Enable
```

## ❓ Si le problème persiste

1. Vérifiez que vous êtes bien dans le bon projet Firebase
2. Vérifiez que Firestore est bien créé (vous devriez voir l'interface)
3. Attendez 2-3 minutes après la création
4. Videz le cache et réessayez

## ✅ Après configuration

Une fois Firestore créé, le script devrait fonctionner sans erreur `NOT_FOUND`.


