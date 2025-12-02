# Guide de dépannage Firebase

## Vérifications à faire si les données ne sont pas sauvegardées

### 1. Vérifier que Firestore est activé

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet `agriconnect-9ee31`
3. Dans le menu de gauche, cliquez sur **"Firestore Database"**
4. Si vous voyez "Créer une base de données", cliquez dessus
5. Choisissez le mode **"Test"** pour commencer
6. Sélectionnez une région (ex: `europe-west` ou `us-central`)

### 2. Vérifier les règles de sécurité Firestore

1. Dans Firestore Database, allez dans l'onglet **"Règles"**
2. Assurez-vous que les règles sont en mode test :
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
3. Cliquez sur **"Publier"**

### 3. Vérifier la console du navigateur

1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet **"Console"**
3. Essayez de publier une annonce
4. Regardez les messages :
   - ✅ `Firebase initialisé avec succès` = Firebase fonctionne
   - ✅ `Annonce ajoutée avec succès` = La sauvegarde fonctionne
   - ❌ `permission-denied` = Problème de règles de sécurité
   - ❌ `Firestore n'est pas disponible` = Problème de connexion ou Firestore non activé

### 4. Vérifier dans Firebase Console

1. Allez dans **Firestore Database** > **Données**
2. Vous devriez voir une collection nommée **"annonces"**
3. Si la collection existe et contient des documents, Firebase fonctionne !

### 5. Problèmes courants

#### Erreur "permission-denied"
- **Solution** : Vérifiez les règles Firestore (étape 2)

#### Erreur "index missing"
- **Solution** : Cliquez sur le lien dans l'erreur pour créer l'index automatiquement

#### Aucune erreur mais rien ne s'affiche
- **Solution** : Vérifiez que Firestore est bien activé (étape 1)

#### Firebase n'est pas initialisé
- **Solution** : Vérifiez que `src/config/firebase.js` contient les bonnes clés

### 6. Test rapide

Ouvrez la console du navigateur et tapez :
```javascript
// Vérifier si Firebase est initialisé
console.log(window.firebase || 'Firebase non détecté');
```

### 7. Réinitialiser si nécessaire

Si rien ne fonctionne :
1. Supprimez la collection "annonces" dans Firestore
2. Rechargez la page
3. Essayez de publier une nouvelle annonce
4. Vérifiez les logs dans la console

## Messages de log à surveiller

- `✅ Firebase initialisé avec succès` = Tout va bien
- `📤 Tentative d'ajout d'annonce` = La fonction est appelée
- `✅ Annonce ajoutée avec succès` = Sauvegarde réussie
- `❌ Erreur lors de l'ajout` = Problème à résoudre





