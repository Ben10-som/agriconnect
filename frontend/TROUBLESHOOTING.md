# Guide de dépannage - Erreurs de création de compte

## Vérifications à faire

### 1. Vérifier que Firebase Authentication est activé

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet `agriconnect-9ee31`
3. Cliquez sur **Authentication** dans le menu de gauche
4. Vérifiez que **Email/Password** est activé
   - Si ce n'est pas le cas :
     - Cliquez sur "Get started" ou sur l'onglet "Sign-in method"
     - Cliquez sur "Email/Password"
     - Activez le premier toggle (Email/Password)
     - Cliquez sur "Save"

### 2. Vérifier la console du navigateur

1. Ouvrez l'application dans votre navigateur
2. Appuyez sur **F12** pour ouvrir les outils de développement
3. Allez dans l'onglet **Console**
4. Essayez de créer un compte
5. Regardez les erreurs affichées dans la console

### 3. Erreurs courantes et solutions

#### ⚠️ Erreur: "auth/configuration-not-found" (IMPORTANT)
- **Cause**: Firebase Authentication n'est pas activé ou Email/Password n'est pas configuré
- **Solution**: 
  1. Allez sur [Firebase Console](https://console.firebase.google.com/)
  2. Projet `agriconnect-9ee31` → **Authentication**
  3. Onglet **"Sign-in method"** → Cliquez sur **"Email/Password"**
  4. Activez le toggle **"Email/Password"** (première option, pas la deuxième)
  5. Cliquez sur **"Save"**
  6. Attendez 1-2 minutes et rafraîchissez votre application
- **Guide détaillé**: Voir `ACTIVER_FIREBASE_AUTH.md`

#### Erreur: "auth/email-already-in-use"
- **Cause**: Le numéro de téléphone est déjà utilisé
- **Solution**: Utilisez un autre numéro ou connectez-vous

#### Erreur: "auth/invalid-email"
- **Cause**: Format de numéro de téléphone invalide
- **Solution**: Entrez le numéro au format: +221771234567 ou 221771234567

#### Erreur: "auth/weak-password"
- **Cause**: Mot de passe trop faible
- **Solution**: Utilisez au moins 6 caractères

#### Erreur: "auth/network-request-failed"
- **Cause**: Problème de connexion internet
- **Solution**: Vérifiez votre connexion internet

#### Erreur: "Firebase: Error (auth/operation-not-allowed)"
- **Cause**: Email/Password n'est pas activé dans Firebase
- **Solution**: Activez Email/Password dans Firebase Console (voir étape 1)

#### Erreur: "Permission denied" ou erreur Firestore
- **Cause**: Règles de sécurité Firestore trop restrictives
- **Solution**: Vérifiez que Firestore est en mode test ou que les règles permettent l'écriture

### 4. Tester avec la console

Ouvrez la console du navigateur (F12) et testez :

```javascript
// Vérifier que Firebase est bien initialisé
console.log('Firebase config:', {
  apiKey: 'AIzaSyDPJZfZjn-3yAsoehTvOPjBTPILm3aXosU',
  authDomain: 'agriconnect-9ee31.firebaseapp.com'
})
```

### 5. Vérifier les règles Firestore

Dans Firebase Console → Firestore Database → Rules, vérifiez que vous avez au minimum :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Mode test - à changer en production
    }
  }
}
```

### 6. Format du numéro de téléphone

Le numéro de téléphone peut être saisi dans différents formats :
- `+221771234567` ✅
- `221771234567` ✅
- `771234567` ✅
- `+221 77 123 45 67` ✅ (les espaces seront supprimés)

### 7. Test rapide

1. Ouvrez la console (F12)
2. Allez dans l'onglet "Network"
3. Filtrez par "identitytoolkit"
4. Essayez de créer un compte
5. Regardez la requête qui échoue et son statut

## Si le problème persiste

1. Vérifiez que vous avez bien installé les dépendances :
   ```bash
   cd frontend
   npm install
   ```

2. Vérifiez que le serveur de développement tourne :
   ```bash
   npm run dev
   ```

3. Videz le cache du navigateur (Ctrl+Shift+Delete)

4. Testez dans un autre navigateur ou en navigation privée

