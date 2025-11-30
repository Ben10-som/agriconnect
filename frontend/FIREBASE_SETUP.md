# Configuration Firebase pour AgriConnect

## Étapes de configuration

### 1. Activer Firebase Authentication

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet `agriconnect-9ee31`
3. Dans le menu de gauche, cliquez sur **Authentication**
4. Cliquez sur **Get Started**
5. Activez **Email/Password** comme méthode de connexion
   - Cliquez sur "Email/Password"
   - Activez "Email/Password" (premier toggle)
   - Cliquez sur "Save"

### 2. Configurer Firestore Database

1. Dans le menu de gauche, cliquez sur **Firestore Database**
2. Cliquez sur **Create database**
3. Choisissez **Start in test mode** (pour le développement)
4. Sélectionnez une localisation (choisissez la plus proche du Sénégal)
5. Cliquez sur **Enable**

### 3. Configurer Firebase Storage

1. Dans le menu de gauche, cliquez sur **Storage**
2. Cliquez sur **Get started**
3. Acceptez les règles par défaut (test mode)
4. Choisissez la même localisation que Firestore
5. Cliquez sur **Done**

### 4. Règles de sécurité Firestore (à configurer plus tard)

Pour la production, vous devrez mettre à jour les règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture à tous
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Permettre la lecture/écriture des données utilisateur
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Règles de sécurité Storage (à configurer plus tard)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Structure des collections Firestore

### Collection `users`
```
users/{userId}
  - name: string
  - phone: string
  - email: string
  - createdAt: timestamp
```

### Collection `products`
```
products/{productId}
  - productName: string
  - quantity: number
  - unit: string (Sac, Kg, Tonnes)
  - price: number
  - imageUrl: string
  - sellerId: string
  - sellerName: string
  - sellerPhone: string
  - createdAt: timestamp
  - category: string
```

## Test rapide

1. Créez un compte via l'interface web
2. Connectez-vous
3. Publiez un produit avec une image
4. Vérifiez dans Firestore que le produit apparaît
5. Vérifiez dans Storage que l'image est uploadée


