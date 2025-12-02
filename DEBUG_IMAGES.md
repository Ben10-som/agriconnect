# Guide de débogage des images

## Vérifications à faire

### 1. Vérifier que les fichiers existent
Les fichiers doivent être dans `public/images/` avec les noms exacts :
- ✅ `oignon.jpeg`
- ✅ `tomate.jpg` (note: .jpg, pas .jpeg)
- ❌ `mil.jpeg` (MANQUANT - vous devez l'ajouter)
- ✅ `arachide.jpeg`
- ✅ `manioc.jpeg`
- ✅ `mangue.jpeg`
- ✅ `bissap.jpeg`
- ✅ `pasthèque.jpeg` (sans accent dans le nom de fichier)

### 2. Vérifier dans la console du navigateur
1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet **Console**
3. Regardez les messages d'erreur concernant les images
4. Allez dans l'onglet **Network** (Réseau)
5. Filtrez par "Img" ou "images"
6. Vérifiez si les requêtes d'images échouent (statut 404)

### 3. Tester directement l'URL
Dans votre navigateur, essayez d'accéder directement à :
- `http://localhost:5173/images/oignon.jpeg`
- `http://localhost:5173/images/tomate.jpg`

Si ces URLs ne fonctionnent pas, le problème vient de Vite.

### 4. Redémarrer le serveur de développement
Parfois, Vite ne détecte pas les nouveaux fichiers. Redémarrez :
```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez
npm run dev
```

### 5. Vérifier la casse des noms de fichiers
Sur Windows, les noms de fichiers ne sont pas sensibles à la casse, mais sur Linux/Mac oui.
Assurez-vous que les noms correspondent exactement.

## Solutions

### Si les images ne s'affichent toujours pas :

1. **Vérifiez que le serveur tourne sur le bon port**
   - Par défaut : `http://localhost:5173`

2. **Videz le cache du navigateur**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

3. **Vérifiez les permissions des fichiers**
   - Les fichiers doivent être lisibles

4. **Utilisez les images externes temporairement**
   - Dans `src/data/produits.js`, changez :
   ```javascript
   return produitData.image; // au lieu de imageLocal
   ```

## Fichiers manquants

Vous devez ajouter :
- `mil.jpeg` dans `public/images/`





