# 🚀 Démarrage Rapide - AgriConnect

## ✅ Vérifications préalables

- ✅ Node.js installé
- ✅ Dépendances installées (`node_modules` présent)
- ✅ Firebase configuré (`src/config/firebase.js`)

## 🎯 Étapes pour lancer l'application

### 1. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:5173**

### 2. Configuration Firebase (si pas déjà fait)

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet `agriconnect-9ee31`
3. Activez **Firestore Database** (si pas déjà fait)
4. Activez **Authentication** → Méthode de connexion → Email/Password

### 3. Règles de sécurité Firestore

Dans Firebase Console → Firestore Database → Règles, collez :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Collection annonces
    match /annonces/{annonceId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.resource.data.createdBy.uid == request.auth.uid;
    }
    
    // Collection orders
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.buyerUid == request.auth.uid || 
         resource.data.sellerUid == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.buyerUid == request.auth.uid || 
         resource.data.sellerUid == request.auth.uid);
    }
    
    // Collection messages
    match /messages/{messageId} {
      allow read: if request.auth != null && 
        (resource.data.senderUid == request.auth.uid || 
         resource.data.recipientUid == request.auth.uid);
      allow create: if request.auth != null;
    }
  }
}
```

### 4. Créer les index Firestore (optionnel mais recommandé)

Dans Firebase Console → Firestore Database → Index :

1. **Collection: messages**
   - Champs: `orderId` (Asc), `createdAt` (Asc)

2. **Collection: messages**
   - Champs: `recipientUid` (Asc), `read` (Asc), `createdAt` (Desc)

3. **Collection: orders**
   - Champs: `buyerUid` (Asc), `createdAt` (Desc)

4. **Collection: orders**
   - Champs: `sellerUid` (Asc), `createdAt` (Desc)

## 🧪 Tester l'application

1. **Créer un compte agriculteur**
   - Cliquez sur "Se connecter / Créer un compte"
   - Rôle: Agriculteur
   - Sélectionnez une région
   - Ajoutez des points de relais

2. **Publier une annonce**
   - Connectez-vous
   - "Publier une annonce"
   - Remplissez le formulaire
   - Sélectionnez les régions avec points de relais

3. **Créer un compte acheteur**
   - Nouveau compte, rôle: Acheteur
   - Sélectionnez votre région

4. **Passer une commande**
   - Parcourez les annonces
   - "Commander" → Sélectionnez région et point de relais
   - Créez la commande (SMS simulé envoyé)
   - Procédez au paiement (simulé)

5. **Valider la commande (agriculteur)**
   - "Mes commandes"
   - Validez la commande
   - L'acheteur reçoit une notification

## 📦 Build pour production

```bash
npm run build
```

Les fichiers seront dans `dist/`

## ⚠️ Notes importantes

- **SMS** : Actuellement en simulation (voir `src/services/smsService.js`)
- **Paiement** : Actuellement en simulation (voir `src/services/paymentService.js`)
- Pour la production, intégrez des services réels (Orange Money, Twilio, etc.)

## 🐛 Problèmes courants

**Erreur Firebase** : Vérifiez que Firestore et Authentication sont activés

**Permission denied** : Vérifiez les règles de sécurité Firestore

**Notifications ne fonctionnent pas** : Créez les index Firestore requis

