"""
Point d'entrée FastAPI - Version simplifiée
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS, API_DEBUG
from app.api.routes import products

app = FastAPI(
    title="AgriConnect API",
    description="API pour connecter agriculteurs et acheteurs au Sénégal",
    version="1.0.0",
    debug=API_DEBUG
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(products.router)


@app.get("/")
async def root():
    """Endpoint racine"""
    return {
        "message": "AgriConnect API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy"}
