# 🚀 Guide d'exécution - IZZI

## 📋 Étapes pour exécuter l'application

### ✅ Étape 1 : Vérifier les dépendances

Les dépendances sont déjà installées. Si vous avez des problèmes, réinstallez-les :

```bash
npm install
```

### ✅ Étape 2 : Configuration Firebase (IMPORTANT)

Avant de lancer l'application, configurez Firebase :

#### a) Activer Firestore Database

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet `agriconnect-9ee31`
3. Cliquez sur **Firestore Database** dans le menu de gauche
4. Si pas encore créé, cliquez sur **Créer une base de données**
5. Choisissez le mode **Test** (pour le développement)

#### b) Activer Authentication

1. Dans Firebase Console, cliquez sur **Authentication**
2. Cliquez sur **Commencer**
3. Activez **Email/Password** dans les méthodes de connexion

#### c) Configurer les règles de sécurité Firestore

Dans Firestore Database → **Règles**, collez ce code :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /annonces/{annonceId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.resource.data.createdBy.uid == request.auth.uid;
    }
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.buyerUid == request.auth.uid || 
         resource.data.sellerUid == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.buyerUid == request.auth.uid || 
         resource.data.sellerUid == request.auth.uid);
    }
    match /messages/{messageId} {
      allow read: if request.auth != null && 
        (resource.data.senderUid == request.auth.uid || 
         resource.data.recipientUid == request.auth.uid);
      allow create: if request.auth != null;
    }
  }
}
```

Cliquez sur **Publier** pour sauvegarder les règles.

#### d) Créer les index Firestore (Recommandé)

Dans Firestore Database → **Index**, créez ces index composés :

1. **Collection: `messages`**
   - Champs: `orderId` (Ascending) + `createdAt` (Ascending)

2. **Collection: `messages`**
   - Champs: `recipientUid` (Ascending) + `read` (Ascending) + `createdAt` (Descending)

3. **Collection: `orders`**
   - Champs: `buyerUid` (Ascending) + `createdAt` (Descending)

4. **Collection: `orders`**
   - Champs: `sellerUid` (Ascending) + `createdAt` (Descending)

### ✅ Étape 3 : Lancer l'application

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm run dev
```

**L'application sera accessible sur : http://localhost:5173**

### ✅ Étape 4 : Ouvrir dans le navigateur

1. Ouvrez votre navigateur (Chrome, Firefox, Edge)
2. Allez sur : **http://localhost:5173**
3. L'application IZZI devrait s'afficher !

## 🧪 Tester l'application

### Test complet du flux :

1. **Créer un compte agriculteur**
   - Cliquez sur "Se connecter" dans la navigation
   - Créez un compte avec le rôle "Agriculteur"
   - Sélectionnez une région (ex: Dakar)
   - Ajoutez des points de relais (ex: "Marché Central")

2. **Publier une annonce**
   - Cliquez sur "Publier" dans la navigation
   - Remplissez le formulaire (produit, quantité, prix, téléphone)
   - Sélectionnez les régions (optionnel)
   - Cliquez sur "Payer et publier mon annonce"
   - Effectuez le paiement (250 FCFA - simulation)
   - L'annonce est publiée !

3. **Créer un compte acheteur**
   - Déconnectez-vous
   - Créez un nouveau compte avec le rôle "Acheteur"
   - Sélectionnez votre région (ex: Dakar)

4. **Passer une commande**
   - Parcourez les annonces sur la page d'accueil
   - Cliquez sur "Commander" sur une annonce
   - Sélectionnez la quantité
   - Choisissez une région et un point de relais (optionnel)
   - Créez la commande
   - L'agriculteur reçoit un SMS (simulation)

5. **Valider la commande (agriculteur)**
   - Connectez-vous en tant qu'agriculteur
   - Allez dans "Mes commandes"
   - Validez la commande
   - L'acheteur peut maintenant payer

6. **Tester le compte**
   - Cliquez sur votre nom dans la navigation → "Mon compte"
   - Modifiez vos informations
   - Enregistrez les modifications

## 📱 Fonctionnalités disponibles

✅ Navigation professionnelle avec menu compte  
✅ Publication d'annonces avec paiement (250 FCFA)  
✅ Système de commandes avec validation  
✅ Messagerie entre acheteur et agriculteur  
✅ Notifications en temps réel  
✅ Points de relais par région  
✅ Filtrage géographique  
✅ Appel direct depuis les annonces  
✅ Gestion du profil utilisateur  

## 🛠️ Commandes utiles

```bash
# Lancer en mode développement
npm run dev

# Créer une version de production
npm run build

# Prévisualiser la version de production
npm run preview
```

## ⚠️ Notes importantes

- **SMS** : Actuellement en simulation (voir `src/services/smsService.js`)
- **Paiement** : Actuellement en simulation (voir `src/services/paymentService.js`)
- Pour la production, intégrez des services réels :
  - Orange Money API pour le paiement
  - Twilio ou Orange SMS API pour les SMS

## 🐛 Résolution de problèmes

### Erreur "Firebase n'est pas initialisé"
→ Vérifiez que Firestore Database est activé dans Firebase Console

### Erreur "Permission denied"
→ Vérifiez que les règles de sécurité Firestore sont correctement configurées

### Les notifications ne fonctionnent pas
→ Créez les index Firestore requis (voir étape 2d)

### Le serveur ne démarre pas
→ Vérifiez que le port 5173 n'est pas déjà utilisé
→ Essayez de redémarrer avec `npm run dev`

### Les images ne s'affichent pas
→ Vérifiez que les fichiers sont dans `public/images/`
→ Vérifiez la console du navigateur pour les erreurs

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez la console du terminal
3. Vérifiez que Firebase est correctement configuré

