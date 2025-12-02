# Configuration Firebase Storage

## Activation de Firebase Storage

Pour que l'upload d'images fonctionne, vous devez activer Firebase Storage :

### 1. Activer Storage dans Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet `agriconnect-9ee31`
3. Dans le menu de gauche, cliquez sur **"Storage"**
4. Cliquez sur **"Commencer"** ou **"Get started"**
5. Choisissez le mode **"Test"** pour commencer
6. Sélectionnez la même région que Firestore (ex: `europe-west`)

### 2. Configurer les règles de sécurité Storage

Dans l'onglet **"Règles"** de Storage, configurez les règles en mode test :

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /annonces/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

Cliquez sur **"Publier"** pour sauvegarder les règles.

### 3. Vérifier la configuration

Une fois Storage activé, l'upload d'images devrait fonctionner automatiquement.

## Utilisation

1. **Avec image uploadée** :
   - L'utilisateur peut uploader une image personnalisée
   - L'image est stockée dans Firebase Storage
   - L'URL de l'image est sauvegardée dans Firestore

2. **Sans image uploadée** :
   - L'image par défaut du produit est utilisée automatiquement
   - Aucune action nécessaire

## Limites

- Taille maximale : 5MB par image
- Formats acceptés : JPG, PNG, GIF, WebP
- Les images sont organisées dans le dossier `annonces/` dans Storage





