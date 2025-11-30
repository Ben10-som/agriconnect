"""
Modèles de données pour les produits
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProductBase(BaseModel):
    """Modèle de base pour un produit"""
    productName: str = Field(..., description="Nom du produit")
    quantity: float = Field(..., gt=0, description="Quantité disponible")
    unit: str = Field(..., description="Unité (Sac, Kg, Tonnes)")
    price: float = Field(..., gt=0, description="Prix en FCFA")
    category: Optional[str] = Field(None, description="Catégorie du produit")


class ProductCreate(ProductBase):
    """Modèle pour créer un produit"""
    imageUrl: Optional[str] = Field(None, description="URL de l'image")
    sellerId: Optional[str] = Field(None, description="ID du vendeur")
    sellerName: Optional[str] = Field(None, description="Nom du vendeur")
    sellerPhone: Optional[str] = Field(None, description="Téléphone du vendeur")


class Product(ProductCreate):
    """Modèle complet d'un produit"""
    id: Optional[str] = Field(None, description="ID du document Firestore")
    createdAt: Optional[datetime] = Field(None, description="Date de création")

    class Config:
        from_attributes = True

