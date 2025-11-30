# 🔧 Guide : Activer Firebase Authentication

## ⚠️ Erreur : auth/configuration-not-found

Cette erreur signifie que **Firebase Authentication n'est pas activé** dans votre projet Firebase.

## 📋 Étapes pour activer Firebase Authentication

### Étape 1 : Accéder à Firebase Console

1. Allez sur [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Connectez-vous avec votre compte Google
3. Sélectionnez votre projet : **agriconnect-9ee31**

### Étape 2 : Activer Authentication

1. Dans le menu de gauche, cherchez **"Authentication"** ou **"Authentification"**
2. Cliquez dessus
3. Si c'est la première fois, vous verrez un écran "Get started" → Cliquez sur **"Get started"**

### Étape 3 : Activer Email/Password

1. Une fois dans Authentication, vous verrez l'onglet **"Sign-in method"** ou **"Méthodes de connexion"**
2. Cliquez sur **"Email/Password"** dans la liste
3. Vous verrez deux options :
   - **Email/Password** (première option)
   - **Email link (passwordless sign-in)** (deuxième option)
4. **Activez la PREMIÈRE option** (Email/Password) en cliquant sur le toggle
5. **Laissez la deuxième option désactivée** pour l'instant
6. Cliquez sur **"Save"** ou **"Enregistrer"**

### Étape 4 : Vérifier l'activation

Vous devriez voir :
- ✅ Email/Password avec un statut "Enabled" (Activé)
- Une liste d'utilisateurs (vide pour l'instant)

### Étape 5 : Tester à nouveau

1. Retournez sur votre application
2. Rafraîchissez la page (F5)
3. Essayez de créer un compte à nouveau

## 🎯 Résumé visuel

```
Firebase Console
  └─ agriconnect-9ee31
      └─ Authentication (menu gauche)
          └─ Sign-in method (onglet)
              └─ Email/Password
                  └─ [Toggle ON] Email/Password
                      └─ Save
```

## ❓ Problèmes courants

### "Je ne vois pas Authentication dans le menu"
- Vérifiez que vous êtes bien dans le bon projet Firebase
- Le projet doit être : **agriconnect-9ee31**

### "Le toggle ne s'active pas"
- Assurez-vous d'avoir les permissions d'administrateur sur le projet
- Essayez de rafraîchir la page Firebase Console

### "J'ai activé mais l'erreur persiste"
1. Attendez 1-2 minutes (la propagation peut prendre du temps)
2. Videz le cache du navigateur (Ctrl+Shift+Delete)
3. Redémarrez le serveur de développement :
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   # Puis relancez
   npm run dev
   ```

## ✅ Vérification finale

Pour vérifier que tout est bien configuré :

1. Firebase Console → Authentication → Sign-in method
2. Vous devriez voir : **Email/Password** avec le statut **Enabled** (Activé)
3. Dans votre application, l'erreur `auth/configuration-not-found` ne devrait plus apparaître

## 📞 Besoin d'aide ?

Si le problème persiste après avoir suivi ces étapes :
1. Vérifiez la console du navigateur (F12) pour voir l'erreur exacte
2. Vérifiez que vous avez bien activé Email/Password (pas Email link)
3. Attendez quelques minutes et réessayez


