# 🔧 Vérifier les règles Firebase pour la publication

## ⚠️ Si la publication ne fonctionne pas

Vérifiez que les règles Firestore et Storage permettent l'écriture.

## 📋 Règles Firestore

### 1. Accéder aux règles

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Projet : **agriconnect-9ee31**
3. Menu gauche → **Firestore Database**
4. Onglet **"Rules"** (Règles)

### 2. Règles pour le développement (mode test)

Pour tester rapidement, utilisez ces règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **ATTENTION** : Ces règles permettent tout à tout le monde. Utilisez-les uniquement pour le développement.

### 3. Règles pour la production (recommandées)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection products
    match /products/{productId} {
      allow read: if true; // Tout le monde peut lire
      allow create: if request.auth != null; // Seuls les utilisateurs connectés peuvent créer
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.sellerId;
    }
    
    // Collection users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Appliquer les règles

1. Copiez les règles ci-dessus
2. Collez-les dans l'éditeur de règles
3. Cliquez sur **"Publish"** (Publier)

## 📦 Règles Storage

### 1. Accéder aux règles

1. Firebase Console → **Storage**
2. Onglet **"Rules"** (Règles)

### 2. Règles pour le développement

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. Règles pour la production

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{userId}/{allPaths=**} {
      allow read: if true; // Tout le monde peut lire les images
      allow write: if request.auth != null && request.auth.uid == userId; // Seul le propriétaire peut uploader
    }
  }
}
```

### 4. Appliquer les règles

1. Copiez les règles ci-dessus
2. Collez-les dans l'éditeur de règles
3. Cliquez sur **"Publish"** (Publier)

## ✅ Vérification

Après avoir mis à jour les règles :

1. Attendez 1-2 minutes (propagation)
2. Rafraîchissez votre application
3. Essayez de publier un produit
4. Ouvrez la console du navigateur (F12) pour voir les logs détaillés

## 🔍 Débogage

Si ça ne fonctionne toujours pas :

1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet **Console**
3. Essayez de publier un produit
4. Regardez les messages :
   - `📝 Début de la publication...`
   - `📤 Upload de l'image...` (si image fournie)
   - `💾 Sauvegarde du produit dans Firestore...`
   - `✅ Produit sauvegardé avec ID: ...`

5. Si vous voyez une erreur, notez le code d'erreur :
   - `permission-denied` → Règles Firestore/Storage trop restrictives
   - `unavailable` → Problème de connexion
   - `storage/unauthorized` → Règles Storage trop restrictives

## 🎯 Résumé

- ✅ Firestore doit permettre l'écriture aux utilisateurs connectés
- ✅ Storage doit permettre l'upload aux utilisateurs connectés
- ✅ Utilisez les règles de développement pour tester rapidement
- ✅ Passez aux règles de production une fois que tout fonctionne


