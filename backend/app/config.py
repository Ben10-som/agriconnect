"""
Configuration globale de l'application
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration Firebase
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "agriconnect-9ee31")

# Configuration API
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
API_DEBUG = os.getenv("API_DEBUG", "False").lower() == "true"

# Configuration CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

