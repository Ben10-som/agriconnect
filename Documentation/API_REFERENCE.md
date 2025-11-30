# 📚 Référence API - AgriConnect (Version Simplifiée)

## Base URL

```
http://localhost:8000
```

## Endpoints

### Produits

#### GET /products/
Récupérer tous les produits

**Query Parameters:**
- `limit` (int, optional): Nombre maximum de produits (défaut: 100)

**Response:**
```json
[
  {
    "id": "product_id",
    "productName": "Riz",
    "quantity": 50,
    "unit": "Sac",
    "price": 15000,
    "category": "céréales",
    "imageUrl": "https://...",
    "sellerId": "user_id",
    "sellerName": "Amadou Diallo",
    "sellerPhone": "+221771234567",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /products/{product_id}
Récupérer un produit par son ID

**Response:**
```json
{
  "id": "product_id",
  "productName": "Riz",
  "quantity": 50,
  "unit": "Sac",
  "price": 15000,
  "category": "céréales",
  "imageUrl": "https://...",
  "sellerId": "user_id",
  "sellerName": "Amadou Diallo",
  "sellerPhone": "+221771234567",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### POST /products/
Créer un nouveau produit

**Body:**
```json
{
  "productName": "Riz",
  "quantity": 50,
  "unit": "Sac",
  "price": 15000,
  "category": "céréales",
  "imageUrl": "https://...",
  "sellerId": "user_id",
  "sellerName": "Amadou Diallo",
  "sellerPhone": "+221771234567"
}
```

**Response:**
```json
{
  "id": "new_product_id",
  "productName": "Riz",
  "quantity": 50,
  "unit": "Sac",
  "price": 15000,
  "category": "céréales",
  "imageUrl": "https://...",
  "sellerId": "user_id",
  "sellerName": "Amadou Diallo",
  "sellerPhone": "+221771234567",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Autres endpoints

#### GET /
Informations sur l'API

**Response:**
```json
{
  "message": "AgriConnect API",
  "version": "1.0.0",
  "docs": "/docs"
}
```

#### GET /health
Health check

**Response:**
```json
{
  "status": "healthy"
}
```

## Codes de statut

- `200`: Succès
- `400`: Requête invalide
- `404`: Ressource non trouvée
- `500`: Erreur serveur

## Documentation interactive

Accédez à la documentation interactive Swagger sur :
```
http://localhost:8000/docs
```

