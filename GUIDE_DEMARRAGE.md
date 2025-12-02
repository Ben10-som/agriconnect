# 🚀 Guide de démarrage - AgriConnect

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** (version 16 ou supérieure) - [Télécharger Node.js](https://nodejs.org/)
- **npm** (généralement inclus avec Node.js)

## 🔧 Étapes d'installation et d'exécution

### 1. Installer les dépendances

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install
```

Cette commande installera toutes les dépendances nécessaires (React, Firebase, Tailwind CSS, etc.)

### 2. Vérifier la configuration Firebase

Le fichier `src/config/firebase.js` contient déjà votre configuration Firebase. Assurez-vous que :
- ✅ Firestore Database est activé dans votre projet Firebase
- ✅ Authentication est activé (Email/Password)

**Configuration Firestore :**

Allez sur [Firebase Console](https://console.firebase.google.com/) → Votre projet → Firestore Database

**Règles de sécurité (pour le développement) :**

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

**Index Firestore requis :**

Créez ces index composés dans Firestore :

1. **Collection: messages**
   - `orderId` (Ascending) + `createdAt` (Ascending)

2. **Collection: messages**
   - `recipientUid` (Ascending) + `read` (Ascending) + `createdAt` (Descending)

3. **Collection: orders**
   - `buyerUid` (Ascending) + `createdAt` (Descending)

4. **Collection: orders**
   - `sellerUid` (Ascending) + `createdAt` (Descending)

### 3. Lancer l'application en mode développement

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:5173**

### 4. Tester l'application

1. **Créer un compte agriculteur :**
   - Cliquez sur "Se connecter / Créer un compte"
   - Sélectionnez "Agriculteur"
   - Remplissez le formulaire (nom, email, téléphone, région)
   - Ajoutez des points de relais par région

2. **Publier une annonce :**
   - Connectez-vous en tant qu'agriculteur
   - Cliquez sur "Publier une annonce"
   - Remplissez le formulaire et sélectionnez les régions avec points de relais

3. **Créer un compte acheteur :**
   - Créez un nouveau compte avec le rôle "Acheteur"
   - Sélectionnez votre région

4. **Passer une commande :**
   - Parcourez les annonces (les produits de votre région apparaissent en premier)
   - Cliquez sur "Commander"
   - Sélectionnez la quantité, la région et le point de relais
   - Créez la commande (SMS envoyé à l'agriculteur)
   - Procédez au paiement

5. **Valider une commande (agriculteur) :**
   - Allez dans "Mes commandes"
   - Validez ou refusez la commande
   - L'acheteur recevra une notification

## 🏗️ Build pour la production

Pour créer une version optimisée de l'application :

```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/`

Pour prévisualiser la version de production :

```bash
npm run preview
```

## 📱 Déploiement

### Option 1 : Firebase Hosting (Recommandé)

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser Firebase Hosting
firebase init hosting

# Build et déployer
npm run build
firebase deploy --only hosting
```

### Option 2 : Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel
```

### Option 3 : Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Déployer
npm run build
netlify deploy --prod
```

## ⚠️ Notes importantes

### Services à configurer pour la production

1. **Service SMS :**
   - Actuellement en simulation dans `src/services/smsService.js`
   - Pour la production, intégrer :
     - Twilio (international)
     - Orange SMS API (Sénégal)
     - Un service SMS local

2. **Service de paiement :**
   - Actuellement en simulation dans `src/services/paymentService.js`
   - Pour la production, intégrer :
     - Orange Money API
     - PayDunya
     - Flutterwave
     - Wave

3. **Variables d'environnement :**
   - Créez un fichier `.env` pour stocker les clés API sensibles
   - Ne commitez jamais ce fichier dans Git

## 🐛 Résolution de problèmes

### Erreur "Firebase n'est pas initialisé"
- Vérifiez que Firestore est activé dans Firebase Console
- Vérifiez les règles de sécurité Firestore

### Erreur "Permission denied"
- Vérifiez que vous êtes connecté
- Vérifiez les règles de sécurité Firestore

### Les notifications ne fonctionnent pas
- Vérifiez que les index Firestore sont créés
- Vérifiez la console du navigateur pour les erreurs

### Le paiement ne fonctionne pas
- C'est normal, c'est en simulation
- Intégrez un service de paiement réel pour la production

## 📞 Support

Pour toute question ou problème, consultez :
- La documentation Firebase : https://firebase.google.com/docs
- La documentation React : https://react.dev
- La documentation Vite : https://vitejs.dev

