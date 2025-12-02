# Guide de débogage - Publication d'annonces

## Problème : Le formulaire tourne mais rien n'est publié

### Étapes de débogage

#### 1. Ouvrir la console du navigateur
1. Appuyez sur **F12** pour ouvrir les outils de développement
2. Allez dans l'onglet **Console**
3. Essayez de publier une annonce
4. Regardez les messages dans la console

#### 2. Messages à surveiller

**Si vous voyez :**
- ✅ `Firebase initialisé avec succès` = Firebase fonctionne
- ✅ `📤 Tentative d'ajout d'annonce` = La fonction est appelée
- ✅ `📤 Données à sauvegarder` = Les données sont prêtes
- ✅ `✅ Annonce ajoutée avec succès` = La publication a réussi
- ❌ `❌ Erreur lors de l'ajout de l'annonce` = Problème à résoudre

#### 3. Erreurs courantes

##### Erreur "permission-denied"
**Cause :** Les règles de sécurité Firestore ne permettent pas l'écriture

**Solution :**
1. Allez dans Firebase Console > Firestore Database > Règles
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
3. Cliquez sur **Publier**

##### Erreur "Firebase n'est pas initialisé"
**Cause :** Problème de configuration Firebase

**Solution :**
1. Vérifiez que `src/config/firebase.js` contient les bonnes clés
2. Vérifiez que Firestore est activé dans Firebase Console

##### Erreur "Storage n'est pas initialisé"
**Cause :** Firebase Storage n'est pas activé (mais ce n'est pas bloquant)

**Solution :**
- L'annonce sera publiée avec l'image par défaut
- Pour activer Storage, voir `FIREBASE_STORAGE_SETUP.md`

##### Le bouton reste en "Publication en cours..."
**Cause :** Une erreur s'est produite mais n'a pas été gérée

**Solution :**
1. Regardez la console pour voir l'erreur exacte
2. Rechargez la page (F5)
3. Réessayez

#### 4. Vérifier dans Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Allez dans **Firestore Database** > **Données**
4. Vérifiez si la collection `annonces` existe
5. Vérifiez si de nouveaux documents sont créés

#### 5. Test rapide

Ouvrez la console et tapez :
```javascript
// Vérifier si Firebase est initialisé
console.log('Firebase config:', window.firebase || 'Non détecté');
```

#### 6. Vérifications à faire

- [ ] Firestore est activé dans Firebase Console
- [ ] Les règles de sécurité permettent l'écriture
- [ ] La configuration Firebase est correcte
- [ ] Vous êtes connecté à internet
- [ ] Aucune erreur dans la console du navigateur

## Solution rapide

Si rien ne fonctionne :

1. **Vérifiez Firestore :**
   - Firebase Console > Firestore Database
   - Si vous voyez "Créer une base de données", créez-la en mode "Test"

2. **Vérifiez les règles :**
   - Firestore Database > Règles
   - Assurez-vous que `allow read, write: if true;` est présent

3. **Rechargez la page :**
   - Appuyez sur F5
   - Réessayez de publier

4. **Vérifiez la console :**
   - F12 > Console
   - Copiez les messages d'erreur et partagez-les





