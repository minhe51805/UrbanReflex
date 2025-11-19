"""
Author: Trần Tuấn Anh
Created at: 2025-11-19
Updated at: 2025-11-19
Description: Configuration file for UrbanReflex FastAPI application.
             Includes MongoDB connection, JWT settings, and database utilities.
"""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure

# MongoDB configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://urbanreflex_admin:WAG_team_2025_secure@103.178.233.233:27017/urbanreflex_db?authSource=admin")

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database client
client = AsyncIOMotorClient(MONGODB_URL)
db = client.urbanreflex_db

async def get_database():
    try:
        await client.admin.command('ping')
        return db
    except ConnectionFailure:
        raise Exception("Database connection failed")