"""
Author: Trần Tuấn Anh
Created at: 2025-11-30
Updated at: 2025-11-30
Description: Configuration module for UrbanReflex.
             Reads configuration from environment variables.
"""

import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables
load_dotenv()

# Database configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "urbanreflex")

# Authentication configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# AI Service configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "urbanreflex-index")
WEBSITE_CRAWL_URL = os.getenv("WEBSITE_CRAWL_URL", "https://urbanreflex.vn")

# Database client
client = None
database = None

def get_database() -> AsyncIOMotorClient:
    """Get MongoDB database instance."""
    global client, database
    if client is None:
        client = AsyncIOMotorClient(MONGODB_URL)
        database = client[DATABASE_NAME]
    return database