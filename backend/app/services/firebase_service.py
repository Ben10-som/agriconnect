"""
Service Firebase pour Firestore et Storage
"""
import firebase_admin
from firebase_admin import credentials, firestore, storage
import os
from app.config import FIREBASE_CREDENTIALS_PATH, FIREBASE_PROJECT_ID

# Initialiser Firebase Admin SDK
if not firebase_admin._apps:
    if os.path.exists(FIREBASE_CREDENTIALS_PATH):
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred, {
            'projectId': FIREBASE_PROJECT_ID,
            'storageBucket': f'{FIREBASE_PROJECT_ID}.appspot.com'
        })
    else:
        # Utiliser les credentials par défaut (pour le développement)
        firebase_admin.initialize_app()

# Initialiser les services
db = firestore.client()
bucket = storage.bucket() if storage else None


class FirebaseService:
    """Service pour interagir avec Firebase"""
    
    @staticmethod
    async def create_product(product_data: dict) -> str:
        """
        Créer un produit dans Firestore
        """
        doc_ref = db.collection('products').document()
        doc_ref.set(product_data)
        return doc_ref.id
    
    @staticmethod
    async def get_product(product_id: str) -> dict:
        """
        Récupérer un produit par son ID
        """
        doc_ref = db.collection('products').document(product_id)
        doc = doc_ref.get()
        if doc.exists:
            return {**doc.to_dict(), 'id': doc.id}
        return None
    
    @staticmethod
    async def get_all_products(limit: int = 100) -> list:
        """
        Récupérer tous les produits
        """
        products_ref = db.collection('products')
        docs = products_ref.order_by('createdAt', direction=firestore.Query.DESCENDING).limit(limit).stream()
        return [{**doc.to_dict(), 'id': doc.id} for doc in docs]
    
    @staticmethod
    async def upload_image(file_content: bytes, file_name: str, user_id: str) -> str:
        """
        Uploader une image vers Firebase Storage
        """
        if not bucket:
            raise Exception("Firebase Storage n'est pas configuré")
        
        blob = bucket.blob(f'products/{user_id}/{file_name}')
        blob.upload_from_string(file_content, content_type='image/jpeg')
        blob.make_public()
        return blob.public_url


