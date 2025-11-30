# Script de génération de données fictives

Ce script crée des utilisateurs fictifs et leurs publications dans Firebase.

## Utilisation

```bash
cd frontend
npm run seed
```

## Ce que fait le script

1. **Crée 8 utilisateurs fictifs** dans Firebase Authentication
2. **Sauvegarde leurs données** dans Firestore (collection `users`)
3. **Crée des produits fictifs** pour chaque utilisateur (collection `products`)

## Utilisateurs créés

- Amadou Diallo - Riz, Mil, Arachide
- Fatou Sarr - Tomate, Oignon, Pomme de terre
- Ibrahima Ba - Mangue, Banane, Orange
- Aissatou Ndiaye - Maïs, Sorgho
- Moussa Diop - Haricot, Niébé, Sésame
- Mariama Fall - Pastèque, Melon
- Ousmane Sy - Riz, Arachide
- Khadija Kane - Carotte, Chou, Aubergine

## Informations de connexion

Tous les utilisateurs ont le même mot de passe : `password123`

Le numéro de téléphone sert d'identifiant pour la connexion.

## Note

Si un utilisateur existe déjà, le script passera au suivant sans erreur.

## Personnalisation

Vous pouvez modifier le fichier `seed-data.js` pour :
- Ajouter plus d'utilisateurs
- Changer les produits
- Modifier les prix et quantités
- Ajouter d'autres catégories


