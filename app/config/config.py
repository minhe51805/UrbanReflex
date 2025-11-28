"""
Author: Trần Tuấn Anh
Created at: 2025-11-19
Updated at: 2025-11-19
Description: Configuration file for UrbanReflex FastAPI application.
             Includes MongoDB connection, JWT settings, and database utilities.
"""
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure

# Load environment variables from .env file
load_dotenv()

# MongoDB configuration
MONGODB_URL = os.getenv("MONGODB_URL")

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Gemini API configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Web crawler configuration
WEBSITE_CRAWL_URL = os.getenv("WEBSITE_CRAWL_URL", "https://urbanreflex.example.com")

# Vector database configuration
VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "./data/vector_db")

# Pinecone configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "urbanreflex-help")

# Database client
client = AsyncIOMotorClient(MONGODB_URL)
db = client.urbanreflex_db

async def get_database():
    try:
        await client.admin.command('ping')
        return db
    except ConnectionFailure:
        raise Exception("Database connection failed")