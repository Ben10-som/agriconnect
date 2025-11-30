# 🌱 Guide : Créer des utilisateurs et produits fictifs

## 🚀 Utilisation rapide

```bash
cd frontend
npm run seed
```

C'est tout ! Le script va :
- ✅ Créer 8 utilisateurs fictifs
- ✅ Créer leurs publications (produits)
- ✅ Tout sauvegarder dans Firebase

## 📋 Utilisateurs créés

| Nom | Téléphone | Produits |
|-----|-----------|----------|
| Amadou Diallo | +221771234567 | Riz, Mil, Arachide |
| Fatou Sarr | +221772345678 | Tomate, Oignon, Pomme de terre |
| Ibrahima Ba | +221773456789 | Mangue, Banane, Orange |
| Aissatou Ndiaye | +221774567890 | Maïs, Sorgho |
| Moussa Diop | +221775678901 | Haricot, Niébé, Sésame |
| Mariama Fall | +221776789012 | Pastèque, Melon |
| Ousmane Sy | +221777890123 | Riz, Arachide |
| Khadija Kane | +221778901234 | Carotte, Chou, Aubergine |

## 🔑 Connexion

**Mot de passe pour tous :** `password123`

**Exemple de connexion :**
- Numéro : `+221771234567` ou `221771234567` ou `771234567`
- Mot de passe : `password123`

## ⚠️ Important

1. **Firebase Authentication doit être activé** (Email/Password)
2. Si un utilisateur existe déjà, le script passera au suivant
3. Le script peut prendre 1-2 minutes pour tout créer

## 🔄 Réexécuter le script

Si vous voulez créer à nouveau les utilisateurs :
- Les utilisateurs existants seront ignorés (pas d'erreur)
- Seuls les nouveaux utilisateurs seront créés

## 📝 Personnaliser

Modifiez le fichier `scripts/seed-data.js` pour :
- Ajouter plus d'utilisateurs
- Changer les produits
- Modifier les prix
- Ajouter des catégories

## ✅ Vérification

Après l'exécution :
1. Allez sur votre application
2. Vous devriez voir tous les produits sur la page d'accueil
3. Connectez-vous avec n'importe quel utilisateur pour voir ses produits


