"""
Routes API pour les produits
"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.product import Product, ProductCreate
from app.services.firebase_service import FirebaseService

router = APIRouter(prefix="/products", tags=["products"])
firebase_service = FirebaseService()


@router.get("/", response_model=List[Product])
async def get_products(limit: int = 100):
    """
    Récupérer tous les produits
    """
    try:
        products = await firebase_service.get_all_products(limit=limit)
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """
    Récupérer un produit par son ID
    """
    try:
        product = await firebase_service.get_product(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Produit non trouvé")
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=Product)
async def create_product(product: ProductCreate):
    """
    Créer un nouveau produit
    """
    try:
        product_data = product.dict()
        product_id = await firebase_service.create_product(product_data)
        product_data['id'] = product_id
        return product_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


